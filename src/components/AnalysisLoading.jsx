import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Database, Globe2, TrendingUp, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { label: 'Parsing entity identifiers & sender credentials...', icon: Search },
  { label: 'Querying Ministry of Corporate Affairs (MCA) & GSTIN database...', icon: Database },
  { label: 'Auditing LinkedIn headcount, profile authenticity & turnover...', icon: Users },
  { label: 'Fetching stock market quotes, quarterly growth & loss data...', icon: TrendingUp },
  { label: 'Scanning WHOIS domain registration age & SSL certificate...', icon: Globe2 },
  { label: 'Searching Reddit (r/scams, r/developersIndia) & Glassdoor review patterns...', icon: AlertCircle },
  { label: 'Evaluating 5 Golden Rules of Authorized Hiring & computing Trust Score...', icon: ShieldCheck }
];

export function AnalysisLoading({ onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressPercent = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Radar / Shield Animation */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping opacity-60"></div>
        <div className="absolute inset-2 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin"></div>
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xl shadow-cyan-500/20">
          <ShieldCheck className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Executing Comprehensive Legitimacy Audit
        </h2>
        <p className="text-xs font-mono text-cyan-400">
          Cross-examining 5 forensic registries • {progressPercent}% Completed
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-2.5 text-left max-w-md mx-auto pt-2">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all ${
                isCurrent 
                  ? 'bg-cyan-950/70 border border-cyan-800 text-cyan-300 shadow-sm'
                  : isDone
                    ? 'text-slate-400 bg-slate-900/40 border border-slate-800/60'
                    : 'text-slate-600 opacity-40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Icon className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
              ) : (
                <Icon className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
