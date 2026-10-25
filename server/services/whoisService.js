// WHOIS & Digital Identity Forensics Service - 100% Evidence-Grounded
import { lookupRdapDomain, lookupDnsAuthRecords, checkTlsCertificate } from './networkCheckService.js';
import { isThirdPartyOrPlatformDomain, THIRD_PARTY_OR_SHORTENER_DOMAINS } from './extractionService.js';

const FREE_EMAIL_PROVIDERS = [
  'gmail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in', 'outlook.com', 
  'hotmail.com', 'live.com', 'icloud.com', 'mail.com', 'zoho.com',
  'protonmail.com', 'rediffmail.com', 'yandex.com'
];

export function extractBrandTokens(companyName) {
  if (!companyName) return [];
  const clean = companyName.toLowerCase().trim();
  if (clean === 'unspecified' || clean === 'unspecified organisation') return [];

  const stopWords = new Set([
    'private', 'pvt', 'limited', 'ltd', 'llp', 'inc', 'corp', 'corporation',
    'company', 'co', 'technologies', 'technology', 'tech', 'solutions',
    'systems', 'services', 'enterprises', 'enterprise', 'group', 'global',
    'international', 'labs', 'holdings', 'consulting', 'consultancy',
    'india', 'usa', 'uk', 'network', 'digital', 'software', 'associates'
  ]);

  const rawWords = clean.split(/[^a-z0-9]+/).filter(Boolean);
  const brandTokens = rawWords.filter(t => t.length >= 3 && !stopWords.has(t));
  
  // Include acronym if multi-word company name (e.g. "Tata Consultancy Services" -> "tcs")
  if (rawWords.length >= 2) {
    const acronym = rawWords.map(w => w[0]).join('');
    if (acronym.length >= 2 && !brandTokens.includes(acronym)) {
      brandTokens.push(acronym);
    }
  }

  return brandTokens.length > 0 ? brandTokens : rawWords.filter(t => t.length >= 2);
}

