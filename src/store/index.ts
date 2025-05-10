import { create } from 'zustand';
import { User, Conversation, Message, UserPreferences } from '../types';

interface AppState {
  user: User | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  
  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addConversation: (type: 'tutor' | 'summarizer' | 'writer' | 'questions') => string;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  deleteConversation: (conversationId: string) => void;
}

const STORAGE_KEY = 'studyai_app_state';

function loadState(): Partial<AppState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (parsed.conversations) {
        parsed.conversations = parsed.conversations.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
        }));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }
  return {};
}

const useStore = create<AppState>((set, get) => {
  // Initialize theme from localStorage or default to system preference
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // Apply theme to document
  document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  
  // Hydrate from localStorage
  const initialState = loadState();
  return {
    user: initialState.user || null,
    conversations: initialState.conversations || [],
    activeConversationId: initialState.activeConversationId || null,
    isLoading: false,
    error: null,
    theme: initialTheme,
    
    setUser: (user) => set({ user }),
    
    setTheme: (theme) => {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
      set({ theme });
    },
    
    addConversation: (type) => {
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        messages: [],
        title: `New ${type} conversation`,
        createdAt: new Date(),
        updatedAt: new Date(),
        type
      };
      
      set((state) => ({
        conversations: [...state.conversations, newConversation],
        activeConversationId: newConversation.id
      }));
      
      return newConversation.id;
    },
    
    setActiveConversation: (id) => set({ activeConversationId: id }),
    
    addMessage: (conversationId, messageData) => {
      const message: Message = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        ...messageData
      };
      
      set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv.id === conversationId) {
            // Update conversation title based on first user message if title is default
            let title = conv.title;
            if (
              conv.title.startsWith('New') && 
              messageData.role === 'user' && 
              conv.messages.length === 0
            ) {
              title = messageData.content.substring(0, 30) + (messageData.content.length > 30 ? '...' : '');
            }
            
            return {
              ...conv,
              messages: [...conv.messages, message],
              updatedAt: new Date(),
              title
            };
          }
          return conv;
        })
      }));
    },
    
    updateConversationTitle: (conversationId, title) => {
      set((state) => ({
        conversations: state.conversations.map((conv) => 
          conv.id === conversationId ? { ...conv, title } : conv
        )
      }));
    },
    
    deleteConversation: (conversationId) => {
      set((state) => ({
        conversations: state.conversations.filter((conv) => conv.id !== conversationId),
        activeConversationId: 
          state.activeConversationId === conversationId
            ? (state.conversations.length > 1 
                ? state.conversations.find(c => c.id !== conversationId)?.id ?? null 
                : null)
            : state.activeConversationId
      }));
    }
  };

  // Subscribe to changes and persist to localStorage
  const unsub = useStore.subscribe((state) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          conversations: state.conversations,
          activeConversationId: state.activeConversationId,
          user: state.user,
        })
      );
    } catch (e) {
      console.error('Failed to persist state', e);
    }
  });
});

export default useStore;