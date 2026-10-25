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
import { translations } from './utils/translations.js';
import { 
  ChevronDown, ChevronUp, HelpCircle, ExternalLink,
  Printer, Copy, Check, ShieldAlert
} from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('input'); // 'input' | 'loading' | 'dashboard'
  const [analysisData, setAnalysisData] = useState(null);
  const [presets, setPresets] = useState([]);
  const [pendingResult, setPendingResult] = useState(null);

  // Theme State ('light' default, toggled via Navbar)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('verifirm_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  // Language State ('en' default, toggled via Navbar)
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('verifirm_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const t = translations[lang] || translations.en;

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    goldenRules: true,
    domain: true,
    government: true,
    physical: true,
    linkedin: true,
    stocks: true,
    reddit: true,
    offerLetter: true,
    unrun: false // Collapsed by default
  });

  const [copiedBottom, setCopiedBottom] = useState(false);

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Sync theme with document.documentElement
  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('verifirm_theme', theme);
    } catch (e) {
      console.error('Error applying theme:', e);
    }
  }, [theme]);

  // Sync language with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('verifirm_lang', lang);
    } catch (e) {
      console.error('Error saving language:', e);
    }
  }, [lang]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleLang = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

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
    
    fetch(`/api/presets/${presetId}`)
      .then(res => res.json())
      .then(data => {
        setAnalysisData(data);
        setPage('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => {
        const found = BENCHMARK_PRESETS.find(p => p.id === presetId);
        setAnalysisData(found || BENCHMARK_PRESETS[0]);
        setPage('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  };

  // Handle Custom Input Analysis
  const handleAnalyze = async (payload) => {
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
        setAnalysisData(data);
        setPage('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('API analysis failed');
      }
    } catch (err) {
      console.error('API analysis error:', err);
      const fallbackResult = {
        companyName: payload.content ? payload.content.slice(0, 50).trim() : 'Unspecified',
        trustScore: null,
        hasEnoughData: false,
        verdict: 'UNVERIFIED – insufficient evidence',
        summaryVerdict: 'Analysis server communication failed or is offline. Please ensure the backend server is running.',
        coverageRatio: '0 of 8 checks performed',
        checksAudit: [],
        topReasons: [
          { rule: 'Connection Offline', severity: 'HIGH', description: 'Could not connect to the local VeriFirm backend service.' }
        ],
        adviceList: [
          'Ensure the backend server is running on port 3001.',
          'Verify your network connection and try submitting the offer again.'
        ],
        goldenRules: {
          rules: [
            { id: 'rule1', title: 'Rule #1: They NEVER Ask for Money', subtitle: 'Laptop deposits, training fees, courier charges, registration deposits', passed: null, status: 'Not checked', details: 'Offline fallback mode.' },
            { id: 'rule2', title: 'Rule #2: Secure Document Handling', subtitle: 'Never ask for Aadhaar, PAN, or Bank passbook over WhatsApp/Telegram', passed: null, status: 'Not checked', details: 'Offline fallback mode.' },
            { id: 'rule3', title: 'Rule #3: Official Corporate Email Domain', subtitle: 'Authorized entities communicate from @company.com, never free consumer accounts', passed: null, status: 'Not checked', details: 'Offline fallback mode.' },
            { id: 'rule4', title: 'Rule #4: Standard Recruitment Timeline', subtitle: 'No artificial psychological pressure (e.g., "Pay within 2 hours or offer rescinded")', passed: null, status: 'Not checked', details: 'Offline fallback mode.' },
            { id: 'rule5', title: 'Rule #5: Realistic Compensation Package', subtitle: 'Salary aligns with market rates for the specific role without bait-and-switch tactics', passed: null, status: 'Not checked', details: 'Offline fallback mode.' }
          ]
        },
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
        offerLetterQuality: null,
        legalDisclaimer: 'Disclaimer: VeriFirm assessment results are evidence-based risk indicators and do not constitute legal proof or corporate certification.'
      };
      setAnalysisData(fallbackResult);
      setPage('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  const handleCopyReportBottom = () => {
    if (!analysisData) return;
    const summary = [
      `VeriFirm Job Verification Report: ${analysisData.companyName}`,
      `Risk Level: ${analysisData.riskLevel || 'Low'}`,
      `Verdict: ${analysisData.verdict}`,
      analysisData.trustScore !== null ? `Trust Score: ${analysisData.trustScore}/100 (${analysisData.scoreLabel || 'Provisional'})` : 'Trust Score: Not enough data',
      `Coverage: ${analysisData.coverageRatio || 'N/A'}`,
      '',
      'Top Reasons:',
      ...(analysisData.topReasons || []).map(r => `• [${r.severity}] ${r.rule}: ${r.description}`),
      '',
      'Actionable Advice:',
      ...(analysisData.adviceList || []).map(a => `• ${a}`),
      '',
      'Disclaimer: This score is a guide, not a probability or legal proof.'
    ].join('\n');

    navigator.clipboard.writeText(summary).then(() => {
      setCopiedBottom(true);
      setTimeout(() => setCopiedBottom(false), 2500);
    });
  };

  // Build the list of unrun checks for the single collapsed section
  const getUnrunChecks = () => {
    if (!analysisData) return [];
    if (analysisData.howCalculated?.checks) {
      return analysisData.howCalculated.checks
        .filter(c => !c.performed)
        .map(c => ({
          name: c.name,
          reason: c.description || 'Not provided in communication or input text.',
          tip: c.tip,
          link: c.id === 'mca_gst' 
            ? 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do'
            : c.id === 'domain_age_dns_tls'
              ? 'https://www.whois.com'
              : c.id === 'address_offer_details'
                ? 'https://maps.google.com'
                : c.id === 'online_presence'
                  ? 'https://www.linkedin.com'
                  : null
        }));
    }
    const list = [];
    if (!analysisData.government?.cin) {
      list.push({
        name: 'Ministry of Corporate Affairs (CIN / MCA)',
        reason: 'No CIN was detected in the job offer text or user input.',
        tip: 'Search the exact company name on the official MCA portal to check incorporation and active status.',
        link: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do'
      });
    }
    if (!analysisData.digitalIdentity?.domain || analysisData.digitalIdentity?.domain === 'N/A') {
      list.push({
        name: 'Official Corporate Domain & RDAP Age',
        reason: 'No corporate domain or official email detected in input (or communication moved to WhatsApp/Telegram).',
        tip: 'Look up the company website domain on RDAP or whois.com to verify creation date and ownership.',
        link: 'https://www.whois.com'
      });
    }
    if (!analysisData.physical?.officeAddress) {
      list.push({
        name: 'Physical Office Address Verification',
        reason: 'No physical operating office address was provided in the input text.',
        tip: 'Search the company address on Google Maps or local registry to verify it is an actual corporate office.',
        link: 'https://maps.google.com'
      });
    }
    if (analysisData.linkedin?.status === 'not_checked') {
      list.push({
        name: 'LinkedIn Company Headcount & Leadership',
        reason: 'LinkedIn scraping without authentication is prohibited; no LinkedIn company URL provided.',
        tip: 'Open LinkedIn company search to verify employee counts, verified employees, and leadership profiles.',
        link: analysisData.linkedin?.searchUrl || 'https://www.linkedin.com/search/results/companies/'
      });
    }
    if (analysisData.stocks?.status === 'not_checked' && !analysisData.stocks?.isPublic) {
      list.push({
        name: 'Stock Market Listings & Regulatory Filings',
        reason: 'Company is unlisted or no public stock ticker was detected.',
        tip: 'If the firm claims to be publicly listed, verify their ticker symbol on NSE or BSE.',
        link: 'https://www.nseindia.com'
      });
    }
    if (analysisData.redditAndReviews?.status === 'not_checked' || !analysisData.redditAndReviews?.redditPosts?.length) {
      list.push({
        name: 'Community Discussions (Reddit / Scam Forums)',
        reason: 'No public Reddit discussions or scam complaints were retrieved via API.',
        tip: 'Search Reddit (r/scams or r/developersIndia) for the company name and "scam" or "offer".',
        link: analysisData.redditAndReviews?.searchUrl || 'https://www.reddit.com'
      });
    }
    return list;
  };

  const unrunChecks = getUnrunChecks();

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar 
        onReset={handleReset} 
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        searchCount={searchCount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        lang={lang}
        onToggleLang={handleToggleLang}
        t={t}
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
            lang={lang}
          />
        )}

        {/* State 2: Real Progress Scanning Indicator (No fake delays) */}
        {page === 'loading' && (
          <AnalysisLoading lang={lang} />
        )}

        {/* State 3: Evidence Dashboard */}
        {page === 'dashboard' && analysisData && (
          <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
            {/* 1, 2, 3: Header with Plain-Language Verdict, Top Reasons & What to do now */}
            <DashboardHeader
              data={analysisData}
              onReset={handleReset}
              lang={lang}
            />

            {/* 5 Golden Rules Security Gate */}
            {analysisData.goldenRules && (
              <GoldenRulesCard
                goldenRules={analysisData.goldenRules}
                redFlags={analysisData.redFlags}
                greenFlags={analysisData.greenFlags}
              />
            )}

            {/* 4. Detailed Checks as Collapsible Sections */}
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-bold text-vfslate dark:text-mist uppercase tracking-wider px-1">
                {t.detailedChecksTitle}
              </h2>

              {/* 1. Website & Email Domain Check */}
              <DigitalIdentitySection digitalIdentity={analysisData.digitalIdentity} />

              {/* 2. Government & Corporate Registries */}
              <GovernmentSection government={analysisData.government} />

              {/* 3. Physical Office Location */}
              <PhysicalFootprintSection physical={analysisData.physical} />

              {/* 4. LinkedIn Profile & Headcount */}
              <LinkedInSection linkedin={analysisData.linkedin} />

              {/* 5. Financial Information & Stock Filings */}
              <StockFinanceSection stocks={analysisData.stocks} />

              {/* 6. Community Discussions (Reddit) */}
              <RedditSentimentSection redditAndReviews={analysisData.redditAndReviews} />

              {/* 7. Offer Letter Document Text Audit (if extracted/uploaded) */}
              {analysisData.offerLetterQuality && (
                <OfferLetterAuditSection offerLetterQuality={analysisData.offerLetterQuality} />
              )}
            </div>

            {/* 5. A Single Collapsed Section: "Checks we couldn't run" */}
            {unrunChecks.length > 0 && (
              <div className="vf-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('unrun')}
                  className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-violet/5 dark:hover:bg-violet/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet/15 dark:bg-violet/25 border border-violet/30 flex items-center justify-center text-violet dark:text-lavender shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-vfslate dark:text-mist">
                        {t.unrunChecksTitle} ({unrunChecks.length})
                      </h3>
                      <p className="text-xs text-muted dark:text-lavender/80">
                        {t.unrunChecksSubtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-mist dark:bg-slate-800 text-vfslate dark:text-mist border border-slate-300/40 dark:border-slate-700">
                      {expandedSections.unrun ? 'Hide' : 'Click to View'}
                    </span>
                    {expandedSections.unrun ? <ChevronUp className="w-5 h-5 text-muted dark:text-lavender/70" /> : <ChevronDown className="w-5 h-5 text-muted dark:text-lavender/70" />}
                  </div>
                </button>
                {expandedSections.unrun && (
                  <div className="p-4 sm:p-6 border-t border-slate-200/60 dark:border-slate-700/60 space-y-3">
                    {unrunChecks.map((item, idx) => (
                      <div key={idx} className="vf-inner-card p-3.5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-semibold text-vfslate dark:text-mist">
                          <span>{item.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mist dark:bg-slate-800 text-muted dark:text-lavender/80 border border-slate-300/30 dark:border-slate-700">
                            {t.noDataNotChecked}
                          </span>
                        </div>
                        <p className="text-muted dark:text-mist/90">
                          {item.reason}
                        </p>
                        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-medium text-violet dark:text-lavender">
                            💡 How to check yourself: {item.tip}
                          </span>
                          {item.link && (
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1 font-semibold text-violet dark:text-lavender hover:underline shrink-0"
                            >
                              <span>Official Verification Link</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. Action Buttons Bar at bottom of report */}
            <div className="vf-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-vfslate dark:text-mist">
                  Need to save or report this result?
                </h4>
                <p className="text-xs text-muted dark:text-lavender/80">
                  Export as PDF, copy the text summary to your clipboard, or file an alert on the National Cybercrime portal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyReportBottom}
                  className="vf-btn-secondary px-4 py-2.5 min-h-[44px] text-xs inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                >
                  {copiedBottom ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4 text-muted dark:text-lavender/70" />}
                  <span>{copiedBottom ? 'Copied!' : t.copyBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="vf-btn-secondary px-4 py-2.5 min-h-[44px] text-xs inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                >
                  <Printer className="w-4 h-4 text-muted dark:text-lavender/70" />
                  <span>{t.exportBtn}</span>
                </button>

                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 min-h-[44px] rounded-xl bg-status-danger hover:bg-[#a72020] text-white transition-colors shadow-md flex-1 sm:flex-initial"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{t.reportScamBtn}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-300/40 dark:border-slate-800 bg-[#494D5F] py-6 px-4 text-center text-xs text-white transition-colors">
        <p className="font-semibold text-white">VeriFirm Evidence-Based Corporate & Scam Intelligence</p>
        <p className="mt-1 text-[11px] text-lavender/90">
          <strong>Legal Disclaimer:</strong> VeriFirm assessment results are risk indicators based on available evidence and do not constitute legal proof or corporate certification.
        </p>
        <p className="mt-1 text-[11px] text-lavender/80">
          Checks performed using input text analysis, RDAP, DNS & TLS network verification. Official registry links provided for manual verification.
        </p>
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

