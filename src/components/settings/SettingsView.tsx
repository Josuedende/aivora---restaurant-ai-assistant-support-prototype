import React, { useState } from 'react';
import {
  RestaurantProfile,
  AssistantSettings,
  ReservationSettings,
  NotificationSettings,
  IntegrationItem,
  TeamMember,
  BillingSettings,
} from '../../types';
import {
  Bot,
  Building2,
  CalendarCheck,
  Bell,
  Layers,
  Users,
  CreditCard,
  Save,
  Check,
  RotateCcw,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Globe,
  Instagram,
  Sparkles,
  Shield,
  Trash2,
  Plus,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  XCircle,
  FileText,
  Download
} from 'lucide-react';

interface SettingsViewProps {
  restaurant: RestaurantProfile;
  setRestaurant: React.Dispatch<React.SetStateAction<RestaurantProfile>>;
}

type TabType = 'assistant' | 'restaurant' | 'reservations' | 'notifications' | 'integrations' | 'team' | 'billing';

export const SettingsView: React.FC<SettingsViewProps> = ({
  restaurant,
  setRestaurant,
}) => {
  // Default Assistant Settings
  const initialAssistant: AssistantSettings = restaurant.assistant || {
    assistantName: 'Aivora Concierge',
    personalityTone: (restaurant.aiTone as any) || 'Warm & Hospitable',
    greetingMessage: `Hi there! Welcome to ${restaurant.name || 'our restaurant'}. I'm here to help you reserve a table, answer dietary questions, or guide you through our menu. How may I assist you today?`,
    language: 'English (UK / South Africa)',
    timezone: restaurant.timezone || 'Africa/Johannesburg (GMT+2)',
    canAutoBook: true,
    canAnswerDietary: true,
    canAcceptDeposits: true,
    canPromiseTables: false,
    canHandleComplaints: false,
    customInstructions: 'Always verify if guests have food allergies. If party size is over 6, inform them about our group deposit policy.',
  };

  // Default Reservation Settings
  const initialReservations: ReservationSettings = restaurant.reservations || {
    bookingRules: 'Reserved tables are held for a 15-minute grace period. Standard dining duration is 2 hours for dinner services.',
    minPartySize: 1,
    maxPartySize: restaurant.maxAutoPartySize || 6,
    gracePeriodMins: 15,
    advanceBookingDays: 30,
    cancellationPolicy: 'Free cancellation up to 24 hours prior to booking. Cancellations within 24 hours or no-shows incur a cancellation charge.',
    depositRequiredForPartyOf: 6,
    depositAmountPerPerson: 'R150',
  };

  // Default Notification Settings
  const initialNotifications: NotificationSettings = restaurant.notifications || {
    emailAlerts: true,
    smsAlerts: true,
    whatsappAlerts: true,
    alertPhone: restaurant.managerPhone || '+27 82 555 0192',
    alertEmail: restaurant.managerEmail || 'reservations@restaurant.co.za',
    takeoverAlerts: restaurant.notifyOnTakeover ?? true,
    vipBookingAlerts: restaurant.notifyOnVip ?? true,
    dailySummaryBrief: restaurant.dailySummaryEmail ?? true,
  };

  // Default Integrations List
  const initialIntegrations: IntegrationItem[] = restaurant.integrations || [
    {
      id: 'int-dineplan',
      name: 'Dineplan Table Booking API',
      category: 'Reservations',
      provider: 'Dineplan',
      connected: true,
      statusText: 'Connected & Live Syncing Tables',
      lastSync: 'Just now',
    },
    {
      id: 'int-whatsapp',
      name: 'WhatsApp Business Cloud API',
      category: 'Messaging',
      provider: 'Meta / WhatsApp',
      connected: true,
      statusText: 'Connected (+27 21 424 5555)',
      lastSync: 'Real-time Webhook',
    },
    {
      id: 'int-pos',
      name: 'Lightspeed Restaurant POS',
      category: 'POS',
      provider: 'Lightspeed',
      connected: true,
      statusText: 'Connected (Syncing Daily Specials)',
      lastSync: '12m ago',
    },
    {
      id: 'int-google',
      name: 'Google Business Profile & Reserve',
      category: 'Search & Maps',
      provider: 'Google Maps',
      connected: false,
      statusText: 'Not Connected',
      lastSync: 'Never',
    },
  ];

  // Default Team Members
  const initialTeam: TeamMember[] = restaurant.team || [
    {
      id: 'team-1',
      name: restaurant.managerName || 'David Van Der Merwe',
      email: restaurant.managerEmail || 'david@lapetitebistro.co.za',
      role: 'General Manager',
      phone: restaurant.managerPhone || '+27 82 555 0192',
      active: true,
    },
    {
      id: 'team-2',
      name: 'Sarah Jenkins',
      email: 'sarah.j@lapetitebistro.co.za',
      role: 'Floor Host',
      phone: '+27 83 441 9021',
      active: true,
    },
    {
      id: 'team-3',
      name: 'Chef Jean-Luc Moreau',
      email: 'kitchen@lapetitebistro.co.za',
      role: 'Chef / Kitchen',
      phone: '+27 84 990 1204',
      active: true,
    },
  ];

  // Default Billing Settings
  const initialBilling: BillingSettings = restaurant.billing || {
    planName: 'AIVORA Pro Restaurant Plan',
    planPrice: 'R2,450 / month',
    billingCycle: 'Monthly',
    conversationsUsed: 842,
    conversationsLimit: 1500,
    nextBillingDate: '15 October 2026',
    paymentMethod: 'Mastercard ending in 4242',
    billingEmail: restaurant.managerEmail || 'accounts@lapetitebistro.co.za',
    taxVatNumber: 'ZA 4890124481',
  };

  // State
  const [activeTab, setActiveTab] = useState<TabType>('assistant');
  const [formData, setFormData] = useState<RestaurantProfile>({
    ...restaurant,
    assistant: initialAssistant,
    reservations: initialReservations,
    notifications: initialNotifications,
    integrations: initialIntegrations,
    team: initialTeam,
    billing: initialBilling,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Team Member Form state
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Owner' | 'General Manager' | 'Floor Host' | 'Chef / Kitchen'>('Floor Host');

  // Update top-level field
  const handleTopLevelChange = <K extends keyof RestaurantProfile>(
    field: K,
    value: RestaurantProfile[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  // Update Assistant subfield
  const handleAssistantChange = <K extends keyof AssistantSettings>(
    field: K,
    value: AssistantSettings[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      assistant: {
        ...(prev.assistant as AssistantSettings),
        [field]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Update Reservation subfield
  const handleReservationChange = <K extends keyof ReservationSettings>(
    field: K,
    value: ReservationSettings[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      reservations: {
        ...(prev.reservations as ReservationSettings),
        [field]: value,
      },
      // Sync maxAutoPartySize for backwards compatibility
      ...(field === 'maxPartySize' ? { maxAutoPartySize: value as number } : {}),
    }));
    setHasUnsavedChanges(true);
  };

  // Update Notification subfield
  const handleNotificationChange = <K extends keyof NotificationSettings>(
    field: K,
    value: NotificationSettings[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...(prev.notifications as NotificationSettings),
        [field]: value,
      },
      // Sync backwards compatibility fields
      ...(field === 'alertPhone' ? { managerPhone: value as string } : {}),
      ...(field === 'takeoverAlerts' ? { notifyOnTakeover: value as boolean } : {}),
      ...(field === 'vipBookingAlerts' ? { notifyOnVip: value as boolean } : {}),
      ...(field === 'dailySummaryBrief' ? { dailySummaryEmail: value as boolean } : {}),
    }));
    setHasUnsavedChanges(true);
  };

  // Toggle Integration connection
  const handleToggleIntegration = (id: string) => {
    setFormData((prev) => {
      const list = prev.integrations || [];
      const updated = list.map((item) => {
        if (item.id === id) {
          const nextState = !item.connected;
          return {
            ...item,
            connected: nextState,
            statusText: nextState ? 'Connected & Active' : 'Disconnected',
            lastSync: nextState ? 'Just now' : 'Never',
          };
        }
        return item;
      });
      return { ...prev, integrations: updated };
    });
    setHasUnsavedChanges(true);
  };

  // Team management
  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      phone: newMemberPhone.trim() || '+27 82 000 0000',
      role: newMemberRole,
      active: true,
    };

    setFormData((prev) => ({
      ...prev,
      team: [...(prev.team || []), newMember],
    }));

    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setShowAddTeamModal(false);
    setHasUnsavedChanges(true);
  };

  const handleRemoveTeamMember = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      team: (prev.team || []).filter((m) => m.id !== id),
    }));
    setHasUnsavedChanges(true);
  };

  // Operating Hours
  const handleHoursChange = (index: number, newHours: string) => {
    const updated = [...formData.openingHours];
    updated[index] = {
      ...updated[index],
      hours: newHours,
      closed: newHours.toLowerCase() === 'closed',
    };
    setFormData((prev) => ({ ...prev, openingHours: updated }));
    setHasUnsavedChanges(true);
  };

  const handleToggleClosed = (index: number) => {
    const updated = [...formData.openingHours];
    const isCurrentlyClosed = updated[index].closed;
    updated[index] = {
      ...updated[index],
      closed: !isCurrentlyClosed,
      hours: !isCurrentlyClosed ? 'Closed' : '12:00 - 22:00',
    };
    setFormData((prev) => ({ ...prev, openingHours: updated }));
    setHasUnsavedChanges(true);
  };

  // Save changes
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setRestaurant(formData);
    setHasUnsavedChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Discard changes
  const handleReset = () => {
    setFormData({
      ...restaurant,
      assistant: initialAssistant,
      reservations: initialReservations,
      notifications: initialNotifications,
      integrations: initialIntegrations,
      team: initialTeam,
      billing: initialBilling,
    });
    setHasUnsavedChanges(false);
  };

  // Tab navigation config matching requested MVP list
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'assistant', label: 'Assistant', icon: Bot },
    { id: 'restaurant', label: 'Restaurant', icon: Building2 },
    { id: 'reservations', label: 'Reservations', icon: CalendarCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Layers },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const assistant = formData.assistant as AssistantSettings;
  const reservations = formData.reservations as ReservationSettings;
  const notifications = formData.notifications as NotificationSettings;
  const integrations = formData.integrations as IntegrationItem[];
  const team = formData.team as TeamMember[];
  const billing = formData.billing as BillingSettings;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Platform Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure your AI assistant, restaurant profile, reservation rules, notifications, integrations, team, and billing.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasUnsavedChanges}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Saved & Synced!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center justify-between shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <span className="font-bold">Settings synchronized successfully!</span> Changes are live in real-time across the AI engine, customer WhatsApp/web widgets, and staff notifications.
            </div>
          </div>
          <button
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-1 text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs (7 MVP Sections) */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-2 text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Body */}
      <div className="space-y-6">
        {/* ========================================================= */}
        {/* TAB 1: ASSISTANT */}
        {/* ========================================================= */}
        {activeTab === 'assistant' && (
          <div className="space-y-6">
            {/* Assistant Profile Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-slate-700" />
                  Assistant Identity & Persona
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure how your AI assistant introduces itself, speaks with diners, and represents your venue.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Assistant Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={assistant.assistantName}
                    onChange={(e) => handleAssistantChange('assistantName', e.target.value)}
                    placeholder="e.g. Aivora Concierge"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-semibold"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    The name presented to guests in chat threads and automated responses.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Personality & Hospitality Tone <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={assistant.personalityTone}
                    onChange={(e) => handleAssistantChange('personalityTone', e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-semibold"
                  >
                    <option value="Warm & Hospitable">Warm & Hospitable (Engaging, polite, attentive)</option>
                    <option value="Refined & Formal">Refined & Formal (Fine dining, elegant, understated)</option>
                    <option value="Casual & Vibrant">Casual & Vibrant (Upbeat, friendly, modern)</option>
                    <option value="Lively & Playful">Lively & Playful (Bistro, cocktail lounge style)</option>
                  </select>
                  <p className="text-[11px] text-slate-400">
                    Directs the vocabulary and warmth of phrasing generated by the model.
                  </p>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-800">
                    Greeting Message
                  </label>
                  <textarea
                    rows={3}
                    value={assistant.greetingMessage}
                    onChange={(e) => handleAssistantChange('greetingMessage', e.target.value)}
                    placeholder="Type the opening message guests receive when starting a chat..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-slate-400">
                    First message sent to customers on WhatsApp or the online reservation widget.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Primary Language
                  </label>
                  <select
                    value={assistant.language}
                    onChange={(e) => handleAssistantChange('language', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all"
                  >
                    <option value="English (UK / South Africa)">English (UK / South Africa)</option>
                    <option value="English (US)">English (US)</option>
                    <option value="French">French (Français)</option>
                    <option value="Afrikaans">Afrikaans</option>
                    <option value="German">German (Deutsch)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={assistant.timezone}
                    onChange={(e) => handleAssistantChange('timezone', e.target.value)}
                    placeholder="e.g. Africa/Johannesburg (GMT+2)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* AI Behavior & Capabilities */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-700" />
                  AI Behavior — What the Assistant Can & Cannot Do
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Establish boundaries and autonomous permissions for customer interactions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={assistant.canAutoBook}
                    onChange={(e) => handleAssistantChange('canAutoBook', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Auto-Confirm Valid Table Bookings
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Can check availability via Dineplan / table system and confirm reservations instantly.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={assistant.canAnswerDietary}
                    onChange={(e) => handleAssistantChange('canAnswerDietary', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Answer Menu & Allergy Inquiries
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Cites ingredients, vegetarian/halal options, and allergen alerts from Knowledge Base.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={assistant.canAcceptDeposits}
                    onChange={(e) => handleAssistantChange('canAcceptDeposits', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Issue Secure Deposit Payment Links
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Dispatches PayFast / Dineplan deposit links for large groups and festive reservations.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={assistant.canPromiseTables}
                    onChange={(e) => handleAssistantChange('canPromiseTables', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Promise Specific Table Numbers
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {assistant.canPromiseTables
                        ? 'Allowed to commit specific booths or corner tables.'
                        : 'Restricted: Promises seating area only (e.g. Courtyard), not specific table numbers.'}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors md:col-span-2">
                  <input
                    type="checkbox"
                    checked={assistant.canHandleComplaints}
                    onChange={(e) => handleAssistantChange('canHandleComplaints', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Handle Unhappy / Escalated Customers
                    </span>
                    <span className="text-[11px] text-slate-500">
                      When unchecked, any complaint or dissatisfaction automatically flags "Human Takeover" for a manager.
                    </span>
                  </div>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Custom AI Directives & Guardrails
                </label>
                <textarea
                  rows={3}
                  value={assistant.customInstructions}
                  onChange={(e) => handleAssistantChange('customInstructions', e.target.value)}
                  placeholder="e.g. Never promise wine discounts. Mention our Friday jazz evening when booking for Fridays..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: RESTAURANT */}
        {/* ========================================================= */}
        {activeTab === 'restaurant' && (
          <div className="space-y-6">
            {/* Core Info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  Restaurant Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  General venue details, physical location, phone contacts, and operating hours.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Restaurant / Venue Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleTopLevelChange('name', e.target.value)}
                    placeholder="e.g. La Petite Bistro"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Cuisine & Dining Concept <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => handleTopLevelChange('type', e.target.value)}
                    placeholder="e.g. Modern French Bistro & Wine Bar"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-800">
                    Physical Street Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleTopLevelChange('address', e.target.value)}
                    placeholder="e.g. 142 Kloof Street, Gardens, Cape Town, 8001"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Reservation Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleTopLevelChange('phone', e.target.value)}
                    placeholder="e.g. +27 21 424 5555"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Average Spend per Guest
                  </label>
                  <input
                    type="text"
                    value={formData.averageSpend}
                    onChange={(e) => handleTopLevelChange('averageSpend', e.target.value)}
                    placeholder="e.g. R450 - R650 pp"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleTopLevelChange('website', e.target.value)}
                    placeholder="e.g. https://www.lapetitebistro.co.za"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={formData.instagram || ''}
                    onChange={(e) => handleTopLevelChange('instagram', e.target.value)}
                    placeholder="e.g. @lapetitebistro_ct"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-700" />
                  Operating Hours & Shift Times
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Service hours per day. The AI automatically blocks booking requests outside of service shifts.
                </p>
              </div>

              <div className="space-y-2.5">
                {formData.openingHours.map((schedule, idx) => (
                  <div
                    key={schedule.day}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      schedule.closed
                        ? 'bg-slate-50/70 border-slate-200 opacity-75'
                        : 'bg-white border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-36">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                      <span className="font-bold text-xs sm:text-sm text-slate-900">{schedule.day}</span>
                    </div>

                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="text"
                        disabled={schedule.closed}
                        value={schedule.hours}
                        onChange={(e) => handleHoursChange(idx, e.target.value)}
                        placeholder="e.g. 12:00 - 22:30"
                        className="flex-1 px-3.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                      />

                      <button
                        type="button"
                        onClick={() => handleToggleClosed(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                          schedule.closed
                            ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {schedule.closed ? 'Mark Open' : 'Mark Closed'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: RESERVATIONS */}
        {/* ========================================================= */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-slate-700" />
                  Reservation Rules & Party Size Limits
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure capacity rules, deposit triggers, and grace periods for automated bookings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-800">
                    Booking Policy & Seating Rules
                  </label>
                  <textarea
                    rows={2}
                    value={reservations.bookingRules}
                    onChange={(e) => handleReservationChange('bookingRules', e.target.value)}
                    placeholder="e.g. 15-minute grace period. Tables allocated based on arrival..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Max Party Size for Instant Auto-Confirmation
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={2}
                      max={14}
                      step={1}
                      value={reservations.maxPartySize}
                      onChange={(e) => handleReservationChange('maxPartySize', parseInt(e.target.value, 10))}
                      className="flex-1 accent-slate-900 cursor-pointer"
                    />
                    <span className="w-20 py-1.5 text-center font-bold font-mono text-xs bg-slate-100 rounded-lg border border-slate-200">
                      {reservations.maxPartySize} guests
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Parties larger than this threshold are flagged for manager review & deposit collection.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Table Hold Grace Period (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={45}
                    step={5}
                    value={reservations.gracePeriodMins}
                    onChange={(e) => handleReservationChange('gracePeriodMins', parseInt(e.target.value, 10) || 15)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    Standard duration table is kept if the party is running late.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Advance Booking Window (Days)
                  </label>
                  <input
                    type="number"
                    min={7}
                    max={180}
                    step={7}
                    value={reservations.advanceBookingDays}
                    onChange={(e) => handleReservationChange('advanceBookingDays', parseInt(e.target.value, 10) || 30)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    How far in advance customers can reserve tables.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Deposit Trigger Party Size & Fee
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={reservations.depositRequiredForPartyOf}
                      onChange={(e) => handleReservationChange('depositRequiredForPartyOf', parseInt(e.target.value, 10) || 6)}
                      placeholder="Guests threshold (e.g. 6)"
                      className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono"
                    />
                    <input
                      type="text"
                      value={reservations.depositAmountPerPerson}
                      onChange={(e) => handleReservationChange('depositAmountPerPerson', e.target.value)}
                      placeholder="e.g. R150/guest"
                      className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Required for groups of {reservations.depositRequiredForPartyOf}+ guests.
                  </p>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-800">
                    Cancellation Policy
                  </label>
                  <textarea
                    rows={2}
                    value={reservations.cancellationPolicy}
                    onChange={(e) => handleReservationChange('cancellationPolicy', e.target.value)}
                    placeholder="State your cancellation notice terms and refund rules..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: NOTIFICATIONS */}
        {/* ========================================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-700" />
                  Alert Channels & Staff Escalations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure who gets notified when human takeover is requested or VIP guests make a booking.
                </p>
              </div>

              {/* Alert Contact Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Urgent Escalation Mobile / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={notifications.alertPhone}
                    onChange={(e) => handleNotificationChange('alertPhone', e.target.value)}
                    placeholder="e.g. +27 82 555 0192"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-mono"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    Receives instant WhatsApp / SMS pings when a diner requests human intervention.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Reservations Team Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={notifications.alertEmail}
                    onChange={(e) => handleNotificationChange('alertEmail', e.target.value)}
                    placeholder="e.g. reservations@restaurant.co.za"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all font-mono"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    Receives morning operational briefings and large group inquiry tickets.
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.takeoverAlerts}
                    onChange={(e) => handleNotificationChange('takeoverAlerts', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Instant Ping on Human Takeover Required
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Dispatches immediate notification whenever the AI encounters an unanswerable query, complex dietary request, or manual intervention request.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.vipBookingAlerts}
                    onChange={(e) => handleNotificationChange('vipBookingAlerts', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      VIP Guest & Banquet Booking Alert
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Alerts floor managers whenever recognized repeat guests, wine club members, or parties over 6 reserve a table.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.dailySummaryBrief}
                    onChange={(e) => handleNotificationChange('dailySummaryBrief', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Daily 09:00 AM Shift Briefing Email
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Receive an executive morning breakdown with covers, VIP notes, dietary warnings, and pending waitlist inquiries.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: INTEGRATIONS */}
        {/* ========================================================= */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-700" />
                  Third-Party Integrations & Connectors
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synchronize your restaurant POS, reservation engines, and WhatsApp Business API.
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {integrations.map((item) => (
                  <div
                    key={item.id}
                    className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        item.connected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {item.category.slice(0, 3).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.connected
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {item.connected ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.statusText} · <span className="font-mono text-[11px]">Sync: {item.lastSync}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleIntegration(item.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-auto ${
                        item.connected
                          ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                      }`}
                    >
                      {item.connected ? 'Disconnect' : 'Connect API'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: TEAM */}
        {/* ========================================================= */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-700" />
                    Team Accounts & Permissions
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Staff members authorized to take over chats, modify menu knowledge, and manage settings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Invite Member</span>
                </button>
              </div>

              {/* Team Members List */}
              <div className="divide-y divide-slate-200">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-center shrink-0">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{member.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {member.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                          <span className="font-mono">{member.email}</span>
                          <span>·</span>
                          <span className="font-mono">{member.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Roles & Permissions Matrix */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Permission Levels
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block">General Manager</span>
                    <p className="text-slate-500 text-[11px] mt-1">
                      Full access to chat takeovers, settings, integrations, staff accounts, and billing.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block">Floor Host</span>
                    <p className="text-slate-500 text-[11px] mt-1">
                      Live chat takeover, table status checks, guest notes, and manual booking overrides.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block">Chef / Kitchen</span>
                    <p className="text-slate-500 text-[11px] mt-1">
                      Menu knowledge updates, daily 86'd items, allergen notices, and dietary reviews.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Team Member Modal / Inline Card */}
            {showAddTeamModal && (
              <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Invite New Team Member</h4>
                  <button
                    onClick={() => setShowAddTeamModal(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleAddTeamMember} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Full Name (e.g. Liam Scott)"
                    className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  />

                  <input
                    type="email"
                    required
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Staff Email"
                    className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono"
                  />

                  <div className="flex gap-2">
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value as any)}
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
                    >
                      <option value="Floor Host">Floor Host</option>
                      <option value="General Manager">General Manager</option>
                      <option value="Chef / Kitchen">Chef / Kitchen</option>
                      <option value="Owner">Owner</option>
                    </select>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: BILLING */}
        {/* ========================================================= */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-700" />
                  Billing & Subscription Management
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View your current tier, monthly conversation quota, payment method, and receipts.
                </p>
              </div>

              {/* Plan Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                      Active Subscription
                    </span>
                    <span className="text-xs text-slate-300">Renews on {billing.nextBillingDate}</span>
                  </div>
                  <h4 className="text-xl font-black mt-2 tracking-tight">{billing.planName}</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Includes 24/7 AI Autonomous Concierge, WhatsApp Cloud Webhooks, Dineplan Sync & Multi-staff Seats.
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-black tracking-tight">{billing.planPrice}</div>
                  <span className="text-[11px] text-slate-400">Billed {billing.billingCycle}</span>
                </div>
              </div>

              {/* Usage Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Monthly AI Guest Conversations</span>
                  <span className="font-mono text-slate-600 font-bold">
                    {billing.conversationsUsed} / {billing.conversationsLimit} used ({Math.round((billing.conversationsUsed / billing.conversationsLimit) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-slate-900 h-full rounded-full transition-all"
                    style={{ width: `${(billing.conversationsUsed / billing.conversationsLimit) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Reset date is 15 October 2026. Extra conversations are billed at R1.20 per completed guest resolution.
                </p>
              </div>

              {/* Payment Method & Tax Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Payment Method</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-700 font-bold">{billing.paymentMethod}</span>
                    <button
                      type="button"
                      onClick={() => alert('Card updater opened.')}
                      className="text-xs font-bold text-slate-900 hover:underline cursor-pointer"
                    >
                      Update Card
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 block">Next automatic deduction on {billing.nextBillingDate}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Invoicing & VAT Details</span>
                  <div className="text-xs text-slate-700 space-y-0.5">
                    <div><strong className="text-slate-900">Email:</strong> {billing.billingEmail}</div>
                    <div><strong className="text-slate-900">VAT ID:</strong> {billing.taxVatNumber}</div>
                  </div>
                </div>
              </div>

              {/* Invoices List */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Recent Invoices & Receipts
                </h4>
                <div className="divide-y divide-slate-200 text-xs">
                  {[
                    { id: 'INV-2026-09', date: '15 Sep 2026', amount: 'R2,450', status: 'Paid' },
                    { id: 'INV-2026-08', date: '15 Aug 2026', amount: 'R2,450', status: 'Paid' },
                    { id: 'INV-2026-07', date: '15 Jul 2026', amount: 'R2,450', status: 'Paid' },
                  ].map((inv) => (
                    <div key={inv.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-mono font-semibold text-slate-800">{inv.id}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{inv.date}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-900">{inv.amount}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {inv.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading ${inv.id}.pdf`)}
                          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                          title="Download Receipt"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            {hasUnsavedChanges ? (
              <span className="text-amber-600 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Unsaved modifications detected. Click Save Changes to synchronize.
              </span>
            ) : (
              <span>All settings are synchronized with the live platform.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasUnsavedChanges}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-all cursor-pointer"
            >
              Discard Changes
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
