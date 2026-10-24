// MCA & Government Corporate Portals Verification Service - 100% Evidence-Grounded

export function validateCIN(cin) {
  if (!cin || typeof cin !== 'string') return { valid: false, reason: 'CIN is missing' };
  const cleanCin = cin.trim().toUpperCase();
  
  // Format: [L/U][5 digits][2 letters state][4 digits year][3 letters type][6 digits registration]
  const cinRegex = /^([LU])(\d{5})([A-Z]{2})(\d{4})([A-Z]{3})(\d{6})$/;
  const match = cleanCin.match(cinRegex);
  
  if (!match) {
    return {
      valid: false,
      cin: cleanCin,
      reason: 'Invalid CIN structure. Indian CIN must be 21 characters: [L/U][5 digits industry][2-letter state][4-digit year][3-letter company type][6-digit seq].'
    };
  }

  const [_, listingStatus, industryCode, stateCode, year, companyType, seq] = match;
  const currentYear = new Date().getFullYear();
  const yearInt = parseInt(year, 10);

  if (yearInt < 1850 || yearInt > currentYear) {
    return {
      valid: false,
      cin: cleanCin,
      reason: `Incorporation year (${year}) in CIN is invalid.`
    };
  }

  const listingText = listingStatus === 'L' ? 'Listed Public Company' : 'Unlisted Company';
  const stateNames = {
    MH: 'Maharashtra', DL: 'Delhi', KA: 'Karnataka', TN: 'Tamil Nadu',
    TS: 'Telangana', TG: 'Telangana', WB: 'West Bengal', GJ: 'Gujarat',
    UP: 'Uttar Pradesh', HR: 'Haryana', KL: 'Kerala', RJ: 'Rajasthan',
    PB: 'Punjab', CH: 'Chandigarh', AP: 'Andhra Pradesh', MP: 'Madhya Pradesh'
  };

  return {
    valid: true,
    cin: cleanCin,
    listingStatus: listingText,
    isListed: listingStatus === 'L',
    state: stateNames[stateCode] || stateCode,
    yearOfIncorporation: yearInt,
    companyType: companyType === 'PLC' ? 'Public Limited Company' : companyType === 'PTC' ? 'Private Limited Company' : companyType,
    industryCode,
    seqNumber: seq
  };
}

export function validateGSTIN(gstin) {
  if (!gstin || typeof gstin !== 'string') return { valid: false, reason: 'GSTIN missing' };
  const cleanGstin = gstin.trim().toUpperCase();
  
  // GSTIN: 2-digit state code + 10-char PAN + 1-digit entity number + 'Z' + 1 checksum char
  const gstinRegex = /^([0-3][0-9])([A-Z]{5}\d{4}[A-Z])([1-9A-Z])(Z)([0-9A-Z])$/;
  const match = cleanGstin.match(gstinRegex);

  if (!match) {
    return {
      valid: false,
      gstin: cleanGstin,
      reason: 'Invalid GSTIN structure. Must be 15 alphanumeric characters: 2-digit state code + 10-char PAN + entity number + Z + checksum.'
    };
  }

  const [_, stateCode, pan, entityNum, defaultZ, checksum] = match;
  return {
    valid: true,
    gstin: cleanGstin,
    stateCode,
    pan,
    panEntityType: pan.charAt(3) === 'C' ? 'Company' : pan.charAt(3) === 'P' ? 'Individual' : 'Other'
  };
}

export function lookupGovernmentRegistry(companyName, cinHint, gstinHint) {
  const checkedAt = new Date().toISOString();
  const officialPortalUrl = 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do';
  const officialGstUrl = 'https://services.gst.gov.in/services/searchtp';

  // 1. If CIN is provided in user input, perform syntactical validation and decode statutory attributes
  if (cinHint) {
    const parsedCin = validateCIN(cinHint);
    const parsedGst = gstinHint ? validateGSTIN(gstinHint) : null;

    if (parsedCin.valid) {
      return {
        status: 'found_in_input',
        cin: parsedCin.cin,
        cinValid: true,
        source: 'Input text CIN syntax parsing',
        checkedAt,
        listingStatus: parsedCin.listingStatus,
        isListed: parsedCin.isListed,
        state: parsedCin.state,
        yearOfIncorporation: parsedCin.yearOfIncorporation,
        companyType: parsedCin.companyType,
        officialPortalUrl,
        officialGstUrl,
        taxIdentifiers: parsedGst,
        message: 'Statutory CIN format decoded from input. Verification of live corporate good standing requires manual search on official MCA portal.'
      };
    } else {
      return {
        status: 'invalid_format',
        cin: cinHint,
        cinValid: false,
        source: 'Input text CIN syntax parsing',
        checkedAt,
        reason: parsedCin.reason,
        officialPortalUrl,
        officialGstUrl,
        taxIdentifiers: parsedGst,
        message: 'Provided Corporate Identification Number (CIN) fails statutory structure validation.'
      };
    }
  }

  // 2. No CIN provided in input: never fabricate default capital or fake directors!
  return {
    status: 'not_checked',
    cin: null,
    cinValid: false,
    source: null,
    checkedAt: null,
    officialPortalUrl,
    officialGstUrl,
    taxIdentifiers: gstinHint ? validateGSTIN(gstinHint) : null,
    message: 'No Corporate Identification Number (CIN) was provided in the input text. Live MCA records can be queried using official links.'
  };
}
