import React, { useState, useEffect } from 'react';
import { FullTaxAnalysisReport, WebhookDispatchLog } from '../types/tax';
import { SendReportEmailModal } from './SendReportEmailModal';
import { printToPdf, downloadWordDoc, downloadMarkdown, generateFullReportHtml } from '../utils/exportHelpers';
import { 
  Workflow, 
  Send, 
  Mail, 
  Code2, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Clock, 
  RefreshCw, 
  ExternalLink, 
  Zap, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Layers,
  Printer,
  FileText
} from 'lucide-react';

interface AutomationHubProps {
  report: FullTaxAnalysisReport;
}

export const AutomationHub: React.FC<AutomationHubProps> = ({ report }) => {
  const [webhookUrl, setWebhookUrl] = useState<string>('https://hook.eu1.make.com/your-scenario-id');
  const [targetEmail, setTargetEmail] = useState<string>(report.contract.clientEmail || '');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [isTestingInbound, setIsTestingInbound] = useState<boolean>(false);
  const [inboundTestResult, setInboundTestResult] = useState<any>(null);
  const [dispatchResult, setDispatchResult] = useState<any>(null);
  const [logs, setLogs] = useState<WebhookDispatchLog[]>([]);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [copiedBlueprint, setCopiedBlueprint] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'direct_email' | 'quick_connect' | 'blueprint' | 'email_preview' | 'logs'>('direct_email');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  // Direct client email form state
  const [directEmail, setDirectEmail] = useState<string>(report.contract.clientEmail || '');
  const [directClientName, setDirectClientName] = useState<string>(report.contract.clientName || '');
  const [directAdvisorNote, setDirectAdvisorNote] = useState<string>(
    `Hi ${report.contract.clientName.split(' ')[0]}, here is your formal cross-border tax assessment. Under the ${report.contract.residentCountry}-${report.contract.sourceCountry} DTAA, you qualify to save ${report.contract.currency} ${report.dtaa.estimatedTaxSavings.toLocaleString()} in withholding tax.`
  );
  const [isDirectSending, setIsDirectSending] = useState<boolean>(false);
  const [directSendStatus, setDirectSendStatus] = useState<{ success: boolean; message: string; messageId?: string } | null>(null);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://crosstax.ai';
  const inboundWebhookEndpoint = `${currentOrigin}/api/webhook/make-lead`;

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/webhook-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error('Failed to fetch webhook logs', e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDownloadPdf = () => {
    const html = generateFullReportHtml(report);
    printToPdf(`Cross_Tax_Report_${report.contract.clientName.replace(/\s+/g, '_')}`, html);
  };

  const handleDownloadWord = () => {
    const html = generateFullReportHtml(report);
    downloadWordDoc(
      `Tax_Report_${report.contract.clientName.replace(/\s+/g, '_')}`,
      `Tax Advisory & DTAA Relief Report: ${report.contract.clientName}`,
      html
    );
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# Cross Tax AI: Executive Tax Advisory Report
## Client: ${report.contract.clientName}
- Corridor: ${report.contract.residentCountry} → ${report.contract.sourceCountry}
- Contract: ${report.contract.contractTitle}
- Savings: ${report.contract.currency} ${report.dtaa.estimatedTaxSavings.toLocaleString()}
- Treaty Rate: ${report.dtaa.treatyWhtRate}% vs Domestic: ${report.dtaa.domesticWhtRate}%
`;
    downloadMarkdown(`Report_${report.contract.clientName.replace(/\s+/g, '_')}`, mdContent);
  };

  // Direct automated client email dispatch
  const handleSendDirectEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDirectSending(true);
    setDirectSendStatus(null);

    try {
      const res = await fetch('/api/send-report-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: directEmail,
          clientName: directClientName,
          report,
          customMessage: directAdvisorNote
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch email');
      }

      setDirectSendStatus({
        success: true,
        message: `Report successfully dispatched to ${directEmail}!`,
        messageId: data.messageId
      });
      fetchLogs();
    } catch (err: any) {
      setDirectSendStatus({
        success: false,
        message: err.message || 'Email delivery failed'
      });
    } finally {
      setIsDirectSending(false);
    }
  };

  // Outbound test to Make.com
  const handleTriggerWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);
    setDispatchResult(null);

    try {
      const res = await fetch('/api/trigger-make-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl,
          report,
          clientEmail: targetEmail
        })
      });

      const data = await res.json();
      setDispatchResult(data);
      fetchLogs();
    } catch (err: any) {
      setDispatchResult({ success: false, message: err.message || 'Dispatch failed' });
    } finally {
      setIsDispatching(false);
    }
  };

  // Inbound test (simulating Make.com calling our endpoint)
  const handleTestInbound = async () => {
    setIsTestingInbound(true);
    setInboundTestResult(null);

    try {
      const res = await fetch('/api/webhook/make-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: report.contract.clientName,
          clientEmail: targetEmail,
          residentCountry: report.contract.residentCountry,
          sourceCountry: report.contract.sourceCountry,
          transactionCategory: report.contract.transactionCategory,
          annualValue: report.contract.annualValue,
          currency: report.contract.currency,
          durationDaysInSource: report.contract.durationDaysInSource,
          notes: 'Test lead dispatched from Cross Tax AI Automation Hub'
        })
      });

      const data = await res.json();
      setInboundTestResult(data);
      fetchLogs();
    } catch (err: any) {
      setInboundTestResult({ error: err.message || 'Inbound test call failed' });
    } finally {
      setIsTestingInbound(false);
    }
  };

  const copyInboundUrl = () => {
    navigator.clipboard.writeText(inboundWebhookEndpoint);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Complete Make.com Scenario Blueprint JSON
  const makeBlueprintJSON = {
    name: "Cross Tax AI - Client Tax Analysis & Delivery Pipeline",
    flow: [
      {
        id: 1,
        module: "gateway:CustomWebHook",
        version: 1,
        parameters: { hook: 0 },
        mapper: {},
        metadata: {
          designer: { x: 0, y: 0, name: "1. Client Intake Form (Typeform / Google Form)" }
        }
      },
      {
        id: 2,
        module: "http:ActionSendRequest",
        version: 3,
        parameters: {},
        mapper: {
          url: inboundWebhookEndpoint,
          method: "POST",
          headers: [
            { name: "Content-Type", value: "application/json" }
          ],
          body: "{\n  \"clientName\": \"{{1.clientName}}\",\n  \"clientEmail\": \"{{1.email}}\",\n  \"residentCountry\": \"{{1.residentCountry}}\",\n  \"sourceCountry\": \"{{1.sourceCountry}}\",\n  \"annualValue\": {{1.annualValue}},\n  \"currency\": \"{{1.currency}}\",\n  \"transactionCategory\": \"{{1.transactionCategory}}\",\n  \"durationDaysInSource\": {{1.durationDaysInSource}}\n}",
          type: "raw",
          parseResponse: true
        },
        metadata: {
          designer: { x: 300, y: 0, name: "2. Cross Tax AI Engine (DTAA & TP Eval)" }
        }
      },
      {
        id: 3,
        module: "email:ActionSendEmail",
        version: 2,
        parameters: {},
        mapper: {
          to: ["{{1.email}}"],
          subject: "Your International Tax Structure & DTAA Report ({{2.data.analysis.estimatedTaxSavings}} Savings)",
          content: "Hello {{1.clientName}},\n\nYour cross-border contract has been analyzed by Cross Tax AI.\n\nKey Findings:\n- Corridor: {{2.data.analysis.corridor}}\n- Treaty Relief Rate: {{2.data.analysis.treatyWithholdingRate}} (vs domestic {{2.data.analysis.domesticWithholdingRate}})\n- Direct Tax Savings: {{2.data.analysis.estimatedTaxSavings}}\n- PE Risk Rating: {{2.data.analysis.peRiskLevel}}\n- Fair Arm's Length Markup: {{2.data.analysis.recommendedArmLengthMargin}}\n\nYour Form 10F and No-PE Certificate have been compiled.\n\nBest regards,\nCross Tax AI Advisor"
        },
        metadata: {
          designer: { x: 600, y: 0, name: "3. Deliver Email to Client" }
        }
      }
    ]
  };

  const copyBlueprint = () => {
    navigator.clipboard.writeText(JSON.stringify(makeBlueprintJSON, null, 2));
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 2000);
  };

  const copyJsonPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Send Report Email Modal */}
      <SendReportEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        report={report}
      />

      {/* Header with Quick Downloads Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              <Workflow className="w-3.5 h-3.5 text-red-600" />
              <span>Automated Client Delivery &amp; Webhook Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Automated Reports &amp; Multi-Format Downloads
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Instantly dispatch professional tax reports to client email inboxes, download formal Word &amp; PDF audit documents, or connect to Make.com for automated customer workflows.
            </p>
          </div>

          {/* Direct Multi-Format Download Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer shadow-xs"
              title="Print or save as formatted PDF report"
            >
              <Printer className="w-3.5 h-3.5 text-red-600" />
              <span>PDF Report</span>
            </button>

            <button
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer shadow-xs"
              title="Download editable Microsoft Word document"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Word (.doc)</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Markdown</span>
            </button>
          </div>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex gap-2 mt-6 pt-6 border-t border-slate-100 overflow-x-auto scrollbar-none">
          {[
            { id: 'direct_email', label: '★ Send Email' },
            { id: 'quick_connect', label: 'Make.com Fast Connect' },
            { id: 'blueprint', label: 'Make.com Blueprint JSON' },
            { id: 'email_preview', label: 'Email Preview' },
            { id: 'logs', label: `Delivery Logs (${logs.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 0: Direct Automated Client Email Dispatcher */}
      {activeTab === 'direct_email' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Instant Client Email Dispatcher
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Send the complete executive report, tax savings calculations, and compliance advice directly to your client.
              </p>
            </div>

            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-700 bg-red-50 text-xs font-bold hover:bg-red-100 cursor-pointer self-start sm:self-auto"
            >
              Open Email Dialog
            </button>
          </div>

          {directSendStatus && (
            <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
              directSendStatus.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              {directSendStatus.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold text-sm block">
                  {directSendStatus.success ? 'Email Dispatched Successfully!' : 'Delivery Error'}
                </span>
                <p>{directSendStatus.message}</p>
                {directSendStatus.messageId && (
                  <p className="text-[11px] opacity-80">Message ID: <code>{directSendStatus.messageId}</code></p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSendDirectEmail} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Customer Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={directEmail}
                  onChange={(e) => setDirectEmail(e.target.value)}
                  placeholder="cfo@customercompany.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Customer Contact / Representative
                </label>
                <input
                  type="text"
                  value={directClientName}
                  onChange={(e) => setDirectClientName(e.target.value)}
                  placeholder="e.g. John Doe / Head of Finance"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Personalized Advisor Message (Appears in Email Header)
              </label>
              <textarea
                rows={3}
                value={directAdvisorNote}
                onChange={(e) => setDirectAdvisorNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-red-500 leading-relaxed font-sans"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-600 space-y-0.5">
                <span className="font-bold text-slate-900 block">Corridor Tax Savings Summary</span>
                <span>
                  {report.contract.residentCountry} &rarr; {report.contract.sourceCountry} | Estimated Tax Savings: <strong className="text-emerald-700 font-mono">+{report.contract.currency} {report.dtaa.estimatedTaxSavings.toLocaleString()}</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={isDirectSending}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDirectSending ? 'Sending Email...' : 'Send Automated Report Email Now'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 1: Fast Connect & Test */}
      {activeTab === 'quick_connect' && (
        <div className="space-y-6">
          {/* Method A: Inbound from Make.com to Cross Tax AI */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                    A
                  </span>
                  <h2 className="text-base font-bold text-slate-900">
                    Inbound Connection: Send Form Leads from Make.com &rarr; Cross Tax AI
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  When a client fills out your Typeform, Google Form, or Website, Make.com sends it to this URL to run the tax engine.
                </p>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 self-start sm:self-auto">
                ● Live Endpoint Active
              </span>
            </div>

            {/* Inbound URL Bar */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Your Cross Tax AI Webhook URL (Paste this into Make.com HTTP Module):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inboundWebhookEndpoint}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 font-mono font-medium focus:outline-none"
                />
                <button
                  onClick={copyInboundUrl}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl ? 'Copied!' : 'Copy URL'}</span>
                </button>
              </div>
            </div>

            {/* Test Inbound Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestInbound}
                disabled={isTestingInbound}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isTestingInbound ? 'animate-spin text-amber-300' : 'text-amber-400'}`} />
                <span>{isTestingInbound ? 'Simulating Lead...' : 'Test Inbound Pipeline (Simulate Form Lead)'}</span>
              </button>
            </div>

            {/* Inbound Test Output */}
            {inboundTestResult && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono overflow-x-auto space-y-2">
                <span className="font-bold text-slate-700 block font-sans">
                  Server Response to Inbound Make.com Lead:
                </span>
                <pre className="text-emerald-700 whitespace-pre-wrap">
                  {JSON.stringify(inboundTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Method B: Outbound from Cross Tax AI to Make.com */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    B
                  </span>
                  <h2 className="text-base font-bold text-slate-900">
                    Outbound Dispatch: Send Evaluated Tax Report &rarr; Make.com Scenario
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Once an assessment is completed, Cross Tax AI sends the full report to your Make.com Custom Webhook.
                </p>
              </div>
            </div>

            <form onSubmit={handleTriggerWebhook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Make.com Custom Webhook URL:
                  </label>
                  <input
                    type="url"
                    required
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hook.eu1.make.com/..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Client Recipient Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isDispatching}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isDispatching ? 'Dispatching to Make.com...' : 'Dispatch Active Report to Make.com'}</span>
                </button>

                <button
                  type="button"
                  onClick={copyJsonPayload}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPayload ? 'Copied JSON!' : 'Copy Raw Payload JSON'}</span>
                </button>
              </div>
            </form>

            {/* Outbound Result */}
            {dispatchResult && (
              <div className={`p-4 rounded-xl border text-xs font-mono ${
                dispatchResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <strong>Dispatch Status:</strong> {dispatchResult.success ? 'Success' : 'Failed'}
                <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(dispatchResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Make.com Blueprint JSON */}
      {activeTab === 'blueprint' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                1-Click Make.com Scenario Blueprint
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Copy this blueprint and import directly into Make.com (More &rarr; Import Blueprint).
              </p>
            </div>

            <button
              onClick={copyBlueprint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
            >
              {copiedBlueprint ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedBlueprint ? 'Blueprint Copied!' : 'Copy Make.com Blueprint'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-96">
            <pre>{JSON.stringify(makeBlueprintJSON, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* TAB 3: Client Email Preview */}
      {activeTab === 'email_preview' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Customer Email Template Preview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                This is what your client receives automatically in their email inbox.
              </p>
            </div>

            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send This Email Now</span>
            </button>
          </div>

          <div className="max-w-2xl mx-auto border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 bg-slate-50/50">
            <div className="border-b border-slate-200 pb-3 space-y-1 text-xs">
              <div><strong className="text-slate-500">From:</strong> advisory@crosstax.ai</div>
              <div><strong className="text-slate-500">To:</strong> {targetEmail || report.contract.clientEmail}</div>
              <div><strong className="text-slate-500">Subject:</strong> Executive Tax Advisory Report: {report.contract.contractTitle} [{report.contract.residentCountry} &harr; {report.contract.sourceCountry}]</div>
            </div>

            <div className="text-xs sm:text-sm text-slate-800 space-y-3 leading-relaxed">
              <p>Dear <strong>{report.contract.clientName}</strong>,</p>
              <p>
                Our international tax engine has evaluated your cross-border services contract under bilateral Double Taxation Avoidance Agreements (DTAA) and statutory transfer pricing regulations.
              </p>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1.5 text-xs">
                <div className="font-bold text-red-900 text-sm">Key Evaluation Highlights:</div>
                <div>&bull; Transaction Value: <strong>{report.contract.currency} {report.contract.annualValue.toLocaleString()}</strong></div>
                <div>&bull; Foreign Tax Slashed: From {report.dtaa.domesticWhtRate}% to <strong>{report.dtaa.treatyWhtRate}%</strong></div>
                <div>&bull; Direct Cash Saved: <strong className="text-emerald-700 font-mono">+{report.contract.currency} {report.dtaa.estimatedTaxSavings.toLocaleString()}</strong></div>
                <div>&bull; Permanent Establishment (PE) Risk: <strong className="text-emerald-700 uppercase">{report.dtaa.peRiskLevel}</strong></div>
                <div>&bull; Fair Arm&apos;s Length Markup: <strong>{report.transferPricing.median}%</strong></div>
              </div>

              <p>
                All statutory legal forms (Form 10F, No-PE Certificate, Transfer Pricing Agreement clause) have been compiled and attached for your customer accounts department.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Live Webhook Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Live Automation &amp; Email Delivery Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit trail of all inbound leads, outbound webhook dispatches, and client emails.
              </p>
            </div>

            <button
              onClick={fetchLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-red-600" />
              <span>Refresh</span>
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No webhook dispatches yet. Use Tab 1 to send a test event or Tab 0 to dispatch a client email.
            </div>
          ) : (
            <div className="space-y-2.5">
              {logs.map((log) => (
                <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-red-100 text-red-700">
                        {log.id}
                      </span>
                      <span className="font-bold text-slate-900 truncate max-w-xs">{log.targetUrl}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Client: {log.clientEmail} • Savings: {log.payloadSummary.taxSavings} • PE: {log.payloadSummary.peRisk}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </span>
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      SUCCESS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
