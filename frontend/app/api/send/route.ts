import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendRequestSchema } from "@/app/schemas/validations";
import db from "@/app/db/index";
import {
  address,
  createKeyPairSignerFromBytes,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  signTransactionMessageWithSigners,
  getBase64EncodedWireTransaction,
} from "@solana/kit";
import { decryptPrivateKey } from "@/app/utils/crypto";
import { getTransferCheckedInstruction, TOKEN_PROGRAM_ADDRESS, findAssociatedTokenPda, getCreateAssociatedTokenInstruction } from "@solana-program/token";
import { getTransferSolInstruction } from "@solana-program/system";
import { rpc } from "@/app/lib/constants";

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

async function sendTransactionHttp(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signerValue: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instructions: any[]
): Promise<string> {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let transactionMessage = createTransactionMessage({ version: 0 }) as any;
  transactionMessage = setTransactionMessageFeePayer(signerValue.address, transactionMessage);
  transactionMessage = setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage);
  for (const ix of instructions) {
    transactionMessage = appendTransactionMessageInstruction(ix, transactionMessage);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signedTx = await signTransactionMessageWithSigners(transactionMessage, [signerValue] as any);
  const base64WireTx = getBase64EncodedWireTransaction(signedTx);

  const signature = await rpc.sendTransaction(base64WireTx, { encoding: "base64" }).send();
  return signature;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = sendRequestSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: z.treeifyError(parsedData.error) },
        { status: 400 }
      );
    }

    const { publicKey, amount, address: destinationAddress, tokenMint } = parsedData.data;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
    }

    const solWallet = await db.solWallet.findFirst({
      where: { userId: session.user.id },
    });

    if (!solWallet) {
      return NextResponse.json({ message: "You have not added a wallet yet" }, { status: 401 });
    }

    if (solWallet.publicKey !== publicKey) {
      return NextResponse.json({ message: "Public key mismatch" }, { status: 401 });
    }

    const pvtKey = decryptPrivateKey(solWallet.encryptedPrivateKey, solWallet.iv, solWallet.authTag);
    const keyData = JSON.parse(pvtKey);
    const privateKeyBytes = new Uint8Array(keyData);
    const signerValue = await createKeyPairSignerFromBytes(privateKeyBytes);

    const tokenInfo = SUPPORTED_TOKENS.find((t) => t.mint === tokenMint);
    if (!tokenInfo) {
      return NextResponse.json({ message: "Unsupported token mint" }, { status: 400 });
    }

    const amountInBaseUnits = toBaseUnits(amount, tokenInfo.decimals);

    let signature: string;

    if (tokenMint === NATIVE_SOL_MINT) {
      const { value: balance } = await rpc.getBalance(publicKey).send();
      if (balance < amountInBaseUnits) {
        return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
      }

      const tx = getTransferSolInstruction({
        source: signerValue,
        destination: address(destinationAddress),
        amount: amountInBaseUnits,
      });

      signature = await sendTransactionHttp(signerValue, [tx]);
    } else {
      const owner = address(publicKey);

      const tokenAccounts = await rpc
        .getTokenAccountsByOwner(owner, { mint: address(tokenMint) }, { commitment: "finalized", encoding: "jsonParsed" })
        .send();

      if (tokenAccounts.value.length === 0) {
        return NextResponse.json({ message: "No token account found for this mint" }, { status: 400 });
      }

      const sourceTokenAccount = tokenAccounts.value[0].pubkey;
      const balance = BigInt(tokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount);
      if (balance < amountInBaseUnits) {
        return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
      }

      const [destinationTokenAccount] = await findAssociatedTokenPda({
        owner: address(destinationAddress),
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        mint: address(tokenMint),
      });

      const destAccountInfo = await rpc.getAccountInfo(destinationTokenAccount).send();
      const instructions = [];

      if (!destAccountInfo.value) {
        instructions.push(
          getCreateAssociatedTokenInstruction({
            payer: signerValue,
            mint: address(tokenMint),
            owner: address(destinationAddress),
            ata: destinationTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
          })
        );
      }

      instructions.push(
        getTransferCheckedInstruction({
          source: sourceTokenAccount,
          mint: address(tokenInfo.mint),
          destination: destinationTokenAccount,
          authority: signerValue,
          amount: amountInBaseUnits,
          decimals: tokenInfo.decimals,
        })
      );

      signature = await sendTransactionHttp(signerValue, instructions);
    }

    return NextResponse.json({ message: "Send successful", signature }, { status: 200 });

  } catch (error) {
    console.error("Send error:", error);
    return NextResponse.json(
      { message: "Send failed", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}