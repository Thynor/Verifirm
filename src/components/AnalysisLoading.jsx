import React from 'react';
import { ShieldCheck, Globe2, Building2, Search } from 'lucide-react';

export function AnalysisLoading({ lang = 'en' }) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-16 animate-fade-in">
      <div className="vf-card p-8 sm:p-10 text-center space-y-6 shadow-xl">
        {/* Active Scanner Indicator */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#8458B3]/20 animate-ping opacity-75" />
          <div className="absolute inset-2 rounded-full border-2 border-[#D0BDF4]/40 border-t-[#8458B3] animate-spin" />
          <div className="w-14 h-14 rounded-full bg-white dark:bg-[#2f3242] border border-[#494D5F]/20 dark:border-[#D0BDF4]/30 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7 text-[#8458B3] dark:text-[#D0BDF4]" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-[#494D5F] dark:text-white tracking-tight">
            {lang === 'hi' ? 'सबूतों एवं डेटाबेस की लाइव जांच हो रही है...' : 'Verifying Evidence with Official Registries...'}
          </h2>
          <p className="text-sm text-[#5d6180] dark:text-[#E5EAF5]/80 max-w-md mx-auto leading-relaxed">
            {lang === 'hi'
              ? 'डोमेन की आयु (RDAP), ईमेल प्रेषक, सरकारी रिकॉर्ड और जॉब स्कैम रिपोर्ट का लाइव विश्लेषण किया जा रहा है।'
              : 'Performing live checks against RDAP domain records, corporate sender signatures, and scam patterns. No artificial delays.'}
          </p>
        </div>

        {/* Honest Status Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto pt-2 text-xs font-semibold text-[#494D5F] dark:text-[#E5EAF5]">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full vf-inner-card">
            <Globe2 className="w-3.5 h-3.5 text-[#8458B3] dark:text-[#D0BDF4]" />
            <span>RDAP & DNS Check</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full vf-inner-card">
            <Building2 className="w-3.5 h-3.5 text-[#8458B3] dark:text-[#D0BDF4]" />
            <span>Registry Lookup</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full vf-inner-card">
            <Search className="w-3.5 h-3.5 text-[#14803C]" />
            <span>Evidence Cross-Exam</span>
          </div>
        </div>
      </div>
    </div>
  );
}

