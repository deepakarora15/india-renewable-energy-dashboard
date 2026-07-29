export type EnergyFilter = 'solar' | 'wind' | 'all';
export type UserRole = 'admin' | 'user';

export interface User {
  username: string;
  role: UserRole;
}

export interface QuizScore {
  name: string;
  gender: string;
  score: number;
  total: number;
  date: string;
}
