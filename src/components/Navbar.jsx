import React from 'react';
import { 
  ShieldCheck, FileSearch, User, LogOut, Lock, 
  Sparkles, CheckCircle2, LogIn, Sun, Moon, Languages 
} from 'lucide-react';

export default function Navbar({ 
  onReset, 
  currentUser, 
  onOpenAuth, 
  onLogout, 
  searchCount = 0,
  theme = 'light',
  onToggleTheme,
  lang = 'en',
  onToggleLang,
  t
}) {
  const remainingSearches = Math.max(0, 5 - searchCount);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-[#070d1a]/90 border-b border-slate-200 dark:border-slate-800/80 px-4 lg:px-8 py-3 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="VeriFirm Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-[#090f1d] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Veri<span className="text-blue-600 dark:text-cyan-400">Firm</span>
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-cyan-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-800/50">
                Job Safety
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {lang === 'hi' ? 'कंपनी प्रामाणिकता एवं जॉब स्कैम जांच' : 'Corporate Legitimacy & Job Scam Verification'}
            </p>
          </div>
        </div>

        {/* Search Quota Badge & Evidence Status */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
          {currentUser ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Unlimited Checks Active</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${
              remainingSearches === 0
                ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : remainingSearches <= 2
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                remainingSearches === 0 ? 'bg-rose-500' : remainingSearches <= 2 ? 'bg-amber-500' : 'bg-blue-500 dark:bg-cyan-400'
              }`}></span>
              <span>Free Checks: <strong className="font-bold text-slate-900 dark:text-white">{remainingSearches}/5</strong> left</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Real Lookups Only</span>
          </div>
        </div>

        {/* Actions, Theme Toggle, Language & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search count badge */}
          {!currentUser && (
            <div className="lg:hidden text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <strong className={remainingSearches === 0 ? 'text-rose-600 font-bold' : 'text-blue-600 dark:text-cyan-400 font-bold'}>{remainingSearches}</strong>/5
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Switch Language (English / हिंदी)"
            aria-label="Switch Language"
          >
            <Languages className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
            <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={onReset}
            className="hidden md:flex items-center gap-2 text-xs font-semibold px-3.5 py-2 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
          >
            <FileSearch className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>{lang === 'hi' ? 'नई जांच' : 'New Check'}</span>
          </button>

          {/* User Profile or Login Trigger */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center uppercase">
                  {(currentUser.name || currentUser.email || 'U').substring(0, 2)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[120px]">
                    {currentUser.name || currentUser.email.split('@')[0]}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out"
                className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth(false)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'लॉगिन / साइन अप' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
