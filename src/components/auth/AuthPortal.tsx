"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Building2,
  Mail,
  Lock,
  User,
  ArrowRight,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function AuthPortal() {
  const { signUp, login } = useAppStore();
  const [mode, setMode] = useState<"SIGN_UP" | "SIGN_IN">("SIGN_UP");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "SIGN_UP") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid work email address.");
        return;
      }
      if (!companyName.trim()) {
        setError("Please enter your company or organization name.");
        return;
      }
      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            companyName: companyName.trim(),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to create account.");
        }

        // Direct instant entry into workspace
        signUp({
          name: data.user?.name || name.trim(),
          email: data.user?.email || email.trim(),
          companyName: data.user?.companyName || companyName.trim(),
        });
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred during signup.");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter your email address to sign in.");
        return;
      }
      if (!password) {
        setError("Please enter your password.");
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Invalid login credentials.");
        }

        // Direct instant login
        login({
          email: data.user?.email || email.trim(),
          name: data.user?.name || email.split("@")[0],
        });
      } catch (err: any) {
        setError(err.message || "Sign in failed. Check your email and password.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative selection:bg-[var(--brand-primary)] selection:text-white">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full opacity-[0.06] dark:opacity-[0.10] blur-[140px]"
          style={{ backgroundColor: "var(--brand-primary, #3B82F6)" }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand OS Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-xl shadow-blue-500/20 mb-2">
            <div className="h-full w-full rounded-[14px] bg-white dark:bg-slate-950 flex items-center justify-center shadow-inner">
              <ShieldCheck className="h-7 w-7 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            OmniBrand <span className="text-blue-600">OS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Enterprise Autonomous Marketing & Customer Engagement
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-xl space-y-6">
          {/* Sign Up / Sign In Mode Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode("SIGN_UP");
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all text-center ${
                mode === "SIGN_UP"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Sign Up (New Company)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("SIGN_IN");
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all text-center ${
                mode === "SIGN_IN"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "SIGN_UP" && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Company / Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aivon Global Brands"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="elena@aivon.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === "SIGN_IN" && (
                  <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="brand"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 !text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin !text-white" />
                  <span className="!text-white font-bold text-sm">Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="!text-white font-bold text-sm">
                    {mode === "SIGN_UP" ? "Create Account & Continue" : "Sign In to Workspace"}
                  </span>
                  <ArrowRight className="h-4 w-4 !text-white stroke-[2.5]" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Enterprise Security Badges Footer */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex-wrap">
          <div className="flex items-center gap-1.5">
            <LockKeyhole className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Supabase Auth & RLS</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Encrypted Session Cookies</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>PostgreSQL Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
