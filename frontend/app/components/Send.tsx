"use client";

import { useState } from "react";
import { TokenWithBalance } from "../hooks/useTokens";
import BaseTokenSelect from "../lib/BaseTokenSelect";
import { SUPPORTED_TOKENS } from "../lib/tokens";
import { handleSend } from "../utils/sendService";

export const Send = ({
  publicKey,
  TokenBalances,
}: {
  publicKey: string;
  TokenBalances: {
    totalBalance: number;
    tokens: TokenWithBalance[];
  };
}) => {
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
  const [amount, setAmount] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const currentTokenData = TokenBalances.tokens.find(
    (t) => t.mint === selectedToken.mint
  );
  const currentBalance = currentTokenData?.balance || 0;

  const handleMaxClick = () => {
    setAmount(currentBalance.toString());
  };

  const onSendClick = async () => {
    const signature = await handleSend({
      publicKey,
      amount,
      address,
      tokenMint: selectedToken.mint, 
      setIsLoading,
    });

    if (signature) {
      alert(`Success! Transaction signature: ${signature}`);
      setAmount("");
      setAddress("");
    } else {
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="w-full font-sans flex justify-center">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-sm p-8 border border-slate-200/80 text-slate-800">
        
        {/* Token Selection */}
        <div>
          <BaseTokenSelect selected={selectedToken} onChange={setSelectedToken} />
        </div>

        {/* Recipient Address Input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-500 mb-2 pl-1">
            Send to
          </label>
          <input
            type="text"
            placeholder="Enter recipient address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Amount Input with MAX Button */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2 pl-1 pr-1">
            <label className="block text-sm font-medium text-slate-500">
              Amount
            </label>
            <span className="text-sm font-medium text-slate-400">
              Balance: {currentBalance}
            </span>
          </div>
          
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-20 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
            <button
              onClick={handleMaxClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700 text-xs font-bold rounded-xl transition-colors tracking-wide"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Send Button */}
        <button 
          className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          onClick={onSendClick}
          disabled={!amount || !address || Number(amount) <= 0 || Number(amount) > currentBalance || isLoading}
        >
          {isLoading ? "Sending..." : "Send"} {/* BETTER UX */}
        </button>
      </div>
    </div>
  );
};

