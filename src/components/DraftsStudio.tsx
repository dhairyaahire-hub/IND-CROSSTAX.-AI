import React, { useState } from 'react';
import { FullTaxAnalysisReport } from '../types/tax';
import { getCountryTPProfile } from '../data/treatyDatabase';
import { SendReportEmailModal } from './SendReportEmailModal';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Sparkles, 
  Scale, 
  ShieldCheck, 
  BookOpen, 
  FileCheck2,
  RefreshCw,
  Globe2,
  Building,
  Mail,
  Archive
} from 'lucide-react';

interface DraftsStudioProps {
  report: FullTaxAnalysisReport;
}

type DraftKey = 
  | 'form_10f' 
  | 'no_pe_certificate' 
  | 'tp_agreement_clause' 
  | 'dtaa_position_memo' 
  | 'form_3ceb_brief'
  | 'w8bene_statement'
  | 'uae_ct_statement'
  | 'sg_ir34d_statement'
  | 'uk_dttp_statement';

export const DraftsStudio: React.FC<DraftsStudioProps> = ({ report }) => {
  const resident = report.contract.residentCountry;
  const source = report.contract.sourceCountry;
  const residentProfile = report.residentCountryTPProfile || getCountryTPProfile(resident);
  const sourceProfile = report.sourceCountryTPProfile || getCountryTPProfile(source);

  // Default initial draft based on corridor
  const initialKey: DraftKey = 
    resident === 'US' || source === 'US' ? 'w8bene_statement' :
    resident === 'IN' || source === 'IN' ? 'form_10f' :
    resident === 'AE' || source === 'AE' ? 'uae_ct_statement' :
    resident === 'SG' || source === 'SG' ? 'sg_ir34d_statement' :
    'no_pe_certificate';

  const [selectedDraft, setSelectedDraft] = useState<DraftKey>(initialKey);
  const [draftContent, setDraftContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  // Build country-specific dynamic options
  const baseOptions = [
    {
      id: 'no_pe_certificate' as DraftKey,
      title: 'No-Foreign-Office Certificate',
      authority: `Article 5 & 7 ${resident}-${source} Treaty`,
      desc: `Legal declaration certifying absence of permanent establishment in ${sourceProfile.countryName}.`,
      howToUse: `Sign on your company letterhead and provide to ${report.contract.clientName} finance department to unlock 0% withholding tax.`,
      icon: ShieldCheck,
      badge: 'Bilateral DTAA'
    },
    {
      id: 'tp_agreement_clause' as DraftKey,
      title: 'Transfer Pricing Contract Agreement',
      authority: `OECD & ${residentProfile.tpLawTitle.split('&')[0]}`,
      desc: `Arm's length pricing clauses, TNMM benchmark terms, and quarterly true-up covenants.`,
      howToUse: 'Insert directly into your Master Services Agreement (MSA) with your foreign parent/counterparty.',
      icon: Scale,
      badge: report.contract.isPartOfSameGroup ? 'Mandatory for AE' : 'Recommended'
    },
    {
      id: 'dtaa_position_memo' as DraftKey,
      title: 'Bilateral Legal Position Paper',
      authority: 'Formal Legal Opinion',
      desc: `Comprehensive memorandum establishing why the ${resident}-${source} treaty eliminates local withholding.`,
      howToUse: 'Share with paying entity tax auditors or foreign banking compliance teams.',
      icon: BookOpen,
      badge: 'Legal Defense'
    }
  ];

  // Add country specific forms
  const dynamicForms: any[] = [];

  if (resident === 'US' || source === 'US') {
    dynamicForms.push({
      id: 'w8bene_statement' as DraftKey,
      title: 'US Form W-8BEN-E & IRC §482 Statement',
      authority: 'US Internal Revenue Service (IRS)',
      desc: 'Official treaty statement eliminating 30% US FDAP withholding on cross-border payments.',
      howToUse: 'Attach to US Form W-8BEN-E Part III to certify foreign status and 0% treaty withholding.',
      icon: FileCheck2,
      badge: 'US Compliance'
    });
  }

  if (resident === 'IN' || source === 'IN') {
    dynamicForms.push(
      {
        id: 'form_10f' as DraftKey,
        title: 'Form 10F (Indian Tax Exemption)',
        authority: 'Indian Income Tax Rule 21AB',
        desc: 'Statutory electronic self-declaration to prevent 20% domestic tax cut in India.',
        howToUse: 'E-file on the Income Tax Department portal or submit to Indian payor with your TRC.',
        icon: FileCheck2,
        badge: 'Indian CBDT'
      },
      {
        id: 'form_3ceb_brief' as DraftKey,
        title: 'Form 3CEB Accountant Audit Brief',
        authority: 'Section 92E Income Tax Act',
        desc: 'Transfer pricing annexure summary for your Chartered Accountant or CPA before year-end.',
        howToUse: 'Hand to your tax auditor to prepare the annual international transaction disclosure.',
        icon: FileText,
        badge: 'CA / CPA Audit'
      }
    );
  }

  if (resident === 'AE' || source === 'AE') {
    dynamicForms.push({
      id: 'uae_ct_statement' as DraftKey,
      title: 'UAE Corporate Tax TP Disclosure',
      authority: 'UAE Federal Tax Authority (Decree-Law 47)',
      desc: 'Connected Persons transfer pricing documentation under Article 34 and Article 55.',
      howToUse: 'Maintain in corporate tax records for FTA audit inspection and annual tax return filing.',
      icon: Building,
      badge: 'UAE FTA'
    });
  }

  if (resident === 'SG' || source === 'SG') {
    dynamicForms.push({
      id: 'sg_ir34d_statement' as DraftKey,
      title: 'Singapore IRAS §34D TP Statement',
      authority: 'Inland Revenue Authority of Singapore (IRAS)',
      desc: 'Contemporaneous transfer pricing documentation and Form IR37 withholding exemption.',
      howToUse: 'Submit to IRAS or retain to support the 5% routine services safe harbour markup.',
      icon: FileCheck2,
      badge: 'Singapore IRAS'
    });
  }

  if (resident === 'UK' || source === 'UK') {
    dynamicForms.push({
      id: 'uk_dttp_statement' as DraftKey,
      title: 'UK HMRC Treaty Passport (DTTP)',
      authority: 'HM Revenue & Customs (HMRC)',
      desc: 'HMRC Double Taxation Treaty Passport scheme declaration under TIOPA 2010.',
      howToUse: 'Submit to UK borrower or payer to apply for an HMRC Treaty Direction.',
      icon: Globe2,
      badge: 'UK HMRC'
    });
  }

  const allDraftOptions = [...dynamicForms, ...baseOptions];

  const generateDraft = async (typeKey: DraftKey) => {
    setIsGenerating(true);
    setSelectedDraft(typeKey);
    try {
      const res = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftType: typeKey,
          contract: report.contract,
          dtaa: report.dtaa,
          transferPricing: report.transferPricing
        })
      });
      const data = await res.json();
      setDraftContent(data.content || 'No content generated.');
    } catch (err) {
      console.error('Failed to generate draft:', err);
      setDraftContent('Failed to generate legal draft. Please check server connectivity.');
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    generateDraft(selectedDraft);
  }, []);

  const handleCopy = () => {
    if (!draftContent) return;
    navigator.clipboard.writeText(draftContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!draftContent) return;
    const blob = new Blob([draftContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedDraft}_${report.contract.clientName.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadDoc = () => {
    if (!draftContent) return;
    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${selectedDraft}</title>
          <style>
            body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; padding: 20pt; }
            h1, h2, h3 { color: #dc2626; font-family: Arial, sans-serif; }
            pre { background-color: #f8fafc; border: 1pt solid #cbd5e1; padding: 12pt; font-family: 'Courier New', monospace; font-size: 9.5pt; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h2>Cross Tax AI Statutory Legal Draft</h2>
          <p><strong>Entity:</strong> ${report.contract.clientName} | <strong>Corridor:</strong> ${residentProfile.flag} ${residentProfile.countryName} &rarr; ${sourceProfile.flag} ${sourceProfile.countryName}</p>
          <hr/>
          <pre>${draftContent}</pre>
        </body>
      </html>
    `;
    const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedDraft}_${report.contract.clientName.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedDraft} - Cross Tax AI Compliance Draft</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 40px; color: #111; }
              h1, h2, h3 { color: #dc2626; }
              pre { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-family: monospace; }
            </style>
          </head>
          <body>
            <pre>${draftContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadAllBundle = () => {
    const bundleHtml = `
      <h1>Complete International Statutory Compliance Dossier</h1>
      <p><strong>Client Entity:</strong> ${report.contract.clientName} (${report.contract.entityType})</p>
      <p><strong>Corridor:</strong> ${residentProfile.flag} ${residentProfile.countryName} &rarr; ${sourceProfile.flag} ${sourceProfile.countryName}</p>
      <p><strong>Engagement:</strong> ${report.contract.contractTitle} (${report.contract.currency} ${report.contract.annualValue.toLocaleString()})</p>
      <hr/>
      <h2>Active Statutory Form: ${allDraftOptions.find(d => d.id === selectedDraft)?.title}</h2>
      <p><em>Enforcing Legal Authority: ${allDraftOptions.find(d => d.id === selectedDraft)?.authority}</em></p>
      <pre>${draftContent}</pre>
    `;
    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Statutory Compliance Dossier</title>
          <style>
            body { font-family: 'Calibri', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; padding: 24pt; }
            h1 { color: #dc2626; border-bottom: 2pt solid #dc2626; padding-bottom: 6pt; }
            h2 { color: #991b1b; margin-top: 18pt; border-bottom: 1pt solid #cbd5e1; }
            pre { background-color: #f8fafc; border: 1pt solid #cbd5e1; padding: 12pt; font-family: 'Courier New', monospace; font-size: 9.5pt; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          ${bundleHtml}
        </body>
      </html>
    `;
    const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Statutory_Compliance_Dossier_${report.contract.clientName.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Send Report Email Modal */}
      <SendReportEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        report={report}
      />

      {/* Header (White Card with Red Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-50 border border-red-200 text-red-700">
              <Scale className="w-3.5 h-3.5 text-red-600" />
              <span>International Statutory Compliance Drafting Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Statutory Forms for {residentProfile.flag} {residentProfile.countryName} &rarr; {sourceProfile.flag} {sourceProfile.countryName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Official legal declarations and transfer pricing agreements tailored for <strong className="text-slate-900">{report.contract.clientName}</strong> compliant with {residentProfile.tpLawTitle.split('&')[0]} and {sourceProfile.tpLawTitle.split('&')[0]}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateDraft(selectedDraft)}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-red-600' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Draft Selection Pills (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          {allDraftOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedDraft === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => generateDraft(opt.id)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-50 border-red-300 text-red-900 shadow-sm ring-1 ring-red-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-slate-500'}`} />
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    isSelected ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {opt.badge}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{opt.title}</div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{opt.authority}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Draft Workspace & Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Workspace Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              {allDraftOptions.find((d) => d.id === selectedDraft)?.title}
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              ({allDraftOptions.find((d) => d.id === selectedDraft)?.authority})
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>Email Form</span>
            </button>

            <button
              onClick={handleDownloadAllBundle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer shadow-xs"
              title="Download consolidated dossier with all statutory forms"
            >
              <Archive className="w-3.5 h-3.5 text-amber-700" />
              <span>All Forms Bundle (.doc)</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Word (.doc)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Markdown</span>
            </button>
          </div>
        </div>

        {/* How to use instruction */}
        {allDraftOptions.find((d) => d.id === selectedDraft)?.howToUse && (
          <div className="px-6 py-3 bg-red-50/50 border-b border-red-100 flex items-start gap-2.5 text-xs text-slate-700">
            <span className="font-bold text-red-700 shrink-0">💡 Instructions:</span>
            <span>{allDraftOptions.find((d) => d.id === selectedDraft)?.howToUse}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 sm:p-8 bg-white min-h-[480px]">
          {isGenerating ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">
                Drafting official statutory document using {residentProfile.countryName} &amp; {sourceProfile.countryName} tax laws...
              </p>
            </div>
          ) : (
            <div className="max-w-none font-mono text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap text-slate-800 bg-slate-50/70 p-4 sm:p-6 rounded-xl border border-slate-200 overflow-x-auto">
              {draftContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
