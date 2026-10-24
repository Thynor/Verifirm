// Real Network Check Service (RDAP, DNS, TLS)
// No simulated or fabricated data. Every result includes source and checkedAt timestamp.

import dns from 'dns';
import tls from 'tls';

const dnsPromises = dns.promises;

/**
 * Real RDAP Domain Registration Age & Registrar Lookup
 */
export async function lookupRdapDomain(domain) {
  if (!domain || typeof domain !== 'string') {
    return {
      status: 'not_checked',
      source: null,
      checkedAt: null,
      message: 'No domain provided for RDAP lookup.'
    };
  }

  const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
  
  // Ignore localhost / IP addresses
  if (cleanDomain === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(cleanDomain)) {
    return {
      status: 'not_checked',
      domain: cleanDomain,
      source: null,
      checkedAt: null,
      message: 'Localhost or IP address; public RDAP lookup not applicable.'
    };
  }

  const checkedAt = new Date().toISOString();

  try {
    const rdapUrl = `https://rdap.org/domain/${encodeURIComponent(cleanDomain)}`;
    const response = await fetch(rdapUrl, {
      headers: {
        'User-Agent': 'VeriFirmEvidenceAudit/2.0 (Scam Prevention Research)'
      },
      signal: AbortSignal.timeout(4500)
    });

    if (!response.ok) {
      return {
        status: 'not_checked',
        domain: cleanDomain,
        source: 'RDAP (rdap.org)',
        checkedAt,
        message: `RDAP lookup returned HTTP ${response.status}. Domain may be unlisted or registry is private.`
      };
    }

    const data = await response.json();
    const events = Array.isArray(data.events) ? data.events : [];
    
    // Find registration / creation event
    const regEvent = events.find(e => 
      e.eventAction === 'registration' || 
      e.eventAction === 'created' || 
      e.eventAction === 'transfer'
    ) || events[0];

    // Find expiration event
    const expEvent = events.find(e => e.eventAction === 'expiration');

    // Find registrar entity
    let registrarName = 'Undisclosed Registrar';
    if (Array.isArray(data.entities)) {
      const registrarEntity = data.entities.find(ent => Array.isArray(ent.roles) && ent.roles.includes('registrar'));
      if (registrarEntity?.vcardArray?.[1]) {
        const fn = registrarEntity.vcardArray[1].find(item => item[0] === 'fn');
        if (fn && fn[3]) registrarName = fn[3];
      }
    }

    let registrationDate = regEvent?.eventDate || null;
    let ageInDays = null;
    let ageYears = null;
    let isRecentlyRegistered = false;

    if (registrationDate) {
      const regTime = new Date(registrationDate).getTime();
      const now = Date.now();
      ageInDays = Math.max(0, Math.floor((now - regTime) / (1000 * 60 * 60 * 24)));
      ageYears = +(ageInDays / 365.25).toFixed(1);
      isRecentlyRegistered = ageInDays < 90;
    }

    return {
      status: 'verified',
      domain: cleanDomain,
      source: 'RDAP (rdap.org open registry)',
      checkedAt,
      registrationDate,
      expirationDate: expEvent?.eventDate || null,
      ageInDays,
      ageYears,
      isRecentlyRegistered,
      registrar: registrarName,
      rawStatus: Array.isArray(data.status) ? data.status.slice(0, 3) : []
    };
  } catch (err) {
    return {
      status: 'lookup_failed',
      domain: cleanDomain,
      source: 'RDAP (rdap.org)',
      checkedAt,
      message: `RDAP lookup failed: ${err.message}`
    };
  }
}

/**
 * Real DNS SPF and DMARC record lookup for the sender domain
 */
