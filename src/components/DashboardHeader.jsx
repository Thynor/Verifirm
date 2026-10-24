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
  const strokeColor = isHighRisk ? '#C62828' : (isVerified || isNoRedFlags) ? '#14803C' : isInsufficient ? '#8458B3' : '#B26A00';
  const badgeBg = isHighRisk 
    ? 'bg-[#C62828]/15 border-[#C62828]/40 text-[#C62828]' 
    : (isVerified || isNoRedFlags)
      ? 'bg-[#14803C]/15 border-[#14803C]/40 text-[#14803C]' 
      : isInsufficient
        ? 'bg-[#8458B3]/15 border-[#8458B3] text-[#8458B3] dark:text-[#D0BDF4]'
        : 'bg-[#B26A00]/15 border-[#B26A00]/40 text-[#B26A00]';

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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#14803C] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{t.copiedToast}</span>
        </div>
      )}

      {/* DEMO Scenario Banner if preset loaded */}
      {data.isDemoPreset && (
        <div className="p-3.5 rounded-xl bg-[#B26A00]/15 border border-[#B26A00]/30 text-[#494D5F] dark:text-[#E5EAF5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B26A00] shrink-0" />
            <span><strong>DEMO BENCHMARK:</strong> Showing simulated benchmark scenario for demonstration only. Real custom inputs never use pre-baked data.</span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#B26A00]/20 border border-[#B26A00]/40 text-[#B26A00] font-bold shrink-0">
            DEMO SCENARIO
          </span>
        </div>
      )}

      {/* Top Navigation & Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onReset}
          className="vf-btn-secondary text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.resetBtn}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="vf-btn-secondary text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-[#14803C]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : t.copyBtn}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="vf-btn-secondary text-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{t.exportBtn}</span>
          </button>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 min-h-[44px] rounded-xl bg-[#C62828] hover:bg-[#b02222] transition-all shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t.reportScamBtn}</span>
          </a>
        </div>
      </div>

      {/* Main Verdict Card */}
      <div className="vf-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Company Details & Verdict Sentence */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs px-3 py-1.5 rounded-full border font-bold flex items-center gap-2 ${badgeBg}`}>
                {isHighRisk ? (
                  <AlertOctagon className="w-4 h-4 text-[#C62828] shrink-0" />
                ) : isVerified || isNoRedFlags ? (
                  <CheckCircle2 className="w-4 h-4 text-[#14803C] shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-[#8458B3] dark:text-[#D0BDF4] shrink-0" />
                )}
                <span>{data.verdict || 'UNVERIFIED – insufficient evidence'}</span>
              </span>

              {data.coverageRatio && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full vf-inner-card text-[#494D5F] dark:text-[#E5EAF5]">
                  {data.coverageRatio}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#494D5F] dark:text-white tracking-tight">
              {data.companyName}
            </h1>

            {/* Quick Metadata Chips */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#5d6180] dark:text-[#E5EAF5]/80 pt-1">
              {data.claimedDomain && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#8458B3] dark:text-[#D0BDF4]" />
                  <span>Domain: <strong className="text-[#494D5F] dark:text-white">{data.claimedDomain}</strong></span>
                </div>
              )}
              {data.claimedEmail && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#8458B3] dark:text-[#D0BDF4]" />
                  <span>Sender: <strong className="text-[#494D5F] dark:text-white">{data.claimedEmail}</strong></span>
                </div>
              )}
              {data.government?.cin && (
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#8458B3] dark:text-[#D0BDF4]" />
                  <span>CIN: <strong className="text-[#494D5F] dark:text-white">{data.government.cin}</strong></span>
                </div>
              )}
            </div>

            {data.verdictSummary && (
              <p className="text-sm text-[#494D5F] dark:text-[#E5EAF5] leading-relaxed max-w-3xl pt-2 font-medium">
                {data.verdictSummary}
              </p>
            )}
          </div>

          {/* Trust Score Gauge (Only when >= 5 checks performed) */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl vf-inner-card min-w-[200px] w-full sm:w-auto">
            {hasEnoughData ? (
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#D0BDF4"
                    strokeOpacity="0.4"
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
                  <span className="text-2xl font-black text-[#494D5F] dark:text-white font-mono">{score}</span>
                  <span className="text-[10px] uppercase font-semibold text-[#5d6180] dark:text-[#E5EAF5]/70">Trust Score</span>
                </div>
              </div>
            ) : (
              <div className="p-3 text-center space-y-1">
                <HelpCircle className="w-8 h-8 text-[#8458B3] dark:text-[#D0BDF4] mx-auto" />
                <p className="text-xs font-semibold text-[#494D5F] dark:text-[#E5EAF5]">
                  {t.scoreNotEnough}
                </p>
                <p className="text-[11px] text-[#5d6180] dark:text-[#E5EAF5]/70">
                  (Requires at least 5 of 8 checks to compute an overall numeric score)
                </p>
              </div>
            )}
            <span className="text-xs font-semibold mt-2 text-[#494D5F] dark:text-[#E5EAF5] text-center">
              {isHighRisk ? 'High Risk Warning' : isVerified ? 'Verified Evidence' : isNoRedFlags ? 'No Red Flags' : 'Insufficient Evidence'}
            </span>
          </div>
        </div>

        {/* 2. Top Reasons Quoting the Mail */}
        {data.topReasons && data.topReasons.length > 0 && (
          <div className="p-4 sm:p-5 rounded-xl vf-inner-card space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#494D5F] dark:text-[#E5EAF5] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#8458B3] dark:text-[#D0BDF4]" />
              <span>{t.topReasonsTitle}</span>
            </h3>
            <div className="space-y-2">
              {data.topReasons.map((reason, idx) => {
                const isCrit = reason.severity === 'CRITICAL';
                const isHi = reason.severity === 'HIGH';
                const isMed = reason.severity === 'MEDIUM' || reason.severity === 'WARNING';
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-xs leading-relaxed border ${
                      isCrit || isHi
                        ? 'bg-[#C62828]/10 border-[#C62828]/30 text-[#494D5F] dark:text-[#E5EAF5]'
                        : isMed
                          ? 'bg-[#B26A00]/10 border-[#B26A00]/30 text-[#494D5F] dark:text-[#E5EAF5]'
                          : 'bg-[#14803C]/10 border-[#14803C]/30 text-[#494D5F] dark:text-[#E5EAF5]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {isCrit || isHi ? (
                        <AlertTriangle className="w-4 h-4 shrink-0 text-[#C62828]" />
                      ) : isMed ? (
                        <AlertTriangle className="w-4 h-4 shrink-0 text-[#B26A00]" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#14803C]" />
                      )}
                      <span>{reason.rule}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 dark:bg-black/40">
                        {reason.severity}
                      </span>
                    </div>
                    <p className="text-[#494D5F] dark:text-[#E5EAF5]/90 font-sans">
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
          <div className="p-4 sm:p-5 rounded-xl vf-inner-card border border-[#8458B3]/30 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8458B3] dark:text-[#D0BDF4] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8458B3] dark:text-[#D0BDF4]" />
              <span>{t.whatToDoTitle}</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-[#494D5F] dark:text-[#E5EAF5] leading-relaxed">
              {data.adviceList.map((advice, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#8458B3] dark:text-[#D0BDF4] font-bold">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Legal Disclaimer Banner */}
        <div className="p-3.5 rounded-xl vf-inner-card text-[#5d6180] dark:text-[#E5EAF5]/70 text-xs flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 text-[#5d6180] shrink-0" />
          <span className="leading-relaxed">
            <strong>Disclaimer:</strong> VeriFirm assessment results are evidence-based risk indicators and do not constitute legal proof or corporate certification.
          </span>
        </div>
      </div>
    </div>
  );
}

