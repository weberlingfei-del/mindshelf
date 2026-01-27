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
      onAddNote(content, "AI refinement failed. Check your network connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white max-w-5xl mx-auto w-full shadow-2xl shadow-zinc-200/50 border-x border-zinc-100">
      <div className="px-10 py-8 border-b border-zinc-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <img src={book.coverUrl} className="w-14 h-20 object-cover rounded-lg shadow-md border border-zinc-100" alt={book.title} />
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{book.title}</h2>
            <p className="text-sm text-zinc-400 font-semibold uppercase tracking-widest mt-1">{book.author}</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
          {notes.length} Entries
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-12 space-y-16">
        {notes.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-zinc-300 text-center max-w-sm mx-auto">
            <svg className="w-16 h-16 mb-6 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-xl font-serif italic">Your digital garden is empty. Plant your first seed of insight below.</p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="group animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
                  {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => onDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="pl-6 border-l-2 border-zinc-100 group-hover:border-zinc-900 transition-colors duration-500">
                <p className="font-serif text-xl leading-relaxed text-zinc-800 whitespace-pre-wrap">{note.content}</p>
                {note.aiInsight && (
                  <div className="mt-8 p-6 bg-zinc-50 border-l-4 border-zinc-900 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-900 bg-zinc-200 px-3 py-1 rounded-md">MindShelf Insight</span>
                    </div>
                    <p className="text-base italic text-zinc-600 leading-relaxed font-serif">{note.aiInsight}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 bg-white border-t border-zinc-50 sticky bottom-0">
        <form onSubmit={handleSubmit} className="relative group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Capture an insight, a question, or a favorite quote..."
            className="w-full p-6 pr-40 bg-zinc-50 border border-zinc-200 rounded-3xl focus:ring-8 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none focus:bg-white transition-all min-h-[160px] resize-none font-serif text-xl placeholder:text-zinc-300 shadow-inner"
          />
          <div className="absolute bottom-6 right-6 flex gap-3">
            <button
              type="button"
              onClick={handleAIInsight}
              disabled={!content.trim() || isGenerating}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                isGenerating 
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 hover:shadow-md'
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Refine
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-8 py-2.5 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all shadow-xl shadow-zinc-900/10 active:scale-95"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditor;