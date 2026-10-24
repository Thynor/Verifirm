// WHOIS & Digital Identity Forensics Service - 100% Evidence-Grounded
import { lookupRdapDomain, lookupDnsAuthRecords, checkTlsCertificate } from './networkCheckService.js';

const FREE_EMAIL_PROVIDERS = [
  'gmail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in', 'outlook.com', 
  'hotmail.com', 'live.com', 'icloud.com', 'mail.com', 'zoho.com',
  'protonmail.com', 'rediffmail.com', 'yandex.com'
];

const REPUTABLE_CORPORATE_DOMAINS = [
  { name: 'Tata Consultancy Services', officialDomain: 'tcs.com', aliases: ['tata.com'] },
  { name: 'Infosys Limited', officialDomain: 'infosys.com' },
  { name: 'Wipro Limited', officialDomain: 'wipro.com' },
  { name: 'Google', officialDomain: 'google.com' },
  { name: 'Microsoft', officialDomain: 'microsoft.com' },
  { name: 'Amazon', officialDomain: 'amazon.com' },
  { name: 'Cognizant', officialDomain: 'cognizant.com' },
  { name: 'Accenture', officialDomain: 'accenture.com' },
  { name: 'HCLTech', officialDomain: 'hcltech.com' }
];

export async function analyzeEmailAndDomain(email, domain, claimedCompany) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanDomain = (domain || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
  const emailDomain = cleanEmail.includes('@') ? cleanEmail.split('@')[1] : null;
  const targetDomain = cleanDomain || (emailDomain && !FREE_EMAIL_PROVIDERS.includes(emailDomain) ? emailDomain : null);

  const results = {
    domain: cleanDomain || emailDomain || null,
    claimedEmail: cleanEmail || null,
    isFreeEmail: false,
    isTyposquatted: false,
    isDomainMismatch: false,
    mismatchDetails: null,
    spoofedTarget: null,
    domainSanity: 'Standard',
    spoofingCheck: null,
    // Real network check outputs
    rdap: { status: 'not_checked', source: null, checkedAt: null },
    dns: { status: 'not_checked', source: null, checkedAt: null },
    tls: { status: 'not_checked', source: null, checkedAt: null }
  };

  // Check 1: Free Email Provider Check
  if (emailDomain && FREE_EMAIL_PROVIDERS.includes(emailDomain)) {
    results.isFreeEmail = true;
    results.domainSanity = `CRITICAL WARNING: Communication sent from a free consumer mailbox (@${emailDomain}). Legitimate authorized enterprises operate on registered corporate domains.`;
  }

  // Check 2: Typosquatting / Lookalike Check
  const testString = `${cleanDomain || ''} ${emailDomain || ''}`.toLowerCase();
  for (const corp of REPUTABLE_CORPORATE_DOMAINS) {
    const brand = corp.officialDomain.split('.')[0];
    if (testString.includes(brand) && !testString.endsWith(corp.officialDomain) && !corp.aliases?.some(a => testString.endsWith(a))) {
      results.isTyposquatted = true;
      results.spoofedTarget = corp.name;
      results.spoofingCheck = `CRITICAL ALERT: Detected lookalike domain (${cleanDomain || emailDomain}) mimicking ${corp.name} (${corp.officialDomain}). Scammers frequently register hyphenated domains like '${brand}-careers.online' or '${brand}-hr.com' to deceive candidates.`;
      break;
    }
  }

  // Check 3: Claimed Corporate Brand vs Sender Domain Mismatch Check
  if (claimedCompany && emailDomain) {
    const normClaim = claimedCompany.toLowerCase();
    for (const corp of REPUTABLE_CORPORATE_DOMAINS) {
      const corpBrand = corp.officialDomain.split('.')[0];
      if (normClaim.includes(corp.name.toLowerCase()) || normClaim.includes(corpBrand)) {
        const matchesOfficial = emailDomain === corp.officialDomain || 
                                emailDomain.endsWith('.' + corp.officialDomain) || 
                                corp.aliases?.some(a => emailDomain === a || emailDomain.endsWith('.' + a));
        if (!matchesOfficial) {
          results.isDomainMismatch = true;
          results.spoofedTarget = corp.name;
          results.mismatchDetails = `CRITICAL DOMAIN SPOOFING ALERT: Communication claims to represent ${corp.name}, but sender email is @${emailDomain}. Legitimate ${corp.name} correspondence originates strictly from official @${corp.officialDomain} accounts.`;
          results.spoofingCheck = results.mismatchDetails;
          results.domainSanity = `CRITICAL FAILURE: Sender domain (@${emailDomain}) does NOT match claimed organization ${corp.name}. Suspected phishing or compromised webmail account.`;
          break;
        }
      }
    }

    // Generalized domain mismatch for any claimed company
    if (!results.isDomainMismatch && !results.isFreeEmail && normClaim !== 'unspecified') {
      if (cleanDomain && cleanDomain !== emailDomain && !emailDomain.endsWith('.' + cleanDomain) && !cleanDomain.endsWith('.' + emailDomain)) {
        results.isDomainMismatch = true;
        results.spoofedTarget = claimedCompany;
        results.mismatchDetails = `CRITICAL DOMAIN MISMATCH: Communication claims to represent ${claimedCompany} (${cleanDomain}), but sender email originates from an unauthorized domain (@${emailDomain}).`;
        results.spoofingCheck = results.mismatchDetails;
        results.domainSanity = `CRITICAL FAILURE: Sender domain (@${emailDomain}) does not match organization domain (${cleanDomain}).`;
      } else if (!cleanDomain) {
        const stopWords = new Set(['technologies', 'technology', 'solutions', 'private', 'pvt', 'limited', 'ltd', 'llp', 'inc', 'corp', 'corporation', 'services', 'systems', 'enterprises', 'group', 'india', 'global', 'labs']);
        const distinctiveTokens = normClaim.split(/[\s,.-]+/).filter(w => w.length >= 4 && !stopWords.has(w));
        const domainTokens = emailDomain.split(/[\s,.-]+/);
        const hasTokenMatch = distinctiveTokens.some(token => emailDomain.includes(token) || domainTokens.some(dt => dt.includes(token)));
        if (distinctiveTokens.length > 0 && !hasTokenMatch) {
          results.isDomainMismatch = true;
          results.spoofedTarget = claimedCompany;
          results.mismatchDetails = `CRITICAL SENDER MISMATCH: Communication claims to represent ${claimedCompany}, but sender email originates from an unrelated domain (@${emailDomain}).`;
          results.spoofingCheck = results.mismatchDetails;
          results.domainSanity = `CRITICAL WARNING: Sender domain (@${emailDomain}) has no evident affiliation with claimed employer ${claimedCompany}.`;
        }
      }
    }
  }

  // Check 4: Real Network Lookups (RDAP, DNS, TLS)
  if (targetDomain) {
    const [rdapRes, dnsRes, tlsRes] = await Promise.allSettled([
      lookupRdapDomain(targetDomain),
      lookupDnsAuthRecords(targetDomain),
      checkTlsCertificate(targetDomain)
    ]);

    if (rdapRes.status === 'fulfilled') {
      results.rdap = rdapRes.value;
      if (results.rdap.status === 'verified') {
        if (results.rdap.isRecentlyRegistered) {
          results.domainSanity = `CRITICAL WARNING: Domain was registered ${results.rdap.ageInDays} days ago (${results.rdap.registrationDate?.split('T')[0]}). Recent domain registration under 90 days is a primary indicator of temporary phishing fronts.`;
        } else {
          results.domainSanity = `Verified Domain Age: Registered on ${results.rdap.registrationDate?.split('T')[0]} (~${results.rdap.ageYears} years ago via ${results.rdap.registrar}).`;
        }
      }
    }

    if (dnsRes.status === 'fulfilled') {
      results.dns = dnsRes.value;
    }

    if (tlsRes.status === 'fulfilled') {
      results.tls = tlsRes.value;
    }
  }

  return results;
}
