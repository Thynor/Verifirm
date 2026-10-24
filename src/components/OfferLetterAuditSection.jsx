import React, { useState } from 'react';
import { 
  FileCheck2, CheckCircle2, XCircle, AlertTriangle, ShieldAlert, 
  FileText, PenTool, Hash, Image, Calendar, DollarSign,
  ChevronDown, ChevronUp
} from 'lucide-react';

export function OfferLetterAuditSection({ offerLetterQuality = {}, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const {
    qualityPercentage = 50,
    verdict = 'Unverified Format',
    checks = []
  } = offerLetterQuality;

  const getCheckIcon = (id) => {
    switch(id) {
      case 'signature': return PenTool;
      case 'cin_address': return Hash;
      case 'template': return FileText;
      case 'logo': return Image;
      case 'dates': return Calendar;
      case 'salary_fit': return DollarSign;
      default: return FileCheck2;
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#091020] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-600/20 border border-teal-200 dark:border-teal-500/40 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Offer Letter Document Text Analysis</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                qualityPercentage >= 80 
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                  : qualityPercentage >= 50
                    ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
              }`}>
                {verdict}
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Examining authorized signatures, mandatory statutory CIN, template authenticity, and salary/role alignment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Score:</span>
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
              qualityPercentage >= 80 ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
              qualityPercentage >= 50 ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' :
              'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
            }`}>
              {qualityPercentage} / 100
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded 6 Checks Grid */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checks.map((check) => {
              const Icon = getCheckIcon(check.id);
              return (
                <div
                  key={check.id}
                  className={`p-4 rounded-xl border space-y-2 transition-all ${
                    check.passed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                      : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${check.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{check.title}</span>
                    </div>
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500 dark:text-slate-400">Status:</span>
                    <span className={`font-semibold ${check.passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                      {check.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans pt-1">
                    {check.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
