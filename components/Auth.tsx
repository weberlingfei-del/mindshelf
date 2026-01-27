import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const storedUsersJson = localStorage.getItem('mindshelf_users');
    let storedUsers = [];
    try {
      storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    } catch (err) {
      storedUsers = [];
    }

    if (isLogin) {
      const user = storedUsers.find((u: any) => u.email === cleanEmail && u.password === password);
      if (user) {
        onLogin({ id: user.id, name: user.name, email: user.email });
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } else {
      if (!cleanEmail || !password) {
        setError('Please fill in all required fields.');
        return;
      }
      if (storedUsers.some((u: any) => u.email === cleanEmail)) {
        setError('This email is already registered. Please sign in instead.');
        return;
      }
      const newUser = { 
        id: Date.now().toString(), 
        name: name.trim() || 'Reader', 
        email: cleanEmail, 
        password 
      };
      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem('mindshelf_users', JSON.stringify(updatedUsers));
      onLogin({ id: newUser.id, name: newUser.name, email: newUser.email });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4 font-sans text-zinc-900">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl shadow-zinc-200/50 border border-zinc-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-zinc-900 text-white rounded-2xl mb-6 shadow-xl shadow-zinc-900/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            {isLogin ? 'Sign in to continue your reading journey' : 'Start building your personal knowledge base'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300"
                placeholder="Alex Johnson"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300"
              placeholder="alex@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-[0.99] text-sm uppercase tracking-widest"
          >
            {isLogin ? 'Sign In' : 'Get Started'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-zinc-50">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors"
          >
            {isLogin ? "New to MindShelf? Create account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;