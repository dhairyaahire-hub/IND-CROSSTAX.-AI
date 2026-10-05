import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  RefreshCw, 
  TrendingUp, 
  Check, 
  Copy, 
  HelpCircle, 
  ShieldCheck, 
  DollarSign, 
  Zap, 
  AlertCircle,
  Building2,
  Calendar
} from 'lucide-react';
import { GLOBAL_COUNTRY_TP_PROFILES } from '../data/treatyDatabase';

interface RealTimeCurrencyConverterProps {
  residentCountry: string; // e.g. 'IN'
  sourceCountry: string;   // e.g. 'US'
  currentCurrency: string; // e.g. 'USD'
  currentAnnualValue: number;
  currentCostBase: number;
  onApplyValues?: (newCurrency: string, newAnnualValue: number, newCostBase: number) => void;
}

// Popular international currencies with flags and symbols
export const CURRENCY_METADATA: Record<string, { name: string; symbol: string; flag: string }> = {
  USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  AED: { name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' }
};

// Helper: Map country code to primary currency
const getCountryDefaultCurrency = (code: string): string => {
  const profile = GLOBAL_COUNTRY_TP_PROFILES[code];
  if (profile && profile.currency) return profile.currency;
  const map: Record<string, string> = {
    IN: 'INR',
    US: 'USD',
    GB: 'GBP',
    SG: 'SGD',
    AE: 'AED',
    DE: 'EUR',
    NL: 'EUR',
    FR: 'EUR',
    IE: 'EUR',
    JP: 'JPY',
    CA: 'CAD',
    AU: 'AUD',
    CH: 'CHF'
  };
  return map[code] || 'USD';
};

// Format currency numbers with Indian or Western numbering
const formatMoney = (amount: number, currency: string): string => {
  if (isNaN(amount)) return '0.00';
  const meta = CURRENCY_METADATA[currency] || { symbol: currency };
  
  if (currency === 'INR') {
    // Format in Indian lakhs / crores
    return `${meta.symbol} ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  }
  return `${meta.symbol} ${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
};

export const RealTimeCurrencyConverter: React.FC<RealTimeCurrencyConverterProps> = ({
  residentCountry,
  sourceCountry,
  currentCurrency,
  currentAnnualValue,
  currentCostBase,
  onApplyValues
}) => {
  // Determine source & resident currencies
  const residentCurr = getCountryDefaultCurrency(residentCountry);
  const sourceCurr = getCountryDefaultCurrency(sourceCountry);

  const [fromCurrency, setFromCurrency] = useState<string>(currentCurrency || sourceCurr);
  const [toCurrency, setToCurrency] = useState<string>(
    currentCurrency === residentCurr ? sourceCurr : residentCurr
  );
  
  const [amount, setAmount] = useState<number>(currentAnnualValue || 250000);
  const [costBaseAmount, setCostBaseAmount] = useState<number>(currentCostBase || 200000);
  
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [rateSource, setRateSource] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Sync internal amount when props change externally
  useEffect(() => {
    if (currentAnnualValue && currentAnnualValue !== amount) {
      setAmount(currentAnnualValue);
    }
  }, [currentAnnualValue]);

  useEffect(() => {
    if (currentCostBase && currentCostBase !== costBaseAmount) {
      setCostBaseAmount(currentCostBase);
    }
  }, [currentCostBase]);

  // Sync corridor changes
  useEffect(() => {
    const resC = getCountryDefaultCurrency(residentCountry);
    const srcC = getCountryDefaultCurrency(sourceCountry);
    if (currentCurrency) {
      setFromCurrency(currentCurrency);
      setToCurrency(currentCurrency === resC ? srcC : resC);
    } else {
      setFromCurrency(srcC);
      setToCurrency(resC);
    }
  }, [residentCountry, sourceCountry]);

  // Fetch real-time exchange rates from server API
  const fetchRates = async (base: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/forex-rates?base=${encodeURIComponent(base)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.rates) {
          setRates(data.rates);
          setLastUpdated(data.lastUpdated || new Date().toLocaleTimeString());
          setRateSource(data.source || 'live_interbank_feed');
        }
      }
    } catch (err) {
      console.warn('Failed to fetch real-time forex rates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates(fromCurrency);
  }, [fromCurrency]);

  // Calculate conversion rates
  const currentRate = rates[toCurrency] || (toCurrency === fromCurrency ? 1 : 0);
  const inverseRate = currentRate > 0 ? 1 / currentRate : 0;

  const convertedAnnualValue = amount * currentRate;
  const convertedCostBase = costBaseAmount * currentRate;
  const convertedOperatingProfit = convertedAnnualValue - convertedCostBase;
  const originalOperatingProfit = amount - costBaseAmount;
  const profitMarginPercent = costBaseAmount > 0 ? (originalOperatingProfit / costBaseAmount) * 100 : 0;

  // Swap currencies
  const handleSwapCurrencies = () => {
    const nextFrom = toCurrency;
    const nextTo = fromCurrency;
    setFromCurrency(nextFrom);
    setToCurrency(nextTo);
    // Convert current amount to new from-currency
    if (currentRate > 0) {
      setAmount(Number(convertedAnnualValue.toFixed(2)));
      setCostBaseAmount(Number(convertedCostBase.toFixed(2)));
    }
  };

  // 1-Click Apply to Form
  const handleApplyToForm = () => {
    if (onApplyValues) {
      onApplyValues(toCurrency, Math.round(convertedAnnualValue), Math.round(convertedCostBase));
      setApplied(true);
      setTimeout(() => setApplied(false), 2500);
    }
  };

  // Copy TP Forex Summary
  const handleCopySummary = () => {
    const summary = `--- CROSS-BORDER FOREX & TRANSFER PRICING BENCHMARK ---
Corridor: ${fromCurrency} / ${toCurrency} (Resident: ${residentCountry}, Source: ${sourceCountry})
Exchange Rate: 1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency} (Inverse: 1 ${toCurrency} = ${inverseRate.toFixed(6)} ${fromCurrency})
Invoiced Value: ${formatMoney(amount, fromCurrency)} = ${formatMoney(convertedAnnualValue, toCurrency)}
Operating Cost Base: ${formatMoney(costBaseAmount, fromCurrency)} = ${formatMoney(convertedCostBase, toCurrency)}
Arm's Length Profit: ${formatMoney(originalOperatingProfit, fromCurrency)} = ${formatMoney(convertedOperatingProfit, toCurrency)} (${profitMarginPercent.toFixed(1)}% Markup)
Reference Rate Date: ${lastUpdated || 'Current'}
Governing Rule: CBDT Rule 115 / OECD BEPS Chapter VI Forex Parity`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Indian statutory limits (Rule 10TD Safe Harbour & Section 92E Form 3CEB)
  const isTargetInr = toCurrency === 'INR';
  const isSourceInr = fromCurrency === 'INR';
  const inrValue = isTargetInr ? convertedAnnualValue : (isSourceInr ? amount : (amount * (rates['INR'] || 96.35)));
  const inrCrores = inrValue / 10000000;

  const residentProfile = GLOBAL_COUNTRY_TP_PROFILES[residentCountry] || GLOBAL_COUNTRY_TP_PROFILES['IN'];
  const sourceProfile = GLOBAL_COUNTRY_TP_PROFILES[sourceCountry] || GLOBAL_COUNTRY_TP_PROFILES['US'];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-slate-700/80 rounded-2xl p-5 text-white shadow-xl space-y-4">
      {/* Top Banner: Real-Time Ticker & Trade Corridor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Real-Time Forex &amp; TP Parity Engine
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE INTERBANK
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live exchange rates for cross-border invoicing, CBDT Rule 115 compliance, and arm&apos;s length markups
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => fetchRates(fromCurrency)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white transition cursor-pointer"
            title="Refresh Live Forex Rates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span className="text-[11px]">{isLoading ? 'Fetching...' : 'Refresh Rate'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Corridor Badges & Live Rate Ticker */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 border border-slate-800 p-3 rounded-xl text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-semibold">Active Corridor:</span>
              <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-bold text-white flex items-center gap-1">
                <span>{sourceProfile.flag} {sourceProfile.countryName} ({fromCurrency})</span>
                <span className="text-amber-400">&rarr;</span>
                <span>{residentProfile.flag} {residentProfile.countryName} ({toCurrency})</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <div className="font-mono text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                1 {fromCurrency} = {currentRate ? currentRate.toFixed(4) : '...'} {toCurrency}
              </div>
              <div className="font-mono text-slate-400 hidden md:block">
                (1 {toCurrency} = {inverseRate ? inverseRate.toFixed(6) : '...'} {fromCurrency})
              </div>
              {lastUpdated && (
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{lastUpdated.split(' ')[0] || 'Today'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Dual-Currency Conversion Card */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            {/* Left: From Currency Box */}
            <div className="md:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Invoiced Amount ({fromCurrency})
                </span>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-amber-400"
                >
                  {Object.keys(CURRENCY_METADATA).map((cur) => (
                    <option key={cur} value={cur}>
                      {CURRENCY_METADATA[cur].flag} {cur} ({CURRENCY_METADATA[cur].symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-base sm:text-lg font-black text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                  {fromCurrency}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 flex justify-between">
                <span>Cost Base: {formatMoney(costBaseAmount, fromCurrency)}</span>
                <span className="text-emerald-400 font-semibold">
                  Profit: {formatMoney(originalOperatingProfit, fromCurrency)} ({profitMarginPercent.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Middle: Swap Button */}
            <div className="md:col-span-1 flex justify-center py-1 md:py-0">
              <button
                type="button"
                onClick={handleSwapCurrencies}
                className="p-2.5 rounded-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-slate-300 transition-all shadow-md cursor-pointer group"
                title="Swap Base and Target Currency"
              >
                <ArrowLeftRight className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
            </div>

            {/* Right: To Currency Box */}
            <div className="md:col-span-5 bg-slate-950/70 border border-amber-500/30 rounded-xl p-4 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <span>Converted Value ({toCurrency})</span>
                </span>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-amber-400"
                >
                  {Object.keys(CURRENCY_METADATA).map((cur) => (
                    <option key={cur} value={cur}>
                      {CURRENCY_METADATA[cur].flag} {cur} ({CURRENCY_METADATA[cur].symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full bg-slate-900/90 border border-amber-500/40 rounded-xl px-3 py-2 text-base sm:text-lg font-black text-amber-300 font-mono flex items-center justify-between">
                <span>{formatMoney(convertedAnnualValue, toCurrency)}</span>
                <span className="text-xs font-bold text-amber-400/80">{toCurrency}</span>
              </div>

              <div className="text-[11px] text-slate-400 flex justify-between">
                <span>Cost Base: {formatMoney(convertedCostBase, toCurrency)}</span>
                <span className="text-emerald-400 font-semibold">
                  Profit: {formatMoney(convertedOperatingProfit, toCurrency)}
                </span>
              </div>
            </div>
          </div>

          {/* Transfer Pricing & Regulatory Parity Threshold Card */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Statutory Transfer Pricing Thresholds (Indian Chapter X &amp; OECD)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                INR Equivalent: ₹ {inrCrores.toFixed(2)} Crores
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Threshold 1: Form 3CEB Mandatory Audit */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Form 3CEB / Sec 92E</div>
                <div className="font-bold text-white mt-0.5">
                  {inrCrores >= 0.01 ? (
                    <span className="text-amber-400">Audit Mandatory (&gt; ₹1 Lakh)</span>
                  ) : (
                    <span className="text-slate-400">Below Threshold</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Report of independent CA in Form 3CEB required before October 31st.
                </div>
              </div>

              {/* Threshold 2: Master File / Local File */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Local File / Rule 10D</div>
                <div className="font-bold text-white mt-0.5">
                  {inrCrores >= 1.0 ? (
                    <span className="text-red-400">Detailed TP Study (&gt; ₹1 Cr)</span>
                  ) : (
                    <span className="text-emerald-400">Simplified Records (&lt; ₹1 Cr)</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {inrCrores >= 1.0 
                    ? `Value of ₹${inrCrores.toFixed(2)} Cr triggers comprehensive 9-clause Rule 10D dossier.`
                    : 'Transaction under ₹1 Cr qualifies for light documentation under Rule 10D(2).'}
                </div>
              </div>

              {/* Threshold 3: Rule 10TD Safe Harbour Bracket */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Safe Harbour Rule 10TD</div>
                <div className="font-bold text-white mt-0.5">
                  {inrCrores <= 200 ? (
                    <span className="text-emerald-400">Bracket 1 (Min 17% Markup)</span>
                  ) : inrCrores <= 500 ? (
                    <span className="text-amber-400">Bracket 2 (Min 18% Markup)</span>
                  ) : (
                    <span className="text-red-400">&gt; ₹500 Cr (Bespoke APA)</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Current contract profit markup is {profitMarginPercent.toFixed(1)}% on operating costs.
                </div>
              </div>
            </div>

            {/* CBDT Rule 115 Compliance Callout */}
            <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-300">CBDT Rule 115 Standard:</strong> For Indian income tax and transfer pricing computation, the rate of exchange for foreign currency conversion shall be the Telegraphic Transfer (TT) Buying Rate adopted by the State Bank of India (SBI) as of the specified valuation date. Live interbank rates provide instant benchmark parity for arm&apos;s length invoicing.
              </div>
            </div>
          </div>

          {/* Action Footer: Apply Values to Form & Copy Benchmark */}
          <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
            <div className="text-[11px] text-slate-400">
              Feed source: <span className="text-slate-300 font-mono">{rateSource}</span> &bull; 1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Benchmark!' : 'Copy TP Forex Benchmark'}</span>
              </button>

              {onApplyValues && (
                <button
                  type="button"
                  onClick={handleApplyToForm}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white text-xs font-black transition shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {applied ? <Check className="w-3.5 h-3.5 text-white" /> : <Zap className="w-3.5 h-3.5" />}
                  <span>{applied ? 'Applied to Form!' : `Apply ${toCurrency} Values to Ingestion`}</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
