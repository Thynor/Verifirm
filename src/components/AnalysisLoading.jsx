import React from 'react';
import { ShieldCheck, Globe2, Building2, Search } from 'lucide-react';

export function AnalysisLoading({ lang = 'en' }) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-20 text-center space-y-8 animate-fade-in">
      {/* Active Scanner Indicator */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 animate-ping opacity-75" />
        <div className="absolute inset-2 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 dark:border-t-cyan-400 animate-spin" />
        <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <ShieldCheck className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {lang === 'hi' ? 'सबूतों एवं डेटाबेस की लाइव जांच हो रही है...' : 'Verifying Evidence with Official Registries...'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {lang === 'hi'
            ? 'डोमेन की आयु (RDAP), ईमेल प्रेषक, सरकारी रिकॉर्ड और जॉब स्कैम रिपोर्ट का लाइव विश्लेषण किया जा रहा है।'
            : 'Performing live checks against RDAP domain records, corporate sender signatures, and scam patterns. No artificial delays.'}
        </p>
      </div>

      {/* Honest Status Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Globe2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>RDAP & DNS Check</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Registry Lookup</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Evidence Cross-Exam</span>
        </div>
      </div>
    </div>
  );
}

