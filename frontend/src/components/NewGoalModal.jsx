import { useState, useEffect } from "react";
import { CalendarDays, Target } from "lucide-react";

export default function NewGoalModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().slice(0, 10);
      setStartDate(today);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const reset = () => {
    setName("");
    setTargetAmount("");
    setStartDate("");
    setTargetDate("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !targetAmount || !targetDate) {
      setError("Please provide a name, target amount, and target date.");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        target_amount: parseFloat(targetAmount),
        start_date: startDate || null,
        target_date: targetDate
      });
      reset();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create goal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/70 backdrop-blur-xl">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900/60 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">New savings goal</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-wide text-slate-400 hover:text-slate-100"
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200">Goal name</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Target className="h-4 w-4" />
              </span>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/40 py-2.5 pl-9 pr-3 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-slate-950/60 outline-none ring-1 ring-transparent transition focus:border-emerald-400 focus:ring-emerald-500/60"
                placeholder="iPhone upgrade, vacation fund..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                Target amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/40 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-slate-950/60 outline-none ring-1 ring-transparent transition focus:border-emerald-400 focus:ring-emerald-500/60"
                placeholder="1200"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">Start date</label>
              <input
                type="date"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/40 px-3 py-2.5 text-xs text-slate-50 placeholder:text-slate-500 shadow-inner shadow-slate-950/60 outline-none ring-1 ring-transparent transition focus:border-emerald-400 focus:ring-emerald-500/60"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200">
              Target date (when you want to reach it)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <CalendarDays className="h-4 w-4" />
              </span>
              <input
                type="date"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/40 py-2.5 pl-9 pr-3 text-xs text-slate-50 placeholder:text-slate-500 shadow-inner shadow-slate-950/60 outline-none ring-1 ring-transparent transition focus:border-emerald-400 focus:ring-emerald-500/60"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-amber-300/90">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:from-emerald-300 hover:via-emerald-400 hover:to-cyan-300 hover:shadow-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating..." : "Create goal"}
          </button>
        </form>
      </div>
    </div>
  );
}