export async function analyzeEmailAndDomain(email, domain, claimedCompany, flags = {}) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const rawDomain = (domain || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
  const emailDomain = cleanEmail.includes('@') ? cleanEmail.split('@')[1] : null;

  // Never treat third-party platforms or free-mail as company's own domain
  const isDomainThirdParty = isThirdPartyOrPlatformDomain(rawDomain);
  const isDomainFreeMail = rawDomain && FREE_EMAIL_PROVIDERS.includes(rawDomain);
  const cleanDomain = (!isDomainThirdParty && !isDomainFreeMail) ? rawDomain : null;

  const emailIsFree = emailDomain ? FREE_EMAIL_PROVIDERS.includes(emailDomain) : false;
  const emailIsThirdParty = emailDomain ? isThirdPartyOrPlatformDomain(emailDomain) : false;

  const targetDomain = cleanDomain || (emailDomain && !emailIsFree && !emailIsThirdParty ? emailDomain : null);

  const results = {
    domain: targetDomain || null,
    claimedEmail: cleanEmail || null,
    isFreeEmail: emailIsFree || isDomainFreeMail,
    isTyposquatted: false,
    isDomainMismatch: false,
    mismatchDetails: null,
    spoofedTarget: null,
    domainAge: (flags.informalMessagingChannel && !targetDomain)
      ? 'Communication moved to an informal messaging channel'
      : 'Not checked',
    whoisRegistrar: 'Not checked',
    domainSanity: 'Standard',
    spoofingCheck: null,
    // Real network check outputs
    rdap: { status: 'not_checked', source: null, checkedAt: null },
    dns: { status: 'not_checked', source: null, checkedAt: null },
    tls: { status: 'not_checked', source: null, checkedAt: null }
  };

  // Check 1: Free Email Provider Check
  if (results.isFreeEmail) {
    const freeHost = emailDomain || rawDomain;
    results.domainSanity = `CRITICAL WARNING: Communication sent from a free consumer mailbox (@${freeHost}). Legitimate authorized enterprises operate on registered corporate domains.`;
    results.spoofingCheck = 'Not applicable (free email)';
  } else if (flags.informalMessagingChannel && !targetDomain) {
    results.domainSanity = 'Communication moved to an informal messaging channel';
    results.spoofingCheck = 'Not applicable (informal messaging channel)';
  }

  const brandTokens = claimedCompany ? extractBrandTokens(claimedCompany) : [];
  const activeDomain = targetDomain || emailDomain;

  // Check 2: Typosquatting / Lookalike Check (applicable for corporate domains, never free email)
  if (!results.isFreeEmail && activeDomain && brandTokens.length > 0) {
    const activeHost = activeDomain.split('.')[0];
    const isHyphenatedOrKeyword = /(?:-|\b)(?:careers|jobs|recruitment|recruiting|hiring|hr|portal|verify|interview|onboarding|offer|team|online|support|auth|fake)(?:-|\b)/i.test(activeHost);
    const hasBrandMatch = brandTokens.some(bt => activeHost.includes(bt));

    if (hasBrandMatch && isHyphenatedOrKeyword) {
      if (!cleanDomain || (cleanDomain !== activeDomain && !activeDomain.endsWith('.' + cleanDomain))) {
        results.isTyposquatted = true;
        results.spoofedTarget = claimedCompany;
        results.spoofingCheck = `CRITICAL ALERT: Detected lookalike domain (${activeDomain}) mimicking ${claimedCompany}. Scammers frequently register hyphenated domains like '${brandTokens[0]}-careers.online' or '${brandTokens[0]}-hr.com' to deceive candidates.`;
      }
    }
  }

  // Check 3: Claimed Corporate Brand vs Sender Domain Mismatch Check
  if (claimedCompany && emailDomain && !results.isFreeEmail && brandTokens.length > 0) {
    const emailHost = emailDomain.split('.')[0];
    const hasBrandMatch = brandTokens.some(bt => emailHost.includes(bt) || bt.includes(emailHost) || emailDomain.includes(bt));

    if (cleanDomain && cleanDomain !== emailDomain && !emailDomain.endsWith('.' + cleanDomain) && !cleanDomain.endsWith('.' + emailDomain)) {
      results.isDomainMismatch = true;
      results.spoofedTarget = claimedCompany;
      results.mismatchDetails = `CRITICAL DOMAIN MISMATCH: Communication claims to represent ${claimedCompany} (${cleanDomain}), but sender email originates from an unauthorized domain (@${emailDomain}).`;
      results.spoofingCheck = results.mismatchDetails;
      results.domainSanity = `CRITICAL FAILURE: Sender domain (@${emailDomain}) does not match organization domain (${cleanDomain}).`;
    } else if (!hasBrandMatch && !results.isTyposquatted) {
      results.isDomainMismatch = true;
      results.spoofedTarget = claimedCompany;
      results.mismatchDetails = `CRITICAL SENDER MISMATCH: Communication claims to represent ${claimedCompany}, but sender email originates from an unrelated domain (@${emailDomain}).`;
      results.spoofingCheck = results.mismatchDetails;
      results.domainSanity = `CRITICAL WARNING: Sender domain (@${emailDomain}) has no evident affiliation with claimed employer ${claimedCompany}.`;
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
        results.whoisRegistrar = results.rdap.registrar || 'Unknown';
        if (results.rdap.isRecentlyRegistered) {
          results.domainAge = `${results.rdap.ageInDays} days old`;
          results.domainSanity = `CRITICAL WARNING: Domain was registered ${results.rdap.ageInDays} days ago (${results.rdap.registrationDate?.split('T')[0]}). Recent domain registration under 90 days is a primary indicator of temporary phishing fronts.`;
        } else {
          results.domainAge = `~${results.rdap.ageYears} years old`;
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
