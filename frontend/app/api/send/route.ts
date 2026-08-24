import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendRequestSchema } from "@/app/schemas/validations";
import db from "@/app/db/index";
import {
  address,
  createClient,
  createKeyPairSignerFromBytes,
} from "@solana/kit";
import { decryptPrivateKey } from "@/app/utils/crypto";
import { signer } from "@solana/kit-plugin-signer";
import { solanaRpc } from "@solana/kit-plugin-rpc";
import { getTransferCheckedInstruction } from "@solana-program/token";
import { getTransferSolInstruction } from "@solana-program/system";
const environment = process.env.ALCHEMY_RPC_KEY ?? "";

const NATIVE_SOL_MINT = "So11111111111111111111111111111111111111112";
const SUPPORTED_TOKENS = [
  { mint: NATIVE_SOL_MINT, name: "SOL", decimals: 9 },
  {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    name: "USDC",
    decimals: 6,
  },
  {
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    name: "USDT",
    decimals: 6,
  },
];

export async function POST(request: Request) {
  const body = await request.json();

  const parsedData = sendRequestSchema.safeParse(body);

  if (!parsedData.success) {
    return NextResponse.json(
      {
        message: "Invalid input data",
        errors: z.treeifyError(parsedData.error),
      },
      {
        status: 400,
      },
    );
  }

  const {
    publicKey,
    amount,
    address: destinationAddress,
    tokenMint,
  } = parsedData.data;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        message: "You are not logged in",
      },
      {
        status: 401,
      },
    );
  }

  const solWallet = await db.solWallet.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!solWallet) {
    return NextResponse.json(
      {
        message: "You have not added a wallet yet",
      },
      {
        status: 401,
      },
    );
  }

  if (solWallet.publicKey !== publicKey) {
    return NextResponse.json(
      {
        message: "Public key mismatch",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const pvtKey = decryptPrivateKey(
      solWallet.encryptedPrivateKey,
      solWallet.iv,
      solWallet.authTag,
    );

    // The private key is stored as JSON array of 64 bytes (32 private + 32 public)
    // from wallet creation: Array.from(new Uint8Array([...privateBytes, ...publicBytes]))

    const keyData = JSON.parse(pvtKey);

    // Generate signer from private key bytes
    const privateKeyBytes = new Uint8Array(keyData);

    const signerValue = await createKeyPairSignerFromBytes(privateKeyBytes);

    const tokenInfo = SUPPORTED_TOKENS.find((t) => t.mint === tokenMint);

    if (!tokenInfo) {
      return NextResponse.json(
        {
          message: "Unsupported token mint",
        },
        {
          status: 400,
        },
      );
    }

    // Create client with signer and RPC
    const client = createClient()
      .use(signer(signerValue))
      .use(
        solanaRpc({
          rpcUrl: environment,
        }),
      );

    let signature: string;

    if (tokenMint === "So11111111111111111111111111111111111111112") {
      const tx1 = getTransferSolInstruction({
        source: client.payer,
        destination: address("WALLET_A"),
        amount: BigInt(amount),
      });
      const { context } = await client.sendTransaction([tx1]);

      signature = context.signature;
    } else {
      const instruction = getTransferCheckedInstruction({
        source: publicKey,
        mint: address(tokenInfo.mint),
        destination: address(destinationAddress),
        authority: client.payer,
        amount: BigInt(amount), // 10 USDC if 6 decimals
        decimals: 6,
      });

      const { context } = await client.sendTransaction([instruction]);
      signature = context.signature;
    }

    return NextResponse.json(
      {
        message: "Send successful",
        signature,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Send error:", error);
    return NextResponse.json(
      {
        message: "Send failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
