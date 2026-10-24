import React, { useState } from 'react';
import { 
  MessageSquare, ThumbsUp, AlertTriangle, CheckCircle2, 
  ExternalLink, ShieldAlert, FileText, Search, Star,
  ChevronDown, ChevronUp, UserCheck
} from 'lucide-react';

export function RedditSentimentSection({ redditAndReviews = {}, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const {
    status = 'not_checked',
    source = null,
    checkedAt = null,
    redditPosts = [],
    searchUrl = 'https://www.reddit.com',
    message = 'No community discussions retrieved.',
    userProvidedRatings = null
  } = redditAndReviews;

  const hasPosts = Array.isArray(redditPosts) && redditPosts.length > 0;
  const hasUserRatings = Boolean(userProvidedRatings && (userProvidedRatings.ambitionBoxRating || userProvidedRatings.glassdoorRating));

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
            <h2 className="text-base sm:text-lg font-bold text-vfslate dark:text-mist flex items-center gap-2">
              <span>Community Discussions & Fraud Reports (Reddit)</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                hasPosts 
                  ? 'bg-status-success/10 text-status-success border-status-success/30 font-bold' 
                  : hasUserRatings
                    ? 'bg-violet/15 text-violet dark:text-lavender border-violet/30 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-muted dark:text-lavender/80 border-slate-200 dark:border-slate-700'
              }`}>
                {hasPosts ? `${redditPosts.length} Real Threads` : hasUserRatings ? 'User Ratings Recorded' : 'No Data / Not Checked'}
              </span>
            </h2>
            <p className="text-xs text-muted dark:text-lavender/80">
              Real-time API search across r/scams, r/developersIndia, and r/recruitinghell
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
          >
            <span>Search Reddit</span>
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
                {/* AmbitionBox */}
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

                {/* Glassdoor */}
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
              <div className="flex items-center justify-between text-xs font-mono text-muted dark:text-lavender/70">
                <span>Source: {source || 'Reddit Official API'}</span>
                {checkedAt && <span>Checked: {new Date(checkedAt).toLocaleTimeString()}</span>}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {redditPosts.map((post) => (
                  <div
                    key={post.id || post.url}
                    className="vf-inner-card p-4 hover:border-violet/40 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet/15 dark:bg-violet/25 text-violet dark:text-lavender border border-violet/30 font-semibold">
                          {post.subreddit}
                        </span>
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
                        <span>{post.numComments ?? 0} comments</span>
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
            <div className="vf-inner-card p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet/15 dark:bg-violet/25 border border-violet/30 text-violet dark:text-lavender flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-vfslate dark:text-mist">
                  No Reddit Community Discussions Found
                </h3>
                <p className="text-xs text-muted dark:text-lavender/80 leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vf-btn-secondary px-4 py-2 text-xs font-semibold inline-flex items-center gap-2"
                >
                  <span>Search Reddit Directly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-3 border-t border-slate-300/40 dark:border-slate-600/40 text-[11px] text-muted dark:text-lavender/70 max-w-lg mx-auto">
                <strong>Evidence Integrity Guarantee:</strong> VeriFirm never fabricates employee reviews, AmbitionBox ratings, or synthetic Glassdoor statistics. If a live API lookup returns no data or fails, we link directly to official search pages.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
