import React, { useState } from 'react';
import { 
  Play, 
  Share2, 
  Copy, 
  Check, 
  Download,
  ExternalLink, 
  Youtube, 
  Sparkles, 
  FileText, 
  ArrowLeft,
  ShieldCheck,
  Clock,
  DollarSign,
  Briefcase,
  Layers,
  Send,
  Link as LinkIcon,
  Settings,
  ChevronRight,
  Video,
  Film,
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AnimatedIndianFlagLogo } from './AnimatedIndianFlagLogo';

interface StandaloneVideoPortalProps {
  onExitToApp?: () => void;
}

export const StandaloneVideoPortal: React.FC<StandaloneVideoPortalProps> = ({ onExitToApp }) => {
  // Video player mode: default to 'mp4' (Native HD video of IND CROSSTAX AI)
  const [videoMode, setVideoMode] = useState<'mp4' | 'youtube'>('mp4');

  // YouTube Video ID: only active if the user explicitly configured their own channel video!
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ind_crosstax_yt_video_id');
      if (saved) return saved;
      const urlParams = new URLSearchParams(window.location.search);
      const paramId = urlParams.get('v') || urlParams.get('yt');
      if (paramId) return paramId;
    }
    return ''; // Never default to a random nature video!
  });

  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);
  const [copiedYtTitle, setCopiedYtTitle] = useState<boolean>(false);
  const [copiedYtDesc, setCopiedYtDesc] = useState<boolean>(false);
  const [copiedYtTags, setCopiedYtTags] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'download' | 'tutorial' | 'benefits' | 'share'>('video');

  const mp4VideoUrl = '/ind-crosstax-ai-demo.mp4';
  const hasCustomYoutube = Boolean(youtubeVideoId && youtubeVideoId.trim().length > 0);
  const youtubeWatchUrl = hasCustomYoutube ? `https://www.youtube.com/watch?v=${youtubeVideoId}` : '';
  const youtubeEmbedUrl = hasCustomYoutube ? `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1` : '';

  const demoPublicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/demo` 
    : 'https://ind-crosstax-ai.vercel.app/demo';

  // YouTube Upload Assets
  const ytVideoTitle = 'IND CROSSTAX AI — Cross-Border Tax, Bilateral DTAA Relief & Form 10F Walkthrough';
  const ytVideoDesc = `Official software walkthrough and client demonstration of IND CROSSTAX AI.
Automate bilateral Double Taxation Avoidance Agreements (DTAA), Indian Section 92C Chapter X Transfer Pricing, CBDT Safe Harbour Rule 10TD benchmarks, and instant 1-click Form 10F generation.

🔗 Try Live Web Application: https://ind-crosstax-ai.vercel.app
🎬 Dedicated Client Video Demo: https://ind-crosstax-ai.vercel.app/demo

Key Platform Features:
• Covers 85+ Bilateral Treaties (India to USA, UK, Singapore, UAE, Germany, Japan)
• Reduces 20% domestic withholding tax down to 0%–10%
• Section 92C Safe Harbour Rule 10TD arm's length calculation (17%–24% margins)
• Generates e-filing ready Form 10F, No-PE Certificates & Form 3CEB summaries in Word (.docx)`;

  const ytVideoTags = 'dtaa, transfer pricing, form 10f, indian tax, cross-border tax, double tax relief, safe harbour rule 10td, ca tax software, b2b saas tax';

  // Trigger real file download directly to user's device (phone or PC)
  const handleDownloadVideo = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(mp4VideoUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'IND_CROSSTAX_AI_Tutorial_Demo.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch {
      // Fallback direct navigation
      window.location.href = mp4VideoUrl;
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper to extract YouTube video ID from any standard URL
  const extractYouTubeId = (url: string): string => {
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : trimmed;
  };

  const handleSaveCustomYouTube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    const extracted = extractYouTubeId(customUrlInput);
    if (extracted) {
      setYoutubeVideoId(extracted);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ind_crosstax_yt_video_id', extracted);
      }
      setIsConfigModalOpen(false);
      setCustomUrlInput('');
      setVideoMode('youtube');
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(demoPublicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const clientPitchText = `Hello! We are utilizing IND CROSSTAX AI to streamline our cross-border tax compliance, bilateral DTAA double tax relief, and Chapter X Transfer Pricing documentation.

