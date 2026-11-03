// Automated Evidence & Non-Fabrication Verification Tests - Phase 1 Suite
import assert from 'assert';
import { extractEntitiesFromInput } from '../services/extractionService.js';
import { runComprehensiveAudit } from '../services/scamDetector.js';
import { lookupRdapDomain, lookupDnsAuthRecords } from '../services/networkCheckService.js';
import { getQuoraDiscussions } from '../services/quoraService.js';

async function runTests() {
  console.log('--- STARTING VERIFIRM PHASE 1 EVIDENCE-BASED VERIFICATION TESTS ---\n');

  // Test 1: Free-mail sender + informal channel link, no fee
  console.log('Running Test 1: Free-mail sender + informal channel link (no fee demanded)...');
  {
    const input = `From: recruitment@gmail.com
Subject: Interview Selection for Candidate
Dear Candidate,
Congratulations on passing the screening round.
Please join our official WhatsApp interview group: https://chat.whatsapp.com/DEF456UVW
Regards,
Recruiting Team`;

    const extracted = extractEntitiesFromInput(input, 'text');
    const result = await runComprehensiveAudit(extracted);

    console.log('  Performed checks count:', result.howCalculated.performedCount);
    console.log('  Coverage Ratio:', result.coverageRatio);
    console.log('  Trust Score:', result.trustScore);
    console.log('  Score Label:', result.scoreLabel);
    console.log('  Risk Level:', result.riskLevel);
    console.log('  Caps Applied:', result.howCalculated.capsApplied);

    assert.strictEqual(result.howCalculated.performedCount, 3, 'Must perform exactly 3 of 8 checks');
    assert.strictEqual(result.coverageRatio, '3 of 8 checks performed');
    assert(result.trustScore !== null && result.trustScore <= 35, 'Trust score must be <= 35 for free-mail + informal link');
    assert(result.scoreLabel.includes('Provisional') && result.scoreLabel.includes('3 of 8'), 'Score label must indicate provisional 3 of 8 checks');
    assert.strictEqual(result.riskLevel, 'High', 'Risk level must be High for free email + informal channel link');
    console.log('✓ Test 1 Passed: Free-mail + informal link is capped <= 35 and labeled "Provisional (3 of 8 checks)".\n');
  }

  // Test 2: Fee demand scam email
  console.log('Running Test 2: Upfront Fee Demand scam email (Laptop security deposit)...');
  {
    const input = `From: hr@example-careers.online
Subject: Job Offer - Systems Engineer
Dear Candidate,
Congratulations! You have been selected for the position of Systems Engineer.
Monthly compensation: Rs 65,000.
Please deposit Rs 8,500 security deposit for company laptop delivery via PhonePe or UPI within 24 hours.
Regards,
Recruitment Team`;

    const extracted = extractEntitiesFromInput(input, 'text');
    const result = await runComprehensiveAudit(extracted);

    console.log('  Verdict:', result.verdict);
    console.log('  Trust Score:', result.trustScore);
    console.log('  Risk Level:', result.riskLevel);
    console.log('  Caps Applied:', result.howCalculated.capsApplied);

    assert(result.trustScore !== null && result.trustScore <= 15, 'Trust score must be <= 15 for fee demand');
    assert.strictEqual(result.riskLevel, 'Critical', 'Fee demand must trigger Critical risk');
    assert(result.howCalculated.capsApplied.some(c => c.includes('15')), 'Caps list must document fee cap');
    
    // Golden Rule #1 must be failed
    const rule1 = result.goldenRules.rules.find(r => r.id === 'rule1');
    assert(rule1 && rule1.passed === false, 'Rule 1 must fail for fee demand');
    console.log('✓ Test 2 Passed: Fee demand capped <= 15 with Critical Risk.\n');
  }

  // Test 3: Company name only ("Example Corp Pvt Ltd") -> "Not enough data"
  console.log('Running Test 3: Company name only ("Example Corp Pvt Ltd")...');
  {
    const input = 'Example Corp Pvt Ltd';
    const extracted = extractEntitiesFromInput(input, 'text');
    const result = await runComprehensiveAudit(extracted);

    console.log('  Company Name detected:', result.companyName);
    console.log('  Verdict:', result.verdict);
    console.log('  Trust Score:', result.trustScore);
    console.log('  Score Label:', result.scoreLabel);
    console.log('  Has Enough Data:', result.hasEnoughData);

    assert.strictEqual(result.companyName, 'Example Corp Pvt Ltd');
    assert.strictEqual(result.trustScore, null, 'Trust score must be null (Not enough data) when < 2 checks performed');
    assert.strictEqual(result.hasEnoughData, false, 'hasEnoughData must be false');
    assert.strictEqual(result.scoreLabel, 'Not enough data', 'Score label must be "Not enough data"');
    assert(result.verdict.includes('UNVERIFIED') || result.verdict.includes('No red flags found in the text. Unverified.'), 'Verdict must indicate unverified');

    // All Golden Rules neutral
    for (const rule of result.goldenRules.rules) {
      assert.strictEqual(rule.passed, null, `${rule.title} must be null when unevaluated`);
      assert.strictEqual(rule.status, 'Not checked', `${rule.title} status must be "Not checked"`);
    }
    console.log('✓ Test 3 Passed: Company name only produces "Not enough data" and all Golden Rules neutral.\n');
  }

  // Test 4: Symmetrical scoring: Two different made-up companies get identical scores
  console.log('Running Test 4: Symmetrical scoring: Two made-up companies with identical evidence...');
  {
    const inputA = `From: hr@gmail.com
Subject: Interview at Alpha Delta Technologies Pvt Ltd
Dear Candidate,
Join WhatsApp: https://chat.whatsapp.com/test123`;

    const inputB = `From: hr@gmail.com
Subject: Interview at Beta Gamma Solutions Pvt Ltd
Dear Candidate,
Join WhatsApp: https://chat.whatsapp.com/test123`;

    const extA = extractEntitiesFromInput(inputA, 'text');
    const resA = await runComprehensiveAudit(extA);

    const extB = extractEntitiesFromInput(inputB, 'text');
    const resB = await runComprehensiveAudit(extB);

    console.log('  Company A Score:', resA.trustScore, 'Risk:', resA.riskLevel, 'Coverage:', resA.coverageRatio);
    console.log('  Company B Score:', resB.trustScore, 'Risk:', resB.riskLevel, 'Coverage:', resB.coverageRatio);

    assert.strictEqual(resA.trustScore, resB.trustScore, 'Both companies must get identical trust scores');
    assert.strictEqual(resA.riskLevel, resB.riskLevel, 'Both companies must get identical risk levels');
    assert.strictEqual(resA.howCalculated.performedCount, resB.howCalculated.performedCount, 'Identical check coverage');
    assert.strictEqual(resA.howCalculated.pointsEarned, resB.howCalculated.pointsEarned, 'Identical points earned');
    console.log('✓ Test 4 Passed: Analysis engine is 100% generic and symmetrical.\n');
  }

  // Test 5: Message claiming an organisation from an unrelated domain -> mismatch flag and cap <= 35
  console.log('Running Test 5: Domain Mismatch Spoofing (Claims Example Enterprise Pvt Ltd from unrelated domain)...');
  {
    const input = `From: hr-recruiter@unrelated-portal-services.com
Subject: Appointment Letter from Example Enterprise Pvt Ltd
Dear Applicant,
We are pleased to offer you the role at Example Enterprise Pvt Ltd.
Please review your appointment letter.
Regards,
Team at Example Enterprise Pvt Ltd`;

    const extracted = extractEntitiesFromInput(input, 'text');
    const result = await runComprehensiveAudit(extracted);

    console.log('  Domain Mismatch detected:', result.digitalIdentity.isDomainMismatch);
    console.log('  Spoofed Target:', result.digitalIdentity.spoofedTarget);
    console.log('  Trust Score:', result.trustScore);
    console.log('  Risk Level:', result.riskLevel);

    assert.strictEqual(result.digitalIdentity.isDomainMismatch, true, 'Must detect domain mismatch');
    assert.strictEqual(result.digitalIdentity.spoofedTarget, 'Example Enterprise Pvt Ltd');
    assert(result.trustScore !== null && result.trustScore <= 35, 'Trust score must be capped <= 35 for domain mismatch');
    assert(result.riskLevel === 'Critical' || result.riskLevel === 'High', 'Risk level must be High or Critical');
    console.log('✓ Test 5 Passed: Domain mismatch correctly identified and capped <= 35.\n');
  }

  // Test 6: All 8 checks passed -> score up to 100, "Complete (8 of 8 checks)"
  console.log('Running Test 6: All 8 checks evaluated and passed (100% Complete)...');
  {
    const input = `From: careers@examplecorp.com
Subject: Formal Employment Offer - Senior Systems Engineer
Welcome to Example Corp Pvt Ltd!
We are pleased to offer you the position of Senior Systems Engineer at Example Corp Pvt Ltd.
Annual CTC: Rs 18,00,000 per annum.
Corporate Office Address: 10th Floor, Tower B, Cyber City, Gurugram, Haryana - 122002.
CIN: U72200HR2018PTC123456
Please upload your identity documents (Aadhaar and PAN) via our encrypted candidate portal.
No application fee or security deposit is required for onboarding.
Regards,
Human Resources Team, Example Corp Pvt Ltd`;

    const userProvided = {
      companyAddress: '10th Floor, Tower B, Cyber City, Gurugram, Haryana - 122002',
      claimedEmployeeCount: 250,
      linkedInEmployeeCount: 240,
      linkedInCreatedYear: 2018,
      ambitionBoxRating: 4.4,
      ambitionBoxReviews: 120
    };

    const extracted = extractEntitiesFromInput(input, 'text', userProvided);
    // Simulate verified domain network records
    const result = await runComprehensiveAudit(extracted, userProvided);

    console.log('  Performed checks count:', result.howCalculated.performedCount);
    console.log('  Coverage Ratio:', result.coverageRatio);
    console.log('  Trust Score:', result.trustScore);
    console.log('  Score Label:', result.scoreLabel);
    console.log('  Risk Level:', result.riskLevel);

    assert(result.howCalculated.performedCount >= 7, 'Must perform at least 7-8 checks');
    assert(result.trustScore !== null && result.trustScore >= 75, 'Trust score must be high when all evidence passes');
    assert.strictEqual(result.riskLevel, 'Low', 'Risk level must be Low when all checks pass');
    assert.strictEqual(result.redFlags.length, 0, 'Must have zero red flags');
    console.log('✓ Test 6 Passed: Comprehensive evidence yields high trust score with zero red flags.\n');
  }

  // Test 7: Real Network Lookup (RDAP & DNS on google.com)
  console.log('Running Test 7: Real RDAP & DNS Lookup for "google.com"...');
  {
    const rdap = await lookupRdapDomain('google.com');
    const dns = await lookupDnsAuthRecords('google.com');

    console.log('  RDAP Status:', rdap.status);
    console.log('  RDAP Registration Date:', rdap.registrationDate);
    console.log('  DNS SPF Status:', dns.spfStatus);

    assert.strictEqual(rdap.status, 'verified', 'RDAP lookup on google.com must succeed');
    assert(rdap.registrationDate && rdap.registrationDate.startsWith('1997'), 'Google domain registration date must be in 1997');
    assert(dns.hasSpf, 'google.com must have SPF configured');
    console.log('✓ Test 7 Passed: Real RDAP & DNS lookups succeeded with authentic timestamps.\n');
  }

  // Test 8: Stateless Extraction Verification
  console.log('Running Test 8: Stateless Extraction Verification...');
  {
    const input1 = `From: hr@examplecorp.com\nSubject: Job Offer from Example Corp Pvt Ltd\nDear Candidate...`;
    const extracted1 = extractEntitiesFromInput(input1, 'text');
    assert(extracted1.detectedCompanyName.includes('Example'), 'Must extract Example');

    // Second call with generic text (no company name)
    const input2 = `Congratulations! You have been selected for the position of Systems Engineer.\nMonthly compensation: Rs 65,000.\nRegards,\nRecruitment Team`;
    const extracted2 = extractEntitiesFromInput(input2, 'text');
    console.log('  Second call extracted company:', extracted2.detectedCompanyName);
    
    assert.strictEqual(extracted2.detectedCompanyName, 'Unspecified organisation', 'Must return "Unspecified organisation", never carry over previously extracted company');
    console.log('✓ Test 8 Passed: Extraction is 100% stateless and uses "Unspecified organisation".\n');
  }

  // Test 9: Optional User-Provided Details Processing
  console.log('Running Test 9: Optional User-Provided Details Processing...');
  {
    const input = `Subject: Senior Engineer Role at Example Tech\nDear Candidate...`;
    const userProvided = {
      companyAddress: 'Building 4, Cyber City, Gurugram, Haryana',
      claimedEmployeeCount: 500,
      linkedInEmployeeCount: 4,
      linkedInCreatedYear: 2026,
      ambitionBoxRating: 4.2,
      financials: [
        { year: '2020', revenue: 10, profit: 2 },
        { year: '2024', revenue: 50, profit: 8 }
      ]
    };

    const extracted = extractEntitiesFromInput(input, 'text', userProvided);
    const result = await runComprehensiveAudit(extracted, userProvided);

    console.log('  Physical Address:', result.physical.officeAddress);
    console.log('  Physical Source:', result.physical.source);
    console.log('  LinkedIn Claimed Count:', result.linkedin.claimedEmployeeCount);
    console.log('  Financial Growth Summary:', result.stocks.growthSummary);

    assert.strictEqual(result.physical.officeAddress, 'Building 4, Cyber City, Gurugram, Haryana');
    assert(result.physical.source.includes('user-provided'), 'Address source must indicate user-provided');
    assert(result.redFlags.some(r => r.rule.includes('Headcount Discrepancy')), 'Must generate headcount discrepancy flag');
    assert.strictEqual(result.stocks.status, 'user_provided');
    assert(result.stocks.growthSummary.includes('400%'), 'Must compute 400% revenue growth summary');
    console.log('✓ Test 9 Passed: User-provided details correctly incorporated and labeled.\n');
  }

  // Test 10: Physical Office Building Check by Company Name
  console.log('Running Test 10: Physical Office Building Check (Registered office vs virtual-only entity)...');
  {
    // A. Unregistered entity with no physical building
    const inputVirtual = `From: hr@virtual-unknown-corp.org\nSubject: Remote Internship Offer\nDear Candidate, Welcome to CodeAlpha.`;
    const extVirtual = extractEntitiesFromInput(inputVirtual, 'text');
    const resVirtual = await runComprehensiveAudit(extVirtual);

    console.log('  Virtual Company physical status:', resVirtual.physical.status);
    console.log('  Virtual Company message:', resVirtual.physical.message);
    assert.strictEqual(resVirtual.physical.status, 'no_building_found', 'Unknown/virtual company must return no_building_found status');
    assert(resVirtual.physical.message.includes('does not have a registered commercial office building'), 'Message must declare company does not have registered building');

    // B. Real company with registered premises
    const inputReal = `From: hr@tcs.com\nSubject: Employment Letter\nDear Candidate, Welcome to Tata Consultancy Services.`;
    const extReal = extractEntitiesFromInput(inputReal, 'text');
    const resReal = await runComprehensiveAudit(extReal);

    console.log('  Real Company physical status:', resReal.physical.status);
    console.log('  Real Company address:', resReal.physical.officeAddress);
    assert.strictEqual(resReal.physical.status, 'found_online', 'Company with registered commercial premises must return found_online');
    assert(resReal.physical.officeAddress && resReal.physical.officeAddress.length > 5, 'Must provide verified street/office address');
    console.log('✓ Test 10 Passed: Physical office building lookup accurately distinguishes registered premises from virtual entities.\n');
  }

  // Test 11: MCA Portal Registration Check by Company Name
  console.log('Running Test 11: MCA Portal Registration Check (Registered corporate entity vs unlisted/unregistered)...');
  {
    // A. Unregistered entity on MCA
    const inputUnreg = `From: careers@codealpha.co\nSubject: Selection Letter\nDear Candidate, You are selected at CodeAlpha.`;
    const extUnreg = extractEntitiesFromInput(inputUnreg, 'text');
    const resUnreg = await runComprehensiveAudit(extUnreg);

    console.log('  Unregistered MCA status:', resUnreg.government.status);
    console.log('  Unregistered isRegistered:', resUnreg.government.isRegistered);
    assert.strictEqual(resUnreg.government.status, 'not_registered', 'Entity not found on MCA must return not_registered');
    assert.strictEqual(resUnreg.government.isRegistered, false, 'isRegistered must be false');
    assert(resUnreg.government.message.includes('No Ministry of Corporate Affairs (MCA) registration'), 'Message must indicate no MCA registration found');

    // B. Registered corporate entity
    const inputReg = `From: hr@infosys.com\nSubject: Appointment Offer\nDear Candidate, Welcome to Infosys.`;
    const extReg = extractEntitiesFromInput(inputReg, 'text');
    const resReg = await runComprehensiveAudit(extReg);

    console.log('  Registered MCA status:', resReg.government.status);
    console.log('  Registered isRegistered:', resReg.government.isRegistered);
    console.log('  Registered Entity Name:', resReg.government.companyName);
    assert.strictEqual(resReg.government.status, 'registered', 'Registered corporate entity must return registered status');
    assert.strictEqual(resReg.government.isRegistered, true, 'isRegistered must be true');
    console.log('✓ Test 11 Passed: MCA corporate registration lookup correctly verifies registered entities and flags unregistered operations.\n');
  }

  // Test 12: Stock Market Value vs Unlisted Warning
  console.log('Running Test 12: Stock Market Value vs Unlisted Warning...');
  {
    // A. Unlisted entity
    const inputUnlisted = `From: hr@unknown-startup.io\nSubject: Offer\nDear Candidate, Welcome to CodeAlpha.`;
    const extUnlisted = extractEntitiesFromInput(inputUnlisted, 'text');
    const resUnlisted = await runComprehensiveAudit(extUnlisted);

    console.log('  Unlisted stock status:', resUnlisted.stocks.status);
    console.log('  Unlisted isPublic:', resUnlisted.stocks.isPublic);
    assert.strictEqual(resUnlisted.stocks.status, 'unlisted_warning', 'Unlisted company must return unlisted_warning');
    assert.strictEqual(resUnlisted.stocks.isPublic, false, 'isPublic must be false for unlisted company');
    assert(resUnlisted.stocks.message.includes('Warning: Unlisted'), 'Must include warning message in stocks result');

    // B. Listed public company
    const inputListed = `From: careers@tcs.com\nSubject: Systems Engineer Offer\nDear Candidate, Congratulations on joining Tata Consultancy Services.`;
    const extListed = extractEntitiesFromInput(inputListed, 'text');
    const resListed = await runComprehensiveAudit(extListed);

    console.log('  Listed stock status:', resListed.stocks.status);
    console.log('  Listed ticker:', resListed.stocks.ticker);
    console.log('  Listed price:', resListed.stocks.currentPrice);
    assert.strictEqual(resListed.stocks.isPublic, true, 'Publicly traded security must return isPublic = true');
    console.log('✓ Test 12 Passed: Publicly traded securities provide live market quotes; unlisted firms return warning status.\n');
  }

  // Test 13: Quora Discussions Integration
  console.log('Running Test 13: Quora Discussions Integration...');
  {
    const quoraData = await getQuoraDiscussions('CodeAlpha');
    console.log('  Quora status:', quoraData.status);
    console.log('  Quora search URL:', quoraData.searchUrl);
    console.log('  Quora discussions count:', quoraData.discussions.length);

    assert.strictEqual(quoraData.status, 'verified', 'Quora service must return verified status');
    assert(quoraData.searchUrl.includes('quora.com/search'), 'Search URL must point to Quora search');
    assert(quoraData.discussions.length >= 4, 'Must generate targeted fraud and legitimacy questions');
    assert(quoraData.discussions.some(d => d.question.includes('fake or legitimate')), 'Must include fake or legitimate audit question');
    assert(quoraData.discussions.some(d => d.question.includes('money')), 'Must include advance fee inquiry');
    console.log('✓ Test 13 Passed: Quora discussions service returns targeted questions with direct deep links.\n');
  }

  // Test 14: Anti-Date Extraction Guard & Unlisted Startup Scoring
  console.log('Running Test 14: Date Rejection & Non-Arbitrary Startup Scoring...');
  {
    const sampleOffer = `INTERNSHIP OFFER LETTER
We would like to congratulate you on being selected for the "Java Programming" virtual internship position with "CodSoft". We at CodSoft are excited that you will join our team.
The duration of the internship will be of 4 weeks, starting from 01 November 2025 to 30 November 2025.
www.codsoft.in
contact@codsoft.in`;

    const ext = extractEntitiesFromInput(sampleOffer, 'text');
    console.log('  Extracted Company:', ext.detectedCompanyName);
    console.log('  Extracted Domain:', ext.detectedDomain);
    console.log('  Extracted Email:', ext.detectedEmail);

    assert.notStrictEqual(ext.detectedCompanyName, '01 November 2025 to 30 November', 'Date range must never be extracted as company name');
    assert.strictEqual(ext.detectedCompanyName.toLowerCase(), 'codsoft', 'Must extract Codsoft as company name');
    assert.strictEqual(ext.detectedDomain, 'codsoft.in', 'Must extract codsoft.in as corporate domain');

    const res = await runComprehensiveAudit(ext);
    console.log('  Startup Trust Score:', res.trustScore);
    console.log('  Startup Risk Level:', res.riskLevel);
    console.log('  Coverage Ratio:', res.coverageRatio);

    assert(res.trustScore >= 60, 'Unlisted company with clean domain & 0 fee demand must not be artificially capped at 35');
    assert.strictEqual(res.riskLevel, 'Medium', 'Unregistered entity without criminal indicators must be Medium risk, not High/Critical');
    console.log('✓ Test 14 Passed: Dates are strictly rejected and unlisted entities receive fair, evidence-based scores.\n');
  }

  console.log('========================================');
  console.log('ALL PHASE 1 & PHASE 2 TESTS COMPLETED SUCCESSFULLY (14/14 PASSED)');
  console.log('========================================');
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
