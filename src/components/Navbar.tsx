import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Calculator, 
  Globe2, 
  Workflow, 
  MessageSquareCode, 
  Sparkles,
  Scale,
  Menu,
  X,
  Plus,
  Play,
  Video,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Download,
  CheckCircle2
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { AnimatedIndianFlagLogo } from './AnimatedIndianFlagLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasActiveReport: boolean;
  onNewEvaluation: () => void;
  onOpenDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasActiveReport,
  onNewEvaluation,
  onOpenDemo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'intake', label: '1. Enter Contract', icon: FileText, tooltip: 'Input cross-border transaction & validate Tax IDs' },
    { id: 'dtaa', label: '2. Tax Relief (DTAA)', icon: ShieldCheck, badge: hasActiveReport ? 'Evaluated' : undefined, tooltip: 'Article 5/7/12 withholding tax reduction' },
    { id: 'tp', label: '3. Fair Price (TP)', icon: Calculator, tooltip: 'Indian Chapter X & Safe Harbour Rule 10TD' },
    { id: 'drafts', label: '4. Legal Forms', icon: Scale, tooltip: 'Form 10F, No-PE & Form 3CEB Word drafts' },
    { id: 'treaties', label: 'Country Tax Rates', icon: Globe2, tooltip: '85+ bilateral tax conventions & safe harbour matrix' },
    { id: 'automation', label: 'Automation & Email', icon: Workflow, tooltip: 'Automated direct client email & webhook logs' },
    { id: 'counsel', label: 'Ask Tax Advisor', icon: MessageSquareCode, isAi: true, tooltip: 'AI tax counsel grounded in Indian Income Tax law' },
    { id: 'guide', label: 'How It Works & ROI', icon: BookOpen, tooltip: 'Step-by-step workflow guide & business benefits' }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs transition-all">
      {/* Top Professional Utility Bar (Midnight Navy Accent) */}
      <div className="bg-slate-950 text-slate-300 border-b border-slate-800/80 px-3 sm:px-6 py-1.5 text-[11px] font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Real-Time Operational Pulse */}
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              Live Engine Online
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">
              85+ Bilateral Treaties Indexed
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">
              CBDT Safe Harbour Rule 10TD &amp; Section 90 Aligned
            </span>
          </div>

          {/* Right: Quick Demo & External Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Guide Quick-Trigger */}
            <button
              type="button"
              onClick={() => handleTabClick('guide')}
              className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>How It Works &amp; Benefits</span>
            </button>

            {/* Video Demo Button */}
            <button
              type="button"
              onClick={onOpenDemo || (() => { window.location.href = '/demo'; })}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-600/90 hover:bg-red-600 text-white font-bold text-[10px] transition shadow-xs cursor-pointer active:scale-95"
              title="Watch Official Video Tutorial with Voiceover"
            >
              <Video className="w-3 h-3 text-white" />
              <span>Video Demo</span>
              <span className="hidden xs:inline px-1 py-0.2 bg-red-800 text-[8px] rounded uppercase font-black tracking-wider">
                Hindi/Eng
              </span>
            </button>

            {/* Official Vercel Domain */}
            <a
              href="https://ind-crosstax-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition font-mono"
              title="Official production domain on Vercel"
            >
              <span>▲ ind-crosstax-ai.vercel.app</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Platform Name with Animated Typography */}
          <div 
            className="flex items-center gap-3 sm:gap-3.5 cursor-pointer group select-none" 
            onClick={() => handleTabClick('intake')}
          >
            {/* Animated High-Fidelity Indian Flag Logo */}
            <AnimatedIndianFlagLogo size="md" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:opacity-90 transition-opacity">
                  <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent font-black drop-shadow-xs">
                    IND
                  </span>{' '}
                  <span className="text-slate-900 font-extrabold tracking-tight">
                    CROSSTAX
                  </span>{' '}
                  <span className="text-red-600 font-black relative inline-block">
                    AI
                    <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                  </span>
                </span>

                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-800 rounded-full border border-amber-200 uppercase tracking-wider">
                  <CheckCircle2 className="w-2.5 h-2.5 text-amber-600" />
                  <span>Rule 10TD &amp; DTAA</span>
                </span>
              </div>

              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block font-medium leading-tight mt-0.5">
                Indian Chapter X Transfer Pricing, Form 10F &amp; Global Bilateral DTAA Advisory Engine
              </p>
            </div>
          </div>

          {/* Right Header Controls: PWA, New Assessment & Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Start New Assessment Button */}
            {hasActiveReport && (
              <button
                onClick={onNewEvaluation}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Start a fresh contract assessment"
              >
                <Plus className="w-3.5 h-3.5 text-red-600" />
                <span>New Contract</span>
              </button>
            )}

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 focus:outline-none cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation Bar with Smooth Active Indicators */}
        <div className="hidden lg:flex items-center justify-between overflow-x-auto py-2.5 scrollbar-none border-t border-slate-100">
          <nav className="flex space-x-1" aria-label="Main Navigation">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  title={tab.tooltip}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/25 ring-1 ring-red-700/20 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-white scale-110' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>

                  {tab.isAi && (
                    <Sparkles className={`w-3 h-3 ${isActive ? 'text-amber-200' : 'text-amber-500'} animate-pulse`} />
                  )}

                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 text-[9px] rounded font-bold ${
                      isActive ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Walkthrough Button in desktop tab bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDemo || (() => { window.location.href = '/demo'; })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-800 hover:text-amber-900 hover:bg-amber-50/80 transition-colors cursor-pointer border border-transparent hover:border-amber-200"
            >
              <Video className="w-3.5 h-3.5 text-amber-600" />
              <span>Watch Video Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Prominent Demo Video CTA */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenDemo) onOpenDemo();
              else window.location.href = '/demo';
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 transition cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Play className="w-4 h-4 text-amber-700 fill-amber-700" />
              <span>🎬 Watch Demo Video (Hindi &amp; English Voice)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
              /demo
            </span>
          </button>

          {/* Navigation Links */}
          <div className="space-y-1 pt-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-red-600'}`} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.isAi && (
                    <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : 'text-amber-500'}`} />
                  )}

                  {tab.badge && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isActive ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* New Assessment in Mobile */}
          {hasActiveReport && (
            <button
              onClick={() => {
                onNewEvaluation();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-red-600" />
              <span>Start New Assessment</span>
            </button>
          )}

          {/* Official Footer Link */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Official Live App</span>
            <a 
              href="https://ind-crosstax-ai.vercel.app" 
              className="text-amber-700 font-bold hover:underline"
            >
              ind-crosstax-ai.vercel.app
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
