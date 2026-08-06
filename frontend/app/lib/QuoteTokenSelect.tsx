"use client";

import TokenSelectDropdown from "./TokenSelectDropdown";
import { SUPPORTED_TOKENS } from "./tokens";
import type { TokenDetails } from "./tokens";

interface QuoteTokenSelectProps {
  selected: TokenDetails;
  onChange: (token: TokenDetails) => void;
  /** mint of the token currently chosen in the base dropdown — hidden here so the same token can't be picked twice */
  excludeMint?: string;
}

export default function QuoteTokenSelect({ selected, onChange, excludeMint }: QuoteTokenSelectProps) {
  return (
    <TokenSelectDropdown
      tokens={SUPPORTED_TOKENS}
      selected={selected}
      onChange={onChange}
      excludeMint={excludeMint}
      label="Select quote token"
    />
  );
}
