import React from 'react';
import {
  ArrowRight,
  CalendarCheck,
  FileText,
  UserCheck,
  LogIn,
  UserPlus
} from 'lucide-react';
import restaurantBg from '../../assets/images/bistro_interior_ambiance_1790112929914.jpg';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onLoginSuccess?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onGoToRegister,
}) => {
  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden text-white font-sans selection:bg-white/20 selection:text-white">
      {/* Background Restaurant Photo */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${restaurantBg})` }}
      />

      {/* Dark Ambient Gradient Overlay matching reference (left heavier for text contrast, right allows warm lighting) */}
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 sm:h-24 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-white/15 flex items-center justify-center text-white font-bold text-base shadow-sm">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              AIVORA
            </span>
          </div>

          {/* Action Buttons: Pill-shaped Login & Register */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="px-5 py-2 rounded-full text-sm font-medium text-white hover:text-white bg-white/5 hover:bg-white/10 border border-white/25 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>Login</span>
            </button>
            <button
              onClick={onGoToRegister}
              className="px-5 py-2 rounded-full text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Register</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 flex-1 flex flex-col justify-between py-6 sm:py-10">
        {/* Main Text Content */}
        <div className="max-w-2xl pt-4 sm:pt-10 lg:pt-14">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Welcome to AIVORA.
          </h1>

          <h2 className="text-lg sm:text-xl font-semibold text-white/95 mt-4 sm:mt-5 tracking-normal">
            Effortless Guest Communication &amp; Support.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mt-3 sm:mt-4 leading-relaxed font-normal">
            Automate table reservations, dietary inquiries, and customer communication 24/7 with verified restaurant knowledge and instant human takeover.
          </p>

          {/* Enter Restaurant Portal: Pill-shaped translucent button */}
          <div className="mt-7 sm:mt-8">
            <button
              onClick={onGoToLogin}
              className="px-6 py-3 rounded-full border border-white/40 bg-black/40 hover:bg-white/10 text-white font-medium text-sm flex items-center gap-2.5 backdrop-blur-xs transition-all cursor-pointer group shadow-sm"
            >
              <span>Enter Restaurant Portal</span>
              <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Feature Cards Grid (Bottom section) */}
        <div className="mt-14 sm:mt-20 lg:mt-24 mb-6 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1: Table Reservations */}
          <div className="p-6 rounded-2xl bg-slate-950/65 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                <CalendarCheck className="w-5 h-5 text-slate-200" strokeWidth={1.8} />
              </div>
              <h3 className="font-bold text-white text-base mt-4">
                Table Reservations
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Handles diner party sizes, dates, seating areas, and confirmation codes automatically.
              </p>
            </div>
          </div>

          {/* Card 2: Menu & Dietary Grounding */}
          <div className="p-6 rounded-2xl bg-slate-950/65 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                <FileText className="w-5 h-5 text-slate-200" strokeWidth={1.8} />
              </div>
              <h3 className="font-bold text-white text-base mt-4">
                Menu &amp; Dietary Grounding
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Answers allergens, specials, pricing, and opening hours directly from your uploaded documents.
              </p>
            </div>
          </div>

          {/* Card 3: Live Human Takeover */}
          <div className="p-6 rounded-2xl bg-slate-950/65 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                <UserCheck className="w-5 h-5 text-slate-200" strokeWidth={1.8} />
              </div>
              <h3 className="font-bold text-white text-base mt-4">
                Live Human Takeover
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Staff can seamlessly intervene and reply directly whenever VIPs or special handling require care.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Bar */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-black/70 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">AIVORA</span>
            <span className="text-slate-400">— Restaurant Guest Communication Platform</span>
          </div>
          <div>
            <button
              onClick={onGoToLogin}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Manager Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
