
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock auth logic
    const user = INITIAL_USERS.find(u => u.username === username);
    if (user && password === 'password') { // Simple mock password for demo
      onLogin(user);
    } else {
      setError('Invalid username or password (hint: use "admin" or "nurse" with password "password")');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <i className="fa-solid fa-droplet text-red-600 text-4xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">HemaMatch</h1>
            <p className="text-slate-500 mt-2">Hospital Blood Bank Portal</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Staff Username</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50/50 transition-all"
                  placeholder="e.g. jmuthoni"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]"
            >
              Sign In to Dashboard
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Confidential: Restricted access for authorized medical personnel only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
