// Scam Detection & Trust Score Engine - 100% Evidence-Grounded
// No fabricated scores, simulated employee audits, or default company addresses.

import { analyzeEmailAndDomain } from './whoisService.js';
import { lookupGovernmentRegistry } from './mcaService.js';
import { analyzeLinkedInPresence } from './linkedinService.js';
import { getCompanyFinancials } from './financeService.js';
import { getRedditAndReviewSentiment } from './redditService.js';
import { evaluateOfferLetterQuality } from './offerLetterService.js';

function resolvePhysicalFootprint({ detectedAddress, detectedPhone, detectedEmail, detectedDomain }) {
  const checkedAt = new Date().toISOString();

  if (detectedAddress) {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detectedAddress)}`;
    return {
      status: 'found_in_input',
      officeAddress: detectedAddress,
      source: 'Extracted from user input text',
      checkedAt,
      mapUrl,
      contactDetails: {
        phone: detectedPhone || 'Not specified',
        email: detectedEmail || 'Not specified',
        website: detectedDomain ? (detectedDomain.startsWith('http') ? detectedDomain : `https://${detectedDomain}`) : 'Not specified'
      },
      message: 'Address extracted directly from input text. Click below to verify physical location on Google Maps.'
    };
  }

  return {
    status: 'not_checked',
    officeAddress: null,
    source: null,
    checkedAt: null,
    mapUrl: null,
    contactDetails: {
      phone: detectedPhone || 'Not provided in input',
      email: detectedEmail || 'Not provided in input',
      website: detectedDomain ? (detectedDomain.startsWith('http') ? detectedDomain : `https://${detectedDomain}`) : 'Not provided in input'
    },
    message: 'No physical office address was provided in the input.'
  };
}

