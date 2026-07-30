export type EnergyFilter = 'solar' | 'wind' | 'all';
export type UserRole = 'admin' | 'user';

export interface User {
  username: string;
  role: UserRole;
}

export interface ManagedUser {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  isDefault?: boolean;
}

export interface LoginLog {
  username: string;
  role: UserRole;
  timestamp: string;
  action: 'login' | 'logout';
}

export interface QuizScore {
  name: string;
  gender: string;
  score: number;
  total: number;
  date: string;
}
