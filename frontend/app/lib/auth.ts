import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db"
import { createWallet } from '@/app/utils/wallet'
import { encryptPrivateKey } from "../utils/crypto";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'LadleMeow',
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {

    async session({ session, user, token }) {
      if (session.user && token.uid) {
        session.user.id = token.uid;
      }
      return session;
    },



    async jwt({ token, account, profile }) {
      const user = await db.user.findFirst({
        where: {
          sub: account?.providerAccountId ?? ""
        }
      })

      if (user) {
        token.uid = user.id;
      }
      return token
    },

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

        const { iv, authTag, encryptedData } = encryptPrivateKey(wallet.secretKey);

        await db.user.create({
          data: {
            username: userMail,
            name: profile?.name ?? "",
            sub: account.providerAccountId,
            //@ts-ignore
            profilePicture: profile?.picture,
            provider: "Google",
            solWallet: {
              create: {
                publicKey: wallet.address,
                encryptedPrivateKey: encryptedData,
                iv: iv,
                authTag: authTag,
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
}