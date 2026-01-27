
import React, { useState } from 'react';
import { Book, Note } from '../types';
import { generateAIInsight } from '../services/gemini';

interface NoteEditorProps {
  book: Book;
  notes: Note[];
  onAddNote: (content: string, aiInsight?: string) => void;
  onDeleteNote: (id: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ book, notes, onAddNote, onDeleteNote }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddNote(content);
    setContent('');
  };

  const handleAIInsight = async () => {
    if (!content.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const insight = await generateAIInsight(content, book.title);
      onAddNote(content, insight);
      setContent('');
    } catch (err) {
      console.error(err);
      onAddNote(content, "AI insight failed to generate. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white max-w-4xl mx-auto w-full shadow-lg border-x border-zinc-100">
      {/* Header */}
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <img src={book.coverUrl} className="w-12 h-16 object-cover rounded shadow-sm" alt={book.title} />
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{book.title}</h2>
            <p className="text-sm text-zinc-500">{book.author}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-medium text-zinc-600">
            {notes.length} Notes
          </div>
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12">
        {notes.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-400 text-center">
            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <p>No notes for this book yet. Start writing below!</p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-zinc-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => onDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="font-serif text-lg leading-relaxed text-zinc-800 whitespace-pre-wrap">{note.content}</p>
              
              {note.aiInsight && (
                <div className="mt-4 p-4 bg-zinc-50 border-l-4 border-zinc-900 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 bg-zinc-200 px-2 py-0.5 rounded">AI Refinement</span>
                  </div>
                  <p className="text-sm italic text-zinc-600 leading-relaxed">{note.aiInsight}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Editor Footer */}
      <div className="p-6 bg-white border-t border-zinc-100 sticky bottom-0">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Capture your thoughts, quotes, or questions..."
            className="w-full p-4 pr-32 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 focus:outline-none focus:bg-white transition-all min-h-[120px] resize-none font-serif text-lg"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={handleAIInsight}
              disabled={!content.trim() || isGenerating}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isGenerating 
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refining...
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Refine
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              Post Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditor;
