import React, { useState } from 'react';
import { 
  Globe2, Mail, Lock, AlertTriangle, CheckCircle2, XCircle, 
  ExternalLink, ChevronDown, ChevronUp 
} from 'lucide-react';

export function DigitalIdentitySection({ digitalIdentity = {}, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const {
    domain = 'N/A',
    claimedEmail = 'Not provided in input',
    isFreeEmail = false,
    isTyposquatted = false,
    domainAge = 'Unknown',
    domainSanity = '',
    whoisRegistrar = 'Unknown',
    sslStatus = 'N/A',
    emailAuthentication = 'N/A',
    spfStatus = 'Not checked',
    dmarcStatus = 'Not checked',
    spoofingCheck = '',
    websiteSanity = '',
    source = null,
    checkedAt = null
  } = digitalIdentity;

  const hasDomain = domain && domain !== 'N/A';
  const isDomainSanityWarning = 
    Boolean(domainSanity) && (
      domainSanity.toUpperCase().includes('CRITICAL') || 
      domainSanity.toUpperCase().includes('WARNING') || 
      domainSanity.toUpperCase().includes('FAIL') || 
      domainSanity.toUpperCase().includes('RISK')
    );
  const isDomainRisky = domainAge.includes('days old') || isTyposquatted || isFreeEmail || isDomainSanityWarning;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#091020] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-indigo-600/20 border border-blue-200 dark:border-indigo-500/40 flex items-center justify-center text-blue-600 dark:text-indigo-400 shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Website & Email Domain Check</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                !hasDomain
                  ? 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  : isDomainRisky 
                    ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' 
                    : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              }`}>
                {!hasDomain ? 'No Data / Not Checked' : isDomainRisky ? 'High Risk' : 'Authentic Domain'}
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Official registration date, email sender consistency, and SSL encryption status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          {hasDomain ? (
            <a
              href={`https://rdap.org/domain/${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all min-h-[36px]"
            >
              <span>Query RDAP ({domain})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <a
              href="https://www.whois.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all min-h-[36px]"
            >
              <span>whois.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

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

      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-slate-800 space-y-6">


      {hasDomain ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1: Domain Age */}
            <div className={`p-4 rounded-xl border ${
              domainAge.includes('days old') || isDomainSanityWarning 
                ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60' 
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
            }`}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Domain Age</span>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono mt-1">{domainAge}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Registrar: <strong className="text-slate-800 dark:text-slate-200">{whoisRegistrar}</strong>
              </p>
              {domainSanity && (
                <div className={`mt-2.5 text-xs rounded-lg p-2 ${
                  isDomainSanityWarning || domainAge.includes('days old')
                    ? 'text-rose-700 dark:text-rose-300 font-bold bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800'
                    : 'text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800'
                }`}>
                  {domainSanity}
                </div>
              )}
            </div>

            {/* Pillar 2: Email Authenticity */}
            <div className={`p-4 rounded-xl border ${
              isFreeEmail 
                ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60' 
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
            }`}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Sender Email Domain</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-1 truncate" title={claimedEmail}>
                {claimedEmail}
              </div>
              <div className="mt-2 text-xs flex items-center gap-1.5">
                {isFreeEmail ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Free Public Email</span>
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Matches Corporate Domain</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                SPF: <strong className="text-slate-800 dark:text-slate-200">{spfStatus}</strong> • DMARC: <strong className="text-slate-800 dark:text-slate-200">{dmarcStatus}</strong>
              </p>
            </div>

            {/* Pillar 3: Typosquatting / Spoofing */}
            <div className={`p-4 rounded-xl border ${
              isTyposquatted 
                ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60' 
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
            }`}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Lookalike / Spoof Check</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-1">
                {isTyposquatted ? 'Lookalike Alert!' : 'Clean Domain'}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {spoofingCheck || 'No trademark mimicry or lookalike domain patterns detected.'}
              </p>
            </div>

            {/* Pillar 4: SSL & Website Security */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Security Certificate (SSL)</span>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>{sslStatus}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {websiteSanity || 'SSL certificate verified and encrypted.'}
              </p>
            </div>
          </div>

          {source && (
            <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between px-1">
              <span>Source: {source}</span>
              {checkedAt && <span>Checked: {new Date(checkedAt).toLocaleTimeString()}</span>}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-indigo-500/10 border border-blue-200 dark:border-indigo-500/20 text-blue-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            No Corporate Website or Email Domain Provided in Input
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Live RDAP registration lookups, DNS SPF/DMARC checks, and SSL certificates are checked only when a corporate domain or official email address is detected in the input text.
          </p>
        </div>
      )}
        </div>
      )}
    </div>
  );
}

