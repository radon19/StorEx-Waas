import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db/index";

export async function POST(request: NextRequest) {
    const data : {
         
   } = await request.json();

   const session = await getServerSession(authOptions);
   if (!session) {
       return NextResponse.json({
        message : "You are not logged in",
        } ,{
        status: 401
       })
    }

    const solWallet = await db.solWallet.findFirst({
        where: {
            userId : session.user.id
        }
    })

    if (!solWallet) {
        return NextResponse.json({
            message : "You have not added a wallet yet",
            } ,{
            status: 401
        })
    }
    
    




}