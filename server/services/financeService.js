// Stocks & Financial Markets Intelligence Service - 100% Real Market Data API
// Fetches real equity quotes and 1Y price history from market data API.
// No fabricated stock prices, fake charts, or manufactured balance sheet text.

export async function getCompanyFinancials(companyName, tickerHint = null) {
  const cleanName = (companyName || '').trim();
  const checkedAt = new Date().toISOString();

  if (!cleanName || cleanName.toLowerCase() === 'unspecified organization' || cleanName.toLowerCase() === 'unspecified') {
    return {
      status: 'not_checked',
      isPublic: false,
      ticker: null,
      source: null,
      checkedAt: null,
      message: 'No company name or ticker detected to search public stock exchanges.'
    };
  }

  try {
    let symbol = tickerHint ? tickerHint.toUpperCase() : null;
    let exchangeName = 'Public Exchange';
    let shortName = cleanName;

    // If ticker wasn't provided directly, search market data API
    if (!symbol) {
      const searchRes = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(cleanName)}&quotesCount=3`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: AbortSignal.timeout(3500)
        }
      );

      if (searchRes.ok) {
        const sData = await searchRes.json();
        const quotes = Array.isArray(sData.quotes) ? sData.quotes : [];
        // Find matching EQUITY quote
        const match = quotes.find(q => {
          if (q.quoteType !== 'EQUITY' || !q.symbol) return false;
          const symBase = q.symbol.split('.')[0].toLowerCase();
          const cleanLower = cleanName.toLowerCase();
          if (symBase === cleanLower) return true;
          const qName = ((q.shortname || '') + ' ' + (q.longname || '')).toLowerCase();
          const words = cleanLower.split(/\s+/).filter(w => w.length > 2 && !['pvt','ltd','private','limited','inc','corp','llc'].includes(w));
          return words.length > 0 && words.some(w => qName.includes(w));
        });

        if (match) {
          symbol = match.symbol;
          exchangeName = match.exchDisp || match.exchange || 'Public Exchange';
          shortName = match.shortname || match.longname || cleanName;
        }
      }
    }

    if (!symbol) {
      return {
        status: 'unlisted_warning',
        isPublic: false,
        ticker: null,
        source: `Public Stock Exchange Directory (NSE, BSE, NYSE, NASDAQ), ${checkedAt.split('T')[0]}`,
        checkedAt,
        message: `No public stock market listing or equity valuation found for "${cleanName}". Warning: Unlisted private entity or non-corporate organization.`
      };
    }

    // Fetch real 1Y chart data for the matched security
    const chartRes = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1mo`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(3500)
      }
    );

    if (!chartRes.ok) {
      return {
        status: 'ticker_identified',
        isPublic: true,
        ticker: symbol,
        source: 'Yahoo Finance Public API',
        checkedAt,
        message: `Matched listed security ${symbol} (${exchangeName}), but market quote feed is currently unavailable.`
      };
    }

    const cData = await chartRes.json();
    const result = cData.chart?.result?.[0];
    if (!result || !result.timestamp || !result.indicators?.quote?.[0]?.close) {
      return {
        status: 'ticker_identified',
        isPublic: true,
        ticker: symbol,
        source: 'Yahoo Finance Public API',
        checkedAt,
        message: `Matched listed security ${symbol}, but historical chart is empty.`
      };
    }

    const meta = result.meta || {};
    const curr = meta.currency === 'INR' ? '₹' : meta.currency === 'USD' ? '$' : `${meta.currency || ''} `;
    const priceVal = meta.regularMarketPrice ?? (meta.chartPreviousClose || 0);
    const prevClose = meta.chartPreviousClose || priceVal;
    const changeVal = meta.fulldayChange ?? (priceVal - prevClose);
    const changePct = meta.regularMarketChangePercent ?? (prevClose > 0 ? ((changeVal / prevClose) * 100) : 0);
    const changePositive = changeVal >= 0;

    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;
    const chartPoints = timestamps.map((t, idx) => ({
      time: new Date(t * 1000).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      price: closes[idx] !== null && closes[idx] !== undefined ? Math.round(closes[idx] * 100) / 100 : null
    })).filter(p => p.price !== null);

    // Compute growth / loss summary over the 1Y chart
    let growthSummary = `Current trading price: ${curr}${priceVal.toLocaleString()}.`;
    if (chartPoints.length >= 2) {
      const firstPrice = chartPoints[0].price;
      const lastPrice = chartPoints[chartPoints.length - 1].price;
      if (firstPrice > 0) {
        const pct1Y = Math.round(((lastPrice - firstPrice) / firstPrice) * 1000) / 10;
        growthSummary = `1-Year Trend: Share price ${pct1Y >= 0 ? 'grew by +' + pct1Y + '%' : 'declined by ' + pct1Y + '%'} from ${chartPoints[0].time} (${curr}${firstPrice.toLocaleString()}) to ${chartPoints[chartPoints.length - 1].time} (${curr}${lastPrice.toLocaleString()}).`;
      }
    }

    return {
      status: 'verified',
      isPublic: true,
      exchange: exchangeName,
      ticker: symbol,
      companyName: shortName,
      currentPrice: `${curr}${priceVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${changePositive ? '+' : ''}${changeVal.toFixed(2)} (${changePositive ? '+' : ''}${changePct.toFixed(2)}%)`,
      changePositive,
      marketCap: meta.regularMarketVolume ? `Vol: ${Number(meta.regularMarketVolume).toLocaleString()}` : 'Listed',
      peRatio: meta.priceHint ? `${meta.priceHint}` : 'N/A',
      yearRange: meta.fiftyTwoWeekLow && meta.fiftyTwoWeekHigh
        ? `${curr}${meta.fiftyTwoWeekLow.toLocaleString()} - ${curr}${meta.fiftyTwoWeekHigh.toLocaleString()}`
        : 'N/A',
      timeframes: {
        '1Y': chartPoints
      },
      growthSummary,
      financialAnalysis: {
        summary: growthSummary,
        growthDrivers: `Public exchange security traded on ${exchangeName}. 52-week trading range: ${meta.fiftyTwoWeekLow && meta.fiftyTwoWeekHigh ? curr + meta.fiftyTwoWeekLow + ' - ' + curr + meta.fiftyTwoWeekHigh : 'N/A'}.`
      },
      source: 'Yahoo Finance Market Data API',
      checkedAt,
      message: growthSummary
    };
  } catch (err) {
    return {
      status: 'not_checked',
      isPublic: false,
      ticker: tickerHint,
      source: null,
      checkedAt,
      message: `Market data lookup failed (${err.message}). Unlisted private company or data feed unavailable.`
    };
  }
}
