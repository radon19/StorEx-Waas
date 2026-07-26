import { createSolanaRpc } from "@solana/kit";
import axios from "axios";
import { NextResponse } from "next/server";


export const rpc = createSolanaRpc("https://solana-mainnet.g.alchemy.com/v2/alch_-KRs5czXcPYKPrVztDpIt")

export interface TokenDetails {
    name: string;
    mint: string;
    native: boolean;
     
    image: string;
 
}
export const SUPPORTED_TOKENS:TokenDetails[] = [{
    name:"USDC",
    mint:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native:false,
    image:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
},{
    name : "USDT",
    mint : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native:false,
    image:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg"
},{
    name:"SOL",
    mint:"So11111111111111111111111111111111111111112",
    native:true,
    image:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
}
]


export async function getSupportedTokens() {
  
  
  const mints = SUPPORTED_TOKENS.map(t => t.mint).join(",");
  
  
  const res = await fetch(`https://api.jup.ag/price/v3?ids=${mints}`, {
    next: { revalidate: 60 },
    headers: {
        'x-api-key': process.env.NEXT_PUBLIC_JUP_AG_API_KEY ?? ""
    }
  });

 
  

  if (!res.ok) {
    return null;
  }

  
  

  const  data  = await res.json();

  
  
  
 
 
  return SUPPORTED_TOKENS.map(token => ({
    ...token,
    price: data[token.mint]?.usdPrice 
  }));
}