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
  Image as ImageIcon,
  Volume2,
  Globe
} from 'lucide-react';
import { AnimatedIndianFlagLogo } from './AnimatedIndianFlagLogo';

interface StandaloneVideoPortalProps {
  onExitToApp?: () => void;
}

export const StandaloneVideoPortal: React.FC<StandaloneVideoPortalProps> = ({ onExitToApp }) => {
  // Video player mode: 'mp4' or 'youtube'
  const [videoMode, setVideoMode] = useState<'mp4' | 'youtube'>('mp4');

  // Spoken voiceover language: 'hi' (Hindi / हिंदी) or 'en' (English)
  const [audioLang, setAudioLang] = useState<'hi' | 'en'>('hi');

  // YouTube Video ID (only if configured by user)
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ind_crosstax_yt_video_id');
      if (saved) return saved;
      const urlParams = new URLSearchParams(window.location.search);
      const paramId = urlParams.get('v') || urlParams.get('yt');
      if (paramId) return paramId;
    }
    return '';
  });

  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [downloadingLang, setDownloadingLang] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);
  const [copiedYtTitle, setCopiedYtTitle] = useState<boolean>(false);
  const [copiedYtDesc, setCopiedYtDesc] = useState<boolean>(false);
  const [copiedYtTags, setCopiedYtTags] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'pamphlets' | 'tutorial' | 'benefits' | 'share'>('video');

  const activeVideoUrl = audioLang === 'hi' ? '/ind-crosstax-ai-demo-hi.mp4' : '/ind-crosstax-ai-demo-en.mp4';
  const hasCustomYoutube = Boolean(youtubeVideoId && youtubeVideoId.trim().length > 0);
  const youtubeWatchUrl = hasCustomYoutube ? `https://www.youtube.com/watch?v=${youtubeVideoId}` : '';
  const youtubeEmbedUrl = hasCustomYoutube ? `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1` : '';

  const demoPublicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/demo` 
    : 'https://ind-crosstax-ai.vercel.app/demo';

  // Pamphlets data
  const pamphlets = [
    {
      id: 'pamphlet-1',
      title: 'B2B Client Sales Flyer',
      subtitle: 'Stop 20% Overseas Tax Leakage',
      file: '/pamphlet-1-b2b-sales.png',
      badge: 'Best for IT & Exporters',
      desc: 'High-impact A4 brochure illustrating how foreign clients deduct 20% taxes, and how bilateral DTAA optimization eliminates tax leakage.'
    },
    {
      id: 'pamphlet-2',
      title: 'CA & Tax Firm Toolkit Flyer',
      subtitle: 'चार्टर्ड अकाउंटेंट्स के लिए पार्टनर ब्रोशर',
      file: '/pamphlet-2-ca-partner.png',
      badge: 'For Chartered Accountants',
      desc: 'Tailored specifically for Chartered Accountants, corporate finance desks, and tax lawyers offering Section 92C Chapter X & Form 10F services.'
    },
    {
      id: 'pamphlet-3',
      title: 'Features & ROI Comparison Sheet',
      subtitle: 'Old Manual Method vs IND CROSSTAX AI',
      file: '/pamphlet-3-features-roi.png',
      badge: 'Executive Summary',
      desc: 'Side-by-side comparison of 14-day manual advisory research vs 3-minute AI audit dossier with proven ROI savings up to $200,000+.'
    }
  ];

  // YouTube Upload Assets
  const ytVideoTitle = audioLang === 'hi'
    ? 'IND CROSSTAX AI — विदेशों से टैक्स कटौती (20%) कैसे बचाएं | DTAA & Form 10F ट्यूटोरियल'
    : 'IND CROSSTAX AI — Cross-Border Tax, Bilateral DTAA Relief & Form 10F Walkthrough';

  const ytVideoDesc = audioLang === 'hi'
    ? `इंड क्रॉसटैक्स एआई (IND CROSSTAX AI) का आधिकारिक हिंदी वीडियो ट्यूटोरियल।
जानिए कैसे 85 से अधिक देशों की डीटीएए ट्रीटी (DTAA Treaty) के तहत 20% विदहोल्डिंग टैक्स को घटाकर 0% से 10% किया जा सकता है।

🔗 लाइव वेबसाइट: https://ind-crosstax-ai.vercel.app
🎬 वीडियो डेमो: https://ind-crosstax-ai.vercel.app/demo

