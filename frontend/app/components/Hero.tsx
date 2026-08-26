"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PrimaryButton } from "./Button";
import { Logo } from "./Logo";

export default function Hero() {
  const session = useSession();
  const router = useRouter();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isLoading = session.status === "loading" || isActionLoading;
  const isAuthenticated = !!session.data?.user;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md w-full mx-4">
          <div className="w-12 h-12 mx-auto mb-4 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (session.status === "loading") {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md w-full mx-4">
          <div className="w-12 h-12 mx-auto mb-4 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
      <div className="max-w-3xl w-full text-center">
        <Logo size="lg" showBadge={true} className="mx-auto mb-8" />

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 mb-6">
          Trade on Solana{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-teal-600">at terminal velocity</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
          Swap, send, and manage assets. No custody. No friction. Just you and the chain.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <PrimaryButton
              disabled={isLoading}
              onClick={() => {
                setIsActionLoading(true);
                router.push("/dashboard");
              }}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Loading..." : "Open Terminal"}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              disabled={isLoading}
              onClick={() => {
                setIsActionLoading(true);
                signIn("google");
              }}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Loading..." : "Connect with Google"}
            </PrimaryButton>
          )}
          
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-slate-500 text-sm font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live on Solana Mainnet
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            Non-custodial
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Instant finality
          </span>
        </div>
      </div>
    </main>
  );
}