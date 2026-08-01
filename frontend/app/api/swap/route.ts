import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z } from "zod";
import { swapRequestSchema } from "@/app/schemas/validations";
import db from "@/app/db/index";
import {
    createKeyPairSignerFromBytes,
    getTransactionDecoder,
    getTransactionEncoder,
    partiallySignTransaction,
} from "@solana/kit";




type OrderResponse = {
    transaction: string | null; // base64-encoded transaction, null if no taker, "" if quote-only
    requestId: string;
    outAmount: string;
    router: string;            // "metis" | "jupiterz" | "dflow" | "okx"
    mode: string;              // "ultra" | "manual"
    feeBps: number;
    feeMint: string;
    errorCode?: number;        // present when transaction is ""
    errorMessage?: string;     // present when transaction is ""
};

type ExecuteResponse = {
    status: "Success" | "Failed";
    signature: string;
    code: number;
    totalInputAmount: string;
    totalOutputAmount: string;
    inputAmountResult: string;
    outputAmountResult: string;
    error?: string;
};


const BASE_URL = "https://api.jup.ag/swap/v2";

// Load wallet from base58 secret key in .env
export async function POST(request: NextRequest) {
    const body = await request.json();

    // 3. Validate the data at runtime using safeParse
    const parsedData = swapRequestSchema.safeParse(body);

    if (!parsedData.success) {
        return NextResponse.json({
            message: "Invalid input data",
            // flatten().fieldErrors turns the Zod errors into a clean object
            // e.g., { amount: ["Amount is required"] }
            errors: z.treeifyError(parsedData.error), 
        }, {
            status: 400
        });
    }

    // 5. You now have 100% type-safe and runtime-verified data!
    const data = parsedData.data;


    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({
            message: "You are not logged in",
        }, {
            status: 401
        })
    }

    const solWallet = await db.solWallet.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if (!solWallet) {
        return NextResponse.json({
            message: "You have not added a wallet yet",
        }, {
            status: 401
        })
    }

    const API_KEY = process.env.JUP_AG_API_KEY;
    if (!API_KEY) {
        return NextResponse.json({
            message: "Missing JUP_AG_API_KEY",

        }, {
            status: 500
        });
    }

    // Step 1: Get an order
    const orderResponse = await fetch(
        `${BASE_URL}/order?` +
        new URLSearchParams({
            inputMint: data.inputMint, // SOL
            outputMint: data.outputMint, // USDC
            amount: data.amount,
            taker: solWallet.publicKey,
        }),
        { headers: { "x-api-key": API_KEY } },
    );


    if (!orderResponse.ok) {
        console.error(`/order failed: ${orderResponse.status}`, await orderResponse.text());
        process.exit(1);
    }


    const order: OrderResponse = await orderResponse.json();

    if (!order.transaction) {
        console.error("No transaction in response:", JSON.stringify(order, null, 2));
        process.exit(1);
    }

    // Step 2: Sign the transaction
    // Use partiallySignTransaction because JupiterZ quotes require an additional
    // market maker signature, which is added during /execute

    const bytes = new Uint8Array(JSON.parse(solWallet.privateKey));
    const signer = await createKeyPairSignerFromBytes(bytes);
    const transactionBytes = Buffer.from(order.transaction, "base64");
    const transaction = getTransactionDecoder().decode(transactionBytes);
    const signedTransaction = await partiallySignTransaction(
        [signer.keyPair],
        transaction,
    );

    // Step 3: Execute
    const signedTxBytes = getTransactionEncoder().encode(signedTransaction);
    const signedTxBase64 = Buffer.from(signedTxBytes).toString("base64");

    const executeResponse = await fetch(`${BASE_URL}/execute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
        },
        body: JSON.stringify({
            signedTransaction: signedTxBase64,
            requestId: order.requestId,
        }),
    });
    if (!executeResponse.ok) {
        console.error(`/execute failed: ${executeResponse.status}`, await executeResponse.text());
        process.exit(1);
    }
    const result: ExecuteResponse = await executeResponse.json();

    console.log(`https://solscan.io/tx/${result.signature}`);
    if (result.status === "Success") {
        console.log("Swap successful:", JSON.stringify(result, null, 2));
    } else {
        console.error("Swap failed:", JSON.stringify(result, null, 2));
    }




}

