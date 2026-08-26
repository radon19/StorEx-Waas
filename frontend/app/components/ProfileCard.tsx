"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TabButton } from "./Button";
import { useState, useEffect } from "react";
import { Assets } from "./Assets";
import Swap from "./Swap";
import { useTokens } from "../hooks/useTokens";
import { Send } from "./Send";
import { Logo } from "./Logo";

type Tab = "tokens" | "send" | "add_funds" | "withdraw" | "swap";

const tabs: { id: Tab; name: string }[] = [
  { id: "tokens", name: "Portfolio" },
  { id: "swap", name: "Swap" },
  { id: "send", name: "Send" },
  { id: "add_funds", name: "Receive" },
  { id: "withdraw", name: "Withdraw" },
];

export const ProfileCard = ({ publicKey }: { publicKey: string }) => {
  const session = useSession();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<Tab>("tokens");
  const { loading, TokenBalances } = useTokens(publicKey);

  useEffect(() => {
    if (session.status !== "loading" && !session.data?.user) {
      router.push("/");
    }
  }, [session, router]);

  if (session.status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="glass-card p-8 max-w-4xl w-full">
          <div className="flex items-center justify-between mb-8">
            <Logo size="md" showBadge={false} />
            <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin" />
          </div>
          <div className="space-y-4">
            <div className="skeleton h-8 w-48 rounded-xl" />
            <div className="skeleton h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!session.data?.user) {
    return null;
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case "tokens":
        return (
          <Assets
            publicKey={publicKey}
            loading={loading}
            TokenBalances={TokenBalances}
          />
        );
      case "swap":
        return <Swap publicKey={publicKey} TokenBalances={TokenBalances} />;
      case "send":
        return <Send publicKey={publicKey} TokenBalances={TokenBalances} />;
      case "add_funds":
      case "withdraw":
        return (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-abyss-800/50 border border-abyss-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-slate-100 mb-2">Coming Soon</h3>
            <p className="text-slate-500">{selectedTab === "add_funds" ? "Receive assets via QR code or address" : "Withdraw to external wallet"}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const shortAddress = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;

  return (
    <div className="flex-1 flex flex-col px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl w-full">
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <Image
                  src={session.data?.user?.image ?? ""}
                  alt={`${session.data?.user?.name ?? "User"}'s profile`}
                  fill
                  className="rounded-full object-cover ring-2 ring-teal-500/30"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-slate-100">
                  {session.data?.user?.name ?? "Trader"}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-sm font-mono text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{shortAddress}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Solana Mainnet</p>
              <p className="font-mono text-sm text-slate-400">—</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-2 mb-6 scrollbar-thin" role="tablist">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <TabButton
                key={t.id}
                active={t.id === selectedTab}
                onClick={() => setSelectedTab(t.id)}
              >
                {t.name}
              </TabButton>
            ))}
          </div>
        </div>

        <div className="glass-elevated overflow-hidden">
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};