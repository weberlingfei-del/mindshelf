import React, { useState, useEffect, useMemo } from 'react';
import { Book, Note, ViewState, User } from './types';
import Sidebar from './components/Sidebar';
import BookShelf from './components/BookShelf';
import NoteEditor from './components/NoteEditor';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';

const DEFAULT_BOOKS: Book[] = [
  { id: '1', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&h=300', progress: 45 },
  { id: '2', title: 'Atomic Habits', author: 'James Clear', coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=200&h=300', progress: 100 },
  { id: '3', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', coverUrl: 'https://images.unsplash.com/photo-1543005814-14b24e82ffbb?auto=format&fit=crop&q=80&w=200&h=300', progress: 15 },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('onboarding');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>(DEFAULT_BOOKS);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [hasLoadedUserData, setHasLoadedUserData] = useState(false);

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

  useEffect(() => {
    if (currentUser) {
      setHasLoadedUserData(false);
      const savedBooks = localStorage.getItem(`mindshelf_books_${currentUser.id}`);
      const savedNotes = localStorage.getItem(`mindshelf_notes_${currentUser.id}`);
      try {
        setBooks(savedBooks ? JSON.parse(savedBooks) : DEFAULT_BOOKS);
        setNotes(savedNotes ? JSON.parse(savedNotes) : []);
      } catch (e) {
        setBooks(DEFAULT_BOOKS);
        setNotes([]);
      }
      setHasLoadedUserData(true);
    } else {
      setHasLoadedUserData(false);
      setBooks(DEFAULT_BOOKS);
      setNotes([]);
    }
  }, [currentUser]);

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
    return <div className="h-screen flex items-center justify-center bg-zinc-50 font-medium text-zinc-400">Loading MindShelf...</div>;
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
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
            <p className="text-lg">Select a title from your shelf to begin.</p>
            <button 
              onClick={() => setView('shelf')}
              className="mt-6 px-6 py-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-all shadow-md"
            >
              Back to Library
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;