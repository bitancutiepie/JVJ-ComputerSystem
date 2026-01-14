import React, { useState } from 'react';
import { PasswordState } from '../types';
import { Copy, Check, Wand2 } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const [inputs, setInputs] = useState<PasswordState>({
    lastName: '',
    firstName: '',
    number: '',
  });
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!inputs.lastName || !inputs.firstName || !inputs.number) return;
    const formattedLastName = inputs.lastName.charAt(0).toUpperCase() + inputs.lastName.slice(1).toLowerCase();
    const firstWordFirstName = inputs.firstName.trim().split(' ')[0].toLowerCase();
    const password = `${formattedLastName}_${firstWordFirstName}${inputs.number}`;
    setGeneratedPassword(password);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Last Name</label>
          <input
            type="text"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. BITANCOR"
            value={inputs.lastName}
            onChange={(e) => setInputs({ ...inputs, lastName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">First Name</label>
          <input
            type="text"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. JOSHUA"
            value={inputs.firstName}
            onChange={(e) => setInputs({ ...inputs, firstName: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Unique Number</label>
          <input
            type="number"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. 001"
            value={inputs.number}
            onChange={(e) => setInputs({ ...inputs, number: e.target.value })}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
      >
        <Wand2 className="w-5 h-5" /> Generate Secure Password
      </button>

      {generatedPassword && (
        <div className="pt-6 border-t border-slate-100 animate-slide-down">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block text-center">Resulting Password</label>
          <div 
            onClick={handleCopy}
            className="flex items-center justify-between bg-slate-900 rounded-3xl p-6 cursor-pointer hover:bg-slate-800 transition-all group shadow-inner"
          >
            <code className="text-2xl font-mono text-blue-400 font-bold tracking-wider">{generatedPassword}</code>
            <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-all">
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white/50" />}
            </div>
          </div>
          {copied && <p className="text-[10px] text-green-600 mt-3 text-center font-bold tracking-[0.2em] uppercase">Copied to Clipboard</p>}
        </div>
      )}
    </div>
  );
};
