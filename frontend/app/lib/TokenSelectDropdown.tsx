"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { TokenDetails } from "./tokens";

interface TokenSelectDropdownProps {
  tokens: TokenDetails[];
  selected: TokenDetails;
  onChange: (token: TokenDetails) => void;
  excludeMint?: string;
  label?: string;
}

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
        className="flex items-center gap-2 rounded-full bg-abyss-800/50 border border-abyss-700 p-2.5 text-sm font-semibold text-slate-100 transition-colors hover:bg-abyss-800 hover:border-abyss-600"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={selected.image} alt="" className="h-6 w-6 rounded-full object-cover" />
        <span>{selected.name}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul role="listbox" className="absolute z-20 mt-2 w-44 overflow-hidden rounded-xl border border-abyss-700 bg-abyss-900/95 backdrop-blur-xl py-1 shadow-2xl">
          {visibleTokens.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500">No tokens available</li>
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
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-abyss-800/50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={token.image} alt="" className="h-5 w-5 rounded-full object-cover" />
                  <span className="flex-1 font-medium text-slate-100">{token.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-teal-400" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}