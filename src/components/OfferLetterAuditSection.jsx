import React from 'react';
import { 
  FileCheck2, CheckCircle2, XCircle, AlertTriangle, ShieldAlert, 
  FileText, PenTool, Hash, Image, Calendar, DollarSign
} from 'lucide-react';

export function OfferLetterAuditSection({ offerLetterQuality = {} }) {
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
    <div className="p-6 rounded-2xl bg-[#091020] border border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Offer Letter Quality & Forensic Audit</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                qualityPercentage >= 80 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                  : qualityPercentage >= 50
                    ? 'bg-amber-950 text-amber-400 border-amber-800'
                    : 'bg-rose-950 text-rose-400 border-rose-800'
              }`}>
                {verdict}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Examining authorized signatures, mandatory statutory CIN, template authenticity, and salary/role alignment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Authenticity Score:</span>
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
            qualityPercentage >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
            qualityPercentage >= 50 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
            'bg-rose-950 text-rose-400 border border-rose-800'
          }`}>
            {qualityPercentage} / 100
          </span>
        </div>
      </div>

      {/* 6 Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {checks.map((check) => {
          const Icon = getCheckIcon(check.id);
          return (
            <div
              key={check.id}
              className={`p-4 rounded-xl border space-y-2 transition-all ${
                check.passed
                  ? 'bg-emerald-950/20 border-emerald-900/40'
                  : 'bg-rose-950/30 border-rose-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${check.passed ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <span className="text-xs font-bold text-white">{check.title}</span>
                </div>
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Status:</span>
                <span className={`font-semibold ${check.passed ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {check.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-sans pt-1">
                {check.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
