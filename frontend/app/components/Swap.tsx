"use client"

import { useState } from "react";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";


export function Swap() {

    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);


    return <div>
        <SwapInputRow onSelect={(asset)=>{
            setBaseAsset(asset)
        }}
        selectedToken = {baseAsset}
        />
<SwapInputRow onSelect={(asset)=>{
            setBaseAsset(asset)
        }}
        selectedToken = {quoteAsset}
        />

    </div>
}

function SwapInputRow({onSelect, selectedToken}:{
    onSelect : (asset:TokenDetails)=>void,
    selectedToken  : TokenDetails
}) {
    
    return <div className="border flex justify-between">
        <AssetSelector selectedToken={selectedToken }  />

    </div>
}

function AssetSelector({selectedToken}:{
    selectedToken : TokenDetails
}) {
    return <div>
        <select>

        </select>
    </div>
}