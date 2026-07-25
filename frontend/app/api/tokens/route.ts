import {  NextRequest, NextResponse } from "next/server";
import { fetchToken, findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { rpc, getSupportedTokens } from "@/app/lib/constants";
import { address } from '@solana/kit'


export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json({
            status: 400,
            message: "address is required"
        })
    }
    const supportedTokens = await getSupportedTokens();
    if (!supportedTokens) {
        return NextResponse.json({
            status: 400,
            message: "supportedTokens is required"
        })

    }
    const balances = await Promise.allSettled(supportedTokens.map(token => getAccountBalance(token, address)))


}

async function getAccountBalance(token: {
    name: string,
    mint: string,
    native: boolean,
}, owAddress: string) {
    const [associatedTokenAddress] = await findAssociatedTokenPda({
        mint: address(token.mint),
        owner: address(owAddress),
        tokenProgram: TOKEN_PROGRAM_ADDRESS // Explicitly define the Token Program ID
    })
    const account = await fetchToken(rpc, associatedTokenAddress);
}