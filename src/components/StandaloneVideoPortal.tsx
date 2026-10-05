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
  Film
} from 'lucide-react';
import { AnimatedIndianFlagLogo } from './AnimatedIndianFlagLogo';

interface StandaloneVideoPortalProps {
  onExitToApp?: () => void;
}

export const StandaloneVideoPortal: React.FC<StandaloneVideoPortalProps> = ({ onExitToApp }) => {
  // Video player mode: 'mp4' (Native HTML5 MP4 player) or 'youtube' (Embedded YouTube player)
  const [videoMode, setVideoMode] = useState<'mp4' | 'youtube'>('mp4');

  // Default YouTube Video ID (editable by user and saved to localStorage)
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ind_crosstax_yt_video_id');
      if (saved) return saved;
      const urlParams = new URLSearchParams(window.location.search);
      const paramId = urlParams.get('v') || urlParams.get('yt');
      if (paramId) return paramId;
    }
    return 'LXb3EKWsInQ';
  });

  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);
  const [copiedYtTitle, setCopiedYtTitle] = useState<boolean>(false);
  const [copiedYtDesc, setCopiedYtDesc] = useState<boolean>(false);
  const [copiedYtTags, setCopiedYtTags] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'download' | 'tutorial' | 'benefits' | 'share'>('video');

  const mp4VideoUrl = '/ind-crosstax-ai-demo.mp4';
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
  const youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`;
  const demoPublicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/demo` 
    : 'https://ind-crosstax-ai.vercel.app/demo';

  // YouTube Upload Assets
  const ytVideoTitle = 'IND CROSSTAX AI — Cross-Border Tax, Bilateral DTAA Relief & Form 10F Walkthrough';
  const ytVideoDesc = `Official client demonstration & software walkthrough for IND CROSSTAX AI.
Automate bilateral Double Taxation Avoidance Agreements (DTAA), Indian Section 92C Chapter X Transfer Pricing, Safe Harbour Rule 10TD benchmarks, and instant 1-click Form 10F generation.

🔗 Try Live Web Application: https://ind-crosstax-ai.vercel.app
🎬 Dedicated Client Video Demo: https://ind-crosstax-ai.vercel.app/demo

Key Platform Features:
• Covers 85+ Bilateral Treaties (India to USA, UK, Singapore, UAE, Germany, Japan)
• Reduces 20% domestic withholding tax to 0%–10%
• Section 92C Safe Harbour Rule 10TD arm's length calculation (17%–24% margins)
• Generates e-filing ready Form 10F, No-PE Certificates & Form 3CEB summaries in Word (.docx)`;

  const ytVideoTags = 'dtaa, transfer pricing, form 10f, indian tax, cross-border tax, double tax relief, safe harbour rule 10td, ca tax software, b2b saas tax';

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
${window.location.origin}${mp4VideoUrl}

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
    const text = encodeURIComponent(
      `Hi! Take a look at this official video walkthrough for IND CROSSTAX AI — automating cross-border DTAA tax relief, Indian Transfer Pricing, and Form 10F compliance:\n\n${demoPublicUrl}\n\nDownload Video: ${window.location.origin}${mp4VideoUrl}`
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
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onExitToApp || (() => { window.location.href = '/'; })}>
            <AnimatedIndianFlagLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  <span className="text-amber-500 font-black">IND</span> CROSSTAX <span className="text-red-500">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-800/60 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Film className="w-3 h-3 text-red-500" />
                  <span>Video Hub &amp; Download</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Client Demonstration, Tutorial &amp; Downloadable Video
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct MP4 Download Button in Header */}
            <a
              href={mp4VideoUrl}
              download="IND_CROSSTAX_AI_Tutorial_Demo.mp4"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
              title="Download MP4 Video File"
            >
              <Download className="w-4 h-4" />
              <span>Download .MP4</span>
            </a>

            <button
              type="button"
              onClick={onExitToApp || (() => { window.location.href = '/'; })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Web App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Hero Title & Download Highlights */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Separate Video File Ready for Download &amp; YouTube Upload</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Official IND CROSSTAX AI Video Presentation &amp; Tutorial
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Download the official Full HD MP4 video file to upload to your YouTube channel or send directly to overseas clients, partners, and finance directors.
          </p>

          {/* Download & Client Action Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <a
              href={mp4VideoUrl}
              download="IND_CROSSTAX_AI_Tutorial_Demo.mp4"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-lg hover:scale-105 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Video (.MP4 • 1080p)</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Client Demo Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp Video Link</span>
            </button>
          </div>
        </div>

        {/* Video Mode Selector & 16:9 Video Player Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          {/* Player Mode Switcher */}
          <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Player Format:</span>
              <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setVideoMode('mp4')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    videoMode === 'mp4' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Native MP4 Video (Direct File)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVideoMode('youtube')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    videoMode === 'youtube' 
                      ? 'bg-red-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>YouTube Player</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={mp4VideoUrl}
                download="IND_CROSSTAX_AI_Tutorial_Demo.mp4"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save MP4 (839 KB)</span>
              </a>

              {videoMode === 'youtube' && (
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 ml-2"
                >
                  <Settings className="w-3 h-3" />
                  <span>Edit YT Link</span>
                </button>
              )}
            </div>
          </div>

          {/* 16:9 Video Display Stage */}
          <div className="relative aspect-video w-full bg-black">
            {videoMode === 'mp4' ? (
              <video
                src={mp4VideoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={youtubeEmbedUrl}
                title="IND CROSSTAX AI Video Tutorial"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>

          {/* Under-Player Control & Quick Links Bar */}
          <div className="p-4 sm:p-5 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span><strong>File Ready:</strong> 1080p Full HD MP4 video file available for immediate download.</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <a
                href={mp4VideoUrl}
                download="IND_CROSSTAX_AI_Tutorial_Demo.mp4"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Video File (.MP4)</span>
              </a>

              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5"
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>

              <button
                type="button"
                onClick={handleCopyPitch}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedPitch ? 'Copied Pitch!' : 'Copy Client Pitch'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('download')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'download' || activeTab === 'video'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Video &amp; YouTube Upload Kit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tutorial')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'tutorial'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tutorial: How to Use in 3 Steps</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('benefits')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'benefits'
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Core Business Benefits</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('share')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'share'
                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Client Outreach Kit</span>
          </button>
        </div>

        {/* TAB 0: Download & YouTube Upload Kit */}
        {(activeTab === 'download' || activeTab === 'video') && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Downloadable Video File (.MP4)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Standalone video file ready for download, offline playback, client presentations, or uploading to YouTube.
                  </p>
                </div>

                <a
                  href={mp4VideoUrl}
                  download="IND_CROSSTAX_AI_Tutorial_Demo.mp4"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-md shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .MP4 (839 KB)</span>
                </a>
              </div>

              {/* Video Specs Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Format</div>
                  <div className="text-xs font-bold text-white mt-0.5">MP4 (H.264 / AAC)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Resolution</div>
                  <div className="text-xs font-bold text-white mt-0.5">1920x1080 Full HD</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Audio Track</div>
                  <div className="text-xs font-bold text-white mt-0.5">Harmonic Pad Audio</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Language</div>
                  <div className="text-xs font-bold text-white mt-0.5">100% English</div>
                </div>
              </div>
            </div>

            {/* YouTube Upload Kit */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/20 via-slate-900 to-slate-950 border border-red-900/30 space-y-4">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-white">YouTube Upload Kit (Pre-Formatted Title, Description &amp; Tags)</h3>
              </div>
              <p className="text-xs text-slate-400">
                When uploading the downloaded MP4 video to YouTube, copy and paste the pre-written metadata below for instant SEO optimization:
              </p>

              <div className="space-y-3">
                {/* Title */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold">Video Title:</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(ytVideoTitle);
                        setCopiedYtTitle(true);
                        setTimeout(() => setCopiedYtTitle(false), 2000);
                      }}
                      className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedYtTitle ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedYtTitle ? 'Copied!' : 'Copy Title'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono">
                    {ytVideoTitle}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold">Video Description:</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(ytVideoDesc);
                        setCopiedYtDesc(true);
                        setTimeout(() => setCopiedYtDesc(false), 2000);
                      }}
                      className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedYtDesc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedYtDesc ? 'Copied!' : 'Copy Description'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {ytVideoDesc}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold">Search Tags / Keywords:</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(ytVideoTags);
                        setCopiedYtTags(true);
                        setTimeout(() => setCopiedYtTags(false), 2000);
                      }}
                      className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedYtTags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedYtTags ? 'Copied!' : 'Copy Tags'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
                    {ytVideoTags}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Step-by-Step Tutorial */}
        {(activeTab === 'tutorial' || activeTab === 'video') && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Step-by-Step Platform Tutorial</h3>
                <p className="text-xs text-slate-400">Everything needed to evaluate a cross-border contract and produce audit-proof documents.</p>
              </div>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/40">
                3-Minute Completion
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-sm border border-amber-500/30">
                  1
                </div>
                <h4 className="text-sm font-bold text-white">Enter Contract Details</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select origin and customer countries (e.g. India &rarr; USA, Singapore, UAE, UK). Enter annual value, nature of service (IT, Software, Management Fees), and cost base.
                </p>
                <div className="pt-2 text-[11px] text-amber-300/80 font-mono">
                  &bull; Instant foreign currency conversion
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 font-extrabold flex items-center justify-center text-sm border border-red-500/30">
                  2
                </div>
                <h4 className="text-sm font-bold text-white">Automated Tax &amp; TP Engine</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The AI compares domestic withholding taxes vs bilateral DTAA rates, evaluates Permanent Establishment risk under Article 5, and applies Indian Safe Harbour Rule 10TD margins.
                </p>
                <div className="pt-2 text-[11px] text-emerald-400 font-mono">
                  &bull; 20% tax reduced to 0%–10%
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-extrabold flex items-center justify-center text-sm border border-indigo-500/30">
                  3
                </div>
                <h4 className="text-sm font-bold text-white">Download Statutory Drafts</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate official electronic Form 10F, No-PE and Beneficial Ownership Declarations, and Form 3CEB audit briefing sheets in Word (.docx) ready for e-filing.
                </p>
                <div className="pt-2 text-[11px] text-indigo-300 font-mono">
                  &bull; 1-Click e-filing ready export
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Business Benefits */}
        {(activeTab === 'benefits' || activeTab === 'video') && (
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-lg font-bold text-white">Key Business Benefits for Clients &amp; Companies</h3>
              <p className="text-xs text-slate-400">Measurable return on investment and risk mitigation for enterprise tax desks and exporters.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Stop 15%–20% Foreign Withholding Leakage</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Prevent foreign clients from deducting 20% to 30% taxes on invoices by establishing valid treaty relief under Section 90 of the Income Tax Act.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Zero Transfer Pricing Audit Adjustments</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ensure associated enterprise intercompany charges fall within Indian CBDT Safe Harbour Rule 10TD (17%–24%) and OECD arm's length interquartile benchmarks.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Cut Tax Advisory Turnaround by 95%</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Replace 10 to 14 days of manual treaty cross-referencing and jurisprudence analysis with an immediate, validated 3-minute audit report.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Bank &amp; Indian Tax Department Accepted</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generate compliant Word (.docx) &amp; PDF filings matching Indian e-Filing Rule 21AB specifications and international banking remittance prerequisites.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Client Outreach Kit */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Direct Client &amp; Customer Outreach Kit</span>
              </h3>
              <p className="text-xs text-slate-400">
                Send this video and platform invitation directly to your overseas clients, partners, and finance directors.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp to Client</span>
              </button>

              <button
                type="button"
                onClick={handleShareEmail}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Proposal</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 relative group">
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">
              {clientPitchText}
            </pre>
            <button
              type="button"
              onClick={handleCopyPitch}
              className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedPitch ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>{copiedPitch ? 'Copied!' : 'Copy Template'}</span>
            </button>
          </div>
        </div>

        {/* Bottom CTA to launch interactive calculator */}
        <div className="text-center pt-4 pb-8">
          <button
            type="button"
            onClick={onExitToApp || (() => { window.location.href = '/'; })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <span>Launch Cross-Border Tax Calculator Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Modal: Configure / Change YouTube Video Link */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-white">Set Your YouTube Video Link</h3>
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
              When you upload your demo or customer video to YouTube, paste the full URL or Video ID below. It will automatically update the video player and YouTube links.
            </p>

            <form onSubmit={handleSaveCustomYouTube} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  YouTube Video Link or ID
                </label>
                <input
                  type="text"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-red-500"
                  autoFocus
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div><strong>Current Active Video ID:</strong> <code className="text-amber-400">{youtubeVideoId}</code></div>
                <div><strong>Current Link:</strong> <a href={youtubeWatchUrl} target="_blank" rel="noreferrer" className="text-red-400 hover:underline">{youtubeWatchUrl}</a></div>
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
                  Save &amp; Update Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>IND CROSSTAX AI &bull; Cross-Border International Tax, Bilateral DTAA &amp; Chapter X Transfer Pricing Platform</p>
      </footer>
    </div>
  );
};
