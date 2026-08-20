import axios from "axios";

export async function handleSend({
  publicKey, 
  amount, 
  address, 
  tokenMint, 
  setIsLoading
}: {
  publicKey: string;
  amount: string;
  address: string;
  tokenMint: string;
  setIsLoading: (isLoading: boolean) => void;
}) {
  setIsLoading(true);
  
  try {
    const { data } = await axios.post("/api/send", {
      publicKey,
      amount,
      address,
      tokenMint, 
    });

    return data.signature;
  } catch (error) {
    console.error("Error in Send:", error);
    return null;
  } finally {
    setIsLoading(false);
  }
}