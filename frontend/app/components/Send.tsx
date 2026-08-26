"use client";

import { useState } from "react";
import { TokenWithBalance } from "../hooks/useTokens";
import BaseTokenSelect from "../lib/BaseTokenSelect";
import { SUPPORTED_TOKENS } from "../lib/tokens";
import { handleSend } from "../utils/sendService";
import { PrimaryButton, GhostButton } from "./Button";
import { Loader2, Check } from "lucide-react";

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

  const canSend =
    Boolean(amount) &&
    Boolean(address) &&
    Number(amount) > 0 &&
    Number(amount) <= currentBalance;

  return (
    <div className="w-full font-body">
      <div className="glass-card p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Send Tokens
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Token
            </label>
            <BaseTokenSelect
              selected={selectedToken}
              onChange={setSelectedToken}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="Enter Solana address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-field font-mono text-base"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Amount
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field text-right text-2xl sm:text-3xl font-display pr-20"
                disabled={isLoading}
              />
              <GhostButton
                onClick={handleMaxClick}
                disabled={isLoading || currentBalance === 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-3 py-1.5"
              >
                Max
              </GhostButton>
            </div>
            <p className="mt-2 text-sm font-mono text-slate-500 text-right">
              Available: {currentBalance.toFixed(4)} {selectedToken.name}
            </p>
          </div>

          <div className="pt-4 border-t border-abyss-700/50 flex items-center justify-between gap-4">
            <GhostButton className="flex-1" onClick={() => {}} disabled={isLoading}>
              Cancel
            </GhostButton>
            <PrimaryButton
              disabled={!canSend || isLoading}
              onClick={onSendClick}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Send
                </>
              )}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};