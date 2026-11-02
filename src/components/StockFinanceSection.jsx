import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, 
  CheckCircle2, Building, BarChart2, ShieldCheck, HelpCircle, ExternalLink, Search,
  ChevronDown, ChevronUp, Table as TableIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

export function StockFinanceSection({ stocks = {}, defaultExpanded = true, companyName = '' }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTimeframe, setActiveTimeframe] = useState('1Y');

  const {
    status = 'not_checked',
    isPublic = false,
    exchange = 'Unlisted',
    ticker = null,
    currentPrice = null,
    change = '0.00%',
    changePositive = true,
    marketCap = null,
    peRatio = null,
    dividendYield = null,
    yearRange = null,
    timeframes = {},
    financialAnalysis = null,
    message = null,
    userProvidedFinancials = null,
    growthSummary = null
  } = stocks;

  const targetCompany = (companyName || stocks.companyName || '').trim();
  const isUserProvided = status === 'user_provided' || Boolean(userProvidedFinancials && userProvidedFinancials.length > 0);
  const hasChartData = isPublic && currentPrice && currentPrice !== 'N/A' && timeframes && Object.keys(timeframes).length > 0;
  const currentData = hasChartData ? (timeframes[activeTimeframe] || timeframes['1Y'] || []) : [];

  const searchFinanceUrl = ticker 
    ? `https://www.google.com/finance/quote/${encodeURIComponent(ticker)}`
    : `https://www.google.com/finance/search?q=${encodeURIComponent(targetCompany || '')}`;

  return (
    <div className="vf-card overflow-hidden">
      {/* Collapsible Section Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-violet/5 dark:hover:bg-violet/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet/15 dark:bg-violet/25 border border-violet/30 flex items-center justify-center text-violet dark:text-lavender shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-vfslate dark:text-mist flex items-center gap-2 flex-wrap">
              <span>Financial & Stock Market Verification</span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
                isUserProvided
                  ? 'bg-violet/15 text-violet dark:text-lavender border-violet/30 font-semibold'
                  : isPublic 
                    ? 'bg-status-success/10 text-status-success border-status-success/30 font-bold' 
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/35 font-bold'
              }`}>
                {isUserProvided ? 'User-Provided Financials' : isPublic ? 'Publicly Listed' : '⚠️ Unlisted / No Market Value (Warning)'}
              </span>
            </h2>
            <p className="text-xs text-muted dark:text-lavender/80">
              Verified public stock listings on NSE/BSE/NASDAQ and public market filings
            </p>
          </div>
        </div>

        {/* Action button & Chevron toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          {ticker ? (
            <div className="text-right mr-2">
              <span className="text-[10px] font-mono text-muted dark:text-lavender/80 uppercase">{exchange || 'Public Exchange'}</span>
              <div className="text-sm font-mono font-bold text-violet dark:text-lavender">{ticker}</div>
            </div>
          ) : (
            <a
              href={searchFinanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
            >
              <span>Search Finance</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

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
          {/* User-Provided Financials Breakdown (if entered) */}
          {isUserProvided && userProvidedFinancials && (
            <div className="vf-inner-card p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-violet dark:text-lavender flex items-center gap-1.5">
                  <TableIcon className="w-4 h-4" />
                  <span>5-Year Financial Record</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet/15 dark:bg-violet/25 text-violet dark:text-lavender border border-violet/30 font-semibold">
                  [user-provided]
                </span>
              </div>

              {growthSummary && (
                <div className="p-3 rounded-lg bg-violet/10 dark:bg-violet/20 border border-violet/25 text-xs font-medium text-vfslate dark:text-mist">
                  📈 <strong>Financial Trend:</strong> {growthSummary}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-mist/80 dark:bg-[#2f3242] text-muted dark:text-lavender/80 font-semibold uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Year</th>
                      <th className="p-2.5">Revenue</th>
                      <th className="p-2.5 rounded-r-lg">Net Profit / Loss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300/40 dark:divide-slate-700/40">
                    {userProvidedFinancials.map((row, idx) => (
                      <tr key={idx} className="hover:bg-violet/5 dark:hover:bg-violet/10">
                        <td className="p-2.5 font-bold font-mono text-vfslate dark:text-mist">{row.year}</td>
                        <td className="p-2.5 font-mono text-muted dark:text-mist/90">
                          {row.revenue ? `₹${Number(row.revenue).toLocaleString()}` : 'N/A'}
                        </td>
                        <td className="p-2.5 font-mono">
                          {row.profit !== undefined && row.profit !== '' ? (
                            <span className={Number(row.profit) >= 0 ? 'text-status-success font-semibold' : 'text-status-danger font-semibold'}>
                              {Number(row.profit) >= 0 ? '+' : ''}₹{Number(row.profit).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Main Stock Dashboard */}
          {hasChartData ? (
            <div className="space-y-6">
              {/* Price Header & Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="vf-inner-card p-4">
                  <span className="text-[11px] font-mono uppercase text-muted dark:text-lavender/80">Share Price</span>
                  <div className="text-2xl font-black text-vfslate dark:text-mist font-mono mt-1">{currentPrice}</div>
                  <div className={`text-xs font-mono font-semibold flex items-center gap-1 mt-1 ${
                    changePositive ? 'text-status-success' : 'text-status-danger'
                  }`}>
                    {changePositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{change}</span>
                  </div>
                </div>

                <div className="vf-inner-card p-4">
                  <span className="text-[11px] font-mono uppercase text-muted dark:text-lavender/80">Market Cap</span>
                  <div className="text-lg font-bold text-vfslate dark:text-mist font-mono mt-1">{marketCap || 'N/A'}</div>
                  <p className="text-[11px] text-muted dark:text-lavender/70 font-mono mt-1">Exchange Valuation</p>
                </div>

                <div className="vf-inner-card p-4">
                  <span className="text-[11px] font-mono uppercase text-muted dark:text-lavender/80">P/E Ratio</span>
                  <div className="text-lg font-bold text-vfslate dark:text-mist font-mono mt-1">{peRatio || 'N/A'}</div>
                  <p className="text-[11px] text-muted dark:text-lavender/70 font-mono mt-1">Earnings Multiple</p>
                </div>

                <div className="vf-inner-card p-4">
                  <span className="text-[11px] font-mono uppercase text-muted dark:text-lavender/80">52-Week Range</span>
                  <div className="text-xs font-bold text-vfslate dark:text-mist font-mono mt-1">{yearRange || 'N/A'}</div>
                  <p className="text-[11px] text-muted dark:text-lavender/70 font-mono mt-1">Div Yield: {dividendYield || 'N/A'}</p>
                </div>
              </div>

              {/* Interactive Stock Chart */}
              <div className="vf-inner-card p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-vfslate dark:text-mist">Stock Performance Graph</h3>
                    <p className="text-xs text-muted dark:text-lavender/80">Historical trading prices</p>
                  </div>

                  {/* Timeframe Toggles */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-white/70 dark:bg-[#2f3242]/70 border border-slate-300/40 dark:border-slate-600/40">
                    {['1D', '1M', '6M', '1Y', '5Y'].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setActiveTimeframe(tf)}
                        className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                          activeTimeframe === tf
                            ? 'bg-violet text-white font-bold shadow-sm'
                            : 'text-muted dark:text-lavender/80 hover:text-vfslate dark:hover:text-mist'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData}>
                      <defs>
                        <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8458B3" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#D0BDF4" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#8458B3" opacity={0.15} />
                      <XAxis 
                        dataKey="time" 
                        stroke="#5d6180" 
                        fontSize={11} 
                        tickLine={false} 
                      />
                      <YAxis 
                        stroke="#5d6180" 
                        fontSize={11} 
                        tickLine={false} 
                        domain={['auto', 'auto']}
                        tickFormatter={(val) => `₹${val}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#494D5F',
                          borderColor: '#8458B3',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontFamily: 'monospace'
                        }}
                        formatter={(value) => [`₹${value}`, 'Share Price']}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#8458B3"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#stockGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {financialAnalysis && (financialAnalysis.growthDrivers || financialAnalysis.summary) && (
                <div className="vf-inner-card p-5 space-y-3">
                  <h4 className="text-sm font-semibold text-vfslate dark:text-mist flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-violet dark:text-lavender" />
                    <span>Financial Analysis</span>
                  </h4>
                  <p className="text-xs text-muted dark:text-mist/90 leading-relaxed">
                    {financialAnalysis.summary || financialAnalysis.growthDrivers}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Unlisted / Non-Public Entity View - Prominent Warning */
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-amber-900 dark:text-amber-300">
                      ⚠️ Warning: Unregistered on Stock Exchanges / No Market Capitalization
                    </h3>
                    <p className="text-xs text-vfslate/90 dark:text-mist/90 leading-relaxed">
                      {message || `No public stock exchange listing or equity valuation could be verified for "${targetCompany || 'this organization'}".`}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/80 dark:bg-[#2f3242]/80 border border-amber-500/20 text-xs space-y-2">
                  <span className="font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px] font-mono">
                    Candidate Advisory on Unlisted Entities:
                  </span>
                  <p className="text-muted dark:text-mist/90 leading-relaxed">
                    Unlisted private entities or unregistered organizations do not publish daily stock quotes or public quarterly filings on exchanges like NSE, BSE, NASDAQ, or NYSE. If an offer promises high-value stock options (ESOPs) or pre-IPO equity in lieu of salary, demand certified statutory documentation before accepting.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-amber-500/20">
                    <span className="font-mono text-amber-800 dark:text-amber-300 text-[10px] uppercase font-bold">Unlisted Operations</span>
                    <p className="text-vfslate dark:text-mist/90 mt-1 text-[11px]">
                      Private firms are governed by the Ministry of Corporate Affairs (MCA) and do not publish daily market stock quotes.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-[#2f3242]/70 border border-amber-500/20">
                    <span className="font-mono text-amber-800 dark:text-amber-300 text-[10px] uppercase font-bold">Equity Offer Diligence</span>
                    <p className="text-vfslate dark:text-mist/90 mt-1 text-[11px]">
                      Never pay security fees or money for employee share allocation. Genuine ESOPs require no upfront capital from candidates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white/60 dark:bg-[#2f3242]/60 border border-slate-300/40 dark:border-slate-600/40 text-xs">
                <span className="text-muted dark:text-lavender/80">
                  Search financial markets for alternative listed corporate parents or securities:
                </span>
                <a
                  href={`https://www.google.com/finance/search?q=${encodeURIComponent(targetCompany || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vf-btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 font-mono shrink-0 font-semibold"
                >
                  <span>Search Google Finance ↗</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
