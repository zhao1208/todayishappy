import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, ReactNode } from 'react';
import type { UserMode, UserProfile, UserRole } from '../types/user';
import type { UserAccount, UserSession } from '../types/auth';
import type { CardStyle } from '../types/card';

/* ─────────── localStorage keys ─────────── */
const ACCOUNTS_KEY = 'tnw_accounts';
const SESSION_KEY = 'tnw_session';
const LEGACY_PROFILE_KEY = 'tnw_user_profile'; // for migration

/* ─────────── helpers ─────────── */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function hashPassword(password: string): string {
  // Simple hash for MVP - NOT production secure
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/* ─────────── storage helpers ─────────── */
function loadAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: UserAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function loadSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: UserSession = JSON.parse(raw);
    // Check expiry
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function saveSession(session: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/* ─────────── migrate legacy profile ─────────── */
function migrateLegacyProfile(accounts: UserAccount[]): UserAccount[] {
  try {
    const legacyRaw = localStorage.getItem(LEGACY_PROFILE_KEY);
    if (!legacyRaw) return accounts;
    const legacy = JSON.parse(legacyRaw);
    if (!legacy || !legacy.id) return accounts;

    // Check if already migrated
    if (accounts.some(a => a.id === legacy.id)) return accounts;

    const migrated: UserAccount = {
      id: legacy.id,
      username: 'user_' + legacy.id.substring(0, 6),
      passwordHash: hashPassword('123456'),
      role: accounts.length === 0 ? 'admin' : 'user',
      nickname: legacy.nickname || '用户',
      mode: legacy.mode || null,
      preferredCardStyle: legacy.preferredCardStyle || 'official',
      createdAt: legacy.createdAt || new Date().toISOString(),
    };

    const updated = [...accounts, migrated];
    saveAccounts(updated);

    // Auto-login as migrated user
    const session: UserSession = {
      userId: migrated.id,
      username: migrated.username,
      role: migrated.role,
      token: generateToken(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    saveSession(session);

    return updated;
  } catch {
    return accounts;
  }
}

/* ─────────── state & actions ─────────── */
interface UserState {
  session: UserSession | null;
  accounts: UserAccount[];
  isLoading: boolean;
}

type UserAction =
  | { type: 'LOGIN'; payload: UserSession }
  | { type: 'LOGOUT' }
  | { type: 'LOAD'; payload: { session: UserSession | null; accounts: UserAccount[] } }
  | { type: 'UPDATE_ACCOUNT'; payload: UserAccount };

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, session: action.payload };
    case 'LOGOUT':
      localStorage.removeItem(SESSION_KEY);
      return { ...state, session: null };
    case 'LOAD':
      return {
        ...state,
        session: action.payload.session,
        accounts: action.payload.accounts,
        isLoading: false,
      };
    case 'UPDATE_ACCOUNT': {
      const updated = state.accounts.map(a =>
        a.id === action.payload.id ? action.payload : a
      );
      saveAccounts(updated);
      return { ...state, accounts: updated };
    }
    default:
      return state;
  }
}

const initialState: UserState = {
  session: null,
  accounts: [],
  isLoading: true,
};

/* ─────────── context ─────────── */
const UserContext = createContext<UserState & {
  isLoggedIn: boolean;
  isAdmin: boolean;
  hasSelectedMode: boolean;
  profile: UserProfile | null;
  login: (username: string, password: string) => { success: boolean; message: string };
  register: (username: string, password: string, confirmPassword: string) => { success: boolean; message: string };
  logout: () => void;
  setMode: (mode: UserMode) => void;
  setNickname: (name: string) => void;
  setPreferredStyle: (style: CardStyle) => void;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Init: load session & accounts
  useEffect(() => {
    let accounts = loadAccounts();
    accounts = migrateLegacyProfile(accounts);
    const session = loadSession();
    dispatch({ type: 'LOAD', payload: { session, accounts } });
  }, []);

  // Derived values
  const isLoggedIn = !!state.session;
  const isAdmin = state.session?.role === 'admin';

  const currentAccount = useMemo(() => {
    if (!state.session) return null;
    return state.accounts.find(a => a.id === state.session!.userId) || null;
  }, [state.session, state.accounts]);

  const hasSelectedMode = !!currentAccount?.mode;

  const profile: UserProfile | null = useMemo(() => {
    if (!currentAccount) return null;
    return {
      id: currentAccount.id,
      nickname: currentAccount.nickname,
      mode: currentAccount.mode || 'student',
      createdAt: currentAccount.createdAt,
      preferredCardStyle: currentAccount.preferredCardStyle,
      role: currentAccount.role,
    };
  }, [currentAccount]);

  // Auth methods
  const login = useCallback((username: string, password: string) => {
    const accounts = loadAccounts();
    const account = accounts.find(
      a => a.username === username && a.passwordHash === hashPassword(password)
    );
    if (!account) {
      return { success: false, message: '用户名或密码错误' };
    }
    const session: UserSession = {
      userId: account.id,
      username: account.username,
      role: account.role,
      token: generateToken(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    saveSession(session);
    dispatch({ type: 'LOGIN', payload: session });
    return { success: true, message: '登录成功' };
  }, []);

  const register = useCallback((username: string, password: string, confirmPassword: string) => {
    if (!username || username.length < 3) {
      return { success: false, message: '用户名至少3个字符' };
    }
    if (!password || password.length < 6) {
      return { success: false, message: '密码至少6个字符' };
    }
    if (password !== confirmPassword) {
      return { success: false, message: '两次密码不一致' };
    }
    const accounts = loadAccounts();
    if (accounts.some(a => a.username === username)) {
      return { success: false, message: '用户名已存在' };
    }
    // First user becomes admin
    const isFirstUser = accounts.length === 0;
    const newAccount: UserAccount = {
      id: generateId(),
      username,
      passwordHash: hashPassword(password),
      role: isFirstUser ? 'admin' : 'user',
      nickname: username,
      mode: null,
      preferredCardStyle: 'official',
      createdAt: new Date().toISOString(),
    };
    const updated = [...accounts, newAccount];
    saveAccounts(updated);

    // Auto-login after register
    const session: UserSession = {
      userId: newAccount.id,
      username: newAccount.username,
      role: newAccount.role,
      token: generateToken(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    saveSession(session);
    dispatch({ type: 'LOGIN', payload: session });
    dispatch({ type: 'LOAD', payload: { session, accounts: updated } });

    return {
      success: true,
      message: isFirstUser ? '注册成功！你是第一个用户，已自动设为管理员' : '注册成功',
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Profile update methods (update the account)
  const setMode = useCallback((mode: UserMode) => {
    if (!currentAccount) return;
    const updated = { ...currentAccount, mode };
    saveAccounts(state.accounts.map(a => a.id === updated.id ? updated : a));
    dispatch({ type: 'UPDATE_ACCOUNT', payload: updated });
  }, [currentAccount, state.accounts]);

  const setNickname = useCallback((name: string) => {
    if (!currentAccount) return;
    const updated = { ...currentAccount, nickname: name };
    saveAccounts(state.accounts.map(a => a.id === updated.id ? updated : a));
    dispatch({ type: 'UPDATE_ACCOUNT', payload: updated });
  }, [currentAccount, state.accounts]);

  const setPreferredStyle = useCallback((style: CardStyle) => {
    if (!currentAccount) return;
    const updated = { ...currentAccount, preferredCardStyle: style };
    saveAccounts(state.accounts.map(a => a.id === updated.id ? updated : a));
    dispatch({ type: 'UPDATE_ACCOUNT', payload: updated });
  }, [currentAccount, state.accounts]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        isLoggedIn,
        isAdmin,
        hasSelectedMode,
        profile,
        login,
        register,
        logout,
        setMode,
        setNickname,
        setPreferredStyle,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserStore() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserStore must be used within UserProvider');
  return context;
}
