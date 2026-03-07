import { create } from 'zustand';

// 用户类型
interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// 状态类型
interface AppState {
  // 用户状态
  currentUser: User | null;
  users: User[];
  
  // UI 状态
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 初始状态
  currentUser: null,
  users: [],
  isLoading: false,
  error: null,
  
  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  setUsers: (users) => set({ users }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
