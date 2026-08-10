import axios from "axios";
import { TokenDetails } from "../lib/tokens";
import { toAtomic } from "./formatter";

export async function initiateSwap({ setSwapping, baseAsset, quoteAsset, baseAmount, slippage }: {
  setSwapping: (val: boolean) => void,
  baseAsset: TokenDetails,
  quoteAsset: TokenDetails,
  baseAmount: string,
  slippage: string
}) {
  setSwapping(true);

  try {
    const slippageBps = Math.round(Number(slippage) * 100).toString();
    const { data } = await axios.post("/api/swap", {
      inputMint: baseAsset.mint,
      outputMint: quoteAsset.mint,
      amount: toAtomic(baseAmount, baseAsset.native),
      slippage: slippageBps,
    });

    console.log("Swap successful:", data.signature);
  } catch (error) {
    console.error("Swap failed:", error);
  } finally {
    setSwapping(false);
  }



}