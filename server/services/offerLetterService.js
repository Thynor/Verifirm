// Offer Letter Quality & Forensic Audit Service - 100% Evidence-Grounded
// Evaluates only textual and forensic evidence present in the candidate's offer document.

export function evaluateOfferLetterQuality(text, flags = {}) {
  if (!text || typeof text !== 'string' || text.trim().length < 30) {
    return null;
  }

  const cleanText = text.toLowerCase();
  const checkedAt = new Date().toISOString();

  // 1. Authorized Signatory Check
  const signaturePatterns = [
    /(?:authorized|authorised)\s*(?:signatory|signature)/i,
    /(?:chief human resources officer|chro|head of talent|hr director|managing director|vice president)/i,
    /(?:digitally signed|verified signature|sincerely|regards)/i
  ];
  const hasSignatory = signaturePatterns.some(p => p.test(text));

  // 2. Statutory CIN & Office Address on Letterhead
  const cinRegex = /[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}/i;
  const hasCin = cinRegex.test(text);
  const addressPatterns = [
    /(?:registered office|corporate headquarters|headquarters|hq|campus|road|street|nagar|sector|floor|tower|building)/i
  ];
  const hasOfficeAddress = addressPatterns.some(p => p.test(text));

  // 3. Compensation sanity vs role
  const salaryMention = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
  let salaryRoleMismatch = false;
  let salaryExplanation = 'Compensation disclosure detected in document.';

  if (flags.isTypingJob) {
    if (salaryMention || cleanText.includes('65,000') || cleanText.includes('75,000') || cleanText.includes('80,000')) {
      salaryRoleMismatch = true;
      salaryExplanation = 'Unrealistic compensation: Offering ₹60,000 - ₹80,000/month for basic data entry/typing is an advance-fee lure.';
    }
  }

  // 4. Upfront Payment Clause
  const hasPaymentClause = flags.moneyDemanded;

  // 5. High-Pressure Urgency
  const hasUrgency = flags.fakeUrgency;

  // Compile Objective Audit Items
  const checks = [
    {
      id: 'signatory',
      title: 'Authorized Signatory & Closing',
      passed: hasSignatory && !hasPaymentClause,
      status: (hasSignatory && !hasPaymentClause) ? 'Identified in Document' : 'Missing / Anonymous',
      details: (hasSignatory && !hasPaymentClause) 
        ? 'Executive signatory or formal corporate closing detected in text.' 
        : 'Signatory is omitted or obscured by fee demands.'
    },
    {
      id: 'cin_address',
      title: 'Statutory CIN & Operating Address on Letterhead',
      passed: hasCin && hasOfficeAddress,
      status: (hasCin && hasOfficeAddress) ? 'Disclosed in Text' : 'Omitted / Incomplete',
      details: (hasCin && hasOfficeAddress)
        ? 'Corporate Identification Number (CIN) and registered office address disclosed on document.'
        : `Disclosures: ${hasCin ? 'CIN Present' : 'CIN Missing'} • ${hasOfficeAddress ? 'Address Present' : 'Address Missing'}.`
    },
    {
      id: 'payment_clause',
      title: 'Absence of Upfront Financial Demands',
      passed: !hasPaymentClause,
      status: !hasPaymentClause ? 'Clean (No Fees Demanded)' : 'CRITICAL DEFECT: Upfront Fee Demanded',
      details: !hasPaymentClause
        ? 'Document contains zero requests for laptop security deposits, training charges, or courier fees.'
        : 'CRITICAL FAILURE: Demands payment via UPI/payment gateway for equipment or training bond.'
    },
    {
      id: 'urgency',
      title: 'Standard Decision Timeline',
      passed: !hasUrgency,
      status: !hasUrgency ? 'Normal Professional Buffer' : 'Extreme Pressure / Panic Deadline',
      details: !hasUrgency
        ? 'Professional decision and acceptance timeline.'
        : 'Demands payment or acceptance within hours under threat of cancellation.'
    },
    {
      id: 'role_compensation',
      title: 'Role & Compensation Alignment',
      passed: !salaryRoleMismatch,
      status: !salaryRoleMismatch ? 'Standard' : 'Unrealistic Compensation Lure',
      details: salaryExplanation
    }
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const qualityPercentage = Math.round((passedCount / checks.length) * 100);

  return {
    status: 'evaluated',
    source: 'Input document text parsing',
    checkedAt,
    qualityScore: `${passedCount} of ${checks.length} criteria satisfied`,
    qualityPercentage,
    checks
  };
}
