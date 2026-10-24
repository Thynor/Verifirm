import React from 'react';
import { 
  Globe2, Mail, Lock, AlertTriangle, CheckCircle2, XCircle, 
  ShieldAlert, ShieldCheck, Link2, ExternalLink
} from 'lucide-react';

export function DigitalIdentitySection({ digitalIdentity = {} }) {
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
  const isDomainRisky = domainAge.includes('days old') || isTyposquatted || isFreeEmail;

  return (
    <div className="p-6 rounded-2xl bg-[#091020] border border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Digital Identity & WHOIS/RDAP Forensics</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                !hasDomain
                  ? 'bg-slate-900 text-slate-400 border-slate-800'
                  : isDomainRisky 
                    ? 'bg-rose-950 text-rose-400 border-rose-800' 
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}>
                {!hasDomain ? 'No Data / Not Checked' : isDomainRisky ? 'High Digital Risk' : 'Authentic Digital Identity'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live RDAP domain age verification, DNS (SPF & DMARC) sender record audit, and TLS certificate handshake
            </p>
          </div>
        </div>

        {hasDomain ? (
          <a
            href={`https://rdap.org/domain/${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <span>Query RDAP ({domain})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <a
            href="https://www.whois.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <span>whois.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {hasDomain ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1: Domain Age */}
            <div className={`p-4 rounded-xl border ${
              domainAge.includes('days old') ? 'bg-rose-950/20 border-rose-900/60' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <span className="text-[11px] font-mono uppercase text-slate-400">Domain Age (RDAP)</span>
              <div className="text-base font-bold text-white font-mono mt-1">{domainAge}</div>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                Registrar: <strong className="text-slate-300">{whoisRegistrar}</strong>
              </p>
              <div className={`mt-2 text-xs font-mono ${
                domainAge.includes('days old') ? 'text-rose-400 font-bold' : 'text-emerald-400'
              }`}>
                {domainSanity}
              </div>
            </div>

            {/* Pillar 2: Email Authenticity */}
            <div className={`p-4 rounded-xl border ${
              isFreeEmail ? 'bg-rose-950/20 border-rose-900/60' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <span className="text-[11px] font-mono uppercase text-slate-400">Sender Email Domain</span>
              <div className="text-sm font-bold text-white font-mono mt-1 truncate" title={claimedEmail}>
                {claimedEmail}
              </div>
              <div className="mt-2 text-xs flex items-center gap-1.5">
                {isFreeEmail ? (
                  <span className="text-rose-400 font-mono font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Free Public Provider</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Matches Corporate Domain</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                SPF: <strong className="text-slate-300">{spfStatus}</strong> • DMARC: <strong className="text-slate-300">{dmarcStatus}</strong>
              </p>
            </div>

            {/* Pillar 3: Typosquatting / Spoofing */}
            <div className={`p-4 rounded-xl border ${
              isTyposquatted ? 'bg-rose-950/20 border-rose-900/60' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <span className="text-[11px] font-mono uppercase text-slate-400">Lookalike / Spoof Check</span>
              <div className="text-sm font-bold text-white font-mono mt-1">
                {isTyposquatted ? 'Lookalike Alert!' : 'Clean Domain'}
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {spoofingCheck || 'No trademark mimicry or lookalike domain patterns detected.'}
              </p>
            </div>

            {/* Pillar 4: SSL & Website Hygiene */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400">TLS 443 Handshake</span>
              <div className="text-xs font-bold text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>{sslStatus}</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {websiteSanity || 'Peer certificate validated successfully.'}
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
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">
            No Corporate Website or Email Domain Provided in Input
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Live RDAP registration lookups, DNS SPF/DMARC resolution, and TLS handshakes are executed exclusively when a domain or official email address is detected in the input text.
          </p>
        </div>
      )}
    </div>
  );
}
