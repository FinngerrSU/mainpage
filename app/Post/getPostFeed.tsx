import { graphql } from '@mysten/sui/graphql/schema';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { bcs } from "@mysten/sui/bcs";
import { SuiGraphQLClient } from '@mysten/sui/graphql';

const PACKAGE_ID = "0x0ce1729516456933aed62ff002752a32fcd87732e95913e064b6848419031c66";

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
export async function fetchBoardPosts(suiClient: SuiGrpcClient, graphqlClient: SuiGraphQLClient) {
    console.log("Scanning recent events for message board posts...");

    try {
        // 1. Fetch the last 50 PostCreatedEvents via GraphQL
        const data: any = await graphqlClient.query({
            query: querySuiEvents,
            variables: {
                module: PACKAGE_ID
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
            // 4. Decode the raw bytes using our schema
            const postData = PostSchema.parse(ob.contents.value);

            return {
                id: postId,
                author: postData.author,
                content: postData.content,
                imageUrl: postData.image_url || null, 
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