function ProgressBar({ current = 0, target = 1 }) {
  const percentage = Math.max(
    0,
    Math.min(100, target > 0 ? (current / target) * 100 : 0)
  );

  return (
    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full bg-emerald-500 transition-[width] duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default ProgressBar;

