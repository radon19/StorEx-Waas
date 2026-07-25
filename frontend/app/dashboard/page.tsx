import {ProfileCard} from "../components/ProfileCard";
import db from "@/app/db";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../lib/auth";

async function getUserWallet() {
  const session = await getServerSession(authOptions);
  
  const userWallet = await db.solWallet.findFirst({
    where: {
   userId: session?.user?.id
    },
    select:{
      publicKey: true,
    }
  })
  if (!userWallet) {
   return{
    error: "No wallet found error"
   }
  }

  return {error:null,userWallet}

}

export default async  function Dashboard() {
  const userWallet = await getUserWallet();
  if (userWallet.error || !userWallet.userWallet?.publicKey) {
    return <div>{userWallet.error}</div>
  }
  return <div>
    <ProfileCard publicKey={userWallet.userWallet?.publicKey}/>
  </div>
}