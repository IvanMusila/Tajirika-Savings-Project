import { Calendar, PiggyBank } from "lucide-react";
import ProgressBar from "./ProgressBar.jsx";
import DepositForm from "./DepositForm.jsx";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES"
  }).format(value ?? 0);
}

function GoalCard({ goal, onGoalUpdated }) {
  const remaining = Math.max(0, (goal.target_amount ?? 0) - (goal.current_amount ?? 0));
  const progress =
    goal.target_amount && goal.target_amount > 0
      ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
      : 0;

  const targetDateLabel = goal.target_date
    ? new Date(goal.target_date).toLocaleDateString()
    : "No target date";

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/70 to-slate-950 p-4 shadow-lg shadow-slate-950/60">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-50">{goal.name}</h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Target:{" "}
              <span className="font-medium text-slate-100">
                {formatCurrency(goal.target_amount ?? 0)}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-[11px] font-medium text-emerald-400">
          <span>{progress.toFixed(0)}%</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <ProgressBar current={goal.current_amount ?? 0} target={goal.target_amount ?? 1} />
        <div className="flex items-center justify-between text-xs text-slate-400">
          <p>
            Saved:{" "}
            <span className="font-semibold text-slate-100">
              {formatCurrency(goal.current_amount ?? 0)}
            </span>
          </p>
          <p>
            Remaining:{" "}
            <span className="font-semibold text-emerald-400">
              {formatCurrency(remaining)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <div className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{targetDateLabel}</span>
        </div>
      </div>

      <DepositForm goalId={goal.id} onDeposited={onGoalUpdated} />
    </div>
  );
}

export default GoalCard;

