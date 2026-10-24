import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { InputPortal } from './components/InputPortal';
import { AnalysisLoading } from './components/AnalysisLoading';
import { DashboardHeader } from './components/DashboardHeader';
import { GoldenRulesCard } from './components/GoldenRulesCard';
import { OfferLetterAuditSection } from './components/OfferLetterAuditSection';
import { LinkedInSection } from './components/LinkedInSection';
import { StockFinanceSection } from './components/StockFinanceSection';
import { GovernmentSection } from './components/GovernmentSection';
import { DigitalIdentitySection } from './components/DigitalIdentitySection';
import { PhysicalFootprintSection } from './components/PhysicalFootprintSection';
import { RedditSentimentSection } from './components/RedditSentimentSection';
import { AuthModal } from './components/AuthModal';
import { BENCHMARK_PRESETS } from '../server/data/presets.js';

export default function App() {
  const [page, setPage] = useState('input'); // 'input' | 'loading' | 'dashboard'
  const [analysisData, setAnalysisData] = useState(null);
  const [presets, setPresets] = useState([]);
  const [pendingResult, setPendingResult] = useState(null);

  // Authentication & 5 Free Searches Limit State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('verifirm_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [searchCount, setSearchCount] = useState(() => {
    try {
      const count = localStorage.getItem('verifirm_search_count');
      return count ? parseInt(count, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    // Fetch presets from API or use local benchmarks
    fetch('/api/presets')
      .then(res => res.json())
      .then(data => setPresets(data))
      .catch(() => {
        setPresets(BENCHMARK_PRESETS);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('verifirm_user');
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setIsLimitReached(false);
    setIsAuthModalOpen(false);
  };

  const handleOpenAuth = () => {
    setIsLimitReached(false);
    setIsAuthModalOpen(true);
  };

  // Handle Preset Selection
  const handlePresetSelect = (presetId) => {
    // Check compulsory limit for unauthenticated users
    if (!currentUser && searchCount >= 5) {
      setIsLimitReached(true);
      setIsAuthModalOpen(true);
      return;
    }

    if (!currentUser) {
      const nextCount = searchCount + 1;
      setSearchCount(nextCount);
      localStorage.setItem('verifirm_search_count', nextCount.toString());
    }

    setPage('loading');
    
    // Try fetching from server, fallback to local preset
    fetch(`/api/presets/${presetId}`)
      .then(res => res.json())
      .then(data => {
        setPendingResult(data);
      })
      .catch(() => {
        const found = BENCHMARK_PRESETS.find(p => p.id === presetId);
        setPendingResult(found || BENCHMARK_PRESETS[0]);
      });
  };

  // Handle Custom Input Analysis
  const handleAnalyze = async (payload) => {
    // Check compulsory limit for unauthenticated users
    if (!currentUser && searchCount >= 5) {
      setIsLimitReached(true);
      setIsAuthModalOpen(true);
      return;
    }

    if (!currentUser) {
      const nextCount = searchCount + 1;
      setSearchCount(nextCount);
      localStorage.setItem('verifirm_search_count', nextCount.toString());
    }

    setPage('loading');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        setPendingResult(data);
      } else {
        throw new Error('API analysis failed');
      }
    } catch (err) {
      console.error('API analysis error:', err);
      setPendingResult({
        companyName: payload.content ? payload.content.slice(0, 50).trim() : 'Unspecified Organization',
        trustScore: 40,
        verdict: 'UNVERIFIED – insufficient evidence',
        summaryVerdict: 'Analysis server communication failed or is offline. Please ensure the backend server is running.',
        coverage: {
          performedChecks: 0,
          totalChecks: 8,
          ratio: '0 of 8 checks performed'
        },
        goldenRules: [
          { id: 'payment', title: 'Zero Mandatory Upfront Fee Demand', status: 'Unchecked', passed: null, details: 'Offline fallback mode.' },
          { id: 'email_domain', title: 'Cryptographic Domain Alignment', status: 'Unchecked', passed: null, details: 'Offline fallback mode.' },
          { id: 'offer_validity', title: 'Legitimate Offer Letter Validation', status: 'Unchecked', passed: null, details: 'Offline fallback mode.' },
          { id: 'interview_process', title: 'Formal Multi-Round Interview Validation', status: 'Unchecked', passed: null, details: 'Offline fallback mode.' },
          { id: 'equipment_scam', title: 'No Counterfeit Cheque or Device Takeover', status: 'Unchecked', passed: null, details: 'Offline fallback mode.' }
        ],
        redFlags: ['Backend verification server was unreachable.'],
        greenFlags: [],
        digitalIdentity: {
          domain: 'N/A',
          claimedEmail: 'Not checked',
          isFreeEmail: false,
          isTyposquatted: false,
          domainAge: 'Not checked',
          whoisRegistrar: 'Not checked',
          sslStatus: 'Not checked',
          spoofingCheck: 'Connection error - could not query RDAP/DNS.',
          websiteSanity: 'No network check completed.'
        },
        government: {
          status: 'not_checked',
          cin: null,
          cinValid: false,
          officialPortalUrl: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do',
          officialGstUrl: 'https://services.gst.gov.in/services/searchtp',
          message: 'Server unreachable.'
        },
        linkedin: {
          status: 'not_checked',
          searchUrl: 'https://www.linkedin.com/search/results/companies/',
          message: 'Server unreachable.'
        },
        stocks: {
          status: 'not_checked',
          isPublic: false,
          ticker: null,
          message: 'Server unreachable.'
        },
        physical: {
          status: 'not_checked',
          officeAddress: null
        },
        redditAndReviews: {
          status: 'not_checked',
          redditPosts: [],
          searchUrl: 'https://www.reddit.com',
          message: 'Server unreachable.'
        },
        offerLetterQuality: null
      });
    }
  };

  // When loading animation completes
  const handleLoadingComplete = () => {
    if (pendingResult) {
      setAnalysisData(pendingResult);
      setPage('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setPage('input');
    setAnalysisData(null);
    setPendingResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col font-sans bg-grid-pattern">
      <Navbar 
        onReset={handleReset} 
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        searchCount={searchCount}
      />

      <main className="flex-1 pb-16">
        {/* State 1: Input Portal */}
        {page === 'input' && (
          <InputPortal
            onAnalyze={handleAnalyze}
            onPresetSelect={handlePresetSelect}
            presets={presets}
            isLoading={false}
            currentUser={currentUser}
            searchCount={searchCount}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* State 2: High-Tech Security Scanning Animation */}
        {page === 'loading' && (
          <AnalysisLoading onComplete={handleLoadingComplete} />
        )}

        {/* State 3: Comprehensive Verification Dashboard */}
        {page === 'dashboard' && analysisData && (
          <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
            {/* 1. Header with Trust Score Dial & Verdict */}
            <DashboardHeader
              data={analysisData}
              onReset={handleReset}
            />

            {/* 2. The 5 Golden Rules & Red/Green Flags */}
            <GoldenRulesCard
              goldenRules={analysisData.goldenRules}
              redFlags={analysisData.redFlags}
              greenFlags={analysisData.greenFlags}
            />

            {/* 3. Offer Letter Quality & Forensic Audit */}
            {analysisData.offerLetterQuality && (
              <OfferLetterAuditSection
                offerLetterQuality={analysisData.offerLetterQuality}
              />
            )}

            {/* 4. LinkedIn Forensics (Headcount, Profile Quality, Turnover) */}
            <LinkedInSection
              linkedin={analysisData.linkedin}
            />

            {/* 4. Financial & Stock Markets (Chart & Growth/Loss Breakdown) */}
            <StockFinanceSection
              stocks={analysisData.stocks}
            />

            {/* 5. Government & Corporate Registries (MCA CIN, GSTIN, PAN, SEC) */}
            <GovernmentSection
              government={analysisData.government}
            />

            {/* 6. Digital Identity & WHOIS Forensics (Domain Age, Spoofing, SSL) */}
            <DigitalIdentitySection
              digitalIdentity={analysisData.digitalIdentity}
            />

            {/* 7. Physical Footprint (Address, Commercial vs Residential, PBX Landline) */}
            <PhysicalFootprintSection
              physical={analysisData.physical}
            />

            {/* 8. Reddit Discussions & Review Fraud Analysis */}
            <RedditSentimentSection
              redditAndReviews={analysisData.redditAndReviews}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#04070d] py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <p>VeriFirm Evidence-Based Corporate & Scam Intelligence • Public Interest Scam Prevention</p>
        <p className="mt-1 text-[11px] text-slate-600">Checks performed using input text analysis, RDAP, DNS & TLS network verification. Official registry links provided for manual verification.</p>
      </footer>

      {/* User Login & Registration Modal (Compulsory after 5 searches) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        limitReached={isLimitReached}
      />
    </div>
  );
}
