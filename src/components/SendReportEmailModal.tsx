import React, { useState } from 'react';
import { FullTaxAnalysisReport } from '../types/tax';
import { 
  Mail, 
  Send, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FileText,
  DollarSign,
  ShieldCheck,
  Check
} from 'lucide-react';

interface SendReportEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: FullTaxAnalysisReport;
}

export const SendReportEmailModal: React.FC<SendReportEmailModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  const { contract, dtaa } = report;
  const [recipientEmail, setRecipientEmail] = useState<string>(contract.clientEmail || '');
  const [clientName, setClientName] = useState<string>(contract.clientName || '');
  const [customMessage, setCustomMessage] = useState<string>(
    `Hi ${contract.clientName.split(' ')[0]}, please review your cross-border tax advisory report. Based on the ${contract.residentCountry}-${contract.sourceCountry} DTAA, you qualify to save ${contract.currency} ${dtaa.estimatedTaxSavings.toLocaleString()} in foreign tax withholding.`
  );
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    subject?: string;
    messageId?: string;
    error?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/send-report-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          clientName,
          report,
          customMessage,
          includeDrafts: true
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch email');
      }

      setSendResult({
        success: true,
        subject: data.subject,
        messageId: data.messageId
      });
    } catch (err: any) {
      setSendResult({
        success: false,
        error: err.message || 'Email delivery failed'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Automated Email Report
            </h3>
            <p className="text-xs text-slate-500">
              Deliver complete executive DTAA &amp; Transfer Pricing analysis directly to client
            </p>
          </div>
        </div>

        {sendResult?.success ? (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-sm text-emerald-900">
                  Report Successfully Sent!
                </div>
                <p className="text-emerald-700">
                  Delivered to <strong>{recipientEmail}</strong> with message ID <code>{sendResult.messageId}</code>.
                </p>
                <div className="pt-2 text-[11px] text-emerald-800">
                  <strong>Subject:</strong> {sendResult.subject}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-700 uppercase text-[10px] block">
                What the Customer Received:
              </span>
              <ul className="space-y-1 list-disc pl-4 text-slate-600">
                <li>Estimated Tax Savings: <strong>+{contract.currency} {dtaa.estimatedTaxSavings.toLocaleString()}</strong></li>
                <li>Treaty Withholding Rate vs Domestic Tax Comparison</li>
                <li>Permanent Establishment Risk Analysis ({dtaa.peRiskLevel.toUpperCase()})</li>
                <li>Arm&apos;s Length Markup Benchmarks ({report.transferPricing.median}%)</li>
                <li>Compliance Checklist (TRC, Form 10F, W-8BEN-E, Local File)</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {sendResult?.error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{sendResult.error}</span>
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-700 block">Report Client</span>
                <span className="font-bold text-slate-900 truncate">{contract.clientName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Tax Savings</span>
                <span className="font-mono font-bold text-emerald-600">+{contract.currency} {dtaa.estimatedTaxSavings.toLocaleString()}</span>
              </div>
            </div>

            {/* Recipient Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Customer Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-red-500 font-medium"
              />
            </div>

            {/* Client Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Customer / Representative Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. John Doe / CFO"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-red-500 font-medium"
              />
            </div>

            {/* Custom Advisor Message */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tax Advisor Personal Note (Included in Email)
              </label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-red-500 leading-relaxed font-sans"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending Email...' : 'Send Automated Email Now'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
