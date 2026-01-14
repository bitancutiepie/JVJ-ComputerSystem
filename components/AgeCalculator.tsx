import React, { useState } from 'react';
import { Calendar, User } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<number | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;
    const today = new Date();
    const birth = new Date(birthDate);
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block ml-1">Select Date of Birth</label>
        <div className="relative">
          <input
            type="date"
            className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
      </div>
      
      <button
        onClick={calculateAge}
        className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-black shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
      >
        <Calendar className="w-5 h-5" /> Calculate Age Now
      </button>

      {age !== null && (
        <div className="text-center p-10 bg-blue-50 rounded-[2.5rem] border-2 border-blue-100 animate-slide-down shadow-inner">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">{age}</div>
          <div className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em]">Years of Age</div>
        </div>
      )}
    </div>
  );
};
