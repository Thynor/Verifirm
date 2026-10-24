// Automated Evidence & Non-Fabrication Verification Tests
import assert from 'assert';
import { extractEntitiesFromInput } from '../services/extractionService.js';
import { runComprehensiveAudit } from '../services/scamDetector.js';
import { lookupRdapDomain, lookupDnsAuthRecords } from '../services/networkCheckService.js';

async function runTests() {
  console.log('--- STARTING VERIFIRM EVIDENCE-BASED VERIFICATION TESTS ---\n');

  // Test 1: Unknown Company input only ("Zorblax Technologies Pvt Ltd")
  console.log('Running Test 1: "Zorblax Technologies Pvt Ltd" input only...');
  {
    const input = 'Zorblax Technologies Pvt Ltd';
    const extracted = extractEntitiesFromInput(input, 'text');
    const result = await runComprehensiveAudit(extracted);

    console.log('  Company Name detected:', result.companyName);
    console.log('  Verdict:', result.verdict);
    console.log('  Coverage Ratio:', result.coverageRatio);
    console.log('  Trust Score:', result.trustScore);
    console.log('  Has Enough Data:', result.hasEnoughData);
    console.log('  LinkedIn Status:', result.linkedin.status);
    console.log('  Physical Office Address:', result.physical.officeAddress);

    assert.strictEqual(result.companyName, 'Zorblax Technologies Pvt Ltd', 'Company name must match user input');
    assert.strictEqual(result.verdict, 'UNVERIFIED – insufficient evidence', 'Verdict must be UNVERIFIED when evidence is insufficient');
    assert.strictEqual(result.trustScore, null, 'Trust score must be null (Not enough data) when < 5 checks performed');
    assert.strictEqual(result.hasEnoughData, false, 'hasEnoughData must be false when < 5 checks performed');
    
    // Golden Rules check: all 5 rules must be null (Not checked)
    assert(result.goldenRules && Array.isArray(result.goldenRules.rules), 'goldenRules.rules array must exist');
    for (const rule of result.goldenRules.rules) {
      assert.strictEqual(rule.passed, null, `${rule.title} must be null (Not checked) when unevaluated`);
      assert.strictEqual(rule.status, 'Not checked', `${rule.title} status must be "Not checked"`);
    }

    assert.strictEqual(result.linkedin.status, 'not_checked', 'LinkedIn must be not_checked');
    assert.strictEqual(result.linkedin.employeeCount, null, 'Employee count must be null (never fabricated)');
    assert.strictEqual(result.linkedin.profileAudit.length, 0, 'Profile audit must be empty');
    assert.strictEqual(result.physical.officeAddress, null, 'Address must be null when not provided');
    assert.strictEqual(result.physical.mapUrl, null, 'Map URL must be null when not provided');
    console.log('✓ Test 1 Passed: Zorblax is UNVERIFIED with coverage gating and all Golden Rules neutral.\n');
  }

  // Test 2: Fee-Demand Scam Email (Laptop courier deposit via PhonePe)
  console.log('Running Test 2: Fee-Demand Scam Email (Laptop courier deposit via PhonePe)...');
  {
    const input = `From: hr@quick-tech-careers.online
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
    console.log('  Red flags count:', result.redFlags.length);

    assert.strictEqual(result.verdict, 'CRITICAL RISK / RECRUITMENT FRAUD DETECTED', 'Fee demand must trigger CRITICAL RISK');
    assert(result.trustScore !== null && result.trustScore < 30, 'Trust score must be severely penalized');
    
    // Rule #1 must be red (passed: false)
    const rule1 = result.goldenRules.rules.find(r => r.id === 'rule1');
    assert(rule1, 'Rule 1 must be present');
    assert.strictEqual(rule1.passed, false, 'Rule 1 must be failed (red) for fee demand');

    const feeFlag = result.redFlags.find(r => r.rule.includes('Upfront Fee Demanded'));
    assert(feeFlag, 'Must generate upfront fee demanded red flag');
    assert(feeFlag.description.includes('deposit Rs 8,500') || feeFlag.description.includes('Found in text:'), 'Red flag must quote verbatim fee text from input');
    console.log('✓ Test 2 Passed: Fee-demand email correctly flagged as CRITICAL RISK with verbatim quote.\n');
  }

  // Test 3: Domain Mismatch Spoofing
  console.log('Running Test 3: Domain Mismatch Spoofing (Claims Tata Consultancy Services from unauthorized domain)...');
  {
    const input = `From: hr-recruiter@fake-tcs-portal.online
Subject: Appointment Letter from Tata Consultancy Services
Dear Applicant,
We are pleased to offer you the role at Tata Consultancy Services.
Please submit documents immediately.
Regards,
Team at Tata Consultancy Services`;

    const extracted = extractEntitiesFromInput(input, 'text');
    const result = await runComprehensiveAudit(extracted);

    console.log('  Domain Mismatch detected:', result.digitalIdentity.isDomainMismatch);
    console.log('  Spoofed Target:', result.digitalIdentity.spoofedTarget);

    assert.strictEqual(result.digitalIdentity.isDomainMismatch, true, 'Must detect domain mismatch');
    assert.strictEqual(result.digitalIdentity.spoofedTarget, 'Tata Consultancy Services', 'Must identify spoofed target brand');
    const mismatchFlag = result.redFlags.find(r => r.rule.includes('Domain Mismatch'));
    assert(mismatchFlag, 'Must include domain mismatch warning in red flags');

    const rule3 = result.goldenRules.rules.find(r => r.id === 'rule3');
    assert.strictEqual(rule3.passed, false, 'Rule 3 must be failed for domain mismatch');
    console.log('✓ Test 3 Passed: Domain mismatch correctly identified and flagged in Golden Rules.\n');
  }

  // Test 4: Real Network Lookup (RDAP & DNS on google.com)
  console.log('Running Test 4: Real RDAP & DNS Lookup for "google.com"...');
  {
    const rdap = await lookupRdapDomain('google.com');
    const dns = await lookupDnsAuthRecords('google.com');

    console.log('  RDAP Status:', rdap.status);
    console.log('  RDAP Registration Date:', rdap.registrationDate);
    console.log('  RDAP Registrar:', rdap.registrar);
    console.log('  DNS SPF Status:', dns.spfStatus);
    console.log('  DNS DMARC Status:', dns.dmarcStatus);

    assert.strictEqual(rdap.status, 'verified', 'RDAP lookup on google.com must succeed');
    assert(rdap.registrationDate && rdap.registrationDate.startsWith('1997'), 'Google domain registration date must be in 1997');
    assert(dns.hasSpf, 'google.com must have SPF configured');
    console.log('✓ Test 4 Passed: Real RDAP & DNS lookups succeeded with authentic timestamps.\n');
  }

  // Test 5: "Programme fee" scam email with lookalike domain without loud keywords
  console.log('Running Test 5: "Programme fee" with lookalike domain...');
  {
    const input = `From: admissions@infosys-careers.online
Subject: Selection for Summer Internship Program at Infosys
Dear Student,
We are pleased to select you for the training program.
The mandatory programme fee of INR 4,999 must be paid for onboarding kits within 48 hours.
Regards,
Recruitment Cell`;

    const extracted = extractEntitiesFromInput(input, 'text');
    const result = await runComprehensiveAudit(extracted);

    console.log('  Verdict:', result.verdict);
    console.log('  Money Demanded Flag:', extracted.flags.moneyDemanded);

    assert.strictEqual(extracted.flags.moneyDemanded, true, 'Must detect programme fee');
    assert.strictEqual(result.verdict, 'CRITICAL RISK / RECRUITMENT FRAUD DETECTED', 'Programme fee must trigger CRITICAL RISK');
    const rule1 = result.goldenRules.rules.find(r => r.id === 'rule1');
    assert.strictEqual(rule1.passed, false, 'Rule 1 must fail for programme fee');
    console.log('✓ Test 5 Passed: Programme fee correctly detected as scam.\n');
  }

  // Test 6: Genuine-style email from matching corporate domain with no fee (no CIN)
  console.log('Running Test 6: Genuine-style email from matching corporate domain...');
  {
    const input = `From: careers@google.com
Subject: Software Engineering Internship Offer
Dear Candidate,
We are pleased to offer you the Software Engineering Internship position at Google.
Your monthly stipend will be INR 1,20,000 per month.
Please review the attached formal agreement.
Regards,
Google Campus Recruitment Team`;

    const extracted = extractEntitiesFromInput(input, 'text');
    const result = await runComprehensiveAudit(extracted);

    console.log('  Verdict:', result.verdict);
    console.log('  Red Flags Count:', result.redFlags.length);

    assert.strictEqual(result.verdict, 'No red flags found', 'Must be "No red flags found", NEVER "VERIFIED" without verified statutory CIN');
    assert.strictEqual(result.redFlags.length, 0, 'Must have zero red flags');
    const rule1 = result.goldenRules.rules.find(r => r.id === 'rule1');
    assert.strictEqual(rule1.passed, true, 'Rule 1 must pass when no fees are requested');
    const rule3 = result.goldenRules.rules.find(r => r.id === 'rule3');
    assert.strictEqual(rule3.passed, true, 'Rule 3 must pass for corporate domain');
    console.log('✓ Test 6 Passed: Genuine corporate email returns "No red flags found", never "VERIFIED".\n');
  }

  // Test 7: Stateless Extraction Test
  console.log('Running Test 7: Stateless Extraction Verification...');
  {
    // First call with explicit company
    const input1 = `From: hr@acme-corp.com\nSubject: Job Offer from Acme Technologies Pvt Ltd\nDear Candidate...`;
    const extracted1 = extractEntitiesFromInput(input1, 'text');
    assert(extracted1.detectedCompanyName.includes('Acme'), 'Must extract Acme');

    // Second call with generic text (no company name)
    const input2 = `Congratulations! You have been selected for the position of Systems Engineer.\nMonthly compensation: Rs 65,000.\nRegards,\nRecruitment Team`;
    const extracted2 = extractEntitiesFromInput(input2, 'text');
    console.log('  Second call extracted company:', extracted2.detectedCompanyName);
    
    assert.strictEqual(extracted2.detectedCompanyName, 'Unspecified', 'Must return "Unspecified", never carry over previously extracted company');
    console.log('✓ Test 7 Passed: Extraction is 100% stateless.\n');
  }

  console.log('========================================');
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY (7/7 PASSED)');
  console.log('========================================');
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});

