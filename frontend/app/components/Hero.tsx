"use client";
import { signIn, useSession } from "next-auth/react";
import { SecondaryButton } from "./Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
    const session = useSession();
    const router = useRouter();
    
    // State to track if the user just clicked a button
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Disable if NextAuth is still loading the session OR if a button was clicked
    const isLoading = session.status === "loading" || isActionLoading;

    return (
        <div>
            <div className='font-bold text-5xl flex flex-col items-center justify-center pt-10 pb-5'>
                Hello Fellas, Wanna Trade  <span className='text-blue-400'>Crypto?   </span>
            </div>
            <div className='font-bold text-2xl text-gray-500 flex flex-col items-center justify-center py-10 '> 
                Your brokerage, your exchange, your money  
            </div> 
            <br/>
            <div className='flex flex-col items-center justify-center'>
                {session.data?.user ? (
                    <SecondaryButton 
                        disabled={isLoading}
                        onClick={() => {
                            setIsActionLoading(true);
                            router.push("/dashboard");
                        }}
                    > 
                        {isLoading ? "Loading..." : "Dashboard"}
                    </SecondaryButton>
                ) : (
                    <SecondaryButton 
                        disabled={isLoading}
                        onClick={() => {
                            setIsActionLoading(true);
                            signIn("google");
                        }}
                    > 
                        {isLoading ? "Loading..." : "Login with Google"}   
                    </SecondaryButton>
                )}
            </div>
        </div>
    );
}