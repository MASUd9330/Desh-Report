import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Lock, Mail, KeyRound, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, navigateToHome, navigateToAdmin } = useNews();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!password.trim()) { setError('অনুগ্রহ করে আপনার পাসওয়ার্ড লিখুন।'); return; }
    setLoading(true);
    const success = await loginAdmin(password, identifier);
    setLoading(false);
    if (success) navigateToAdmin('dashboard');
    else setError('ভুল ইমেইল/আইডি অথবা পাসওয়ার্ড।');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden font-sans select-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md mb-5 flex items-center justify-between z-10">
        <button onClick={navigateToHome} className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800"><ArrowLeft className="w-3.5 h-3.5" /><span>মূল সংবাদ পোর্টালে ফিরুন</span></button>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><span>সুরক্ষিত সার্ভার সংযোগ</span></div>
      </div>
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30 mb-3"><Lock className="w-6 h-6" /></div>
          <div className="flex items-center justify-center gap-1.5 text-xl font-black text-white"><span>Desh</span><span className="text-red-500">Report</span><span className="text-xs bg-red-950/80 text-red-400 border border-red-800/50 px-2 py-0.5 rounded font-mono font-medium ml-1">CMS</span></div>
          <h2 className="text-base font-bold text-white mt-2 font-serif-bn">প্রশাসনিক পোর্টাল লগইন</h2>
          <p className="text-xs text-slate-400 mt-1">সার্ভার-ভিত্তিক সেশন দিয়ে সুরক্ষিত প্রবেশদ্বার</p>
        </div>
        {error && <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-start gap-2.5"><AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span>{error}</span></div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-semibold text-slate-300 mb-1.5">ইমেইল বা অ্যাডমিন আইডি (ঐচ্ছিক)</label><div className="relative"><Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" /><input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="অ্যাডমিন আইডি" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-sans" /></div></div>
          <div><label className="block text-xs font-semibold text-slate-300 mb-1.5">অ্যাডমিন পাসওয়ার্ড</label><div className="relative"><KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" /><input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="আপনার পাসওয়ার্ড লিখুন" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-sans" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer" title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
          <button type="submit" disabled={loading} className="w-full mt-3 py-3 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">{loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}<span>{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</span></button>
        </form>
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center"><p className="text-[11px] text-slate-500">পাসওয়ার্ড ব্রাউজারে যাচাই করা হয় না; সুরক্ষিত HttpOnly সেশন ব্যবহার করা হচ্ছে।</p></div>
      </div>
    </div>
  );
};
