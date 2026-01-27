
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

    // For this MVP, we use localStorage to mock a backend database of users
    const storedUsers = JSON.parse(localStorage.getItem('mindshelf_users') || '[]');

    if (isLogin) {
      const user = storedUsers.find((u: any) => u.email === email && u.password === password);
      if (user) {
        onLogin({ id: user.id, name: user.name, email: user.email });
      } else {
        setError('Invalid email or password.');
      }
    } else {
      if (storedUsers.some((u: any) => u.email === email)) {
        setError('Email already exists.');
        return;
      }
      const newUser = { id: Date.now().toString(), name, email, password };
      storedUsers.push(newUser);
      localStorage.setItem('mindshelf_users', JSON.stringify(storedUsers));
      onLogin({ id: newUser.id, name: newUser.name, email: newUser.email });
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-50 flex items-center justify-center p-4 z-[100]">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-100 p-10 relative overflow-hidden">
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-6">MS</div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-zinc-500 mt-2">Enter your details to continue to MindShelf</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5 ml-1">Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5 ml-1">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5 ml-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium ml-1">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl mt-4"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-zinc-900 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
