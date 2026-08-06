"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { TokenDetails } from "./tokens";

interface TokenSelectDropdownProps {
  tokens: TokenDetails[];
  selected: TokenDetails;
  onChange: (token: TokenDetails) => void;
  /** mint address to hide from the option list (e.g. whatever the paired dropdown has selected) */
  excludeMint?: string;
  label?: string;
}

/**
 * Internal, reusable pill dropdown. Not meant to be dropped into a page directly —
 * BaseTokenSelect and QuoteTokenSelect wrap this with their own token lists / exclusions.
 */
export default function TokenSelectDropdown({
  tokens,
  selected,
  onChange,
  excludeMint,
  label = "Select token",
}: TokenSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleTokens = tokens.filter((token) => token.mint !== excludeMint);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSelect(token: TokenDetails) {
    onChange(token);
    setOpen(false);
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-gray-100 p-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={selected.image} alt="" className="h-6 w-6 rounded-full object-cover" />
        <span>{selected.name}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {visibleTokens.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-400">No tokens available</li>
          )}
          {visibleTokens.map((token) => {
            const isSelected = token.mint === selected.mint;
            return (
              <li key={token.mint}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(token)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={token.image} alt="" className="h-5 w-5 rounded-full object-cover" />
                  <span className="flex-1 font-medium text-gray-900">{token.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-emerald-500" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
