import type { CardStyle } from './card';

export type UserMode = 'student' | 'worker';

export interface UserProfile {
  id: string;
  nickname: string;
  mode: UserMode;
  createdAt: string;
  preferredCardStyle: CardStyle;
}
