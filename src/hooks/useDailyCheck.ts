import { useCallback } from 'react';
import { formatDate } from '../utils/date';

export function useDailyCheck() {
  const getTodayStatus = useCallback((): { date: string; statusId: string | null } => {
    try {
      const stored = localStorage.getItem('tnw_today_status');
      if (!stored) return { date: formatDate(new Date()), statusId: null };
      const data = JSON.parse(stored);
      if (data.date === formatDate(new Date())) {
        return data;
      }
      return { date: formatDate(new Date()), statusId: null };
    } catch {
      return { date: formatDate(new Date()), statusId: null };
    }
  }, []);

  const setTodayStatus = useCallback((statusId: string) => {
    const data = { date: formatDate(new Date()), statusId };
    localStorage.setItem('tnw_today_status', JSON.stringify(data));
  }, []);

  const getTodayCard = useCallback((): string | null => {
    try {
      const stored = localStorage.getItem('tnw_today_card');
      if (!stored) return null;
      const data = JSON.parse(stored);
      if (data.date === formatDate(new Date())) {
        return data.cardId;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const setTodayCard = useCallback((cardId: string) => {
    const data = { date: formatDate(new Date()), cardId };
    localStorage.setItem('tnw_today_card', JSON.stringify(data));
  }, []);

  return { getTodayStatus, setTodayStatus, getTodayCard, setTodayCard };
}
