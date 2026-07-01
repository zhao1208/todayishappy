import type { UserMode } from './user';

export type CardStyle = 'official' | 'diagnosis' | 'game';

export interface CardData {
  id: string;
  serialNo: string;
  style: CardStyle;
  statusId: string;
  mode: UserMode;
  nickname: string;
  title: string;
  reasonText: string;
  permitText: string;
  microTask: string;
  goldenQuote: string;
  createdAt: string;
  exportedAt?: string;
  sharedAt?: string;
}
