import { TokenWithBalance } from "../hooks/useTokens";

export default function Send({publicKey,TokenBalances}:
    {
        publicKey:string,
        TokenBalances: {
    totalBalance: number;
    tokens: TokenWithBalance[]  
  }
    }) {
  return (
    <div>


    </div>
  )
}
