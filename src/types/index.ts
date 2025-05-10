export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  displayName?: string; // Optional, for Firebase compatibility
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'file';
  fileName?: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
  type: 'tutor' | 'summarizer' | 'writer' | 'questions';
}

export interface StudySession {
  id: string;
  title: string;
  duration: number; // in minutes
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  topics: string[];
}

export interface GeminiResponse {
  text: string;
  error?: string;
}