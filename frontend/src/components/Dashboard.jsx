import { useEffect, useMemo, useState } from "react";
import { PiggyBank, Plus, Wallet } from "lucide-react";
import GoalCard from "./GoalCard.jsx";
import CreateGoalModal from "./CreateGoalModal.jsx";

function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      setGoals(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const totalSavings = useMemo(
    () => goals.reduce((sum, g) => sum + (g.current_amount ?? 0), 0),
    [goals]
  );

  const totalTargets = useMemo(
    () => goals.reduce((sum, g) => sum + (g.target_amount ?? 0), 0),
    [goals]
  );

  const handleGoalCreated = (goal) => {
    setGoals((prev) => [...prev, goal]);
  };

  const handleGoalUpdated = (updatedGoal) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
    );
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-12 pt-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <PiggyBank className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">
              Tajirika Savings Tracker
            </h1>
            <p className="text-xs text-slate-400">
              Track your goals, deposits, and progress in one place.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" />
          <span>New goal</span>
        </button>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Total saved
            </span>
            <Wallet className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-xl font-semibold text-slate-50">
            {new Intl.NumberFormat("en-KE", {
              style: "currency",
              currency: "KES"
            }).format(totalSavings)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs font-medium text-slate-400">Total targets</p>
          <p className="mt-2 text-xl font-semibold text-slate-50">
            {new Intl.NumberFormat("en-KE", {
              style: "currency",
              currency: "KES"
            }).format(totalTargets)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs font-medium text-slate-400">Active goals</p>
          <p className="mt-2 text-xl font-semibold text-slate-50">{goals.length}</p>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-100">Goals</h2>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400">Loading goals...</p>
        ) : goals.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-400">
            No goals yet. Create your first savings goal to get started.
          </div>
        ) : (
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onGoalUpdated={handleGoalUpdated}
              />
            ))}
          </div>
        )}
      </section>

      <CreateGoalModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={handleGoalCreated}
      />
    </main>
  );
}

export default Dashboard;

