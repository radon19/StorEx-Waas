"use client";

import Image from "next/image";
import { TokenWithBalance } from "@/app/hooks/useTokens";

export function TokenList({ tokens }: { tokens: TokenWithBalance[] }) {
  if (tokens.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg className="w-12 h-12 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-slate-500">No tokens found</p>
        <p className="text-sm text-slate-600 mt-1">Tokens will appear here after you receive them</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-abyss-800/50">
      {tokens.map((token) => (
        <TokenRow key={token.mint} token={token} />
      ))}
    </div>
  );
}

function TokenRow({ token }: { token: TokenWithBalance }) {
  const price = token.price ?? 0;
  const isNative = token.native;

  return (
    <div className="token-row group">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative w-10 h-10 shrink-0">
          <Image
            src={token.image}
            alt={token.name ?? "Token logo"}
            fill
            className="rounded-full object-cover"
            sizes="40px"
          />
          {isNative && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 rounded-full border-2 border-abyss-900 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-abyss-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-slate-100 truncate">{token.name}</p>
          <p className="text-sm font-mono text-slate-500">
            1 {token.name} = ${price.toFixed(price < 1 ? 6 : 2)}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0 ml-4">
        <p className="font-display font-semibold text-slate-100">
          ${token?.usdBalance?.toFixed(2)}
        </p>
        <p className="text-sm font-mono text-slate-500">
          {token.balance.toFixed(token.decimals > 6 ? 4 : 2)} {token.name}
        </p>
      </div>
    </div>
  );
}