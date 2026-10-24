import React, { useState, useRef } from 'react';
import { 
  Link2, Image, FileText, Sparkles, AlertTriangle, ShieldCheck, 
  Building2, TrendingUp, Search, UploadCloud, CheckCircle2, ChevronRight,
  ExternalLink, ArrowUpRight, HelpCircle, Lock, Users, Info, Globe2
} from 'lucide-react';

export function InputPortal({ 
  onAnalyze, 
  onPresetSelect, 
  presets = [], 
  isLoading, 
  currentUser, 
  searchCount = 0, 
  onOpenAuth 
}) {
  const [activeTab, setActiveTab] = useState('text');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [ocrStatus, setOcrStatus] = useState('');
  const [ocrStage, setOcrStage] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Global Clipboard Paste (Ctrl+V) listener for screenshots
  React.useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            setActiveTab('screenshot');
            processImageFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Handle image upload / drop
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setImageFileName(file.name || 'Pasted_Screenshot.png');
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      setImagePreview(base64Data);
      setIsOcrLoading(true);
      setOcrProgress(50);
      setOcrStage('Running Tesseract OCR engine on document...');
      setOcrStatus('Scanning screenshot with Native Tesseract OCR engine...');

      try {
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data, mimeType: file.type })
        });
        const data = await response.json();

        setOcrProgress(100);
        if (data.text && data.text.trim()) {
          setInputText(data.text);
          setOcrStage(`✓ Complete: ${data.charCount} characters read via ${data.engine}`);
          setOcrStatus(`✓ Real OCR Complete: ${data.charCount} characters read via ${data.engine}`);
        } else {
          setOcrStage('Notice: OCR completed. No readable text identified.');
          setOcrStatus('Notice: OCR completed but no readable text was identified. You can review or type details below.');
        }
      } catch (err) {
        console.error('OCR Error:', err);
        setOcrStage('OCR failed: ' + (err.message || 'Unknown error'));
        setOcrStatus('OCR failed: ' + (err.message || 'Unknown error'));
      } finally {
        setIsOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser && searchCount >= 5) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (activeTab === 'url') {
      if (!inputUrl.trim()) return;
      onAnalyze({ type: 'url', content: inputUrl });
    } else if (activeTab === 'screenshot') {
      if (!inputText && !imagePreview) return;
      onAnalyze({ 
        type: 'screenshot', 
        content: inputText || `Screenshot: ${imageFileName}`,
        fileData: imagePreview 
      });
    } else {
      if (!inputText.trim()) return;
      onAnalyze({ type: 'text', content: inputText });
    }
  };

  const handlePresetClick = (presetId) => {
    if (!currentUser && searchCount >= 5) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    onPresetSelect(presetId);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Legitimacy & Scam Verification Engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Verify if a Company is <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Authorized & Worthy</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Cross-examine any company offer against official <span className="text-slate-200 font-medium">MCA Government Registries</span>, <span className="text-slate-200 font-medium">LinkedIn Headcount Forensics</span>, <span className="text-slate-200 font-medium">Stock Market Financials</span>, <span className="text-slate-200 font-medium">WHOIS Domain Age</span>, and <span className="text-slate-200 font-medium">Reddit Scam Reports</span>.
        </p>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-[#0b1324] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
        {/* Search Quota Warning Banner if limit reached */}
        {!currentUser && searchCount >= 5 && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-rose-950/70 via-rose-900/40 to-slate-900 border border-rose-700/80 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-rose-950/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Compulsory Free Limit Reached (5/5 Searches Used)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300">
                    Registration Required
                  </span>
                </h4>
                <p className="text-xs text-rose-300/90 mt-0.5">
                  Sign in with your Gmail account or register an account to unlock unlimited AI scam & legitimacy audits.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full sm:w-auto shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-xs shadow-md shadow-rose-600/30 transition-all"
            >
              Sign In / Register Now ↗
            </button>
          </div>
        )}

        {/* Input Mode Tabs */}
        <div className="flex border-b border-slate-800/80 mb-6 gap-2 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Email / Offer Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('screenshot')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'screenshot'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Upload Screenshot / Offer Letter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'url'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Paste Link / URL</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tab 1: Text Input */}
          {activeTab === 'text' && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>PASTE JOB OFFER, RECRUITER EMAIL, OR WHATSAPP MESSAGE TEXT</span>
                <span className="text-slate-500">{inputText.length} characters</span>
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Example: 'From: hr@example.com... Dear Candidate, congratulations on being selected for Systems Engineer at Acme Technologies. Monthly compensation: ₹65,000. Please deposit ₹8,500 for company laptop courier via PhonePe to UPI...'"
                rows={6}
                className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl p-4 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all resize-y"
              />
            </div>
          )}

          {/* Tab 2: Screenshot Input */}
          {activeTab === 'screenshot' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer bg-[#080d19]/80 transition-all hover:bg-slate-800/20 group"
              >
                <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium text-slate-200 text-center">
                  Click to upload or drag & drop email / offer letter screenshot
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PNG, JPG, WEBP. Text will be automatically extracted & parsed.
                </p>
              </div>

              {imagePreview && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Image with laser scan animation */}
                    <div className="relative w-full sm:w-36 h-36 rounded-lg overflow-hidden border border-slate-700 bg-black shrink-0 flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Uploaded preview"
                        className={`w-full h-full object-contain ${isOcrLoading ? 'opacity-85 filter contrast-125' : ''}`}
                      />
                      {isOcrLoading && (
                        <>
                          <div className="absolute inset-0 bg-cyan-950/20 backdrop-blur-[1px] pointer-events-none" />
                          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_3px_rgba(6,182,212,0.8)] animate-laser-scan pointer-events-none" />
                          <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-cyan-300 border border-cyan-500/50 backdrop-blur-sm">
                              SCANNING {ocrProgress}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-semibold text-slate-200">{imageFileName}</span>
                        </div>
                        {isOcrLoading ? (
                          <span className="text-xs font-mono text-cyan-400 animate-pulse flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            Analyzing (3-4s)...
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-emerald-400">Scan Complete</span>
                        )}
                      </div>

                      {/* Progress Bar & Stage Status */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={isOcrLoading ? 'text-cyan-400' : 'text-slate-300'}>
                            {ocrStage || ocrStatus}
                          </span>
                          <span className="text-slate-400">{ocrProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ease-out ${
                              isOcrLoading 
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${ocrProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                          <span>EXTRACTED DOCUMENT TEXT (VERIFIABLE / EDITABLE)</span>
                          <span className="text-slate-500">{inputText.length} chars</span>
                        </label>
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder={isOcrLoading ? "Extracting textual entities, letterhead headers, and internship issuer..." : "Extracted text will appear here..."}
                          rows={3}
                          disabled={isOcrLoading}
                          className="w-full bg-[#060a12] border border-slate-800 focus:border-cyan-500 rounded p-2 text-xs text-slate-300 font-mono transition-all resize-y"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">
                COMPANY WEBSITE, LINKEDIN COMPANY PAGE, OR JOB BOARD URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="e.g. https://example.com or https://linkedin.com/company/example"
                  className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl px-4 py-3.5 pl-11 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
                <Link2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Privacy: Data analyzed locally in memory. Zero logs stored.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || isOcrLoading || (activeTab === 'text' && !inputText) || (activeTab === 'url' && !inputUrl) || (activeTab === 'screenshot' && !inputText && !imagePreview)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                !currentUser && searchCount >= 5
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-600/25'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40'
              }`}
            >
              {!currentUser && searchCount >= 5 ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Run Verification (Limit Reached)</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Run Deep Verification</span>
                  <ArrowUpRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* DEMO Mode Benchmark Presets */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-bold">
              DEMO MODE
            </span>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Simulated Benchmark Presets (For Demonstration Only)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">Pre-configured testing scenarios</span>
        </div>
        <p className="text-xs text-slate-400">
          These pre-packaged scenarios demonstrate how VeriFirm diagnoses high-risk phishing scams, legitimate enterprises, and unverified startups. Live verification on your custom input never uses pre-baked benchmark data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preset 1: Legitimate TCS */}
          <div
            onClick={() => handlePresetClick('legitimate-tcs')}
            className="group p-4 rounded-xl bg-[#091122] border border-emerald-900/40 hover:border-emerald-500/60 cursor-pointer transition-all hover:bg-slate-800/40 space-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                Verified Enterprise
              </span>
              <span className="text-xs font-extrabold text-emerald-400">98 / 100</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base group-hover:text-emerald-300 transition-colors">
                Tata Consultancy Services
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Legitimate blue-chip: Active MCA CIN, NSE:TCS stock graph, 615k+ LinkedIn headcount, verified official domain.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Inspect Legitimate Profile</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Preset 2: Imposter Phishing Scam */}
          <div
            onClick={() => handlePresetClick('scam-imposter-tcs')}
            className="group p-4 rounded-xl bg-[#091122] border border-rose-900/50 hover:border-rose-500/60 cursor-pointer transition-all hover:bg-slate-800/40 space-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800/50 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Confirmed Scam</span>
              </span>
              <span className="text-xs font-extrabold text-rose-400">4 / 100</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base group-hover:text-rose-300 transition-colors">
                Fake TCS Recruiter (Laptop Deposit)
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Phishing email demanding ₹8,500 laptop deposit on UPI, free @gmail.com address, 6-day-old domain, WhatsApp identity theft.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-rose-400 font-medium">
              <span>Inspect Scam Red Flags</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Preset 3: Unverified Startup */}
          <div
            onClick={() => handlePresetClick('unverified-startup')}
            className="group p-4 rounded-xl bg-[#091122] border border-amber-900/40 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-slate-800/40 space-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/50">
                Unverified Entity
              </span>
              <span className="text-xs font-extrabold text-amber-400">42 / 100</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base group-hover:text-amber-300 transition-colors">
                Acrobyte Global Fintech Labs
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Claims 500+ employees vs 4 on LinkedIn, 8-month domain, high turnover, synthetic Glassdoor 5-star review cluster.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-medium">
              <span>Inspect Risk Audit</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Definitive Checklist Guide: 5 Pillars of Verification */}
      <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/30 space-y-6">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            How to Verify if a Company is Authorized and Legitimate
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Beyond checking their LinkedIn presence, verifying a company's legal authorization is crucial before accepting a job offer, signing a contract, or sharing sensitive personal information. VeriFirm runs this 5-point checklist automatically:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Pillar 1 */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>1. Verify Government Registrations</span>
            </div>
            <p className="text-slate-400">
              Indian entities must be Active on the Ministry of Corporate Affairs (MCA, <code className="text-slate-300 font-mono">mca.gov.in</code>) with valid CIN and GSTIN. Global entities are cross-referenced with UK Companies House and US SEC EDGAR.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4" />
              <span>2. Scrutinize Digital Identity (WHOIS)</span>
            </div>
            <p className="text-slate-400">
              Check domain creation age via WHOIS. If a company claims 10 years experience but the domain is 2 weeks old, it is high-risk. Authorized firms never communicate via free <code className="text-slate-300 font-mono">@gmail.com</code> accounts.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>3. LinkedIn Headcount & Profile Quality</span>
            </div>
            <p className="text-slate-400">
              Does claimed employee count match LinkedIn? Click profiles to verify real photos (not stock AI), 500+ connections, established prior work history, and visible executive leadership.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>4. Market Credibility & Stock Performance</span>
            </div>
            <p className="text-slate-400">
              Verify if publicly listed on NSE, BSE, or NASDAQ. Inspect quarterly revenue and net profit growth/loss trends to evaluate financial solvency and job security.
            </p>
          </div>
        </div>

        {/* The Golden Rule Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 to-slate-900/80 border border-rose-800/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-rose-300">
              The Golden Rule of Authorized Hiring: They NEVER Ask for Money
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Legitimate companies never ask candidates for a "laptop security deposit", "training fee", "gate pass", or "courier fee". Real HR departments use secure employee onboarding portals—never asking for unencrypted Aadhaar, PAN, or bank details over WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
