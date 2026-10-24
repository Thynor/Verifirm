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
    <div className="vf-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#8458B3] dark:text-[#D0BDF4]" />
          <h2 className="text-lg font-bold text-[#494D5F] dark:text-white">
            The 5 Golden Rules of Safe Hiring
          </h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full vf-inner-card text-[#5d6180] dark:text-[#E5EAF5]">
          Security Gate Check
        </span>
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
                  ? 'bg-[#14803C]/10 border-[#14803C]/30 text-[#494D5F] dark:text-[#E5EAF5]'
                  : isFailed
                    ? 'bg-[#C62828]/10 border-[#C62828]/30 text-[#494D5F] dark:text-[#E5EAF5]'
                    : 'bg-[#E5EAF5]/60 dark:bg-[#2f3242]/50 border-[#494D5F]/15 dark:border-[#D0BDF4]/20 text-[#5d6180] dark:text-[#E5EAF5]/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-bold text-sm text-[#494D5F] dark:text-white">{rule.title}</span>
                {isPassed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#14803C] shrink-0" />
                ) : isFailed ? (
                  <XCircle className="w-5 h-5 text-[#C62828] shrink-0" />
                ) : (
                  <MinusCircle className="w-5 h-5 text-[#5d6180] shrink-0" />
                )}
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-[#5d6180] dark:text-[#E5EAF5]/70 leading-relaxed">{rule.subtitle}</p>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ml-2 font-bold ${
                  isPassed
                    ? 'bg-[#14803C]/20 border border-[#14803C]/40 text-[#14803C]'
                    : isFailed
                      ? 'bg-[#C62828]/20 border border-[#C62828]/40 text-[#C62828]'
                      : 'bg-[#5d6180]/20 border border-[#5d6180]/40 text-[#5d6180] dark:text-[#E5EAF5]/70'
                }`}>
                  {isPassed ? 'PASSED' : isFailed ? 'FAILED' : 'NOT CHECKED'}
                </span>
              </div>
              <div className={`text-xs p-2.5 rounded-lg leading-relaxed ${
                isPassed 
                  ? 'bg-white/70 dark:bg-[#2f3242] border border-[#14803C]/20 text-[#494D5F] dark:text-[#E5EAF5]' 
                  : isFailed 
                    ? 'bg-white/70 dark:bg-[#2f3242] text-[#C62828] dark:text-rose-300 font-bold border border-[#C62828]/30' 
                    : 'bg-white/70 dark:bg-[#2f3242] border border-[#494D5F]/15 text-[#5d6180] dark:text-[#E5EAF5]/70'
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
        <div className="p-4 rounded-xl vf-inner-card space-y-3">
          <div className="flex items-center gap-2 text-[#C62828] font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Red Flags ({redFlags.length})</span>
          </div>
          {redFlags.length === 0 ? (
            <p className="text-xs text-[#5d6180] italic">No critical red flags identified during verification.</p>
          ) : (
            <div className="space-y-2">
              {redFlags.map((flag, i) => (
                <div key={i} className="text-xs p-3 rounded-lg bg-[#C62828]/10 border border-[#C62828]/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#C62828]">{flag.rule}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C62828]/20 text-[#C62828] font-bold">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-[#494D5F] dark:text-[#E5EAF5] text-[11px] leading-relaxed">{flag.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Green Flags */}
        <div className="p-4 rounded-xl vf-inner-card space-y-3">
          <div className="flex items-center gap-2 text-[#14803C] font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Positive Evidence ({greenFlags.length})</span>
          </div>
          {greenFlags.length === 0 ? (
            <p className="text-xs text-[#5d6180] italic">No standard positive evidence verified.</p>
          ) : (
            <div className="space-y-1.5">
              {greenFlags.map((flag, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#494D5F] dark:text-[#E5EAF5] p-2.5 rounded-lg bg-[#14803C]/10 border border-[#14803C]/30">
                  <span className="w-2 h-2 rounded-full bg-[#14803C] shrink-0" />
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
