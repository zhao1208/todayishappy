import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { UserMode, UserProfile } from '../types/user';
import type { CardStyle } from '../types/card';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
}

type UserAction =
  | { type: 'SET_MODE'; payload: UserMode }
  | { type: 'SET_NICKNAME'; payload: string }
  | { type: 'SET_PREFERRED_STYLE'; payload: CardStyle }
  | { type: 'LOAD_PROFILE'; payload: UserProfile }
  | { type: 'LOGOUT' };

const UserContext = createContext<UserState & {
  dispatch: React.Dispatch<UserAction>;
  setMode: (mode: UserMode) => void;
  setNickname: (name: string) => void;
  logout: () => void;
} | null>(null);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_MODE': {
      const updated = {
        ...state.profile!,
        mode: action.payload,
      };
      localStorage.setItem('tnw_user_profile', JSON.stringify(updated));
      return { ...state, profile: updated };
    }
    case 'SET_NICKNAME': {
      const updated = {
        ...state.profile!,
        nickname: action.payload,
      };
      localStorage.setItem('tnw_user_profile', JSON.stringify(updated));
      return { ...state, profile: updated };
    }
    case 'SET_PREFERRED_STYLE': {
      const updated = {
        ...state.profile!,
        preferredCardStyle: action.payload,
      };
      localStorage.setItem('tnw_user_profile', JSON.stringify(updated));
      return { ...state, profile: updated };
    }
    case 'LOAD_PROFILE':
      return { ...state, profile: action.payload, isLoading: false };
    case 'LOGOUT':
      localStorage.removeItem('tnw_user_profile');
      return { ...state, profile: null, isLoading: false };
    default:
      return state;
  }
}

const initialState: UserState = {
  profile: null,
  isLoading: true,
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tnw_user_profile');
      if (stored) {
        const profile = JSON.parse(stored);
        dispatch({ type: 'LOAD_PROFILE', payload: profile });
      } else {
        dispatch({ type: 'LOAD_PROFILE', payload: null as any });
      }
    } catch {
      dispatch({ type: 'LOAD_PROFILE', payload: null as any });
    }
  }, []);

  const setMode = (mode: UserMode) => {
    if (state.profile) {
      dispatch({ type: 'SET_MODE', payload: mode });
    } else {
      const newProfile: UserProfile = {
        id: generateId(),
        nickname: mode === 'student' ? '论文失联人员' : '低电量打工人',
        mode,
        createdAt: new Date().toISOString(),
        preferredCardStyle: 'official',
      };
      localStorage.setItem('tnw_user_profile', JSON.stringify(newProfile));
      dispatch({ type: 'LOAD_PROFILE', payload: newProfile });
    }
  };

  const setNickname = (name: string) => dispatch({ type: 'SET_NICKNAME', payload: name });
  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <UserContext.Provider value={{ ...state, dispatch, setMode, setNickname, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserStore() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserStore must be used within UserProvider');
  return context;
}
