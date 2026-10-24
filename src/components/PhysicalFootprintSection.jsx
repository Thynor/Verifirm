import React from 'react';
import { 
  MapPin, Phone, Building, ExternalLink, Mail, Globe 
} from 'lucide-react';

export function PhysicalFootprintSection({ physical = {} }) {
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
    <div className="p-6 rounded-2xl bg-[#091020] border border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Physical Footprint & Office Address</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                hasAddress 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {hasAddress ? 'Extracted from Input' : 'No Data / Not Checked'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Cross-referencing operating address and official communications against public geographic data
            </p>
          </div>
        </div>

        {hasAddress && mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {hasAddress ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Address Card & Google Maps Embed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-cyan-400" />
                  <span>Physical Address Detected in Input</span>
                </span>
                <span className="text-xs font-mono text-slate-400">Source: Input Text</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="text-sm font-semibold text-white font-mono leading-relaxed">
                  {officeAddress}
                </p>
              </div>

              {/* Google Map Preview */}
              <div className="h-52 w-full rounded-xl overflow-hidden border border-slate-800 relative bg-slate-950">
                <iframe
                  title="Google Maps Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={embedMapsUrl}
                  className="opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
                <strong>Advisory:</strong> Cross-check this location against the registered office address on the MCA portal to confirm genuine physical presence.
              </div>
            </div>
          </div>

          {/* Extracted Contact Details */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <span className="font-semibold text-white text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Extracted Contact Coordinates</span>
              </span>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase font-mono text-[10px] flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>Phone / Switchboard:</span>
                  </span>
                  <p className="text-sm font-mono font-bold text-white">
                    {contactDetails.phone || 'Not provided in input'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase font-mono text-[10px] flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-cyan-400" />
                    <span>Contact Email:</span>
                  </span>
                  <p className="text-sm font-mono font-bold text-cyan-300">
                    {contactDetails.email || 'Not provided in input'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase font-mono text-[10px] flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-cyan-400" />
                    <span>Website:</span>
                  </span>
                  <p className="text-sm font-mono font-bold text-slate-300">
                    {contactDetails.website || 'Not provided in input'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No Address in Input View - 0 Map, 0 Hallucination */
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <Building className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-semibold text-slate-200">
              No Physical Address Provided in Input
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No operating or registered office address was detected in the submitted input text or document.
            </p>
          </div>

          <div className="text-[11px] text-slate-500 max-w-lg mx-auto border-t border-slate-800/80 pt-3">
            <strong>Geographic Verification Rule:</strong> VeriFirm never defaults to another company's address, coordinates, or map embed. Physical location audits are rendered strictly when an address is extracted from user input.
          </div>
        </div>
      )}
    </div>
  );
}
