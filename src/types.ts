/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Gift {
  id: string;
  name: string;
  price: number;
  icon: string;
  animationColor: string;
}

export interface DetailedProfile {
  name: string;
  avatar: string;
  id: string;
  level: number;
  broadcasterLevel: number;
  country: string;
  countryFlag: string;
  gender: 'male' | 'female';
  age: number;
  medalsCount: number;
  followers: string;
  following: string;
  signature: string;
}

export interface Seat {
  id: number;
  status: 'open' | 'locked' | 'occupied';
  user?: {
    name: string;
    avatar: string;
  };
}

export interface RoomMessage {
  id: string;
  userName: string;
  text: string;
  type: 'chat' | 'system' | 'gift';
}

export interface Room {
  id: string;
  title: string;
  description: string;
  viewerCount: string;
  location: string;
  coverImage: string;
  admin: {
    name: string;
    avatar: string;
    level: number;
  };
}

export const GIFTS: Gift[] = [
  { id: '1', name: 'التاج الملكي', price: 10000, icon: '👑', animationColor: 'bg-yellow-500' },
  { id: '2', name: 'نسر الميكو', price: 30000, icon: '🦅', animationColor: 'bg-purple-600' },
  { id: '3', name: 'مجنوني', price: 20000, icon: '✨', animationColor: 'bg-pink-500' },
  { id: '4', name: 'الأسطورة', price: 20000, icon: '🌟', animationColor: 'bg-amber-500' },
  { id: '5', name: 'هلا بالخميس', price: 5000, icon: '🐱', animationColor: 'bg-indigo-500' },
  { id: '6', name: 'صندوق الحظ', price: 2000, icon: '🎁', animationColor: 'bg-orange-500' },
  { id: '7', name: 'التنين الذهبي', price: 50000, icon: '🐉', animationColor: 'bg-red-600' },
  { id: '8', name: 'الشبح الضاحك', price: 1000, icon: '👻', animationColor: 'bg-blue-400' },
];

export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

export interface Chat {
  id: number;
  userName: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: Message[];
}

export const ROOMS: Room[] = [
  {
    id: '1',
    title: 'روم قناص 🔥',
    description: 'حياكم جميعاً في أقوى روم بث مباشر',
    viewerCount: '3.5K',
    location: 'مصر',
    coverImage: 'https://images.unsplash.com/photo-1540224871915-bc8ffb782bdf?q=80&w=400&auto=format&fit=crop',
    admin: { name: 'الأدمن', avatar: 'https://i.pravatar.cc/150?u=1', level: 15 }
  },
  {
    id: '2',
    title: 'نادي المبدعين للصوتيات 🎤',
    description: 'دردشة وأغاني ومسابقات يومية',
    viewerCount: '1.2K',
    location: 'السعودية',
    coverImage: 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3?q=80&w=400&auto=format&fit=crop',
    admin: { name: 'علا', avatar: 'https://i.pravatar.cc/150?u=2', level: 22 }
  },
  {
    id: '3',
    title: 'عالم المغامرة والغموض 🌍',
    description: 'قصص واقعية ونقاشات مفيدة',
    viewerCount: '900',
    location: 'المغرب',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd0562c3e?q=80&w=400&auto=format&fit=crop',
    admin: { name: 'ياسين', avatar: 'https://i.pravatar.cc/150?u=3', level: 10 }
  },
  {
    id: '4',
    title: 'جلسة سهر وعتاب 🎶',
    description: 'أجمل الأغاني الكلاسيكية بروم واحد',
    viewerCount: '2.8K',
    location: 'الإمارات',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop',
    admin: { name: 'ريم', avatar: 'https://i.pravatar.cc/150?u=4', level: 45 }
  }
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 1,
    userName: 'سارة الهلالي',
    avatar: 'https://i.pravatar.cc/150?u=sara',
    lastMessage: 'كيف حالك اليوم؟',
    lastTime: '12:45 م',
    unreadCount: 2,
    messages: [
      { id: 1, text: 'أهلاً بك', sender: 'them', timestamp: '12:40 م' },
      { id: 2, text: 'كيف حالك اليوم؟', sender: 'them', timestamp: '12:45 م' },
    ]
  },
  {
    id: 2,
    userName: 'أحمد مراد',
    avatar: 'https://i.pravatar.cc/150?u=ahmed',
    lastMessage: 'تم إرسال الهدية بنجاح 🎁',
    lastTime: 'أمس',
    unreadCount: 0,
    messages: [
      { id: 1, text: 'شكراً على الدعم', sender: 'me', timestamp: 'أمس' },
      { id: 2, text: 'تم إرسال الهدية بنجاح 🎁', sender: 'them', timestamp: 'أمس' },
    ]
  },
  {
    id: 3,
    userName: 'نورة علي',
    avatar: 'https://i.pravatar.cc/150?u=nora',
    lastMessage: 'هل ستكون متاحاً للبث اليوم؟',
    lastTime: '09:12 ص',
    unreadCount: 1,
    messages: [
      { id: 1, text: 'هل ستكون متاحاً للبث اليوم؟', sender: 'them', timestamp: '09:12 ص' },
    ]
  }
];
