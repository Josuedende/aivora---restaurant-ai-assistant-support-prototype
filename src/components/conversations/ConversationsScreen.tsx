import React, { useState } from 'react';
import { CustomerConversation, ChatMessage } from '../../types';
import {
  MessageSquare,
  Bot,
  User,
  CheckCircle2,
  Send,
  CalendarCheck,
  Info,
  Search
} from 'lucide-react';

interface ConversationsScreenProps {
  conversations: CustomerConversation[];
  setConversations: React.Dispatch<React.SetStateAction<CustomerConversation[]>>;
  selectedId: string;
  setSelectedId: (id: string) => void;
}

export const ConversationsScreen: React.FC<ConversationsScreenProps> = ({
  conversations,
  setConversations,
  selectedId,
  setSelectedId,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'needs_attention' | 'booked' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const selectedConv =
    conversations.find((c) => c.id === selectedId) || conversations[0] || null;

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.question.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'needs_attention') {
      return c.status === 'Human Required';
    }
    if (activeFilter === 'booked') {
      return c.status === 'Booked';
    }
    if (activeFilter === 'resolved') {
      return c.status === 'Answered' || c.status === 'In Human Control';
    }
    return true;
  });

  // Handle sending a manager reply
  const handleSendManagerReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConv) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'manager',
      text: replyText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConv.id) {
          return {
            ...c,
            status: 'In Human Control',
            timeAgo: 'Just now',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setReplyText('');
  };

  const getStatusBadge = (status: CustomerConversation['status']) => {
    switch (status) {
      case 'Booked':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Booked
          </span>
        );
      case 'Answered':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Resolved
          </span>
        );
      case 'Human Required':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            Needs attention
          </span>
        );
      case 'In Human Control':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Staff Replied
          </span>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white text-slate-900 overflow-hidden">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Conversations</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            View and manage customer inquiries and reservation chats.
          </p>
        </div>

        {/* Global Control Status */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 hidden sm:inline font-medium">System Status:</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Answering Inquiries
          </span>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* ================= LEFT SIDE: CONVERSATION LIST ================= */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0">
          {/* Search & Filter Bar */}
          <div className="p-3 border-b border-slate-200 space-y-2.5 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest or question..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50/60 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-0.5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer shrink-0 ${
                  activeFilter === 'all'
                    ? 'bg-slate-900 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                All ({conversations.length})
              </button>
              <button
                onClick={() => setActiveFilter('needs_attention')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeFilter === 'needs_attention'
                    ? 'bg-rose-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                <span>Needs Attention</span>
                {conversations.filter((c) => c.status === 'Human Required').length > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeFilter === 'needs_attention'
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {conversations.filter((c) => c.status === 'Human Required').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveFilter('booked')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer shrink-0 ${
                  activeFilter === 'booked'
                    ? 'bg-slate-900 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                Booked
              </button>
              <button
                onClick={() => setActiveFilter('resolved')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer shrink-0 ${
                  activeFilter === 'resolved'
                    ? 'bg-slate-900 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Conversation List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
            {filteredConversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full text-left p-3.5 transition-all flex flex-col gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100/90 border-l-4 border-slate-900 shadow-2xs'
                      : 'hover:bg-slate-100/70 bg-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {conv.customerName}
                    </span>
                    <span className="text-[10px] text-slate-500 tabular-nums shrink-0">
                      {conv.timeAgo}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 font-medium truncate">
                    {conv.question}
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    {getStatusBadge(conv.status)}
                    <span className="text-[10px] text-slate-500 font-medium">{conv.channel}</span>
                  </div>
                </button>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto stroke-[1.5]" />
                <p className="font-semibold text-slate-600">No conversations</p>
                <p className="text-[11px] text-slate-400">Customer inquiries will appear here automatically.</p>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT SIDE: SELECTED CONVERSATION ================= */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Conversation Header & Human Takeover Button */}
            <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                  {selectedConv.customerName.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">{selectedConv.customerName}</h2>
                    {getStatusBadge(selectedConv.status)}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>Today — {selectedConv.lastMessageTime}</span>
                    <span>·</span>
                    <span>{selectedConv.customerPhone}</span>
                    <span>·</span>
                    <span>{selectedConv.channel}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Guest Details Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                  className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg shadow-2xs cursor-pointer"
                  title="Toggle Guest Details Drawer"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Stream + Drawer */}
            <div className="flex-1 min-h-0 flex">
              {/* Message thread */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
                {/* Date separator */}
                <div className="flex items-center justify-center my-2">
                  <span className="px-3 py-1 rounded-full bg-white text-[10px] font-mono text-slate-500 border border-slate-200 shadow-2xs">
                    Today — {selectedConv.lastMessageTime}
                  </span>
                </div>

                {selectedConv.messages.map((msg) => {
                  const isCustomer = msg.sender === 'customer';
                  const isAi = msg.sender === 'ai';
                  const isManager = msg.sender === 'manager';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-2xl ${
                        isCustomer ? 'justify-start' : 'justify-end ml-auto'
                      }`}
                    >
                      {isCustomer && (
                        <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700 shrink-0">
                          {selectedConv.customerName.slice(0, 1)}
                        </div>
                      )}

                      <div className="space-y-1.5 max-w-lg">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="font-semibold text-slate-700">
                            {isCustomer
                              ? selectedConv.customerName
                              : isAi
                              ? 'AIVORA Support'
                              : 'Staff / Manager'}
                          </span>
                          <span>·</span>
                          <span className="tabular-nums">{msg.timestamp}</span>
                          {msg.meta?.sourceDoc && (
                            <span className="text-[10px] text-white bg-slate-800 px-1.5 py-0.2 rounded font-medium">
                              Source: {msg.meta.sourceDoc}
                            </span>
                          )}
                        </div>

                        {/* Bubble */}
                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            isCustomer
                              ? 'bg-slate-200/80 text-slate-900 border border-slate-300/80 rounded-tl-sm'
                              : isAi
                              ? 'bg-white text-slate-900 border border-slate-200 rounded-tr-sm shadow-xs'
                              : 'bg-slate-900 text-white font-medium rounded-tr-sm'
                          }`}
                        >
                          <p>{msg.text}</p>

                          {/* Reservation Details Card if present */}
                          {msg.meta?.reservationDetails && (
                            <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-slate-900">
                              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-1.5">
                                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                                  Reservation Confirmed
                                </span>
                                <span className="font-mono text-[10px] text-slate-500">
                                  Ref #{msg.meta.reservationDetails.referenceId}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                                <div>
                                  <span className="text-slate-500 block">Party Size</span>
                                  <span className="font-bold text-slate-900">
                                    {msg.meta.reservationDetails.guests} Guests
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">Time</span>
                                  <span className="font-bold text-slate-900">
                                    {msg.meta.reservationDetails.time} (
                                    {msg.meta.reservationDetails.date})
                                  </span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-slate-500 block">Seating Area</span>
                                  <span className="font-bold text-slate-900">
                                    {msg.meta.reservationDetails.seatingArea}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {!isCustomer && (
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                            isAi
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-900 text-white font-bold'
                          }`}
                        >
                          {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Guest & AI Reasoner Drawer (Collapsible Right Side) */}
              {isDrawerOpen && (
                <div className="hidden lg:block w-72 border-l border-slate-200 bg-slate-50/70 p-4 space-y-5 overflow-y-auto text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                      Guest Details
                    </h3>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div>
                        <span className="text-slate-500 text-[10px] block font-medium">Full Name</span>
                        <span className="font-bold text-slate-900">{selectedConv.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-medium">Phone</span>
                        <span className="font-mono text-slate-700">{selectedConv.customerPhone}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-medium">Channel</span>
                        <span className="text-slate-700 font-medium">{selectedConv.channel}</span>
                      </div>
                      {selectedConv.guestNotes && (
                        <div>
                          <span className="text-slate-500 text-[10px] block font-medium">Manager Notes</span>
                          <span className="text-slate-700 italic">{selectedConv.guestNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                      AIVORA Decision Log
                    </h3>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Intent: Hospitality Query</span>
                      </div>
                      <div className="text-slate-600">
                        Consulted Knowledge Base:
                        <ul className="list-disc pl-4 text-slate-800 mt-1 space-y-0.5">
                          <li>Menu.pdf</li>
                          <li>Restaurant_FAQ.pdf</li>
                          <li>Opening_Hours.pdf</li>
                        </ul>
                      </div>
                      <div className="pt-1 text-[10px] text-slate-500 border-t border-slate-100">
                        Safety filter: 100% confidence, zero hallucinations detected.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Manager Direct Reply Bar */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white space-y-2.5">
              {/* Quick Preset Replies */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-0.5">
                <span className="text-slate-400 shrink-0 font-medium">Quick Reply:</span>
                {[
                  "Hi! I'm reviewing your request right now.",
                  "We have noted your table & dietary preferences.",
                  "I'd be delighted to confirm your reservation personally.",
                  "Let me double check availability with our kitchen."
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setReplyText(preset);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md shrink-0 transition-colors text-left truncate max-w-xs cursor-pointer border border-slate-200/60"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendManagerReply} className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Type a message to ${selectedConv.customerName}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white">
            <div className="max-w-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <MessageSquare className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">No conversation selected</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Customer inquiries and table reservations will appear on the left.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
