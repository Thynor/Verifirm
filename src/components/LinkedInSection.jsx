import React, { useState } from 'react';
import { 
  Users, AlertTriangle, CheckCircle2, ShieldAlert, ExternalLink, HelpCircle,
  ChevronDown, ChevronUp, UserCheck, Search, Globe, Building2, Briefcase
} from 'lucide-react';

export function LinkedInSection({ linkedin = {}, defaultExpanded = true, companyName: propCompanyName = '' }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const {
    status = 'not_checked',
    companyName: initialCompanyName = 'Corporate Entity',
    linkedinUrl = '',
    searchUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(propCompanyName || initialCompanyName)}`,
    message = '',
    employeeCount = null,
    employeeRange = 'No data / not checked',
    profileQualityScore = null,
    profileAudit = [],
    turnoverRate = 'No data / not checked',
    turnoverAssessment = '',
    leadershipVisibility = 'Not checked',
    claimedEmployeeCount: initialClaimed = null,
    linkedInEmployeeCount: initialLinkedInCount = null,
    createdYear: initialCreatedYear = null,
    source = null,
    isDemo = false
  } = linkedin;

  const effectiveCompanyName = (propCompanyName || initialCompanyName || '').trim();

  // On-page search & interactive verification state
  const [companySearchQuery, setCompanySearchQuery] = useState(effectiveCompanyName);
  const [inputClaimed, setInputClaimed] = useState(initialClaimed ?? '');
  const [inputLinkedInCount, setInputLinkedInCount] = useState(initialLinkedInCount ?? '');
  const [inputYear, setInputYear] = useState(initialCreatedYear ?? '');

  const numClaimed = Number(inputClaimed) || null;
  const numLinkedIn = Number(inputLinkedInCount) || null;
  const numYear = Number(inputYear) || null;

  const isUserProvided = status === 'user_provided' || Boolean(numClaimed || numLinkedIn || numYear);
  const isNotChecked = !isUserProvided && (status === 'not_checked' || (!employeeCount && profileAudit.length === 0 && !linkedinUrl));

  const hasHeadcountDiscrepancy = numClaimed && numLinkedIn && (numClaimed >= 3 * numLinkedIn) && (numClaimed >= 30);
  const isRecentPage = numYear && (new Date().getFullYear() - numYear < 1);
  const isProportionNormal = numClaimed && numLinkedIn && !hasHeadcountDiscrepancy;

  const currentQuery = (companySearchQuery || effectiveCompanyName || '').trim();
  const activeSearchUrl = currentQuery
    ? `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(currentQuery)}`
    : searchUrl;
  const peopleSearchUrl = currentQuery
    ? `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(currentQuery)}`
    : 'https://www.linkedin.com';
  const jobsSearchUrl = currentQuery
    ? `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(currentQuery)}`
    : 'https://www.linkedin.com';
  const activeLinkedinUrl = linkedinUrl || (currentQuery ? `https://www.linkedin.com/company/${encodeURIComponent(currentQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}` : '');

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
            <h2 className="text-base sm:text-lg font-bold text-vfslate dark:text-mist flex items-center gap-2 flex-wrap">
              <span>Company Profile & Employee Headcount</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                isUserProvided
                  ? 'bg-violet/15 text-violet dark:text-lavender border-violet/30 font-semibold'
                  : isNotChecked 
                    ? 'bg-slate-100 dark:bg-slate-800/80 text-muted dark:text-lavender/80 border-slate-200 dark:border-slate-700' 
                    : 'bg-status-success/10 text-status-success border-status-success/30 font-bold'
              }`}>
                {isUserProvided ? 'User-Provided Verification' : isNotChecked ? 'No Data / Not Checked' : 'Evidence Extracted'}
              </span>
            </h2>
            <p className="text-xs text-muted dark:text-lavender/80">
              Cross-examining official LinkedIn corporate presence and headcount claims
            </p>
          </div>
        </div>

        {/* Header Actions: Dedicated Visit LinkedIn Web Button + Expand Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          <a
            href={activeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 font-semibold"
            title="Open LinkedIn search in a new tab"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Visit LinkedIn Web</span>
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
          {/* 1. On-Page Company Search & Quick Deep Links */}
          <div className="vf-inner-card p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-violet dark:text-lavender flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                <span>Search Company on LinkedIn</span>
              </label>
              <span className="text-[11px] text-muted dark:text-lavender/70">
                Inspect company profiles, staff lists, and official job postings
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-lavender/70" />
                <input
                  type="text"
                  value={companySearchQuery}
                  onChange={(e) => setCompanySearchQuery(e.target.value)}
                  placeholder="Enter company name or LinkedIn company handle..."
                  className="vf-input pl-9 pr-3 py-2 text-xs w-full bg-white/80 dark:bg-[#2f3242]/80 border border-slate-300 dark:border-slate-600 rounded-xl text-vfslate dark:text-mist focus:ring-2 focus:ring-violet focus:outline-none"
                />
              </div>

              {/* Dedicated Visit LinkedIn Web Button */}
              <a
                href={activeSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="vf-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center justify-center gap-2 shrink-0"
                title="Visit LinkedIn search on linkedin.com"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit LinkedIn Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Targeted Deep Search Navigation Buttons */}
            {currentQuery && (
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={activeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-violet/10 dark:bg-violet/20 hover:bg-violet/20 dark:hover:bg-violet/30 text-violet dark:text-lavender border border-violet/20 transition-colors inline-flex items-center gap-1.5 font-medium"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Company Overview ↗</span>
                </a>

                <a
                  href={peopleSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-violet/10 dark:bg-violet/20 hover:bg-violet/20 dark:hover:bg-violet/30 text-violet dark:text-lavender border border-violet/20 transition-colors inline-flex items-center gap-1.5 font-medium"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Employees & Leadership ↗</span>
                </a>

                <a
                  href={jobsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-violet/10 dark:bg-violet/20 hover:bg-violet/20 dark:hover:bg-violet/30 text-violet dark:text-lavender border border-violet/20 transition-colors inline-flex items-center gap-1.5 font-medium"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Job Listings ↗</span>
                </a>
              </div>
            )}
          </div>

          {/* 2. On-Page Verification Calculator (Cross-Check Form) */}
          <div className="vf-inner-card p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet dark:text-lavender flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>Verify Headcount & Page Age on Webpage</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet/15 dark:bg-violet/25 text-violet dark:text-lavender border border-violet/30 font-semibold">
                [interactive verification]
              </span>
            </div>

            <p className="text-xs text-muted dark:text-lavender/80">
              Enter the numbers you observe on LinkedIn to evaluate scam patterns in real time:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* LinkedIn Employee Count Input */}
              <div className="p-3 rounded-lg bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-1">
                <label className="text-[11px] font-semibold text-vfslate dark:text-mist block">
                  Employees on LinkedIn
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputLinkedInCount}
                  onChange={(e) => setInputLinkedInCount(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full px-2.5 py-1.5 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-600 bg-white/90 dark:bg-slate-800 text-vfslate dark:text-mist focus:ring-1 focus:ring-violet focus:outline-none"
                />
                <span className="text-[10px] text-muted dark:text-lavender/70 block">
                  Observed on company profile
                </span>
              </div>

              {/* Claimed Employee Count Input */}
              <div className="p-3 rounded-lg bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-1">
                <label className="text-[11px] font-semibold text-vfslate dark:text-mist block">
                  Claimed Employees in Offer
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputClaimed}
                  onChange={(e) => setInputClaimed(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-2.5 py-1.5 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-600 bg-white/90 dark:bg-slate-800 text-vfslate dark:text-mist focus:ring-1 focus:ring-violet focus:outline-none"
                />
                <span className="text-[10px] text-muted dark:text-lavender/70 block">
                  Stated in email / offer letter
                </span>
              </div>

              {/* Page Created Year Input */}
              <div className="p-3 rounded-lg bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-1">
                <label className="text-[11px] font-semibold text-vfslate dark:text-mist block">
                  Page Created / Founded Year
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={inputYear}
                  onChange={(e) => setInputYear(e.target.value)}
                  placeholder={`e.g. ${new Date().getFullYear() - 3}`}
                  className="w-full px-2.5 py-1.5 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-600 bg-white/90 dark:bg-slate-800 text-vfslate dark:text-mist focus:ring-1 focus:ring-violet focus:outline-none"
                />
                <span className="text-[10px] text-muted dark:text-lavender/70 block">
                  {numYear ? `~${new Date().getFullYear() - numYear} years active` : 'Founding or registration year'}
                </span>
              </div>
            </div>

            {/* Real-Time Evaluation Alerts */}
            {hasHeadcountDiscrepancy && (
              <div className="p-3 rounded-lg bg-status-danger/15 border border-status-danger/30 text-xs text-status-danger font-medium space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>🚨 Headcount Discrepancy Flag [user-provided]:</span>
                </div>
                <p>
                  Claimed staff ({numClaimed.toLocaleString()}) is <strong>{(numClaimed / numLinkedIn).toFixed(1)}× higher</strong> than verified LinkedIn profiles ({numLinkedIn.toLocaleString()}). Fake firms commonly claim hundreds of employees while possessing fewer than a dozen verifiable profiles.
                </p>
              </div>
            )}

            {isRecentPage && (
              <div className="p-3 rounded-lg bg-status-danger/15 border border-status-danger/30 text-xs text-status-danger font-medium space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>🚨 Recent LinkedIn Page Flag [user-provided]:</span>
                </div>
                <p>
                  This company profile was created in {numYear} (&lt; 1 year active). Brand-new profiles claiming major corporate operations require extreme scrutiny.
                </p>
              </div>
            )}

            {isProportionNormal && (
              <div className="p-3 rounded-lg bg-status-success/15 border border-status-success/30 text-xs text-status-success font-medium space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>✓ Headcount Ratio Normal [user-provided]:</span>
                </div>
                <p>
                  Claimed headcount ({numClaimed.toLocaleString()}) is proportionate with the {numLinkedIn.toLocaleString()} profiles visible on LinkedIn.
                </p>
              </div>
            )}
          </div>

          {/* 3. Link Found in Input or DEMO Scenario */}
          {linkedinUrl && (
            <div className="vf-inner-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet flex items-center justify-center text-white font-black text-xl shrink-0 shadow">
                  in
                </div>
                <div>
                  <h3 className="text-base font-bold text-vfslate dark:text-mist flex items-center gap-2">
                    <span>{effectiveCompanyName}</span>
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

          {/* 4. Extracted / Demo Metrics row */}
          {employeeCount !== null && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          {/* 5. Honest Explanation Note for Unauthenticated Scraping */}
          <div className="vf-inner-card p-4 text-xs text-muted dark:text-lavender/80 space-y-1.5 border-l-4 border-l-violet">
            <div className="flex items-center gap-2 font-bold text-vfslate dark:text-mist">
              <HelpCircle className="w-4 h-4 text-violet dark:text-lavender shrink-0" />
              <span>Why automated LinkedIn scraping is blocked</span>
            </div>
            <p className="leading-relaxed">
              LinkedIn protects user data with mandatory authentication and blocks external scraping bots with strict firewalls. In accordance with VeriFirm's <strong>Zero Data Fabrication Guarantee</strong>, we never invent synthetic employee profiles or fabricated turnover statistics. Use the <strong>on-page verification calculator</strong> above or click <strong>Visit LinkedIn Web</strong> to inspect authentic corporate pages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
