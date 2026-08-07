"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TabButton } from "./Button";
import { useState } from "react";
import { Assets } from "./Assets";
import Swap from "./Swap";

type Tab = "tokens" | "send" | "add_funds" | "withdraw" | "swap"

const tab: { id: Tab, name: string }[] = [
    { id: "tokens", name: "Tokens" },
    { id: "send", name: "Send" },
    { id: "add_funds", name: "Add Funds" },
    { id: "withdraw", name: "Withdraw" },
    { id: "swap", name: "Swap" }
]

export const ProfileCard = ({ publicKey }: { publicKey: string }) => {

    const session = useSession();
    const router = useRouter();

    const [selectedTab, setSelectedTab] = useState<Tab>("tokens");

    // Replaced simple text with a Tailwind spinner that matches the card layout
    if (session.status === "loading") {
        return (
            <div className="pt-8 flex justify-center ">
                <div className="max-w-4xl rounded-2xl shadow-xl w-full p-12 flex flex-col items-center justify-center min-h-125">
                    {/* Spinning Circle */}
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-800 rounded-full animate-spin"></div>
                    <div className="mt-4 text-slate-500 font-medium">Loading profile...</div>
                </div>
            </div>
        );
    }

    if (!session.data?.user) {
        router.push("/");
        return null;
    }

    // Function to handle dynamic rendering based on the selected tab
    const renderTabContent = () => {
        switch (selectedTab) {
            case "tokens":
                return <Assets publicKey={publicKey} />;
            case "swap":
                return <Swap publicKey={publicKey} />;
            case "send":
            case "add_funds":
            case "withdraw":
                return (
                    <div className="flex items-center justify-center py-20 text-slate-500 font-medium text-xl bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                        Coming soon...
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="pt-8 flex justify-center ">
            <div className="max-w-4xl rounded-2xl shadow-xl w-full p-12">
                
                <Greeting image={session?.data?.user?.image ?? ""} name={session?.data?.user?.name ?? ""} />
                
                {/* Tabs Container */}
                <div className="p-2 flex gap-2 mt-6 mb-4">
                    {
                        tab.map(t =>
                            <TabButton 
                                key={t.id} 
                                active={t.id === selectedTab} 
                                onClick={() => {
                                    setSelectedTab(t.id)
                                }}
                            >
                                {t.name}
                            </TabButton>
                        )
                    }
                </div>

                {/* Dynamic Content Rendering */}
                <div className="mt-4 w-full transition-all">
                    {renderTabContent()}
                </div>
                
            </div>
        </div>
    );
}

function Greeting({ image, name }: { image: string, name: string }) {
    return (
        <div className="flex items-center">
            <img src={image} className="h-16 w-16 rounded-full mr-4 object-cover" alt={`${name}'s profile picture`} />
            <div className="text-2xl font-semibold font-serif flex flex-col justify-center text-slate-800">
                Welcome back, {name}!
            </div>
        </div>
    )
}
