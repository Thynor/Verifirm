import React from 'react';
import { 
  ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, 
  ArrowLeft, Printer, Building, Mail, Globe, HelpCircle
} from 'lucide-react';

export function DashboardHeader({ data, onReset }) {
  const score = data.trustScore;
  const hasEnoughData = data.hasEnoughData !== false && score !== null && score !== undefined;
  const isHighRisk = data.verdict?.includes('CRITICAL RISK') || (hasEnoughData && score < 40);
  const isVerified = data.verdict === 'VERIFIED';
  const isNoRedFlags = data.verdict?.includes('No red flags found');
  const isInsufficient = !hasEnoughData || data.verdict?.includes('UNVERIFIED');

  // Determine score color
  const strokeColor = isHighRisk ? '#f43f5e' : (isVerified || isNoRedFlags) ? '#10b981' : '#f59e0b';
  const badgeBg = isHighRisk 
    ? 'bg-rose-950/80 border-rose-800 text-rose-300' 
    : (isVerified || isNoRedFlags)
      ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' 
      : 'bg-amber-950/80 border-amber-800 text-amber-300';

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = hasEnoughData ? (circumference - (score / 100) * circumference) : circumference;

  return (
    <div className="space-y-6">
      {/* DEMO Scenario Banner if preset loaded */}
      {data.isDemoPreset && (
        <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-700/80 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>DEMO BENCHMARK:</strong> Showing simulated benchmark demonstration scenario for testing purposes. Real custom inputs never use simulated values.</span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-900 border border-amber-700 text-amber-300 shrink-0">
            DEMO SCENARIO
          </span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Verification Search</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Main Verdict Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#091020] border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: strokeColor }}
        ></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Company Details */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs font-mono px-3 py-1 rounded-full border font-bold flex items-center gap-1.5 ${badgeBg}`}>
                {isHighRisk ? (
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                ) : isVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                )}
                <span>{data.verdict || 'UNVERIFIED – insufficient evidence'}</span>
              </span>

              {data.coverageRatio && (
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                  Coverage: {data.coverageRatio}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {data.companyName}
            </h1>

            {/* Quick Metadata Chips */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              {data.claimedDomain && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Domain: <strong className="text-slate-200">{data.claimedDomain}</strong></span>
                </div>
              )}
              {data.claimedEmail && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sender: <strong className="text-slate-200">{data.claimedEmail}</strong></span>
                </div>
              )}
              {data.government?.cin && (
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CIN: <strong className="text-slate-200">{data.government.cin}</strong></span>
                </div>
              )}
            </div>

            {data.verdictSummary && (
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl pt-2">
                {data.verdictSummary}
              </p>
            )}
          </div>

          {/* Trust Score Gauge */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 min-w-[190px]">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Arc */}
                {hasEnoughData ? (
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke={strokeColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                ) : (
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#475569"
                    strokeWidth="8"
                    strokeDasharray="4 6"
                    fill="transparent"
                  />
                )}
              </svg>
              {/* Score Inside */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                {hasEnoughData ? (
                  <>
                    <span className="text-2xl font-black text-white font-mono">{score}</span>
                    <span className="text-[10px] uppercase font-mono text-slate-400">Trust Score</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-bold text-slate-300 font-mono leading-tight">Not enough data</span>
                    <span className="text-[9px] uppercase font-mono text-slate-500 mt-0.5">Trust Score</span>
                  </>
                )}
              </div>
            </div>
            <span className="text-[11px] font-mono mt-2 text-slate-400 text-center">
              {isHighRisk ? 'Concrete Scam Triggered' : isVerified ? 'Verified Evidence' : isNoRedFlags ? 'No Red Flags' : 'Insufficient Evidence'}
            </span>
            {data.coverageRatio && (
              <span className="text-[11px] font-mono text-cyan-400 mt-1 font-semibold">
                {data.coverageRatio}
              </span>
            )}
          </div>
        </div>

        {/* Legal Disclaimer Banner */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="leading-relaxed">
            <strong>Disclaimer:</strong> VeriFirm assessment results are risk indicators based on available evidence and do not constitute legal proof or corporate certification.
          </span>
        </div>

        {/* Critical Scam Banner Alert (if upfront money requested) */}
        {data.redFlags?.some(r => r.rule.includes('Upfront Fee')) && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-rose-300 text-sm">
                🚨 CRITICAL WARNING: UPFRONT MONEY / DEPOSIT DEMANDED
              </h4>
              <p className="leading-relaxed">
                This communication requests payment or security deposit for a laptop, training, courier, or registration. 
                <strong className="text-white"> Legitimate authorized employers NEVER ask candidates to pay money.</strong> Do not transfer funds via UPI, bank transfer, or QR code.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
