"use client"

import { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowUpDown, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TokenDetails } from '../lib/tokens';

export default function SwapInterface({token}:{
    token : TokenDetails
}) {

const [slippage, setSlippage] = useState("0.5%");
  const options = ["0.5%", "1.5%", "3%"];
    const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      {/* Main Card */}
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100">
        
        {/* Header Section */}
        <div className="mb-8">
          <button onClick={()=>router.push("/dashboard")} className="rounded-xl bg-black p-2 pr-4 flex items-center gap-2 text-white font-semibold  mb-6 hover:bg-indigo-950 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex justify-between items-end">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Swap Tokens</h1>
            
            {/* Powered by Jupiter mock */}
            
          </div>
        </div>

        {/* Swap Container */}
        <div className="relative border border-slate-200 rounded-2xl bg-white mb-4">
          
          {/* Top Section: You Pay */}
          <div className="p-6">
            <label className="block text-sm font-bold text-slate-700 mb-4">You Pay:</label>
            
            <div className="flex items-center justify-between gap-4">
              {/* Token Selector */}
              <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors px-4 py-3 rounded-xl font-bold text-slate-800">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-sm bg-linear-to-tr from-green-400 to-purple-500" />
                </div>
                SOL
                <ChevronDown className="w-4 h-4 ml-1 text-slate-500" />
              </button>
              
              {/* Amount Input */}
              <input 
                type="text" 
                placeholder="0" 
                className="w-full bg-transparent text-right text-5xl font-light text-slate-800 outline-none placeholder:text-slate-800"
                readOnly
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
            <button className="absolute bg-white border border-slate-200 rounded-full p-2 hover:bg-slate-50 transition-colors shadow-sm text-slate-400 hover:text-slate-600">
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Section: You Receive */}
          <div className="p-6">
            <label className="block text-sm font-bold text-slate-700 mb-4">You Receive:</label>
            
            <div className="flex items-center justify-between gap-4">
              {/* Token Selector */}
              <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors px-4 py-3 rounded-xl font-bold text-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  $
                </div>
                USDC
                <ChevronDown className="w-4 h-4 ml-1 text-slate-500" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-slate-400">Current Balance: 0 USDC</span>
            </div>
          </div>
        </div>

        {/* Footer Settings & Details */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            Coversion rate
          </div>
          
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm font-medium text-slate-600">
      <span className="px-3 text-black-400 font-semibold">Slippage :</span>
      
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setSlippage(opt)}
          className={`px-4 py-1.5 rounded-xl transition-all ${
            slippage === opt
              ? "bg-slate-900 text-white  "
              : "hover:bg-slate-100 text-slate-600"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={()=>router.push("/dashboard")} className="px-6 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          
          {/* Muted confirm button because amount is 0 */}
          <button  className="flex-1 flex items-center justify-center gap-2 bg-slate-300 text-white px-6 py-4 rounded-xl font-bold cursor-not-allowed">
            <Check className="w-5 h-5" />
            Confirm & Swap
          </button>
        </div>

      </div>
    </div>
  );
}