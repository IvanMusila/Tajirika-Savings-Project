import { PiggyBank, PlusCircle } from "lucide-react";
import GoalCard from "./GoalCard.jsx";
import NewGoalModal from "./NewGoalModal.jsx";
import DepositForm from "./DepositForm.jsx";
import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:5000/api";

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const fetchGoals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/goals`);
      if (!res.ok) {
        throw new Error("Failed to fetch goals.");
      }
      const data = await res.json();
      setGoals(
        (data.goals || []).map((g) => ({
          ...g,
          target_amount: Number(g.target_amount),
          current_amount: Number(g.current_amount)
        }))
      );
      setTotalSavings(Number(data.total_savings || 0));
    } catch (err) {
      setError(err.message || "Something went wrong loading goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const monthlyObligations = useMemo(() => {
    const now = new Date();
    const toMonths = (from, to) =>
      (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());

    return goals.reduce((sum, goal) => {
      if (!goal.target_date) return sum;
      const start = goal.start_date ? new Date(goal.start_date) : now;
      const target = new Date(goal.target_date);
      if (target <= now) return sum;

      const monthsRemaining = Math.max(1, toMonths(now, target));
      const remaining = Math.max(0, goal.target_amount - goal.current_amount);
      const monthlyReq = remaining / monthsRemaining;
      return sum + (isFinite(monthlyReq) ? monthlyReq : 0);
    }, 0);
  }, [goals]);

  const handleCreateGoal = async (payload) => {
    const res = await fetch(`${API_BASE_URL}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to create goal.");
    }
    await fetchGoals();
  };

  const handleDeposit = async (goalId, amount) => {
    const res = await fetch(`${API_BASE_URL}/goals/${goalId}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to add deposit.");
    }
    await fetchGoals();
  };

  const openDepositForGoal = (goal) => {
    setSelectedGoal(goal);
    setIsDepositOpen(true);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40 backdrop-blur-xl">
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
              Savings Tracker
            </h1>
            <p className="text-xs text-slate-400">
              Create goals, add deposits, and watch your savings grow.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-md shadow-emerald-500/40 transition hover:from-emerald-300 hover:via-emerald-400 hover:to-cyan-300 hover:shadow-emerald-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <PlusCircle className="h-4 w-4" />
          New goal
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/60 backdrop-blur-xl sm:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total saved
          </p>
          <p className="mt-3 text-3xl font-semibold text-emerald-300">
            KSh {totalSavings.toFixed(2)}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/40 p-4 text-xs text-slate-300 shadow-lg shadow-slate-950/60 backdrop-blur-xl sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Monthly obligations
          </p>
          <p className="mt-3 text-2xl font-semibold text-cyan-300">
            KSh {monthlyObligations.toFixed(2)}/mo
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Sum of the monthly amount you need to save across all active goals to
            stay on track.
          </p>
        </div>
      </section>

      <section className="mt-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Active goals
          </h2>
          {loading && (
            <span className="text-xs text-slate-400">Loading goals...</span>
          )}
        </div>

        {error && (
          <div className="mb-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100 backdrop-blur">
            {error}
          </div>
        )}

        {goals.length === 0 && !loading ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400 backdrop-blur-xl">
            No goals yet. Create your first savings goal to get started.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onDepositClick={openDepositForGoal} />
            ))}
          </div>
        )}
      </section>

      <NewGoalModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateGoal}
      />

      <DepositForm
        goal={selectedGoal}
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDeposit={handleDeposit}
      />
    </div>
  );
}

