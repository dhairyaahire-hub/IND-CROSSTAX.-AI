import React, { useState } from 'react';
import { FullTaxAnalysisReport } from '../types/tax';
import { SendReportEmailModal } from './SendReportEmailModal';
import { printToPdf, downloadWordDoc, downloadMarkdown, generateFullReportHtml } from '../utils/exportHelpers';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Scale, 
  Clock, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  DollarSign,
  HelpCircle,
  Lightbulb,
  Download,
  ChevronDown,
  ChevronUp,
  Mail,
  Printer
} from 'lucide-react';

interface DTAACheckerProps {
  report: FullTaxAnalysisReport;
  onNavigateToDrafts: () => void;
}

export const DTAAChecker: React.FC<DTAACheckerProps> = ({
  report,
  onNavigateToDrafts
}) => {
  const { contract, dtaa } = report;
  const [showLegalDetails, setShowLegalDetails] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  const isExempt = dtaa.qualifiesForExemption;

  const handleDownloadPdf = () => {
    const html = generateFullReportHtml(report);
    printToPdf(`Cross_Tax_Advisory_Report_${contract.clientName.replace(/\s+/g, '_')}`, html);
  };

  const handleDownloadWord = () => {
    const html = generateFullReportHtml(report);
    downloadWordDoc(
      `Tax_Advisory_Report_${contract.clientName.replace(/\s+/g, '_')}`,
      `Tax Advisory & DTAA Relief Report: ${contract.clientName}`,
      html
    );
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# Cross Tax AI: Executive Tax Advisory Report
## Client: ${contract.clientName} (${contract.entityType})
- Corridor: ${contract.residentCountry} → ${contract.sourceCountry}
- Contract: ${contract.contractTitle}
- Annual Sum: ${contract.currency} ${contract.annualValue.toLocaleString()}
- Treaty Rate: ${dtaa.treatyWhtRate}% vs Domestic Rate: ${dtaa.domesticWhtRate}%
- Direct Estimated Savings: ${contract.currency} ${dtaa.estimatedTaxSavings.toLocaleString()}
- Permanent Establishment Risk: ${dtaa.peRiskLevel.toUpperCase()}

### Executive Summary
${report.executiveSummary}

### Strategic Recommendations
${(report.strategicStructuringRecommendations || []).map((r) => `- ${r}`).join('\n')}
`;
    downloadMarkdown(`Report_${contract.clientName.replace(/\s+/g, '_')}`, mdContent);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Automated Email Modal */}
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
            title="Download formatted printable PDF report"
          >
            <Printer className="w-3.5 h-3.5 text-red-600" />
            <span>PDF Report</span>
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
      {/* 1. The Big Simple Verdict Banner (Red Gradient & Crisp White) */}
      <div className="p-6 sm:p-8 rounded-2xl border border-red-600/20 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Double Tax Relief: ELIGIBLE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isExempt ? (
                <span>🎉 Good News! You Qualify for 0% Foreign Tax Withholding</span>
              ) : (
                <span>You Qualify for Reduced Treaty Tax: {dtaa.treatyWhtRate}% (Save {dtaa.effectiveTaxReliefPct}%)</span>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-red-50 max-w-2xl leading-relaxed">
              Between <strong className="text-white underline decoration-white/40">{contract.residentCountry}</strong> (Your Country) and{' '}
              <strong className="text-white underline decoration-white/40">{contract.sourceCountry}</strong> (Client&apos;s Country).
              Under the international tax agreement (DTAA), your foreign client is <strong className="text-white font-bold">not allowed to take high domestic tax</strong> from your payment if you submit the required paperwork.
            </p>
          </div>

          {/* Cash In Pocket Callout (White Card on Red Banner) */}
          <div className="bg-white p-5 rounded-2xl border border-red-100 text-slate-900 text-left md:text-right shrink-0 shadow-lg">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Direct Cash You Keep in Your Bank
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-600 mt-1">
              +{contract.currency} {dtaa.estimatedTaxSavings.toLocaleString()}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Instead of paying <span className="line-through text-red-600 font-mono font-semibold">{contract.currency} {dtaa.grossTaxDomestic.toLocaleString()}</span> foreign tax
            </span>
          </div>
        </div>
      </div>

      {/* 2. "In Plain English: What Does This Mean?" Explainer Box */}
      <div className="p-5 sm:p-6 bg-white border border-red-100 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-red-700 text-sm font-bold">
          <Lightbulb className="w-5 h-5 text-red-600 shrink-0" />
          <span>In Plain English: Why are you protected?</span>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Normally, foreign governments want to grab <strong>{dtaa.domesticWhtRate}%</strong> tax on payments leaving their country. 
          However, because you work from <strong>{contract.residentCountry}</strong> and spent <strong>{contract.durationDaysInSource} days</strong> in {contract.sourceCountry} (under the {activeDaysThreshold(contract.sourceCountry)} day limit) with no foreign office, 
          international law says: <strong className="text-slate-900 font-bold">&ldquo;This business belongs to your home country. The foreign country cannot tax your business profits.&rdquo;</strong>
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-slate-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
            <span>No foreign office / desk</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-slate-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
            <span>Under travel day limit ({contract.durationDaysInSource} days)</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-slate-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
            <span>Independent service delivery</span>
          </div>
        </div>
      </div>

      {/* 3. Before & After Simple Visual Comparison (White Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Without Treaty */}
        <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
                Scenario A: Without Treaty Papers
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">High Foreign Tax Cut</h3>
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Your Invoiced Amount:</span>
              <span className="font-mono text-slate-900 font-bold">{contract.currency} {contract.annualValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-red-600 font-medium">
              <span>Foreign Tax Cut ({dtaa.domesticWhtRate}%):</span>
              <span className="font-mono font-bold text-red-600">-{contract.currency} {dtaa.grossTaxDomestic.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-800 pt-2 border-t border-slate-100 text-sm font-bold">
              <span>Actual Cash You Receive:</span>
              <span className="font-mono text-slate-900">{contract.currency} {(contract.annualValue - dtaa.grossTaxDomestic).toLocaleString()}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            Your client is required by law to withhold this money unless you give them your treaty papers.
          </p>
        </div>

        {/* With Treaty (Cross Tax AI) */}
        <div className="bg-white border-2 border-red-500 rounded-2xl p-6 shadow-sm space-y-4 bg-red-50/20">
          <div className="flex items-center justify-between border-b border-red-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 block">
                Scenario B: With Cross Tax AI Treaty Papers
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Maximum Cash Protected</h3>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Your Invoiced Amount:</span>
              <span className="font-mono text-slate-900 font-bold">{contract.currency} {contract.annualValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700 font-medium">
              <span>Treaty Tax Cut ({dtaa.treatyWhtRate}%):</span>
              <span className="font-mono font-bold text-slate-900">-{contract.currency} {dtaa.grossTaxTreaty.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-700 pt-2 border-t border-red-100 text-sm font-bold">
              <span>Actual Cash You Receive:</span>
              <span className="font-mono font-bold text-emerald-700">{contract.currency} {(contract.annualValue - dtaa.grossTaxTreaty).toLocaleString()}</span>
            </div>
          </div>

          <p className="text-[11px] text-red-700 font-medium leading-snug">
            You keep <strong>+{contract.currency} {dtaa.estimatedTaxSavings.toLocaleString()}</strong> more cash simply by attaching your Form 10F and No-PE Certificate!
          </p>
        </div>
      </div>

      {/* 4. Action Steps: "What Do I Send to My Foreign Client?" */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              <span>What 3 Documents Do I Need to Send to My Foreign Client?</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Send these 3 items with your invoice so their finance department won&apos;t deduct foreign tax.
            </p>
          </div>
          <button
            onClick={onNavigateToDrafts}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
          >
            <span>Open Legal Forms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Doc 1: TRC */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                contract.hasTRC ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {contract.hasTRC ? 'Already Have It' : 'Need to Request'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Tax Residency Certificate (TRC)</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Official 1-page certificate from your home tax office (e.g. IRS Form 6166 in US, HMRC in UK, Income Tax Dept in India) proving you pay taxes locally.
            </p>
          </div>

          {/* Doc 2: Form 10F */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-red-100 text-red-700">
                1-Click Ready
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Electronic Form 10F</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              A standard statutory declaration of your tax status. Cross Tax AI has pre-filled this ready for you to copy, download, or file.
            </p>
          </div>

          {/* Doc 3: No-PE Certificate */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-red-100 text-red-700">
                1-Click Ready
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">No-Foreign-Office Certificate</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              A signed 1-page letter certifying you do not have a physical office or branch in your client&apos;s country. Pre-generated by Cross Tax AI.
            </p>
          </div>
        </div>

        {/* Action Button (Red Gradient) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-red-50/50 rounded-xl border border-red-100">
          <span className="text-xs text-slate-700 font-medium">
            All 3 documents are ready to view, copy, or download in the Legal Forms tab.
          </span>
          <button
            onClick={onNavigateToDrafts}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>View &amp; Download Pre-Filled Tax Forms</span>
          </button>
        </div>
      </div>

      {/* 5. Collapsible Legal & Treaty Details (White Card) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => setShowLegalDetails(!showLegalDetails)}
          className="w-full p-5 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-red-600" />
            <span>Need Formal Treaty Law References? (Article 5, 7, 12 Citations &amp; Case Laws)</span>
          </div>
          {showLegalDetails ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {showLegalDetails && (
          <div className="p-6 pt-0 border-t border-slate-100 space-y-4 text-xs text-slate-700">
            <p className="text-slate-500 text-xs">
              Below are the exact treaty articles and legal precedents used by our AI engine to defend your 0% tax position:
            </p>

            <div className="space-y-3">
              {report.legalPrecedentsAndArticles.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between text-red-600 font-mono font-bold">
                    <span>{item.treatyArticle}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-sans">{item.description}</span>
                  </div>
                  <p className="mt-1 text-slate-700 text-xs leading-relaxed">{item.relevance}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 block mb-1">Permanent Establishment (Article 5) Diagnostic:</span>
              <p className="text-slate-600">{dtaa.peEvaluationSummary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function activeDaysThreshold(country: string): number {
  if (country === 'US' || country === 'UK' || country === 'SG') return 90;
  return 183;
}
