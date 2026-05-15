/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Page {
  HOME = 'home',
  AUTH = 'auth',
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
  AI_CHAT = 'ai_chat',
  PHARMACY = 'pharmacy',
  DIRECTORY = 'directory',
  FACILITIES = 'facilities',
  ARTICLE = 'article',
  FAQ = 'faq',
  NOTIFICATIONS = 'notifications',
  ALL_ARTICLES = 'all_articles',
  SETTINGS = 'settings'
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'Akun' | 'Transaksi' | 'Pengingat' | 'Riwayat';
  timestamp: Date;
  isRead: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  height?: number;
  weight?: number;
  photo?: string;
  medicalHistory: string[];
  familyMembers: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  name: string;
  dob: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  medicalHistory: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Mendatang' | 'Selesai' | 'Batal';
}

export interface Medicine {
  id: string;
  name: string;
  price: number;
  category: 'Obat Bebas' | 'Obat Bebas Terbatas' | 'Obat Keras' | 'Jamu' | 'Obat Herbal';
  status: 'Tersedia' | 'Habis';
  needRecipe: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  attachments?: string[];
}

export interface MedicalHistoryChat {
  id: string;
  date: string;
  summary: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  qualifications: string[];
  schedule: {
    day: string;
    slots: string[];
  }[];
}

export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  image: string;
  category: string;
}

export interface AccessibilityState {
  highContrast: boolean;
  fontSize: 'normal' | 'large';
  theme: 'light' | 'dark' | 'system';
}
