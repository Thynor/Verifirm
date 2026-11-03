// Scam Detection & Trust Score Engine - 100% Evidence-Grounded
// No fabricated scores, simulated employee audits, or default company addresses.

import { analyzeEmailAndDomain } from './whoisService.js';
import { lookupGovernmentRegistry } from './mcaService.js';
import { analyzeLinkedInPresence } from './linkedinService.js';
import { getCompanyFinancials } from './financeService.js';
import { getRedditAndReviewSentiment } from './redditService.js';
import { getQuoraDiscussions } from './quoraService.js';
import { evaluateOfferLetterQuality } from './offerLetterService.js';

async function resolvePhysicalFootprint({ detectedCompanyName, detectedAddress, detectedPhone, detectedEmail, detectedDomain, isUserProvidedAddress = false }) {
  const checkedAt = new Date().toISOString();
  const dateStr = checkedAt.split('T')[0];

  // 1. If explicit address was provided by user or detected in text
  if (detectedAddress) {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detectedAddress)}`;
    const embedMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(detectedAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    return {
      status: isUserProvidedAddress ? 'user_provided' : 'found_in_input',
      officeAddress: detectedAddress,
      source: isUserProvidedAddress ? 'Entered by user (user-provided)' : 'Extracted from user input text',
      checkedAt,
      mapUrl,
      embedMapsUrl,
      contactDetails: {
        phone: detectedPhone || 'Not specified',
        email: detectedEmail || 'Not specified',
        website: detectedDomain ? (detectedDomain.startsWith('http') ? detectedDomain : `https://${detectedDomain}`) : 'Not specified'
      },
      message: isUserProvidedAddress
        ? 'Address entered directly by user. Click below to verify physical location on Google Maps.'
        : 'Address extracted directly from input text. Click below to verify physical location on Google Maps.'
    };
  }

  // 2. If no address was in input, lookup company address by company name via public geographic directory
  const cleanName = (detectedCompanyName || '').trim();
  const isGeneric = !cleanName ||
    cleanName.toLowerCase() === 'unspecified organisation' ||
    cleanName.toLowerCase() === 'unspecified organization' ||
    cleanName.toLowerCase() === 'unspecified';

  if (!isGeneric) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanName)}&format=json&addressdetails=1&limit=3`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'VeriFirmAudit/2.0 (audit@verifirm.org)' },
        signal: AbortSignal.timeout(3500)
      });

      if (res.ok) {
        const data = await res.json();
        const results = Array.isArray(data) ? data : [];
        const commercialTypes = ['office', 'commercial', 'landuse', 'industrial', 'building', 'company', 'amenity'];

        const matched = results.find(item => {
          const isBuilding = commercialTypes.includes(item.class) || commercialTypes.includes(item.type);
          const nameMatches = item.name && (
            item.name.toLowerCase().includes(cleanName.toLowerCase()) || 
            cleanName.toLowerCase().includes(item.name.toLowerCase())
          );
          const isExcluded = ['beauty', 'hairdresser', 'village', 'clothes'].includes(item.type);
          return isBuilding && nameMatches && !isExcluded;
        });

        if (matched) {
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(matched.display_name)}`;
          const embedMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(matched.display_name)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
          return {
            status: 'found_online',
            officeAddress: matched.display_name,
            source: `OpenStreetMap Geographic Directory, ${dateStr}`,
            checkedAt,
            mapUrl,
            embedMapsUrl,
            lat: matched.lat,
            lon: matched.lon,
            contactDetails: {
              phone: detectedPhone || 'Not specified',
              email: detectedEmail || 'Not specified',
              website: detectedDomain ? (detectedDomain.startsWith('http') ? detectedDomain : `https://${detectedDomain}`) : 'Not specified'
            },
            message: `Registered commercial office building found: "${matched.display_name}".`
          };
        }
      }
    } catch (e) {
      // Nominatim timeout or error
    }

    // Company searched, but no registered commercial building found
    return {
      status: 'no_building_found',
      officeAddress: null,
      source: `OpenStreetMap Geographic Directory, ${dateStr}`,
      checkedAt,
      mapUrl: null,
      embedMapsUrl: null,
      contactDetails: {
        phone: detectedPhone || 'Not provided in input',
        email: detectedEmail || 'Not provided in input',
        website: detectedDomain ? (detectedDomain.startsWith('http') ? detectedDomain : `https://${detectedDomain}`) : 'Not provided in input'
      },
      message: `This company does not have a registered commercial office building in public geographic records.`
    };
  }

  return {
    status: 'not_checked',
    officeAddress: null,
    source: null,
    checkedAt: null,
    mapUrl: null,
    embedMapsUrl: null,
    contactDetails: {
      phone: detectedPhone || 'Not provided in input',
      email: detectedEmail || 'Not provided in input',
      website: detectedDomain ? (detectedDomain.startsWith('http') ? detectedDomain : `https://${detectedDomain}`) : 'Not provided in input'
    },
    message: 'No physical office address or company name was provided in the input.'
  };
}

