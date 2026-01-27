
import React, { useState, useEffect, useMemo } from 'react';
import { Book, Note, ViewState, User } from './types';
import Sidebar from './components/Sidebar';
import BookShelf from './components/BookShelf';
import NoteEditor from './components/NoteEditor';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('onboarding');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'Deep Work', author: 'Cal Newport', coverUrl: 'https://picsum.photos/seed/deepwork/200/300', progress: 60 },
    { id: '2', title: 'Atomic Habits', author: 'James Clear', coverUrl: 'https://picsum.photos/seed/atomic/200/300', progress: 100 },
  ]);
  const [notes, setNotes] = useState<Note[]>([]);

  // Auth & Session handling
  useEffect(() => {
    const savedUser = localStorage.getItem('mindshelf_session');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setView('shelf'); // Go straight to shelf if logged in
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('mindshelf_session', JSON.stringify(user));
    setView('shelf');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mindshelf_session');
    setView('onboarding');
  };

  // Load notes from local storage on mount (filtered by user if needed, though for MVP we keep it simple)
  useEffect(() => {
    if (currentUser) {
      const savedNotes = localStorage.getItem(`mindshelf_notes_${currentUser.id}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    }
  }, [currentUser]);

  // Save notes to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`mindshelf_notes_${currentUser.id}`, JSON.stringify(notes));
    }
  }, [notes, currentUser]);

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
            onAddBook={(book) => setBooks([...books, book])}
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