export async function lookupDnsAuthRecords(domain) {
  if (!domain || typeof domain !== 'string') {
    return {
      status: 'not_checked',
      source: null,
      checkedAt: null,
      message: 'No domain provided for DNS record lookup.'
    };
  }

  const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
  const checkedAt = new Date().toISOString();

  let spfRecord = null;
  let dmarcRecord = null;
  let spfStatus = 'None';
  let dmarcStatus = 'None';

  try {
    // 1. Lookup SPF in root domain TXT records
    try {
      const txtRecords = await Promise.race([
        dnsPromises.resolveTxt(cleanDomain),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DNS timeout')), 3500))
      ]);
      const flattened = txtRecords.map(chunk => chunk.join(''));
      const foundSpf = flattened.find(r => r.toLowerCase().startsWith('v=spf1'));
      if (foundSpf) {
        spfRecord = foundSpf;
        spfStatus = foundSpf.includes('-all') ? 'Strict (-all)' : 
                    foundSpf.includes('~all') ? 'SoftFail (~all)' : 'Permissive (?all)';
      }
    } catch (e) {
      // SPF not found or NXDOMAIN
    }

    // 2. Lookup DMARC at _dmarc.<domain>
    try {
      const dmarcTxtRecords = await Promise.race([
        dnsPromises.resolveTxt(`_dmarc.${cleanDomain}`),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DNS timeout')), 3500))
      ]);
      const flattenedDmarc = dmarcTxtRecords.map(chunk => chunk.join(''));
      const foundDmarc = flattenedDmarc.find(r => r.toUpperCase().startsWith('V=DMARC1'));
      if (foundDmarc) {
        dmarcRecord = foundDmarc;
        dmarcStatus = foundDmarc.includes('p=reject') ? 'Reject (Maximum Enforcement)' :
                      foundDmarc.includes('p=quarantine') ? 'Quarantine' : 'None (Monitoring Only)';
      }
    } catch (e) {
      // DMARC not configured
    }

    return {
      status: 'verified',
      domain: cleanDomain,
      source: 'Node.js DNS Resolver (system resolver)',
      checkedAt,
      hasSpf: !!spfRecord,
      spfRecord,
      spfStatus,
      hasDmarc: !!dmarcRecord,
      dmarcRecord,
      dmarcStatus
    };
  } catch (err) {
    return {
      status: 'lookup_failed',
      domain: cleanDomain,
      source: 'Node.js DNS Resolver',
      checkedAt,
      message: `DNS resolution error: ${err.message}`
    };
  }
}

/**
 * Real TLS Certificate Handshake on Port 443
 */
export async function checkTlsCertificate(domain) {
  if (!domain || typeof domain !== 'string') {
    return {
      status: 'not_checked',
      source: null,
      checkedAt: null,
      message: 'No domain provided for TLS certificate inspection.'
    };
  }

  const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
  const checkedAt = new Date().toISOString();

  return new Promise((resolve) => {
    const socket = tls.connect(443, cleanDomain, {
      servername: cleanDomain,
      timeout: 3500
    }, () => {
      try {
        const cert = socket.getPeerCertificate();
        const authorized = socket.authorized;
        const authError = socket.authorizationError ? socket.authorizationError.message || String(socket.authorizationError) : null;
        const cipher = socket.getCipher();

        socket.destroy();

        if (!cert || Object.keys(cert).length === 0) {
          resolve({
            status: 'not_checked',
            domain: cleanDomain,
            source: 'TLS Handshake (Port 443)',
            checkedAt,
            message: 'Connected, but peer returned empty certificate.'
          });
          return;
        }

        resolve({
          status: 'verified',
          domain: cleanDomain,
          source: 'Direct TLS Handshake (Port 443)',
          checkedAt,
          authorized,
          authError,
          issuer: cert.issuer?.O || cert.issuer?.CN || 'Unknown Issuer',
          subject: cert.subject?.CN || 'Unknown Subject',
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          protocol: socket.getProtocol?.() || 'TLS',
          cipherName: cipher?.name || 'Unknown'
        });
      } catch (e) {
        socket.destroy();
        resolve({
          status: 'lookup_failed',
          domain: cleanDomain,
          source: 'TLS Handshake (Port 443)',
          checkedAt,
          message: `Failed to parse TLS peer certificate: ${e.message}`
        });
      }
    });

    socket.on('error', (err) => {
      socket.destroy();
      resolve({
        status: 'lookup_failed',
        domain: cleanDomain,
        source: 'TLS Handshake (Port 443)',
        checkedAt,
        message: `TLS connection failed: ${err.message}`
      });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({
        status: 'lookup_failed',
        domain: cleanDomain,
        source: 'TLS Handshake (Port 443)',
        checkedAt,
        message: 'TLS connection timed out after 3.5s.'
      });
    });
  });
}
