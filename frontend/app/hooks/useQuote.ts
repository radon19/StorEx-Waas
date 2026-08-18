import { useState, useEffect } from 'react';
import { TokenDetails } from '../lib/tokens';
import { toAtomic } from '../utils/formatter';

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

  
  const effectDeps = [baseAmount, baseAsset, quoteAsset, slippage, publicKey];
  const [prevEffectDeps, setPrevEffectDeps] = useState(effectDeps);
  const depsChanged = effectDeps.some((d, i) => d !== prevEffectDeps[i]);

  if (depsChanged) {
    setPrevEffectDeps(effectDeps);
    if (!baseAmount) {
      setQuoteAmount("");
    } else {
      setLoader(true);
    }
  }

  useEffect(() => {
    if (!baseAmount) {
      return;
    }

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
        setQuoteAmount("0");
      } finally {
        setLoader(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [baseAmount, baseAsset, quoteAsset, slippage, publicKey]);

  return { quoteAmount, loader };
}