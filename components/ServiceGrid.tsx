import React from 'react';
import { SERVICE_LINKS } from '../constants';
import { ExternalLink } from 'lucide-react';

export const ServiceGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SERVICE_LINKS.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:border-blue-400 hover:bg-white transition-all group shadow-sm hover:shadow-md"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600 group-hover:text-blue-600">
            {link.name}
          </span>
          <div className="bg-white p-2 rounded-lg border border-slate-200 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </div>
        </a>
      ))}
    </div>
  );
};
