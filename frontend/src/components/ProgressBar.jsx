export default function ProgressBar({ current, target }) {
  const safeTarget = target > 0 ? target : 1;
  const percentage = Math.min(100, Math.round((current / safeTarget) * 100));

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs text-slate-300">
        <span>{percentage}% saved</span>
        <span>
          KSh {current.toFixed(2)} / KSh {target.toFixed(2)}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border border-slate-700/80 bg-slate-900/40 shadow-inner shadow-slate-950/70 backdrop-blur">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}


