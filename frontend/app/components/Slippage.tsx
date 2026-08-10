
export function Slippage({ setSlippage, slippage }: {
  setSlippage: (slip: string) => void,
  slippage: string
}) {


  const options = ["0.5", "1.5", "3"];
  return <div className="flex items-center justify-between mb-8 px-2">
    <div>
      Coversion rate
    </div>

    <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm font-medium text-slate-600">
      <span className="px-3 text-black-400 font-semibold">Slippage :</span>

      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setSlippage(opt)}
          className={`px-4 py-1.5 rounded-xl transition-all ${slippage === opt
            ? "bg-slate-900 text-white  "
            : "hover:bg-slate-100 text-slate-600"
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
}

