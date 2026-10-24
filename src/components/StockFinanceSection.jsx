import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, 
  CheckCircle2, Building, BarChart2, ShieldCheck, HelpCircle, ExternalLink, Search
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

export function StockFinanceSection({ stocks = {} }) {
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
    message = null
  } = stocks;

  const hasChartData = isPublic && currentPrice && currentPrice !== 'N/A' && timeframes && Object.keys(timeframes).length > 0;
  const currentData = hasChartData ? (timeframes[activeTimeframe] || timeframes['1Y'] || []) : [];

  const searchFinanceUrl = ticker 
    ? `https://www.google.com/finance/quote/${encodeURIComponent(ticker)}`
    : `https://www.google.com/finance`;

  return (
    <div className="p-6 rounded-2xl bg-[#091020] border border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Financial & Stock Market Verification</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isPublic 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {isPublic ? 'Publicly Listed' : 'Private / Unlisted'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Verified public stock listings on NSE/BSE/NASDAQ and public market filings
            </p>
          </div>
        </div>

        {/* Ticker / Exchange Badge */}
        <div className="flex items-center gap-3">
          {ticker ? (
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">{exchange || 'Public Exchange'}</span>
              <div className="text-sm font-mono font-bold text-cyan-300">{ticker}</div>
            </div>
          ) : (
            <a
              href={searchFinanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
            >
              <span>Search Finance</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Main Stock Dashboard */}
      {hasChartData ? (
        <div className="space-y-6">
          {/* Price Header & Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400">Share Price</span>
              <div className="text-2xl font-black text-white font-mono mt-1">{currentPrice}</div>
              <div className={`text-xs font-mono font-semibold flex items-center gap-1 mt-1 ${
                changePositive ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {changePositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{change}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400">Market Cap</span>
              <div className="text-lg font-bold text-slate-100 font-mono mt-1">{marketCap || 'N/A'}</div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">Exchange Valuation</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400">P/E Ratio</span>
              <div className="text-lg font-bold text-slate-100 font-mono mt-1">{peRatio || 'N/A'}</div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Earnings Multiple</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400">52-Week Range</span>
              <div className="text-xs font-bold text-slate-100 font-mono mt-1">{yearRange || 'N/A'}</div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Div Yield: {dividendYield || 'N/A'}</p>
            </div>
          </div>

          {/* Interactive Stock Chart */}
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Stock Performance Graph</h3>
                <p className="text-xs text-slate-400">Historical trading prices</p>
              </div>

              {/* Timeframe Toggles */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
                {['1D', '1M', '6M', '1Y', '5Y'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                      activeTimeframe === tf
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
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
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#091020',
                      borderColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                    formatter={(value) => [`₹${value}`, 'Share Price']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#stockGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {financialAnalysis && (financialAnalysis.growthDrivers || financialAnalysis.summary) && (
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Financial Analysis</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {financialAnalysis.summary || financialAnalysis.growthDrivers}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Unlisted / Non-Public Entity View */
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Unlisted Private Entity / No Public Stock Listing
              </h3>
              <p className="text-xs text-slate-400">
                {message || 'No public stock exchange ticker detected in input text.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] font-mono">
              Market Transparency Standard:
            </span>
            <p className="text-slate-400 leading-relaxed">
              VeriFirm does not manufacture stock prices, valuation multiples, or synthetic historical performance charts. Public equity analysis requires a verified stock exchange listing (e.g. NSE, BSE, NASDAQ).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="font-mono text-slate-400 text-[10px] uppercase">Startup / Private Operations</span>
              <p className="text-slate-300 mt-1">
                Legitimate private firms are governed by the Ministry of Corporate Affairs (MCA) and do not publish daily stock quotes. Check CIN records for capital details.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="font-mono text-slate-400 text-[10px] uppercase">Candidate Advisory</span>
              <p className="text-slate-300 mt-1">
                If an unknown entity offers stock options (ESOPs) in lieu of salary, demand written articles of association or cap table evidence.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
