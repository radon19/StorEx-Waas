import { TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { rpc } from "../lib/constants";
import { address } from "@solana/kit";
import { useEffect, useState } from "react";



export function useAccountTokens() {
    const owner = address("FLeQYHRstTpJX2iZZXcFhhFWQffbur255ckooup2mUk");
const [ownerTokens, setOwnerTokens] = useState<any>(null);
const [loading, setLoading] = useState(true);

    useEffect(() => {
       rpc
      .getTokenAccountsByOwner(
        owner,
        { programId: TOKEN_PROGRAM_ADDRESS }, // Use TOKEN_2022_PROGRAM_ADDRESS for Token-2022 tokens
        { encoding: 'jsonParsed' }
      )
      .send().then((response) => {
        setOwnerTokens(response.value);
        console.log(response.value);
        setLoading(false);
      })
    
    }, [])

    

    return {
        loading,
        ownerTokens
    };
  
  }