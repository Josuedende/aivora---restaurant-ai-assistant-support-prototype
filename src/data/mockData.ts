import { CustomerConversation, KnowledgeDocument, RestaurantProfile } from '../types';

export const initialRestaurantProfile: RestaurantProfile = {
  name: '',
  address: '',
  phone: '',
  website: '',
  type: '',
  openingHours: [
    { day: 'Monday', hours: '' },
    { day: 'Tuesday', hours: '' },
    { day: 'Wednesday', hours: '' },
    { day: 'Thursday', hours: '' },
    { day: 'Friday', hours: '' },
    { day: 'Saturday', hours: '' },
    { day: 'Sunday', hours: '' },
  ],
  averageSpend: '',
  additionalInfo: '',
  isAiActive: true,
};

export const initialKnowledgeDocuments: KnowledgeDocument[] = [];

export const initialConversations: CustomerConversation[] = [
  {
    id: 'conv-1',
    customerName: 'Sarah Jenkins',
    customerPhone: '+27 82 459 2811',
    question: 'Table for 4 on 24 Sep at 19:30 (Anniversary) — Need manager confirmation',
    status: 'Human Required',
    timeAgo: '5m ago',
    lastMessageTime: '14:15',
    unread: true,
    channel: 'WhatsApp',
    vipStatus: true,
    guestNotes: 'Celebrating 10th wedding anniversary. Requested quiet window table and dietary check.',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        text: 'Hi, we would like to book a table for 4 guests on 24 September 2026 at 19:30 for our anniversary.',
        timestamp: '14:10',
      },
      {
        id: 'msg-2',
        sender: 'ai',
        text: 'Hello Sarah! Happy upcoming anniversary! I see availability for 4 guests on 24 September at 19:30. Would you like our quiet corner table or the main dining room?',
        timestamp: '14:11',
      },
      {
        id: 'msg-3',
        sender: 'customer',
        text: 'Quiet window booth please! Also one guest is severely celiac. Can a human manager please confirm this reservation directly?',
        timestamp: '14:15',
      },
    ],
  },
];

