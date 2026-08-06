"use client";

import TokenSelectDropdown from "./TokenSelectDropdown";
import { SUPPORTED_TOKENS } from "./tokens";
import type { TokenDetails } from "./tokens";

interface BaseTokenSelectProps {
  selected: TokenDetails;
  onChange: (token: TokenDetails) => void;
  /** mint of the token currently chosen in the quote dropdown — hidden here so the same token can't be picked twice */
  excludeMint?: string;
}

export default function BaseTokenSelect({ selected, onChange, excludeMint }: BaseTokenSelectProps) {
  return (
    <TokenSelectDropdown
      tokens={SUPPORTED_TOKENS}
      selected={selected}
      onChange={onChange}
      excludeMint={excludeMint}
      label="Select base token"
    />
  );
}
