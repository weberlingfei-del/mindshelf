import React from 'react';
import { Book, ViewState, User } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  books: Book[];
  selectedBookId: string | null;
  onSelectBook: (id: string) => void;
  onDeleteBook: (id: string) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  books, 
  selectedBookId, 
  onSelectBook, 
  onDeleteBook,
  user,
  onLogout
}) => {
  return (
    <aside className="w-64 bg-zinc-100 border-r border-zinc-200 flex flex-col h-full shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <span className="w-8 h-8 bg-zinc-900 text-white rounded flex items-center justify-center text-xs font-black">MS</span>
          MindShelf
        </h1>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <button
          onClick={() => setView('shelf')}
          className={`w-full flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
            currentView === 'shelf' ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
          }`}
        >
          <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          My Library
        </button>

        <div className="pt-6 pb-2">
          <p className="px-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recent Titles</p>
        </div>

        {books.map(book => (
          <div key={book.id} className="group flex items-center gap-1">
            <button
              onClick={() => onSelectBook(book.id)}
              className={`flex-1 text-left px-3 py-2 text-sm font-medium rounded-lg transition-all truncate ${
                selectedBookId === book.id && currentView === 'editor'
                  ? 'bg-white border border-zinc-200 shadow-sm text-zinc-900'
                  : 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {book.title}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if(window.confirm(`Delete "${book.title}" and all its notes?`)) {
                  onDeleteBook(book.id);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Book"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-200 bg-zinc-50/50">
        <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-900 truncate">{user.name}</p>
              <p className="text-[9px] text-zinc-400 truncate uppercase tracking-tighter">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
            title="Sign Out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;