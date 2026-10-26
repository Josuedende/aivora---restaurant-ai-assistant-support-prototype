import React from 'react';
import {
  Palette,
  Type,
  Square,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Headphones,
  CalendarCheck,
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';

export const DesignSystemView: React.FC = () => {
  const colors = [
    {
      name: 'Primary Accent (Amber / Gold)',
      hex: '#F59E0B',
      class: 'bg-amber-500',
      text: 'text-slate-950',
      desc: 'Used for primary CTAs, active states, key focus rings, and signature branding.',
    },
    {
      name: 'Pure Canvas White',
      hex: '#FFFFFF',
      class: 'bg-white',
      text: 'text-slate-900',
      border: 'border border-slate-300',
      desc: '60% canvas dominance. Clean, bright, high-contrast, effortless readability for managers.',
    },
    {
      name: 'Surface Slate 50 / 100',
      hex: '#F8FAFC',
      class: 'bg-slate-50',
      text: 'text-slate-800',
      border: 'border border-slate-200',
      desc: '30% structural surfaces. Subdued cards, dropzones, sidebars, and active item highlights.',
    },
    {
      name: 'Text & Headings Slate 900',
      hex: '#0F172A',
      class: 'bg-slate-900',
      text: 'text-white',
      border: 'border border-slate-800',
      desc: 'Primary typographic hierarchy for clear contrast, crisp headers, and high legibility.',
    },
    {
      name: 'Success Emerald',
      hex: '#059669',
      class: 'bg-emerald-600',
      text: 'text-white',
      desc: 'AI Active status, confirmed bookings, verified documents, ready state.',
    },
    {
      name: 'Takeover Rose',
      hex: '#E11D48',
      class: 'bg-rose-600',
      text: 'text-white',
      desc: 'Manager takeover indicator and manual intervention override actions.',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-10 text-slate-900 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>AIVORA Design Tokens & Guidelines</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Basic Design System Specification
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Complete reference for colors, typography scale, inputs, buttons, cards, and status indicators adhering to anti-slop SaaS standards.
        </p>
      </div>

      {/* 1. Color Palette */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Palette className="w-4 h-4 text-amber-500" />
          <h2>1. Primary & Secondary Colors (60-30-10 System)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((c) => (
            <div
              key={c.name}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden p-4 space-y-3 shadow-xs"
            >
              <div
                className={`h-16 rounded-lg ${c.class} ${c.border || ''} flex items-center justify-center font-bold text-xs ${c.text}`}
              >
                {c.hex}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{c.name}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {c.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Typography Hierarchy */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Type className="w-4 h-4 text-amber-500" />
          <h2>2. Typography Hierarchy (Plus Jakarta Sans & JetBrains Mono)</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 divide-y divide-slate-100 space-y-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-amber-600 font-bold">Display / Hero (32px Bold)</span>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Good morning, Bree Street Bistro
            </h1>
          </div>

          <div className="pt-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-amber-600 font-bold">Heading 2 (20px Bold)</span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Let's set up your restaurant
            </h2>
          </div>

          <div className="pt-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-amber-600 font-bold">Heading 3 (16px SemiBold)</span>
            <h3 className="text-base font-bold text-slate-900">
              Recent Conversations & Inquiries
            </h3>
          </div>

          <div className="pt-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-amber-600 font-bold">Body Text (14px Regular)</span>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              AIVORA handles real guest reservations, dietary queries, and opening hours automatically while giving staff one-click takeover.
            </p>
          </div>

          <div className="pt-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-amber-600 font-bold">Tabular Numerals & Telemetry (12px Mono)</span>
            <div className="text-xs font-mono text-slate-700 tabular-nums">
              Ref #BSB-8492 · 34 Conversations (+12% this week) · 92% Resolution
            </div>
          </div>
        </div>
      </div>

      {/* 3. Buttons & Interactive Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Square className="w-4 h-4 text-amber-500" />
          <h2>3. Button Variants & Form Controls</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/15 flex items-center gap-2 cursor-pointer">
              <span>Primary CTA Button</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer">
              Secondary Button
            </button>

            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs">
              <Headphones className="w-3.5 h-3.5" />
              <span>Take Over Conversation</span>
            </button>

            <button className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
              Subtle Action
            </button>
          </div>

          {/* Form Input fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Standard Input Field (Active State)
              </label>
              <input
                type="text"
                readOnly
                value="Bree Street Bistro"
                className="w-full px-3.5 py-2 bg-white border border-amber-500 rounded-lg text-xs text-slate-900 focus:outline-none ring-2 ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Search Input with Icon
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  readOnly
                  value="Search guest or reservation..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Status Indicators */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900">
          <CheckCircle2 className="w-4 h-4 text-amber-500" />
          <h2>4. Status Indicators & Badges</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-wrap items-center gap-4 shadow-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Assistant Active
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CalendarCheck className="w-3.5 h-3.5" />
            Booked (Table Confirmed)
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            Needs Attention (Human Required)
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Answered / Resolved
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Headphones className="w-3.5 h-3.5 text-rose-600" />
            Human Takeover Active
          </span>
        </div>
      </div>
    </div>
  );
};
