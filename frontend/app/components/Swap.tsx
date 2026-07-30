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
        <AssetSelector selectedToken={selectedToken } onSelect={onSelect}  />

    </div>
}

function AssetSelector({selectedToken,onSelect}:{
    selectedToken : TokenDetails,
    onSelect : (asset:TokenDetails)=>void
}) {
    return <div>
        <select>
            <option selected><img src={selectedToken.image}/>{selectedToken.name}</option>
            {SUPPORTED_TOKENS.filter(x=>x.name!=selectedToken.name).map(x=><option onClick={()=>onSelect(x)}><img src={x.image}/>{x.name}</option>)}
        </select>
    </div>
}