import React from 'react';

interface OnboardingProps {
  onStart: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white overflow-y-auto">
      <div className="max-w-3xl w-full space-y-16">
        <div className="text-center">
          <div className="inline-block px-4 py-1.5 bg-zinc-100 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-zinc-500 mb-8">
            Digital Garden MVP
          </div>
          <h1 className="text-6xl font-black text-zinc-900 tracking-tight mb-6">MindShelf</h1>
          <p className="text-2xl text-zinc-400 leading-relaxed font-serif italic max-w-xl mx-auto">
            "We read to know we are not alone."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 flex items-center gap-3">
              <span className="w-6 h-6 bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center">01</span>
              The Mission
            </h2>
            <p className="text-zinc-500 leading-relaxed font-medium">
              Designed for lifelong learners who want to transform passive consumption into an active, refined knowledge system.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 flex items-center gap-3">
              <span className="w-6 h-6 bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center">02</span>
              AI Assistance
            </h2>
            <p className="text-zinc-500 leading-relaxed font-medium">
              Leverage Gemini 3 Flash to refine your thoughts, extract core insights, and connect disparate ideas seamlessly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 flex items-center gap-3">
              <span className="w-6 h-6 bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center">03</span>
              Personal Library
            </h2>
            <p className="text-zinc-500 leading-relaxed font-medium">
              Track your reading progress and maintain a chronological stream of insights for every book in your collection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 flex items-center gap-3">
              <span className="w-6 h-6 bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center">04</span>
              Privacy First
            </h2>
            <p className="text-zinc-500 leading-relaxed font-medium">
              Everything is stored locally in your browser. Fast, secure, and entirely under your control.
            </p>
          </section>
        </div>

        <div className="flex flex-col items-center justify-center pt-8">
          <button 
            onClick={onStart}
            className="px-12 py-5 bg-zinc-900 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-900/20 transform hover:-translate-y-1 active:scale-95 tracking-widest uppercase text-sm"
          >
            Start Your Library
          </button>
          <p className="mt-6 text-zinc-400 text-xs font-medium uppercase tracking-widest">Free & Forever Personal</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;