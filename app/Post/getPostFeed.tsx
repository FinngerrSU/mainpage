import { graphql } from '@mysten/sui/graphql/schema';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { bcs } from "@mysten/sui/bcs";
import { SuiGraphQLClient } from '@mysten/sui/graphql';



// 1. BCS Schema for the Post object
// Must match the Move struct exactly: id, author, content, image_url
const PostSchema = bcs.struct('Post', {
    id: bcs.Address, // UID is serialized as a 32-byte address
    author: bcs.Address,
    content: bcs.string(),
    // Option<String> translates to bcs.option()
    image_url: bcs.option(bcs.string()),
    timestamp_ms: bcs.u64(),
});

export const NewPostSchema = bcs.struct('NewPost', {
    id: bcs.Address,
    author: bcs.Address,
    content: bcs.string(),
    image_urls: bcs.vector(bcs.string()), // Vector format
    timestamp_ms: bcs.u64(),
});
// 2. GraphQL Query for the events
const querySuiEvents = graphql(`
  query getSuiEvents($module: String!) {
    events(
      filter: { module: $module }
      last: 50
    ) {
      nodes {
       
        contents{
        json
        }

      }
    }
  }
`);

const NEW_MULTI_IMAGE_PACKAGE_ID = '0xe9e5a221dfb37d98663a4699bdca58640b642996f50b8500e08c5e751095bfee';
export async function fetchBoardPosts(package_id: string, suiClient: SuiGrpcClient, graphqlClient: SuiGraphQLClient) {
    console.log("Scanning recent events for message board posts...");
    const isNewPackage = package_id === NEW_MULTI_IMAGE_PACKAGE_ID;
    const currentSchema = isNewPackage ? NewPostSchema : PostSchema;
    try {
        // 1. Fetch the last 50 PostCreatedEvents via GraphQL
        const data: any = await graphqlClient.query({
            query: querySuiEvents,
            variables: {
                module: package_id
            }
        });

        const nodes = data.data?.events?.nodes || [];
        if (nodes.length === 0) return [];

        // 2. Extract Unique Post IDs (newer posts first)
        const postIds = new Set<string>();

        for (const event of nodes) {
            const eventJson = event.contents?.json as any;
            if (eventJson && eventJson.post_id) {
                postIds.add(eventJson.post_id);
            }
        }

        const selectedIds = Array.from(postIds);

        // 3. Fetch actual Post objects using gRPC & BCS parser
        const rawPosts = await Promise.all(selectedIds.map(async (postId) => {
            try {
                // We moved the network call INSIDE a try/catch block
                const objectResponse = suiClient.ledgerService.getObject({
                    objectId: postId,
                    readMask: { paths: ['contents'] }
                });

                const call = await objectResponse.response;
                const ob = call.object;

                if (ob?.contents?.value) {
                    // 2. Decode using the correct schema dynamically
                    const postData = currentSchema.parse(ob.contents.value);

                    // 3. Normalize the images into a single standard format (an array)
                    let normalizedImageUrls: string[] = [];

                    if ('image_urls' in postData) {
                        // TypeScript now knows this is the New package format
                        normalizedImageUrls = postData.image_urls;
                    } else if ('image_url' in postData) {
                        // TypeScript now knows this is the Old package format
                        normalizedImageUrls = postData.image_url ? [postData.image_url] : [];
                    }
                    return {
                        id: postId,
                        author: postData.author,
                        content: postData.content,
                        imageUrls: normalizedImageUrls, // <-- Replaced 'imageUrl' with unified 'imageUrls'
                        timestamp: Number(postData.timestamp_ms)
                    };
                }
                return null;

            } catch (err: any) {
                // Catch the specific "not found" error and fail gracefully

                return null;
            }
        }));

        // Filter out any failed parses or deleted posts
        const validPosts = rawPosts.filter((post) => post !== null);
        return validPosts.sort((a, b) => b!.timestamp - a!.timestamp);
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }
}