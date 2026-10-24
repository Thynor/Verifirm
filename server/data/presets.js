// Benchmark presets for immediate testing and verification demonstration

export const BENCHMARK_PRESETS = [
  {
    id: 'legitimate-tcs',
    title: 'Tata Consultancy Services (TCS)',
    category: 'Verified Blue-Chip Enterprise',
    badge: 'Legitimate Global Enterprise',
    badgeColor: 'emerald',
    sampleInputType: 'text',
    sampleInput: `From: careers.onboarding@tcs.com
Subject: Offer of Employment - Systems Engineer | Tata Consultancy Services Limited
Dear Candidate,

We are pleased to offer you the position of Systems Engineer at Tata Consultancy Services (TCS), Mumbai. Your gross compensation package will be INR 7,20,000/- per annum.

Please access our secure TCS iON Onboarding Portal at https://nextstep.tcs.com to complete your document verification and digital background verification. TCS never requests candidates to make payments for job applications, interview processing, laptops, or security deposits.

Official Corporate Headquarters:
TCS House, Raveline Street, Fort, Mumbai - 400001, Maharashtra, India.
CIN: L22210MH1995PLC084781 | GSTIN: 27AAACT2828Q1ZU
Official Contact: +91 22 6778 9999 | https://www.tcs.com`,
    companyName: 'Tata Consultancy Services Limited',
    claimedDomain: 'tcs.com',
    claimedEmail: 'careers.onboarding@tcs.com',
    trustScore: 98,
    verdict: 'VERIFIED LEGITIMATE ENTERPRISE',
    verdictSummary: 'Tata Consultancy Services is a publicly traded, highly reputable global IT enterprise with active legal registrations, authentic domain history of 28+ years, mature 23-year LinkedIn presence, verified building ownership, and over 615,000 verified employees.',
    goldenRules: {
      moneyDemanded: false,
      moneyDetails: 'No payment requested. Clear explicit disclaimer: TCS never asks for deposits, laptop fees, or interview charges.',
      secureOnboarding: true,
      onboardingDetails: 'Uses secure proprietary corporate portal (https://nextstep.tcs.com). No WhatsApp/Telegram document collection.',
      officialEmailDomain: true,
      emailDetails: 'Email originated from official corporate domain (@tcs.com) with valid SPF/DKIM authentication.',
      reasonableUrgency: true,
      urgencyDetails: 'Standard 14-day formal acceptance window provided.',
      realisticCompensation: true,
      compensationDetails: 'INR 7.2 LPA aligns with market standard for Systems Engineer grade.'
    },
    offerLetterQuality: {
      qualityPercentage: 98,
      verdict: 'Bespoke Corporate Enterprise Standard',
      checks: [
        { id: 'signature', title: 'Authorized Signatory & Seal', passed: true, status: 'Verified Executive Seal', details: 'Formally signed by Milind Lakkad, Chief Human Resources Officer, with registered corporate digital certificate.' },
        { id: 'cin_address', title: 'Statutory CIN & Office Address on Letterhead', passed: true, status: 'Compliant & Verified', details: 'Includes full MCA CIN (L22210MH1995PLC084781) and registered headquarters at TCS House, Fort, Mumbai.' },
        { id: 'template', title: 'Document Template Quality', passed: true, status: 'Official Bespoke Watermark', details: 'High-security multi-page PDF generated via TCS iON ERP with candidate unique ref number.' },
        { id: 'logo', title: 'Branding & Logo Integrity', passed: true, status: 'Vector Master Asset', details: 'Crisp SVG vector branding with authentic Tata corporate font standards.' },
        { id: 'dates', title: 'Recruitment Timeline & Date Consistency', passed: true, status: 'Standard 14-Day Acceptance', details: 'Logical chronological sequence: formal interview rounds followed by 14-day acceptance buffer.' },
        { id: 'salary_fit', title: 'Salary & Role Alignment', passed: true, status: 'Realistic Scale', details: 'INR 7.20 LPA matches enterprise compensation band for Systems Engineer.' }
      ]
    },
    linkedin: {
      employeeCount: 615000,
      claimedCount: 600000,
      headcountMatch: true,
      discrepancyNote: 'Employee headcount on LinkedIn (~615k) accurately matches official claimed workforce and investor disclosures.',
      registeredDate: 'October 2003',
      pageAgeYears: 23,
      accountAgeDanger: false,
      accountAgeAlert: '✓ Established LinkedIn Longevity: Registered in 2003 (23 years of continuous corporate history).',
      profileQualityScore: 94,
      profileAudit: [
        { name: 'K. Krithivasan', role: 'Chief Executive Officer & MD', connections: '500+', hasRealPhoto: true, pastExperience: '34 years at TCS / Tata Group', verified: true },
        { name: 'Milind Lakkad', role: 'Chief Human Resources Officer', connections: '500+', hasRealPhoto: true, pastExperience: 'Executive leadership, ex-Tata Motors', verified: true },
        { name: 'N. Ganapathy Subramaniam', role: 'Chief Operating Officer & Director', connections: '500+', hasRealPhoto: true, pastExperience: '30+ years in IT architecture', verified: true },
        { name: 'Ananya Sharma', role: 'Lead Solutions Architect', connections: '500+', hasRealPhoto: true, pastExperience: 'Ex-Cognizant, 9 years in cloud systems', verified: true }
      ],
      turnoverRate: '11.8% annually',
      turnoverAssessment: 'Industry-low voluntary attrition. Average employee tenure is 4.9 years, demonstrating strong organizational stability and career continuity.',
      leadershipVisibility: 'High (Fully public C-Suite with active verified press coverage and keynote history)'
    },
    stocks: {
      isPublic: true,
      exchange: 'NSE / BSE',
      ticker: 'TCS.NS (NSE) / 532540 (BSE)',
      currentPrice: '₹3,982.40',
      change: '+1.42%',
      changePositive: true,
      marketCap: '₹14.41 Lakh Cr ($173.2B USD)',
      peRatio: '29.1',
      dividendYield: '1.45%',
      history: [
        { period: '2022 Q1', price: 3200, revenue: 50591, profit: 9926 },
        { period: '2022 Q3', price: 3450, revenue: 55309, profit: 10846 },
        { period: '2023 Q1', price: 3250, revenue: 59381, profit: 11074 },
        { period: '2023 Q3', price: 3580, revenue: 59692, profit: 11342 },
        { period: '2024 Q1', price: 3950, revenue: 61237, profit: 12434 },
        { period: '2024 Q3', price: 4250, revenue: 64259, profit: 11909 },
        { period: '2025 Q1', price: 4120, revenue: 66800, profit: 12850 },
        { period: '2025 Q4', price: 3982, revenue: 68500, profit: 13200 }
      ],
      financialAnalysis: {
        growthDrivers: 'Sustained international enterprise deal wins, double-digit expansion in cloud transformation and AI-driven automation services.',
        marginHealth: 'Operating margins healthy at 24.5% to 26.0%, supported by disciplined SG&A cost control and superior offshore utilization rates.',
        riskFactors: 'Minor exposure to North American banking & financial services tech spending volatility, counterbalanced by long-term European contracts.',
        summary: 'Exceptional financial solvency. Net zero debt, strong free cash flow generation exceeding ₹40,000 Cr annually.'
      }
    },
    government: {
      mcaStatus: 'Active',
      cin: 'L22210MH1995PLC084781',
      cinValid: true,
      rocJurisdiction: 'RoC - Mumbai',
      companyType: 'Public Limited Company (Indian Non-Government)',
      incorporationDate: '19 January 1995',
      authorizedCapital: '₹460,05,00,000',
      paidUpCapital: '₹361,80,87,518',
      taxIdentifiers: {
        gstin: '27AAACT2828Q1ZU',
        gstinStatus: 'Active & Verified',
        stateCode: '27 (Maharashtra)',
        pan: 'AAACT2828Q',
        panStatus: 'Verified Corporate Permanent Account Number'
      },
      globalEquivalents: {
        secRegistration: 'Registered ADR (US OTC / SEC Filings Active)',
        ukCompaniesHouse: 'Tata Consultancy Services UK Branch (FC025062) - Active'
      }
    },
    digitalIdentity: {
      domain: 'tcs.com',
      domainAge: '28 years (Registered 1996-03-24)',
      domainSanity: 'Pass - Mature corporate domain matches company historical founding.',
      whoisRegistrar: 'MarkMonitor Inc.',
      sslStatus: 'Valid EV SSL (DigiCert Extended Validation)',
      emailAuthentication: 'SPF: PASS | DKIM: PASS | DMARC: REJECT (Enforced)',
      spoofingCheck: 'Clean - No typosquatting detected. Exact official match.',
      websiteSanity: 'Social media links in footer lead to verified official corporate accounts; zero broken template artifacts.'
    },
    physical: {
      officeAddress: 'TCS House, Raveline Street, Fort, Mumbai, Maharashtra 400001, India',
      isCommercial: true,
      buildingType: 'Grade-A Commercial Heritage Corporate Headquarters',
      streetViewStatus: 'Verified - Prominent corporate signage and dedicated multi-story security pavilion.',
      landlineVerified: '+91 22 6778 9999 (Registered MTNL Corporate PRI Trunk Line)',
      contactDetails: {
        phone: '+91 22 6778 9999',
        email: 'careers@tcs.com / corporate.office@tcs.com',
        website: 'https://www.tcs.com',
        switchboard: '24/7 Corporate Switchboard Directory Active'
      },
      ownershipAudit: {
        status: 'VERIFIED CORPORATE OWNER & MASTER LESSEE',
        badgeColor: 'emerald',
        isLegitimateOwner: true,
        assessment: 'GENUINE CORPORATE HEADQUARTERS: The Tata Group owns and occupies TCS House. Municipal property records and ROC filings corroborate dedicated corporate ownership. No false claims of third-party towers.'
      }
    },
    redditAndReviews: {
      overallSentiment: 'Positive / Authentic Corporate (4.2/5)',
      redditSummary: 'Frequent discussion on r/developersIndia and r/cscareerquestions. Users verify strict background verification via HireRight/FirstAdvantage and standard formal letters. Zero reports of deposit demands.',
      redditPosts: [
        { subreddit: 'r/developersIndia', title: 'TCS Onboarding timeline and NextStep portal verification steps', upvotes: 248, sentiment: 'Neutral' },
        { subreddit: 'r/cscareerquestions', title: 'Offer review: TCS Systems Engineer vs local boutique firm', upvotes: 114, sentiment: 'Positive' },
        { subreddit: 'r/scams', title: 'PSA: Watch out for scammers impersonating TCS HR via Telegram. Real TCS only uses @tcs.com and never asks for money', upvotes: 890, sentiment: 'Warning (Clarifying authentic vs scam)' }
      ],
      reviewAuthenticity: {
        ambitionBoxRating: 4.1,
        totalReviews: '82,450+ reviews',
        glassdoorRating: 3.9,
        syntheticReviewAnomaly: 'None detected. Review timeline exhibits organic bell-curve distribution across 15+ years.'
      }
    }
  },
  {
    id: 'scam-imposter-tcs',
    title: 'Fake TCS HR Recruiter (Laptop Deposit Scam)',
    category: 'High-Risk Imposter Phishing Scam',
    badge: '🚨 CRITICAL RISK / CONFIRMED SCAM',
    badgeColor: 'rose',
    sampleInputType: 'text',
    sampleInput: `URGENT - TATA CONSULTANCY SERVICES (TCS) HIRING NOTICE
From: hr.recruitment.tcsindia@gmail.com
Sender WhatsApp: +91 91234 56789 (HR Director Pooja Verma)

Dear Candidate,
Congratulations! You are shortlisted for Work-From-Home Data Processing & Typing Executive at Tata Consultancy Services (TCS).
Monthly Salary: INR 65,000/- with Apple MacBook Air and Wi-Fi reimbursement.

IMPORTANT MANDATORY STEP:
As per company policy, you must pay a refundable Laptop Courier & Security Deposit of INR 8,500/- via GooglePay/PhonePe to UPI ID: tcsonlinehr@upi. This amount will be refunded in your first salary slip.
Also send photo of your PAN Card, Aadhaar Card, and Bank passbook directly on WhatsApp to +91 91234 56789.

Note: Only 3 slots available! If payment is not completed within 2 hours, your appointment will be cancelled and offered to the next waitlisted applicant.

Visit our portal: http://tcs-recruitment-careers.online/apply`,
    companyName: 'TCS Online Recruitment (Claimed Tata Consultancy Services Imposter)',
    claimedDomain: 'tcs-recruitment-careers.online',
    claimedEmail: 'hr.recruitment.tcsindia@gmail.com',
    trustScore: 4,
    verdict: 'CRITICAL SCAM DETECTED - 100% RECRUITMENT FRAUD',
    verdictSummary: 'This is a textbook advance-fee recruitment scam impersonating TCS. It violates multiple Golden Rules: demanding a ₹8,500 laptop deposit, using free @gmail.com and a 6-day-old typosquatted domain, displaying defective offer letter quality, and falsely claiming a residential address.',
    goldenRules: {
      moneyDemanded: true,
      moneyDetails: 'CRITICAL RED FLAG: Demands ₹8,500 upfront deposit for "Laptop Delivery". Legitimate companies NEVER charge for equipment or interviews.',
      secureOnboarding: false,
      onboardingDetails: 'DANGEROUS: Solicits unencrypted Aadhaar, PAN, and Bank Passbook over WhatsApp (+91-91234-56789). High identity theft risk.',
      officialEmailDomain: false,
      emailDetails: 'FRAUDULENT: Sent from a free consumer @gmail.com account rather than corporate @tcs.com.',
      reasonableUrgency: false,
      urgencyDetails: 'PSYCHOLOGICAL PRESSURE: "2-hour deadline or job offered to next applicant". Standard fraud tactic.',
      realisticCompensation: false,
      compensationDetails: 'Unrealistically high entry-level salary (₹65,000/mo) for simple typing/data entry work designed to lure victims.'
    },
    offerLetterQuality: {
      qualityPercentage: 8,
      verdict: 'Fraudulent Template with Severe Omissions',
      checks: [
        { id: 'signature', title: 'Authorized Signatory & Seal', passed: false, status: 'Missing / Anonymous', details: 'CRITICAL DEFECT: No digital certificate or verifiable corporate signature. Uses unverified name on WhatsApp.' },
        { id: 'cin_address', title: 'Statutory CIN & Office Address on Letterhead', passed: false, status: 'Omitted / Fake CIN', details: 'Omits valid Corporate Identification Number (CIN) and registered office address.' },
        { id: 'template', title: 'Document Template Quality', passed: false, status: 'Copy-pasted Generic Template', details: 'Uses standard scam template with hyperbolic congratulatory phrasing and artificial slots urgency.' },
        { id: 'logo', title: 'Branding & Logo Integrity', passed: false, status: 'Blurry Stolen Raster', details: 'Stolen low-resolution logo thumbnail with severe compression artifacts.' },
        { id: 'dates', title: 'Recruitment Timeline & Date Consistency', passed: false, status: '2-Hour Panic Trigger', details: 'Requires payment within 2 hours or appointment forfeited.' },
        { id: 'salary_fit', title: 'Salary & Role Alignment', passed: false, status: 'Severe Bait Mismatch', details: 'Promises ₹65,000/month for basic data entry, an unmistakable scam indicator.' }
      ]
    },
    linkedin: {
      employeeCount: 3,
      claimedCount: 50000,
      headcountMatch: false,
      discrepancyNote: 'MASSIVE RED FLAG: Claims to be a massive enterprise with thousands of staff, but LinkedIn has only 3 newly created accounts.',
      registeredDate: 'October 2026 (Registered 12 days ago)',
      pageAgeYears: 0.03,
      accountAgeDanger: true,
      accountAgeAlert: '🚨 DANGER: LinkedIn page created only 12 days ago. Shell accounts are thrown away after victims pay deposits.',
      profileQualityScore: 12,
      profileAudit: [
        { name: 'Pooja Verma (Claimed HR)', role: 'HR Manager', connections: '14 connections', hasRealPhoto: false, pastExperience: 'No prior company history listed', verified: false, note: 'Profile picture matches stock AI face dataset (ThisPersonDoesNotExist)' },
        { name: 'Rohit Tech Lead', role: 'Technical Lead', connections: '3 connections', hasRealPhoto: false, pastExperience: 'Account created this week', verified: false, note: 'Zero endorsements, blank education and prior roles' },
        { name: 'Support Rep', role: 'Support Specialist', connections: '0 connections', hasRealPhoto: false, pastExperience: 'None', verified: false, note: 'Default placeholder avatar' }
      ],
      turnoverRate: 'Not measurable (Shell page under 2 weeks old)',
      turnoverAssessment: 'Brand-new placeholder LinkedIn company page designed to deceive casual searchers.',
      leadershipVisibility: 'Zero (No authentic executive leadership or verifiable corporate history)'
    },
    stocks: {
      isPublic: false,
      exchange: 'None / Fake Domain Claim',
      ticker: 'N/A - Imposter Shell Entity',
      currentPrice: '₹0.00',
      change: '0.00%',
      changePositive: false,
      marketCap: '₹0 (Fraudulent Entity)',
      peRatio: 'N/A',
      dividendYield: '0.00%',
      history: [],
      financialAnalysis: {
        growthDrivers: 'None - The claimed entity is an illicit phishing front targeting job seekers.',
        marginHealth: 'Illicit advance fee fraud.',
        riskFactors: 'Total financial loss of deposited funds. Bank account and identity credentials vulnerable to compromise.',
        summary: 'No legitimate financial statements, SEC filings, or audited balance sheets exist.'
      }
    },
    government: {
      mcaStatus: 'Non-Existent / Strike-Off Alert',
      cin: 'U72900DL2024PTC999999 (FAKE CIN / INVALID CHECKSUM)',
      cinValid: false,
      rocJurisdiction: 'Failed Registry Lookup',
      companyType: 'Unregistered Phishing Front',
      incorporationDate: 'Not found in official MCA database',
      authorizedCapital: '₹0',
      paidUpCapital: '₹0',
      taxIdentifiers: {
        gstin: '07AAAAA0000A1Z5 (INVALID CHECKSUM)',
        gstinStatus: 'Fake / Algorithmic Check Failed',
        stateCode: '07 (Delhi - Fake)',
        pan: 'AAAAA0000A',
        panStatus: 'Non-existent or forged PAN'
      },
      globalEquivalents: {
        secRegistration: 'None',
        ukCompaniesHouse: 'None'
      }
    },
    digitalIdentity: {
      domain: 'tcs-recruitment-careers.online',
      domainAge: '6 days old (Registered 2026-10-11)',
      domainSanity: 'CRITICAL FAILURE - Domain registered 6 days ago while claiming decades of industry operation.',
      whoisRegistrar: 'Namecheap Inc. (Withheld for Privacy)',
      sslStatus: 'Free basic Let\'s Encrypt SSL (automated single-domain cert)',
      emailAuthentication: 'SPF: FAIL / Hard Discrepancy | Sender IP flagged on Spamhaus',
      spoofingCheck: 'ALERT: Typosquatted / lookalike domain intentionally mimicking Tata Consultancy Services.',
      websiteSanity: 'Footer social icons (Facebook, LinkedIn, Twitter) are dead "#" anchors that reload the homepage.'
    },
    physical: {
      officeAddress: 'Flat 402, Gali No. 4, Shakarpur Extension, East Delhi 110092 (Claimed Corporate Tower)',
      isCommercial: false,
      buildingType: 'Residential Tenement / Dense Unauthorized Colony',
      streetViewStatus: 'SUSPICIOUS - High-density residential apartment building with laundry hanging from balconies. No commercial corporate signage.',
      landlineVerified: 'None provided. Only disposable prepaid mobile (+91 91234 56789) on WhatsApp.',
      contactDetails: {
        phone: '+91 91234 56789 (Prepaid WhatsApp Mobile)',
        email: 'hr.recruitment.tcsindia@gmail.com (Free Webmail)',
        website: 'http://tcs-recruitment-careers.online (Phishing Front)',
        switchboard: 'None - Direct mobile only'
      },
      ownershipAudit: {
        status: 'FALSE CLAIMING / RESIDENTIAL MASQUERADE',
        badgeColor: 'rose',
        isLegitimateOwner: false,
        assessment: 'FALSE CLAIMING DETECTED: Claims to operate a multi-national corporate office, but address corresponds to a 1-bedroom flat in a residential colony. Zero corporate tenancy, municipal registration, or commercial leasing records exist.'
      }
    },
    redditAndReviews: {
      overallSentiment: 'Extremely Negative / Scam Alert (0.5/5)',
      redditSummary: 'Multiple active warning threads on r/scams and r/developersIndia reporting the exact phone number and UPI ID for laptop deposit fraud.',
      redditPosts: [
        { subreddit: 'r/scams', title: 'WARNING: Fake TCS Work-From-Home job asking for 8500 Rs laptop deposit on WhatsApp', upvotes: 1420, sentiment: 'Scam Alert' },
        { subreddit: 'r/developersIndia', title: 'Got email from hr.recruitment.tcsindia@gmail.com - is this real? (Answer: SCAM!)', upvotes: 563, sentiment: 'Scam Alert' },
        { subreddit: 'r/recruitinghell', title: 'Scammers don\'t even try anymore: ₹8,500 for a MacBook via PhonePe UPI', upvotes: 382, sentiment: 'Scam Alert' }
      ],
      reviewAuthenticity: {
        ambitionBoxRating: 1.0,
        totalReviews: '0 legitimate reviews',
        glassdoorRating: 1.0,
        syntheticReviewAnomaly: 'Detected template fake reviews on blog comments with broken grammar and fabricated testimonials.'
      }
    }
  },
  {
    id: 'unverified-startup',
    title: 'Acrobyte Global Fintech Labs',
    category: 'Unverified Early-Stage / Shell Startup',
    badge: '⚠️ UNVERIFIED / HIGH SCRUTINY NEEDED',
    badgeColor: 'amber',
    sampleInputType: 'url',
    sampleInput: 'https://acrobyte-global-solutions.io',
    companyName: 'Acrobyte Global Fintech Solutions Private Limited',
    claimedDomain: 'acrobyte-global-solutions.io',
    claimedEmail: 'recruitment@acrobyte-global-solutions.io',
    trustScore: 42,
    verdict: 'UNVERIFIED / ELEVATED RISK',
    verdictSummary: 'Acrobyte displays severe discrepancies between website marketing claims and public registry records. The company claims 500+ employees and $30M valuation, but has only 4 profiles on LinkedIn, an 8-month-old domain, pending MCA annual filings, and Glassdoor review manipulation.',
    goldenRules: {
      moneyDemanded: false,
      moneyDetails: 'No direct upfront fee requested in offer text.',
      secureOnboarding: false,
      onboardingDetails: 'Requested passport and bank details over an unencrypted email attachment rather than a candidate portal.',
      officialEmailDomain: true,
      emailDetails: 'Matches claimed website domain, but domain was registered recently.',
      reasonableUrgency: false,
      urgencyDetails: 'Gives only 24 hours to accept offer without formal written compensation breakdown.',
      realisticCompensation: true,
      compensationDetails: 'INR 14 LPA offered, but 40% tied to non-liquid "founder token bonus".'
    },
    offerLetterQuality: {
      qualityPercentage: 50,
      verdict: 'Questionable / Missing Disclosures',
      checks: [
        { id: 'signature', title: 'Authorized Signatory & Seal', passed: false, status: 'Informal Digital Sign', details: 'Informal sign-off from founder without statutory HR designation or corporate seal.' },
        { id: 'cin_address', title: 'Statutory CIN & Office Address on Letterhead', passed: true, status: 'Listed', details: 'Includes MCA CIN (U72200KA2024PTC184920) and HSR Layout address.' },
        { id: 'template', title: 'Document Template Quality', passed: true, status: 'Standard Startup Letter', details: 'Custom template, but lacks detailed benefits, provident fund, or severance disclosures.' },
        { id: 'logo', title: 'Branding & Logo Integrity', passed: true, status: 'Standard Web PNG', details: 'Clear web logo, but no formal corporate branding guidelines applied.' },
        { id: 'dates', title: 'Recruitment Timeline & Date Consistency', passed: false, status: 'Tight 24-Hour Expiry', details: 'Requires acceptance within 24 hours without formal compensation contract.' },
        { id: 'salary_fit', title: 'Salary & Role Alignment', passed: true, status: 'Discretionary Bonus', details: 'INR 14 LPA is reasonable for full stack developer, but contains unverified founder equity.' }
      ]
    },
    linkedin: {
      employeeCount: 4,
      claimedCount: 500,
      headcountMatch: false,
      discrepancyNote: 'Major Discrepancy: Website claims "500+ passionate engineers across 6 countries", but LinkedIn shows only 4 registered employees.',
      registeredDate: 'February 2026',
      pageAgeYears: 0.6,
      accountAgeDanger: true,
      accountAgeAlert: '🚨 DANGER: LinkedIn page created only 8 months ago (< 2 years old). High caution required for unverified startups claiming extensive global operations.',
      profileQualityScore: 48,
      profileAudit: [
        { name: 'Vikram Mehta', role: 'Founder & CEO', connections: '180 connections', hasRealPhoto: true, pastExperience: 'Listed as consultant at undisclosed entities', verified: false },
        { name: 'Arjun Das', role: 'Full Stack Engineer', connections: '95 connections', hasRealPhoto: true, pastExperience: '1 year freelance experience', verified: false },
        { name: 'Sarah L.', role: 'Head of Growth', connections: '42 connections', hasRealPhoto: false, pastExperience: 'Minimal profile details', verified: false }
      ],
      turnoverRate: '68% exited under 6 months',
      turnoverAssessment: 'High turnover rate. 3 past employees departed within 90-120 days, signaling workplace instability or payroll disputes.',
      leadershipVisibility: 'Moderate (Founder exists on social media but lacks verifiable enterprise track record)'
    },
    stocks: {
      isPublic: false,
      exchange: 'Unlisted / Private Startup',
      ticker: 'PRIVATE - Early Stage Venture',
      currentPrice: 'N/A',
      change: 'N/A',
      changePositive: true,
      marketCap: 'Estimated Pre-seed / Bootstrapped',
      peRatio: 'N/A',
      dividendYield: '0.00%',
      history: [],
      financialAnalysis: {
        growthDrivers: 'Bootstrapped fintech prototype with unverified traction claims.',
        marginHealth: 'High burn rate relative to undisclosed seed reserves.',
        riskFactors: 'Unlisted entity with no audited public financial disclosures or verified Tier-1 institutional VC backers.',
        summary: 'Privately held startup. Requires candidate to request audited runway proof or bank escrow for salary security.'
      }
    },
    government: {
      mcaStatus: 'Active - Filing Defaults Reported',
      cin: 'U72200KA2024PTC184920',
      cinValid: true,
      rocJurisdiction: 'RoC - Bangalore',
      companyType: 'Private Limited Company',
      incorporationDate: '14 May 2024',
      authorizedCapital: '₹10,00,000',
      paidUpCapital: '₹1,00,000',
      taxIdentifiers: {
        gstin: '29AABCA9821K1ZM',
        gstinStatus: 'Active (Filing quarterly)',
        stateCode: '29 (Karnataka)',
        pan: 'AABCA9821K',
        panStatus: 'Verified Private Ltd PAN'
      },
      globalEquivalents: {
        secRegistration: 'None',
        ukCompaniesHouse: 'None'
      }
    },
    digitalIdentity: {
      domain: 'acrobyte-global-solutions.io',
      domainAge: '8 months old (Registered 2026-02-14)',
      domainSanity: 'Caution - Website claims 6 years in business, but domain was registered 8 months ago.',
      whoisRegistrar: 'GoDaddy.com LLC',
      sslStatus: 'Valid Standard SSL (cPanel / Sectigo)',
      emailAuthentication: 'SPF: PASS | DKIM: NONE | DMARC: NONE (Vulnerable to email spoofing)',
      spoofingCheck: 'Domain is clean, but lacks strict email security policies.',
      websiteSanity: 'Website uses a standard HTML5 corporate theme with several stock illustration placeholders.'
    },
    physical: {
      officeAddress: 'Co-working Bay #3, 4th Floor, HSR Layout Sector 2, Bengaluru, Karnataka 560102',
      isCommercial: true,
      buildingType: 'Shared Flex Co-working Desk (Virtual Office Plan)',
      streetViewStatus: 'Verified Co-working Space (WeWork/Awfis partner building). Mail forwarding address with no dedicated private floor.',
      landlineVerified: 'No dedicated corporate PBX line; mobile contact only.',
      contactDetails: {
        phone: '+91 80 4123 4567',
        email: 'contact@acrobyte-global-solutions.io',
        website: 'https://acrobyte-global-solutions.io',
        switchboard: 'Virtual receptionist service'
      },
      ownershipAudit: {
        status: 'CO-WORKING TENANT / VIRTUAL DESK',
        badgeColor: 'amber',
        isLegitimateOwner: false,
        assessment: 'VIRTUAL DESK: Company does NOT own this building; holds a month-to-month hot-desk pass in a shared co-working space.'
      }
    },
    redditAndReviews: {
      overallSentiment: 'Mixed / Warning Signs (2.6/5)',
      redditSummary: 'Discussions on r/developersIndia cite irregular salary payout delays and abrupt contract terminations during probation.',
      redditPosts: [
        { subreddit: 'r/developersIndia', title: 'Experience with Acrobyte Fintech in Bangalore? Received an offer', upvotes: 42, sentiment: 'Caution' },
        { subreddit: 'r/antiwork', title: 'Startup promised equity tokens instead of last month salary', upvotes: 95, sentiment: 'Negative' }
      ],
      reviewAuthenticity: {
        ambitionBoxRating: 2.8,
        totalReviews: '11 reviews',
        glassdoorRating: 3.2,
        syntheticReviewAnomaly: 'SUSPICIOUS PATTERN: 6 five-star reviews were posted on the exact same weekend (Aug 18-19, 2026) using almost identical buzzwords ("Great leadership", "Fast-paced learning").'
      }
    }
  }
];
