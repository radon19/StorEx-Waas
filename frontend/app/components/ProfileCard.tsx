"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "./Button";
import { useEffect, useState } from "react";
import { useTokens } from "../hooks/useTokens";


export const ProfileCard = ({ publicKey }: { publicKey: string }) => {

    const session = useSession();
    const router = useRouter();

    if (session.status === "loading") {
        return <div>Loading...</div>;

    }

    if (!session.data?.user) {
        router.push("/");
        return null;
    }




    return (
        <div className="pt-8  flex justify-center">
            <div className="max-w-4xl bg-white rounded-2xl shadow-xl w-full p-12">

                <Greeting image={session?.data?.user?.image ?? ""} name={session?.data?.user?.name ?? ""} />
                <Assets publicKey={publicKey} />
            </div>
        </div>
    );
}

function Greeting({ image, name }: { image: string, name: string }) {
    return <div className="flex">
        <img src={image} className="h-15 w-15 rounded-full mr-4" />
        <div className="text-2xl font-semibold font-serif flex flex-col justify-center">
            Welcome back, {name}!
        </div>
    </div>
}

function Assets({ publicKey }: {
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

    return <div className="text-slate-500 mt-4">
        Account assets

        <br />
        <div className="flex justify-between">
            <div>
                {TokenBalances?.totalBalance.toFixed(2)} Usd
            </div>

            <div>
                <PrimaryButton onClick={() => {
                    setCopied(true)
                    navigator.clipboard.writeText(publicKey)
                }}>{copied ? "Copied" : "Wallet Address"}</PrimaryButton>

            </div>

        </div>

        <div>
            {JSON.stringify(TokenBalances?.tokens)}
        </div>

    </div>
}