
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db"
import { createWallet } from '@/app/utils/wallet'



const handler = NextAuth({
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {

        const userMail = user.email;
        if (!userMail) {
          return false;
        }

        // console.log({ user, account, profile, email, credentials } )
        const userDb = await db.user.findFirst({
          where: {
            username: userMail
          }
        })

        if (userDb) {
          return true;
        }

        const wallet = await createWallet();
        await db.user.create({
          data: {
            username: userMail,
            name:profile?.name ?? "",
            //@ts-ignore
            profilePicture: profile?.picture,
            provider: "Google",
            solWallet: {
              create: {
                publicKey: wallet.address,
                privateKey: wallet.secretKey
              }
            },
            inrWallet: {
              create: {
                balance: 0
              }
            }

          }
        })
        return true;


      }

      return false
    }
  }
})

export { handler as GET, handler as POST }