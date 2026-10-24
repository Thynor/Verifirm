import React from 'react';
import { 
  MessageSquare, ThumbsUp, AlertTriangle, CheckCircle2, 
  ExternalLink, ShieldAlert, FileText, Search
} from 'lucide-react';

export function RedditSentimentSection({ redditAndReviews = {} }) {
  const {
    status = 'not_checked',
    source = null,
    checkedAt = null,
    redditPosts = [],
    searchUrl = 'https://www.reddit.com',
    message = 'No community discussions retrieved.'
  } = redditAndReviews;

  const hasPosts = Array.isArray(redditPosts) && redditPosts.length > 0;

  return (
    <div className="p-6 rounded-2xl bg-[#091020] border border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Reddit Discussions & Community Intel</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                hasPosts 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {hasPosts ? `${redditPosts.length} Real Threads` : 'No Data / Not Checked'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Real-time API search across r/scams, r/developersIndia, and r/recruitinghell
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-orange-400 hover:text-orange-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <span>Search Reddit</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Real Reddit Posts Feed */}
      {hasPosts ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Source: {source || 'Reddit Public Search API'}</span>
            {checkedAt && <span>Checked: {new Date(checkedAt).toLocaleTimeString()}</span>}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {redditPosts.map((post) => (
              <div
                key={post.id || post.url}
                className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700 font-semibold">
                      {post.subreddit}
                    </span>
                    {post.createdAt && (
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-orange-400" />
                      <span>{post.score ?? 0}</span>
                    </span>
                    <span>{post.numComments ?? 0} comments</span>
                  </div>
                </div>

                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-bold text-slate-100 hover:text-orange-300 transition-colors group"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span>{post.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-orange-400 shrink-0" />
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-semibold text-slate-200">
              No Reddit Community Discussions Found
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 text-xs font-medium transition-all"
            >
              <span>Search Reddit Directly</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 max-w-lg mx-auto">
            <strong>Evidence Integrity Guarantee:</strong> VeriFirm never fabricates employee reviews, AmbitionBox ratings, or synthetic Glassdoor statistics. If a live API lookup returns no data or fails, we link directly to official search pages.
          </div>
        </div>
      )}
    </div>
  );
}
