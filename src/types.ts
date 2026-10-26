export type ScreenId = 'landing' | 'login' | 'register' | 'onboarding' | 'dashboard' | 'knowledge' | 'conversations' | 'settings' | 'bookings' | 'design-system';

export type OnboardingStep = 1 | 2 | 3 | 4;

export interface AssistantSettings {
  assistantName: string;
  personalityTone: 'Warm & Hospitable' | 'Refined & Formal' | 'Casual & Vibrant' | 'Lively & Playful';
  greetingMessage: string;
  language: string;
  timezone: string;
  canAutoBook: boolean;
  canAnswerDietary: boolean;
  canAcceptDeposits: boolean;
  canPromiseTables: boolean;
  canHandleComplaints: boolean;
  customInstructions: string;
}

export interface ReservationSettings {
  bookingRules: string;
  minPartySize: number;
  maxPartySize: number;
  gracePeriodMins: number;
  advanceBookingDays: number;
  cancellationPolicy: string;
  depositRequiredForPartyOf: number;
  depositAmountPerPerson: string;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  whatsappAlerts: boolean;
  alertPhone: string;
  alertEmail: string;
  takeoverAlerts: boolean;
  vipBookingAlerts: boolean;
  dailySummaryBrief: boolean;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: 'Reservations' | 'POS' | 'Messaging' | 'Search & Maps';
  provider: string;
  connected: boolean;
  statusText: string;
  lastSync?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'General Manager' | 'Floor Host' | 'Chef / Kitchen';
  phone: string;
  active: boolean;
}

export interface BillingSettings {
  planName: string;
  planPrice: string;
  billingCycle: 'Monthly' | 'Annual';
  conversationsUsed: number;
  conversationsLimit: number;
  nextBillingDate: string;
  paymentMethod: string;
  billingEmail: string;
  taxVatNumber: string;
}

export interface RestaurantProfile {
  name: string;
  address: string;
  phone: string;
  website: string;
  type: string;
  openingHours: {
    day: string;
    hours: string;
    closed?: boolean;
  }[];
  averageSpend: string;
  additionalInfo: string;
  isAiActive: boolean;
  tagline?: string;
  managerName?: string;
  managerEmail?: string;
  managerPhone?: string;
  managerRole?: string;
  instagram?: string;
  bookingIntegration?: 'Dineplan' | 'OpenTable' | 'SevenRooms' | 'Resy' | 'Direct';
  aiTone?: 'Warm & Hospitable' | 'Refined & Formal' | 'Casual & Vibrant';
  maxAutoPartySize?: number;
  notifyOnTakeover?: boolean;
  notifyOnVip?: boolean;
  dailySummaryEmail?: boolean;
  currency?: string;
  timezone?: string;

  assistant?: AssistantSettings;
  reservations?: ReservationSettings;
  notifications?: NotificationSettings;
  integrations?: IntegrationItem[];
  team?: TeamMember[];
  billing?: BillingSettings;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'TXT';
  size: string;
  uploadedAt: string;
  status: 'Ready' | 'Processing' | 'Indexed';
  category: 'Menu' | 'FAQ' | 'Policy' | 'Beverage' | 'Operations';
}

export type ConversationStatus = 'Booked' | 'Answered' | 'Human Required' | 'In Human Control';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai' | 'manager';
  text: string;
  timestamp: string;
  meta?: {
    reservationDetails?: {
      guests: number;
      date: string;
      time: string;
      seatingArea: string;
      referenceId: string;
    };
    sourceDoc?: string;
  };
}

export interface BookingReservation {
  id: string;
  guestName: string;
  phone: string;
  email?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "19:30"
  guests: number;
  seatingArea: string;
  notes?: string;
  status: 'Confirmed' | 'Seated' | 'Cancelled';
  channel: 'WhatsApp' | 'Web Widget' | 'Phone';
  createdAt: string;
}

export interface CustomerConversation {
  id: string;
  customerName: string;
  customerPhone: string;
  avatar?: string;
  question: string;
  status: ConversationStatus;
  timeAgo: string;
  lastMessageTime: string;
  unread?: boolean;
  channel: 'WhatsApp' | 'Web Widget' | 'Instagram Direct';
  messages: ChatMessage[];
  guestNotes?: string;
  vipStatus?: boolean;
}
