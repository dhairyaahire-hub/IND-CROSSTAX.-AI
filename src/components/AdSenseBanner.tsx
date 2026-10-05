import React, { useEffect } from 'react';
import { DollarSign, ExternalLink } from 'lucide-react';

interface AdSenseBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'auto';
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId,
  format = 'auto'
}) => {
  const publisherId = 'ca-pub-9523390759821280';

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ignore adsbygoogle errors when ad blockers or offline
    }
  }, []);

  return (
    <div className="w-full my-6 p-2 rounded-2xl bg-gradient-to-r from-slate-50 via-red-50/20 to-slate-50 border border-slate-200/80 text-center overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1 text-[10px] text-slate-400 font-mono border-b border-slate-100 mb-2">
        <span>Advertisement &bull; Google AdSense</span>
        <span className="text-slate-400">ca-pub-9523390759821280</span>
      </div>

      {slotId ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-2">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                  Google AdSense Active
                </span>
                <span className="text-xs font-bold text-slate-800">
                  International Corporate Tax &amp; Transfer Pricing Advisory
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Publisher: {publisherId} &bull; Cross-border DTAA and financial solutions
              </p>
            </div>
          </div>

          <a
            href="https://adsense.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-red-600 hover:border-red-200 text-xs font-bold transition shadow-2xs shrink-0 cursor-pointer"
          >
            <span>Google AdSense Verified</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
