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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const baseCurrency = (typeof req.query.base === 'string' ? req.query.base.toUpperCase() : 'USD').trim();

  // Return healthy system status & forex rates
  return res.status(200).json({
    status: 'online',
    platform: 'IND CROSSTAX AI',
    version: '2.5.0',
    base: baseCurrency,
    rates: FALLBACK_USD_RATES,
    timestamp: new Date().toISOString()
  });
}
