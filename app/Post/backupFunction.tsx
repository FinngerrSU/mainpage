// export async function fetchBoardPosts(suiClient: SuiGrpcClient, graphqlClient: SuiGraphQLClient) {
//     console.log("Scanning blockchain for valid message board posts...");

//     const TARGET_POSTS = 20; // How many valid posts we want to guarantee
//     const MAX_ATTEMPTS = 5;  // Safety switch to prevent infinite loops if the network is empty

//     let validPostsBucket: any[] = [];
//     let currentCursor: string | null | undefined = null;
//     let hasMoreEvents = true;
//     let attempts = 0;

//     try {
//         // Loop until we have enough posts, run out of events, or hit our safety limit
//         while (validPostsBucket.length < TARGET_POSTS && hasMoreEvents && attempts < MAX_ATTEMPTS) {
//             attempts++;
//             console.log(`Fetch attempt ${attempts}... Looking for events before cursor: ${currentCursor}`);

//             // 1. Fetch a batch of events via GraphQL
//             const data: any = await graphqlClient.query({
//                 query: querySuiEvents,
//                 variables: {
//                     module: PACKAGE_ID,
//                     cursor: currentCursor // Passes null on the first run, then the cursor on subsequent runs
//                 }
//             });

//             const eventsData = data.data?.events;
//             const nodes = eventsData?.nodes || [];
            
//             // Update pagination flags for the next potential loop iteration
//             hasMoreEvents = eventsData?.pageInfo?.hasPreviousPage || false;
//             currentCursor = eventsData?.pageInfo?.startCursor;

//             if (nodes.length === 0) break;

//             // 2. Extract Unique Post IDs
//             const postIds = new Set<string>();
//             for (const event of nodes) {
//                 const eventJson = event.contents?.json as any;
//                 if (eventJson && eventJson.post_id) {
//                     postIds.add(eventJson.post_id);
//                 }
//             }

//             const selectedIds = Array.from(postIds);

//             // 3. Fetch actual Post objects using your gRPC & BCS parser
//             const rawPosts = await Promise.all(selectedIds.map(async (postId) => {
//                 try {
//                     const objectResponse = suiClient.ledgerService.getObject({
//                         objectId: postId,
//                         readMask: { paths: ['contents'] }
//                     });

//                     const call = await objectResponse.response;
//                     const ob = call.object;

//                     if (!ob || !ob.contents?.value) return null;

//                     // Decode using your schema
//                     const postData = PostSchema.parse(ob.contents.value);

//                     return {
//                         id: postId,
//                         author: postData.author,
//                         content: postData.content,
//                         imageUrl: postData.image_url || null, 
//                         // timestamp: postData.timestamp_ms // (If you added this!)
//                     };
//                 } catch (err: any) {
//                     // Silently catch the deleted ghosts
//                     return null; 
//                 }
//             }));

//             // 4. Filter out the ghosts from THIS batch
//             const validBatch = rawPosts.filter((post) => post !== null);

//             // 5. Pour the valid posts into our main bucket
//             validPostsBucket = [...validPostsBucket, ...validBatch];
            
//             console.log(`Found ${validBatch.length} valid posts in this batch. Total bucket size: ${validPostsBucket.length}`);
//         }

//         // 6. Slice the array just in case the final batch pushed us over the target (e.g., 22 instead of 20)
//         return validPostsBucket.slice(0, TARGET_POSTS);

//     } catch (error) {
//         console.error("Failed to fetch posts:", error);
//         return validPostsBucket; // Return whatever we managed to grab before the crash
//     }
// }