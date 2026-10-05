import React from 'react';
import { DollarSign, ExternalLink, Sparkles } from 'lucide-react';

interface AdSenseBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle';
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId = 'crosstax_sponsor_slot',
  format = 'horizontal'
}) => {
  return (
    <div className="w-full my-6 p-3 rounded-2xl bg-gradient-to-r from-slate-50 via-red-50/30 to-slate-50 border border-dashed border-red-200/80 text-center">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-1">
        <div className="flex items-center gap-2.5 text-left">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                Sponsor / Ad Slot
              </span>
              <span className="text-xs font-bold text-slate-800">
                International Corporate Tax &amp; Transfer Pricing Advisory
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Targeted finance &amp; DTAA cross-border tax solutions for global enterprises
            </p>
          </div>
        </div>

        <a
          href="https://adsense.google.com/start/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-red-600 hover:border-red-200 text-xs font-bold transition shadow-2xs shrink-0 cursor-pointer"
        >
          <span>Connect Google AdSense</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
