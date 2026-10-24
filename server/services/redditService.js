// Reddit Community Discussions Service - 100% Real API Fetches
// No simulated posts, manufactured upvotes, or fake AmbitionBox/Glassdoor star ratings.

export async function getRedditAndReviewSentiment(companyName) {
  const cleanName = (companyName || '').trim();
  const searchUrl = cleanName
    ? `https://www.reddit.com/search/?q=${encodeURIComponent(cleanName + ' job offer interview review')}`
    : 'https://www.reddit.com';
  const checkedAt = new Date().toISOString();

  if (!cleanName || cleanName.toLowerCase() === 'unspecified organization' || cleanName.toLowerCase() === 'unspecified') {
    return {
      status: 'not_checked',
      source: null,
      checkedAt: null,
      redditPosts: [],
      searchUrl,
      message: 'No company name provided for community discussion search.'
    };
  }

  try {
    const query = `${cleanName} job offer`;
    const apiUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5&sort=relevance`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'VeriFirmEvidenceAudit/2.0 (Mozilla/5.0)'
      },
      signal: AbortSignal.timeout(3500)
    });

    if (!response.ok) {
      return {
        status: 'not_checked',
        source: 'Reddit Public Search API',
        checkedAt,
        redditPosts: [],
        searchUrl,
        message: `Reddit API returned HTTP ${response.status}. Direct search link provided below.`
      };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return {
        status: 'not_checked',
        source: 'Reddit Public Search API',
        checkedAt,
        redditPosts: [],
        searchUrl,
        message: 'Reddit API blocked unauthenticated query. Direct community search link provided below.'
      };
    }

    const data = await response.json();
    const children = Array.isArray(data.data?.children) ? data.data.children : [];
    
    const realPosts = children
      .filter(c => c?.data?.title && c?.data?.permalink)
      .slice(0, 5)
      .map((c, idx) => ({
        id: c.data.id || `reddit-${idx}`,
        title: c.data.title,
        subreddit: c.data.subreddit_name_prefixed || `r/${c.data.subreddit}`,
        score: c.data.score || 0,
        url: `https://www.reddit.com${c.data.permalink}`,
        numComments: c.data.num_comments || 0,
        createdAt: c.data.created_utc ? new Date(c.data.created_utc * 1000).toISOString() : null,
        author: c.data.author || 'reddit_user'
      }));

    if (realPosts.length === 0) {
      return {
        status: 'no_posts_found',
        source: 'Reddit Public Search API',
        checkedAt,
        redditPosts: [],
        searchUrl,
        message: `No public Reddit discussions found for "${cleanName}".`
      };
    }

    return {
      status: 'verified',
      source: 'Reddit Public Search API',
      checkedAt,
      redditPosts: realPosts,
      searchUrl,
      message: `Retrieved ${realPosts.length} real discussion thread(s) from Reddit.`
    };
  } catch (err) {
    return {
      status: 'not_checked',
      source: 'Reddit Public Search API',
      checkedAt,
      redditPosts: [],
      searchUrl,
      message: `Could not retrieve Reddit posts (${err.message}). Direct search link provided below.`
    };
  }
}
