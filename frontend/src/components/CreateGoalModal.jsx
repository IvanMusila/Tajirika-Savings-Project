import { useState } from "react";
import { Calendar, Plus } from "lucide-react";

function CreateGoalModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !targetAmount) return;
    setLoading(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          target_amount: parseFloat(targetAmount),
          target_date: targetDate || null
        })
      });

      if (!res.ok) {
        console.error("Failed to create goal");
        return;
      }

      const data = await res.json();
      onCreated?.(data);
      setName("");
      setTargetAmount("");
      setTargetDate("");
      onClose?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-50">Create Savings Goal</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Goal name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Phone, Emergency Fund"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Target amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-medium text-slate-300">
              <Calendar className="h-3 w-3" />
              Target date (optional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name || !targetAmount}
            className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            <span>{loading ? "Creating..." : "Create goal"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGoalModal;

