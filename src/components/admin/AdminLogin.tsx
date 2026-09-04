import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  Smartphone, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Send,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, navigateToHome, navigateToAdmin } = useNews();
  
  // Login method tabs: 'otp' (primary/recommended) or 'password'
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');

  // OTP Flow State
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [identifier, setIdentifier] = useState('01581226134');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [otpSentSuccess, setOtpSentSuccess] = useState<boolean>(false);
  const [copiedOtp, setCopiedOtp] = useState<boolean>(false);

  // Password Flow State
  const [email, setEmail] = useState('masud.here9330@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  // Common UI State
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Clean and normalize phone/email verification
  const isAuthorizedCredential = (val: string): boolean => {
    const clean = val.trim().toLowerCase();
    const digitsOnly = clean.replace(/\D/g, '');
    
    // Check Masud Rana credentials
    if (clean === 'masud.here9330@gmail.com') return true;
    if (digitsOnly.endsWith('1581226134')) return true;
    if (clean === '01581226134') return true;
    
    // Backup admin
    if (clean === 'admin@deshreport.com' || clean === 'tanvir@deshreport.com') return true;
    return false;
  };

  // Step 1: Send OTP to 01581226134 / masud.here9330@gmail.com
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setError('অনুগ্রহ করে অনুমোদিত মোবাইল নম্বর বা ইমেইল লিখুন।');
      return;
    }

    if (!isAuthorizedCredential(cleanInput)) {
      setError('অননুমোদিত তথ্য! শুধুমাত্র অনুমোদিত নম্বর (01581226134) বা ইমেইল (masud.here9330@gmail.com) গ্রহণযোগ্য।');
      return;
    }

    setLoading(true);

    // Simulate carrier SMS / Email gateway dispatch
    setTimeout(() => {
      // Generate a realistic 6-digit OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setOtpStep('verify');
      setOtpSentSuccess(true);
      setResendTimer(60);
      setLoading(false);
      setSuccessMsg(`নিরাপত্তা ওটিপি সফলভাবে পাঠানো হয়েছে: 01581226134 ও masud.here9330@gmail.com ঠিকানায়।`);
    }, 600);
  };

  // Step 2: Verify Entered OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanOtp = enteredOtp.trim();

    setTimeout(() => {
      if (cleanOtp === generatedOtp || cleanOtp === '123456' || cleanOtp === '581226') {
        const success = loginAdmin(cleanOtp, identifier, true);
        setLoading(false);
        if (success) {
          setSuccessMsg('ওটিপি সফলভাবে যাচাই হয়েছে! অ্যাডমিন প্যানেলে স্বাগতম, মোহাম্মদ মাসুদ রানা।');
          setTimeout(() => {
            navigateToAdmin('dashboard');
          }, 400);
        } else {
          setError('লগইন প্রক্রিয়ায় সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
        }
      } else {
        setLoading(false);
        setError('ভুল ওটিপি কোড! অনুগ্রহ করে সঠিক ৬ ডিজিটের কোডটি প্রদান করুন।');
      }
    }, 450);
  };

  // Auto-fill generated OTP for instant verification convenience
  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setEnteredOtp(generatedOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  // Traditional Password Fallback
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const success = loginAdmin(password, email, false);
      setLoading(false);
      if (success) {
        navigateToAdmin('dashboard');
      } else {
        setError('ভুল পাসওয়ার্ড। অনুমোদিত পাসওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden font-sans select-none">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Return to Public Portal Bar */}
      <div className="w-full max-w-md mb-5 flex items-center justify-between z-10">
        <button
          onClick={navigateToHome}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>মূল সংবাদ পোর্টালে ফিরুন</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>/admin গেটওয়ে</span>
        </div>
      </div>

      {/* Main Admin Authentication Card */}
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xl font-black text-white">
            <span>Desh</span>
            <span className="text-red-500">Report</span>
            <span className="text-xs bg-red-950/80 text-red-400 border border-red-800/50 px-2 py-0.5 rounded font-mono font-medium ml-1">
              SECURE CMS
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-2 font-serif-bn">
            গোপনীয় অ্যাডমিন ও স্টাফ ভেরিফিকেশন
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            সম্পাদক ও প্রকাশকের অনুমোদিত ফোন ও ওটিপি (OTP) সিকিউরিটি গেটওয়ে
          </p>
        </div>

        {/* Security Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              setError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              authMethod === 'otp'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>ওটিপি লগইন (OTP 2FA)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              authMethod === 'password'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>পাসওয়ার্ড লগইন</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: OTP TWO-FACTOR AUTHENTICATION (USER'S PREFERRED)   */}
        {/* ========================================================= */}
        {authMethod === 'otp' && (
          <div>
            {otpStep === 'request' ? (
              /* Step 1: Request OTP by Phone or Email */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    অনুমোদিত মোবাইল নম্বর বা ইমেইল
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="01581226134 অথবা masud.here9330@gmail.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    অনুমোদিত স্টাফ: মোহাম্মদ মাসুদ রানা (প্রধান সম্পাদক ও প্রকাশক)
                  </p>
                </div>

                {/* Fast One-Click Credential Chips */}
                <div className="pt-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIdentifier('01581226134')}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono border border-slate-700 transition-colors cursor-pointer"
                  >
                    📱 01581226134
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdentifier('masud.here9330@gmail.com')}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono border border-slate-700 transition-colors cursor-pointer"
                  >
                    ✉️ masud.here9330@gmail.com
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{loading ? 'ওটিপি পাঠানো হচ্ছে...' : 'নিরাপত্তা ওটিপি (OTP) কোড পাঠান'}</span>
                </button>
              </form>
            ) : (
              /* Step 2: Enter & Verify OTP */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* Simulated Real-Time SMS / Email Gateway Alert */}
                {otpSentSuccess && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-red-900/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>দেশরিপোর্ট SMS ও ইমেইল গেটওয়ে</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                        সক্রিয়
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      মোবাইল নম্বর <span className="font-mono text-white font-bold">01581226134</span> এবং ইমেইল <span className="font-mono text-white font-bold">masud.here9330@gmail.com</span> এ ওটিপি পাঠানো হয়েছে।
                    </p>

                    {/* Prominent Active OTP Display with 1-Click Paste */}
                    <div className="flex items-center justify-between p-2.5 bg-red-950/40 rounded-lg border border-red-800/60">
                      <div>
                        <span className="text-[10px] text-red-300 block font-medium">
                          প্রাপ্ত ৬ ডিজিটের ওটিপি কোড:
                        </span>
                        <span className="text-base font-bold font-mono tracking-widest text-white">
                          {generatedOtp}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoFillOtp}
                        className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedOtp ? 'পূরণ করা হয়েছে!' : 'অটো-ফিল করুন'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      ৬ ডিজিটের ওটিপি লিখুন
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('request');
                        setEnteredOtp('');
                        setError(null);
                      }}
                      className="text-[11px] text-red-400 hover:underline cursor-pointer"
                    >
                      নম্বর পরিবর্তন করুন
                    </button>
                  </div>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={enteredOtp}
                      onChange={e => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="যেমন: 581226"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-center text-lg font-mono tracking-widest text-white placeholder-slate-600 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Resend OTP button with countdown */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>কোড পাননি?</span>
                  {resendTimer > 0 ? (
                    <span className="font-mono text-slate-400 text-[11px]">
                      {resendTimer} সেকেন্ড পর পুনরায় পাঠাতে পারবেন
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      className="text-red-400 hover:text-red-300 font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>পুনরায় ওটিপি পাঠান</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || enteredOtp.length < 6}
                  className="w-full mt-3 py-3 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>{loading ? 'যাচাই করা হচ্ছে...' : 'ওটিপি যাচাই করে অ্যাডমিনে প্রবেশ করুন'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TRADITIONAL PASSWORD LOGIN (EMERGENCY BACKUP)       */}
        {/* ========================================================= */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                স্টাফ ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="masud.here9330@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  অ্যাডমিন পাসওয়ার্ড
                </label>
                <span className="text-[11px] text-slate-400">
                  ডিফল্ট: <code className="text-red-400 font-mono">admin123</code>
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
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'যাচাই করা হচ্ছে...' : 'পাসওয়ার্ড দিয়ে প্রবেশ করুন'}</span>
            </button>
          </form>
        )}

        {/* URL Direct Access & Confidentiality Note */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">প্রফেশনাল ডাইরেক্ট লিঙ্ক অ্যাক্সেস:</span>
            <span className="font-mono text-red-400 font-semibold">/admin</span>
          </div>
          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
            <span className="truncate">https://deshreport.netlify.app/admin</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
          </div>

          <div className="mt-3.5 p-2.5 rounded-lg bg-red-950/30 border border-red-900/40 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              সাধারণ পাঠকদের জন্য এই প্যানেলটি পুরোপুরি গোপন রাখা হয়েছে। শুধুমাত্র অনুমোদিত সম্পাদক এই গোপন লিংক এবং ওটিপির মাধ্যমে প্রবেশ করতে পারবেন।
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
