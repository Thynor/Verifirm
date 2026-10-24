import React, { useState } from 'react';
import { 
  MapPin, Phone, Building, ExternalLink, Mail, Globe,
  ChevronDown, ChevronUp 
} from 'lucide-react';

export function PhysicalFootprintSection({ physical = {}, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const {
    status = 'not_checked',
    source = null,
    checkedAt = null,
    officeAddress = null,
    buildingType = 'Not provided in input',
    streetViewStatus = 'No address provided',
    contactDetails = {},
    ownershipAudit = {}
  } = physical;

  const hasAddress = Boolean(officeAddress && officeAddress.trim());
  const mapsUrl = hasAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}` : null;
  const embedMapsUrl = hasAddress ? `https://maps.google.com/maps?q=${encodeURIComponent(officeAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed` : null;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#091020] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Physical Office Location & Coordinates</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                hasAddress 
                  ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' 
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}>
                {hasAddress ? 'Extracted from Input' : 'No Data / Not Checked'}
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Cross-referencing operating address and official communications against public geographic data
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          {hasAddress && mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all min-h-[36px]"
            >
              <span>Open in Google Maps</span>
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

      {/* Expanded Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
          {hasAddress ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Address Card & Google Maps Embed */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Physical Address Detected in Input</span>
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Source: Input Text</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white font-mono leading-relaxed">
                      {officeAddress}
                    </p>
                  </div>

                  {/* Google Map Preview */}
                  <div className="h-52 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-white dark:bg-slate-950">
                    <iframe
                      title="Google Maps Location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src={embedMapsUrl}
                      className="opacity-95 hover:opacity-100 transition-opacity"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
                    <strong>Advisory:</strong> Cross-check this location against the registered office address on the MCA portal to confirm genuine physical presence.
                  </div>
                </div>
              </div>

              {/* Extracted Contact Details */}
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Extracted Contact Coordinates</span>
                  </span>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span>Phone / Switchboard:</span>
                      </span>
                      <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                        {contactDetails.phone || 'Not provided in input'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span>Contact Email:</span>
                      </span>
                      <p className="text-sm font-mono font-bold text-purple-700 dark:text-purple-300">
                        {contactDetails.email || 'Not provided in input'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span>Website:</span>
                      </span>
                      <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-300">
                        {contactDetails.website || 'Not provided in input'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No Address in Input View - 0 Map, 0 Hallucination */
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                <Building className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No Physical Address Provided in Input
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  No operating or registered office address was detected in the submitted input text or document.
                </p>
              </div>

              <div className="text-[11px] text-slate-500 max-w-lg mx-auto border-t border-slate-200 dark:border-slate-800/80 pt-3">
                <strong>Geographic Verification Rule:</strong> VeriFirm never defaults to another company's address, coordinates, or map embed. Physical location audits are rendered strictly when an address is extracted from user input.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