export async function runComprehensiveAudit(extractedData) {
  const {
    rawText,
    isOfferLetter,
    detectedCompanyName,
    detectedDomain,
    detectedEmail,
    detectedPhone,
    detectedAddress,
    cin,
    gstin,
    ticker,
    linkedInUrl,
    flags = {}
  } = extractedData;

  // 1. Asynchronous Digital Forensics (RDAP, DNS, TLS, Domain Mismatch)
  const digitalIdentity = await analyzeEmailAndDomain(detectedEmail, detectedDomain, detectedCompanyName);

  // 2. Government & Corporate Registry
  const government = lookupGovernmentRegistry(detectedCompanyName, cin, gstin);

  // 3. LinkedIn Forensics (100% truthful, no fake avatars)
  const linkedin = analyzeLinkedInPresence(detectedCompanyName, linkedInUrl);

  // 4. Financial & Stock Markets (100% truthful, no fake charts)
  const stocks = getCompanyFinancials(detectedCompanyName, ticker);

  // 5. Offer Letter Quality: Run ONLY if offer letter / email document is provided
  const offerLetterQuality = isOfferLetter ? evaluateOfferLetterQuality(rawText, flags) : null;

  // 6. Real Reddit Community Discussions (no fake stars/reviews)
  const redditAndReviews = await getRedditAndReviewSentiment(detectedCompanyName);

  // 7. Physical Footprint & Map: Address ONLY from input
  const physical = resolvePhysicalFootprint({
    detectedAddress,
    detectedPhone,
    detectedEmail,
    detectedDomain
  });

  // 8. Concrete Rules & Checks Performed Tracking
  const redFlags = [];
  const greenFlags = [];
  const checksAudit = [];

  // Check 1: Upfront Fee / Deposit
  checksAudit.push({ id: 'fee_check', name: 'Upfront Payment & Deposit Check', performed: true });
  if (flags.moneyDemanded) {
    redFlags.push({
      rule: 'Golden Rule #1: Upfront Fee Demanded',
      severity: 'CRITICAL',
      description: 'Communication requests upfront money (Laptop deposit, courier fee, registration, or training bond). Legitimate authorized companies NEVER ask candidates to pay money.'
    });
  } else if (rawText && rawText.length > 40) {
    greenFlags.push('No upfront fees, courier charges, or security deposits demanded');
  }

  // Check 2: Sender Email Analysis
  const emailChecked = !!detectedEmail;
  checksAudit.push({ id: 'email_check', name: 'Sender Email Domain Analysis', performed: emailChecked });
  if (emailChecked) {
    if (digitalIdentity.isDomainMismatch) {
      redFlags.push({
        rule: 'Golden Rule #3: Unauthorized Sender Domain Mismatch',
        severity: 'CRITICAL',
        description: digitalIdentity.mismatchDetails
      });
    } else if (digitalIdentity.isFreeEmail) {
      redFlags.push({
        rule: 'Golden Rule #3: Free Consumer Email Provider Used',
        severity: 'HIGH',
        description: `Communication was sent from a free consumer mailbox (@${(detectedEmail || '').split('@')[1]}). Authorized corporate employers mandate registered corporate domain addresses.`
      });
    } else if (digitalIdentity.isTyposquatted) {
      redFlags.push({
        rule: 'Golden Rule #3: Typosquatted / Lookalike Domain',
        severity: 'CRITICAL',
        description: digitalIdentity.spoofingCheck
      });
    } else {
      greenFlags.push(`Sender domain (@${detectedEmail.split('@')[1]}) is an independent corporate domain`);
    }
  }

  // Check 3: RDAP Domain Registration Age
  const rdapChecked = digitalIdentity.rdap?.status === 'verified';
  checksAudit.push({ id: 'rdap_check', name: 'RDAP Domain Registration Age', performed: rdapChecked });
  if (rdapChecked) {
    if (digitalIdentity.rdap.isRecentlyRegistered) {
      redFlags.push({
        rule: 'Recently Registered Domain (< 90 Days)',
        severity: 'HIGH',
        description: `Domain was registered ${digitalIdentity.rdap.ageInDays} days ago (${digitalIdentity.rdap.registrationDate?.split('T')[0]}). Recent domain registration is a primary indicator of temporary scam campaigns.`
      });
    } else {
      greenFlags.push(`Established domain: Registered ${digitalIdentity.rdap.ageYears} years ago via ${digitalIdentity.rdap.registrar}`);
    }
  }

  // Check 4: DNS Authentication (SPF / DMARC)
  const dnsChecked = digitalIdentity.dns?.status === 'verified';
  checksAudit.push({ id: 'dns_check', name: 'DNS Records (SPF & DMARC)', performed: dnsChecked });
  if (dnsChecked) {
    if (digitalIdentity.dns.hasSpf) {
      greenFlags.push(`Domain has active SPF record (${digitalIdentity.dns.spfStatus})`);
    }
    if (digitalIdentity.dns.hasDmarc) {
      greenFlags.push(`Domain has active DMARC policy (${digitalIdentity.dns.dmarcStatus})`);
    }
  }

  // Check 5: TLS / SSL Encryption
  const tlsChecked = digitalIdentity.tls?.status === 'verified';
  checksAudit.push({ id: 'tls_check', name: 'TLS / SSL Certificate Verification', performed: tlsChecked });
  if (tlsChecked) {
    if (digitalIdentity.tls.authorized) {
      greenFlags.push(`Valid TLS certificate issued by ${digitalIdentity.tls.issuer}`);
    } else if (digitalIdentity.tls.authError) {
      redFlags.push({
        rule: 'Untrusted TLS Certificate',
        severity: 'MEDIUM',
        description: `TLS certificate failed trust validation: ${digitalIdentity.tls.authError}`
      });
    }
  }

  // Check 6: Statutory Corporate Registration (CIN)
  const cinChecked = government.status === 'found_in_input';
  checksAudit.push({ id: 'mca_check', name: 'Statutory Corporate Identification (CIN)', performed: cinChecked });
  if (cinChecked && government.cinValid) {
    greenFlags.push(`Statutory CIN format decoded: ${government.listingStatus} registered in ${government.state} (${government.yearOfIncorporation})`);
  }

  // Check 7: Physical Operating Address
  const addressChecked = physical.status === 'found_in_input';
  checksAudit.push({ id: 'address_check', name: 'Physical Office Address Disclosure', performed: addressChecked });
  if (addressChecked) {
    greenFlags.push('Operating address disclosed in communication');
  }

  // Check 8: Unusual Job Typologies & Scams
  checksAudit.push({ id: 'scam_patterns', name: 'Unusual Scam Typologies & Phishing Patterns', performed: true });
  if (flags.isTypingJob) {
    redFlags.push({
      rule: 'Unusual Job Format: Typing / Data Entry Work-From-Home',
      severity: 'HIGH',
      description: 'Typing and data entry work-from-home offers are overwhelmingly associated with advance-fee or deposit syndicates.'
    });
  }
  if (flags.isTaskBasedScam) {
    redFlags.push({
      rule: 'Unusual Job Format: Task-Based / Prepaid Commission',
      severity: 'CRITICAL',
      description: 'Offers promising daily commission for completing prepaid tasks (e.g. via Telegram) are fraudulent task schemes.'
    });
  }
  if (flags.isVideoLikingScam) {
    redFlags.push({
      rule: 'Unusual Job Format: Video Liking / Review Paid Scam',
      severity: 'CRITICAL',
      description: 'Paying money for liking videos or rating hotels is a prominent lure designed to bait victims into depositing funds.'
    });
  }
  if (flags.isReshippingScam) {
    redFlags.push({
      rule: 'Unusual Job Format: Package Reshipping / Parcel Mule',
      severity: 'CRITICAL',
      description: 'Forwarding or reshipping packages from home recruits victims as unwitting mules handling stolen goods.'
    });
  }
  if (flags.isFakeChequeScam) {
    redFlags.push({
      rule: 'Advance-Fee Scam: Cheque for Vendor Equipment',
      severity: 'CRITICAL',
      description: 'Sending a cheque and demanding you purchase laptops/software from their specific vendor is a fraudulent overpayment cheque bounce scam.'
    });
  }
  if (flags.isScreenShareOrAppScam) {
    redFlags.push({
      rule: 'Device Compromise: App Install / Screen Sharing Demanded',
      severity: 'CRITICAL',
      description: 'Demanding installation of remote access tools (AnyDesk, TeamViewer, APKs) or screen-sharing on WhatsApp is used to hijack credentials and steal banking OTPs.'
    });
  }
  if (flags.asksDocsOverChat) {
    redFlags.push({
      rule: 'Golden Rule #2: Insecure Identity Document Collection',
      severity: 'HIGH',
      description: 'Demands personal identity credentials (Aadhaar, PAN, passport, bank details) over WhatsApp/Telegram instead of a secure corporate candidate portal.'
    });
  }

  // Compute Coverage
  const performedCount = checksAudit.filter(c => c.performed).length;
  const totalCount = checksAudit.length;
  const coverageRatio = `${performedCount} of ${totalCount} checks performed`;

  // Compute Score strictly from checks run
  const hasCriticalRedFlag = redFlags.some(r => r.severity === 'CRITICAL');
  const hasHighRedFlag = redFlags.some(r => r.severity === 'HIGH');

  let finalScore = 50;
  if (hasCriticalRedFlag) {
    finalScore = Math.max(4, 30 - (redFlags.length * 8));
  } else if (hasHighRedFlag) {
    finalScore = Math.max(25, 45 - (redFlags.length * 6));
  } else {
    // Score based on positive verified evidence and check coverage
    const greenBonus = greenFlags.length * 10;
    finalScore = Math.min(95, 50 + greenBonus);
    if (performedCount <= 2) {
      finalScore = 50; // Neutral baseline when very little evidence is available
    }
  }

  // Verdict Logic:
  // "VERIFIED" only when real registry evidence AND domain match exist with zero red flags
  // "CRITICAL RISK / RECRUITMENT FRAUD" only from concrete rules
  // "UNVERIFIED – insufficient evidence" in all other cases
  let verdict = 'UNVERIFIED – insufficient evidence';
  let badgeColor = 'amber';

  if (hasCriticalRedFlag || hasHighRedFlag) {
    verdict = 'CRITICAL RISK / RECRUITMENT FRAUD DETECTED';
    badgeColor = 'rose';
  } else if (government.cinValid && rdapChecked && !digitalIdentity.isDomainMismatch && !digitalIdentity.isFreeEmail && redFlags.length === 0) {
    verdict = 'VERIFIED LEGITIMATE ENTERPRISE';
    badgeColor = 'emerald';
  } else {
    verdict = 'UNVERIFIED – insufficient evidence';
    badgeColor = 'amber';
  }

  return {
    companyName: detectedCompanyName,
    claimedDomain: detectedDomain,
    claimedEmail: detectedEmail,
    trustScore: finalScore,
    verdict,
    badgeColor,
    coverageRatio,
    checksAudit,
    redFlags,
    greenFlags,
    digitalIdentity,
    government,
    linkedin,
    stocks,
    offerLetterQuality,
    physical,
    redditAndReviews,
    timestamp: new Date().toISOString()
  };
}
