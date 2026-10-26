import React, { useState } from 'react';
import { CustomerConversation, RestaurantProfile, ScreenId } from '../../types';
import {
  MessageSquare,
  CalendarCheck,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  LogOut,
  Settings,
  BookOpen,
  Headphones,
} from 'lucide-react';

interface MainDashboardProps {
  restaurant: RestaurantProfile;
  conversations: CustomerConversation[];
  onNavigate: (screen: ScreenId) => void;
  onSelectConversation: (conversationId: string) => void;
  onToggleTakeover?: (conversationId: string) => void;
  onLogout?: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  restaurant,
  conversations,
  onNavigate,
  onSelectConversation,
  onToggleTakeover,
  onLogout,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const humanRequiredConversations = conversations.filter((c) => c.status === 'Human Required');
  const humanControlConversations = conversations.filter((c) => c.status === 'In Human Control');
  const takeoverCount = humanRequiredConversations.length + humanControlConversations.length;
  const takeoverTarget = humanRequiredConversations[0] || humanControlConversations[0];

  const filteredConversations = conversations.filter((c) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'takeover') {
      return c.status === 'Human Required' || c.status === 'In Human Control';
    }
    if (filterStatus === 'needs_attention') return c.status === 'Human Required';
    if (filterStatus === 'Booked') return c.status === 'Booked';
    if (filterStatus === 'Answered') return c.status === 'Answered';
    return true;
  });

  const getStatusBadge = (status: CustomerConversation['status']) => {
    switch (status) {
      case 'Booked':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Booked
          </span>
        );
      case 'Answered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Resolved
          </span>
        );
      case 'Human Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-rose-700 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Takeover needed
          </span>
        );
      case 'In Human Control':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Staff control
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 text-slate-900 font-sans">
      {/* Top Date Header */}
      <div>
        <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          THURSDAY, 26 SEPTEMBER
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-1">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Good morning, {restaurant.name || 'Restaurant'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Here’s what’s happening across your restaurant today.
            </p>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('settings')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs sm:text-sm font-medium shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => onNavigate('knowledge')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs sm:text-sm font-medium shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span>Knowledge</span>
            </button>

            <button
              onClick={() => onNavigate('conversations')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Live inbox</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs sm:text-sm shadow-2xs flex items-center justify-center transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4 text-slate-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Takeover Request Banner */}
      <div className="bg-white border border-rose-300 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-100 shrink-0" />
          <span className="font-bold text-xs text-rose-700 shrink-0">
            Takeover request
          </span>
          <span className="text-slate-300 font-light hidden sm:inline">|</span>
          <span className="text-xs text-slate-800 font-medium truncate">
            {takeoverTarget?.customerName
              ? `${takeoverTarget.customerName} needs help confirming an anniversary table.`
              : 'Sarah Jenkins needs help confirming an anniversary table.'}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => {
              if (takeoverTarget) onSelectConversation(takeoverTarget.id);
              onNavigate('conversations');
            }}
            className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:underline cursor-pointer"
          >
            View
          </button>

          <button
            onClick={() => {
              if (takeoverTarget) {
                onToggleTakeover?.(takeoverTarget.id);
                onSelectConversation(takeoverTarget.id);
              }
              onNavigate('conversations');
            }}
            className="px-4 py-2 rounded-xl border border-rose-500 hover:border-rose-600 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Take over</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Conversations */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Conversations</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            {conversations.length || 1}
          </div>
          <div className="text-xs text-slate-400 mt-3 font-normal">
            Total diner inquiries
          </div>
        </div>

        {/* Card 2: Bookings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            {conversations.filter((c) => c.status === 'Booked').length}
          </div>
          <div className="text-xs text-slate-400 mt-3 font-normal">
            Confirmed reservations
          </div>
        </div>

        {/* Card 3: Questions answered */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Questions answered</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            {conversations.filter((c) => c.status === 'Answered').length}
          </div>
          <div className="text-xs text-slate-400 mt-3 font-normal">
            Resolved automatically
          </div>
        </div>

        {/* Card 4: Human takeover */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Human takeover</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Headphones className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {takeoverCount || 1}
            </span>
            <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              ACTION NEEDED
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-3 font-normal">
            Awaiting staff takeover
          </div>
        </div>
      </div>

      {/* Main Table Card: Recent conversations */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {/* Header Section */}
        <div className="p-6 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Recent conversations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customer inquiries across all connected channels.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilterStatus('takeover')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterStatus === 'takeover'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Takeover</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white text-rose-700 border border-rose-300 text-[10px] font-bold">
                {takeoverCount || 1}
              </span>
            </button>

            <button
              onClick={() => setFilterStatus('needs_attention')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterStatus === 'needs_attention'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs attention
            </button>

            <button
              onClick={() => setFilterStatus('Booked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterStatus === 'Booked'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Booked
            </button>

            <button
              onClick={() => setFilterStatus('Answered')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterStatus === 'Answered'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Answered
            </button>
          </div>
        </div>

        {/* Table of Conversations */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-t border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-6 font-semibold">CUSTOMER</th>
                <th className="py-3 px-6 font-semibold">QUESTION / INTENT</th>
                <th className="py-3 px-6 font-semibold">STATUS</th>
                <th className="py-3 px-6 font-semibold">TIME</th>
                <th className="py-3 px-6 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No conversations found for this filter.
                  </td>
                </tr>
              ) : (
                filteredConversations.map((conv) => {
                  const initials = getInitials(conv.customerName);
                  const isTakeover = conv.status === 'Human Required';

                  return (
                    <tr
                      key={conv.id}
                      onClick={() => {
                        onSelectConversation(conv.id);
                        onNavigate('conversations');
                      }}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Customer */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900">
                              {conv.customerName}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {conv.channel}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Question / Intent */}
                      <td className="py-4 px-6 max-w-md">
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {conv.question.includes('Anniversary table')
                            ? 'Anniversary table for two on 24 Sep at 19:30'
                            : conv.question}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {conv.guestNotes ||
                            conv.messages[conv.messages.length - 1]?.text ||
                            'Quiet window booth please. One guest has a severe allergy.'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {getStatusBadge(conv.status)}
                      </td>

                      {/* Time */}
                      <td className="py-4 px-6 whitespace-nowrap text-slate-400 font-normal">
                        {conv.timeAgo}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isTakeover ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleTakeover?.(conv.id);
                                onSelectConversation(conv.id);
                                onNavigate('conversations');
                              }}
                              className="px-4 py-2 rounded-xl border border-rose-500 hover:border-rose-600 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                            >
                              Take over
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectConversation(conv.id);
                                onNavigate('conversations');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Open
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectConversation(conv.id);
                              onNavigate('conversations');
                            }}
                            className="w-9 h-9 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            title="View conversation details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Bar */}
        <div className="border-t border-slate-100 px-6 py-3.5 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredConversations.length} active interaction</span>
          <button
            onClick={() => onNavigate('conversations')}
            className="text-xs font-semibold text-slate-800 hover:text-slate-950 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Open conversation manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
