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
  const { loading, TokenBalances } =  useTokens(publicKey);
  const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
  const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
  const [baseAmount, setBaseAmount] = useState<string>("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");



  const canSwap =
    quoteAmount &&
    baseAmount &&
    Number(baseAmount) > Number(TokenBalances?.tokens.map(t=>t.mint===baseAsset.mint)) 

    useEffect(() => {
      if (!baseAmount) {
        setQuoteAmount("");
        return;
      }

      const atomicAmount = toAtomic(baseAmount, baseAsset.decimals);

      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${atomicAmount}&taker=${publicKey}&slippage=${slippage}`);
          const obj = await res.json()

          console.log("\n\n\n");
          
          console.log(obj.outputAmount);


          console.log("\n\n\n");
          
          setQuoteAmount(toAtomic(obj.outputAmount, quoteAsset.decimals));
          //yet to be addded
        } catch (err) {
          console.error(err);
        }
      }, 1000); // Wait 1 second after typing stops

      return () => clearTimeout(timer);
    }, [baseAmount]);


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
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
              <span className="text-sm font-semibold text-slate-400">Current Balance: 0 SOL</span>
              <button className="bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors text-xs font-bold px-3 py-1.5 rounded-lg">
                Max
              </button>
            </div>
          </div>

          {/* Middle Divider & Swap Button */}
          <div className="relative h-0 flex items-center justify-center border-t border-slate-200">
            <button 
            onClick={()=>{
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
              <QuoteTokenSelect selected={quoteAsset} onChange={setQuoteAsset} excludeMint={baseAsset.mint} />
            </div>
            <div className='text-6xl'>{quoteAmount}</div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-slate-400">Current Balance: 0 USDC</span>
            </div>
          </div>
        </div>

        {/* Footer Settings & Details */}
        <Slippage onSelect={(slip) =>
          setSlippage(slip)
        }
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


function Slippage({ onSelect, setSlippage, slippage }: {
  onSelect: (slip: string) => void,
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


function toAtomic(amount: string, decimals: number): string {
    const [whole, fraction = ""] = amount.split(".");

    const fractional = fraction.padEnd(decimals, "0").slice(0, decimals);

    return BigInt((whole || "0") + fractional).toString();
}