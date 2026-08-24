import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";
import { SUPPORTED_TOKENS } from "./tokens";


const environment = process.env.ALCHEMY_RPC_KEY ?? "";

export const rpc = createSolanaRpc(environment);
export const rpcSubscriptions = createSolanaRpcSubscriptions(environment.replace("https://", "wss://"));



export async function getSupportedTokens() {
  const mints = SUPPORTED_TOKENS.map(t => t.mint).join(",");

  const res = await fetch(`https://api.jup.ag/price/v3?ids=${mints}`, {
    next: { revalidate: 60 },
    headers: {
      'x-api-key': process.env.JUP_AG_API_KEY ?? ""
    }
  });

  if (!res.ok) {
    return null;
    
  }

  const data = await res.json();
  
  return SUPPORTED_TOKENS.map(token => ({
    ...token,
    price: data[token.mint]?.usdPrice
  }));
}