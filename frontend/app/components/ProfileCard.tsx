"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "./Button";
import { useState } from "react";


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

function Assets({publicKey} :{
    publicKey : string
}) {
    const [copied, setCopied] = useState(false);
    return <div className="text-slate-500 mt-4">
        Account assets

        <br />
        <div className="flex justify-between">
            <div></div>

            <div>
            </div>

        </div>


    </div>
}