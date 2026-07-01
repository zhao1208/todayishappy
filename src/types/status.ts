import type { UserMode } from './user';

export interface StatusOption {
  id: string;
  mode: UserMode;
  name: string;
  keywords: string[];
  description: string;
  icon: string;
}
