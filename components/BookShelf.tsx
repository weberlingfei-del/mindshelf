import React, { useState } from 'react';
import { Book } from '../types';

interface BookShelfProps {
  books: Book[];
  onSelectBook: (id: string) => void;
  onAddBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
}

const BookShelf: React.FC<BookShelfProps> = ({ books, onSelectBook, onAddBook, onDeleteBook }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title) return;
    const book: Book = {
      id: Date.now().toString(),
      title: newBook.title,
      author: newBook.author || 'Unknown Author',
      coverUrl: `https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200&h=300&seed=${Date.now()}`,
      progress: 0
    };
    onAddBook(book);
    setNewBook({ title: '', author: '' });
    setShowAddModal(false);
  };

  const activeDeleteBook = books.find(b => b.id === confirmDeleteId);

  return (
    <div className="p-10 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Your Library</h2>
          <p className="text-zinc-500 mt-2 font-medium">Capture every insight from your reading journey.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-full hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 transform hover:-translate-y-0.5 active:scale-95 text-sm uppercase tracking-widest"
        >
          Add Title
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {books.map(book => (
          <div 
            key={book.id} 
            className="group relative"
          >
            <div 
              onClick={() => onSelectBook(book.id)}
              className="cursor-pointer"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-lg border border-zinc-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-zinc-300 group-hover:-translate-y-2">
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Open Insights</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-bold text-zinc-900 line-clamp-1 group-hover:text-zinc-500 transition-colors tracking-tight text-lg">{book.title}</h3>
                <p className="text-sm text-zinc-400 font-medium">{book.author}</p>
                <div className="mt-4 w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-zinc-900 h-full transition-all duration-[1500ms] ease-out" 
                    style={{ width: `${book.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Delete button on card hover */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDeleteId(book.id);
              }}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-md text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
              title="Delete Title"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl text-center border border-zinc-100">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-2 text-zinc-900 tracking-tight">Delete Title?</h3>
            <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
              This will permanently remove <span className="font-bold text-zinc-900">"{activeDeleteBook?.title}"</span> and all associated reading notes. This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-6 py-3 border border-zinc-200 text-zinc-500 font-bold rounded-xl hover:bg-zinc-50 transition-colors text-sm uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onDeleteBook(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg text-sm uppercase tracking-widest"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-100">
            <h3 className="text-3xl font-black mb-2 text-zinc-900 tracking-tight">Add Title</h3>
            <p className="text-zinc-500 mb-8 text-sm font-medium">Document a new journey in your collection.</p>
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 px-1">Book Title</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newBook.title}
                  onChange={e => setNewBook({...newBook, title: e.target.value})}
                  className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-8 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300 font-medium"
                  placeholder="e.g. Meditations"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 px-1">Author</label>
                <input 
                  type="text" 
                  value={newBook.author}
                  onChange={e => setNewBook({...newBook, author: e.target.value})}
                  className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-8 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300 font-medium"
                  placeholder="e.g. Marcus Aurelius"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-zinc-200 text-zinc-500 font-bold rounded-xl hover:bg-zinc-50 transition-colors text-sm uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg text-sm uppercase tracking-widest"
                >
                  Add Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookShelf;