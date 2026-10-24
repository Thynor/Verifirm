// Entity Extraction & NLP Parser Service - 100% Evidence-Grounded
// Extracts only entities present in the user's input text without hardcoded company defaults.

export function formatDomainToCompanyName(domain) {
  if (!domain) return null;
  const clean = domain.toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '')
    .replace(/\.(edu\.in|ac\.in|gov\.in|org\.in|co\.in|com|org|net|edu|ac|in|io|tech|co|online|xyz|biz|info)$/, '')
    .replace(/\.[a-z]{2,4}$/, '');

  let spaced = clean
    .replace(/[-_.]/g, ' ')
    .trim();

  if (!spaced) return null;

  return spaced
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function isToolOrSoftwareMention(text, brand) {
  const brandLower = (brand || '').toLowerCase();
  if (brandLower === 'microsoft') {
    const toolRegex = /\bmicrosoft\s+(?:teams|office|365|word|excel|powerpoint|outlook|windows|azure|onedrive|authenticator|surface|store|edge|certified|certification|suite|account)\b/gi;
    const allMatches = text.match(/\bmicrosoft\b/gi) || [];
    const toolMatches = text.match(toolRegex) || [];
    return toolMatches.length >= allMatches.length && allMatches.length > 0;
  }
  if (brandLower === 'google') {
    const toolRegex = /\bgoogle\s+(?:meet|drive|docs|sheets|forms?|classroom|calendar|workspace|chrome|play|cloud|auth|authenticator)\b/gi;
    const allMatches = text.match(/\bgoogle\b/gi) || [];
    const toolMatches = text.match(toolRegex) || [];
    return toolMatches.length >= allMatches.length && allMatches.length > 0;
  }
  return false;
}

export function isGenericPlatformOrTool(name) {
  if (!name) return true;
  const n = name.toLowerCase().trim();
  const platforms = [
    'google', 'google form', 'google forms', 'google meet', 'google drive', 'gmail',
    'microsoft', 'microsoft teams', 'microsoft office', 'microsoft word', 'ms teams', 'office 365', 'outlook',
    'zoom', 'discord', 'telegram', 'whatsapp', 'linkedin', 'github', 'notion', 'slack', 'canva', 'youtube',
    'internship', 'internships', 'virtual internship', 'selection letter', 'offer letter', 'candidate', 'applicant',
    'hr department', 'recruitment team', 'hiring team', 'campus', 'placement cell', 'training and placement',
    'support team', 'admin', 'administrator', 'coordinator'
  ];
  return platforms.some(p => n === p || n === p + 's' || n.startsWith(p + ' ') || n.endsWith(' ' + p));
}

