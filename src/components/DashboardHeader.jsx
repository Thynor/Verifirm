import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, 
  ArrowLeft, Printer, Building, Mail, Globe, HelpCircle,
  Copy, Check, ExternalLink, ShieldAlert, AlertCircle, Info
} from 'lucide-react';
import { translations } from '../utils/translations.js';

export function DashboardHeader({ data, onReset, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [copied, setCopied] = useState(false);

  const score = data.trustScore;
  const hasEnoughData = data.hasEnoughData !== false && score !== null && score !== undefined;
  const isHighRisk = data.verdict?.includes('CRITICAL RISK') || (hasEnoughData && score < 40);
  const isVerified = data.verdict === 'VERIFIED';
  const isNoRedFlags = data.verdict?.includes('No red flags found');
  const isInsufficient = !hasEnoughData || data.verdict?.includes('UNVERIFIED');

  // Colors paired with icons & text
  const strokeColor = isHighRisk ? '#e11d48' : (isVerified || isNoRedFlags) ? '#10b981' : '#d97706';
  const badgeBg = isHighRisk 
    ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300' 
    : (isVerified || isNoRedFlags)
      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
      : 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300';

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = hasEnoughData ? (circumference - (score / 100) * circumference) : circumference;

  const handleCopyReport = () => {
    const summary = [
      `VeriFirm Job Verification Report: ${data.companyName}`,
      `Verdict: ${data.verdict}`,
      `Coverage: ${data.coverageRatio || 'N/A'}`,
      score !== null ? `Trust Score: ${score}/100` : 'Trust Score: Insufficient data (<5 checks performed)',
      '',
      'Top Reasons:',
      ...(data.topReasons || []).map(r => `• [${r.severity}] ${r.rule}: ${r.description}`),
      '',
      'Actionable Advice:',
      ...(data.adviceList || []).map(a => `• ${a}`),
      '',
      'Verified via VeriFirm (evidence-based scam intelligence)'
    ].join('\n');

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification when copied */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{t.copiedToast}</span>
        </div>
      )}

      {/* DEMO Scenario Banner if preset loaded */}
      {data.isDemoPreset && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span><strong>DEMO BENCHMARK:</strong> Showing simulated benchmark scenario for demonstration only. Real custom inputs never use pre-baked data.</span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 shrink-0">
            DEMO SCENARIO
          </span>
        </div>
      )}

      {/* Top Navigation & Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 min-h-[44px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.resetBtn}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 min-h-[44px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Copied!' : t.copyBtn}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 min-h-[44px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{t.exportBtn}</span>
          </button>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 px-3.5 py-2 min-h-[44px] rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 transition-all shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t.reportScamBtn}</span>
          </a>
        </div>
      </div>

      {/* Main Verdict Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#091020] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Company Details & Verdict Sentence */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs px-3 py-1.5 rounded-full border font-bold flex items-center gap-2 ${badgeBg}`}>
                {isHighRisk ? (
                  <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                ) : isVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
                <span>{data.verdict || 'UNVERIFIED – insufficient evidence'}</span>
              </span>

              {data.coverageRatio && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                  {data.coverageRatio}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {data.companyName}
            </h1>

            {/* Quick Metadata Chips */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
              {data.claimedDomain && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Domain: <strong className="text-slate-900 dark:text-slate-200">{data.claimedDomain}</strong></span>
                </div>
              )}
              {data.claimedEmail && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Sender: <strong className="text-slate-900 dark:text-slate-200">{data.claimedEmail}</strong></span>
                </div>
              )}
              {data.government?.cin && (
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>CIN: <strong className="text-slate-900 dark:text-slate-200">{data.government.cin}</strong></span>
                </div>
              )}
            </div>

            {data.verdictSummary && (
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl pt-2 font-medium">
                {data.verdictSummary}
              </p>
            )}
          </div>

          {/* Trust Score Gauge (Only when >= 5 checks performed) */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 min-w-[200px] w-full sm:w-auto">
            {hasEnoughData ? (
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
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
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{score}</span>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Trust Score</span>
                </div>
              </div>
            ) : (
              <div className="p-3 text-center space-y-1">
                <HelpCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {t.scoreNotEnough}
                </p>
                <p className="text-[11px] text-slate-500">
                  (Requires at least 5 of 8 checks to compute an overall numeric score)
                </p>
              </div>
            )}
            <span className="text-xs font-medium mt-2 text-slate-600 dark:text-slate-400 text-center">
              {isHighRisk ? 'High Risk Warning' : isVerified ? 'Verified Evidence' : isNoRedFlags ? 'No Red Flags' : 'Insufficient Evidence'}
            </span>
          </div>
        </div>

        {/* 2. Top Reasons Quoting the Mail */}
        {data.topReasons && data.topReasons.length > 0 && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t.topReasonsTitle}</span>
            </h3>
            <div className="space-y-2">
              {data.topReasons.map((reason, idx) => {
                const isCrit = reason.severity === 'CRITICAL';
                const isHi = reason.severity === 'HIGH';
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-xs leading-relaxed border ${
                      isCrit
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                        : isHi
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {isCrit || isHi ? (
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      )}
                      <span>{reason.rule}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 dark:bg-black/40">
                        {reason.severity}
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-sans">
                      {reason.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. What To Do Now Advice Box */}
        {data.adviceList && data.adviceList.length > 0 && (
          <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-900/50 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-cyan-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>{t.whatToDoTitle}</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {data.adviceList.map((advice, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-cyan-400 font-bold">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Legal Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="leading-relaxed">
            <strong>Disclaimer:</strong> VeriFirm assessment results are evidence-based risk indicators and do not constitute legal proof or corporate certification.
          </span>
        </div>
      </div>
    </div>
  );
}

