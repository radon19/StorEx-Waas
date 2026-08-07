"use client"

import { useEffect, useState } from 'react';
import {
  ArrowUpDown,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SUPPORTED_TOKENS } from '../lib/tokens';
import BaseTokenSelect from '../lib/BaseTokenSelect';
import QuoteTokenSelect from '../lib/QuoteTokenSelect';
import { useTokens } from '../hooks/useTokens';




export default function SwapInterface({ publicKey }: {
  publicKey: string
}) {


  const router = useRouter();
  const { loading, TokenBalances } = useTokens(publicKey);
  const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
  const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
  const [baseAmount, setBaseAmount] = useState<string>("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [loader, setLoader] = useState(false);


  const currentToken = TokenBalances?.tokens.find(t => t.mint === baseAsset.mint);

  // 2. Extract the actual balance number (Change `.amount` to `.balance` or `.uiAmount` if your API uses a different key)
  const currentBalance = currentToken ? Number(currentToken.balance) : 0;

  // 3. Fix the logic: baseAmount must be less than or equal to currentBalance
  const canSwap =
    Boolean(quoteAmount) &&
    Boolean(baseAmount) &&
    Number(baseAmount) > 0 &&
    Number(baseAmount) <= currentBalance;

  useEffect(() => {
    if (!baseAmount) {
      setQuoteAmount("");
      return;
    }
    //@ts-ignore
    setLoader(true);
   
    const atomicAmount = toAtomic(baseAmount, baseAsset.native);
    

    const timer = setTimeout(async () => {


      try {
        const res = await fetch(`/api/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${atomicAmount}&taker=${publicKey}&slippage=${slippage}`);
        const data = await res.json();

        if (!res.ok) {
          console.log("API Error", data);
        }

        const amt: string = data.obj ? data.obj.outAmount : data.outAmount;

        if (!amt) {
          console.error("outAmount is missing from the response:", data);
          setQuoteAmount("0");
          return;
        }


        let ans = Number(amt) / Math.pow(10, quoteAsset.decimals);
        setQuoteAmount(ans.toString());
        //@ts-ignore
        setLoader(false);

      } catch (err) {
        console.log("\nTRY CATCH FAILED\n");
        console.error(err);
      }
    }, 1000); // Wait 1 second after typing stops

    return () => clearTimeout(timer);
  }, [baseAmount, baseAsset, quoteAsset, slippage, publicKey]);


  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      {/* Main Card */}
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100">
        {/* Header Section */}
        <div className="mb-8">






          <div className="flex justify-between items-end">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Swap Tokens</h1>

            {/* Powered Jupiter mock */}


          </div>
        </div>

        {/* Swap Container */}
        <div className="relative border border-slate-200 rounded-2xl bg-white mb-4">

          {/* Top Section: You Pay */}
          <div className="p-6">
            <label className="block text-sm font-bold text-slate-700 mb-4">You Pay:</label>

            <div className="flex items-center justify-between gap-4">
              {/* Token Selector */}

              <BaseTokenSelect selected={baseAsset} onChange={setBaseAsset} excludeMint={quoteAsset.mint} />

              {/* Amount Input */}
              <input
                type="text"
                value={baseAmount}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d*\.?\d*$/.test(value)) {
                    setBaseAmount(value);
                  }
                }}
                placeholder="0"
                className="w-full bg-transparent text-right text-5xl font-light text-slate-800 outline-none placeholder:text-slate-800"


              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-slate-400">Current Balance: {TokenBalances?.tokens.find(t => t.mint === baseAsset.mint)?.balance?.toFixed(2) ?? "0"} {baseAsset.name}</span>
              <button
                onClick={() => {
                  const max = TokenBalances?.tokens.find(t => t.mint === baseAsset.mint)?.balance ?? "0";
                  //@ts-ignore
                  setBaseAmount(max.toString());
                }
                }
                className="bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors text-xs font-bold px-3 py-1.5 rounded-lg">
                Max
              </button>
            </div>
          </div>

          {/* Middle Divider & Swap Button */}
          <div className="relative h-0 flex items-center justify-center border-t border-slate-200">
            <button
              onClick={() => {
                setBaseAsset(quoteAsset);
                setQuoteAsset(baseAsset);
              }}
              className="absolute bg-white border border-slate-200 rounded-full p-2 hover:bg-slate-50 transition-colors shadow-sm text-slate-400 hover:text-slate-600">
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Section: You Receive */}
          <div className="p-6">
            <label className="block text-sm font-bold text-slate-700 mb-4">You Receive:</label>

            <div className="flex items-center justify-between gap-4">
              {/* Token Selector */}
              <QuoteTokenSelect
                selected={quoteAsset}
                onChange={setQuoteAsset}
                excludeMint={baseAsset.mint}
              />

              {/* Amount Display */}
              <div
                className={`w-full text-right text-5xl font-light outline-none ${loader || !quoteAmount ? "text-slate-400" : "text-slate-800"
                  }`}
              >
                {loader ? "..." : quoteAmount}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-slate-400">Current Balance: {TokenBalances?.tokens.find(t => t.mint === quoteAsset.mint)?.balance?.toFixed(2) ?? "0"} {quoteAsset.name}</span>
            </div>
          </div>
        </div>

        {/* Footer Settings & Details */}
        <Slippage
          setSlippage={setSlippage}
          slippage={slippage}
        />
        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => router.push("/dashboard")} className="px-6 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
            Cancel
          </button>

          {/* Muted confirm button because amount is 0 */}
          <button
            // 4. Disable when canSwap is FALSE
            disabled={!canSwap}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-colors ${canSwap
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-slate-300 text-white cursor-not-allowed"
              }`}
          >
            <Check className="w-5 h-5" />
            Confirm & Swap
          </button>
        </div>

      </div>
    </div>
  );
}


function Slippage({ setSlippage, slippage }: {
  setSlippage: (slip: string) => void,
  slippage: string
}) {


  const options = ["0.5", "1.5", "3"];
  return <div className="flex items-center justify-between mb-8 px-2">
    <div>
      Coversion rate
    </div>

    <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm font-medium text-slate-600">
      <span className="px-3 text-black-400 font-semibold">Slippage :</span>

      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setSlippage(opt)}
          className={`px-4 py-1.5 rounded-xl transition-all ${slippage === opt
            ? "bg-slate-900 text-white  "
            : "hover:bg-slate-100 text-slate-600"
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
}

function toAtomic(amount: string, isSol: boolean): string {
  const decimals = isSol ? 9 : 6;

  const trimmed = amount.trim();
  if (!trimmed || trimmed === "." || !/^\d*\.?\d*$/.test(trimmed)) {
    return "0";
  }

  const [wholeRaw, fractionRaw = ""] = trimmed.split(".");
  const whole = wholeRaw === "" ? "0" : wholeRaw;
  const fraction = fractionRaw.slice(0, decimals).padEnd(decimals, "0");

  const combined = `${whole}${fraction}`.replace(/^0+(?=\d)/, "");
  return BigInt(combined).toString();
}

