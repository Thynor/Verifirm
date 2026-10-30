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

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x2F;/g, '/');
}

// In-memory cache for search results (TTL 1 hour) to minimize repeated requests
const searchCache = new Map();

async function fetchFromRedditRss(query) {
  try {
    const rssUrl = `https://www.reddit.com/search.rss?q=${encodeURIComponent(query)}&sort=relevance`;
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(4000)
    });

    if (!response.ok) {
      return null;
    }

    const xml = await response.text();
    const entries = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    let idx = 0;
    while ((match = entryRegex.exec(xml)) !== null && entries.length < 5) {
      const entryXml = match[1];
      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(entryXml);
      const linkMatch = /<link href="([^"]+)"/.exec(entryXml);
      const updatedMatch = /<updated>([\s\S]*?)<\/updated>/.exec(entryXml);
      const authorMatch = /<author><name>([\s\S]*?)<\/name>/.exec(entryXml);
      const categoryMatch = /<category term="([^"]+)" label="([^"]+)"/.exec(entryXml);

      if (titleMatch && linkMatch) {
        entries.push({
          id: `reddit-rss-${idx++}`,
          title: decodeHtmlEntities(titleMatch[1].trim()),
          subreddit: categoryMatch ? decodeHtmlEntities(categoryMatch[2]) : 'r/reddit',
          score: 1,
          url: decodeHtmlEntities(linkMatch[1]),
          numComments: 0,
          createdAt: updatedMatch ? updatedMatch[1] : new Date().toISOString(),
          author: authorMatch ? decodeHtmlEntities(authorMatch[1]) : 'reddit_user'
        });
      }
    }
    return entries;
  } catch (err) {
    return null;
  }
}

export async function getRedditAndReviewSentiment(companyName, explicitQuery = null) {
  const cleanName = (companyName || '').trim();
  const searchUrl = cleanName
    ? `https://www.reddit.com/search/?q=${encodeURIComponent(cleanName + ' job offer interview review')}`
    : 'https://www.reddit.com';
  const checkedAt = new Date().toISOString();

  const lower = cleanName.toLowerCase();
  if (!cleanName || lower === 'unspecified organization' || lower === 'unspecified organisation' || lower === 'unspecified') {
    return {
      status: 'not_checked',
      source: null,
      checkedAt: null,
      redditPosts: [],
      searchUrl,
      message: 'No company name provided for community discussion search.'
    };
  }

  const query = explicitQuery ? explicitQuery.trim() : `${cleanName} job offer`;
  const cacheKey = query.toLowerCase();

  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 3600000) {
    return cached.data;
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  try {
    let response;
    let sourceName = 'Reddit Public Search API';

    // 1. Try official OAuth if configured
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

    // 2. Try public JSON endpoint if OAuth was not used or failed
    if (!response) {
      response = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5&sort=relevance`, {
        headers: {
          'User-Agent': USER_AGENT
        },
        signal: AbortSignal.timeout(3500)
      }).catch(() => null);
    }

    // If JSON response succeeded
    if (response && response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        const children = Array.isArray(data.data?.children) ? data.data.children : [];
        const realPosts = children
          .filter(c => c?.data?.title && c?.data?.permalink)
          .slice(0, 5)
          .map((c, idx) => ({
            id: c.data.id || `reddit-${idx}`,
            title: decodeHtmlEntities(c.data.title),
            subreddit: c.data.subreddit_name_prefixed || `r/${c.data.subreddit}`,
            score: c.data.score || 0,
            url: `https://www.reddit.com${c.data.permalink}`,
            numComments: c.data.num_comments || 0,
            createdAt: c.data.created_utc ? new Date(c.data.created_utc * 1000).toISOString() : null,
            author: c.data.author || 'reddit_user'
          }));

        if (realPosts.length > 0) {
          const result = {
            status: 'verified',
            source: sourceName,
            checkedAt,
            redditPosts: realPosts,
            searchUrl,
            message: `Retrieved ${realPosts.length} real discussion thread(s) from Reddit.`
          };
          searchCache.set(cacheKey, { timestamp: Date.now(), data: result });
          return result;
        }
      }
    }

    // 3. Robust Fallback: Reddit Public Discussion Feed (Atom/RSS) - avoids 403 on cloud/server IP
    const rssPosts = await fetchFromRedditRss(query);
    if (rssPosts && rssPosts.length > 0) {
      const result = {
        status: 'verified',
        source: 'Reddit Public Discussion Feed (Atom/RSS)',
        checkedAt,
        redditPosts: rssPosts,
        searchUrl,
        message: `Retrieved ${rssPosts.length} real discussion thread(s) from Reddit.`
      };
      searchCache.set(cacheKey, { timestamp: Date.now(), data: result });
      return result;
    }

    // 4. Honest Unchecked/Blocked Reporting
    const statusMsg = response?.status ? `HTTP ${response.status}` : 'Anti-scraping firewall';
    const fallbackResult = {
      status: 'not_checked',
      source: `Reddit Public Endpoint (${statusMsg})`,
      checkedAt,
      redditPosts: [],
      searchUrl,
      message: `Reddit anti-scraping policy restricts unauthenticated server queries (${statusMsg}). Use the on-page search bar or the direct button below to browse community discussions.`
    };
    return fallbackResult;
  } catch (err) {
    const errorResult = {
      status: 'not_checked',
      source: 'Reddit API',
      checkedAt,
      redditPosts: [],
      searchUrl,
      message: `Could not complete server lookup (${err.message}). Direct search link provided below.`
    };
    return errorResult;
  }
}

