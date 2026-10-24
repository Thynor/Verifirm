import React from 'react';
import { 
  Building2, CheckCircle2, XCircle, AlertTriangle, FileCheck, 
  ExternalLink, Hash, Landmark, Search
} from 'lucide-react';

export function GovernmentSection({ government = {} }) {
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
    <div className="p-6 rounded-2xl bg-[#091020] border border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Government & Corporate Registry Verification</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                cinValid 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {cinValid ? 'Valid Statutory CIN' : 'No Data / Not Checked'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Validating Ministry of Corporate Affairs (mca.gov.in) statutory structure and GSTIN tax records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <span>Official MCA Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Grid: MCA Registry Check + Tax Identifiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: MCA Registry Check */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Ministry of Corporate Affairs (MCA) Record</span>
            </span>
            {cinValid ? (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Format Verified</span>
              </span>
            ) : (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                Not Provided / Unverified
              </span>
            )}
          </div>

          {cinValid && cin ? (
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Corporate ID (CIN):</span>
                <span className="text-cyan-300 font-bold">{cin}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400">Registered State:</span>
                <span className="text-slate-200">{state || 'Decoded from CIN'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400">Company Classification:</span>
                <span className="text-slate-200">{companyType || 'Decoded from CIN'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400">Year of Incorporation:</span>
                <span className="text-slate-200">{yearOfIncorporation || 'Decoded from CIN'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400">Listing Status:</span>
                <span className="text-slate-200">{listingStatus || (isListed ? 'Listed Public' : 'Unlisted')}</span>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/30 text-[11px] text-cyan-300 font-sans mt-3">
                <strong>Statutory Verification Notice:</strong> The CIN format matches statutory Indian Ministry of Corporate Affairs rules. Live director list, authorized capital, and annual returns can be verified directly on the MCA portal using the official link above.
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">No CIN Provided in Input</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {message}
              </p>
              <div className="pt-2">
                <a
                  href={officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-all"
                >
                  <span>Search MCA Master Data</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Tax Identifiers (GSTIN & PAN) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Tax & Commercial Identifiers (GSTIN / PAN)</span>
            </span>
            <span className="text-xs font-mono text-slate-400">Statutory Tax Identification</span>
          </div>

          {taxIdentifiers && taxIdentifiers.gstin ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-mono">GSTIN:</span>
                  <span className="text-emerald-400 font-mono font-semibold">Valid Format</span>
                </div>
                <div className="text-sm font-mono font-bold text-slate-100">{taxIdentifiers.gstin}</div>
                <p className="text-[11px] text-slate-400">
                  State Jurisdiction Code: {taxIdentifiers.stateCode}
                </p>
              </div>

              {taxIdentifiers.pan && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-mono">PAN:</span>
                    <span className="text-cyan-400 font-mono">Extracted</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-100">{taxIdentifiers.pan}</div>
                  <p className="text-[11px] text-slate-400">
                    Entity Type: {taxIdentifiers.panEntityType}
                  </p>
                </div>
              )}

              <a
                href={officialGstUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-all"
              >
                <span>Verify on Official GST Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="text-slate-400">
                No GSTIN or PAN was extracted from the input text.
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Registered business entities in India issuing invoices or paying compensation provide their GSTIN or PAN. You can verify taxpayers on the official GST portal.
              </p>
              <a
                href={officialGstUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-all"
              >
                <span>Search GST Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
