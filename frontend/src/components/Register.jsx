import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx"

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!onRegister) return;

    setSubmitting(true);
    try {
      await onRegister({ name: name.trim(), email: email.trim(), password });
    } catch (err) {
      setError(err.message || "Failed to register.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {<Navbar />}
    <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl border border-slate-700/70 bg-slate-900/60 p-6 shadow-2xl shadow-slate-950/70 backdrop-blur-2xl">
        <div className="mb-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Tajirika
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-50">
            Create an account
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Set up your profile to start tracking your savings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200">Full name</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/40 py-2.5 pl-9 pr-3 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-slate-950/60 outline-none ring-1 ring-transparent transition focus:border-emerald-400 focus:ring-emerald-500/60"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200">Email</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/40 py-2.5 pl-9 pr-3 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-slate-950/60 outline-none ring-1 ring-transparent transition focus:border-emerald-400 focus:ring-emerald-500/60"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-900/40 py-2.5 pl-9 pr-3 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-slate-950/60 outline-none ring-1 ring-transparent transition focus:border-emerald-400 focus:ring-emerald-500/60"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                Confirm password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-900/40 py-2.5 pl-9 pr-3 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-slate-950/60 outline-none ring-1 ring-transparent transition focus:border-emerald-400 focus:ring-emerald-500/60"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
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
            {submitting ? "Creating account..." : "Create account"}
          </button>

          <p className="text-xs text-center text-slate-400">
            Already have an account? <Link to="/login" className="text-emerald-300 hover:underline text-sm">Log in</Link>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
}

