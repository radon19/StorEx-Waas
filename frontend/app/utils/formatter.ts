export function toAtomic(amount: string, isSol: boolean): string {
  const decimals = isSol ? 9 : 6;

  const trimmed = amount.trim();
  if (!trimmed || trimmed === "." || !/^\d*\.?\d*$/.test(trimmed)) {
    return "0";
  }

  const [wholeRaw, fractionRaw = ""] = trimmed.split(".");
  const whole = wholeRaw === "" ? "0" : wholeRaw;
  const fraction = fractionRaw.slice(0, decimals).padEnd(decimals, "0");

  const combined = `${whole}${fraction}`.replace(/^0+(?=\d)/, "");
  return BigInt(combined).toString();
}

