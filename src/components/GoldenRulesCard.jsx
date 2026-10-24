import React from 'react';
import { CheckCircle2, XCircle, MinusCircle, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';

export function GoldenRulesCard({ goldenRules = {}, redFlags = [], greenFlags = [] }) {
  // Use structured rules if provided, or build with explicit 3-state evaluation
  const rules = Array.isArray(goldenRules.rules) ? goldenRules.rules : [
    {
      title: 'Rule #1: They NEVER Ask for Money',
      subtitle: 'Laptop deposits, training fees, courier charges, registration deposits',
      passed: goldenRules.moneyDemanded === true ? false : (goldenRules.moneyDetails ? true : null),
      status: goldenRules.moneyDemanded === true ? 'Failed / Fee Demanded' : (goldenRules.moneyDetails ? 'Passed' : 'Not checked'),
      details: goldenRules.moneyDetails || 'No communication text provided to evaluate fee demands.'
    },
    {
      title: 'Rule #2: Secure Document Handling',
      subtitle: 'Never ask for Aadhaar, PAN, or Bank passbook over WhatsApp/Telegram',
      passed: typeof goldenRules.secureOnboarding === 'boolean' ? goldenRules.secureOnboarding : null,
      status: goldenRules.secureOnboarding === true ? 'Passed' : (goldenRules.secureOnboarding === false ? 'Failed / Insecure Docs' : 'Not checked'),
      details: goldenRules.onboardingDetails || 'No communication text provided to evaluate document handling.'
    },
    {
      title: 'Rule #3: Official Corporate Email Domain',
      subtitle: 'Authorized entities communicate from @company.com, never free consumer accounts',
      passed: typeof goldenRules.officialEmailDomain === 'boolean' ? goldenRules.officialEmailDomain : null,
      status: goldenRules.officialEmailDomain === true ? 'Passed' : (goldenRules.officialEmailDomain === false ? 'Failed / Domain Mismatch' : 'Not checked'),
      details: goldenRules.emailDetails || 'No sender email address provided in input.'
    },
    {
      title: 'Rule #4: Standard Recruitment Timeline',
      subtitle: 'No artificial psychological pressure (e.g., "Pay within 2 hours or offer rescinded")',
      passed: typeof goldenRules.reasonableUrgency === 'boolean' ? goldenRules.reasonableUrgency : null,
      status: goldenRules.reasonableUrgency === true ? 'Passed' : (goldenRules.reasonableUrgency === false ? 'Failed / Panic Deadline' : 'Not checked'),
      details: goldenRules.urgencyDetails || 'No recruitment timeline or deadline text provided to evaluate.'
    },
    {
      title: 'Rule #5: Realistic Compensation Package',
      subtitle: 'Salary aligns with market rates for the specific role without bait-and-switch tactics',
      passed: typeof goldenRules.realisticCompensation === 'boolean' ? goldenRules.realisticCompensation : null,
      status: goldenRules.realisticCompensation === true ? 'Passed' : (goldenRules.realisticCompensation === false ? 'Failed / Unrealistic Lure' : 'Not checked'),
      details: goldenRules.compensationDetails || 'No compensation or salary details provided in input.'
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
        {rules.map((rule, idx) => {
          const isPassed = rule.passed === true;
          const isFailed = rule.passed === false;
          const isNotChecked = rule.passed === null || rule.passed === undefined;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                isPassed
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                  : isFailed
                    ? 'bg-rose-950/30 border-rose-900/60 text-rose-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-semibold text-sm text-white">{rule.title}</span>
                {isPassed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : isFailed ? (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                ) : (
                  <MinusCircle className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-slate-400 leading-relaxed">{rule.subtitle}</p>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                  isPassed
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : isFailed
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {isPassed ? 'PASSED' : isFailed ? 'FAILED' : 'NOT CHECKED'}
                </span>
              </div>
              <div className={`text-xs p-2 rounded-lg font-mono leading-relaxed ${
                isPassed 
                  ? 'bg-emerald-950/40 text-emerald-200' 
                  : isFailed 
                    ? 'bg-rose-950/60 text-rose-200 font-bold' 
                    : 'bg-slate-900/60 text-slate-400'
              }`}>
                {rule.details}
              </div>
            </div>
          );
        })}
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
