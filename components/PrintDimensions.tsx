import React, { useState } from 'react';
import { Ruler, Maximize } from 'lucide-react';

export const PrintDimensions: React.FC = () => {
  const [dpi, setDpi] = useState(300);
  const sizes = [
    { label: '1 X 1 INCH', w: 1, h: 1 },
    { label: '2 X 2 INCH', w: 2, h: 2 },
    { label: 'PASSPORT SIZE', w: 1.378, h: 1.771 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block ml-1">DPI Resolution Setting</label>
        <div className="relative">
          <input 
            type="number" 
            value={dpi} 
            onChange={(e) => setDpi(Number(e.target.value))}
            className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-extrabold focus:border-blue-500 outline-none text-lg transition-all"
            placeholder="300"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">DPI</div>
        </div>
      </div>

      <div className="space-y-3">
        {sizes.map(size => (
          <div key={size.label} className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl group hover:border-blue-400 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-blue-50 transition-colors">
                <Maximize className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">{size.label}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-blue-600 tracking-tight">
                {(size.w * dpi).toFixed(0)} × {(size.h * dpi).toFixed(0)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pixels</span>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest mt-4">
        Results calculated based on {dpi} dots per inch
      </p>
    </div>
  );
};
