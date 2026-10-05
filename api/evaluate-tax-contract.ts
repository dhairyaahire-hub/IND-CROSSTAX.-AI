import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PRESET_CONTRACTS } from '../src/data/treatyDatabase';
import { calculateFullTaxAnalysisReport } from '../src/utils/taxEvaluation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const input = req.body && req.body.residentCountry ? req.body : PRESET_CONTRACTS[0].data;
    const report = calculateFullTaxAnalysisReport(input);
    return res.status(200).json(report);
  } catch (error: any) {
    console.error('Tax evaluation error:', error);
    return res.status(500).json({ error: error?.message || 'Tax evaluation failed' });
  }
}
