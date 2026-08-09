import { NextRequest, NextResponse } from "next/server";
import {   findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
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

    const tokens = supportedTokens.map((token, index) => {
        const balance = balances[index].status === "fulfilled" ? balances[index].value : 0;
        return {
            ...token,
            balance,
            usdBalance : balance * token.price
             
        }
    })
    return NextResponse.json({
        tokens,
        totalBalance : tokens.reduce((acc,token)=> acc + token.usdBalance,0)
    })

}

async function getAccountBalance(token: {
    name: string,
    mint: string,
    native: boolean,
}, owAddress: string) {

    if (token.native) {
        const { value: lamport } = await rpc.getBalance(address(owAddress)).send();
        return Number(lamport) / 1_000_000_000;
    }

    const [associatedTokenAddress] = await findAssociatedTokenPda({
        mint: address(token.mint),
        owner: address(owAddress),
        tokenProgram: TOKEN_PROGRAM_ADDRESS // Explicitly define the Token Program ID
    })

    
    const trueAdd = address(associatedTokenAddress);
    
    try {
        const balance = await rpc.getTokenAccountBalance(trueAdd).send();
        return Number(balance.value.uiAmountString);
    } catch (error: any) {


        if (error?.message?.includes("could not find account") || error?.code === -32602) {
            return 0;
        }
        
        throw error;
    }


}