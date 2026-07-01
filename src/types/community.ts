import type { CardData } from './card';

export interface CommunityPost {
  id: string;
  authorId: string;
  authorNickname: string;
  type: 'license' | 'resonance';
  cardData?: CardData;
  textContent?: string;
  themeId: string;
  interactions: PostInteractions;
  createdAt: string;
}

export interface PostInteractions {
  hug: number;
  sameHere: number;
  letItGo: number;
  tomorrow: number;
}

export type InteractionType = keyof PostInteractions;

export interface CommunityTheme {
  id: string;
  mode: 'student' | 'worker' | 'all';
  name: string;
  icon: string;
  description: string;
}
