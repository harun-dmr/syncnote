"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Bitte gib deine E-Mail-Adresse ein."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Ungültige E-Mail-Adresse."); return; }
    if (password.length < 6) { setError("Passwort muss mindestens 6 Zeichen haben."); return; }
    if (mode === "signup" && !name.trim()) { setError("Bitte gib deinen Namen ein."); return; }
    setLoading(true);
    const displayName = mode === "signup" && name.trim() ? name.trim() : email.split("@")[0] || "Nutzer";
    localStorage.setItem("syncnotes-session", JSON.stringify({ name: displayName, email }));
    setTimeout(() => router.push("/dashboard"), 900);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03030a] px-4">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-orb absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-[100px]" />
        <div className="animate-orb-reverse absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-indigo-700/20 blur-[120px]" />
        <div className="animate-orb absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-800/10 blur-[80px]" style={{ animationDelay: "4s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glass card */}
      <div className="animate-fade-up relative z-10 w-full max-w-md">
        <div className="glass relative overflow-hidden rounded-3xl p-8 shadow-2xl shadow-violet-950/50">
          {/* Top gradient bar */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg glow-violet">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">SyncNotes</h1>
              <p className="mt-1 text-sm text-slate-400">
                {mode === "login" ? "Schön, dich wieder zu sehen." : "Erstelle deinen Account."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <div className="animate-fade-up">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition duration-200 focus:border-violet-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="max@beispiel.de"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition duration-200 focus:border-violet-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-violet-500/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition duration-200 focus:border-violet-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-violet-500/30"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-sm font-semibold shadow-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin-slow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                  </svg>
                  Wird geladen…
                </>
              ) : mode === "login" ? "Einloggen →" : "Konto erstellen →"}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] px-4 py-3">
            <div className="h-1.5 w-1.5 rounded-full bg-violet-400 glow-sm-violet" />
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-400">Demo:</span> Beliebige Daten eingeben
            </p>
          </div>

          {/* Toggle */}
          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "login" ? "Noch kein Konto?" : "Bereits registriert?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-violet-400 transition hover:text-violet-300"
            >
              {mode === "login" ? "Registrieren" : "Einloggen"}
            </button>
          </p>

          {/* Bottom gradient bar */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}
