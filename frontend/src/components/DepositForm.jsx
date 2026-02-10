import { useState } from "react";
import { ArrowDownRight } from "lucide-react";

function DepositForm({ goalId, onDeposited }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/goals/${goalId}/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      if (!res.ok) {
        console.error("Failed to deposit");
        return;
      }

      const data = await res.json();
      onDeposited?.(data.goal);
      setAmount("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <div className="flex-1">
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to deposit"
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !amount}
        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        <ArrowDownRight className="w-4 h-4" />
        <span>{loading ? "Saving..." : "Deposit"}</span>
      </button>
    </form>
  );
}

export default DepositForm;

