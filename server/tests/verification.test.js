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
    console.log('  LinkedIn Status:', result.linkedin.status);
    console.log('  Reddit Status:', result.redditAndReviews.status);
    console.log('  Physical Office Address:', result.physical.officeAddress);
    console.log('  Offer Letter Quality:', result.offerLetterQuality);

    assert.strictEqual(result.companyName, 'Zorblax Technologies Pvt Ltd', 'Company name must match user input');
    assert.strictEqual(result.verdict, 'UNVERIFIED – insufficient evidence', 'Verdict must be UNVERIFIED when evidence is insufficient');
    assert.strictEqual(result.linkedin.status, 'not_checked', 'LinkedIn must be not_checked');
    assert.strictEqual(result.linkedin.employeeCount, null, 'Employee count must be null (never fabricated)');
    assert.strictEqual(result.linkedin.profileAudit.length, 0, 'Profile audit must be empty');
    assert.strictEqual(result.physical.officeAddress, null, 'Address must be null when not provided');
    assert.strictEqual(result.physical.mapUrl, null, 'Map URL must be null when not provided');
    assert.strictEqual(result.offerLetterQuality, null, 'Offer letter quality must be null for raw company query');
    console.log('✓ Test 1 Passed: Zorblax is UNVERIFIED with zero fabricated LinkedIn/Reddit/map data.\n');
  }

  // Test 2: Fee-Demand Scam Email
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
    assert(result.trustScore < 30, 'Trust score must be severely penalized');
    const feeFlag = result.redFlags.find(r => r.rule.includes('Upfront Fee Demanded'));
    assert(feeFlag, 'Must generate upfront fee demanded red flag');
    console.log('✓ Test 2 Passed: Fee-demand email correctly flagged as CRITICAL RISK.\n');
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
    console.log('✓ Test 3 Passed: Domain mismatch correctly identified and flagged.\n');
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

  console.log('========================================');
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY (4/4 PASSED)');
  console.log('========================================');
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
