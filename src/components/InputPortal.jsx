import React, { useState, useRef } from 'react';
import { 
  Link2, Image, FileText, Sparkles, AlertTriangle, ShieldCheck, 
  Building2, TrendingUp, Search, UploadCloud, CheckCircle2, ChevronRight,
  ExternalLink, ArrowUpRight, HelpCircle, Lock, Users, Info, Globe2,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { translations } from '../utils/translations.js';

export function InputPortal({ 
  onAnalyze, 
  onPresetSelect, 
  presets = [], 
  isLoading = false, 
  currentUser, 
  searchCount = 0, 
  onOpenAuth,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
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

  // Collapsible state for optional details
  const [showOptional, setShowOptional] = useState(false);
  const [optionalDetails, setOptionalDetails] = useState({
    companyAddress: '',
    claimedEmployeeCount: '',
    linkedInEmployeeCount: '',
    linkedInCreatedYear: '',
    ambitionBoxRating: '',
    ambitionBoxReviews: '',
    glassdoorRating: '',
    glassdoorReviews: '',
    financials: [
      { year: '2020', revenue: '', profit: '' },
      { year: '2021', revenue: '', profit: '' },
      { year: '2022', revenue: '', profit: '' },
      { year: '2023', revenue: '', profit: '' },
      { year: '2024', revenue: '', profit: '' }
    ]
  });

  const handleFinancialChange = (index, field, value) => {
    setOptionalDetails(prev => {
      const updated = [...prev.financials];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, financials: updated };
    });
  };

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

    const userProvidedDetails = {
      companyAddress: optionalDetails.companyAddress.trim() || null,
      claimedEmployeeCount: optionalDetails.claimedEmployeeCount ? parseInt(optionalDetails.claimedEmployeeCount, 10) : null,
      linkedInEmployeeCount: optionalDetails.linkedInEmployeeCount ? parseInt(optionalDetails.linkedInEmployeeCount, 10) : null,
      linkedInCreatedYear: optionalDetails.linkedInCreatedYear ? parseInt(optionalDetails.linkedInCreatedYear, 10) : null,
      ambitionBoxRating: optionalDetails.ambitionBoxRating ? parseFloat(optionalDetails.ambitionBoxRating) : null,
      ambitionBoxReviews: optionalDetails.ambitionBoxReviews ? parseInt(optionalDetails.ambitionBoxReviews, 10) : null,
      glassdoorRating: optionalDetails.glassdoorRating ? parseFloat(optionalDetails.glassdoorRating) : null,
      glassdoorReviews: optionalDetails.glassdoorReviews ? parseInt(optionalDetails.glassdoorReviews, 10) : null,
      financials: optionalDetails.financials
        .filter(f => f.year && (f.revenue !== '' || f.profit !== ''))
        .map(f => ({
          year: f.year,
          revenue: f.revenue ? parseFloat(f.revenue) : 0,
          profit: f.profit ? parseFloat(f.profit) : 0
        }))
    };

    if (activeTab === 'url') {
      if (!inputUrl.trim()) return;
      onAnalyze({ type: 'url', content: inputUrl, userProvidedDetails });
    } else if (activeTab === 'screenshot') {
      if (!inputText && !imagePreview) return;
      onAnalyze({ 
        type: 'screenshot', 
        content: inputText || `Screenshot: ${imageFileName}`,
        fileData: imagePreview,
        userProvidedDetails
      });
    } else {
      if (!inputText.trim()) return;
      onAnalyze({ type: 'text', content: inputText, userProvidedDetails });
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EAF5] dark:bg-[#3a3e4f] border border-[#494D5F]/20 dark:border-[#D0BDF4]/30 text-[#494D5F] dark:text-[#E5EAF5] text-xs font-semibold shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#8458B3] dark:text-[#D0BDF4]" />
          <span>{t.appSubtitle}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#494D5F] dark:text-white max-w-3xl mx-auto leading-tight">
          Verify if a Company or Offer is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8458B3] to-[#494D5F] dark:from-[#D0BDF4] dark:to-[#A0D2EB]">Genuine & Authorized</span>
        </h1>
        <p className="text-[#494D5F]/90 dark:text-[#E5EAF5]/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {t.tagline}
        </p>
      </div>

      {/* Main Analysis Card */}
      <div className="vf-card p-4 sm:p-6 space-y-6">
        {/* Search Quota Warning Banner if limit reached */}
        {!currentUser && searchCount >= 5 && (
          <div className="p-4 rounded-xl bg-[#C62828]/10 border border-[#C62828]/30 text-[#494D5F] dark:text-[#E5EAF5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C62828]/20 border border-[#C62828]/40 flex items-center justify-center text-[#C62828] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#494D5F] dark:text-white flex items-center gap-2">
                  <span>Free Limit Reached (5/5 Searches Used)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C62828]/20 border border-[#C62828]/30 text-[#C62828] font-bold">
                    Registration Required
                  </span>
                </h4>
                <p className="text-xs text-[#5d6180] dark:text-[#E5EAF5]/80 mt-0.5">
                  Sign in with your Gmail account or register an account to unlock unlimited verification checks.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAuth}
              className="vf-btn-primary text-xs shrink-0 w-full sm:w-auto"
            >
              Sign In / Register Now ↗
            </button>
          </div>
        )}

        {/* Input Mode Tabs */}
        <div className="flex border-b border-[#494D5F]/15 dark:border-[#D0BDF4]/20 mb-6 gap-2 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
              activeTab === 'text'
                ? 'bg-[#8458B3] text-white shadow-sm'
                : 'text-[#494D5F] dark:text-[#E5EAF5] hover:bg-[#D0BDF4]/30'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Email / Offer Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('screenshot')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
              activeTab === 'screenshot'
                ? 'bg-[#8458B3] text-white shadow-sm'
                : 'text-[#494D5F] dark:text-[#E5EAF5] hover:bg-[#D0BDF4]/30'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>{t.uploadBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
              activeTab === 'url'
                ? 'bg-[#8458B3] text-white shadow-sm'
                : 'text-[#494D5F] dark:text-[#E5EAF5] hover:bg-[#D0BDF4]/30'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Paste Website / Link</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tab 1: Text Input */}
          {activeTab === 'text' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#494D5F] dark:text-[#E5EAF5] flex items-center justify-between">
                <span>PASTE JOB OFFER, RECRUITER EMAIL, OR WHATSAPP MESSAGE</span>
                <span className="text-[#5d6180] dark:text-[#E5EAF5]/70 font-mono text-[11px]">{inputText.length} characters</span>
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.inputPlaceholder}
                rows={7}
                className="w-full vf-input p-4 placeholder-[#5d6180]/60 resize-y leading-relaxed font-sans"
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
                className="border-2 border-dashed border-[#8458B3]/40 hover:border-[#8458B3] rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer bg-[#E5EAF5]/50 dark:bg-[#2f3242]/50 transition-all hover:bg-[#E5EAF5] dark:hover:bg-[#2f3242] group"
              >
                <div className="w-14 h-14 rounded-full bg-[#D0BDF4]/40 dark:bg-[#3a3e4f] flex items-center justify-center text-[#8458B3] dark:text-[#D0BDF4] mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-[#494D5F] dark:text-[#E5EAF5] text-center">
                  {t.uploadBtn}
                </p>
                <p className="text-xs text-[#5d6180] dark:text-[#E5EAF5]/70 mt-1 text-center">
                  {t.uploadHint}
                </p>
              </div>

              {imagePreview && (
                <div className="p-4 rounded-xl vf-inner-card space-y-4">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Image Preview */}
                    <div className="relative w-full sm:w-36 h-36 rounded-lg overflow-hidden border border-[#494D5F]/20 dark:border-[#D0BDF4]/30 bg-white dark:bg-black shrink-0 flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Uploaded preview"
                        className={`w-full h-full object-contain ${isOcrLoading ? 'opacity-85 filter contrast-125' : ''}`}
                      />
                      {isOcrLoading && (
                        <>
                          <div className="absolute inset-0 bg-[#8458B3]/20 backdrop-blur-[1px] pointer-events-none" />
                          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8458B3] to-transparent shadow-[0_0_15px_3px_rgba(132,88,179,0.8)] animate-laser-scan pointer-events-none" />
                          <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-white border border-[#D0BDF4]/50 backdrop-blur-sm">
                              SCANNING {ocrProgress}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#14803C]" />
                          <span className="text-sm font-semibold text-[#494D5F] dark:text-[#E5EAF5]">{imageFileName}</span>
                        </div>
                        {isOcrLoading ? (
                          <span className="text-xs font-mono text-[#8458B3] dark:text-[#D0BDF4] animate-pulse flex items-center gap-1.5 font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#8458B3] animate-ping" />
                            Scanning text...
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-[#14803C] font-semibold">Scan Complete</span>
                        )}
                      </div>

                      {/* Progress Bar & Stage Status */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={isOcrLoading ? 'text-[#8458B3] dark:text-[#D0BDF4] font-semibold' : 'text-[#494D5F] dark:text-[#E5EAF5]'}>
                            {ocrStage || ocrStatus}
                          </span>
                          <span className="text-[#5d6180] dark:text-[#E5EAF5]/70">{ocrProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#D0BDF4]/40 dark:bg-[#2f3242] rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ease-out ${
                              isOcrLoading 
                                ? 'bg-gradient-to-r from-[#8458B3] to-[#D0BDF4]' 
                                : 'bg-[#14803C]'
                            }`}
                            style={{ width: `${ocrProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#494D5F] dark:text-[#E5EAF5] flex items-center justify-between">
                          <span>EXTRACTED DOCUMENT TEXT (EDITABLE)</span>
                          <span className="text-[#5d6180] dark:text-[#E5EAF5]/70 font-mono">{inputText.length} chars</span>
                        </label>
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder={isOcrLoading ? "Reading text from image..." : "Extracted text will appear here..."}
                          rows={3}
                          disabled={isOcrLoading}
                          className="w-full vf-input p-2 text-xs font-mono transition-all resize-y"
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
              <label className="text-xs font-semibold uppercase tracking-wider text-[#494D5F] dark:text-[#E5EAF5]">
                COMPANY WEBSITE, LINKEDIN PAGE, OR OFFER LINK
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="e.g. https://example.com or https://linkedin.com/company/example"
                  className="w-full vf-input px-4 py-3.5 pl-11 font-mono text-base"
                />
                <Link2 className="w-5 h-5 text-[#5d6180] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Optional: Deep Check Inputs (User Provided) */}
          <div className="pt-2 border-t border-[#494D5F]/15 dark:border-[#D0BDF4]/20">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold text-[#494D5F] dark:text-[#E5EAF5] vf-inner-card transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#8458B3]/20 text-[#8458B3] dark:text-[#D0BDF4] border border-[#8458B3]/30 font-bold">
                  {t.userProvidedBadge}
                </span>
                <span>{t.optionalTitle}</span>
              </div>
              {showOptional ? <ChevronUp className="w-4 h-4 text-[#5d6180]" /> : <ChevronDown className="w-4 h-4 text-[#5d6180]" />}
            </button>

            {showOptional && (
              <div className="mt-4 p-4 sm:p-5 rounded-xl vf-inner-card space-y-4">
                <p className="text-xs text-[#5d6180] dark:text-[#E5EAF5]/80 leading-relaxed">
                  {t.optionalHint}
                </p>

                {/* Company Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#494D5F] dark:text-[#E5EAF5] flex items-center justify-between">
                    <span>{t.companyAddress}</span>
                    <span className="text-[10px] text-[#5d6180] font-mono">Geocoded for map verification</span>
                  </label>
                  <input
                    type="text"
                    value={optionalDetails.companyAddress}
                    onChange={(e) => setOptionalDetails({ ...optionalDetails, companyAddress: e.target.value })}
                    placeholder="e.g. 10th Floor, Maker Chambers, Nariman Point, Mumbai"
                    className="w-full vf-input px-3.5 py-2.5 text-sm"
                  />
                </div>

                {/* Headcount Claimed vs LinkedIn & Page Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#494D5F] dark:text-[#E5EAF5]">
                      {t.claimedHeadcount}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={optionalDetails.claimedEmployeeCount}
                      onChange={(e) => setOptionalDetails({ ...optionalDetails, claimedEmployeeCount: e.target.value })}
                      placeholder="e.g. 500"
                      className="w-full vf-input px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#494D5F] dark:text-[#E5EAF5]">
                      {t.linkedinHeadcount}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={optionalDetails.linkedInEmployeeCount}
                      onChange={(e) => setOptionalDetails({ ...optionalDetails, linkedInEmployeeCount: e.target.value })}
                      placeholder="e.g. 12"
                      className="w-full vf-input px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#494D5F] dark:text-[#E5EAF5]">
                      {t.linkedinYear}
                    </label>
                    <input
                      type="number"
                      min="2000"
                      max="2030"
                      value={optionalDetails.linkedInCreatedYear}
                      onChange={(e) => setOptionalDetails({ ...optionalDetails, linkedInCreatedYear: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full vf-input px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Ratings: AmbitionBox and Glassdoor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#494D5F] dark:text-[#E5EAF5]">
                      AmbitionBox (Rating & Reviews)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={optionalDetails.ambitionBoxRating}
                        onChange={(e) => setOptionalDetails({ ...optionalDetails, ambitionBoxRating: e.target.value })}
                        placeholder="Rating (1-5)"
                        className="w-full vf-input px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        min="0"
                        value={optionalDetails.ambitionBoxReviews}
                        onChange={(e) => setOptionalDetails({ ...optionalDetails, ambitionBoxReviews: e.target.value })}
                        placeholder="Reviews count"
                        className="w-full vf-input px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#494D5F] dark:text-[#E5EAF5]">
                      Glassdoor (Rating & Reviews)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={optionalDetails.glassdoorRating}
                        onChange={(e) => setOptionalDetails({ ...optionalDetails, glassdoorRating: e.target.value })}
                        placeholder="Rating (1-5)"
                        className="w-full vf-input px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        min="0"
                        value={optionalDetails.glassdoorReviews}
                        onChange={(e) => setOptionalDetails({ ...optionalDetails, glassdoorReviews: e.target.value })}
                        placeholder="Reviews count"
                        className="w-full vf-input px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 5-Year Financials Table */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#494D5F] dark:text-[#E5EAF5]">
                      {t.financials5yr}
                    </label>
                    <span className="text-[10px] text-[#5d6180] font-mono">Used for growth/loss summary</span>
                  </div>
                  <div className="overflow-x-auto border border-[#494D5F]/20 dark:border-[#D0BDF4]/20 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-[#E5EAF5] dark:bg-[#3a3e4f] border-b border-[#494D5F]/15 dark:border-[#D0BDF4]/20 text-[#494D5F] dark:text-[#E5EAF5] font-semibold">
                          <th className="py-2.5 px-3">{t.year}</th>
                          <th className="py-2.5 px-3">{t.revenue}</th>
                          <th className="py-2.5 px-3">{t.profit}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#494D5F]/15 dark:divide-[#D0BDF4]/15">
                        {optionalDetails.financials.map((row, idx) => (
                          <tr key={idx} className="bg-white/60 dark:bg-[#2f3242]">
                            <td className="py-1.5 px-3 font-mono text-[#494D5F] dark:text-[#E5EAF5]">
                              <input
                                type="text"
                                value={row.year}
                                onChange={(e) => handleFinancialChange(idx, 'year', e.target.value)}
                                className="w-16 px-2 py-1 rounded bg-[#E5EAF5] dark:bg-[#3a3e4f] border border-[#494D5F]/30 dark:border-[#D0BDF4]/30 text-[#494D5F] dark:text-[#E5EAF5] text-xs font-mono"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="number"
                                step="any"
                                value={row.revenue}
                                onChange={(e) => handleFinancialChange(idx, 'revenue', e.target.value)}
                                placeholder="Revenue"
                                className="w-full px-2.5 py-1 rounded bg-[#E5EAF5] dark:bg-[#3a3e4f] border border-[#494D5F]/30 dark:border-[#D0BDF4]/30 text-[#494D5F] dark:text-[#E5EAF5] text-xs"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="number"
                                step="any"
                                value={row.profit}
                                onChange={(e) => handleFinancialChange(idx, 'profit', e.target.value)}
                                placeholder="Net Profit"
                                className="w-full px-2.5 py-1 rounded bg-[#E5EAF5] dark:bg-[#3a3e4f] border border-[#494D5F]/30 dark:border-[#D0BDF4]/30 text-[#494D5F] dark:text-[#E5EAF5] text-xs"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Note & Primary Submit Button */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#5d6180] dark:text-[#E5EAF5]/80">
              <Lock className="w-4 h-4 text-[#8458B3] dark:text-[#D0BDF4] shrink-0" />
              <span>{t.privacyNote}</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || isOcrLoading || (activeTab === 'text' && !inputText) || (activeTab === 'url' && !inputUrl) || (activeTab === 'screenshot' && !inputText && !imagePreview)}
              className={`w-full sm:w-auto vf-btn-primary min-h-[48px] px-8 py-3.5 text-base font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                !currentUser && searchCount >= 5
                  ? 'bg-gradient-to-r from-[#C62828] to-[#B26A00] text-white'
                  : ''
              }`}
            >
              {!currentUser && searchCount >= 5 ? (
                <>
                  <Lock className="w-5 h-5 text-white" />
                  <span>Sign In to Verify</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 text-white" />
                  <span>{isLoading ? t.verifyingBtn : t.verifyBtn}</span>
                  <ArrowUpRight className="w-5 h-5 ml-0.5 text-white" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* DEMO Mode Benchmark Presets */}
      <div className="vf-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#494D5F]/15 dark:border-[#D0BDF4]/20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B26A00]/20 text-[#B26A00] border border-[#B26A00]/40 font-bold">
              DEMO MODE
            </span>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#494D5F] dark:text-[#E5EAF5]">
              Simulated Benchmark Presets (Testing Only)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#5d6180] dark:text-[#E5EAF5]/70">Demonstration scenarios</span>
        </div>
        <p className="text-xs text-[#5d6180] dark:text-[#E5EAF5]/80">
          {t.demoModeBanner}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preset 1: Legitimate TCS */}
          <div
            onClick={() => handlePresetClick('legitimate-tcs')}
            className="group p-4 rounded-xl vf-inner-card hover:border-[#14803C] cursor-pointer transition-all hover:shadow-md space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#14803C]/15 text-[#14803C] border border-[#14803C]/30 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Enterprise</span>
              </span>
              <span className="text-xs font-extrabold text-[#14803C]">98 / 100</span>
            </div>
            <div>
              <h3 className="font-semibold text-[#494D5F] dark:text-white text-base group-hover:text-[#8458B3] dark:group-hover:text-[#D0BDF4] transition-colors">
                Tata Consultancy Services
              </h3>
              <p className="text-xs text-[#5d6180] dark:text-[#E5EAF5]/80 mt-1 line-clamp-2">
                Active MCA CIN, NSE:TCS stock records, 615k+ LinkedIn headcount, verified official domain.
              </p>
            </div>
            <div className="pt-2 border-t border-[#494D5F]/15 dark:border-[#D0BDF4]/15 flex items-center justify-between text-xs text-[#8458B3] dark:text-[#D0BDF4] font-semibold">
              <span>View Benchmark Profile</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Preset 2: Imposter Phishing Scam */}
          <div
            onClick={() => handlePresetClick('scam-imposter-tcs')}
            className="group p-4 rounded-xl vf-inner-card hover:border-[#C62828] cursor-pointer transition-all hover:shadow-md space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#C62828]/15 text-[#C62828] border border-[#C62828]/30 flex items-center gap-1 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-[#C62828]" />
                <span>Confirmed Scam</span>
              </span>
              <span className="text-xs font-extrabold text-[#C62828]">4 / 100</span>
            </div>
            <div>
              <h3 className="font-semibold text-[#494D5F] dark:text-white text-base group-hover:text-[#C62828] transition-colors">
                Fake Recruiter (Laptop Deposit)
              </h3>
              <p className="text-xs text-[#5d6180] dark:text-[#E5EAF5]/80 mt-1 line-clamp-2">
                Demands ₹8,500 security deposit on UPI, free @gmail.com address, informal messaging link.
              </p>
            </div>
            <div className="pt-2 border-t border-[#494D5F]/15 dark:border-[#D0BDF4]/15 flex items-center justify-between text-xs text-[#C62828] font-semibold">
              <span>View Red Flags</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Preset 3: Unverified Startup */}
          <div
            onClick={() => handlePresetClick('unverified-startup')}
            className="group p-4 rounded-xl vf-inner-card hover:border-[#8458B3] cursor-pointer transition-all hover:shadow-md space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#8458B3]/15 text-[#8458B3] dark:text-[#D0BDF4] border border-[#8458B3]/30 font-bold">
                Unverified Entity
              </span>
              <span className="text-xs font-extrabold text-[#8458B3] dark:text-[#D0BDF4]">42 / 100</span>
            </div>
            <div>
              <h3 className="font-semibold text-[#494D5F] dark:text-white text-base group-hover:text-[#8458B3] dark:group-hover:text-[#D0BDF4] transition-colors">
                Acrobyte Global Labs
              </h3>
              <p className="text-xs text-[#5d6180] dark:text-[#E5EAF5]/80 mt-1 line-clamp-2">
                Headcount mismatch (claims 500+ vs 4 on LinkedIn), recent domain, insufficient registration proof.
              </p>
            </div>
            <div className="pt-2 border-t border-[#494D5F]/15 dark:border-[#D0BDF4]/15 flex items-center justify-between text-xs text-[#8458B3] dark:text-[#D0BDF4] font-semibold">
              <span>View Benchmark Profile</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Guide: 5 Pillars of Verification */}
      <div className="vf-card p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#8458B3] dark:text-[#D0BDF4]" />
          <h3 className="text-lg font-bold text-[#494D5F] dark:text-white">
            How to Verify if a Company is Authorized and Legitimate
          </h3>
        </div>
        <p className="text-xs text-[#5d6180] dark:text-[#E5EAF5]/80 leading-relaxed">
          Verifying legal authorization is crucial before accepting a job offer, signing a contract, or sharing sensitive personal information. VeriFirm evaluates evidence across these core areas:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl vf-inner-card space-y-1.5">
            <div className="font-semibold text-[#8458B3] dark:text-[#D0BDF4] flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>1. Government Registrations</span>
            </div>
            <p className="text-[#5d6180] dark:text-[#E5EAF5]/80">
              Legitimate entities hold active registrations with company registries (such as Ministry of Corporate Affairs in India, Companies House in the UK, or SEC in the US).
            </p>
          </div>

          <div className="p-3.5 rounded-xl vf-inner-card space-y-1.5">
            <div className="font-semibold text-[#8458B3] dark:text-[#D0BDF4] flex items-center gap-1.5">
              <Globe2 className="w-4 h-4" />
              <span>2. Official Domain & Email Matching</span>
            </div>
            <p className="text-[#5d6180] dark:text-[#E5EAF5]/80">
              Authorized companies use their own corporate domains for correspondence. Legitimate recruiters will not conduct formal hiring exclusively through free webmail or informal chats.
            </p>
          </div>

          <div className="p-3.5 rounded-xl vf-inner-card space-y-1.5">
            <div className="font-semibold text-[#8458B3] dark:text-[#D0BDF4] flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>3. Headcount & Leadership Consistency</span>
            </div>
            <p className="text-[#5d6180] dark:text-[#E5EAF5]/80">
              Claimed employee numbers must align with verified employee listings and recognizable leadership profiles.
            </p>
          </div>

          <div className="p-3.5 rounded-xl vf-inner-card space-y-1.5">
            <div className="font-semibold text-[#8458B3] dark:text-[#D0BDF4] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>4. Financial Solvency & Filings</span>
            </div>
            <p className="text-[#5d6180] dark:text-[#E5EAF5]/80">
              Established companies have verifiable financial reporting, whether public market listings or registered corporate filings.
            </p>
          </div>
        </div>

        {/* The Golden Rule Banner */}
        <div className="p-4 rounded-xl bg-[#C62828]/10 border border-[#C62828]/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#C62828] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-[#C62828]">
              The Golden Rule of Legitimate Hiring: They NEVER Ask Candidates for Money
            </h4>
            <p className="text-[#494D5F] dark:text-[#E5EAF5] leading-relaxed">
              Legitimate employers never demand a "laptop security deposit", "training fee", "courier charge", or "gate pass fee". Any upfront money demand is an immediate sign of fraud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
