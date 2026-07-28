import { SUPPORTED_TOKENS } from "./tokens";


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

  const data = await res.json();

  return SUPPORTED_TOKENS.map(token => ({
    ...token,
    price: data[token.mint]?.usdPrice
  }));
}