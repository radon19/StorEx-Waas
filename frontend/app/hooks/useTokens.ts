import { useEffect, useState } from "react";
import { TokenDetails } from "../lib/constants";
import axios from "axios";

export interface TokenWithBalance extends TokenDetails{
    balance:number,
    usdBalance : number
}

export function useTokens(address:string) {
    const [TokenBalances, setTokenBalances] = useState<{
        totalBalance : number,
        tokens : TokenWithBalance[]
    } | null >(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      axios.get(`/api/tokens?address=${address}`)
        .then((res) => {
            setTokenBalances(res.data);
            setLoading(false);
        })
    
    }, [])

    return{
        loading, TokenBalances
    }

}