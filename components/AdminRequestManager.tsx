import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ServiceRequest } from '../types';
import { SERVICE_REQUIREMENTS } from '../constants';
import { 
  ClipboardCheck, 
  Trash2, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Calendar,
  Layers,
  Loader2,
  ShieldAlert
} from 'lucide-react';

export const AdminRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped = data.map((d: any) => ({
        id: d.id,
        serviceType: d.service_type,
        clientData: d.client_data,
        status: d.status,
        timestamp: new Date(d.created_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      setRequests(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDeleteRequest = async (id: string) => {
    // Stage 1: Initial Click - Prompt for confirmation
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      // Auto-revert after 3 seconds if not confirmed
      setTimeout(() => setConfirmDelete(null), 3000);
      return;
    }

    // Stage 2: Confirmed Click - Execute Delete
    setDeletingId(id);
    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id);
    
    if (error) {
      alert(`Cloud sync error: ${error.message}`);
      setDeletingId(null);
      setConfirmDelete(null);
    } else {
      setRequests(prev => prev.filter(r => r.id !== id));
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const cycleStatus = async (id: string, currentStatus: string) => {
    const statuses = ['pending', 'processing', 'completed'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    const { error } = await supabase
      .from('service_requests')
      .update({ status: nextStatus })
      .eq('id', id);
    
    if (!error) {
      setRequests(requests.map(r => r.id === id ? { ...r, status: nextStatus as any } : r));
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(req.clientData).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getFieldLabel = (serviceType: string, key: string) => {
    const requirements = SERVICE_REQUIREMENTS[serviceType];
    if (key.startsWith('field_') && requirements) {
      const parts = key.split('_');
      const index = parseInt(parts[1]);
      if (!isNaN(index) && requirements[index]) {
        return requirements[index].label;
      }
    }
    return key.replace(/field_\d+_/, '').replace(/custom_\d+_/, '').replace(/_/g, ' ').trim().toUpperCase();
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20';
      case 'processing': return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20';
      default: return 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 bg-slate-50/80 backdrop-blur-sm p-5 rounded-[2rem] border border-slate-200/60 sticky top-0 z-10 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search within ledger..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-slate-300 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer hover:bg-slate-50 transition-all"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Filter: All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
          <button 
            onClick={fetchRequests}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Sync Ledger"
          >
            <RefreshCw className={`w-4 h-4 text-blue-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-100 rounded-full animate-spin border-t-blue-500"></div>
              <Layers className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Decrypting Cloud Data</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-inner">
            <div className="bg-slate-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.5em]">No records found in ledger</p>
          </div>
        ) : (
          filteredRequests.map(req => (
            <div key={req.id} className="bg-white border border-slate-200/80 rounded-[2.2rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
              <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-r from-white to-slate-50/30">
                <div className="flex items-center gap-5">
                  <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-lg shadow-slate-200">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none mb-2.5">
                      {req.serviceType}
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-md">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{req.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => cycleStatus(req.id, req.status)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-[0.15em] transition-all active:scale-95 shadow-sm ring-4 ring-transparent hover:ring-offset-2 ${getStatusStyles(req.status)}`}
                  >
                    {req.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {req.status === 'processing' && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                    {req.status === 'pending' && <AlertCircle className="w-3.5 h-3.5" />}
                    {req.status}
                  </button>

                  <button 
                    onClick={() => handleDeleteRequest(req.id)}
                    disabled={deletingId === req.id}
                    className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border-2 transition-all shadow-sm active:scale-90 ${
                      confirmDelete === req.id 
                        ? 'bg-red-500 border-red-500 text-white animate-pulse px-6' 
                        : 'bg-white border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50'
                    } disabled:opacity-50`}
                    title={confirmDelete === req.id ? "Click again to confirm" : "Remove Record"}
                  >
                    {deletingId === req.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : confirmDelete === req.id ? (
                      <>
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Confirm?</span>
                      </>
                    ) : (
                      <Trash2 className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="px-6 md:px-8 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 bg-slate-50/50 p-8 rounded-[1.8rem] border border-slate-100 relative">
                  <div className="absolute top-4 right-6 pointer-events-none opacity-[0.03]">
                    <Layers className="w-24 h-24 text-slate-900" />
                  </div>
                  {Object.entries(req.clientData).map(([key, val]) => (
                    <div key={key} className="flex flex-col group/item">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover/item:text-blue-500 transition-colors">
                        {getFieldLabel(req.serviceType, key)}
                      </span>
                      <div className="flex items-baseline gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-200 mt-1.5 shrink-0" />
                        <span className="text-sm font-bold text-slate-700 break-words leading-relaxed selection:bg-blue-600 selection:text-white">
                          {String(val) || '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};