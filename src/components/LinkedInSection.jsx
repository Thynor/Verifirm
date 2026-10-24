import React, { useState } from 'react';
import { 
  Users, AlertTriangle, CheckCircle2, ShieldAlert, ExternalLink, HelpCircle
} from 'lucide-react';

export function LinkedInSection({ linkedin = {} }) {
  const [selectedProfile, setSelectedProfile] = useState(null);

  const {
    status = 'not_checked',
    companyName = 'Corporate Entity',
    linkedinUrl = '',
    searchUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(companyName)}`,
    message = '',
    employeeCount = null,
    employeeRange = 'No data / not checked',
    profileQualityScore = null,
    profileAudit = [],
    turnoverRate = 'No data / not checked',
    turnoverAssessment = '',
    leadershipVisibility = 'Not checked',
    isDemo = false
  } = linkedin;

  const isNotChecked = status === 'not_checked' || (!employeeCount && profileAudit.length === 0 && !linkedinUrl);

  return (
    <div className="p-6 rounded-2xl bg-[#091020] border border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>LinkedIn Headcount & Profile Forensics</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isNotChecked 
                  ? 'bg-slate-900 text-slate-400 border-slate-700' 
                  : 'bg-blue-950 text-blue-400 border-blue-800'
              }`}>
                {isNotChecked ? 'Not Checked' : 'Evidence Extracted'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Cross-examining official LinkedIn corporate presence and public profile integrity
            </p>
          </div>
        </div>

        <a
          href={linkedinUrl || searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-blue-300 border border-[#0A66C2]/40 text-xs font-semibold transition-all"
        >
          <span>Search LinkedIn ↗</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Case 1: Unchecked / No Data */}
      {isNotChecked ? (
        <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>No Data / Not Checked</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            {message || 'No LinkedIn company URL or public profile was provided in the input text. Live headcount metrics, employee rosters, and turnover statistics require authenticated LinkedIn Enterprise credentials (unauthenticated web scraping is prohibited). Simulated profiles and fabricated turnover numbers are not generated.'}
          </p>
          <div className="pt-2">
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold text-xs transition-all shadow-md"
            >
              <span>Search LinkedIn for "{companyName}"</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        /* Case 2: URL Found in Input or DEMO Scenario */
        <div className="space-y-6">
          {linkedinUrl && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#004182]/20 via-[#0A66C2]/10 to-slate-900 border border-[#0A66C2]/40 shadow-lg shadow-[#0A66C2]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white font-black text-xl shrink-0">
                  in
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{companyName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      Link in Input
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 break-all">{linkedinUrl}</p>
                </div>
              </div>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-semibold shadow"
              >
                <span>View LinkedIn Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Metrics row (Only rendered if actual or demo data is present) */}
          {employeeCount !== null && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-mono uppercase text-slate-400">Headcount</span>
                <div className="text-xl font-bold text-white font-mono mt-1">
                  {typeof employeeCount === 'number' ? employeeCount.toLocaleString() : employeeRange}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-mono uppercase text-slate-400">Turnover Metric</span>
                <div className="text-base font-semibold text-white font-mono mt-1">
                  {turnoverRate}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-mono uppercase text-slate-400">Leadership Presence</span>
                <div className="text-sm font-semibold text-white mt-1">
                  {leadershipVisibility}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
