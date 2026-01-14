import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'exiting'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const { error } = await supabase
      .from('contact_inquiries')
      .insert([{
        name: formData.name,
        email: formData.email,
        message: formData.message,
        subject: 'General Support'
      }]);

    if (!error) {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Sequence: Stay for 3s, then start fade out
      setTimeout(() => {
        setStatus('exiting');
        // Final reset after fade out animation (0.5s)
        setTimeout(() => setStatus('idle'), 500);
      }, 3000);
    } else {
      setStatus('idle');
    }
  };

  if (status === 'success' || status === 'exiting') {
    return (
      <div className={`bg-emerald-50 rounded-[2.5rem] p-10 text-center border-2 border-emerald-100 ${status === 'exiting' ? 'animate-fade-out' : 'animate-fade-in'}`}>
        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-extrabold text-green-900 mb-2 tracking-tight">Cloud Sent</h3>
        <p className="text-green-700 text-sm font-medium">Your inquiry has been logged in the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Your Name</label>
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">How can we help?</label>
          <textarea 
            placeholder="Describe your request..." 
            rows={5}
            required
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-black shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
        >
          {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} 
          Submit to Support
        </button>
      </form>
    </div>
  );
};