मुख्य विशेषताएं:
• 85+ देशों के साथ ट्रीटी रिलीफ (USA, UK, Singapore, UAE, Germany, Japan)
• धारा 92C सेफ हार्बर रूल 10TD आर्म्स लेंथ मार्जिन (17% से 24%)
• ई-फाइलिंग के लिए तुरंत फॉर्म 10F, No-PE सर्टिफिकेट व फॉर्म 3CEB सारांश`
    : `Official software walkthrough and client demonstration of IND CROSSTAX AI.
Automate bilateral Double Taxation Avoidance Agreements (DTAA), Indian Section 92C Chapter X Transfer Pricing, CBDT Safe Harbour Rule 10TD benchmarks, and instant 1-click Form 10F generation.

🔗 Try Live Web Application: https://ind-crosstax-ai.vercel.app
🎬 Dedicated Client Video Demo: https://ind-crosstax-ai.vercel.app/demo

Key Platform Features:
• Covers 85+ Bilateral Treaties (India to USA, UK, Singapore, UAE, Germany, Japan)
• Reduces 20% domestic withholding tax down to 0%–10%
• Section 92C Safe Harbour Rule 10TD arm's length calculation (17%–24% margins)
• Generates e-filing ready Form 10F, No-PE Certificates & Form 3CEB summaries in Word (.docx)`;

  const ytVideoTags = 'dtaa, transfer pricing, form 10f, indian tax, cross-border tax, double tax relief, safe harbour rule 10td, ca tax software, b2b saas tax';

  // Download video file directly to phone/PC
  const handleDownloadVideo = async (lang: 'hi' | 'en') => {
    setDownloadingLang(lang);
    const targetUrl = lang === 'hi' ? '/ind-crosstax-ai-demo-hi.mp4' : '/ind-crosstax-ai-demo-en.mp4';
    const fileName = lang === 'hi' ? 'IND_CROSSTAX_AI_Hindi_Demo.mp4' : 'IND_CROSSTAX_AI_English_Demo.mp4';

    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      setDownloadSuccess(lang);
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch {
      window.location.href = targetUrl;
    } finally {
      setDownloadingLang(null);
    }
  };

  // Download pamphlet image
  const handleDownloadPamphlet = async (pamphlet: typeof pamphlets[0]) => {
    try {
      const response = await fetch(pamphlet.file);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${pamphlet.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.location.href = pamphlet.file;
    }
  };

  const handleSharePamphletWhatsApp = (pamphlet: typeof pamphlets[0]) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ind-crosstax-ai.vercel.app';
    const text = encodeURIComponent(
      `Take a look at the official marketing flyer for IND CROSSTAX AI (${pamphlet.title}):\n\n${origin}${pamphlet.file}\n\nTry the live tax app: ${origin}\nWatch the video demo: ${origin}/demo`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Helper to extract YouTube video ID from any standard URL
  const extractYouTubeId = (url: string): string => {
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
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

Watch the official video walkthrough here:
${demoPublicUrl}

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
      `Hi! Take a look at this official video walkthrough for IND CROSSTAX AI — automating cross-border DTAA tax relief, Indian Transfer Pricing, and Form 10F compliance:\n\n${demoPublicUrl}\n\nLive App: ${origin}`
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
                  Video &amp; Sales Hub
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Spoken Voiceover Videos (Hindi &amp; English) &amp; Downloadable Marketing Pamphlets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Header Direct Download Buttons */}
            <button
              type="button"
              onClick={() => handleDownloadVideo('hi')}
              disabled={Boolean(downloadingLang)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-sm cursor-pointer"
              title="Download Video with Hindi Voiceover"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingLang === 'hi' ? 'Downloading...' : 'हिंदी Video'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadVideo('en')}
              disabled={Boolean(downloadingLang)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm cursor-pointer"
              title="Download Video with English Voiceover"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingLang === 'en' ? 'Downloading...' : 'English Video'}</span>
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
        
        {/* Voiceover & Pamphlet Notice Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border-2 border-amber-500/40 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                <Volume2 className="w-3 h-3 text-amber-400" />
                <span>Spoken Audio Voiceover &amp; Sales Pamphlets Included</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Download Official Spoken Videos (Hindi &amp; English) + Selling Pamphlets
              </h2>
              <p className="text-xs text-slate-300">
                You can listen to the clear human voiceover in <strong>Hindi (हिंदी आवाज़)</strong> or <strong>English</strong>, download the `.mp4` videos to upload to YouTube, and download high-resolution marketing flyers to sell directly to clients!
              </p>
            </div>

            <div className="flex gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => handleDownloadVideo('hi')}
                disabled={Boolean(downloadingLang)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-extrabold text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingLang === 'hi' ? 'Saving...' : 'Download Hindi Video (.MP4)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadVideo('en')}
                disabled={Boolean(downloadingLang)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingLang === 'en' ? 'Saving...' : 'Download English Video (.MP4)'}</span>
              </button>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-600 text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Video file downloaded successfully to your device! Check your Downloads folder.</span>
            </div>
          )}
        </div>

        {/* 16:9 Video Player Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Top Video Toolbar: Audio Language & Mode Toggle */}
          <div className="bg-slate-950 border-b border-slate-800 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap">
            {/* Audio Voice Language Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Voice Audio:</span>
              </span>
              <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setAudioLang('hi'); setVideoMode('mp4'); }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    audioLang === 'hi' && videoMode === 'mp4'
                      ? 'bg-amber-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇮🇳 हिंदी आवाज़ (Hindi Voice)</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAudioLang('en'); setVideoMode('mp4'); }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    audioLang === 'en' && videoMode === 'mp4'
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>English Voice</span>
                </button>
              </div>
            </div>

            {/* Format toggle: MP4 / YouTube */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVideoMode(videoMode === 'mp4' ? 'youtube' : 'mp4')}
                className="text-xs text-slate-400 hover:text-white font-semibold flex items-center gap-1"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>{videoMode === 'mp4' ? 'Switch to YouTube' : 'Switch to Native Video'}</span>
              </button>
            </div>
          </div>

          {/* 16:9 Video Screen with Real Audio Voiceover */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            {videoMode === 'mp4' ? (
              <video
                key={activeVideoUrl}
                src={activeVideoUrl}
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
              <div className="p-6 text-center max-w-md space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
                  <Youtube className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Upload Video to Your YouTube Channel</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    1. Download the MP4 file (Hindi or English).<br />
                    2. Upload it to your YouTube channel.<br />
                    3. Click &quot;Paste My YouTube Link&quot; to connect it!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => handleDownloadVideo(audioLang)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
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
              <span>
                Playing with <strong>{audioLang === 'hi' ? 'हिंदी आवाज़ (Hindi Voice)' : 'English Voice'}</strong> • 1080p Full HD
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <button
                type="button"
                onClick={() => handleDownloadVideo(audioLang)}
                className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Active Video (.MP4)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsConfigModalOpen(true)}
                className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>{hasCustomYoutube ? 'Edit YT Link' : 'Add My YT Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'video'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Spoken Videos (Hindi &amp; English)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pamphlets')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'pamphlets'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Selling Pamphlets &amp; Flyers (प्रचार पैम्फलेट)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tutorial')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'tutorial'
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3-Step Tutorial</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('benefits')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'benefits'
                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Business ROI &amp; Value</span>
          </button>
        </div>

        {/* TAB: Selling Pamphlets & Flyers Gallery */}
        {activeTab === 'pamphlets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Marketing Pamphlets &amp; Flyers for Direct Selling</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Download high-resolution print-ready posters and brochures to send to clients, CAs, and companies on WhatsApp, email, or LinkedIn.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pamphlets.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
                  <div className="space-y-3">
                    {/* Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {p.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">1200x1600 HD</span>
                    </div>

                    {/* Preview Image */}
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
                      <img
                        src={p.file}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadPamphlet(p)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Image</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{p.title}</h4>
                      <p className="text-xs text-amber-400/90 font-medium">{p.subtitle}</p>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadPamphlet(p)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Pamphlet Image (PNG)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSharePamphletWhatsApp(p)}
                      className="w-full py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Share on WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Spoken Video Details & YouTube Upload Kit */}
        {(activeTab === 'video' || activeTab === 'tutorial') && (
          <div className="space-y-5">
            {/* YouTube Upload Kit */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-white">YouTube Upload Kit (Pre-Written Title, Description &amp; Tags)</h3>
              </div>
              <p className="text-xs text-slate-400">
                Upload your downloaded MP4 file to YouTube and copy-paste these pre-formatted fields for instant SEO ranking:
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-white">Video Title:</span>
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
                      <span>{copiedYtTitle ? 'Copied' : 'Copy Title'}</span>
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
                      <span>{copiedYtDesc ? 'Copied' : 'Copy Description'}</span>
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
                      <span>{copiedYtTags ? 'Copied' : 'Copy Tags'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
                    {ytVideoTags}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Client Outreach Kit */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Share with Clients &amp; Customers</span>
              </h3>
              <p className="text-xs text-slate-400">
                Send the demo link and pitch directly to overseas clients, CFOs, and CAs.
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

      {/* Modal: Link YouTube Video */}
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
