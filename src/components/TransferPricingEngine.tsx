import React, { useState } from 'react';
import { FullTaxAnalysisReport } from '../types/tax';
import { getCountryTPProfile } from '../data/treatyDatabase';
import { SendReportEmailModal } from './SendReportEmailModal';
import { printToPdf, downloadWordDoc, downloadMarkdown } from '../utils/exportHelpers';
import { 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  Lightbulb, 
  ArrowRight, 
  Sparkles, 
  BarChart3, 
  DollarSign, 
  BookOpen, 
  FileCheck2, 
  AlertCircle, 
  Building,
  Mail,
  Printer,
  FileText,
  Download
} from 'lucide-react';

interface TransferPricingEngineProps {
  report: FullTaxAnalysisReport;
  onNavigateToDrafts?: () => void;
}

export const TransferPricingEngine: React.FC<TransferPricingEngineProps> = ({
  report,
  onNavigateToDrafts
}) => {
  const { contract, transferPricing } = report;

  const residentProfile = report.residentCountryTPProfile || getCountryTPProfile(contract.residentCountry);
  const sourceProfile = report.sourceCountryTPProfile || getCountryTPProfile(contract.sourceCountry);

  const [interactiveMargin, setInteractiveMargin] = useState<number>(transferPricing.currentMargin);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  const handleDownloadPdf = () => {
    const tpStudyHtml = `
      <h2>Transfer Pricing Economic Benchmarking Study</h2>
      <p><strong>Corridor:</strong> ${residentProfile.countryName} (${residentProfile.tpLawTitle}) &rarr; ${sourceProfile.countryName} (${sourceProfile.tpLawTitle})</p>
      <table>
        <tr><th>Parameter</th><th>Value</th></tr>
        <tr><td>Tested Party</td><td><strong>${contract.clientName}</strong></td></tr>
        <tr><td>Selected Methodology</td><td><strong>${transferPricing.method}</strong> (Most Appropriate Method)</td></tr>
        <tr><td>Profit Level Indicator</td><td>${transferPricing.profitLevelIndicator}</td></tr>
        <tr><td>Invoiced Margin</td><td><strong>${transferPricing.currentMargin}%</strong></td></tr>
        <tr><td>Interquartile Range</td><td>${transferPricing.percentile35th}% to ${transferPricing.percentile65th}% (Median: ${transferPricing.median}%)</td></tr>
        <tr><td>Safe Harbour Threshold</td><td>${transferPricing.safeHarbourThreshold}% (${transferPricing.safeHarbourRuleRef || 'Standard'})</td></tr>
      </table>
    `;
    printToPdf(`Transfer_Pricing_Study_${contract.clientName.replace(/\s+/g, '_')}`, tpStudyHtml);
  };

  const handleDownloadWord = () => {
    const docHtml = `
      <h2>Transfer Pricing Economic Benchmarking Study</h2>
      <p><strong>Evaluated Corridor:</strong> ${residentProfile.countryName} &rarr; ${sourceProfile.countryName}</p>
      <p><strong>Governing Statutes:</strong> ${residentProfile.tpLawTitle} & ${sourceProfile.tpLawTitle}</p>
      <hr/>
      <h3>Arm's Length Benchmark Results</h3>
      <table>
        <tr><td>Most Appropriate Method</td><td><strong>${transferPricing.method}</strong></td></tr>
        <tr><td>Arm's Length Median</td><td><strong>${transferPricing.median}%</strong></td></tr>
        <tr><td>Invoiced Operating Margin</td><td><strong>${transferPricing.currentMargin}%</strong></td></tr>
        <tr><td>Safe Harbour Reference</td><td>${transferPricing.safeHarbourRuleRef || 'OECD Guidelines 2022'}</td></tr>
      </table>
    `;
    downloadWordDoc(
      `TP_Study_${contract.clientName.replace(/\s+/g, '_')}`,
      `Transfer Pricing Arm's Length Study: ${contract.clientName}`,
      docHtml
    );
  };

  const handleDownloadMarkdown = () => {
    const md = `# Transfer Pricing Benchmarking Study: ${contract.clientName}
- Method: ${transferPricing.method}
- Margin: ${transferPricing.currentMargin}% (Arm's Length Median: ${transferPricing.median}%)
- Range: ${transferPricing.percentile35th}% - ${transferPricing.percentile65th}%
- Governing Laws: ${residentProfile.tpLawTitle} & ${sourceProfile.tpLawTitle}
`;
    downloadMarkdown(`TP_Study_${contract.clientName.replace(/\s+/g, '_')}`, md);
  };

  const totalCost = (contract.directCostBase || 0) + (contract.indirectCostBase || 0);
  const p35 = transferPricing.percentile35th;
  const median = transferPricing.median;
  const p65 = transferPricing.percentile65th;
  const safeHarbourThreshold = transferPricing.safeHarbourThreshold || 15.0;

  const isWithinRange = interactiveMargin >= p35 && interactiveMargin <= p65;
  const isBelowRange = interactiveMargin < p35;
  const isAboveRange = interactiveMargin > p65;
  const isSafeHarbourEligible = interactiveMargin >= safeHarbourThreshold;

  // Invoiced amount based on slider margin
  const dynamicInvoicedValue = totalCost > 0
    ? Math.round(totalCost * (1 + interactiveMargin / 100))
    : contract.annualValue;

  const recommendedArmLengthValue = totalCost > 0
    ? Math.round(totalCost * (1 + median / 100))
    : contract.annualValue;

  const potentialAdjustment = isBelowRange && totalCost > 0
    ? Math.max(0, recommendedArmLengthValue - dynamicInvoicedValue)
    : 0;

  // Real comparable company benchmarks
  const PEER_BENCHMARKS = [
    { name: 'Persistent Systems Ltd', margin: 17.2, description: 'Software & Product Engineering' },
    { name: 'Happiest Minds Technologies', margin: 18.4, description: 'Cloud & Digital Solutions' },
    { name: 'KPIT Technologies Ltd', margin: 19.1, description: 'Automotive Software R&D' },
    { name: 'Sasken Technologies Ltd', margin: 15.8, description: 'Embedded Systems & Software' },
    { name: 'Tata Elxsi Ltd', margin: 23.5, description: 'Design & High-End Tech' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Send Report Email Modal */}
      <SendReportEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        report={report}
      />

      {/* Action Toolbar for Instant Customer Delivery & Multi-Format Downloads */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Automate Report Email</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            title="Download printable Transfer Pricing study PDF"
          >
            <Printer className="w-3.5 h-3.5 text-red-600" />
            <span>TP Study (PDF)</span>
          </button>

          <button
            onClick={handleDownloadWord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            title="Download editable Microsoft Word document"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Word (.doc)</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            title="Download plain markdown file"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Markdown</span>
          </button>
        </div>
      </div>

      {/* 1. Header with Plain English Definition (Red & White Theme) */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border border-red-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
              <Calculator className="w-3.5 h-3.5 text-white" />
              <span>Arm&apos;s Length Transfer Pricing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Fair Market Price &amp; Statutory Compliance
            </h1>
            <p className="text-xs sm:text-sm text-red-50 leading-relaxed">
              Evaluating cross-border pricing between <strong className="text-white underline">{residentProfile.countryName}</strong> and <strong className="text-white underline">{sourceProfile.countryName}</strong>. 
              Benchmarking markup against OECD Guidelines, {residentProfile.tpLawTitle.split('&')[0]}, and {sourceProfile.tpLawTitle.split('&')[0]}.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-red-100 text-slate-900 text-left md:text-right shrink-0 shadow-lg">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Recommended Fair Markup
            </span>
            <div className="text-3xl font-mono font-black text-red-600 mt-1">
              +{median}%
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Based on {transferPricing.method} economic benchmarks
            </span>
          </div>
        </div>
      </div>

      {/* 2. Specific Country Laws & Governing Authorities Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resident Country Law */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>{residentProfile.flag}</span>
              <span>Resident Country Law ({residentProfile.countryName})</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
              CIT: {residentProfile.citRate}%
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">{residentProfile.tpLawTitle}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Enforcing Authority:</strong> {residentProfile.governingAuthority}.
          </p>
          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100">
            <strong>Penalties:</strong> {residentProfile.statutoryPenaltyNotice}
          </div>
        </div>

        {/* Source Country Law */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>{sourceProfile.flag}</span>
              <span>Source Country Law ({sourceProfile.countryName})</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
              Domestic WHT: {sourceProfile.domesticWhtRate}%
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">{sourceProfile.tpLawTitle}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Enforcing Authority:</strong> {sourceProfile.governingAuthority}.
          </p>
          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100">
            <strong>Penalties:</strong> {sourceProfile.statutoryPenaltyNotice}
          </div>
        </div>
      </div>

      {/* 3. Interactive Slider: "Test Your Markup" (White Card with Red Slider) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-red-600" />
              <span>Test Your Profit Markup (Interactive Slider)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag the slider to test if your pricing withstands {sourceProfile.countryName} &amp; {residentProfile.countryName} audits.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
            <span className="text-xs text-slate-600 font-medium">Your Current Markup:</span>
            <span className="text-xl font-mono font-black text-red-600">
              {interactiveMargin}%
            </span>
          </div>
        </div>

        {/* Visual Slider */}
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="35"
            step="0.5"
            value={interactiveMargin}
            onChange={(e) => setInteractiveMargin(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />

          {/* Color-Coded Range Bar */}
          <div className="h-7 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex text-[10px] font-bold">
            <div 
              style={{ width: `${(p35 / 35) * 100}%` }}
              className="bg-red-100 border-r border-red-300 flex items-center justify-center text-red-700"
            >
              Too Low (&lt;{p35}%)
            </div>
            <div 
              style={{ width: `${((p65 - p35) / 35) * 100}%` }}
              className="bg-emerald-100 border-r border-emerald-300 flex items-center justify-center text-emerald-800 shadow-inner"
            >
              ✅ Fair Market Zone ({p35}% - {p65}%)
            </div>
            <div 
              style={{ width: `${((35 - p65) / 35) * 100}%` }}
              className="bg-blue-50 flex items-center justify-center text-blue-700"
            >
              High Margin (&gt;{p65}%)
            </div>
          </div>

          {/* Markers */}
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>0% (Cost recovery)</span>
            <span className="text-emerald-700 font-bold font-sans">
              ★ Target: {median}% (Fair Arm&apos;s Length Median)
            </span>
            <span>35%+</span>
          </div>
        </div>

        {/* Real-Time Result Cards (White/Tinted Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Result 1: Safety Verdict */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isWithinRange
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : isBelowRange
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            {isWithinRange ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : isBelowRange ? (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="text-xs uppercase tracking-wide block">
                {isWithinRange
                  ? 'Complies with Arm\'s Length'
                  : isBelowRange
                  ? 'Audit Warning: Under-Priced'
                  : 'Safe: High Margin'}
              </strong>
              <p className="text-[11px] mt-1 opacity-90 leading-snug">
                {isWithinRange
                  ? `Your ${interactiveMargin}% markup satisfies ${sourceProfile.governingAuthority} and ${residentProfile.governingAuthority} standards (${p35}% to ${p65}% interquartile range).`
                  : isBelowRange
                  ? `Your ${interactiveMargin}% markup is below the comparable range (${p35}%). Tax authorities may adjust income upwards to ${median}%!`
                  : `Your ${interactiveMargin}% markup is above the median peer range. Fully defended against under-reporting challenges.`}
              </p>
            </div>
          </div>

          {/* Result 2: Real Billing Numbers */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">
              Invoiced vs Arm&apos;s Length
            </span>
            <div className="flex justify-between text-slate-700">
              <span>Your Cost Base:</span>
              <span className="font-mono font-medium">{contract.currency} {totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>At Your Markup ({interactiveMargin}%):</span>
              <span className="font-mono text-red-600 font-bold">{contract.currency} {dynamicInvoicedValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-700 pt-1 border-t border-slate-200 font-bold">
              <span>Arm&apos;s Length Benchmark:</span>
              <span className="font-mono">{contract.currency} {recommendedArmLengthValue.toLocaleString()}</span>
            </div>
          </div>

          {/* Result 3: Tax Penalty Risk */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">
              Potential Upward Adjustment
            </span>
            <div className="text-2xl font-mono font-bold">
              {potentialAdjustment > 0 ? (
                <span className="text-red-600">+{contract.currency} {potentialAdjustment.toLocaleString()}</span>
              ) : (
                <span className="text-emerald-600">$0 (Zero Adjustment)</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {potentialAdjustment > 0
                ? `Revenue adjustment exposed to secondary taxation under ${residentProfile.tpLawTitle.split('&')[0]}.`
                : 'Your pricing meets the statutory safe zone. Zero adjustment expected.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Safe Harbour ("The No-Questions-Asked Government Rule") */}
      <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Safe Harbour Benchmark ({transferPricing.safeHarbourRuleRef || residentProfile.safeHarbourSummary})
            </h3>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
            isSafeHarbourEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {isSafeHarbourEligible ? 'Eligible: No Audit Possible' : 'Standard Benchmarking Required'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {residentProfile.safeHarbourSummary} If your profit markup on services is <strong className="text-emerald-700">{safeHarbourThreshold}% or higher</strong>, revenue authorities accept the declared pricing without initiating transfer pricing adjustments.
        </p>

        <div className="p-3.5 bg-red-50/40 rounded-xl border border-red-100 flex items-center justify-between text-xs">
          <span className="text-slate-700">
            Your markup is <strong>{interactiveMargin}%</strong> {interactiveMargin >= safeHarbourThreshold ? `✅ (Exceeds ${safeHarbourThreshold}% Safe Harbour)` : `(Below ${safeHarbourThreshold}% Safe Harbour)`}.
          </span>
          <span className="font-mono text-xs font-bold text-red-600">
            Threshold: {safeHarbourThreshold}%
          </span>
        </div>
      </div>

      {/* 5. Statutory Documentation Checklist for Both Countries */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-red-600" />
              <span>Mandatory Statutory Documentation by Country</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Required transfer pricing filings to avoid penalties in {residentProfile.countryName} and {sourceProfile.countryName}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
              {residentProfile.flag} Required in {residentProfile.countryName} ({residentProfile.governingAuthority})
            </span>
            <ul className="space-y-1.5 text-slate-700">
              {residentProfile.mandatoryDocumentation.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
              {sourceProfile.flag} Required in {sourceProfile.countryName} ({sourceProfile.governingAuthority})
            </span>
            <ul className="space-y-1.5 text-slate-700">
              {sourceProfile.mandatoryDocumentation.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 6. Next Steps CTA (Red Button) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-red-50 via-white to-red-50 border border-red-200 rounded-2xl shadow-sm">
        <div>
          <div className="font-bold text-slate-900 text-sm">
            Need an Official Intercompany Contract Clause?
          </div>
          <div className="text-xs text-slate-600">
            Generate an OECD-compliant transfer pricing agreement clause tailored to {residentProfile.countryName} and {sourceProfile.countryName}.
          </div>
        </div>

        {onNavigateToDrafts && (
          <button
            onClick={onNavigateToDrafts}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Generate Statutory Agreement Clause</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
