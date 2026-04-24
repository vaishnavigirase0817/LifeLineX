import { create } from 'zustand';

interface User {
  name: string;
  email: string;
  healthScore: number;
  gender?: string;
  age?: number;
  avatar?: string;
  emergencyContacts?: EmergencyContact[];
  familyMembers?: FamilyMember[];
  healthHistory?: HealthRecord[];
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  healthScore: number;
}

interface HealthRecord {
  id: string;
  date: string;
  type: string;
  score: number;
  note: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'reminder' | 'update';
  read: boolean;
  timestamp: string;
}

interface AppState {
  user: User | null;
  isRuralMode: boolean;
  emergencyActive: boolean;
  healthScore: number;
  notifications: Notification[];
  language: 'en' | 'hi' | 'mr';
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  toggleRuralMode: () => void;
  setEmergencyActive: (active: boolean) => void;
  setHealthScore: (score: number) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isRuralMode: false,
  emergencyActive: false,
  healthScore: 78,
  notifications: [
    { id: '1', title: 'Hydration Goal', message: 'You are 20% below your hydration target today.', type: 'reminder', read: false, timestamp: new Date().toISOString() },
    { id: '2', title: 'Health Checkup', message: 'Last checkup was 3 months ago. Schedule a routine scan.', type: 'reminder', read: false, timestamp: new Date().toISOString() },
  ],
  language: 'en',
  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),
  toggleRuralMode: () => set((state) => ({ isRuralMode: !state.isRuralMode })),
  setEmergencyActive: (active) => set({ emergencyActive: active }),
  setHealthScore: (score) => set({ healthScore: score }),
  addNotification: (n) => set((state) => ({
    notifications: [{ 
      ...n, 
      id: Math.random().toString(36).substr(2, 9), 
      read: false, 
      timestamp: new Date().toISOString() 
    }, ...state.notifications]
  })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  setLanguage: (lang) => set({ language: lang }),
  logout: () => set({ user: null, emergencyActive: false, healthScore: 0 }),
}));
