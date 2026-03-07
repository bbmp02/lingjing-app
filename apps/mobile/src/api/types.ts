// 用户相关 API 类型
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// 精神货币相关 API 类型
export interface SpiritCurrency {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  createdAt: string;
}

export interface CreateSpiritCurrencyDto {
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
}

// 关系图谱相关 API 类型
export interface Relationship {
  id: string;
  userId: string;
  targetUserId: string;
  type: 'friend' | 'family' | 'colleague' | 'other';
  strength: number; // 1-10
  createdAt: string;
}

export interface CreateRelationshipDto {
  userId: string;
  targetUserId: string;
  type: 'friend' | 'family' | 'colleague' | 'other';
  strength: number;
}

// 互动记录相关 API 类型
export interface InteractionRecord {
  id: string;
  userId: string;
  targetUserId: string;
  type: 'message' | 'call' | 'meeting' | 'gift' | 'other';
  content?: string;
  createdAt: string;
}

export interface CreateInteractionRecordDto {
  userId: string;
  targetUserId: string;
  type: 'message' | 'call' | 'meeting' | 'gift' | 'other';
  content?: string;
}

// API 响应类型
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
