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
    <div className="vf-card overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-violet/5 dark:hover:bg-violet/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet/15 dark:bg-violet/25 border border-violet/30 flex items-center justify-center text-violet dark:text-lavender shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-vfslate dark:text-mist flex items-center gap-2">
              <span>Website & Email Domain Check</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                !hasDomain
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-muted dark:text-lavender/80 border-slate-200 dark:border-slate-700'
                  : isDomainRisky 
                    ? 'bg-status-danger/10 text-status-danger border-status-danger/30 font-bold' 
                    : 'bg-status-success/10 text-status-success border-status-success/30 font-bold'
              }`}>
                {!hasDomain ? 'No Data / Not Checked' : isDomainRisky ? 'High Risk' : 'Authentic Domain'}
              </span>
            </h2>
            <p className="text-xs text-muted dark:text-lavender/80">
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
              className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
            >
              <span>Query RDAP ({domain})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <a
              href="https://www.whois.com"
              target="_blank"
              rel="noopener noreferrer"
              className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
            >
              <span>whois.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

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

      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200/60 dark:border-slate-700/60 space-y-6">

      {hasDomain ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1: Domain Age */}
            <div className={`p-4 rounded-xl border ${
              domainAge.includes('days old') || isDomainSanityWarning 
                ? 'bg-status-danger/10 border-status-danger/30 text-vfslate dark:text-mist' 
                : 'vf-inner-card'
            }`}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted dark:text-lavender/80">Domain Age</span>
              <div className="text-base font-bold text-vfslate dark:text-mist font-mono mt-1">{domainAge}</div>
              <p className="text-xs text-muted dark:text-lavender/80 mt-2">
                Registrar: <strong className="text-vfslate dark:text-mist">{whoisRegistrar}</strong>
              </p>
              {domainSanity && (
                <div className={`mt-2.5 text-xs rounded-lg p-2.5 ${
                  isDomainSanityWarning || domainAge.includes('days old')
                    ? 'text-status-danger font-bold bg-status-danger/15 border border-status-danger/30'
                    : 'text-status-success font-semibold bg-status-success/10 border border-status-success/30'
                }`}>
                  {domainSanity}
                </div>
              )}
            </div>

            {/* Pillar 2: Email Authenticity */}
            <div className={`p-4 rounded-xl border ${
              isFreeEmail 
                ? 'bg-status-danger/10 border-status-danger/30 text-vfslate dark:text-mist' 
                : 'vf-inner-card'
            }`}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted dark:text-lavender/80">Sender Email Domain</span>
              <div className="text-sm font-bold text-vfslate dark:text-mist font-mono mt-1 truncate" title={claimedEmail}>
                {claimedEmail}
              </div>
              <div className="mt-2 text-xs flex items-center gap-1.5">
                {isFreeEmail ? (
                  <span className="text-status-danger font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Free Public Email</span>
                  </span>
                ) : (
                  <span className="text-status-success font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Matches Corporate Domain</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted dark:text-lavender/80 mt-2">
                SPF: <strong className="text-vfslate dark:text-mist">{spfStatus}</strong> • DMARC: <strong className="text-vfslate dark:text-mist">{dmarcStatus}</strong>
              </p>
            </div>

            {/* Pillar 3: Typosquatting / Spoofing */}
            <div className={`p-4 rounded-xl border ${
              isTyposquatted 
                ? 'bg-status-danger/10 border-status-danger/30 text-vfslate dark:text-mist' 
                : 'vf-inner-card'
            }`}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted dark:text-lavender/80">Lookalike / Spoof Check</span>
              <div className="text-sm font-bold text-vfslate dark:text-mist font-mono mt-1">
                {isTyposquatted ? 'Lookalike Alert!' : 'Clean Domain'}
              </div>
              <p className="text-xs text-muted dark:text-mist/90 mt-2 leading-relaxed">
                {spoofingCheck || 'No trademark mimicry or lookalike domain patterns detected.'}
              </p>
            </div>

            {/* Pillar 4: SSL & Website Security */}
            <div className="vf-inner-card p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted dark:text-lavender/80">Security Certificate (SSL)</span>
              <div className="text-xs font-bold text-status-success font-mono mt-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>{sslStatus}</span>
              </div>
              <p className="text-xs text-muted dark:text-mist/90 mt-2 leading-relaxed">
                {websiteSanity || 'SSL certificate verified and encrypted.'}
              </p>
            </div>
          </div>

          {source && (
            <div className="text-[11px] font-mono text-muted dark:text-lavender/70 flex items-center justify-between px-1">
              <span>Source: {source}</span>
              {checkedAt && <span>Checked: {new Date(checkedAt).toLocaleTimeString()}</span>}
            </div>
          )}
        </div>
      ) : (
        <div className="vf-inner-card p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-violet/15 dark:bg-violet/25 border border-violet/30 text-violet dark:text-lavender flex items-center justify-center mx-auto">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-vfslate dark:text-mist">
            No Corporate Website or Email Domain Provided in Input
          </h3>
          <p className="text-xs text-muted dark:text-lavender/80 max-w-md mx-auto leading-relaxed">
            Live RDAP registration lookups, DNS SPF/DMARC checks, and SSL certificates are checked only when a corporate domain or official email address is detected in the input text.
          </p>
        </div>
      )}
        </div>
      )}
    </div>
  );
}

