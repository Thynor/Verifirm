// LinkedIn Forensics Service - 100% Evidence-Grounded
// No simulated employees, fake avatars, or manufactured turnover rates.

export function analyzeLinkedInPresence(companyName, linkedInUrlInInput = null) {
  const cleanName = (companyName || '').trim();
  const searchUrl = cleanName 
    ? `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(cleanName)}` 
    : 'https://www.linkedin.com';
  const checkedAt = new Date().toISOString();

  // If user input contained a LinkedIn URL
  if (linkedInUrlInInput) {
    const cleanUrl = linkedInUrlInInput.startsWith('http') ? linkedInUrlInInput : `https://${linkedInUrlInInput}`;
    return {
      status: 'found_in_input',
      companyName: cleanName,
      linkedinUrl: cleanUrl,
      source: 'Extracted from user input text',
      checkedAt,
      employeeCount: null,
      employeeRange: 'No data / not checked',
      profileQualityScore: null,
      profileAudit: [],
      turnoverRate: 'No data / not checked',
      turnoverAssessment: 'Headcount and turnover verification require authenticated LinkedIn Enterprise access.',
      leadershipVisibility: 'Not checked',
      accountAgeDanger: false,
      accountAgeAlert: null,
      searchUrl,
      message: 'LinkedIn profile link detected in input. Deep headcount, executive audits, and retention forensics are not checked without authenticated API credentials.'
    };
  }

  // No LinkedIn profile or URL was provided in input
  return {
    status: 'not_checked',
    companyName: cleanName,
    linkedinUrl: null,
    source: null,
    checkedAt: null,
    employeeCount: null,
    employeeRange: 'No data / not checked',
    profileQualityScore: null,
    profileAudit: [],
    turnoverRate: 'No data / not checked',
    turnoverAssessment: 'No LinkedIn company data provided in input.',
    leadershipVisibility: 'Not checked',
    accountAgeDanger: false,
    accountAgeAlert: null,
    searchUrl,
    message: 'No LinkedIn company profile was provided in input. Unauthenticated web scraping is not performed.'
  };
}
