import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Windows / macOS / Edge flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        title="Install Cross Tax AI as Desktop / Mobile App"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5 text-red-600" />
          <span className="hidden sm:inline">Install on iOS</span>
          <span className="sm:hidden">App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
                  <p className="text-xs text-slate-500">Run Cross Tax AI full-screen offline</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <span>Tap the <strong className="text-slate-900">Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> at bottom of Safari.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <span>Scroll down and select <strong className="text-slate-900">&ldquo;Add to Home Screen&rdquo;</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <span>Tap <strong className="text-slate-900">Add</strong> in top right. Cross Tax AI will appear as a native home screen app!</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic fallback install prompt on desktop browsers that support PWA
  return (
    <button
      onClick={() => {
        // Fallback for browsers
        if (!install()) {
          alert('To install this app on your device:\n\n• On Chrome/Edge: Click the install icon in the URL address bar.\n• On Mac/Safari: File > Add to Dock.\n• On iOS: Share > Add to Home Screen.');
        }
      }}
      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shrink-0"
      title="Install on desktop / mobile"
    >
      <Download className="w-3.5 h-3.5 text-red-600" />
      <span>Install App</span>
    </button>
  );
};
