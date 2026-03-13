import { SuiGrpcClient } from "@mysten/sui/grpc";



export function getSuiClient(network: "testnet" | "mainnet" = "mainnet") {
  return new SuiGrpcClient({network:network,baseUrl:"https://fullnode.mainnet.sui.io:443"});
}

