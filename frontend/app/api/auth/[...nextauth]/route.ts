
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db"
import { generateKeyPairSigner } from "@solana/kit";



const handler = NextAuth({
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {
    async signIn({user,account,profile,email,credentials}) {
      if (! (account?.provider==="google")) {
        return false
      }
      const userMail = user.email;
      if (!userMail) {
        return false;
      }
      const userDb = await db.user.findFirst({
        where:{
          username:userMail
        }
      })

      if (userDb) {
        return true;
      }

      const keypair = await generateKeyPairSigner();
      await db.user.create({
        data:{
          username : userMail,
          provider : "Google",
          solWallet: {
            create:{
              publicKey:"",
              privateKey:""
            }
          },
          inrWallet : {
            create:{
              balance:0
            }
          }

        }
      })

      return true
    }
  }
})

export { handler as GET, handler as POST }