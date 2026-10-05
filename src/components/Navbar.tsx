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
  Video
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
    { id: 'intake', label: '1. Enter Contract', icon: FileText },
    { id: 'dtaa', label: '2. Tax Relief (DTAA)', icon: ShieldCheck, badge: hasActiveReport ? 'Evaluated' : undefined },
    { id: 'tp', label: '3. Fair Price (TP)', icon: Calculator },
    { id: 'drafts', label: '4. Legal Forms', icon: Scale },
    { id: 'treaties', label: 'Country Tax Rates', icon: Globe2 },
    { id: 'automation', label: 'Email Automation', icon: Workflow },
    { id: 'counsel', label: 'Ask Tax Advisor', icon: MessageSquareCode, isAi: true }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => handleTabClick('intake')}>
            <AnimatedIndianFlagLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  <span className="text-amber-600 font-black">IND</span> CROSSTAX <span className="text-red-600">AI</span>
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-amber-100 text-amber-900 rounded border border-amber-200 uppercase tracking-wider">
                  India &amp; Global DTAA
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block font-medium">
                Indian Chapter X Transfer Pricing, Form 10F &amp; Global Bilateral DTAA Advisor
              </p>
            </div>
          </div>

          {/* Quick Action, Demo Trigger, PWA Install & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Video Demo Button */}
            <button
              type="button"
              onClick={onOpenDemo || (() => { window.location.href = '/demo'; })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-950 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shadow-xs cursor-pointer"
              title="Watch Official Video Tutorial & Client Demo"
            >
              <Video className="w-3.5 h-3.5 text-red-600" />
              <span>Video Demo</span>
              <span className="text-[9px] px-1 bg-red-600 text-white rounded font-bold uppercase tracking-wider">Video</span>
            </button>

            {/* Permanent Vercel Live URL Badge */}
            <a
              href="https://ind-crosstax-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition shadow-xs cursor-pointer border border-slate-700"
              title="Official Permanent Live URL on Vercel"
            >
              <span className="text-[10px] text-amber-400">▲</span>
              <span>ind-crosstax-ai.vercel.app</span>
            </a>

            {/* PWA Install Button (Works across Windows, Mac, iOS, Android, Linux) */}
            <PWAInstallButton />

            {hasActiveReport && (
              <button
                onClick={onNewEvaluation}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-red-600" />
                <span>New Assessment</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold">Global Engine Ready</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 focus:outline-none cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden lg:flex items-center justify-between overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-700/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
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
          </div>

          {/* Quick Demo Link in desktop tab bar */}
          <button
            onClick={onOpenDemo || (() => { window.location.href = '/demo'; })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-800 hover:bg-amber-50 transition cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-amber-600" />
            <span>Product Walkthrough (/demo)</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Visible on phones & small tablets) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          {/* Prominent Demo Button in Mobile Drawer */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenDemo) onOpenDemo();
              else window.location.href = '/demo';
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Play className="w-4 h-4 text-amber-700 fill-amber-700" />
              <span>🎬 Watch Demo Video (Hindi &amp; English Voice)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
              /demo
            </span>
          </button>

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

          {/* Direct link to Vercel production */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
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
