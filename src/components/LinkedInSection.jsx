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
    <div className="vf-card overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-violet/5 dark:hover:bg-violet/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet/15 dark:bg-violet/25 border border-violet/30 flex items-center justify-center text-violet dark:text-lavender shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-vfslate dark:text-mist flex items-center gap-2">
              <span>Company Profile & Employee Headcount</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                isUserProvided
                  ? 'bg-violet/15 text-violet dark:text-lavender border-violet/30 font-semibold'
                  : isNotChecked 
                    ? 'bg-slate-100 dark:bg-slate-800/80 text-muted dark:text-lavender/80 border-slate-200 dark:border-slate-700' 
                    : 'bg-status-success/10 text-status-success border-status-success/30 font-bold'
              }`}>
                {isUserProvided ? 'User-Provided' : isNotChecked ? 'No Data / Not Checked' : 'Evidence Extracted'}
              </span>
            </h2>
            <p className="text-xs text-muted dark:text-lavender/80">
              Cross-examining official LinkedIn corporate presence and headcount claims
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          <a
            href={linkedinUrl || searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
          >
            <span>Search LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-muted hover:text-vfslate dark:text-lavender/70 dark:hover:text-mist hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200/60 dark:border-slate-700/60 space-y-6">
          {/* User-Provided Metrics Box */}
          {isUserProvided && (
            <div className="vf-inner-card p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-violet dark:text-lavender flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>User-Provided Verification Metrics</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet/15 dark:bg-violet/25 text-violet dark:text-lavender border border-violet/30 font-semibold">
                  [user-provided]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {claimedEmployeeCount !== null && (
                  <div className="p-3 rounded-lg bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40">
                    <span className="text-[11px] text-muted dark:text-lavender/80">Claimed Employee Count</span>
                    <div className="text-lg font-bold text-vfslate dark:text-mist font-mono mt-0.5">
                      {claimedEmployeeCount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-muted dark:text-lavender/70 font-mono">From offer / email</span>
                  </div>
                )}

                {linkedInEmployeeCount !== null && (
                  <div className="p-3 rounded-lg bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40">
                    <span className="text-[11px] text-muted dark:text-lavender/80">LinkedIn Employee Count</span>
                    <div className="text-lg font-bold text-vfslate dark:text-mist font-mono mt-0.5">
                      {linkedInEmployeeCount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-muted dark:text-lavender/70 font-mono">From LinkedIn page</span>
                  </div>
                )}

                {createdYear !== null && (
                  <div className="p-3 rounded-lg bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40">
                    <span className="text-[11px] text-muted dark:text-lavender/80">LinkedIn Page Created</span>
                    <div className="text-lg font-bold text-vfslate dark:text-mist font-mono mt-0.5">
                      {createdYear}
                    </div>
                    <span className="text-[10px] text-muted dark:text-lavender/70 font-mono">
                      ~{new Date().getFullYear() - createdYear} years active
                    </span>
                  </div>
                )}
              </div>

              {hasHeadcountDiscrepancy && (
                <div className="p-3 rounded-lg bg-status-danger/15 border border-status-danger/30 text-xs text-status-danger font-medium">
                  <strong>🚨 Headcount Discrepancy Flag [user-provided]:</strong> The claimed staff ({claimedEmployeeCount}) is $\ge 3\times$ higher than verified LinkedIn profiles ({linkedInEmployeeCount}). Startups with inflated headcounts frequently represent hiring scams or marketing exaggerations.
                </div>
              )}

              {isRecentPage && (
                <div className="p-3 rounded-lg bg-status-danger/15 border border-status-danger/30 text-xs text-status-danger font-medium">
                  <strong>🚨 Recent LinkedIn Page Flag [user-provided]:</strong> This LinkedIn page was created in {createdYear} (&lt; 1 year old). Newly registered profiles for supposed large firms require extreme caution.
                </div>
              )}
            </div>
          )}

          {/* Case 1: Unchecked / No Data */}
          {isNotChecked ? (
            <div className="vf-inner-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-vfslate dark:text-mist text-sm font-semibold">
                <HelpCircle className="w-4 h-4 text-muted dark:text-lavender/70" />
                <span>No Data / Not Checked</span>
              </div>
              <p className="text-xs text-muted dark:text-mist/90 leading-relaxed max-w-2xl">
                {message || 'No LinkedIn company URL or public profile was provided in the input text. Live headcount metrics, employee rosters, and turnover statistics require authenticated LinkedIn Enterprise credentials (unauthenticated web scraping is prohibited). Simulated profiles and fabricated turnover numbers are not generated.'}
              </p>
              <div className="pt-2">
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vf-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-2"
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
                <div className="vf-inner-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet flex items-center justify-center text-white font-black text-xl shrink-0 shadow">
                      in
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-vfslate dark:text-mist flex items-center gap-2">
                        <span>{companyName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet/15 dark:bg-violet/25 text-violet dark:text-lavender border border-violet/30 font-semibold">
                          Link in Input
                        </span>
                      </h3>
                      <p className="text-xs text-muted dark:text-lavender/80 break-all">{linkedinUrl}</p>
                    </div>
                  </div>

                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vf-btn-primary shrink-0 px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <span>View LinkedIn Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Metrics row (Only rendered if actual or demo data is present) */}
              {employeeCount !== null && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="vf-inner-card p-4">
                    <span className="text-[11px] font-mono uppercase text-muted dark:text-lavender/80">Headcount</span>
                    <div className="text-xl font-bold text-vfslate dark:text-mist font-mono mt-1">
                      {typeof employeeCount === 'number' ? employeeCount.toLocaleString() : employeeRange}
                    </div>
                  </div>
                  <div className="vf-inner-card p-4">
                    <span className="text-[11px] font-mono uppercase text-muted dark:text-lavender/80">Turnover Metric</span>
                    <div className="text-base font-semibold text-vfslate dark:text-mist font-mono mt-1">
                      {turnoverRate}
                    </div>
                  </div>
                  <div className="vf-inner-card p-4">
                    <span className="text-[11px] font-mono uppercase text-muted dark:text-lavender/80">Leadership Presence</span>
                    <div className="text-sm font-semibold text-vfslate dark:text-mist mt-1">
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
