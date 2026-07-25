import { createSolanaRpc } from "@solana/kit";
import axios from "axios";


export const rpc = createSolanaRpc("https://api.devnet.solana.com")

export const SUPPORTED_TOKENS:{
    name:string,
    mint:string,
    native:boolean
}[] = [{
    name:"USDC",
    mint:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native:false
},{
    name : "USDT",
    mint : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native:false
},{
    name:"SOL",
    mint:"So11111111111111111111111111111111111111112",
    native:false
}
]


export async function getSupportedTokens() {
  const mints = SUPPORTED_TOKENS.map(t => t.mint).join(",");

  const res = await fetch(`https://api.jup.ag/price/v2?ids=${mints}`, {
    next: { revalidate: 60 },
    headers: {
        'x-api-key': process.env.NEXT_PUBLIC_JUP_AG_API_KEY ?? ""
    }
  });

  if (!res.ok) {
    return null;
  }

  const { data } = await res.json();

  return SUPPORTED_TOKENS.map(token => ({
    ...token,
    price: data[token.mint]?.price 
  }));
}