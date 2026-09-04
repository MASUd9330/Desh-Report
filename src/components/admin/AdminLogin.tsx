import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Lock, Mail, KeyRound, Eye, EyeOff, ArrowLeft, ShieldCheck, Newspaper, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, navigateToHome, navigateToAdmin } = useNews();
  const [email, setEmail] = useState('admin@deshreport.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const success = loginAdmin(password, email);
      setLoading(false);
      if (success) {
        navigateToAdmin('dashboard');
      } else {
        setError('Invalid credentials. Please use password "admin123" or use the instant demo button.');
      }
    }, 400);
  };

  const handleQuickLogin = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('admin123');
    loginAdmin('admin123', roleEmail);
    navigateToAdmin('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Return to Public Portal Button */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <button
          onClick={navigateToHome}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to DeshReport Public Portal</span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono">
          v2.4 Editorial Core
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xl font-black text-white">
            <span>Desh</span>
            <span className="text-red-500">Report</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-medium ml-1">
              CMS
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-2">
            Newsroom Staff & Editorial Login
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted gateway for journalists, editors, and administrators
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="editor@deshreport.com"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <span className="text-[11px] text-slate-400">
                Default: <code className="text-red-400 font-mono">admin123</code>
              </span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Newsroom'}</span>
          </button>
        </form>

        {/* One-Click Quick Demo Sign-Ins */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-2 text-center">
            Instant Test Login (1-Click)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('Masud.here9330@gmail.com')}
              className="px-2.5 py-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition-colors text-left flex items-center gap-2 cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold block">Masud (Admin)</span>
                <span className="text-[10px] text-slate-400 truncate block">Masud.here9330...</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@deshreport.com')}
              className="px-2.5 py-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition-colors text-left flex items-center gap-2 cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold block">Tanvir Ahmed</span>
                <span className="text-[10px] text-slate-400 truncate block">Super Admin</span>
              </div>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-5 p-3 rounded-lg bg-slate-950/70 border border-slate-800/60 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
          <Newspaper className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            Unauthorized access attempts are logged and monitored. Only registered editorial staff members may publish or edit news articles.
          </span>
        </div>
      </div>
    </div>
  );
};
