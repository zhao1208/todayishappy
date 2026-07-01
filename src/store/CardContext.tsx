import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CardData } from '../types/card';

interface CardState {
  currentCard: CardData | null;
  history: CardData[];
  isLoading: boolean;
}

type CardAction =
  | { type: 'SET_CURRENT_CARD'; payload: CardData }
  | { type: 'UPDATE_CURRENT_CARD'; payload: Partial<CardData> }
  | { type: 'ADD_TO_HISTORY'; payload: CardData }
  | { type: 'CLEAR_CURRENT' }
  | { type: 'SET_HISTORY'; payload: CardData[] };

const CardContext = createContext<CardState & {
  dispatch: React.Dispatch<CardAction>;
  setCurrentCard: (card: CardData) => void;
  updateCurrentCard: (updates: Partial<CardData>) => void;
  addToHistory: (card: CardData) => void;
  clearCurrent: () => void;
} | null>(null);

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function cardReducer(state: CardState, action: CardAction): CardState {
  switch (action.type) {
    case 'SET_CURRENT_CARD':
      return { ...state, currentCard: action.payload };
    case 'UPDATE_CURRENT_CARD':
      if (!state.currentCard) return state;
      const updated = { ...state.currentCard, ...action.payload };
      localStorage.setItem('tnw_today_card', JSON.stringify({ date: new Date().toISOString().split('T')[0], cardId: updated.id }));
      return { ...state, currentCard: updated };
    case 'ADD_TO_HISTORY': {
      const newHistory = [action.payload, ...state.history.filter(c => c.id !== action.payload.id)].slice(0, 50);
      localStorage.setItem('tnw_card_history', JSON.stringify(newHistory));
      return { ...state, history: newHistory };
    }
    case 'CLEAR_CURRENT':
      return { ...state, currentCard: null };
    case 'SET_HISTORY':
      return { ...state, history: action.payload, isLoading: false };
    default:
      return state;
  }
}

function cleanHistory(history: CardData[]): CardData[] {
  const cutoff = Date.now() - THIRTY_DAYS_MS;
  return history.filter(c => new Date(c.createdAt).getTime() > cutoff);
}

export function CardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cardReducer, {
    currentCard: null,
    history: [],
    isLoading: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tnw_card_history');
      if (stored) {
        const history = cleanHistory(JSON.parse(stored));
        dispatch({ type: 'SET_HISTORY', payload: history });
      } else {
        dispatch({ type: 'SET_HISTORY', payload: [] });
      }
    } catch {
      dispatch({ type: 'SET_HISTORY', payload: [] });
    }
  }, []);

  const setCurrentCard = (card: CardData) => {
    dispatch({ type: 'SET_CURRENT_CARD', payload: card });
  };
  const updateCurrentCard = (updates: Partial<CardData>) => {
    dispatch({ type: 'UPDATE_CURRENT_CARD', payload: updates });
  };
  const addToHistory = (card: CardData) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: card });
  };
  const clearCurrent = () => {
    dispatch({ type: 'CLEAR_CURRENT' });
  };

  return (
    <CardContext.Provider value={{ ...state, dispatch, setCurrentCard, updateCurrentCard, addToHistory, clearCurrent }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCardStore() {
  const context = useContext(CardContext);
  if (!context) throw new Error('useCardStore must be used within CardProvider');
  return context;
}
