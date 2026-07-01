import type { CardStyle } from './card';

export type UserMode = 'student' | 'worker';
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  nickname: string;
  mode: UserMode;
  createdAt: string;
  preferredCardStyle: CardStyle;
  role: UserRole;
}
