"use client"
import { useEffect, useState } from "react";
import { useTokens } from "../hooks/useTokens";
import { TokenList } from "./TokenList";
import { PrimaryButton } from "./Button";

export function Assets({ publicKey }: {
    publicKey: string
}) {
    const [copied, setCopied] = useState(false);

    const { loading, TokenBalances } = useTokens(publicKey);
    

    useEffect(() => {
        if (copied) {
            let timeout = setTimeout(() => {
                setCopied(false)
            }, 3000)
            return () => {
                clearTimeout(timeout);
            }
        }


    }, [copied])


    if (loading) {
        return <div>Skeleton</div>
    }

    return <div className="text-slate-500 mt-4 ">

        <div className="">
                    Account assets
                    {TokenBalances?.tokens.map(t=><div>{t.price}</div>)}
                    

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
}