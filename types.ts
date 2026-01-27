
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  progress: number; // 0 to 100
}

export interface Note {
  id: string;
  bookId: string;
  content: string;
  createdAt: number;
  tags: string[];
  aiInsight?: string;
}

export type ViewState = 'shelf' | 'editor' | 'onboarding';
