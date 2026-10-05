/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TaxContractInput, FullTaxAnalysisReport } from './types/tax';
import { PRESET_CONTRACTS, getCountryTPProfile } from './data/treatyDatabase';
import { calculateFullTaxAnalysisReport } from './utils/taxEvaluation';
import { Navbar } from './components/Navbar';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ContractIntakeForm } from './components/ContractIntakeForm';
import { DTAAChecker } from './components/DTAAChecker';
import { TransferPricingEngine } from './components/TransferPricingEngine';
import { DraftsStudio } from './components/DraftsStudio';
import { TreatyExplorer } from './components/TreatyExplorer';
import { AutomationHub } from './components/AutomationHub';
import { TaxChatAssistant } from './components/TaxChatAssistant';
import { OfflineIndicator } from './components/OfflineIndicator';
import { CustomerFeedbackModal } from './components/CustomerFeedbackModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { DnsSetupModal } from './components/DnsSetupModal';
import { AdSenseBanner } from './components/AdSenseBanner';
import { StandaloneVideoPortal } from './components/StandaloneVideoPortal';
import { AnimatedIndianFlagLogo } from './components/AnimatedIndianFlagLogo';
import { 
  Sparkles, 
  ShieldCheck, 
  Calculator, 
  Scale, 
  HelpCircle,
  FileText,
  AlertCircle,
  Globe2,
  BookOpen,
  MessageSquarePlus,
  Shield,
  Star,
  Video,
  Play
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dtaa');
  const [intakeMode, setIntakeMode] = useState<'guided' | 'expert'>('guided');
  const [contractData, setContractData] = useState<TaxContractInput>(PRESET_CONTRACTS[0].data);
  const [report, setReport] = useState<FullTaxAnalysisReport>(() => 
    calculateFullTaxAnalysisReport(PRESET_CONTRACTS[0].data)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isDnsOpen, setIsDnsOpen] = useState<boolean>(false);

  // Check if opened via dedicated demo or video link (e.g. /demo, /video, ?view=demo, ?view=video, #demo, #video)
  const checkIsDemoRoute = () => {
    if (typeof window !== 'undefined') {
      const search = window.location.search || '';
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';
      return (
        search.includes('demo') ||
        hash.includes('demo') ||
        path.includes('demo') ||
        search.includes('video') ||
        hash.includes('video') ||
        path.includes('video')
      );
    }
    return false;
  };

  const [isStandaloneVideo, setIsStandaloneVideo] = useState<boolean>(checkIsDemoRoute);

  useEffect(() => {
    const handlePopState = () => {
      setIsStandaloneVideo(checkIsDemoRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenDemo = () => {
    setIsStandaloneVideo(true);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', '/demo');
    }
  };

  const handleCloseDemo = () => {
    setIsStandaloneVideo(false);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', '/');
    }
  };

  // Function to run the evaluation via our server endpoint
  const runEvaluation = async (input: TaxContractInput, targetTab: string = 'dtaa') => {
    setIsLoading(true);
    setErrorMsg(null);
    setContractData(input);

    // 1. Immediately apply local deterministic report so the UI is instantaneous and never flashes
    const localReport = calculateFullTaxAnalysisReport(input);
    setReport(localReport);
    setActiveTab(targetTab);

    // 2. Query AI backend asynchronously if available to augment legal recommendations
    try {
      const res = await fetch('/api/evaluate-tax-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (res.ok) {
        const serverReport = await res.json();
        // Verify server returned valid FullTaxAnalysisReport before applying
        if (serverReport && serverReport.dtaa && serverReport.transferPricing) {
          setReport(serverReport);
        }
      }
    } catch (err: any) {
      console.warn('Using baseline deterministic calculation:', err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial evaluation on load with preset 1
  useEffect(() => {
    // Only run if not in standalone video mode
    if (!isStandaloneVideo) {
      runEvaluation(PRESET_CONTRACTS[0].data, 'dtaa');
    }
  }, [isStandaloneVideo]);

  // If in standalone video mode, render video portal AFTER all hooks are called
  if (isStandaloneVideo) {
    return (
      <StandaloneVideoPortal 
        onExitToApp={handleCloseDemo} 
      />
    );
  }

  const residentProfile = getCountryTPProfile(contractData.residentCountry);
  const sourceProfile = getCountryTPProfile(contractData.sourceCountry);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Navbar with PWA Install and Mobile Menu */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveReport={Boolean(report)}
        onNewEvaluation={() => setActiveTab('intake')}
        onOpenDemo={handleOpenDemo}
      />

      {/* Client Video Tutorial & Demonstration Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2 text-xs text-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>
              <strong>Client Video Tutorial:</strong> Watch how IND CROSSTAX AI evaluates DTAA tax relief &amp; Indian Chapter X Transfer Pricing in 90 seconds.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenDemo}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Watch Video / YouTube</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('https://ind-crosstax-ai.vercel.app/demo');
                alert('Client video link copied: https://ind-crosstax-ai.vercel.app/demo');
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg font-bold transition text-xs cursor-pointer shadow-xs"
              title="Copy direct demo link for clients"
            >
              Copy Client Link
            </button>
          </div>
        </div>
      </div>

      {/* Global Corridor & Governing Law Banner */}
      <div className="bg-red-50/70 border-b border-red-100 py-2 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-red-700 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-red-600" />
              <span>Active Trade Corridor:</span>
            </span>
            <span className="px-2 py-0.5 bg-white border border-red-200 rounded-md font-bold text-slate-800 flex items-center gap-1">
              <span>{residentProfile.flag} {residentProfile.countryName}</span>
              <span className="text-red-500">&rarr;</span>
              <span>{sourceProfile.flag} {sourceProfile.countryName}</span>
            </span>
            <span className="text-[11px] text-slate-600 hidden md:inline">
              Client: <strong className="text-slate-800">{contractData.clientName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-600 flex-wrap">
            <span className="flex items-center gap-1 hidden lg:inline-flex">
              <BookOpen className="w-3 h-3 text-red-600" />
              <strong className="text-slate-800">{residentProfile.tpLawTitle.split('&')[0]}</strong> &amp; <strong className="text-slate-800">{sourceProfile.tpLawTitle.split('&')[0]}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error notification banner if any */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => runEvaluation(contractData, activeTab)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* TAB 1: Intake & Onboarding */}
        {activeTab === 'intake' && (
          <div className="space-y-6">
            {/* Mode Switcher */}
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-2.5 sm:p-3 rounded-2xl shadow-xs">
              <div className="text-xs text-slate-600 font-medium px-2">
                Choose intake method for <strong className="text-slate-800">{residentProfile.countryName} &rarr; {sourceProfile.countryName}</strong>:
              </div>
              <div className="flex gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIntakeMode('guided')}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    intakeMode === 'guided'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Guided Steps
                </button>
                <button
                  type="button"
                  onClick={() => setIntakeMode('expert')}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    intakeMode === 'expert'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Expert Single-Page
                </button>
              </div>
            </div>

            {intakeMode === 'guided' ? (
              <OnboardingFlow
                initialData={contractData}
                onComplete={(data: TaxContractInput) => runEvaluation(data, 'dtaa')}
                isLoading={isLoading}
              />
            ) : (
              <ContractIntakeForm
                initialData={contractData}
                onSubmit={(data) => runEvaluation(data, 'dtaa')}
                isLoading={isLoading}
              />
            )}
          </div>
        )}

        {/* TAB 2: DTAA Relief Checker */}
        {activeTab === 'dtaa' && (
          <div>
            {report ? (
              <DTAAChecker
                report={report}
                onNavigateToDrafts={() => setActiveTab('drafts')}
              />
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-slate-500 font-medium">Loading bilateral double tax relief analysis...</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Arm's Length Transfer Pricing Engine */}
        {activeTab === 'tp' && (
          <div>
            {report ? (
              <TransferPricingEngine
                report={report}
                onNavigateToDrafts={() => setActiveTab('drafts')}
              />
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-slate-500 font-medium">Loading Arm&apos;s Length Transfer Pricing benchmarks...</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Statutory Legal Compliance Drafts */}
        {activeTab === 'drafts' && (
          <div>
            {report ? (
              <DraftsStudio report={report} />
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Please run an assessment first to generate drafts.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Global Treaty Matrix */}
        {activeTab === 'treaties' && <TreatyExplorer />}

        {/* TAB 6: Make.com Automation Hub */}
        {activeTab === 'automation' && (
          <div>
            {report ? (
              <AutomationHub report={report} />
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Load or submit an assessment to test Make.com dispatching.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: AI Tax Counsel Chat */}
        {activeTab === 'counsel' && <TaxChatAssistant report={report || undefined} />}

        {/* Google AdSense / Sponsor Slot */}
        <AdSenseBanner />
      </main>

      {/* Offline Toast Indicator */}
      <OfflineIndicator />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
              <AnimatedIndianFlagLogo size="sm" />
              <span className="font-extrabold text-slate-900"><span className="text-amber-600">IND</span> CROSSTAX <span className="text-red-600">AI</span></span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-600">India Chapter X Transfer Pricing, Form 10F &amp; Global Bilateral DTAA Advisory Engine</span>
            </div>

            {/* Quick Action Links: Feedback, Privacy Policy, & DNS Setup */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => setIsStandaloneVideo(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 text-xs font-bold transition cursor-pointer"
              >
                <Video className="w-3 h-3 text-red-600" />
                <span>🎬 Watch Video Demo</span>
              </button>

              <button
                onClick={handleOpenDemo}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold transition cursor-pointer"
              >
                <Play className="w-3 h-3 text-amber-700 fill-amber-700" />
                <span>Product Demo &amp; Video (/demo)</span>
              </button>

              <button
                onClick={() => setIsDnsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition cursor-pointer"
              >
                <Globe2 className="w-3 h-3 text-blue-600" />
                <span>DNS Zone File (Drag &amp; Drop)</span>
              </button>

              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition cursor-pointer"
              >
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Client Reviews &amp; Feedback</span>
              </button>

              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <Shield className="w-3 h-3 text-slate-500" />
                <span>Privacy &amp; Terms</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Compliant with US IRC &sect;482, UK TIOPA, Singapore ITA &sect;34D, UAE Decree-Law 47, India Chapter X, and OECD Guidelines 2022.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin);
                  alert('Free live link copied to clipboard!');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1"
              >
                <span>🔗 Copy Free Live Link</span>
              </button>
              <button
                onClick={() => setIsDnsOpen(true)}
                className="text-slate-500 hover:text-red-600 cursor-pointer text-[11px]"
              >
                Custom Domain Options
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* DNS Setup & Drag-and-Drop Zone File Modal */}
      <DnsSetupModal
        isOpen={isDnsOpen}
        onClose={() => setIsDnsOpen(false)}
      />

      {/* Customer Feedback Modal */}
      <CustomerFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        defaultClientName={contractData.clientName}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
