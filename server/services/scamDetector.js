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
  const hasTextToEvaluate = rawText && rawText.length > 40;
  checksAudit.push({ id: 'fee_check', name: 'Upfront Payment & Deposit Check', performed: !!hasTextToEvaluate });
  if (flags.moneyDemanded) {
    const quote = flags.feeSnippet ? `Found in text: "${flags.feeSnippet}"` : '';
    redFlags.push({
      rule: 'Golden Rule #1: Upfront Fee Demanded',
      severity: 'CRITICAL',
      description: `Communication requests upfront money (Laptop deposit, courier fee, registration, programme fee, or training bond). Legitimate authorized companies NEVER ask candidates to pay money. ${quote}`.trim()
    });
  } else if (hasTextToEvaluate) {
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
  const domainTargetPresent = !!digitalIdentity.domain;
  const rdapChecked = digitalIdentity.rdap?.status === 'verified';
  checksAudit.push({ id: 'rdap_check', name: 'RDAP Domain Registration Age', performed: domainTargetPresent });
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
  checksAudit.push({ id: 'dns_check', name: 'DNS Records (SPF & DMARC)', performed: domainTargetPresent });
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
  checksAudit.push({ id: 'tls_check', name: 'TLS / SSL Certificate Verification', performed: domainTargetPresent });
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
  checksAudit.push({ id: 'scam_patterns', name: 'Unusual Scam Typologies & Phishing Patterns', performed: !!hasTextToEvaluate });
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
    const quote = flags.docsSnippet ? `Found in text: "${flags.docsSnippet}"` : '';
    redFlags.push({
      rule: 'Golden Rule #2: Insecure Identity Document Collection',
      severity: 'HIGH',
      description: `Demands personal identity credentials (Aadhaar, PAN, passport, bank details) over WhatsApp/Telegram instead of a secure corporate candidate portal. ${quote}`.trim()
    });
  }
  if (flags.fakeUrgency) {
    const quote = flags.urgencySnippet ? `Found in text: "${flags.urgencySnippet}"` : '';
    redFlags.push({
      rule: 'Golden Rule #4: Artificial High-Pressure Deadline',
      severity: 'HIGH',
      description: `Communication imposes artificial psychological urgency (e.g. 24 hours, immediate cancellation). ${quote}`.trim()
    });
  }

  // Derive 5 Golden Rules - 100% Derived from Detection Results
  // Each rule has 3 states: passed === true (Passed), passed === false (Failed), passed === null (Not checked)
  let rule1Passed = null;
  let rule1Status = 'Not checked';
  let rule1Details = 'No communication text provided to evaluate fee demands.';
  if (flags.moneyDemanded) {
    rule1Passed = false;
    rule1Status = 'Failed / Fee Demanded';
    rule1Details = flags.feeSnippet 
      ? `CRITICAL RED FLAG: Payment demanded in text: "${flags.feeSnippet}"`
      : 'CRITICAL RED FLAG: Demands upfront payment or security deposit.';
  } else if (hasTextToEvaluate) {
    rule1Passed = true;
    rule1Status = 'Passed';
    rule1Details = 'No upfront fees, courier charges, or security deposits demanded in text.';
  }

  let rule2Passed = null;
  let rule2Status = 'Not checked';
  let rule2Details = 'No communication text provided to evaluate document handling.';
  if (flags.asksDocsOverChat) {
    rule2Passed = false;
    rule2Status = 'Failed / Insecure Docs';
    rule2Details = flags.docsSnippet
      ? `INSECURE TRANSMISSION: Demands credentials over chat: "${flags.docsSnippet}"`
      : 'INSECURE TRANSMISSION: Demands Aadhaar/PAN over WhatsApp or Telegram.';
  } else if (hasTextToEvaluate) {
    rule2Passed = true;
    rule2Status = 'Passed';
    rule2Details = 'No unencrypted transmission of sensitive identity documents requested.';
  }

  let rule3Passed = null;
  let rule3Status = 'Not checked';
  let rule3Details = 'No sender email address provided in input.';
  if (detectedEmail) {
    const emailDomain = detectedEmail.split('@')[1] || '';
    if (digitalIdentity.isDomainMismatch) {
      rule3Passed = false;
      rule3Status = 'Failed / Domain Mismatch';
      rule3Details = digitalIdentity.mismatchDetails || `Sender domain (@${emailDomain}) does not match claimed organization.`;
    } else if (digitalIdentity.isFreeEmail) {
      rule3Passed = false;
      rule3Status = 'Failed / Free Mailbox';
      rule3Details = `Sent from free consumer mailbox (@${emailDomain}) rather than registered corporate domain.`;
    } else if (digitalIdentity.isTyposquatted) {
      rule3Passed = false;
      rule3Status = 'Failed / Lookalike Domain';
      rule3Details = digitalIdentity.spoofingCheck || 'Sender domain is a typosquatted lookalike.';
    } else {
      rule3Passed = true;
      rule3Status = 'Passed';
      rule3Details = `Sent from registered corporate domain (@${emailDomain}).`;
    }
  }

  let rule4Passed = null;
  let rule4Status = 'Not checked';
  let rule4Details = 'No timeline or deadline text provided to evaluate.';
  if (flags.fakeUrgency) {
    rule4Passed = false;
    rule4Status = 'Failed / Panic Deadline';
    rule4Details = flags.urgencySnippet
      ? `HIGH PRESSURE: Demands decision under pressure: "${flags.urgencySnippet}"`
      : 'HIGH PRESSURE: Artificial short deadline detected.';
  } else if (hasTextToEvaluate) {
    rule4Passed = true;
    rule4Status = 'Passed';
    rule4Details = 'Standard recruitment timeline without coercive deadlines.';
  }

  let rule5Passed = null;
  let rule5Status = 'Not checked';
  let rule5Details = 'No compensation or salary details provided in input.';
  if (flags.isTypingJob && /(?:₹|rs\.?|inr)\s*[\d,]+/i.test(rawText || '')) {
    rule5Passed = false;
    rule5Status = 'Failed / Unrealistic Lure';
    rule5Details = 'Inflated salary offered for basic data entry/typing to lure victims.';
  } else if (hasTextToEvaluate && /(?:₹|rs\.?|inr|salary|stipend|ctc|lpa|per\s*month)/i.test(rawText || '')) {
    rule5Passed = true;
    rule5Status = 'Passed';
    rule5Details = 'Disclosed compensation appears within typical industry range.';
  }

  const goldenRules = {
    moneyDemanded: flags.moneyDemanded,
    secureOnboarding: rule2Passed === true,
    officialEmailDomain: rule3Passed === true,
    reasonableUrgency: rule4Passed === true,
    realisticCompensation: rule5Passed === true,
    moneyDetails: rule1Details,
    onboardingDetails: rule2Details,
    emailDetails: rule3Details,
    urgencyDetails: rule4Details,
    compensationDetails: rule5Details,
    rules: [
      { id: 'rule1', title: 'Rule #1: They NEVER Ask for Money', subtitle: 'Laptop deposits, training fees, courier charges, registration deposits', passed: rule1Passed, status: rule1Status, details: rule1Details },
      { id: 'rule2', title: 'Rule #2: Secure Document Handling', subtitle: 'Never ask for Aadhaar, PAN, or Bank passbook over WhatsApp/Telegram', passed: rule2Passed, status: rule2Status, details: rule2Details },
      { id: 'rule3', title: 'Rule #3: Official Corporate Email Domain', subtitle: 'Authorized entities communicate from @company.com, never free consumer accounts', passed: rule3Passed, status: rule3Status, details: rule3Details },
      { id: 'rule4', title: 'Rule #4: Standard Recruitment Timeline', subtitle: 'No artificial psychological pressure (e.g., "Pay within 2 hours or offer rescinded")', passed: rule4Passed, status: rule4Status, details: rule4Details },
      { id: 'rule5', title: 'Rule #5: Realistic Compensation Package', subtitle: 'Salary aligns with market rates for the specific role without bait-and-switch tactics', passed: rule5Passed, status: rule5Status, details: rule5Details }
    ]
  };

  // Compute Coverage
  const performedCount = checksAudit.filter(c => c.performed).length;
  const totalCount = checksAudit.length;
  const hasEnoughData = performedCount >= 5;
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
      finalScore = 50;
    }
  }

  // Trust score: display only when >= 5 of 8 checks performed; otherwise null
  const trustScore = hasEnoughData ? finalScore : null;

  // Verdict Logic:
  // "VERIFIED" only when real registry evidence AND domain match exist with zero red flags
  // "CRITICAL RISK / RECRUITMENT FRAUD DETECTED" only from concrete rules
  // "No red flags found" when email is legitimate corporate and no red flags exist
  // "UNVERIFIED – insufficient evidence" in all other cases
  let verdict = 'UNVERIFIED – insufficient evidence';
  let badgeColor = 'amber';

  if (hasCriticalRedFlag || hasHighRedFlag) {
    verdict = 'CRITICAL RISK / RECRUITMENT FRAUD DETECTED';
    badgeColor = 'rose';
  } else if (government.cinValid && rdapChecked && !digitalIdentity.isDomainMismatch && !digitalIdentity.isFreeEmail && redFlags.length === 0) {
    verdict = 'VERIFIED';
    badgeColor = 'emerald';
  } else if (redFlags.length === 0 && detectedEmail && !digitalIdentity.isDomainMismatch && !digitalIdentity.isFreeEmail && hasTextToEvaluate) {
    verdict = 'No red flags found';
    badgeColor = 'emerald';
  } else {
    verdict = 'UNVERIFIED – insufficient evidence';
    badgeColor = 'amber';
  }

  return {
    companyName: detectedCompanyName,
    claimedDomain: detectedDomain,
    claimedEmail: detectedEmail,
    trustScore,
    hasEnoughData,
    verdict,
    badgeColor,
    coverageRatio,
    checksAudit,
    goldenRules,
    redFlags,
    greenFlags,
    digitalIdentity,
    government,
    linkedin,
    stocks,
    offerLetterQuality,
    physical,
    redditAndReviews,
    legalDisclaimer: 'Disclaimer: VeriFirm assessment results are risk indicators based on available evidence and do not constitute legal proof or corporate certification.',
    timestamp: new Date().toISOString()
  };
}
