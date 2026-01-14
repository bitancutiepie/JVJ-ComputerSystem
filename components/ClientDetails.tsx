import React, { useState, useEffect } from 'react';
import { ClientFormData, ClientRecord } from '../types';
import { SERVICE_LINKS } from '../constants';
import { Save, Trash2, Plus, History, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const ClientDetails: React.FC = () => {
  const [formData, setFormData] = useState<ClientFormData>({
    service: SERVICE_LINKS[0].name,
    username: '',
    password: '',
    email: '',
  });
  const [records, setRecords] = useState<ClientRecord[]>([]);
  const [view, setView] = useState<'form' | 'list' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      const mapped = data.map((d: any) => ({
        ...d,
        timestamp: new Date(d.created_at).toLocaleString()
      }));
      setRecords(mapped);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('clients')
      .insert([{
        service: formData.service,
        username: formData.username,
        password: formData.password,
        email: formData.email
      }]);

    if (!error) {
      setFormData({ ...formData, username: '', password: '', email: '' });
      setView('success');
      await fetchRecords();
      
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setExiting(false);
          setView('list');
        }, 500);
      }, 2000);
    }
    setLoading(false);
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
      return;
    }

    setDeletingId(id);
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setRecords(records.filter(r => r.id !== id));
      setDeletingId(null);
      setConfirmDelete(null);
    } else {
      alert(`Delete Error: ${error.message}`);
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (view === 'success') {
    return (
      <div className={`p-16 text-center bg-emerald-50 rounded-[3rem] border-2 border-emerald-100 ${exiting ? 'animate-fade-out' : 'animate-fade-in'}`}>
        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Record Locked</h3>
        <p className="text-emerald-600 font-bold uppercase text-[9px] tracking-[0.4em]">Synced with Security Database</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl shadow-inner">
        <button 
          onClick={() => setView('form')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'form' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Plus className="w-3.5 h-3.5" /> New Entry
        </button>
        <button 
          onClick={() => setView('list')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <History className="w-3.5 h-3.5" /> Database Log
        </button>
      </div>

      {view === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block ml-1">Target Service</label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer"
            >
              {SERVICE_LINKS.map(link => (
                <option key={link.name} value={link.name}>{link.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-4 px-1">
            <input 
              type="text" placeholder="CLIENT USERNAME" required
              value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-blue-500 focus:bg-slate-50/30 outline-none transition-all placeholder:text-slate-200" 
            />
            <input 
              type="text" placeholder="SECURE PASSWORD" 
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-blue-500 focus:bg-slate-50/30 outline-none transition-all placeholder:text-slate-200" 
            />
            <input 
              type="email" placeholder="CONTACT EMAIL" 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-blue-500 focus:bg-slate-50/30 outline-none transition-all placeholder:text-slate-200" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black uppercase text-xs tracking-[0.2em] py-5 rounded-[2rem] hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Commit to Cloud
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-12 text-slate-300 text-[10px] font-black uppercase tracking-[0.5em]">No Cloud Records</div>
          ) : (
            records.map(record => (
              <div key={record.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-blue-300 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">{record.service}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{record.timestamp}</div>
                  </div>
                  <button 
                    onClick={() => handleDeleteRecord(record.id)}
                    disabled={deletingId === record.id}
                    className={`p-2 transition-all flex items-center gap-1 rounded-xl ${
                      confirmDelete === record.id 
                        ? 'text-red-600 bg-red-50 px-3' 
                        : 'text-slate-200 hover:text-red-500'
                    }`}
                  >
                    {deletingId === record.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : confirmDelete === record.id ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase">CONFIRM?</span>
                      </>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[9px] uppercase font-black text-slate-400">User: <span className="text-slate-900 block mt-1 text-xs truncate">{record.username}</span></div>
                  <div className="text-[9px] uppercase font-black text-slate-400">Pass: <span className="text-slate-900 block mt-1 font-mono text-xs truncate">{record.password}</span></div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};