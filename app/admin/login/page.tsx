"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Successful login -> redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("2668");
    setError(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }} 
      />

      <div className="relative w-full max-w-md">
        {/* Top Header Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs font-medium tracking-wide mb-4">
            <ShieldCheck size={14} className="text-purple-400" />
            <span>PORTFOLIO CMS CONTROL PANEL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Administrator Sign In
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-sm">
            Authenticate to manage portfolio projects, live entries, and database content.
          </p>
        </div>

        {/* Login Card */}
        <div className="relative rounded-2xl border border-white/10 bg-[#0f0f17]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 sm:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs leading-relaxed">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 focus:bg-white/[0.06] text-white text-sm outline-none transition-all duration-200 placeholder:text-slate-600 focus:ring-1 focus:ring-purple-500/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 tracking-wider uppercase">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500/60 focus:bg-white/[0.06] text-white text-sm outline-none transition-all duration-200 placeholder:text-slate-600 focus:ring-1 focus:ring-purple-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl font-medium text-sm text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] border border-purple-400/30 shadow-[0_0_24px_rgba(168,85,247,0.3)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick preset selector */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest text-center mb-3">
              Configured Authorized Accounts
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickFill("mogli@gmail.com")}
                className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-purple-500/30 text-left transition-all text-xs group"
              >
                <span className="block font-medium text-slate-300 group-hover:text-white truncate">mogli@gmail.com</span>
                <span className="block text-[10px] text-slate-500 font-mono mt-0.5">Click to fill</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("chuzzii@gmail.com")}
                className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-purple-500/30 text-left transition-all text-xs group"
              >
                <span className="block font-medium text-slate-300 group-hover:text-white truncate">chuzzii@gmail.com</span>
                <span className="block text-[10px] text-slate-500 font-mono mt-0.5">Click to fill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            <span>&larr;</span>
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
