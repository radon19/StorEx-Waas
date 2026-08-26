"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SUPPORTED_TOKENS } from "../lib/tokens";
import BaseTokenSelect from "../lib/BaseTokenSelect";
import QuoteTokenSelect from "../lib/QuoteTokenSelect";
import { TokenWithBalance } from "../hooks/useTokens";
import { Slippage } from "./Slippage";
import { initiateSwap } from "../utils/swapService";
import { useQuote } from "../hooks/useQuote";
import { PrimaryButton, GhostButton } from "./Button";

export default function SwapInterface({
  publicKey,
  TokenBalances,
}: {
  publicKey: string;
  TokenBalances: {
    totalBalance: number;
    tokens: TokenWithBalance[];
  };
}) {
  const router = useRouter();
  const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
  const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
  const [baseAmount, setBaseAmount] = useState<string>("");
  const [slippage, setSlippage] = useState("0.5");
  const [swapping, setSwapping] = useState(false);
  const { quoteAmount, loader } = useQuote({
    baseAsset,
    quoteAsset,
    baseAmount,
    slippage,
    publicKey,
  });

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return;

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showToast]);

  const currentToken = TokenBalances?.tokens.find((t) => t.mint === baseAsset.mint);
  const currentBalance = currentToken ? Number(currentToken.balance) : 0;

  const canSwap =
    Boolean(quoteAmount) &&
    Boolean(baseAmount) &&
    Number(baseAmount) > 0 &&
    Number(baseAmount) <= currentBalance;

  const handleMaxClick = () => {
    setBaseAmount(currentBalance.toString());
  };

  return (
    <div className="w-full font-body">
      <div className="glass-card p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Swap Tokens
          </h1>
        </div>

        <div className="glass-elevated p-4 sm:p-6 rounded-xl mb-6">
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:items-start">
            <div className="sm:pr-4">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                You Pay
              </label>
              <div className="flex items-center gap-3">
                <BaseTokenSelect
                  selected={baseAsset}
                  onChange={setBaseAsset}
                  excludeMint={quoteAsset.mint}
                />
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    value={baseAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setBaseAmount(value);
                      }
                    }}
                    placeholder="0.00"
                    className="input-field text-right text-2xl sm:text-3xl font-display"
                    disabled={swapping}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-medium text-slate-500">
                  Balance:{' '}
                  {TokenBalances?.tokens
                    .find((t) => t.mint === baseAsset.mint)
                    ?.balance?.toFixed(4) ?? "0"}{' '}
                  {baseAsset.name}
                </span>
                <GhostButton
                  onClick={handleMaxClick}
                  disabled={swapping || currentBalance === 0}
                  className="text-xs"
                >
                  Max
                </GhostButton>
              </div>
            </div>

            <div className="flex justify-center sm:justify-center my-4 sm:my-0">
              <button
                onClick={() => {
                  setBaseAsset(quoteAsset);
                  setQuoteAsset(baseAsset);
                }}
                className="p-2 rounded-full bg-abyss-800/50 border border-abyss-700 text-slate-400 hover:bg-abyss-700 hover:border-abyss-600 hover:text-teal-400 transition-all duration-150 disabled:opacity-40"
                disabled={swapping}
                aria-label="Swap tokens"
              >
                <ArrowUpDown className="w-5 h-5" />
              </button>
            </div>

            <div className="sm:pl-4">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                You Receive
              </label>
              <div className="flex items-center gap-3">
                <QuoteTokenSelect
                  selected={quoteAsset}
                  onChange={setQuoteAsset}
                  excludeMint={baseAsset.mint}
                />
                <div className="relative flex-1 min-w-0">
                  <div className={`input-field text-right text-2xl sm:text-3xl font-display ${loader || !quoteAmount ? "text-slate-500" : "text-slate-100"}`}>
                    {loader ? (
                      <span className="flex items-center justify-end gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
                        <span>Calculating...</span>
                      </span>
                    ) : (
                      quoteAmount ?? "—"
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-medium text-slate-500">
                  Balance:{' '}
                  {TokenBalances?.tokens
                    .find((t) => t.mint === quoteAsset.mint)
                    ?.balance?.toFixed(4) ?? "0"}{' '}
                  {quoteAsset.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Slippage setSlippage={setSlippage} slippage={slippage} />

        <div className="flex items-center justify-between gap-4 pt-2">
          <GhostButton onClick={() => router.push("/dashboard")} disabled={swapping}>
            Cancel
          </GhostButton>

          <PrimaryButton
            disabled={!canSwap || swapping}
            onClick={async () => {
              const called = await initiateSwap({
                setSwapping,
                baseAsset,
                quoteAsset,
                baseAmount,
                slippage,
              });

              if (called) {
                setShowToast(true);
              }
            }}
            className="flex-1"
          >
            {swapping ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Swapping...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Confirm & Swap
              </>
            )}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}