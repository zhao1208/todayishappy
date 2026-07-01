export type UserRole = 'admin' | 'user';

export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  nickname: string;
  mode: 'student' | 'worker' | null;
  preferredCardStyle: 'official' | 'diagnosis' | 'game';
  createdAt: string;
}

export interface UserSession {
  userId: string;
  username: string;
  role: UserRole;
  token: string;
  expiresAt: number;
}

export interface AuthState {
  session: UserSession | null;
  isLoading: boolean;
}
