export function Slippage({
  setSlippage,
  slippage,
}: {
  setSlippage: (slip: string) => void;
  slippage: string;
}) {
  const options = ["0.1", "0.5", "1", "3"];

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        Slippage Tolerance
      </span>
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-abyss-800/50 border border-abyss-700">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSlippage(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              slippage === opt
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "text-slate-500 hover:text-slate-200 hover:bg-abyss-700/50"
            }`}
          >
            {opt}%
          </button>
        ))}
      </div>
    </div>
  );
}