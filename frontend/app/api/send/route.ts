import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendRequestSchema } from "@/app/schemas/validations";
import db from "@/app/db/index";
import {
    createKeyPairSignerFromBytes,
    pipe,
    createTransactionMessage,
    setTransactionMessageFeePayer,
    setTransactionMessageLifetimeUsingBlockhash,
    appendTransactionMessageInstructions,
    compileTransaction,
    signTransaction,
    sendTransactionWithoutConfirmingFactory,
    getSignatureFromTransaction,
    AccountRole,
    address,
    assertIsSendableTransaction,
    KeyPairSigner,
    Instruction,
} from "@solana/kit";
import { decryptPrivateKey } from "@/app/utils/crypto";
import {
    getTransferInstruction,
    getCreateAssociatedTokenInstructionAsync,
    findAssociatedTokenPda,
    TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { rpc } from "@/app/lib/constants";

const sendTransaction = sendTransactionWithoutConfirmingFactory({ rpc });

const SYSTEM_PROGRAM_ADDRESS = address("11111111111111111111111111111111");

const NATIVE_SOL_MINT = "So11111111111111111111111111111111111111112";
const SUPPORTED_TOKENS = [
    { mint: NATIVE_SOL_MINT, name: "SOL", decimals: 9 },
    { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", name: "USDC", decimals: 6 },
    { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", name: "USDT", decimals: 6 },
];

export async function POST(request: Request) {
    const body = await request.json();

    const parsedData = sendRequestSchema.safeParse(body);

    if (!parsedData.success) {
        return NextResponse.json({
            message: "Invalid input data",
            errors: z.treeifyError(parsedData.error),
        }, {
            status: 400
        });
    }

    const { publicKey, amount, address: destinationAddress, tokenMint } = parsedData.data;

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

    if (solWallet.publicKey !== publicKey) {
        return NextResponse.json({
            message: "Public key mismatch",
        }, {
            status: 401
        })
    }

    try {
        const pvtKey = decryptPrivateKey(
            solWallet.encryptedPrivateKey,
            solWallet.iv,
            solWallet.authTag
        );

        // The private key is stored as JSON array of 64 bytes (32 private + 32 public)
        // from wallet creation: Array.from(new Uint8Array([...privateBytes, ...publicBytes]))
        const keyData = JSON.parse(pvtKey);
        const privateKeyBytes = new Uint8Array(keyData);

        const signer = await createKeyPairSignerFromBytes(privateKeyBytes);

        const tokenInfo = SUPPORTED_TOKENS.find(t => t.mint === tokenMint);

        if (!tokenInfo) {
            return NextResponse.json({
                message: "Unsupported token mint",
            }, {
                status: 400
            });
        }

        let signature: string;

        if (tokenMint === NATIVE_SOL_MINT) {
            signature = await sendNativeSol(signer, destinationAddress, amount);
        } else {
            signature = await sendSplToken(signer, destinationAddress, tokenMint, amount, tokenInfo.decimals);
        }

        return NextResponse.json({
            message: "Send successful",
            signature,
        }, {
            status: 200
        });

    } catch (error) {
        console.error("Send error:", error);
        return NextResponse.json({
            message: "Send failed",
            error: error instanceof Error ? error.message : "Unknown error",
        }, {
            status: 500
        });
    }
}

async function sendNativeSol(signer: KeyPairSigner<string>, destinationAddress: string, amount: string): Promise<string> {
    const lamportsAmount = BigInt(Math.floor(Number(amount) * 1_000_000_000));

    
    
    return signature;
}

async function sendSplToken(
    signer: KeyPairSigner<string>,
    destinationAddress: string,
    tokenMint: string,
    amount: string,
    decimals: number
): Promise<string> {
    const tokenAmount = BigInt(Math.floor(Number(amount) * Math.pow(10, decimals)));

    
}