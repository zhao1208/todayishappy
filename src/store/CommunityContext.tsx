import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CommunityPost, PostInteractions, InteractionType } from '../types/community';
import { samplePosts } from '../data/community-themes';

interface CommunityState {
  posts: CommunityPost[];
  myInteractions: Record<string, InteractionType[]>;
  isLoading: boolean;
}

type CommunityAction =
  | { type: 'SET_POSTS'; payload: CommunityPost[] }
  | { type: 'SET_INTERACTIONS'; payload: Record<string, InteractionType[]> }
  | { type: 'ADD_POST'; payload: CommunityPost }
  | { type: 'INTERACT'; payload: { postId: string; type: InteractionType } }
  | { type: 'UNINTERACT'; payload: { postId: string; type: InteractionType } };

const CommunityContext = createContext<CommunityState & {
  addPost: (post: CommunityPost) => void;
  interact: (postId: string, type: InteractionType) => void;
  getPostsByTheme: (themeId: string) => CommunityPost[];
  hasInteracted: (postId: string, type: InteractionType) => boolean;
} | null>(null);

function communityReducer(state: CommunityState, action: CommunityAction): CommunityState {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload, isLoading: false };
    case 'SET_INTERACTIONS':
      return { ...state, myInteractions: action.payload };
    case 'ADD_POST': {
      const newPosts = [action.payload, ...state.posts];
      localStorage.setItem('tnw_community_posts', JSON.stringify(newPosts.slice(0, 100)));
      return { ...state, posts: newPosts };
    }
    case 'INTERACT': {
      const { postId, type } = action.payload;
      const newPosts = state.posts.map(p =>
        p.id === postId
          ? { ...p, interactions: { ...p.interactions, [type]: p.interactions[type] + 1 } }
          : p
      );
      const newMyInteractions = {
        ...state.myInteractions,
        [postId]: [...(state.myInteractions[postId] || []), type],
      };
      localStorage.setItem('tnw_community_posts', JSON.stringify(newPosts.slice(0, 100)));
      localStorage.setItem('tnw_my_interactions', JSON.stringify(newMyInteractions));
      return { ...state, posts: newPosts, myInteractions: newMyInteractions };
    }
    case 'UNINTERACT': {
      const { postId, type } = action.payload;
      const newPosts = state.posts.map(p =>
        p.id === postId
          ? { ...p, interactions: { ...p.interactions, [type]: Math.max(0, p.interactions[type] - 1) } }
          : p
      );
      const newMyInteractions = {
        ...state.myInteractions,
        [postId]: (state.myInteractions[postId] || []).filter(t => t !== type),
      };
      localStorage.setItem('tnw_community_posts', JSON.stringify(newPosts.slice(0, 100)));
      localStorage.setItem('tnw_my_interactions', JSON.stringify(newMyInteractions));
      return { ...state, posts: newPosts, myInteractions: newMyInteractions };
    }
    default:
      return state;
  }
}

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(communityReducer, {
    posts: [],
    myInteractions: {},
    isLoading: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tnw_community_posts');
      const interactionsStored = localStorage.getItem('tnw_my_interactions');
      let posts = stored ? JSON.parse(stored) : samplePosts;
      const myInteractions = interactionsStored ? JSON.parse(interactionsStored) : {};
      dispatch({ type: 'SET_POSTS', payload: posts });
      dispatch({ type: 'SET_INTERACTIONS', payload: myInteractions });
    } catch {
      dispatch({ type: 'SET_POSTS', payload: samplePosts });
    }
  }, []);

  const addPost = (post: CommunityPost) => dispatch({ type: 'ADD_POST', payload: post });
  const interact = (postId: string, type: InteractionType) => dispatch({ type: 'INTERACT', payload: { postId, type } });
  const getPostsByTheme = (themeId: string) => state.posts.filter(p => p.themeId === themeId);
  const hasInteracted = (postId: string, type: InteractionType) => (state.myInteractions[postId] || []).includes(type);

  return (
    <CommunityContext.Provider value={{ ...state, addPost, interact, getPostsByTheme, hasInteracted }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunityStore() {
  const context = useContext(CommunityContext);
  if (!context) throw new Error('useCommunityStore must be used within CommunityProvider');
  return context;
}
