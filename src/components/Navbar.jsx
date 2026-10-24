import React from 'react';
import { 
  ShieldCheck, FileSearch, User, LogOut, Lock, 
  Sparkles, CheckCircle2, LogIn 
} from 'lucide-react';

export default function Navbar({ onReset, currentUser, onOpenAuth, onLogout, searchCount = 0 }) {
  const remainingSearches = Math.max(0, 5 - searchCount);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#070d1a]/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-[#090f1d] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                Veri<span className="text-cyan-400">Firm</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                v2.5 INTEL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Corporate Legitimacy & Job Scam Verification Intelligence
            </p>
          </div>
        </div>

        {/* Live Registry Badges & Search Quota */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-slate-400">
          {/* Search Quota Badge */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unlimited Scans Active</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${
              remainingSearches === 0
                ? 'bg-rose-950/70 border-rose-800 text-rose-300 animate-pulse'
                : remainingSearches <= 2
                  ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                remainingSearches === 0 ? 'bg-rose-400' : remainingSearches <= 2 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}></span>
              <span>Free Searches: <strong className="text-white">{remainingSearches}/5</strong> left</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Evidence-Based Verification</span>
          </div>
        </div>

        {/* Actions & User Profile */}
        <div className="flex items-center gap-3">
          {/* Mobile search count badge */}
          {!currentUser && (
            <div className="lg:hidden text-[11px] font-mono px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
              <strong className={remainingSearches === 0 ? 'text-rose-400' : 'text-cyan-400'}>{remainingSearches}</strong>/5 left
            </div>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all hover:border-slate-600 shadow-sm"
          >
            <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">New Verification</span>
          </button>

          {/* User Profile or Login Trigger */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {currentUser.picture ? (
                    <img src={currentUser.picture} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (currentUser.name || currentUser.email || 'U').substring(0, 2)
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {currentUser.name || currentUser.email.split('@')[0]}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Member</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-800 hover:bg-rose-950/30 text-slate-400 hover:text-rose-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth(false)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
