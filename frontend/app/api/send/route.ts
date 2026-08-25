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
import { getTransferCheckedInstruction, TOKEN_PROGRAM_ADDRESS, findAssociatedTokenPda, getCreateAssociatedTokenInstruction } from "@solana-program/token";
import { getTransferSolInstruction } from "@solana-program/system";
import { rpc } from "@/app/lib/constants";

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

function toBaseUnits(amount: string, decimals: number): bigint {
  const trimmed = amount.trim();
  if (!trimmed || !/^\d+(\.\d+)?$/.test(trimmed)) {
    return BigInt(0);
  }
  const [whole, fraction = ""] = trimmed.split(".");
  const padded = (fraction + "0".repeat(decimals)).slice(0, decimals);
  return BigInt((whole === "" ? "0" : whole) + padded);
}

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

    const amountInBaseUnits = toBaseUnits(amount, tokenInfo.decimals);

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
      // balance
      const { value } = await rpc.getBalance(publicKey).send();

      if (value < amountInBaseUnits) {
        return NextResponse.json(
          {
            message: "Insufficient balance",
          },
          {
            status: 400,
          },
        );
      }

      const tx1 = getTransferSolInstruction({
        source: client.payer,
        destination: address(destinationAddress),
        amount: amountInBaseUnits,
      });
      const { context } = await client.sendTransaction([tx1]);
      signature = context.signature;
    } else {


const owner = address(publicKey);



const tokenAccounts = await rpc
  .getTokenAccountsByOwner(
    owner,
    { 
      programId:TOKEN_PROGRAM_ADDRESS,
      mint: address(tokenMint)
    },
    {
      commitment: "finalized",
      encoding: "jsonParsed"
    }
  )
  .send();

if (tokenAccounts.value.length === 0) {
  return NextResponse.json(
    {
      message: "No token account found for this mint",
    },
    {
      status: 400,
    },
  );
}

const sourceTokenAccount = tokenAccounts.value[0].pubkey;
const balance = BigInt(tokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount);

      if (balance< amountInBaseUnits) {
        return NextResponse.json(
          {
            message: "Insufficient balance",
          },
          {
            status: 400,
          },
        );
      }


      // Get or create recipient's Associated Token Account
      const [destinationTokenAccount] = await findAssociatedTokenPda({
        owner: address(destinationAddress),
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        mint: address(tokenMint)
      });

      // Check if recipient's ATA exists
      const destAccountInfo = await rpc.getAccountInfo(destinationTokenAccount).send();

      const instructions = [];

      if (!destAccountInfo.value) {
        // Create ATA for recipient
        const createAtaInstruction = getCreateAssociatedTokenInstruction({
          payer: client.payer,
          mint: address(tokenMint),
          owner: address(destinationAddress),
          ata: destinationTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
        });
        instructions.push(createAtaInstruction);
      }

      // Add transfer instruction
      const transferInstruction = getTransferCheckedInstruction({
        source: sourceTokenAccount,
        mint: address(tokenInfo.mint),
        destination: destinationTokenAccount,
        authority: client.payer,
        amount: amountInBaseUnits,
        decimals: tokenInfo.decimals,
      });
      instructions.push(transferInstruction);

      const { context } = await client.sendTransaction(instructions);
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
