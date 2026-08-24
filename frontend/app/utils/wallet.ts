import { generateKeyPairSigner, getAddressEncoder } from "@solana/kit";

export async function createWallet() {
  const signer = await generateKeyPairSigner(true);

  const pkcs8Buffer = await crypto.subtle.exportKey("pkcs8", signer.keyPair.privateKey);
  const privateBytes = new Uint8Array(pkcs8Buffer).slice(-32);

  const publicBytes = getAddressEncoder().encode(signer.address); 

  const secretKey64 = Array.from(new Uint8Array([...privateBytes, ...publicBytes]));

  return {
    address: signer.address,
    secretKey: JSON.stringify(secretKey64),
  };
}