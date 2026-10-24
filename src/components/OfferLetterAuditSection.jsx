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
    <div className="vf-card overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-violet/5 dark:hover:bg-violet/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet/15 dark:bg-violet/25 border border-violet/30 flex items-center justify-center text-violet dark:text-lavender shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-vfslate dark:text-mist flex items-center gap-2">
              <span>Offer Letter Document Text Analysis</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                qualityPercentage >= 80 
                  ? 'bg-status-success/10 text-status-success border-status-success/30 font-bold' 
                  : qualityPercentage >= 50
                    ? 'bg-status-warning/10 text-status-warning border-status-warning/30 font-bold'
                    : 'bg-status-danger/10 text-status-danger border-status-danger/30 font-bold'
              }`}>
                {verdict}
              </span>
            </h2>
            <p className="text-xs text-muted dark:text-lavender/80">
              Examining authorized signatures, mandatory statutory CIN, template authenticity, and salary/role alignment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted dark:text-lavender/80">Score:</span>
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
              qualityPercentage >= 80 ? 'bg-status-success/10 text-status-success border-status-success/30' :
              qualityPercentage >= 50 ? 'bg-status-warning/10 text-status-warning border-status-warning/30' :
              'bg-status-danger/10 text-status-danger border-status-danger/30'
            }`}>
              {qualityPercentage} / 100
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-muted hover:text-vfslate dark:text-lavender/70 dark:hover:text-mist hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded 6 Checks Grid */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checks.map((check) => {
              const Icon = getCheckIcon(check.id);
              return (
                <div
                  key={check.id}
                  className={`p-4 rounded-xl border space-y-2 transition-all ${
                    check.passed
                      ? 'bg-status-success/10 border-status-success/25 dark:bg-status-success/15 dark:border-status-success/30'
                      : 'bg-status-danger/10 border-status-danger/25 dark:bg-status-danger/15 dark:border-status-danger/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${check.passed ? 'text-status-success' : 'text-status-danger'}`} />
                      <span className="text-xs font-bold text-vfslate dark:text-mist">{check.title}</span>
                    </div>
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-status-danger shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted dark:text-lavender/70">Status:</span>
                    <span className={`font-semibold ${check.passed ? 'text-status-success' : 'text-status-danger'}`}>
                      {check.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted dark:text-mist/90 leading-relaxed font-sans pt-1">
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
