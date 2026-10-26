import React from 'react';
import { ScreenId, OnboardingStep } from '../types';
import { Play, Sparkles, Palette, RotateCcw, ChevronRight, Download } from 'lucide-react';

interface PrototypeNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onboardingStep: OnboardingStep;
  setOnboardingStep: (step: OnboardingStep) => void;
  onResetTour: () => void;
}

export const PrototypeNav: React.FC<PrototypeNavProps> = ({
  currentScreen,
  onNavigate,
  onboardingStep,
  setOnboardingStep,
  onResetTour,
}) => {
  const steps: { id: ScreenId; label: string; sub?: string }[] = [
    { id: 'login', label: '1. Login' },
    { id: 'register', label: '2. Register' },
    { id: 'onboarding', label: '3. Onboarding', sub: `Step ${onboardingStep}/4` },
    { id: 'dashboard', label: '4. Dashboard' },
    { id: 'knowledge', label: '5. Knowledge Base' },
    { id: 'conversations', label: '6. AI Conversations' },
    { id: 'design-system', label: 'Design System' },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2 text-xs shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Prototype Label */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>AIVORA PROTOTYPE</span>
          </div>
          <span className="text-slate-500 hidden sm:inline text-[11px]">Interactive Review</span>
        </div>

        {/* Screen Quick-Jump Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
          {steps.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {s.label}
                {s.sub && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {s.sub}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Prototype Actions */}
        <div className="flex items-center gap-2">
          {currentScreen === 'onboarding' && (
            <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
              {([1, 2, 3, 4] as OnboardingStep[]).map((stepNum) => (
                <button
                  key={stepNum}
                  onClick={() => setOnboardingStep(stepNum)}
                  className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    onboardingStep === stepNum
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={`Jump to Onboarding Step ${stepNum}`}
                >
                  {stepNum}
                </button>
              ))}
            </div>
          )}

          <a
            href="/aivora-project.zip"
            download="aivora-project.zip"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
            title="Download full project ZIP for VS Code"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </a>

          <button
            onClick={onResetTour}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Reset to initial login view"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Restart Flow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