export function extractEntitiesFromInput(inputText, inputType = 'text') {
  const text = (inputText || '').trim();
  
  // Extract URLs
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const urls = text.match(urlRegex) || [];

  // Extract Email Addresses
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const emails = text.match(emailRegex) || [];

  // Extract Phone Numbers / WhatsApp
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4,5}/g;
  const phones = text.match(phoneRegex) || [];

  // Extract Physical Office Address strictly from input
  let detectedAddress = null;
  const addressPrefixMatch = text.match(/(?:office\s*address|corporate\s*address|registered\s*office|headquarters|location|address|report\s*to)[:\s]+([^\n\r]{10,140})/i);
  if (addressPrefixMatch) {
    detectedAddress = addressPrefixMatch[1].trim().replace(/^[,\s.-]+/, '');
  } else {
    // Search for explicit street, road, nagar, floor, pin code, colony, sector
    const genericAddressMatch = text.match(/([a-zA-Z0-9\s,.-]+(?:road|street|nagar|marg|sector|phase|layout|tech\s*park|tower|building|floor|campus|colony|extension|flat|block|plot)[a-zA-Z0-9\s,.-]+(?:\d{5,6})?)/i);
    if (genericAddressMatch && genericAddressMatch[0].trim().length > 10) {
      detectedAddress = genericAddressMatch[0].trim().replace(/^[,\s.-]+/, '');
    }
  }

  if (detectedAddress) {
    detectedAddress = detectedAddress.split(/\.\s+(?:contact|email|phone|tel|call|please|we|regards|sincerely|you\s+must|pay|fee|deposit)/i)[0].trim();
    detectedAddress = detectedAddress.replace(/[.,;]+$/, '').trim();
    if (detectedAddress.length < 8) detectedAddress = null;
  }

  // Detect Money / Deposit / Fees
  const feePatterns = [
    /laptop\s*(courier|security|fee|deposit|charge)/i,
    /security\s*deposit/i,
    /training\s*(fee|charge|deposit)/i,
    /registration\s*fee/i,
    /refundable\s*(deposit|amount|fee)/i,
    /(upi|phonepe|googlepay|gpay|paytm)/i,
    /(pay|deposit|transfer)\s*(inr|rs\.?|₹)?\s*\d+/i
  ];
  const moneyDemanded = feePatterns.some(pattern => pattern.test(text));

  // Detect Unusual Scam Job Typologies
  const isTypingJob = /(typing|data\s*entry|form\s*filling|copy\s*paste|sms\s*sending|captcha\s*typing)\s*(work\s*from\s*home|job|project)/i.test(text);
  const isTaskBasedScam = /(task\s*based\s*earning|daily\s*tasks|prepaid\s*task|earn\s*daily\s*commission|telegram\s*tasks)/i.test(text);
  const isVideoLikingScam = /(like\s*(youtube|video|instagram|tiktok)|subscribe\s*channel|rate\s*hotel|write\s*google\s*review\s*for\s*money)/i.test(text);
  const isReshippingScam = /(reship\s*package|package\s*forwarding|parcel\s*inspection|shipping\s*coordinator\s*from\s*home)/i.test(text);

  // Detect Fake Cheque & Equipment Scams
  const isFakeChequeScam = /(send\s*(you\s*)?a\s*cheque|send\s*(you\s*)?a\s*check|vendor\s*for\s*laptop|approved\s*vendor|buy\s*software\s*from\s*our\s*vendor|reimburse\s*via\s*check)/i.test(text);
  const isScreenShareOrAppScam = /(install\s*(app|apk|anydesk|teamviewer|quicksupport|zoho)|share\s*(your\s*)?screen|screen\s*sharing\s*during)/i.test(text);

  // Detect Insecure Document Handling (Aadhaar / PAN over WhatsApp / Telegram)
  const docPatterns = [
    /(aadhaar|aadhar|pan card|bank passbook|identity proof|passport)/i,
    /(whatsapp|telegram)/i
  ];
  const asksDocsOverChat = docPatterns[0].test(text) && docPatterns[1].test(text);

  // Detect High-Pressure Urgency
  const urgencyPatterns = [
    /within\s*(2|3|4|24)\s*hours?/i,
    /only\s*\d+\s*slots?\s*available/i,
    /(cancelled|rescinded|forfeited)\s*if\s*not\s*paid/i,
    /urgent\s*hiring/i
  ];
  const fakeUrgency = urgencyPatterns.some(pattern => pattern.test(text));

  // Detect CIN and GSTIN
  const cinMatch = text.match(/[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}/i);
  const gstinMatch = text.match(/[0-3]\d[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]/i);

  // Detect Stock Ticker Mention (e.g. NSE:TCS, BSE:532540, NASDAQ:MSFT)
  const tickerMatch = text.match(/\b(?:nse|bse|nasdaq|nyse)[:\s]+([a-zA-Z0-9]+)\b/i);

  // Detect LinkedIn URL in input
  const linkedInUrlMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/company\/([a-zA-Z0-9_-]+)/i);

  // Determine Company Name DYNAMICALLY
  let detectedCompanyName = null;

  // 1. Dedicated Internship Offer & Email Sender Pinpointing
  const internshipIssuerPatterns = [
    /(?:from|sender)[:\s]+([A-Za-z0-9\s&]{3,40}?)(?:\s*<|\s+via|\s+team|\s*\(|\n|$)/i,
    /subject[:\s]+.*?(?:internship|selection|offer|virtual\s+program).*?(?:at|with|from)\s+([A-Za-z0-9\s&]{3,40}?)(?:\.|\n|$)/i,
    /(?:internship|offer|selection\s+letter|appointment)\s+(?:at|with|from|for|in)\s+([A-Za-z0-9\s&]{3,40}?)(?:\s+for|\s+as|\s+team|\s+in|\.|\n|$)/i,
    /(?:selected\s+for|offering\s+you|welcome\s+to).*?(?:internship|program)\s+(?:at|with)\s+([A-Za-z0-9\s&]{3,40}?)(?:\.|\n|$)/i,
    /(?:regards|sincerely)\s*[,:\n\r]+\s*(?:team\s+)?([A-Za-z0-9\s&]{3,40}?)(?:\s+team|\s+technologies|\s+tech|\.|\n|$)/i
  ];

  for (const pattern of internshipIssuerPatterns) {
    const match = text.match(pattern);
    if (match) {
      let candidate = match[1].trim().replace(/[.,;!]+$/, '').trim();
      candidate = candidate.replace(/^(the|team|dear|we|our)\s+/i, '');
      if (!isGenericPlatformOrTool(candidate) && candidate.length >= 3 && candidate.length <= 40) {
        detectedCompanyName = candidate;
        break;
      }
    }
  }

  // 2. Explicit Company Header in text (e.g., Company Name: ..., Offer from: ..., Welcome to: ...)
  if (!detectedCompanyName) {
    const companyHeaderMatch = text.match(/(?:welcome(?:\s+you)?\s+to|company\s*name|organization|employer|offer\s*from|position\s*(?:at|with)|role\s*at|team\s*at|opportunity\s*at|joining\s+(?:the\s+team\s+at\s+|our\s+team\s+at\s+)?(?!date\b))[:\s]+([A-Za-z0-9\s&.,'!-]{3,50})/i);
    if (companyHeaderMatch) {
      let rawName = companyHeaderMatch[1].trim();
      rawName = rawName.split(/[!.\n\r]/)[0];
      rawName = rawName.split(/\s+(?:we\s+are|dear|candidate|applicant|please|is\s+pleased|your\s+joining)\b/i)[0];
      const candidate = rawName.replace(/[.,;!]+$/, '').trim();
      if (!isGenericPlatformOrTool(candidate)) {
        detectedCompanyName = candidate;
      }
    }
  }

  // 3. Sender Email Domain formatting if not free webmail
  if (!detectedCompanyName && emails.length > 0) {
    const domainPart = emails[0].split('@')[1];
    if (!['gmail.com', 'yahoo.com', 'yahoo.in', 'outlook.com', 'hotmail.com', 'icloud.com', 'rediffmail.com'].includes(domainPart.toLowerCase())) {
      detectedCompanyName = formatDomainToCompanyName(domainPart);
    }
  }

  // 4. Prominent letterhead lines in the first 3 lines of input
  if (!detectedCompanyName) {
    const firstLines = text.split(/[\r\n]+/).slice(0, 3);
    for (const line of firstLines) {
      const cleanLine = line.trim();
      if (cleanLine.length >= 4 && cleanLine.length <= 50 && !/^(dear|subject|to|from|date|hi|hello|regards)/i.test(cleanLine)) {
        if (/university|institute|college|solutions|technologies|corporation|ltd|limited|services|group|pvt/i.test(cleanLine)) {
          detectedCompanyName = cleanLine.replace(/[.,;!]+$/, '').trim();
          break;
        }
      }
    }
  }

  // 5. If input is a short query (e.g., user just entered "Zorblax Technologies Pvt Ltd")
  if (!detectedCompanyName && text.length > 0 && text.length <= 80 && !text.includes('\n') && !urls.length) {
    if (!isGenericPlatformOrTool(text)) {
      detectedCompanyName = text.replace(/[.,;!]+$/, '').trim();
    }
  }

  // 6. Website URL if present (ignore social/platform URLs)
  if (!detectedCompanyName && urls.length > 0) {
    const nonPlatformUrl = urls.find(u => !u.includes('linkedin.com') && !u.includes('google.com') && !u.includes('facebook.com'));
    if (nonPlatformUrl) {
      const cleanUrl = nonPlatformUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      detectedCompanyName = formatDomainToCompanyName(cleanUrl);
    }
  }

  if (!detectedCompanyName) {
    detectedCompanyName = 'Unspecified Organization';
  }

  // Determine Corporate Domain (distinct from social media host like linkedin.com)
  let detectedDomain = null;
  const corporateUrl = urls.find(u => !u.includes('linkedin.com') && !u.includes('google.com') && !u.includes('facebook.com'));
  if (corporateUrl) {
    detectedDomain = corporateUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
  } else if (emails.length > 0) {
    const dom = emails[0].split('@')[1];
    if (!['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].includes(dom)) {
      detectedDomain = dom;
    }
  } else {
    // Check for inline domain pattern (e.g. acme.com)
    const inlineDomainMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9_-]+\.(?:tech|com|in|org|net|co|io|edu|ac|gov))\b/i);
    if (inlineDomainMatch && !inlineDomainMatch[1].includes('linkedin.com') && !inlineDomainMatch[1].includes('google.com')) {
      detectedDomain = inlineDomainMatch[1];
    }
  }

  // Determine whether input represents an offer letter / email document
  const isOfferLetter = inputType === 'screenshot' || 
    /(?:offer|selection|appointment|joining|salary|stipend|candidate|interview|dear\s+[a-z]+)/i.test(text);

  return {
    rawText: text,
    inputType,
    isOfferLetter,
    detectedCompanyName,
    detectedDomain,
    detectedEmail: emails[0] || null,
    detectedPhone: phones[0] || null,
    detectedAddress,
    cin: cinMatch ? cinMatch[0].toUpperCase() : null,
    gstin: gstinMatch ? gstinMatch[0].toUpperCase() : null,
    ticker: tickerMatch ? tickerMatch[1] : null,
    linkedInUrl: linkedInUrlMatch ? linkedInUrlMatch[0] : null,
    flags: {
      moneyDemanded,
      isTypingJob,
      isTaskBasedScam,
      isVideoLikingScam,
      isReshippingScam,
      isFakeChequeScam,
      isScreenShareOrAppScam,
      asksDocsOverChat,
      fakeUrgency
    }
  };
}
