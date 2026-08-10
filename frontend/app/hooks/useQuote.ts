import { useState, useEffect } from 'react';
import { TokenDetails } from '../lib/tokens';
import { toAtomic } from '../utils/formatter'; // Assuming you moved toAtomic here

interface UseQuoteProps {
  baseAsset: TokenDetails;
  quoteAsset: TokenDetails;
  baseAmount: string;
  slippage: string;
  publicKey: string;
}

export function useQuote({
  baseAsset,
  quoteAsset,
  baseAmount,
  slippage,
  publicKey
}: UseQuoteProps) {
  const [quoteAmount, setQuoteAmount] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!baseAmount) {
      setQuoteAmount("");
      return;
    }

    setLoader(true);

    const atomicAmount = toAtomic(baseAmount, baseAsset.native);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${atomicAmount}&taker=${publicKey}&slippage=${slippage}`
        );
        const data = await res.json();

        if (!res.ok) {
          console.log("API Error", data);
          setQuoteAmount("0");
          return;
        }

        const amt: string = data.obj ? data.obj.outAmount : data.outAmount;

        if (!amt) {
          console.error("outAmount is missing from the response:", data);
          setQuoteAmount("0");
          return;
        }

        const ans = Number(amt) / Math.pow(10, quoteAsset.decimals);
        setQuoteAmount(ans.toString());
      } catch (err) {
        console.log("\nTRY CATCH FAILED\n");
        console.error(err);
        setQuoteAmount("0"); // Resetting on error is good practice
      } finally {
        setLoader(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [baseAmount, baseAsset, quoteAsset, slippage, publicKey]);

  return { quoteAmount, loader };
}