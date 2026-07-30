import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnergyFilter, User, QuizScore, ManagedUser, LoginLog } from './types';

interface AppState {
  user: User | null;
  filter: EnergyFilter;
  activeTab: number;
  quizScores: QuizScore[];
  usedQuestionIndices: number[];
  managedUsers: ManagedUser[];
  loginLogs: LoginLog[];
  setUser: (user: User | null) => void;
  setFilter: (filter: EnergyFilter) => void;
  setActiveTab: (tab: number) => void;
  addQuizScore: (score: QuizScore) => void;
  markQuestionsUsed: (indices: number[]) => void;
  resetUsedQuestions: () => void;
  addManagedUser: (user: ManagedUser) => void;
  removeManagedUser: (username: string) => void;
  addLoginLog: (log: LoginLog) => void;
}

const DEFAULT_USERS: ManagedUser[] = [
  { username: 'DeepakArora', email: 'deepak.arora@icicilombard.com', password: 'deepak123', role: 'admin', createdAt: '2025-01-01', isDefault: true },
  { username: 'CSG2', email: 'csg2@icicilombard.com', password: 'csg123', role: 'user', createdAt: '2025-01-01', isDefault: true },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      filter: 'all',
      activeTab: 0,
      quizScores: [],
      usedQuestionIndices: [],
      managedUsers: DEFAULT_USERS,
      loginLogs: [],
      setUser: (user) => set({ user }),
      setFilter: (filter) => set({ filter }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      addQuizScore: (score) =>
        set((state) => ({ quizScores: [...state.quizScores, score] })),
      markQuestionsUsed: (indices) =>
        set((state) => ({ usedQuestionIndices: [...state.usedQuestionIndices, ...indices] })),
      resetUsedQuestions: () => set({ usedQuestionIndices: [] }),
      addManagedUser: (user) =>
        set((state) => ({ managedUsers: [...state.managedUsers, user] })),
      removeManagedUser: (username) =>
        set((state) => ({ managedUsers: state.managedUsers.filter((u) => u.username !== username) })),
      addLoginLog: (log) =>
        set((state) => ({ loginLogs: [log, ...state.loginLogs].slice(0, 100) })),
    }),
    { name: 'india-re-dashboard' }
  )
);
