import React, { useState } from 'react';
import { Book } from '../types';

interface BookShelfProps {
  books: Book[];
  onSelectBook: (id: string) => void;
  onAddBook: (book: Book) => void;
}

const BookShelf: React.FC<BookShelfProps> = ({ books, onSelectBook, onAddBook }) => {
  const [showAddModal, setShowAddModal] = useState(false);
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

  return (
    <div className="p-10 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Your Library</h2>
          <p className="text-zinc-500 mt-2 font-medium">Curating your intellectual journey, one page at a time.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-full hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 transform hover:-translate-y-0.5 active:scale-95 text-sm uppercase tracking-widest"
        >
          Add New Title
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {books.map(book => (
          <div 
            key={book.id} 
            onClick={() => onSelectBook(book.id)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-lg border border-zinc-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-zinc-300 group-hover:-translate-y-2">
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Open Notes</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-bold text-zinc-900 line-clamp-1 group-hover:text-zinc-500 transition-colors tracking-tight text-lg">{book.title}</h3>
              <p className="text-sm text-zinc-400 font-medium">{book.author}</p>
              <div className="mt-4 w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-zinc-900 h-full transition-all duration-[1500ms] ease-out" 
                  style={{ width: `${book.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black mb-2 text-zinc-900">Add Book</h3>
            <p className="text-zinc-500 mb-8 text-sm font-medium">Enter the details of your new reading venture.</p>
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">Book Title</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newBook.title}
                  onChange={e => setNewBook({...newBook, title: e.target.value})}
                  className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300"
                  placeholder="e.g. Sapiens"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">Author</label>
                <input 
                  type="text" 
                  value={newBook.author}
                  onChange={e => setNewBook({...newBook, author: e.target.value})}
                  className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300"
                  placeholder="e.g. Yuval Noah Harari"
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