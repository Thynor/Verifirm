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
    <div className="rounded-2xl bg-white dark:bg-[#091020] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-600/20 border border-orange-200 dark:border-orange-500/40 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Community Discussions & Fraud Reports (Reddit)</span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                hasPosts 
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                  : hasUserRatings
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}>
                {hasPosts ? `${redditPosts.length} Real Threads` : hasUserRatings ? 'User Ratings Recorded' : 'No Data / Not Checked'}
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Real-time API search across r/scams, r/developersIndia, and r/recruitinghell
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-orange-700 dark:text-orange-400 hover:underline px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all min-h-[36px]"
          >
            <span>Search Reddit</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
          {/* User-Provided AmbitionBox / Glassdoor Ratings */}
          {hasUserRatings && (
            <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Candidate Review Ratings</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                  user-provided
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* AmbitionBox */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">AmbitionBox Rating</span>
                    <span className="text-[10px] font-mono text-slate-400">user-provided</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      {userProvidedRatings.ambitionBoxRating ? `${userProvidedRatings.ambitionBoxRating} / 5.0` : 'Not entered'}
                    </span>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {userProvidedRatings.ambitionBoxReviews 
                      ? `Based on ${userProvidedRatings.ambitionBoxReviews.toLocaleString()} reviews` 
                      : 'Review count not entered'}
                  </p>
                </div>

                {/* Glassdoor */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Glassdoor Rating</span>
                    <span className="text-[10px] font-mono text-slate-400">user-provided</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      {userProvidedRatings.glassdoorRating ? `${userProvidedRatings.glassdoorRating} / 5.0` : 'Not entered'}
                    </span>
                    <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
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
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Source: {source || 'Reddit Official API'}</span>
                {checkedAt && <span>Checked: {new Date(checkedAt).toLocaleTimeString()}</span>}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {redditPosts.map((post) => (
                  <div
                    key={post.id || post.url}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-50 dark:bg-slate-800 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-slate-700 font-semibold">
                          {post.subreddit}
                        </span>
                        {post.createdAt && (
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5 text-orange-500" />
                          <span>{post.score ?? 0}</span>
                        </span>
                        <span>{post.numComments ?? 0} comments</span>
                      </div>
                    </div>

                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-300 transition-colors group"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <span>{post.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500 shrink-0" />
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No Reddit Community Discussions Found
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-600/20 dark:hover:bg-orange-600/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30 text-xs font-semibold transition-all"
                >
                  <span>Search Reddit Directly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 max-w-lg mx-auto">
                <strong>Evidence Integrity Guarantee:</strong> VeriFirm never fabricates employee reviews, AmbitionBox ratings, or synthetic Glassdoor statistics. If a live API lookup returns no data or fails, we link directly to official search pages.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
