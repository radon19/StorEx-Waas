
"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TabButton } from "./Button";
import {useState } from "react";
import { Assets } from "./Assets";

type Tab = "tokens" | "send" | "add_funds" | "withdraw" | "swap"

const tab : {id:Tab,name:string}[] = [
    {id:"tokens",name:"Tokens" },
    {id:"send",name:"Send"},
    {id:"add_funds",name:"Add Funds"},
    {id:"withdraw",name:"Withdraw"},
    {id:"swap",name:"Swap"}
]



export const ProfileCard = ({ publicKey }: { publicKey: string }) => {

    const session = useSession();
    const router = useRouter();

    const [selectedTab, setSelectedTab] = useState<Tab>("tokens");

    if (session.status === "loading") {
        return <div>Loading...</div>;

    }

    if (!session.data?.user) {
        router.push("/");
        return null;
    }




    return (
        <div className="pt-8 flex justify-center ">
            <div className="max-w-4xl  rounded-2xl shadow-xl w-full p-12">
               <Greeting image={session?.data?.user?.image ?? ""} name={session?.data?.user?.name ?? ""} />
<div className="p-2">
                {
                    tab.map(tab=>
                        <TabButton key={tab.id} active={tab.id === selectedTab} 
                        onClick={()=>{
                            setSelectedTab(tab.id)
                        }}
                        >{tab.name}</TabButton>
                    )
                }
</div>
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

