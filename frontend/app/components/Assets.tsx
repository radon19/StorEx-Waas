"use client"
import { useEffect, useState } from "react";
import { TokenWithBalance } from "../hooks/useTokens";
import { TokenList } from "./TokenList";
import { PrimaryButton } from "./Button";

export function Assets({ publicKey, loading, TokenBalances }: {
    publicKey: string,
    loading: boolean,
    TokenBalances : {
        totalBalance : number,
        tokens : TokenWithBalance[]
    }
}) {
    const [copied, setCopied] = useState(false);

  
    
    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => {
                setCopied(false)
            }, 3000)
            return () => {
                clearTimeout(timeout);
            }
        }
    }, [copied])

    if (loading) {
        return (
            <div className="text-slate-500 mt-4">
                <div className="">
                    Account assets
                    <br />
                    <div className="flex justify-between mt-3">
                        {/* Balance Text Skeleton */}
                        <div className="p-2 flex items-end gap-2">
                            <div className="h-16 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
                        </div>

                        {/* Button Skeleton */}
                        <div className="flex flex-col justify-center">
                            <div className="h-12 w-36 bg-slate-200 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Token List Skeletons */}
                <div className="mt-5 p-2 flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0">
                            <div className="flex items-center gap-4">
                                {/* Token Icon Skeleton */}
                                <div className="h-12 w-12 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="flex flex-col gap-2">
                                    {/* Token Name Skeleton */}
                                    <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div>
                                    {/* Token Symbol Skeleton */}
                                    <div className="h-4 w-12 bg-slate-100 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {/* Token Amount Skeleton */}
                                <div className="h-5 w-20 bg-slate-200 rounded animate-pulse"></div>
                                {/* Token Value Skeleton */}
                                <div className="h-4 w-16 bg-slate-100 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="text-slate-500 mt-4 ">
            <div className="">
                Account assets
                <br />
                <div className="flex justify-between mt-3 ">
                    <div className="text-6xl p-2 font-bold text-black  ">
                        ${TokenBalances?.totalBalance.toFixed(2)} <span className="text-4xl text-gray-500">USD</span>
                    </div>

                    <div className="flex flex-col justify-center"> 
                        <PrimaryButton onClick={() => {
                            setCopied(true)
                            navigator.clipboard.writeText(publicKey)
                        }}>{copied ? "Copied" : "Wallet Address"}</PrimaryButton>
                    </div>
                </div>
            </div>

            <div className="mt-5 p-2 ">
                <TokenList tokens={TokenBalances?.tokens ?? []} />
            </div>
        </div>
    )
}