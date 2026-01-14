import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, these would be validated on a server
    if (username === 'ADMIN' && password === 'NELSON') {
      onLogin(true);
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 relative border border-white">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-50 p-4 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Administrator Login</h2>
          <p className="text-slate-500 text-sm mt-1">Access secure system controls</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Username</label>
            <input
              type="text"
              placeholder="Enter Identity"
              autoFocus
              className={`w-full bg-slate-50 border-2 ${error ? 'border-red-200' : 'border-slate-100'} px-5 py-4 rounded-2xl text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-base placeholder-slate-400`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Security Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full bg-slate-50 border-2 ${error ? 'border-red-200' : 'border-slate-100'} px-5 py-4 rounded-2xl text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-base placeholder-slate-400`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4">
            Verify & Unlock
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs font-bold text-center rounded-xl animate-pulse">
            AUTHENTICATION FAILED
          </div>
        )}
      </div>
    </div>
  );
};