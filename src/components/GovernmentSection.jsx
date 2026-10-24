import React, { useState } from 'react';
import { 
  Building2, CheckCircle2, XCircle, AlertTriangle, FileCheck, 
  ExternalLink, Hash, Landmark, Search, ChevronDown, ChevronUp
} from 'lucide-react';

export function GovernmentSection({ government = {}, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const {
    status = 'not_checked',
    cin = null,
    cinValid = false,
    listingStatus = null,
    isListed = false,
    state = null,
    yearOfIncorporation = null,
    companyType = null,
    taxIdentifiers = null,
    officialPortalUrl = 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do',
    officialGstUrl = 'https://services.gst.gov.in/services/searchtp',
    message = 'No statutory Corporate Identification Number (CIN) was provided in the input text.'
  } = government;

  const hasCin = Boolean(cin);

  return (
    <div className="vf-card overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-violet/5 dark:hover:bg-violet/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet/15 dark:bg-violet/25 border border-violet/30 flex items-center justify-center text-violet dark:text-lavender shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-vfslate dark:text-mist flex items-center gap-2">
              <span>Government & Corporate Registries (MCA / GSTIN)</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                cinValid 
                  ? 'bg-status-success/10 text-status-success border-status-success/30 font-bold' 
                  : 'bg-slate-100 dark:bg-slate-800/80 text-muted dark:text-lavender/80 border-slate-200 dark:border-slate-700'
              }`}>
                {cinValid ? 'Valid Statutory CIN' : 'No Data / Not Checked'}
              </span>
            </h2>
            <p className="text-xs text-muted dark:text-lavender/80">
              Validating Ministry of Corporate Affairs (mca.gov.in) statutory structure and GSTIN tax records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          <a
            href={officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
          >
            <span>Official MCA Portal</span>
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

      {/* Expanded Main Grid */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200/60 dark:border-slate-700/60 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: MCA Registry Check */}
            <div className="vf-inner-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-vfslate dark:text-mist text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-violet dark:text-lavender" />
                  <span>Ministry of Corporate Affairs (MCA) Record</span>
                </span>
                {cinValid ? (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-status-success/10 text-status-success border border-status-success/30 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Format Verified</span>
                  </span>
                ) : (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted dark:text-lavender/80 border border-slate-200 dark:border-slate-700">
                    Not Provided / Unverified
                  </span>
                )}
              </div>

              {cinValid && cin ? (
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40">
                    <span className="text-muted dark:text-lavender/80">Corporate ID (CIN):</span>
                    <span className="text-violet dark:text-lavender font-bold">{cin}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/50 dark:bg-[#2f3242]/50 border border-slate-300/30 dark:border-slate-600/30">
                    <span className="text-muted dark:text-lavender/80">Registered State:</span>
                    <span className="text-vfslate dark:text-mist font-semibold">{state || 'Decoded from CIN'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/50 dark:bg-[#2f3242]/50 border border-slate-300/30 dark:border-slate-600/30">
                    <span className="text-muted dark:text-lavender/80">Company Classification:</span>
                    <span className="text-vfslate dark:text-mist font-semibold">{companyType || 'Decoded from CIN'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/50 dark:bg-[#2f3242]/50 border border-slate-300/30 dark:border-slate-600/30">
                    <span className="text-muted dark:text-lavender/80">Year of Incorporation:</span>
                    <span className="text-vfslate dark:text-mist font-semibold">{yearOfIncorporation || 'Decoded from CIN'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/50 dark:bg-[#2f3242]/50 border border-slate-300/30 dark:border-slate-600/30">
                    <span className="text-muted dark:text-lavender/80">Listing Status:</span>
                    <span className="text-vfslate dark:text-mist font-semibold">{listingStatus || (isListed ? 'Listed Public' : 'Unlisted')}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-violet/10 dark:bg-violet/20 border border-violet/25 text-[11px] text-vfslate dark:text-mist font-sans mt-3">
                    <strong>Statutory Verification Notice:</strong> The CIN format matches statutory Indian Ministry of Corporate Affairs rules. Live director list, authorized capital, and annual returns can be verified directly on the MCA portal using the official link above.
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/60 dark:bg-[#2f3242]/60 border border-slate-300/40 dark:border-slate-600/40 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-vfslate dark:text-mist">
                    <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
                    <span className="font-semibold">No CIN Provided in Input</span>
                  </div>
                  <p className="text-muted dark:text-mist/90 leading-relaxed text-[11px]">
                    {message}
                  </p>
                  <div className="pt-2">
                    <a
                      href={officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 font-mono"
                    >
                      <span>Search MCA Master Data</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Tax Identifiers (GSTIN & PAN) */}
            <div className="vf-inner-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-vfslate dark:text-mist text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-violet dark:text-lavender" />
                  <span>Tax & Commercial Identifiers (GSTIN / PAN)</span>
                </span>
                <span className="text-xs font-mono text-muted dark:text-lavender/80">Statutory Tax Identification</span>
              </div>

              {taxIdentifiers && taxIdentifiers.gstin ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted dark:text-lavender/80 font-mono">GSTIN:</span>
                      <span className="text-status-success font-mono font-bold">Valid Format</span>
                    </div>
                    <div className="text-sm font-mono font-bold text-vfslate dark:text-mist">{taxIdentifiers.gstin}</div>
                    <p className="text-[11px] text-muted dark:text-lavender/80">
                      State Jurisdiction Code: {taxIdentifiers.stateCode}
                    </p>
                  </div>

                  {taxIdentifiers.pan && (
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted dark:text-lavender/80 font-mono">PAN:</span>
                        <span className="text-violet dark:text-lavender font-mono font-semibold">Extracted</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-vfslate dark:text-mist">{taxIdentifiers.pan}</div>
                      <p className="text-[11px] text-muted dark:text-lavender/80">
                        Entity Type: {taxIdentifiers.panEntityType}
                      </p>
                    </div>
                  )}

                  <a
                    href={officialGstUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 font-mono"
                  >
                    <span>Verify on Official GST Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/60 dark:bg-[#2f3242]/60 border border-slate-300/40 dark:border-slate-600/40 space-y-3 text-xs">
                  <div className="text-vfslate dark:text-mist">
                    No GSTIN or PAN was extracted from the input text.
                  </div>
                  <p className="text-muted dark:text-mist/90 text-[11px] leading-relaxed">
                    Registered business entities in India issuing invoices or paying compensation provide their GSTIN or PAN. You can verify taxpayers on the official GST portal.
                  </p>
                  <a
                    href={officialGstUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 font-mono"
                  >
                    <span>Search GST Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
