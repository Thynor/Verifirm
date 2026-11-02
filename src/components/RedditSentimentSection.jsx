import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, ThumbsUp, AlertTriangle, CheckCircle2, 
  ExternalLink, ShieldAlert, FileText, Search, Star,
  ChevronDown, ChevronUp, UserCheck, Loader2, Globe, HelpCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';

export function RedditSentimentSection({ 
  redditAndReviews = {}, 
  quora = {}, 
  defaultExpanded = true, 
  companyName = '' 
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState('reddit'); // 'reddit' | 'quora'

  const {
    status = 'not_checked',
    source = null,
    checkedAt = null,
    redditPosts = [],
    searchUrl = 'https://www.reddit.com',
    message = 'No community discussions retrieved.',
    userProvidedRatings = null
  } = redditAndReviews;

  const targetCompany = (companyName || redditAndReviews.companyName || quora.companyName || '').trim();
  const [searchQuery, setSearchQuery] = useState(targetCompany || '');
  const [liveResults, setLiveResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Quora state
  const [quoraQuery, setQuoraQuery] = useState(targetCompany || '');
  const [quoraLiveResults, setQuoraLiveResults] = useState(null);
  const [isQuoraSearching, setIsQuoraSearching] = useState(false);
  const [quoraSearchError, setQuoraSearchError] = useState(null);

  useEffect(() => {
    if (targetCompany && !searchQuery) {
      setSearchQuery(targetCompany);
      setQuoraQuery(targetCompany);
    }
  }, [targetCompany]);

  const activePosts = liveResults?.redditPosts !== undefined ? liveResults.redditPosts : redditPosts;
  const activeSource = liveResults?.source || source;
  const activeCheckedAt = liveResults?.checkedAt || checkedAt;
  const activeMessage = liveResults?.message || message;
  const hasPosts = Array.isArray(activePosts) && activePosts.length > 0;
  const hasUserRatings = Boolean(userProvidedRatings && (userProvidedRatings.ambitionBoxRating || userProvidedRatings.glassdoorRating));

  // Quora discussions
  const initialQuoraDiscussions = Array.isArray(quora.discussions) ? quora.discussions : [];
  const activeQuoraDiscussions = quoraLiveResults?.discussions !== undefined 
    ? quoraLiveResults.discussions 
    : initialQuoraDiscussions;

  // Dynamic external URLs based on current query
  const queryForExternal = (searchQuery || targetCompany || '').trim();
  const externalRedditUrl = queryForExternal
    ? `https://www.reddit.com/search/?q=${encodeURIComponent(queryForExternal + ' scam OR offer OR interview')}`
    : searchUrl || 'https://www.reddit.com';

  const externalQuoraUrl = queryForExternal
    ? `https://www.quora.com/search?q=${encodeURIComponent(queryForExternal + ' scam OR review OR internship')}`
    : quora.searchUrl || 'https://www.quora.com';

  const handleLiveSearch = async (customQ = null) => {
    const q = (customQ !== null ? customQ : searchQuery).trim();
    if (!q) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/search/reddit?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setLiveResults(data);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuoraLiveSearch = async (customQ = null) => {
    const q = (customQ !== null ? customQ : quoraQuery).trim();
    if (!q) return;
    setIsQuoraSearching(true);
    setQuoraSearchError(null);
    try {
      const res = await fetch(`/api/search/quora?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setQuoraLiveResults(data);
    } catch (err) {
      setQuoraSearchError(err.message);
    } finally {
      setIsQuoraSearching(false);
    }
  };

  const handleChipClick = (chipQuery) => {
    setSearchQuery(chipQuery);
    handleLiveSearch(chipQuery);
  };

  const handleQuoraChipClick = (chipQuery) => {
    setQuoraQuery(chipQuery);
    handleQuoraLiveSearch(chipQuery);
  };

  return (
    <div className="vf-card overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-violet/5 dark:hover:bg-violet/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet/15 dark:bg-violet/25 border border-violet/30 flex items-center justify-center text-violet dark:text-lavender shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-vfslate dark:text-mist flex items-center gap-2 flex-wrap">
              <span>Community Discussions & Fraud Reports (Reddit & Quora)</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                hasPosts 
                  ? 'bg-status-success/10 text-status-success border-status-success/30 font-bold' 
                  : hasUserRatings
                    ? 'bg-violet/15 text-violet dark:text-lavender border-violet/30 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-muted dark:text-lavender/80 border-slate-200 dark:border-slate-700'
              }`}>
                {hasPosts ? `${activePosts.length} Reddit Threads` : activeQuoraDiscussions.length > 0 ? 'Quora Topics Ready' : hasUserRatings ? 'User Ratings Recorded' : 'No Data / Not Checked'}
              </span>
            </h2>
            <p className="text-xs text-muted dark:text-lavender/80">
              Cross-platform sentiment and fraud alerts across Reddit communities and Quora discussions
            </p>
          </div>
        </div>

        {/* Header Actions: Dedicated Visit Web Buttons + Expand Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          <a
            href={externalRedditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 font-semibold"
            title="Open Reddit search in a new tab"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Visit Reddit Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={externalQuoraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            title="Open Quora search in a new tab"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Visit Quora Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-muted hover:text-vfslate dark:text-lavender/70 dark:hover:text-mist hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200/60 dark:border-slate-700/60 space-y-6">
          {/* Platform Tab Switcher */}
          <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('reddit')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'reddit'
                  ? 'bg-violet text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-muted dark:text-lavender/80 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Reddit Threads ({hasPosts ? activePosts.length : 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quora')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'quora'
                  ? 'bg-violet text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-muted dark:text-lavender/80 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quora Questions & Topics ({activeQuoraDiscussions.length})</span>
            </button>
          </div>

          {/* TAB 1: REDDIT DISCUSSIONS */}
          {activeTab === 'reddit' && (
            <div className="space-y-6">
              {/* On-Page Live Search Tool */}
              <div className="vf-inner-card p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-violet dark:text-lavender flex items-center gap-1.5">
                    <Search className="w-4 h-4" />
                    <span>Search Reddit Discussions on Webpage</span>
                  </label>
                  <span className="text-[11px] text-muted dark:text-lavender/70">
                    Type any company or keyword to search live
                  </span>
                </div>

                {/* Search Input Bar with On-Page Search Button & Visit Reddit Web Button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-lavender/70" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLiveSearch()}
                      placeholder="Enter company name or search terms (e.g. CodeAlpha scam, interview offer)..."
                      className="vf-input pl-9 pr-3 py-2 text-xs w-full bg-white/80 dark:bg-[#2f3242]/80 border border-slate-300 dark:border-slate-600 rounded-xl text-vfslate dark:text-mist focus:ring-2 focus:ring-violet focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLiveSearch()}
                    disabled={isSearching || !searchQuery.trim()}
                    className="vf-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>{isSearching ? 'Searching...' : 'Search on Webpage'}</span>
                  </button>

                  <a
                    href={externalRedditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vf-btn-secondary px-4 py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5 shrink-0"
                    title="Visit Reddit search on reddit.com"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Visit Reddit Web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Quick Suggestion Search Chips */}
                {queryForExternal && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-medium text-muted dark:text-lavender/70 mr-1">Quick Filters:</span>
                    {[
                      `${queryForExternal} scam`,
                      `${queryForExternal} interview offer`,
                      `${queryForExternal} review`,
                      `${queryForExternal} fake internship`
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleChipClick(chip)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-violet/10 dark:bg-violet/20 hover:bg-violet/20 dark:hover:bg-violet/30 text-violet dark:text-lavender border border-violet/20 transition-colors"
                      >
                        🔍 {chip}
                      </button>
                    ))}
                  </div>
                )}

                {searchError && (
                  <p className="text-xs text-status-danger font-medium">
                    Lookup failed: {searchError}
                  </p>
                )}
              </div>

              {/* User-Provided AmbitionBox / Glassdoor Ratings */}
              {hasUserRatings && (
                <div className="vf-inner-card p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet dark:text-lavender flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />
                      <span>Candidate Review Ratings</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet/15 dark:bg-violet/25 text-violet dark:text-lavender border border-violet/30 font-semibold">
                      [user-provided]
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-vfslate dark:text-mist">AmbitionBox Rating</span>
                        <span className="text-[10px] font-mono text-muted dark:text-lavender/70">user-provided</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-vfslate dark:text-mist font-mono">
                          {userProvidedRatings.ambitionBoxRating ? `${userProvidedRatings.ambitionBoxRating} / 5.0` : 'Not entered'}
                        </span>
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </div>
                      <p className="text-xs text-muted dark:text-lavender/80">
                        {userProvidedRatings.ambitionBoxReviews 
                          ? `Based on ${userProvidedRatings.ambitionBoxReviews.toLocaleString()} reviews` 
                          : 'Review count not entered'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-vfslate dark:text-mist">Glassdoor Rating</span>
                        <span className="text-[10px] font-mono text-muted dark:text-lavender/70">user-provided</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-vfslate dark:text-mist font-mono">
                          {userProvidedRatings.glassdoorRating ? `${userProvidedRatings.glassdoorRating} / 5.0` : 'Not entered'}
                        </span>
                        <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                      </div>
                      <p className="text-xs text-muted dark:text-lavender/80">
                        {userProvidedRatings.glassdoorReviews 
                          ? `Based on ${userProvidedRatings.glassdoorReviews.toLocaleString()} reviews` 
                          : 'Review count not entered'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Real Reddit Posts Feed */}
              {hasPosts ? (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-muted dark:text-lavender/70 gap-1">
                    <span>Source: {activeSource || 'Reddit Official API'}</span>
                    {activeCheckedAt && <span>Checked: {new Date(activeCheckedAt).toLocaleTimeString()}</span>}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {activePosts.map((post) => (
                      <div
                        key={post.id || post.url}
                        className="vf-inner-card p-4 hover:border-violet/40 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet/15 dark:bg-violet/25 text-violet dark:text-lavender border border-violet/30 font-semibold">
                              {post.subreddit}
                            </span>
                            {post.author && (
                              <span className="text-[11px] font-mono text-muted dark:text-lavender/80">
                                {post.author}
                              </span>
                            )}
                            {post.createdAt && (
                              <span className="text-[10px] font-mono text-muted dark:text-lavender/70">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono text-muted dark:text-lavender/80">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5 text-violet dark:text-lavender" />
                              <span>{post.score ?? 0}</span>
                            </span>
                            {post.numComments > 0 && <span>{post.numComments} comments</span>}
                          </div>
                        </div>

                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm font-bold text-vfslate dark:text-mist hover:text-violet dark:hover:text-lavender transition-colors group"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <span>{post.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-violet dark:text-lavender shrink-0" />
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty State with Transparent Explanation & Action Links */
                <div className="vf-inner-card p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet/15 dark:bg-violet/25 border border-violet/30 text-violet dark:text-lavender flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="text-sm font-semibold text-vfslate dark:text-mist">
                      {searchQuery ? `No Direct Reddit Discussions Found for "${searchQuery}"` : 'No Reddit Community Discussions Found'}
                    </h3>
                    <p className="text-xs text-muted dark:text-lavender/80 leading-relaxed">
                      {activeMessage}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleLiveSearch()}
                      disabled={isSearching}
                      className="vf-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search on Webpage Again</span>
                    </button>

                    <a
                      href={externalRedditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vf-btn-secondary px-4 py-2 text-xs font-semibold inline-flex items-center gap-2"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Visit Reddit Web Directly</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Transparent explanation of why HTTP 403 occurs */}
                  <div className="pt-4 border-t border-slate-300/40 dark:border-slate-600/40 text-left max-w-xl mx-auto space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-vfslate dark:text-mist">
                      <HelpCircle className="w-4 h-4 text-violet dark:text-lavender shrink-0" />
                      <span>Why does "Reddit API returned HTTP 403" happen?</span>
                    </div>
                    <p className="text-[11px] text-muted dark:text-lavender/80 leading-relaxed">
                      Reddit blocks unauthenticated automated scripts with <strong>HTTP 403 / 429</strong> unless official OAuth credentials are configured. To protect your safety without ever inventing synthetic reviews or fake comments, VeriFirm provides the <strong>Search on Webpage</strong> bar above and the <strong>Visit Reddit Web</strong> button to let you inspect discussions safely.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                      <span className="text-muted dark:text-lavender/70">Inspect top communities:</span>
                      <a
                        href={`https://www.reddit.com/r/scams/search/?q=${encodeURIComponent(queryForExternal || 'offer scam')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet dark:text-lavender hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        r/scams <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-muted/50">•</span>
                      <a
                        href={`https://www.reddit.com/r/developersIndia/search/?q=${encodeURIComponent(queryForExternal || 'internship scam')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet dark:text-lavender hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        r/developersIndia <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-muted/50">•</span>
                      <a
                        href={`https://www.reddit.com/r/recruitinghell/search/?q=${encodeURIComponent(queryForExternal || 'fake offer')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet dark:text-lavender hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        r/recruitinghell <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUORA DISCUSSIONS */}
          {activeTab === 'quora' && (
            <div className="space-y-6">
              {/* On-Page Quora Search Bar */}
              <div className="vf-inner-card p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <Search className="w-4 h-4" />
                    <span>Search Quora Community Questions on Webpage</span>
                  </label>
                  <span className="text-[11px] text-muted dark:text-lavender/70">
                    Targeted fraud questions and candid workplace reviews
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-lavender/70" />
                    <input
                      type="text"
                      value={quoraQuery}
                      onChange={(e) => setQuoraQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleQuoraLiveSearch()}
                      placeholder="Enter company name to generate Quora fraud investigation topics..."
                      className="vf-input pl-9 pr-3 py-2 text-xs w-full bg-white/80 dark:bg-[#2f3242]/80 border border-slate-300 dark:border-slate-600 rounded-xl text-vfslate dark:text-mist focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuoraLiveSearch()}
                    disabled={isQuoraSearching || !quoraQuery.trim()}
                    className="vf-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isQuoraSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>{isQuoraSearching ? 'Searching...' : 'Search on Webpage'}</span>
                  </button>

                  <a
                    href={externalQuoraUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vf-btn-secondary px-4 py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5 shrink-0 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Open Quora search on quora.com"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Visit Quora Web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Quick Filters */}
                {queryForExternal && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-medium text-muted dark:text-lavender/70 mr-1">Quick Filters:</span>
                    {[
                      `${queryForExternal} fake or real`,
                      `${queryForExternal} scam`,
                      `${queryForExternal} internship review`,
                      `${queryForExternal} offer letter verification`
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleQuoraChipClick(chip)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors"
                      >
                        ❓ {chip}
                      </button>
                    ))}
                  </div>
                )}

                {quoraSearchError && (
                  <p className="text-xs text-status-danger font-medium">
                    Lookup failed: {quoraSearchError}
                  </p>
                )}
              </div>

              {/* Quora Topic Cards Grid */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-muted dark:text-lavender/70 gap-1">
                  <span>Source: {quora.source || 'Quora Public Question & Search Index'}</span>
                  <span>Target: {quoraQuery || targetCompany || 'Company'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {activeQuoraDiscussions.map((item) => (
                    <div
                      key={item.id || item.question}
                      className="vf-inner-card p-4 hover:border-rose-400/50 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                            item.category === 'Advance Fee Warning'
                              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                              : item.category === 'Legitimacy Audit'
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                                : 'bg-violet/15 text-violet dark:text-lavender border-violet/30'
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-[10px] font-mono text-muted dark:text-lavender/70">Quora Search</span>
                        </div>

                        <h4 className="text-sm font-bold text-vfslate dark:text-mist leading-snug">
                          {item.question}
                        </h4>

                        <p className="text-xs text-muted dark:text-lavender/80 leading-relaxed">
                          {item.hint}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-muted dark:text-lavender/70">
                          Search live answers
                        </span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <span>Open on Quora</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transparency notice for Quora anti-scraping */}
                <div className="vf-inner-card p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-vfslate dark:text-mist font-bold">
                    <HelpCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>How VeriFirm Verifies Quora Discussions Without Fabricating Data</span>
                  </div>
                  <p className="text-muted dark:text-lavender/80 leading-relaxed text-[11px]">
                    Quora uses aggressive Cloudflare anti-bot security that responds with HTTP 403 to automated servers. To protect candidate safety and prevent fabricated or simulated reviews, VeriFirm generates authentic targeted investigation deep links. Use the <strong>Open on Quora</strong> or <strong>Visit Quora Web</strong> buttons to read actual user answers directly on Quora.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
