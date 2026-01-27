import React, { useState, useEffect, useMemo } from 'react';
import { Book, Note, ViewState, User } from './types';
import Sidebar from './components/Sidebar';
import BookShelf from './components/BookShelf';
import NoteEditor from './components/NoteEditor';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';

const DEFAULT_BOOKS: Book[] = [
  { id: '1', title: 'Deep Work', author: 'Cal Newport', coverUrl: 'https://picsum.photos/seed/deepwork/200/300', progress: 60 },
  { id: '2', title: 'Atomic Habits', author: 'James Clear', coverUrl: 'https://picsum.photos/seed/atomic/200/300', progress: 100 },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('onboarding');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>(DEFAULT_BOOKS);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [hasLoadedUserData, setHasLoadedUserData] = useState(false);

  // 1. 初始化用户 Session
  useEffect(() => {
    const savedSession = localStorage.getItem('mindshelf_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        setCurrentUser(user);
        setView('shelf');
      } catch (e) {
        localStorage.removeItem('mindshelf_session');
      }
    }
    setIsAppInitialized(true);
  }, []);

  // 2. 当用户变更时，加载该用户的特定数据
  useEffect(() => {
    if (currentUser) {
      setHasLoadedUserData(false);
      
      const savedBooks = localStorage.getItem(`mindshelf_books_${currentUser.id}`);
      const savedNotes = localStorage.getItem(`mindshelf_notes_${currentUser.id}`);
      
      try {
        setBooks(savedBooks ? JSON.parse(savedBooks) : DEFAULT_BOOKS);
        setNotes(savedNotes ? JSON.parse(savedNotes) : []);
      } catch (e) {
        console.error("Failed to load user data", e);
        setBooks(DEFAULT_BOOKS);
        setNotes([]);
      }
      
      // 标记数据加载完成，允许后续的写入操作
      setHasLoadedUserData(true);
    } else {
      setHasLoadedUserData(false);
      setBooks(DEFAULT_BOOKS);
      setNotes([]);
    }
  }, [currentUser]);

  // 3. 只有在数据加载完成后，才监听状态变化并同步到 LocalStorage
  useEffect(() => {
    if (currentUser && hasLoadedUserData) {
      localStorage.setItem(`mindshelf_books_${currentUser.id}`, JSON.stringify(books));
    }
  }, [books, currentUser, hasLoadedUserData]);

  useEffect(() => {
    if (currentUser && hasLoadedUserData) {
      localStorage.setItem(`mindshelf_notes_${currentUser.id}`, JSON.stringify(notes));
    }
  }, [notes, currentUser, hasLoadedUserData]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('mindshelf_session', JSON.stringify(user));
    setView('shelf');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mindshelf_session');
    setView('onboarding');
    setSelectedBookId(null);
  };

  const activeBook = useMemo(() => 
    books.find(b => b.id === selectedBookId), 
  [books, selectedBookId]);

  const activeNotes = useMemo(() => 
    notes.filter(n => n.bookId === selectedBookId),
  [notes, selectedBookId]);

  const handleSelectBook = (id: string) => {
    setSelectedBookId(id);
    setView('editor');
  };

  const handleAddBook = (book: Book) => {
    setBooks(prev => [book, ...prev]);
  };

  const handleAddNote = (content: string, aiInsight?: string) => {
    if (!selectedBookId || !currentUser) return;
    const newNote: Note = {
      id: Date.now().toString(),
      bookId: selectedBookId,
      content,
      createdAt: Date.now(),
      tags: [],
      aiInsight
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  if (!isAppInitialized) {
    return <div className="h-screen flex items-center justify-center bg-zinc-50 font-medium text-zinc-400">Loading Application...</div>;
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        books={books} 
        selectedBookId={selectedBookId}
        onSelectBook={handleSelectBook}
        user={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {view === 'onboarding' && <Onboarding onStart={() => setView('shelf')} />}
        
        {view === 'shelf' && (
          <BookShelf 
            books={books} 
            onSelectBook={handleSelectBook} 
            onAddBook={handleAddBook}
          />
        )}
        
        {view === 'editor' && activeBook && (
          <NoteEditor 
            book={activeBook} 
            notes={activeNotes} 
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {!activeBook && view === 'editor' && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <p>Please select a book from the shelf to start writing notes.</p>
            <button 
              onClick={() => setView('shelf')}
              className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Go to Shelf
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;