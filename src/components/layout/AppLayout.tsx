import React, { useState } from 'react';
import { ScreenId, RestaurantProfile } from '../../types';
import {
  LayoutGrid,
  MessageSquare,
  BookOpen,
  CalendarDays,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

interface AppLayoutProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  restaurant: RestaurantProfile;
  setRestaurant: React.Dispatch<React.SetStateAction<RestaurantProfile>>;
  children: React.ReactNode;
  unreadCount?: number;
  docCount?: number;
  onLogout: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentScreen,
  onNavigate,
  restaurant,
  children,
  unreadCount = 1,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard' as ScreenId,
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'conversations' as ScreenId,
      label: 'Conversations',
      icon: MessageSquare,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
    },
    {
      id: 'knowledge' as ScreenId,
      label: 'Knowledge',
      icon: BookOpen,
    },
    {
      id: 'bookings' as ScreenId,
      label: 'Bookings',
      icon: CalendarDays,
      note: 'Dineplan synced',
    },
    {
      id: 'settings' as ScreenId,
      label: 'Settings',
      icon: Settings,
      note: 'Preferences',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center text-white font-bold text-base shadow-xs">
            A
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-base">AIVORA</span>
            <span className="text-[11px] text-slate-400 block">{restaurant.name || 'Restaurant operations'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 lg:w-70 bg-white border-r border-slate-200/80 flex flex-col justify-between z-30 transition-transform md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-2">
          {/* Logo Section */}
          <div className="flex items-center gap-3.5 pb-2">
            <div className="w-11 h-11 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white font-extrabold text-lg shadow-xs shrink-0">
              A
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-slate-900">
                AIVORA
              </div>
              <div className="text-[11px] text-slate-400 font-normal">
                Restaurant operations
              </div>
            </div>
          </div>

          {/* Section Heading: MENU */}
          <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pt-4 pb-1.5 px-1">
            MENU
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as ScreenId);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-600 group-hover:text-slate-900'
                      }`}
                      strokeWidth={1.8}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center shrink-0 ml-2">
                    {item.badge && (
                      <span className={`w-4.5 h-4.5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {item.note && (
                      <span className={`text-[11px] font-normal ${
                        isActive ? 'text-slate-300' : 'text-slate-400'
                      }`}>
                        {item.note}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Restaurant Profile & Logout Key */}
        <div className="p-3.5 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between gap-2 p-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                {restaurant.name ? restaurant.name.charAt(0).toUpperCase() : 'R'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {restaurant.name || 'Restaurant'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Manager
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-[#F8F9FA]">
        {children}
      </main>
    </div>
  );
};
