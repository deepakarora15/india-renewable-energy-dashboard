import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnergyFilter, User, QuizScore } from './types';

interface AppState {
  user: User | null;
  filter: EnergyFilter;
  activeTab: number;
  quizScores: QuizScore[];
  usedQuestionIndices: number[];
  setUser: (user: User | null) => void;
  setFilter: (filter: EnergyFilter) => void;
  setActiveTab: (tab: number) => void;
  addQuizScore: (score: QuizScore) => void;
  markQuestionsUsed: (indices: number[]) => void;
  resetUsedQuestions: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      filter: 'all',
      activeTab: 0,
      quizScores: [],
      usedQuestionIndices: [],
      setUser: (user) => set({ user }),
      setFilter: (filter) => set({ filter }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      addQuizScore: (score) =>
        set((state) => ({ quizScores: [...state.quizScores, score] })),
      markQuestionsUsed: (indices) =>
        set((state) => ({ usedQuestionIndices: [...state.usedQuestionIndices, ...indices] })),
      resetUsedQuestions: () => set({ usedQuestionIndices: [] }),
    }),
    { name: 'india-re-dashboard' }
  )
);
