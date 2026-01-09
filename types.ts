
export enum Language {
  FR = 'fr',
  EN = 'en'
}

export interface UserProfile {
  uid: string;
  email: string;
  credits: number;
  displayName?: string;
}

export interface GeneratedShort {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  createdAt: number;
  status: 'processing' | 'completed' | 'failed';
  hook: string;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  label: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}
