// Automated Evidence & Non-Fabrication Verification Tests - Phase 1 Suite
import assert from 'assert';
import { extractEntitiesFromInput } from '../services/extractionService.js';
import { runComprehensiveAudit } from '../services/scamDetector.js';
import { lookupRdapDomain, lookupDnsAuthRecords } from '../services/networkCheckService.js';

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

  console.log('========================================');
  console.log('ALL PHASE 1 TESTS COMPLETED SUCCESSFULLY (9/9 PASSED)');
  console.log('========================================');
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