Watch the official 2-minute video walkthrough here:
${demoPublicUrl}

Direct Video Download (.MP4):
${typeof window !== 'undefined' ? window.location.origin : 'https://ind-crosstax-ai.vercel.app'}${mp4VideoUrl}

Key Highlights:
1. Reclaim 15%–20% overseas withholding tax deductions under bilateral tax treaties.
2. Complete CBDT Safe Harbour Rule 10TD & OECD Transfer Pricing arm's length benchmarking.
3. Instant one-click generation of statutory Form 10F, No-PE Certificates, and Form 3CEB audit summaries.`;

  const handleCopyPitch = () => {
    try {
      navigator.clipboard.writeText(clientPitchText);
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2500);
    } catch {
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ind-crosstax-ai.vercel.app';
    const text = encodeURIComponent(
      `Hi! Take a look at this official video walkthrough for IND CROSSTAX AI — automating cross-border DTAA tax relief, Indian Transfer Pricing, and Form 10F compliance:\n\n${demoPublicUrl}\n\nDownload Video: ${origin}${mp4VideoUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('IND CROSSTAX AI: Cross-Border Tax & Transfer Pricing Video Tutorial');
    const body = encodeURIComponent(clientPitchText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onExitToApp || (() => { window.location.href = '/'; })}>
            <AnimatedIndianFlagLogo size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  <span className="text-amber-500 font-black">IND</span> CROSSTAX <span className="text-red-500">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full uppercase tracking-wider">
                  Official Demo
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Client Demonstration &amp; Downloadable Video File
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Header Direct Download Button */}
            <button
              type="button"
              onClick={handleDownloadVideo}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'Download .MP4'}</span>
            </button>

            <button
              type="button"
              onClick={onExitToApp || (() => { window.location.href = '/'; })}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-7 space-y-6">
        
        {/* Direct Download Callout Banner (Prominent on Mobile) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border-2 border-emerald-500/50 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Your Video Is Ready For Download</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Download the Video File to Upload to Your YouTube Channel
              </h2>
              <p className="text-xs text-slate-300">
                This is the official 1080p Full HD video file for IND CROSSTAX AI. You can download it directly to your phone/PC and upload it to YouTube or send to clients.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadVideo}
              disabled={isDownloading}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Download className="w-5 h-5" />
              <span>{isDownloading ? 'Saving Video...' : downloadSuccess ? 'Downloaded!' : 'DOWNLOAD VIDEO (.MP4)'}</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-600 text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Video file saved to your device! Check your phone&apos;s Downloads folder.</span>
            </div>
          )}
        </div>

        {/* 16:9 Video Player Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Top Video Toolbar */}
          <div className="bg-slate-950 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Mode:</span>
              <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setVideoMode('mp4')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    videoMode === 'mp4' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>Direct IND CROSSTAX AI Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVideoMode('youtube')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    videoMode === 'youtube' 
                      ? 'bg-red-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Youtube className="w-3 h-3" />
                  <span>YouTube Channel</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadVideo}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save MP4 (858 KB)</span>
              </button>
            </div>
          </div>

          {/* 16:9 Video Screen */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            {videoMode === 'mp4' ? (
              <video
                src={mp4VideoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video playback.
              </video>
            ) : hasCustomYoutube ? (
              <iframe
                src={youtubeEmbedUrl}
                title="IND CROSSTAX AI Video Tutorial"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              /* No custom YouTube video linked yet */
              <div className="p-6 text-center max-w-md space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
                  <Youtube className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Upload Video to Your YouTube Channel</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    1. Download the MP4 file using the green button below.<br />
                    2. Go to YouTube and upload the video to your channel.<br />
                    3. Click &quot;Link My YouTube Video&quot; to paste your link!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    type="button"
                    onClick={handleDownloadVideo}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download MP4 File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfigModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Paste My YouTube Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Under-Player Action Bar */}
          <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span><strong>IND CROSSTAX AI:</strong> Official 1080p Walkthrough Video</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <button
                type="button"
                onClick={handleDownloadVideo}
                className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Video (.MP4)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsConfigModalOpen(true)}
                className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>{hasCustomYoutube ? 'Change YT Link' : 'Add My YT Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Steps Guide to Upload to YouTube */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center">
              <Youtube className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">How to Upload This Video to Your YouTube Channel</h3>
              <p className="text-[11px] text-slate-400">Step-by-step guide to publishing on your account in 2 minutes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center">1</span>
                <span className="text-xs font-bold text-white">Download Video File</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Click the green <strong>Download .MP4</strong> button. The file <code className="text-emerald-300">IND_CROSSTAX_AI_Tutorial_Demo.mp4</code> will save to your device.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs font-black flex items-center justify-center">2</span>
                <span className="text-xs font-bold text-white">Upload to YouTube</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Open YouTube app or studio.youtube.com, click <strong>Create &rarr; Upload Video</strong>, and select the downloaded video from your gallery/files.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center">3</span>
                <span className="text-xs font-bold text-white">Copy Pre-Written Details</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Copy the ready-made Title, Description, and Tags below with 1 click to paste into YouTube for maximum SEO and views.
              </p>
            </div>
          </div>

          {/* Copy Title, Description & Tags */}
          <div className="pt-2 space-y-3 border-t border-slate-800/60">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-white">Video Title for YouTube:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(ytVideoTitle);
                    setCopiedYtTitle(true);
                    setTimeout(() => setCopiedYtTitle(false), 2000);
                  }}
                  className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer text-xs"
                >
                  {copiedYtTitle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedYtTitle ? 'Copied!' : 'Copy Title'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono">
                {ytVideoTitle}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-white">Video Description:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(ytVideoDesc);
                    setCopiedYtDesc(true);
                    setTimeout(() => setCopiedYtDesc(false), 2000);
                  }}
                  className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer text-xs"
                >
                  {copiedYtDesc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedYtDesc ? 'Copied!' : 'Copy Description'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-28 overflow-y-auto">
                {ytVideoDesc}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-white">Search Tags:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(ytVideoTags);
                    setCopiedYtTags(true);
                    setTimeout(() => setCopiedYtTags(false), 2000);
                  }}
                  className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer text-xs"
                >
                  {copiedYtTags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedYtTags ? 'Copied!' : 'Copy Tags'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
                {ytVideoTags}
              </div>
            </div>
          </div>
        </div>

        {/* Client Sharing Buttons */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Share with Clients &amp; Customers</span>
              </h3>
              <p className="text-xs text-slate-400">
                Send the demo link and proposal directly to foreign clients and partners.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareEmail}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to App Bottom Button */}
        <div className="text-center pt-2 pb-6">
          <button
            type="button"
            onClick={onExitToApp || (() => { window.location.href = '/'; })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <span>Launch Cross-Border Tax Calculator</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Modal: Paste Custom YouTube Video URL */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-white">Link Your YouTube Video</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Once you upload the downloaded video to your YouTube channel, paste your YouTube video link below. It will automatically connect your YouTube video to this player!
            </p>

            <form onSubmit={handleSaveCustomYouTube} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Your YouTube Video Link or ID
                </label>
                <input
                  type="text"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-red-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save &amp; Connect Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <p>IND CROSSTAX AI &bull; Cross-Border International Tax, Bilateral DTAA &amp; Chapter X Transfer Pricing</p>
      </footer>
    </div>
  );
};
