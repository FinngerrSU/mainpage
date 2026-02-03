import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { graphql } from "@mysten/sui/graphql/schema";

export interface Bank {
    id: string;
    pool: string;      // The total raw amount of PUIMON in the bank
    balances: unknown; // We type this as 'unknown' or 'any' since you won't touch it
}
const gqlClient = new SuiGraphQLClient({
	url: 'https://graphql.mainnet.sui.io/graphql',
	network: 'mainnet',
});


const getBalance=graphql(`
    query getBalance($objectId: SuiAddress!){
        object(address: $objectId){
            asMoveObject{
                contents{
                    json
                }
            }
        
        }
    }
    `);
const OBID="0xf0d3051112eca05ad1521cb439d57d5fdc50eaf35f896bd9c50179cb8dd84332";
export async function GetPool() {
    const data=await gqlClient.query({
        query: getBalance,
        variables:{objectId:OBID}
    });
    const objData=data.data?.object?.asMoveObject?.contents?.json as unknown as Bank;
    const pool=objData.pool;
    return pool || "0";

}