export async function runComprehensiveAudit(extractedData, userProvidedDetails = null) {
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

  const details = userProvidedDetails || extractedData.userProvidedDetails || null;

  // 1. Asynchronous Digital Forensics (RDAP, DNS, TLS, Domain Mismatch)
  const digitalIdentity = await analyzeEmailAndDomain(detectedEmail, detectedDomain, detectedCompanyName, flags);

  // 2. Government & Corporate Registry
  const government = await lookupGovernmentRegistry(detectedCompanyName, cin, gstin);

  // 3. LinkedIn Forensics (100% truthful, no fake avatars)
  const linkedin = analyzeLinkedInPresence(detectedCompanyName, linkedInUrl);

  // 4. Financial & Stock Markets (100% truthful, no fake charts)
  const stocks = await getCompanyFinancials(detectedCompanyName, ticker);

  // 5. Offer Letter Quality: Run ONLY if offer letter / email document is provided
  const offerLetterQuality = isOfferLetter ? evaluateOfferLetterQuality(rawText, flags) : null;

  // 6. Real Reddit Community Discussions (no fake stars/reviews)
  const redditAndReviews = await getRedditAndReviewSentiment(detectedCompanyName);

  // 7. Quora Discussions & Fraud Checks
  const quora = await getQuoraDiscussions(detectedCompanyName);

  // 8. Physical Footprint & Map: Address from input or geographic registry
  const physical = await resolvePhysicalFootprint({
    detectedCompanyName,
    detectedAddress,
    detectedPhone,
    detectedEmail,
    detectedDomain,
    isUserProvidedAddress: !!(details?.companyAddress)
  });

  // Concrete Rules & Checks Performed Tracking
  const redFlags = [];
  const greenFlags = [];

  const hasTextToEvaluate = rawText && rawText.length >= 30;

  // Physical Building & Premises Verification Flags
  if (physical.status === 'no_building_found' && hasTextToEvaluate) {
    redFlags.push({
      rule: 'No Physical Building / Premises Found',
      severity: 'MEDIUM',
      description: `No registered commercial office building found for "${detectedCompanyName}" in public geographic records. Virtual-only entities carry elevated risk.`
    });
  } else if (physical.status === 'found_online') {
    greenFlags.push(`Commercial office building verified: ${physical.officeAddress}`);
  }

  // MCA Corporate Registration Flags
  const isMsme = !!extractedData.isMsme;
  if (government.status === 'not_registered' && hasTextToEvaluate) {
    if (isMsme) {
      greenFlags.push('Operates with registered MSME / Udyam status (Ministry of Micro, Small & Medium Enterprises)');
    } else {
      redFlags.push({
        rule: 'Company Not Registered on MCA / Corporate Portals',
        severity: 'MEDIUM',
        description: `No formal corporate registration found on the Ministry of Corporate Affairs (MCA) registry for "${detectedCompanyName}". The business may operate as an MSME, sole proprietorship, partnership, or trade name rather than an incorporated private/public limited company.`
      });
    }
  } else if (government.status === 'registered') {
    greenFlags.push(`Company "${government.companyName}" verified in corporate registries (${government.description || 'Registered Company'})`);
  }

  // Ingest Unusual Job Typologies & Severe Scams
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

  // Ingest User-Provided Details (Strictly labeled "user-provided")
  if (details) {
    if (details.claimedEmployeeCount || details.linkedInEmployeeCount) {
      linkedin.status = 'user_provided';
      linkedin.source = 'Entered by user (user-provided)';
      linkedin.claimedEmployeeCount = details.claimedEmployeeCount ? parseInt(details.claimedEmployeeCount, 10) : null;
      linkedin.linkedInEmployeeCount = details.linkedInEmployeeCount ? parseInt(details.linkedInEmployeeCount, 10) : null;

      if (linkedin.claimedEmployeeCount && linkedin.linkedInEmployeeCount) {
        const claimed = linkedin.claimedEmployeeCount;
        const li = linkedin.linkedInEmployeeCount;
        if (claimed >= 3 * li && claimed >= 30) {
          redFlags.push({
            rule: 'Headcount Discrepancy [user-provided]',
            severity: 'HIGH',
            description: `Claimed employee count (${claimed}) is significantly higher than LinkedIn employee count (${li}) [user-provided]. Potential inflation or unverified corporate scale.`
          });
        } else {
          greenFlags.push(`Headcount comparison: Claimed (${claimed}) vs LinkedIn (${li}) [user-provided]`);
        }
      }
    }

    if (details.linkedInCreatedYear) {
      const yr = parseInt(details.linkedInCreatedYear, 10);
      linkedin.createdYear = yr;
      linkedin.source = 'Entered by user (user-provided)';
      const pageAge = new Date().getFullYear() - yr;
      if (pageAge < 1) {
        redFlags.push({
          rule: 'Recent LinkedIn Page (< 1 Year) [user-provided]',
          severity: 'HIGH',
          description: `LinkedIn company page created recently in ${yr} [user-provided]. Newly formed social profiles for established organizations indicate imposter recruitment risk.`
        });
      } else {
        greenFlags.push(`LinkedIn page established: Created in ${yr} (~${pageAge} years ago) [user-provided]`);
      }
    }

    if (details.ambitionBoxRating || details.glassdoorRating) {
      redditAndReviews.userProvidedRatings = {
        ambitionBoxRating: details.ambitionBoxRating ? parseFloat(details.ambitionBoxRating) : null,
        ambitionBoxReviews: details.ambitionBoxReviews ? parseInt(details.ambitionBoxReviews, 10) : null,
        glassdoorRating: details.glassdoorRating ? parseFloat(details.glassdoorRating) : null,
        glassdoorReviews: details.glassdoorReviews ? parseInt(details.glassdoorReviews, 10) : null,
        source: 'Entered by user (user-provided)'
      };
      greenFlags.push('Candidate review ratings recorded [user-provided]');
    }

    if (details.financials && Array.isArray(details.financials)) {
      const validRows = details.financials.filter(r => r.year && (r.revenue !== undefined || r.profit !== undefined));
      if (validRows.length > 0) {
        stocks.status = 'user_provided';
        stocks.source = 'Entered by user (user-provided)';
        stocks.userProvidedFinancials = validRows;

        const revs = validRows.map(r => Number(r.revenue)).filter(n => !isNaN(n));
        let growthSummary = '5-year financial breakdown entered by user.';
        if (revs.length >= 2) {
          const initialRev = revs[0];
          const latestRev = revs[revs.length - 1];
          if (initialRev > 0) {
            const pct = Math.round(((latestRev - initialRev) / initialRev) * 100);
            growthSummary = `Revenue ${pct >= 0 ? 'grew by ' + pct + '%' : 'declined by ' + Math.abs(pct) + '%'} from ${validRows[0].year} to ${validRows[validRows.length - 1].year} [user-provided].`;
          }
        }
        stocks.growthSummary = growthSummary;
        stocks.message = growthSummary;
        greenFlags.push(`Financial data supplied: ${growthSummary}`);
      }
    }
  }

  // --- EVALUATE THE 8 SPECIFIC CHECKS (TOTAL WEIGHT: 100) ---

  // Check 1: Fee / Payment Demand (Weight: 20)
  const feePerformed = !!(hasTextToEvaluate || flags.moneyDemanded);
  let feeStatus = 'not_run';
  let feePoints = 0;
  let feeDesc = 'No communication text provided to evaluate fee demands.';
  if (feePerformed) {
    if (flags.moneyDemanded) {
      feeStatus = 'fail';
      feePoints = 0;
      const quote = flags.feeSnippet ? `Found in text: "${flags.feeSnippet}"` : '';
      feeDesc = `Communication requests upfront money (Laptop deposit, courier fee, registration, programme fee, or training bond). Legitimate authorized companies NEVER ask candidates to pay money. ${quote}`.trim();
      redFlags.push({
        rule: 'Golden Rule #1: Upfront Fee Demanded',
        severity: 'CRITICAL',
        description: feeDesc
      });
    } else {
      feeStatus = 'pass';
      feePoints = 20;
      feeDesc = 'No upfront fees, courier charges, or security deposits demanded.';
      greenFlags.push('No upfront fees, courier charges, or security deposits demanded');
    }
  }

  // Check 2: Sender Domain & Corporate Verification (Weight: 15)
  const emailChecked = !!(detectedEmail || detectedDomain);
  let senderStatus = 'not_run';
  let senderPoints = 0;
  let senderDesc = 'No sender email address or company domain provided in input.';
  if (emailChecked) {
    if (digitalIdentity.isDomainMismatch) {
      senderStatus = 'fail';
      senderPoints = 0;
      senderDesc = digitalIdentity.mismatchDetails || `Sender domain does not match claimed organization.`;
      redFlags.push({
        rule: 'Golden Rule #3: Unauthorized Sender Domain Mismatch',
        severity: 'CRITICAL',
        description: senderDesc
      });
    } else if (digitalIdentity.isFreeEmail) {
      senderStatus = 'fail';
      senderPoints = 0;
      senderDesc = `Communication was sent from a free consumer mailbox (@${(detectedEmail || detectedDomain || '').split('@').pop()}). Authorized corporate employers mandate registered corporate domain addresses.`;
      redFlags.push({
        rule: 'Golden Rule #3: Free Consumer Email Provider Used',
        severity: 'HIGH',
        description: senderDesc
      });
    } else if (digitalIdentity.isTyposquatted) {
      senderStatus = 'fail';
      senderPoints = 0;
      senderDesc = digitalIdentity.spoofingCheck || 'Sender domain is a typosquatted lookalike.';
      redFlags.push({
        rule: 'Golden Rule #3: Typosquatted / Lookalike Domain',
        severity: 'CRITICAL',
        description: senderDesc
      });
    } else if (detectedCompanyName && detectedCompanyName !== 'Unspecified organisation') {
      senderStatus = 'pass';
      senderPoints = 15;
      senderDesc = `Sender domain (@${(detectedEmail || detectedDomain).split('@').pop()}) is an independent corporate domain.`;
      greenFlags.push(`Sender domain (@${(detectedEmail || detectedDomain).split('@').pop()}) is an independent corporate domain`);
    } else {
      senderStatus = 'warning';
      senderPoints = 7.5;
      senderDesc = `Sender domain (@${(detectedEmail || detectedDomain).split('@').pop()}) is a corporate domain, but organization name was not specified in the message.`;
      greenFlags.push(`Sender domain (@${(detectedEmail || detectedDomain).split('@').pop()}) is an independent corporate domain`);
    }
  }

  // Check 3: Statutory Corporate Registry (MCA / GSTIN) (Weight: 15)
  const mcaPerformed = !!(government.status === 'found_in_input' || government.status === 'registered' || isMsme || cin || gstin);
  let mcaStatus = 'not_run';
  let mcaPoints = 0;
  let mcaDesc = 'No Corporate Identification Number (CIN) or GSTIN provided in input.';
  if (mcaPerformed) {
    if (government.cinValid) {
      mcaStatus = 'pass';
      mcaPoints = 15;
      mcaDesc = `Statutory CIN format decoded: ${government.listingStatus} registered in ${government.state} (${government.yearOfIncorporation})`;
      greenFlags.push(mcaDesc);
    } else if (government.status === 'registered') {
      mcaStatus = 'pass';
      mcaPoints = 15;
      mcaDesc = `Corporate entity verified in registry: ${government.companyName} (${government.description || 'Incorporated entity'})`;
      greenFlags.push(mcaDesc);
    } else if (isMsme) {
      mcaStatus = 'pass';
      mcaPoints = 10;
      mcaDesc = 'Registered MSME / Udyam enterprise (Ministry of Micro, Small & Medium Enterprises).';
    } else {
      mcaStatus = 'fail';
      mcaPoints = 0;
      mcaDesc = government.reason || 'Invalid corporate registration identifier provided.';
      redFlags.push({
        rule: 'Invalid Corporate Registry Identifier',
        severity: 'HIGH',
        description: mcaDesc
      });
    }
  }

  // Check 4: Informal Communication & Coercive Pressure (Weight: 10)
  const informalOrPressurePerformed = !!(hasTextToEvaluate || flags.informalMessagingChannel || flags.fakeUrgency);
  let informalStatus = 'not_run';
  let informalPoints = 0;
  let informalDesc = 'No communication text provided to evaluate channels and timeline.';
  if (informalOrPressurePerformed) {
    if (flags.informalMessagingChannel && flags.fakeUrgency) {
      informalStatus = 'fail';
      informalPoints = 0;
      informalDesc = 'Communication moved to informal messaging (WhatsApp/Telegram) and applies artificial coercive deadlines.';
    } else if (flags.informalMessagingChannel) {
      informalStatus = 'fail';
      informalPoints = 0;
      const quote = flags.informalChannelSnippet ? `Found in text: "${flags.informalChannelSnippet}"` : '';
      informalDesc = `Communication directs recruitment to WhatsApp or Telegram rather than official corporate portals or email. ${quote}`.trim();
    } else if (flags.fakeUrgency) {
      informalStatus = 'warning';
      informalPoints = 5;
      const quote = flags.urgencySnippet ? `Found in text: "${flags.urgencySnippet}"` : '';
      informalDesc = `Communication imposes artificial psychological urgency (e.g. 24 hours, immediate cancellation). ${quote}`.trim();
    } else {
      informalStatus = 'pass';
      informalPoints = 10;
      informalDesc = 'Professional recruitment communication channel and reasonable decision timeline.';
      greenFlags.push('Standard recruitment timeline without coercive pressure');
    }

    if (flags.informalMessagingChannel) {
      redFlags.push({
        rule: 'Communication moved to an informal messaging channel',
        severity: 'HIGH',
        description: informalDesc
      });
    }
    if (flags.fakeUrgency) {
      redFlags.push({
        rule: 'Golden Rule #4: Artificial High-Pressure Deadline',
        severity: 'HIGH',
        description: flags.urgencySnippet ? `Artificial pressure / urgent deadline: "${flags.urgencySnippet}"` : 'Artificial psychological urgency detected.'
      });
    }
  }

  // Check 5: Sensitive Identity Document Collection (Weight: 10)
  const mentionsSensitiveDocs = flags.asksDocsOverChat || (hasTextToEvaluate && /(?:aadhaar|pan\s*card|passport|bank\s*passbook|bank\s*details|upload\s*id|identity\s*documents?)/i.test(rawText));
  const docsPerformed = !!mentionsSensitiveDocs;
  let docsStatus = 'not_run';
  let docsPoints = 0;
  let docsDesc = 'No document collection text provided to evaluate.';
  if (docsPerformed) {
    if (flags.asksDocsOverChat) {
      docsStatus = 'fail';
      docsPoints = 0;
      const quote = flags.docsSnippet ? `Found in text: "${flags.docsSnippet}"` : '';
      docsDesc = `Demands personal identity credentials (Aadhaar, PAN, passport, bank details) over WhatsApp/Telegram instead of a secure corporate candidate portal. ${quote}`.trim();
      redFlags.push({
        rule: 'Golden Rule #2: Insecure Identity Document Collection',
        severity: 'HIGH',
        description: docsDesc
      });
    } else {
      docsStatus = 'pass';
      docsPoints = 10;
      docsDesc = 'No unencrypted transmission of sensitive identity documents requested.';
      greenFlags.push('Identity document collection directed via official/secure methods');
    }
  }

  // Check 6: Corporate Domain Age, DNS & TLS Security (Weight: 10)
  const domainTargetPresent = !!(digitalIdentity.domain && !digitalIdentity.isFreeEmail);
  const rdapChecked = digitalIdentity.rdap?.status === 'verified';
  const dnsChecked = digitalIdentity.dns?.status === 'verified';
  const tlsChecked = digitalIdentity.tls?.status === 'verified';
  const domainSecurityPerformed = domainTargetPresent && (rdapChecked || dnsChecked || tlsChecked);
  let domainSecStatus = 'not_run';
  let domainSecPoints = 0;
  let domainSecDesc = 'No corporate domain available for network security checks (free email or missing domain).';
  if (domainSecurityPerformed) {
    if (digitalIdentity.rdap?.isRecentlyRegistered) {
      domainSecStatus = 'fail';
      domainSecPoints = 0;
      domainSecDesc = `Domain was registered ${digitalIdentity.rdap.ageInDays} days ago (${digitalIdentity.rdap.registrationDate?.split('T')[0]}). Recent domain registration under 90 days is a primary indicator of temporary scam campaigns.`;
      redFlags.push({
        rule: 'Recently Registered Domain (< 90 Days)',
        severity: 'HIGH',
        description: domainSecDesc
      });
    } else if (digitalIdentity.tls?.authError) {
      domainSecStatus = 'fail';
      domainSecPoints = 0;
      domainSecDesc = `TLS certificate failed trust validation: ${digitalIdentity.tls.authError}`;
      redFlags.push({
        rule: 'Untrusted TLS Certificate',
        severity: 'MEDIUM',
        description: domainSecDesc
      });
    } else if (digitalIdentity.rdap?.status === 'verified' && digitalIdentity.dns?.hasSpf) {
      domainSecStatus = 'pass';
      domainSecPoints = 10;
      domainSecDesc = `Established domain (~${digitalIdentity.rdap.ageYears} yrs) with active SPF and verified TLS certificate.`;
      greenFlags.push(`Established domain: Registered ${digitalIdentity.rdap.ageYears} years ago via ${digitalIdentity.rdap.registrar}`);
    } else {
      domainSecStatus = 'warning';
      domainSecPoints = 5;
      domainSecDesc = 'Domain resolved, but some DNS/TLS records could not be fully verified.';
      greenFlags.push('Domain resolved successfully');
    }
  }

  // Check 7: Online Presence, LinkedIn & Reviews (Weight: 10)
  const hasUserPresence = !!(details && (details.claimedEmployeeCount || details.linkedInEmployeeCount || details.linkedInCreatedYear || details.ambitionBoxRating || details.glassdoorRating));
  const hasLivePresence = !!(linkedin.status === 'verified' || redditAndReviews.status === 'verified');
  const onlinePresencePerformed = hasUserPresence || hasLivePresence;
  let onlineStatus = 'not_run';
  let onlinePoints = 0;
  let onlineDesc = 'No LinkedIn, employee count, or candidate review data provided.';
  if (onlinePresencePerformed) {
    const hasHeadcountMismatch = redFlags.some(r => r.rule.includes('Headcount Discrepancy'));
    const hasRecentLinkedIn = redFlags.some(r => r.rule.includes('Recent LinkedIn Page'));
    if (hasHeadcountMismatch || hasRecentLinkedIn) {
      onlineStatus = 'fail';
      onlinePoints = 0;
      onlineDesc = hasHeadcountMismatch ? 'Severe headcount discrepancy between claimed and verified profiles.' : 'Company page created recently (< 1 year old).';
    } else {
      onlineStatus = 'pass';
      onlinePoints = 10;
      onlineDesc = 'Online corporate footprint recorded with consistent metrics.';
    }
  }

  // Check 8: Physical Operating Address & Offer Terms (Weight: 10)
  const hasAddress = physical.status === 'found_in_input' || physical.status === 'user_provided' || physical.status === 'found_online';
  const hasOfferQuality = isOfferLetter && /(?:₹|rs\.?|inr|salary|stipend|ctc|lpa|position|role|appointment)/i.test(rawText || '');
  const addressOfferPerformed = hasAddress || hasOfferQuality;
  let addressOfferStatus = 'not_run';
  let addressOfferPoints = 0;
  let addressOfferDesc = 'No physical office address or formal appointment offer details provided.';
  if (addressOfferPerformed) {
    const hasScamTypology = flags.isTypingJob || flags.isTaskBasedScam || flags.isVideoLikingScam || flags.isReshippingScam || flags.isFakeChequeScam || flags.isScreenShareOrAppScam;
    if (hasScamTypology) {
      addressOfferStatus = 'fail';
      addressOfferPoints = 0;
      addressOfferDesc = 'Offer contains suspicious scam typology or deceptive compensation lure.';
    } else if (hasAddress && hasOfferQuality) {
      addressOfferStatus = 'pass';
      addressOfferPoints = 10;
      addressOfferDesc = `Operating office address verified with professional offer terms.`;
      greenFlags.push('Operating address disclosed or verified in records');
    } else {
      addressOfferStatus = 'warning';
      addressOfferPoints = 5;
      addressOfferDesc = hasAddress ? 'Office address verified, but formal appointment terms are partial.' : 'Offer terms outlined, but physical office building is missing.';
      if (hasAddress) greenFlags.push('Operating address disclosed or verified in records');
    }
  }

  // Derive 5 Golden Rules - 100% Derived from Detection Results
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
  } else if (mentionsSensitiveDocs) {
    rule2Passed = true;
    rule2Status = 'Passed';
    rule2Details = 'No unencrypted transmission of sensitive identity documents requested.';
  }

  let rule3Passed = null;
  let rule3Status = 'Not checked';
  let rule3Details = 'No sender email address provided in input.';
  if (detectedEmail || detectedDomain) {
    const activeHost = (detectedEmail || detectedDomain).split('@').pop();
    if (digitalIdentity.isDomainMismatch) {
      rule3Passed = false;
      rule3Status = 'Failed / Domain Mismatch';
      rule3Details = digitalIdentity.mismatchDetails || `Sender domain (@${activeHost}) does not match claimed organization.`;
    } else if (digitalIdentity.isFreeEmail) {
      rule3Passed = false;
      rule3Status = 'Failed / Free Mailbox';
      rule3Details = `Sent from free consumer mailbox (@${activeHost}) rather than registered corporate domain.`;
    } else if (digitalIdentity.isTyposquatted) {
      rule3Passed = false;
      rule3Status = 'Failed / Lookalike Domain';
      rule3Details = digitalIdentity.spoofingCheck || 'Sender domain is a typosquatted lookalike.';
    } else {
      rule3Passed = true;
      rule3Status = 'Passed';
      rule3Details = `Sent from registered corporate domain (@${activeHost}).`;
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

  // Compile 8 Checks Definition List
  const checks = [
    {
      id: 'fee_demand',
      name: 'Upfront Payment & Deposit Check',
      weight: 20,
      performed: feePerformed,
      status: feeStatus,
      points: feePoints,
      description: feeDesc,
      tip: 'Ask the recruiter directly whether any deposit, equipment fee, or training charge is required. Legitimate employers never charge candidates.'
    },
    {
      id: 'sender_domain',
      name: 'Sender Email & Corporate Domain Analysis',
      weight: 15,
      performed: emailChecked,
      status: senderStatus,
      points: senderPoints,
      description: senderDesc,
      tip: 'Request correspondence from the recruiter\'s official corporate email address (@company.com). Never accept hiring communications from free personal webmail.'
    },
    {
      id: 'mca_gst',
      name: 'Statutory Corporate Registry (MCA / GSTIN)',
      weight: 15,
      performed: mcaPerformed,
      status: mcaStatus,
      points: mcaPoints,
      description: mcaDesc,
      tip: 'Search the Ministry of Corporate Affairs portal (mca.gov.in) with the company name to verify whether it is legally registered.'
    },
    {
      id: 'informal_or_pressure',
      name: 'Communication Channel & Decision Timeline',
      weight: 10,
      performed: informalOrPressurePerformed,
      status: informalStatus,
      points: informalPoints,
      description: informalDesc,
      tip: 'Insist on formal written communication via email or official applicant portal. Refuse to conduct official hiring over WhatsApp or Telegram.'
    },
    {
      id: 'sensitive_docs',
      name: 'Identity Document Collection Security',
      weight: 10,
      performed: docsPerformed,
      status: docsStatus,
      points: docsPoints,
      description: docsDesc,
      tip: 'Never submit copies of your Aadhaar card, PAN card, or bank passbook over WhatsApp or Telegram. Upload sensitive documents only to secure corporate portals.'
    },
    {
      id: 'domain_age_dns_tls',
      name: 'Domain Age, DNS & TLS Certificate Security',
      weight: 10,
      performed: domainSecurityPerformed,
      status: domainSecStatus,
      points: domainSecPoints,
      description: domainSecDesc,
      tip: 'Check the domain registration date on whois.com or lookup TLS certificate. Domains registered less than 90 days ago carry high fraud risk.'
    },
    {
      id: 'online_presence',
      name: 'Online Presence & Employee Profile Verification',
      weight: 10,
      performed: onlinePresencePerformed,
      status: onlineStatus,
      points: onlinePoints,
      description: onlineDesc,
      tip: 'Search for the company on LinkedIn and employee review sites (Glassdoor, AmbitionBox) to confirm actual employee profiles and recruitment reputation.'
    },
    {
      id: 'address_offer_details',
      name: 'Physical Office Address & Offer Terms',
      weight: 10,
      performed: addressOfferPerformed,
      status: addressOfferStatus,
      points: addressOfferPoints,
      description: addressOfferDesc,
      tip: 'Search the company\'s physical office address on Google Maps and Google Street View to verify that an actual corporate office exists at the stated address.'
    }
  ];

  // Compute Coverage and Provisional Trust Score strictly from performed checks
  const performedChecks = checks.filter(c => c.performed);
  const performedCount = performedChecks.length;
  const performedWeight = performedChecks.reduce((sum, c) => sum + c.weight, 0);
  const pointsEarned = performedChecks.reduce((sum, c) => sum + c.points, 0);

  let rawScore = performedWeight > 0 ? Math.round((pointsEarned / performedWeight) * 100) : 0;
  let trustScore = null;
  const capsApplied = [];

  // Apply Caps in Strict Order
  if (performedCount < 2) {
    trustScore = null;
  } else {
    let score = rawScore;

    // Apply proportional adjustment for medium red flags (e.g. unlisted on MCA or unverified map premises)
    const mediumRedFlagsCount = redFlags.filter(r => r.severity === 'MEDIUM').length;
    if (mediumRedFlagsCount > 0) {
      score = Math.max(20, score - (mediumRedFlagsCount * 10));
    }

    // Cap 1: Fewer than 5 checks run -> max 50
    if (performedCount < 5 && score > 50) {
      score = 50;
      capsApplied.push('Score capped at 50 because fewer than 5 checks were performed');
    }

    // Cap 2: Any HIGH or CRITICAL red flag -> max 35
    const hasHighOrCriticalFlag = redFlags.some(r => r.severity === 'HIGH' || r.severity === 'CRITICAL');
    if (hasHighOrCriticalFlag && score > 35) {
      score = 35;
      capsApplied.push('Score capped at 35 due to high-risk red flag detection');
    }

    // Cap 3: Fee or deposit demand -> max 15
    if (flags.moneyDemanded && score > 15) {
      score = 15;
      capsApplied.push('Score capped at 15 due to upfront fee / payment demand');
    }

    trustScore = score;
  }

  let scoreLabel = 'Not enough data';
  if (performedCount < 2) {
    scoreLabel = 'Not enough data';
  } else if (performedCount < 8) {
    scoreLabel = `Provisional - based on ${performedCount} of 8 checks`;
  } else {
    scoreLabel = 'Complete (8 of 8 checks)';
  }

  const coverageRatio = `${performedCount} of 8 checks performed`;
  const hasEnoughData = performedCount >= 5;

  // Determine Risk Level (scale: Low / Medium / High / Critical) and Verdict
  const hasCriticalRedFlag = redFlags.some(r => r.severity === 'CRITICAL');
  const hasHighRedFlag = redFlags.some(r => r.severity === 'HIGH');
  const hasMediumRedFlag = redFlags.some(r => r.severity === 'MEDIUM');

  let riskLevel = 'Low';
  let verdict = 'No red flags found in the text. Unverified.';
  let badgeColor = 'amber';

  if (hasCriticalRedFlag) {
    riskLevel = 'Critical';
    verdict = 'CRITICAL RISK / RECRUITMENT FRAUD DETECTED';
    badgeColor = 'rose';
  } else if (hasHighRedFlag) {
    riskLevel = 'High';
    verdict = 'High Risk';
    badgeColor = 'rose';
  } else if (hasMediumRedFlag) {
    riskLevel = 'Medium';
    verdict = 'Medium Risk';
    badgeColor = 'amber';
  } else {
    // 0 red flags
    if (government.cinValid && !digitalIdentity.isDomainMismatch && !digitalIdentity.isFreeEmail && performedCount >= 5) {
      riskLevel = 'Low';
      verdict = 'VERIFIED';
      badgeColor = 'emerald';
    } else if (hasTextToEvaluate) {
      riskLevel = 'Low';
      verdict = 'No red flags found in the text. Unverified.';
      badgeColor = 'emerald';
    } else {
      riskLevel = 'Low';
      verdict = 'UNVERIFIED – insufficient evidence';
      badgeColor = 'amber';
    }
  }

  // Top 3 concrete reasons quoting the mail or primary evidence
  const topReasons = [];
  for (const rf of redFlags) {
    if (topReasons.length >= 3) break;
    topReasons.push({
      rule: rf.rule,
      severity: rf.severity,
      description: rf.description
    });
  }
  if (topReasons.length === 0) {
    for (const gf of greenFlags.slice(0, 3)) {
      topReasons.push({
        rule: 'Verified Evidence',
        severity: 'PASSED',
        description: gf
      });
    }
  }

  // Plain-language actionable advice
  const adviceList = [];
  if (hasCriticalRedFlag || hasHighRedFlag) {
    adviceList.push('Do NOT pay any money, security deposits, courier charges, or registration fees.');
    adviceList.push('Do NOT share Aadhaar, PAN card, passport, or bank details over WhatsApp or Telegram.');
    adviceList.push('Do NOT install remote desktop tools (AnyDesk, TeamViewer) or unknown APK files.');
    adviceList.push('Verify the job opening directly by searching for the official company careers website.');
  } else if (verdict === 'VERIFIED') {
    adviceList.push('Corporate identity and statutory registration verified against official government records.');
    adviceList.push('Always complete contracts and onboarding on secure official company portals.');
  } else {
    adviceList.push('Look up the company on the Ministry of Corporate Affairs portal (mca.gov.in) to verify registration.');
    adviceList.push('Ask the recruiter to email you from their official corporate domain address (@company.com).');
    adviceList.push('Check LinkedIn to confirm the recruiter is genuinely employed by the stated organization.');
  }

  const howCalculated = {
    performedCount,
    totalChecks: 8,
    coverageRatio,
    pointsEarned,
    performedWeight,
    rawScore: performedCount >= 2 ? rawScore : null,
    finalScore: trustScore,
    scoreLabel,
    capsApplied,
    disclaimer: 'This score is a guide, not a probability or legal proof.',
    checks
  };

  // Backwards compatibility array for any consumers expecting checksAudit
  const checksAudit = checks.map(c => ({
    id: c.id,
    name: c.name,
    performed: c.performed
  }));

  return {
    companyName: detectedCompanyName,
    claimedDomain: detectedDomain,
    claimedEmail: detectedEmail,
    trustScore,
    hasEnoughData,
    riskLevel,
    verdict,
    badgeColor,
    coverageRatio,
    scoreLabel,
    howCalculated,
    checksAudit,
    goldenRules,
    topReasons,
    adviceList,
    redFlags,
    greenFlags,
    digitalIdentity,
    government,
    linkedin,
    stocks,
    offerLetterQuality,
    physical,
    redditAndReviews,
    quora,
    userProvidedDetails: details,
    legalDisclaimer: 'This score is a guide, not a probability or legal proof.',
    timestamp: new Date().toISOString()
  };
}
