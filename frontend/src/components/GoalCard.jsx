import { CalendarDays, PiggyBank } from "lucide-react";
import ProgressBar from "./ProgressBar.jsx";

function computeMonthlyRequirement(goal) {
  if (!goal.target_date) return null;

  const now = new Date();
  const start = goal.start_date ? new Date(goal.start_date) : now;
  const target = new Date(goal.target_date);
  if (target <= now) return null;

  const toMonths = (from, to) =>
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());

  const monthsRemaining = Math.max(1, toMonths(now, target));
  const totalMonths = Math.max(1, toMonths(start, target));
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  const monthlyRequirement = remaining / monthsRemaining;

  // Consider "high" if you need to save significantly more than the average pace
  const averagePace = goal.target_amount / totalMonths;
  const isHigh = monthlyRequirement > averagePace * 1.5 || monthsRemaining <= 1;

  return {
    value: monthlyRequirement,
    isHigh
  };
}

export default function GoalCard({ goal, onDepositClick }) {
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  const monthly = computeMonthlyRequirement(goal);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-700/70 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/60 backdrop-blur-xl">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-semibold text-slate-50">
                {goal.name}
              </h3>
            </div>
            {goal.target_date && (
              <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                <CalendarDays className="h-3 w-3" />
                <span>Target by {goal.target_date}</span>
              </div>
            )}
          </div>
          <div className="text-right text-xs text-slate-400">
            <div>Target</div>
            <div className="font-semibold text-slate-100">
              KSh {goal.target_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <ProgressBar current={goal.current_amount} target={goal.target_amount} />

        <div className="mt-1 flex items-center justify-between text-xs text-slate-300">
          <span>
            Remaining:{" "}
            <span className="font-semibold text-emerald-300">
              KSh {remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </span>
          {goal.current_amount >= goal.target_amount && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              Goal reached
            </span>
          )}
        </div>

        {monthly && (
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Monthly requirement</span>
            <span
              className={`rounded-full px-2 py-0.5 font-semibold ${
                monthly.isHigh
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              KSh {monthly.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDepositClick(goal)}
        className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-50/90 px-3 py-1.5 text-sm font-medium text-slate-950 shadow-md shadow-slate-950/60 transition hover:bg-white"
      >
        Add deposit
      </button>
    </div>
  );
}


