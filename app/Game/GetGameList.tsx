import { SuiGrpcClient } from '@mysten/sui/grpc';
import { bcs } from '@mysten/sui/bcs';

// Define the interface here so GameGrid can import it
const GameSchema = bcs.struct('Game', {
  id: bcs.Address,
  creator: bcs.Address,
  name: bcs.String,
  description: bcs.String,
  download_url: bcs.String,
  image_urls: bcs.vector(bcs.String),
  unzip_password: bcs.String,
});

const RegistrySchema = bcs.struct('Registry', {
    id: bcs.Address,
    all_games: bcs.vector(bcs.Address)
});

// Initialize client
const suiClient = new SuiGrpcClient({ network: "mainnet", baseUrl: "https://fullnode.mainnet.sui.io:443" });


export default async function GetGameList() {
    const registryId = "0x3d2bed08b63829a732a4eb922bb445de2ad79674d21a5d1f674b37c339341d31";

    try {
        // 1. Your new way using ledgerService and readMask
        const response = suiClient.ledgerService.getObject({
            objectId: registryId,
            readMask: { paths: ['contents'] }
        });
        const ob = (await response.response).object;

        if (ob?.contents?.value) {
            try {
                // 2. Parse out the array of game IDs
                const realdata = RegistrySchema.parse(ob.contents.value);
                const all_games: string[] = realdata.all_games;

                if (!all_games || all_games.length === 0) return [];
               
                // 3. Take those IDs and fetch the actual game contents
               const batchResponse = suiClient.ledgerService.batchGetObjects({
                  requests: all_games.map((id) => ({
                      objectId: id
                  })),
                  readMask: { paths: ['contents'] } 
              });

                // Extract the array of responses
                const batchResults = (await batchResponse).response.objects;
               
                // 4. Map the raw data to the GameItem interface
                const formattedGames = batchResults.map((res: any) => {
                    const rawGameBcs = res.result.object?.contents?.value;

                    if (!rawGameBcs) return null;

                    // Parse the raw bytes using the Game schema
                    const gameData = GameSchema.parse(rawGameBcs);

                    return {
                        id: gameData.id, // The object's real ID
                        creator: gameData.creator,
                        name: gameData.name,
                        description: gameData.description,
                        downloadUrl: gameData.download_url,
                        imageUrls: gameData.image_urls,
                        unzipPassword: gameData.unzip_password,
                    };
                }).filter(item => item !== null); // Clean out any fails

                
                return formattedGames;
            } catch (parseError) {
                console.error("Failed to parse BCS data:", parseError);
                console.log("Type of ob.contents:", typeof ob.contents);
            }
        } else {
            console.log("Object not found or is not a MoveObject with contents.");
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }

    // Return empty array on failure
    return [];
}