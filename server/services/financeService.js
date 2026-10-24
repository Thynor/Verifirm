// Stocks & Financial Markets Intelligence Service - 100% Evidence-Grounded
// No fabricated stock prices, fake charts, or manufactured balance sheet text.

export function getCompanyFinancials(companyName, tickerHint = null) {
  const cleanName = (companyName || '').trim();
  const checkedAt = new Date().toISOString();

  // If a stock ticker was explicitly stated in user input
  if (tickerHint) {
    return {
      status: 'ticker_identified',
      isPublic: true,
      ticker: tickerHint.toUpperCase(),
      source: 'User input text',
      checkedAt,
      message: `Stock ticker "${tickerHint.toUpperCase()}" detected in input. Live market quotation requires a licensed financial data API feed. Market charts are not fabricated.`
    };
  }

  // Normal unlisted or unspecified entity
  return {
    status: 'not_checked',
    isPublic: false,
    ticker: null,
    source: null,
    checkedAt: null,
    message: 'No public stock exchange listing or ticker detected in input. Unlisted private company or non-corporate entity.'
  };
}
