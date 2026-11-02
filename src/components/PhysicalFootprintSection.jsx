import React, { useState } from 'react';
import { 
  MapPin, Phone, Building, ExternalLink, Mail, Globe,
  ChevronDown, ChevronUp, AlertTriangle, Search, CheckCircle2
} from 'lucide-react';

export function PhysicalFootprintSection({ physical = {}, defaultExpanded = true, companyName = '' }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const {
    status = 'not_checked',
    source = null,
    checkedAt = null,
    officeAddress = null,
    contactDetails = {},
    message = null
  } = physical;

  const targetCompany = (companyName || physical.companyName || '').trim();
  const [customAddress, setCustomAddress] = useState('');
  const [customMapUrl, setCustomMapUrl] = useState(null);

  const hasAddress = Boolean(officeAddress && officeAddress.trim());
  const activeAddress = customAddress.trim() || officeAddress;
  const mapsUrl = activeAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeAddress)}` : null;
  const embedMapsUrl = activeAddress ? `https://maps.google.com/maps?q=${encodeURIComponent(activeAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed` : null;

  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (!customAddress.trim()) return;
    setCustomMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(customAddress.trim())}&t=&z=14&ie=UTF8&iwloc=&output=embed`);
  };

  const getBadge = () => {
    if (status === 'found_online') {
      return {
        label: '✓ Building Verified',
        className: 'bg-status-success/10 text-status-success border-status-success/30 font-bold'
      };
    }
    if (status === 'found_in_input') {
      return {
        label: 'Address in Input',
        className: 'bg-violet/15 text-violet dark:text-lavender border-violet/30 font-semibold'
      };
    }
    if (status === 'user_provided') {
      return {
        label: 'User-Provided Address',
        className: 'bg-violet/15 text-violet dark:text-lavender border-violet/30 font-semibold'
      };
    }
    if (status === 'no_building_found') {
      return {
        label: '⚠️ No Physical Building Found',
        className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/35 font-bold'
      };
    }
    return {
      label: 'No Data / Not Checked',
      className: 'bg-slate-100 dark:bg-slate-800/80 text-muted dark:text-lavender/80 border-slate-200 dark:border-slate-700'
    };
  };

  const badge = getBadge();

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
            <h2 className="text-base sm:text-lg font-bold text-vfslate dark:text-mist flex items-center gap-2 flex-wrap">
              <span>Physical Office Location & Coordinates</span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${badge.className}`}>
                {badge.label}
              </span>
            </h2>
            <p className="text-xs text-muted dark:text-lavender/80">
              Cross-referencing operating address and official communications against public geographic registries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 font-semibold"
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
                      <span>{status === 'found_online' ? 'Registered Office Building' : 'Physical Address Detected in Input'}</span>
                    </span>
                    <span className="text-xs font-mono text-muted dark:text-lavender/80">
                      Source: {source || 'Geographic Directory'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-2">
                    <p className="text-sm font-semibold text-vfslate dark:text-mist font-mono leading-relaxed">
                      {officeAddress}
                    </p>
                  </div>

                  {/* Google Map Preview */}
                  <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-300/40 dark:border-slate-600/40 relative bg-mist/50 dark:bg-[#2f3242]/50">
                    <iframe
                      title="Google Maps Location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src={customMapUrl || embedMapsUrl}
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
                    <span>Contact Coordinates</span>
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
          ) : status === 'no_building_found' ? (
            /* Explicit Warning: Company Does Not Have a Registered Building */
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-amber-900 dark:text-amber-300">
                      ⚠️ Company Does Not Have a Registered Physical Building
                    </h3>
                    <p className="text-xs text-vfslate/90 dark:text-mist/90 leading-relaxed">
                      {message || `No registered office building, corporate campus, or verifiable physical commercial premises could be located for "${targetCompany || 'this organization'}" in public geographic directories.`}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/80 dark:bg-[#2f3242]/80 border border-amber-500/20 text-xs space-y-2">
                  <span className="font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px] font-mono">
                    Candidate Protection Standard:
                  </span>
                  <p className="text-muted dark:text-mist/90 leading-relaxed">
                    Legitimate employers maintain verifiable physical headquarters, commercial office space, or registered statutory premises. Organizations that exist exclusively as virtual entities or social profiles without a physical building carry elevated recruitment fraud risk.
                  </p>
                </div>
              </div>

              {/* On-Page Address Verification Tool */}
              <div className="vf-inner-card p-5 space-y-3">
                <span className="font-semibold text-vfslate dark:text-mist text-xs flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-violet dark:text-lavender" />
                  <span>Test or Geocode Any Address Manually:</span>
                </span>
                <form onSubmit={handleCustomSearch} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Enter company address, tech park, or building to locate on map..."
                    className="vf-input flex-1 text-xs py-2"
                  />
                  <button
                    type="submit"
                    className="vf-btn-primary px-4 py-2 text-xs font-semibold shrink-0"
                  >
                    View Map
                  </button>
                </form>

                {customMapUrl && (
                  <div className="h-48 w-full rounded-xl overflow-hidden border border-slate-300/40 dark:border-slate-600/40 relative mt-3">
                    <iframe
                      title="Custom Map Preview"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      src={customMapUrl}
                    />
                  </div>
                )}
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
