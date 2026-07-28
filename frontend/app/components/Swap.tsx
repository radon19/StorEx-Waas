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
        />

    </div>
}

function SwapInputRow({onSelect}:{
    onSelect : (asset:TokenDetails)=>void
}) {
    
    return <div className="border flex justify-between">
        <AssetSelector  />

    </div>
}

function AssetSelector({selectedToken}:{
    selectedToken : TokenDetails
}) {
    return <div>

    </div>
}