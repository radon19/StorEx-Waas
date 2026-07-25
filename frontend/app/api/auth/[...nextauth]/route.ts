

import { authOptions } from "@/app/lib/auth"
import NextAuth from "next-auth"


// You hand the rulebook to NextAuth here
const handler = NextAuth(authOptions)



export { handler as GET, handler as POST }