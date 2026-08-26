"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { TokenWithBalance } from "../hooks/useTokens";
import { TokenList } from "./TokenList";
import { PrimaryButton } from "./Button";

export function Assets({
  publicKey,
  loading,
  TokenBalances,
}: {
  publicKey: string;
  loading: boolean;
  TokenBalances: {
    totalBalance: number;
    tokens: TokenWithBalance[];
  };
}) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="skeleton h-12 w-64 max-w-[40%]" />
          <div className="skeleton h-12 w-40 rounded-xl" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-bold text-slate-100 balance-heartbeat">
              ${TokenBalances?.totalBalance?.toFixed(2)}
            </span>
            <span className="text-lg font-medium text-slate-500 mb-1">USD</span>
          </div>
        </div>

        <div className="flex flex-col justify-center sm:justify-end">
          <PrimaryButton
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v2m-7 0v2m7 0v2H6a2 2 0 01-2-2v-2m7 0h2a2 2 0 012 2" />
                </svg>
                Wallet Address
              </>
            )}
          </PrimaryButton>
        </div>
      </div>

      <div className="glass-card p-2">
        <TokenList tokens={TokenBalances?.tokens ?? []} />
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setShowModal(false);
            setCopied(false);
          }}
        >
          <div
            className="glass-card p-6 w-80 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <QRCodeSVG value={publicKey} size={180} bgColor="transparent" fgColor="#e2e8f0" />
            <p className="font-mono text-sm text-slate-300 break-all text-center select-all">
              {publicKey}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicKey);
                setCopied(true);
              }}
              className="btn-primary w-full"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v2m-7 0v2m7 0v2H6a2 2 0 01-2-2v-2m7 0h2a2 2 0 012 2" />
                  </svg>
                  Copy Address
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}