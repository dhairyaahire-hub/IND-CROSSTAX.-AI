import React, { useState } from 'react';
import { Shield, X, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Privacy Policy &amp; Terms</h3>
              <p className="text-xs text-slate-500">IND CROSSTAX AI &bull; Last updated October 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-4 text-xs text-slate-600 space-y-4 pr-1 leading-relaxed">
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-600" />
              1. Zero-Retention Financial Privacy
            </h4>
            <p>
              IND CROSSTAX AI operates on a client-first privacy architecture. All contract evaluation figures, financial turnover, profit margins, and taxpayer names entered into the calculation engines are processed ephemerally in-memory and are not permanently stored or shared with external third-party advertisers.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-red-600" />
              2. Cookies &amp; Advertising (Google AdSense)
            </h4>
            <p>
              This website may display advertisements served by Google AdSense and third-party advertising partners. Google uses cookies, including the DoubleClick cookie, to serve ads based on prior visits to our website and other sites across the Internet.
            </p>
            <p>
              Users may opt out of personalized advertising by visiting Google Ads Settings (www.google.com/settings/ads) or through the Network Advertising Initiative (www.aboutads.info).
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-red-600" />
              3. Analytics &amp; User Feedback
            </h4>
            <p>
              We collect anonymous traffic telemetry (via Google Analytics / Search Console) such as page visits, browser types, and geographic countries to improve application performance. Voluntary feedback submitted through our feedback widget is used solely to enhance customer experience.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              4. Disclaimer of Legal Advice
            </h4>
            <p>
              IND CROSSTAX AI provides automated simulations based on Indian Income-tax Act (Chapter X), bilateral treaties, and OECD guidelines. Outputs do not constitute formal legal or certified accounting opinions. Taxpayers should verify specific treaty articles with certified Chartered Accountants or CPAs.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition cursor-pointer"
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
