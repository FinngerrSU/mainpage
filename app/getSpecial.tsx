
import { bcs} from "@mysten/sui/bcs";

import { getSuiClient } from "./SuiClient";

const suiClient = getSuiClient();


const currentchema = bcs.struct('template',
  {

    image_url: bcs.string(),
    name: bcs.string(),
   
  }
)

const Special=bcs.struct('special',{
     id: bcs.Address,
     current: currentchema
}
)
export async function GetSpecial(){
   const registryId = "0x24acfa541a458bfae79d4cab7f008ef9f4f69f41c435a49eef88d867da10e75e";
  const response = suiClient.ledgerService.getObject({ objectId: registryId, readMask: { paths: ['contents'] } });
  const ob = (await response.response).object;

  if (ob?.contents?.value) {
    try {

      const realdata = Special.parse(ob.contents.value);
      
      const current = realdata.current;

    // 2. Partial Fisher-Yates (The most efficient way to pick 20)
    return current;
    } catch (parseError) {
      console.error("Failed to parse BCS data:", parseError);
      // Log the raw contents type to help debug
      console.log("Type of ob.contents:", typeof ob.contents);

    }
    
  } else {
    console.log("Object not found or is not a MoveObject with contents.");
  
  }
  return {
    
    image_url: "https://arweave.net/c1zZCCcSPBUeniPJFF5_JEB5CrL_qdqtbNrjxC5J0JQ",
    name: "none",
    

  }
}






