import { useState } from "react";

export default function DepositForm({ goal, isOpen, onClose, onDeposit }) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !goal) return null;

  const reset = () => {
    setAmount("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount) {
      setError("Please enter an amount.");
      return;
    }

    setSubmitting(true);
    try {
      await onDeposit(goal.id, parseFloat(amount));
      reset();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add deposit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/80">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-50">
            Add deposit to {goal.name}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Current balance:{" "}
            <span className="font-semibold text-slate-100">
              KSh {goal.current_amount.toFixed(2)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400">
              {error}
            </p>
          )}

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400 hover:shadow-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Add deposit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

