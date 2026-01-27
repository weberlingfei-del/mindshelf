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

    // 统一处理邮箱，防止空格或大小写导致匹配失败
    const cleanEmail = email.trim().toLowerCase();

    // 读取全局用户数据库
    const storedUsersJson = localStorage.getItem('mindshelf_users');
    let storedUsers = [];
    try {
      storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    } catch (err) {
      storedUsers = [];
    }

    if (isLogin) {
      // 登录逻辑
      const user = storedUsers.find((u: any) => u.email === cleanEmail && u.password === password);
      if (user) {
        onLogin({ id: user.id, name: user.name, email: user.email });
      } else {
        setError('邮箱或密码错误，请检查。');
      }
    } else {
      // 注册逻辑
      if (!cleanEmail || !password) {
        setError('请填写完整的注册信息。');
        return;
      }
      
      if (storedUsers.some((u: any) => u.email === cleanEmail)) {
        setError('该邮箱已被注册，请直接登录。');
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
      
      // 自动登录
      onLogin({ id: newUser.id, name: newUser.name, email: newUser.email });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-zinc-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 text-white rounded-xl mb-4 text-sm font-bold">
            MS
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {isLogin ? '欢迎回来' : '加入 MindShelf'}
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            {isLogin ? '继续你的知识探索之旅' : '开启你的私人知识库'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">姓名</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                placeholder="你的称呼"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">邮箱</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">密码</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-zinc-900 text-white font-bold rounded-lg hover:bg-zinc-800 transition-all shadow-lg active:scale-[0.98]"
          >
            {isLogin ? '登录' : '注册'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
          >
            {isLogin ? "还没有账号？点击注册" : "已有账号？点击登录"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;