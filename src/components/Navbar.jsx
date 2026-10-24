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
    <header className="sticky top-0 z-40 bg-[#494D5F] text-white border-b border-[#3a3e4f] px-4 lg:px-8 py-3 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="VeriFirm Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8458B3] to-[#A0D2EB] p-0.5 shadow-md shadow-[#8458B3]/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#494D5F] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#A0D2EB]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Veri<span className="text-[#A0D2EB]">Firm</span>
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#8458B3]/30 text-white border border-[#D0BDF4]/40">
                Job Safety
              </span>
            </div>
            <p className="text-xs text-[#E5EAF5]/80 hidden sm:block">
              {lang === 'hi' ? 'कंपनी प्रामाणिकता एवं जॉब स्कैम जांच' : 'Corporate Legitimacy & Job Scam Verification'}
            </p>
          </div>
        </div>

        {/* Search Quota Badge & Evidence Status */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-medium text-white">
          {currentUser ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14803C]/30 border border-[#14803C] text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#A0D2EB]" />
              <span>Unlimited Checks Active</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${
              remainingSearches === 0
                ? 'bg-[#C62828]/30 border-[#C62828] text-white'
                : remainingSearches <= 2
                  ? 'bg-[#B26A00]/30 border-[#B26A00] text-white'
                  : 'bg-[#3a3e4f] border-[#5d6180] text-white'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                remainingSearches === 0 ? 'bg-[#C62828]' : remainingSearches <= 2 ? 'bg-[#B26A00]' : 'bg-[#A0D2EB]'
              }`}></span>
              <span>Free Checks: <strong className="font-bold text-white">{remainingSearches}/5</strong> left</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#3a3e4f] border border-[#5d6180] text-white">
            <span className="w-2 h-2 rounded-full bg-[#14803C]"></span>
            <span>Real Lookups Only</span>
          </div>
        </div>

        {/* Actions, Theme Toggle, Language & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search count badge */}
          {!currentUser && (
            <div className="lg:hidden text-xs px-2.5 py-1.5 rounded-lg bg-[#3a3e4f] border border-[#5d6180] text-white">
              <strong className={remainingSearches === 0 ? 'text-[#C62828] font-bold' : 'text-[#A0D2EB] font-bold'}>{remainingSearches}</strong>/5
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold bg-[#3a3e4f] hover:bg-[#2f3242] text-white border border-[#5d6180] transition-colors focus:ring-2 focus:ring-[#A0D2EB]"
            title="Switch Language (English / हिंदी)"
            aria-label="Switch Language"
          >
            <Languages className="w-4 h-4 text-[#A0D2EB] shrink-0" />
            <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#3a3e4f] hover:bg-[#2f3242] text-white border border-[#5d6180] transition-colors focus:ring-2 focus:ring-[#A0D2EB]"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#A0D2EB]" />
            ) : (
              <Moon className="w-4 h-4 text-[#D0BDF4]" />
            )}
          </button>

          <button
            onClick={onReset}
            className="hidden md:flex items-center gap-2 text-xs font-semibold px-3.5 py-2 min-h-[44px] rounded-xl bg-[#3a3e4f] hover:bg-[#2f3242] text-white border border-[#5d6180] transition-all shadow-sm focus:ring-2 focus:ring-[#A0D2EB]"
          >
            <FileSearch className="w-4 h-4 text-[#A0D2EB]" />
            <span>{lang === 'hi' ? 'नई जांच' : 'New Check'}</span>
          </button>

          {/* User Profile or Login Trigger */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#5d6180]">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#3a3e4f] border border-[#5d6180]">
                <div className="w-6 h-6 rounded-full bg-[#8458B3] text-[10px] font-bold text-white flex items-center justify-center uppercase">
                  {(currentUser.name || currentUser.email || 'U').substring(0, 2)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {currentUser.name || currentUser.email.split('@')[0]}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out"
                className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#3a3e4f] border border-[#5d6180] hover:bg-[#C62828]/20 text-white hover:text-[#C62828] transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth(false)}
              className="vf-btn-primary text-xs"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'लॉगिन / साइन अप' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
