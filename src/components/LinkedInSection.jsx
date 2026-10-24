import React, { useState } from 'react';
import { 
  Users, AlertTriangle, CheckCircle2, ShieldAlert, ExternalLink, HelpCircle,
  ChevronDown, ChevronUp, UserCheck
} from 'lucide-react';

export function LinkedInSection({ linkedin = {}, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

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
    claimedEmployeeCount = null,
    linkedInEmployeeCount = null,
    createdYear = null,
    source = null,
    isDemo = false
  } = linkedin;

  const isUserProvided = status === 'user_provided' || Boolean(claimedEmployeeCount || linkedInEmployeeCount || createdYear);
  const isNotChecked = !isUserProvided && (status === 'not_checked' || (!employeeCount && profileAudit.length === 0 && !linkedinUrl));

  const hasHeadcountDiscrepancy = claimedEmployeeCount && linkedInEmployeeCount && (claimedEmployeeCount >= 3 * linkedInEmployeeCount) && (claimedEmployeeCount >= 30);
  const isRecentPage = createdYear && (new Date().getFullYear() - createdYear < 1);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#091020] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/40 flex items-center justify-center text-[#0A66C2] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Company Profile & Employee Headcount</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                isUserProvided
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : isNotChecked 
                    ? 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800' 
                    : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              }`}>
                {isUserProvided ? 'User-Provided' : isNotChecked ? 'No Data / Not Checked' : 'Evidence Extracted'}
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Cross-examining official LinkedIn corporate presence and headcount claims
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          <a
            href={linkedinUrl || searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-[#0A66C2]/20 hover:bg-blue-100 dark:hover:bg-[#0A66C2]/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-[#0A66C2]/40 text-xs font-semibold transition-all min-h-[36px]"
          >
            <span>Search LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
          {/* User-Provided Metrics Box */}
          {isUserProvided && (
            <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>User-Provided Verification Metrics</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                  user-provided
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {claimedEmployeeCount !== null && (
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Claimed Employee Count</span>
                    <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                      {claimedEmployeeCount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">From offer / email</span>
                  </div>
                )}

                {linkedInEmployeeCount !== null && (
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">LinkedIn Employee Count</span>
                    <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                      {linkedInEmployeeCount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">From LinkedIn page</span>
                  </div>
                )}

                {createdYear !== null && (
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">LinkedIn Page Created</span>
                    <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                      {createdYear}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ~{new Date().getFullYear() - createdYear} years active
                    </span>
                  </div>
                )}
              </div>

              {hasHeadcountDiscrepancy && (
                <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 font-medium">
                  <strong>🚨 Headcount Discrepancy Flag [user-provided]:</strong> The claimed staff ({claimedEmployeeCount}) is $\ge 3\times$ higher than verified LinkedIn profiles ({linkedInEmployeeCount}). Startups with inflated headcounts frequently represent hiring scams or marketing exaggerations.
                </div>
              )}

              {isRecentPage && (
                <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 font-medium">
                  <strong>🚨 Recent LinkedIn Page Flag [user-provided]:</strong> This LinkedIn page was created in {createdYear} (&lt; 1 year old). Newly registered profiles for supposed large firms require extreme caution.
                </div>
              )}
            </div>
          )}

          {/* Case 1: Unchecked / No Data */}
          {isNotChecked ? (
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-semibold">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>No Data / Not Checked</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
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
            <div className="space-y-4">
              {linkedinUrl && (
                <div className="p-5 rounded-2xl bg-blue-50/30 dark:bg-slate-900/60 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white font-black text-xl shrink-0">
                      in
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{companyName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          Link in Input
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 break-all">{linkedinUrl}</p>
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
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Headcount</span>
                    <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">
                      {typeof employeeCount === 'number' ? employeeCount.toLocaleString() : employeeRange}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Turnover Metric</span>
                    <div className="text-base font-semibold text-slate-900 dark:text-white font-mono mt-1">
                      {turnoverRate}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Leadership Presence</span>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                      {leadershipVisibility}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
