import type { VercelRequest, VercelResponse } from '@vercel/node';

// Fallback baseline exchange rates (RBI & Interbank reference)
const FALLBACK_USD_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 88.65,
  EUR: 0.92,
  GBP: 0.78,
  SGD: 1.34,
  AED: 3.67,
  JPY: 153.20,
  CAD: 1.38,
  AUD: 1.52,
  CHF: 0.89,
  CNY: 7.24,
  HKD: 7.78,
  SEK: 10.45,
  SAR: 3.75,
  BRL: 5.65
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const baseCurrency = (typeof req.query.base === 'string' ? req.query.base.toUpperCase() : 'USD').trim();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const apiRes = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (apiRes.ok) {
      const data: any = await apiRes.json();
      if (data && data.rates) {
        return res.status(200).json({
          success: true,
          base: baseCurrency,
          rates: data.rates,
          lastUpdated: data.time_last_update_utc || new Date().toUTCString(),
          source: 'live_interbank_feed'
        });
      }
    }
  } catch (err) {
    // Fall back to baseline matrix
  }

  // Graceful fallback
  let synthesizedRates: Record<string, number> = {};
  if (baseCurrency === 'USD') {
    synthesizedRates = { ...FALLBACK_USD_RATES };
  } else {
    const baseToUsd = FALLBACK_USD_RATES[baseCurrency] || 1;
    for (const [curr, usdRate] of Object.entries(FALLBACK_USD_RATES)) {
      synthesizedRates[curr] = Number((usdRate / baseToUsd).toFixed(6));
    }
  }

  return res.status(200).json({
    success: true,
    base: baseCurrency,
    rates: synthesizedRates,
    lastUpdated: new Date().toUTCString(),
    source: 'reference_interbank_matrix (fallback)'
  });
}
