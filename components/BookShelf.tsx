
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
      coverUrl: `https://picsum.photos/seed/${Date.now()}/200/300`,
      progress: 0
    };
    onAddBook(book);
    setNewBook({ title: '', author: '' });
    setShowAddModal(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Your Reading Shelf</h2>
          <p className="text-zinc-500 mt-2">Manage your current reads and collection.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 bg-zinc-900 text-white font-medium rounded-full hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Add New Book
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {books.map(book => (
          <div 
            key={book.id} 
            onClick={() => onSelectBook(book.id)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md transition-all group-hover:shadow-2xl group-hover:-translate-y-1">
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <p className="text-xs font-semibold uppercase tracking-wider">Continue Reading</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-zinc-900 line-clamp-1 group-hover:text-zinc-600 transition-colors">{book.title}</h3>
              <p className="text-sm text-zinc-500">{book.author}</p>
              <div className="mt-2 w-full bg-zinc-200 h-1 rounded-full overflow-hidden">
                <div className="bg-zinc-900 h-full transition-all duration-1000" style={{ width: `${book.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Add a New Book</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Book Title</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newBook.title}
                  onChange={e => setNewBook({...newBook, title: e.target.value})}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                  placeholder="e.g. Sapiens"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Author</label>
                <input 
                  type="text" 
                  value={newBook.author}
                  onChange={e => setNewBook({...newBook, author: e.target.value})}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                  placeholder="e.g. Yuval Noah Harari"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Save Book
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
