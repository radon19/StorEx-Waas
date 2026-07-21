"use client";
import { signIn, useSession } from "next-auth/react";
import { SecondaryButton } from "./Button";
import { useRouter } from "next/navigation";

export default function Hero() {
    const session = useSession();
    const router = useRouter();


    return <div><div className='font-bold text-5xl flex flex-col items-center justify-center pt-10 pb-5'>
        Hello Fellas, Wanna Trade  <span className='text-blue-400'>Crypto?   </span>
    </div>
    <div className='font-bold text-2xl text-gray-500 flex flex-col items-center justify-center py-10 '> 
Your brokerage, your exchange, your money  
  </div> 
<br/>
  <div className='flex flex-col items-center justify-center  '>
    {session.data?.user ? 
<SecondaryButton onClick={()=>{
    router.push("/dashboard")
    } }> Dashboard</SecondaryButton>
    
    :
    

<SecondaryButton onClick={()=>{
        signIn("google")
    } }> Login with Google   </SecondaryButton>
    }
  </div>
    
    </div>
}