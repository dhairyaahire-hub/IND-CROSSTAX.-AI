import React, { useState } from 'react';
import { Globe, Download, Copy, Check, X, ArrowRight, ExternalLink, ShieldCheck, FileText } from 'lucide-react';

interface DnsSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DnsSetupModal: React.FC<DnsSetupModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetAppUrl = 'ais-pre-pkq53dmoeozfih4gzay4w4-239492006750.asia-east1.run.app';

  const zoneContent = `crosstax.ai. 1 IN CNAME ${targetAppUrl}.
www.crosstax.ai. 1 IN CNAME ${targetAppUrl}.
crosstax.ai. 1 IN TXT "v=spf1 ~all"
`;

  const handleDownloadZone = (extension: 'txt' | 'zone') => {
    const blob = new Blob([zoneContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crosstax.ai-dns-records.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Drag &amp; Drop DNS Zone Files</h3>
              <p className="text-xs text-slate-500">Instant import for Cloudflare, Route53, and domain registrars</p>
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
        <div className="overflow-y-auto py-4 space-y-4 pr-1 text-xs">
          {/* Permanent Vercel & GitHub Public URL Card */}
          <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-white text-slate-900 flex items-center justify-center font-black text-xs">
                  ▲
                </div>
                <span className="font-extrabold text-sm text-white">Permanent Live URL: Vercel Cloud</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                24/7 PERMANENT UPTIME
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="font-mono text-amber-400 text-xs font-bold flex-1 select-all break-all">
                https://ind-crosstax-ai.vercel.app
              </span>
              <button
                onClick={() => copyToClipboard('https://ind-crosstax-ai.vercel.app', 'vercel-url')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copiedKey === 'vercel-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'vercel-url' ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href="https://ind-crosstax-ai.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shrink-0 cursor-pointer"
                title="Open Live Vercel App"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            
            <p className="text-[11px] text-slate-400">
              Configured via <code className="text-slate-300 font-mono">vercel.json</code> &amp; GitHub Actions (<code className="text-slate-300 font-mono">.github/workflows/deploy.yml</code>) for zero-downtime permanent publishing.
            </p>
          </div>

          {/* Download Box */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <FileText className="w-4 h-4 text-red-600" />
                <span>Cloudflare Drag-and-Drop Zone File</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Standard RFC 1035 BIND format with root `@`, `www`, and SPF records pre-configured.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleDownloadZone('txt')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .TXT</span>
              </button>
              <button
                onClick={() => handleDownloadZone('zone')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-lg transition shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .ZONE</span>
              </button>
            </div>
          </div>

          {/* How to Drag and Drop into Cloudflare */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-red-600" />
              How to Drag &amp; Drop into Cloudflare (in 30 seconds):
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
              <li>Log in to your <strong>Cloudflare Dashboard</strong> and click on <strong>crosstax.ai</strong>.</li>
              <li>Click <strong>DNS</strong> &rarr; <strong>Records</strong> in the left menu.</li>
              <li>Look for the <strong>&ldquo;Import and Export&rdquo;</strong> button (or Advanced settings).</li>
              <li>Click <strong>&ldquo;Import DNS records&rdquo;</strong> and <strong>Drag &amp; Drop</strong> the downloaded <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">crosstax.ai-dns-records.txt</code> file directly into the drop zone!</li>
              <li>Click <strong>Upload</strong>. Cloudflare instantly creates all records without typing.</li>
            </ol>

            {/* TTL Tip */}
            <div className="mt-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] space-y-1">
              <span className="font-bold block">💡 How to fix &ldquo;TTL Error&rdquo;:</span>
              <p>
                <strong>When uploading the file:</strong> The updated file above has been corrected with TTL set to <strong>1</strong> (which is Cloudflare&apos;s code for <em>Automatic</em>).
              </p>
              <p>
                <strong>When typing manually:</strong> Leave the TTL dropdown set to <strong>&ldquo;Auto&rdquo;</strong> (or <strong>1 min / 3600 seconds</strong>). Never type letters or zero.
              </p>
            </div>
          </div>

          {/* Manual Copy Records Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 text-xs">Individual DNS Records (For Manual Copy-Paste)</span>
              <span className="text-[10px] text-slate-500">TTL: Auto (3600s)</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Name / Host</th>
                    <th className="py-2 px-3">Target / Value</th>
                    <th className="py-2 px-3 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-red-600">CNAME</td>
                    <td className="py-2 px-3 font-mono">@ (or crosstax.ai)</td>
                    <td className="py-2 px-3 font-mono text-[10px] truncate max-w-[200px]" title={targetAppUrl}>
                      {targetAppUrl}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => copyToClipboard(targetAppUrl, 'cname-root')}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition cursor-pointer"
                      >
                        {copiedKey === 'cname-root' ? <Check className="w-3 h-3 text-emerald-600 inline" /> : <Copy className="w-3 h-3 inline" />}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-red-600">CNAME</td>
                    <td className="py-2 px-3 font-mono">www</td>
                    <td className="py-2 px-3 font-mono text-[10px] truncate max-w-[200px]" title={targetAppUrl}>
                      {targetAppUrl}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => copyToClipboard(targetAppUrl, 'cname-www')}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition cursor-pointer"
                      >
                        {copiedKey === 'cname-www' ? <Check className="w-3 h-3 text-emerald-600 inline" /> : <Copy className="w-3 h-3 inline" />}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-blue-600">TXT</td>
                    <td className="py-2 px-3 font-mono">@</td>
                    <td className="py-2 px-3 font-mono text-[10px]">v=spf1 ~all</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => copyToClipboard('v=spf1 ~all', 'txt-spf')}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition cursor-pointer"
                      >
                        {copiedKey === 'txt-spf' ? <Check className="w-3 h-3 text-emerald-600 inline" /> : <Copy className="w-3 h-3 inline" />}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Raw File Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-700 text-[11px]">Preview: crosstax.ai-dns-records.txt</span>
              <button
                onClick={() => copyToClipboard(zoneContent, 'raw-zone')}
                className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'raw-zone' ? 'Copied Full File!' : 'Copy Entire Text'}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed">
              {zoneContent}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <a
            href="https://dash.cloudflare.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-red-600"
          >
            <span>Open Cloudflare Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
