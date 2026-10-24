// Reddit Community Discussions Service - Official OAuth & Real API Fetches
// No simulated posts, manufactured upvotes, or fake reviews.

let cachedToken = null;
let tokenExpiresAt = 0;

const USER_AGENT = 'VeriFirmEvidenceAudit/2.0 (by /u/VeriFirmApp)';

async function getRedditOAuthToken(clientId, clientSecret) {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const authHeader = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT
      },
      body: 'grant_type=client_credentials',
      signal: AbortSignal.timeout(3500)
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.access_token) {
      cachedToken = data.access_token;
      // Expires in seconds; subtract 60s buffer
      tokenExpiresAt = Date.now() + Math.max(60, (data.expires_in - 60)) * 1000;
      return cachedToken;
    }
  } catch (e) {
    console.error('Reddit OAuth token request failed:', e.message);
  }
  return null;
}

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

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const query = `${cleanName} job offer`;

  try {
    let response;
    let sourceName = 'Reddit Public Search API';

    if (clientId && clientSecret) {
      const token = await getRedditOAuthToken(clientId, clientSecret);
      if (token) {
        sourceName = 'Official Reddit OAuth API';
        response = await fetch(`https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&limit=5&sort=relevance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': USER_AGENT
          },
          signal: AbortSignal.timeout(3500)
        });
      }
    }

    if (!response) {
      // Fallback to public search with descriptive User-Agent
      response = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5&sort=relevance`, {
        headers: {
          'User-Agent': USER_AGENT
        },
        signal: AbortSignal.timeout(3500)
      });
    }

    if (!response.ok) {
      return {
        status: 'not_checked',
        source: sourceName,
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
        source: sourceName,
        checkedAt,
        redditPosts: [],
        searchUrl,
        message: 'Reddit API returned non-JSON response. Direct community search link provided below.'
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
        source: sourceName,
        checkedAt,
        redditPosts: [],
        searchUrl,
        message: `No public Reddit discussions found for "${cleanName}".`
      };
    }

    return {
      status: 'verified',
      source: sourceName,
      checkedAt,
      redditPosts: realPosts,
      searchUrl,
      message: `Retrieved ${realPosts.length} real discussion thread(s) from Reddit.`
    };
  } catch (err) {
    return {
      status: 'not_checked',
      source: 'Reddit API',
      checkedAt,
      redditPosts: [],
      searchUrl,
      message: `Could not retrieve Reddit posts (${err.message}). Direct search link provided below.`
    };
  }
}
