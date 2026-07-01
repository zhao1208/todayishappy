import type { UserMode } from '../types/user';

/**
 * 生成卡片编号
 * 学生模式: BL-MMDD-XXX (BL = 摆烂)
 * 上班族模式: DG-MMDD-XXX (DG = 打工)
 * MMDD 为当前月日，XXX 为 3 位随机数
 */
export function generateSerialNo(mode: UserMode): string {
  const prefix = mode === 'student' ? 'BL' : 'DG';
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `${prefix}-${month}${day}-${random}`;
}

/**
 * 生成 UUID v4
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
