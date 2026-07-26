import { TokenWithBalance } from "@/app/hooks/useTokens"

export function TokenList({tokens}: {
    tokens: TokenWithBalance[]
}) {
    return <div>
        {tokens.map(t => <TokenRow key={t.name} token={t} />)}
    </div>
}

function TokenRow({token}: {
    token: TokenWithBalance
}) {
    return <div className="flex justify-between pb-2 ">
        <div className="flex">
            <div>
                <img src={token.image} className="h-10 w-10 rounded-full mr-2" />
            </div>
            <div>
                <div className="font-bold">
                    {token.name}
                </div>
                <div className="font-slim">
                    1 {token.name} = ${token.price?.toFixed(2)}
                </div>
            </div>
        </div>
        <div>
            <div>
                <div className="font-bold flex justify-end">
                    {token.usdBalance.toFixed(2)} USD
                </div>
                <div className="font-slim flex justify-end">
                    {token.balance.toFixed(2)} {token.name}
                </div>
            </div>
        </div>
    </div>
}