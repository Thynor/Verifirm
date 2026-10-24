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
    <div className="vf-card overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-violet/5 dark:hover:bg-violet/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet/15 dark:bg-violet/25 border border-violet/30 flex items-center justify-center text-violet dark:text-lavender shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-vfslate dark:text-mist flex items-center gap-2">
              <span>Physical Office Location & Coordinates</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                hasAddress 
                  ? 'bg-violet/15 text-violet dark:text-lavender border-violet/30 font-semibold' 
                  : 'bg-slate-100 dark:bg-slate-800/80 text-muted dark:text-lavender/80 border-slate-200 dark:border-slate-700'
              }`}>
                {hasAddress ? 'Extracted from Input' : 'No Data / Not Checked'}
              </span>
            </h2>
            <p className="text-xs text-muted dark:text-lavender/80">
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
              className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
            >
              <span>Open in Google Maps</span>
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

      {/* Expanded Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200/60 dark:border-slate-700/60 space-y-6">
          {hasAddress ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Address Card & Google Maps Embed */}
              <div className="lg:col-span-2 space-y-4">
                <div className="vf-inner-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-vfslate dark:text-mist text-sm flex items-center gap-2">
                      <Building className="w-4 h-4 text-violet dark:text-lavender" />
                      <span>Physical Address Detected in Input</span>
                    </span>
                    <span className="text-xs font-mono text-muted dark:text-lavender/80">Source: Input Text</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-2">
                    <p className="text-sm font-semibold text-vfslate dark:text-mist font-mono leading-relaxed">
                      {officeAddress}
                    </p>
                  </div>

                  {/* Google Map Preview */}
                  <div className="h-52 w-full rounded-xl overflow-hidden border border-slate-300/40 dark:border-slate-600/40 relative bg-mist/50 dark:bg-[#2f3242]/50">
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

                  <div className="p-3 rounded-lg bg-violet/10 dark:bg-violet/20 border border-violet/25 text-xs text-muted dark:text-mist/90">
                    <strong>Advisory:</strong> Cross-check this location against the registered office address on the MCA portal to confirm genuine physical presence.
                  </div>
                </div>
              </div>

              {/* Extracted Contact Details */}
              <div className="space-y-4">
                <div className="vf-inner-card p-5 space-y-4">
                  <span className="font-semibold text-vfslate dark:text-mist text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-violet dark:text-lavender" />
                    <span>Extracted Contact Coordinates</span>
                  </span>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-1">
                      <span className="text-muted dark:text-lavender/80 uppercase font-mono text-[10px] flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-violet dark:text-lavender" />
                        <span>Phone / Switchboard:</span>
                      </span>
                      <p className="text-sm font-mono font-bold text-vfslate dark:text-mist">
                        {contactDetails.phone || 'Not provided in input'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-1">
                      <span className="text-muted dark:text-lavender/80 uppercase font-mono text-[10px] flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-violet dark:text-lavender" />
                        <span>Contact Email:</span>
                      </span>
                      <p className="text-sm font-mono font-bold text-violet dark:text-lavender">
                        {contactDetails.email || 'Not provided in input'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-1">
                      <span className="text-muted dark:text-lavender/80 uppercase font-mono text-[10px] flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-violet dark:text-lavender" />
                        <span>Website:</span>
                      </span>
                      <p className="text-sm font-mono font-bold text-vfslate dark:text-mist">
                        {contactDetails.website || 'Not provided in input'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No Address in Input View - 0 Map, 0 Hallucination */
            <div className="vf-inner-card p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet/15 dark:bg-violet/25 border border-violet/30 text-violet dark:text-lavender flex items-center justify-center mx-auto">
                <Building className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-vfslate dark:text-mist">
                  No Physical Address Provided in Input
                </h3>
                <p className="text-xs text-muted dark:text-lavender/80 leading-relaxed">
                  No operating or registered office address was detected in the submitted input text or document.
                </p>
              </div>

              <div className="text-[11px] text-muted dark:text-lavender/70 max-w-lg mx-auto border-t border-slate-300/40 dark:border-slate-600/40 pt-3">
                <strong>Geographic Verification Rule:</strong> VeriFirm never defaults to another company's address, coordinates, or map embed. Physical location audits are rendered strictly when an address is extracted from user input.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
