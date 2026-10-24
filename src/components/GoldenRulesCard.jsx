import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';

export function GoldenRulesCard({ goldenRules = {}, redFlags = [], greenFlags = [] }) {
  const rules = [
    {
      title: 'Rule #1: They NEVER Ask for Money',
      subtitle: 'Laptop deposits, training fees, courier charges, registration deposits',
      passed: !goldenRules.moneyDemanded,
      details: goldenRules.moneyDetails
    },
    {
      title: 'Rule #2: Secure Document Handling',
      subtitle: 'Never ask for Aadhaar, PAN, or Bank passbook over WhatsApp/Telegram',
      passed: goldenRules.secureOnboarding,
      details: goldenRules.onboardingDetails
    },
    {
      title: 'Rule #3: Official Corporate Email Domain',
      subtitle: 'Authorized entities communicate from @company.com, never free consumer accounts',
      passed: goldenRules.officialEmailDomain,
      details: goldenRules.emailDetails
    },
    {
      title: 'Rule #4: Standard Recruitment Timeline',
      subtitle: 'No artificial psychological pressure (e.g., "Pay within 2 hours or offer rescinded")',
      passed: goldenRules.reasonableUrgency,
      details: goldenRules.urgencyDetails
    },
    {
      title: 'Rule #5: Realistic Compensation Package',
      subtitle: 'Salary aligns with market rates for the specific role without bait-and-switch tactics',
      passed: goldenRules.realisticCompensation,
      details: goldenRules.compensationDetails
    }
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#091020] border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            The 5 Golden Rules of Authorized Hiring
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">Security Gate Check</span>
      </div>

      {/* 5 Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all ${
              rule.passed
                ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-900/60 text-rose-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-semibold text-sm text-white">{rule.title}</span>
              {rule.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{rule.subtitle}</p>
            <div className={`text-xs p-2 rounded-lg font-mono ${
              rule.passed ? 'bg-emerald-950/40 text-emerald-200' : 'bg-rose-950/60 text-rose-200 font-bold'
            }`}>
              {rule.details}
            </div>
          </div>
        ))}
      </div>

      {/* Red Flags / Green Flags Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        {/* Red Flags */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Red Flags ({redFlags.length})</span>
          </div>
          {redFlags.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No critical red flags identified during security scan.</p>
          ) : (
            <div className="space-y-2">
              {redFlags.map((flag, i) => (
                <div key={i} className="text-xs p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">{flag.rule}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-200">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{flag.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Green Flags */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Green Flags ({greenFlags.length})</span>
          </div>
          {greenFlags.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No standard green flags verified.</p>
          ) : (
            <div className="space-y-1.5">
              {greenFlags.map((flag, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300 p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
