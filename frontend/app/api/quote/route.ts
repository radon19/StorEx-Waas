import { NextRequest, NextResponse } from "next/server";



export async function GET (req :NextRequest) {
    const { searchParams } = req.nextUrl;
    const address = searchParams.get("taker");
    const inputMint = searchParams.get("inputMint");
    const outputMint = searchParams.get("outputMint");
    const amount = searchParams.get("amount");
    const  slippage = searchParams.get("slippage") ?? "3";


    if (!address || !inputMint || !outputMint || !amount ){
        return NextResponse.json({
            status: 400,
            message: "address, inputMint, outputMint, amount are required"
        })
    }
    if(amount=="0"){
        return NextResponse.json({
            obj:{
                outAmount:"0"
            }
        })
    }


    const API_KEY =process.env.JUP_AG_API_KEY;
    if (!API_KEY) {
        return NextResponse.json({
            status: 500,
            message: "API error",
        });
    }
    const res = await fetch(`https://api.jup.ag/swap/v2/order?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&taker=${address}&slippageBps=${slippage}`, {
        next: { revalidate: 60 },
        headers: {
            'x-api-key': API_KEY
        }
    });

if (!res.ok) {
    console.log("\n\n");
    
  console.error(`/order failed: ${res.status}`, await res.text());


    console.log("\n\n");


  return NextResponse.json({
    message: "Order failed",
  },{
    status: 500
  });
}

const obj = await res.json();

return NextResponse.json({
    obj
},
{
    status: 200,
    headers: {
        'Content-Type': 'application/json'
    }
});





}