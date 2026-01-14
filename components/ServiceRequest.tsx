import React, { useState, useEffect } from 'react';
import { SERVICE_LINKS, SERVICE_REQUIREMENTS } from '../constants';
import { Settings, Plus, Trash2, CheckCircle, ClipboardList, History, ChevronDown, Sparkles, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ServiceRequest, FormField } from '../types';
import { supabase } from '../lib/supabase';

interface Props {
  isAdmin?: boolean;
}

export const ServiceRequestForm: React.FC<Props> = ({ isAdmin }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedService, setSelectedService] = useState(SERVICE_LINKS[0].name);
  
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [view, setView] = useState<'form' | 'history' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
    
    const savedFields = localStorage.getItem('jvj_form_config');
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    } else {
      loadRequirementsForService(selectedService);
    }
  }, []);

  useEffect(() => {
    if (!isAdminMode) {
      loadRequirementsForService(selectedService);
    }
  }, [selectedService]);

  const fetchRequests = async () => {
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
        timestamp: new Date(d.created_at).toLocaleString()
      }));
      setRequests(mapped);
    }
  };

  const loadRequirementsForService = (serviceName: string) => {
    const requirements = SERVICE_REQUIREMENTS[serviceName] || [];
    const newFields: FormField[] = requirements.map((req, index) => ({
      id: `field_${index}_${serviceName.replace(/\s/g, '_')}`,
      label: req.label.toUpperCase(),
      active: true,
      type: req.type,
      options: req.options
    }));
    setFields(newFields);
    setFormData({});
  };

  const saveConfig = (updatedFields: FormField[]) => {
    setFields(updatedFields);
    localStorage.setItem('jvj_form_config', JSON.stringify(updatedFields));
  };

  const handleToggleField = (id: string) => {
    const updated = fields.map(f => f.id === id ? { ...f, active: !f.active } : f);
    saveConfig(updated);
  };

  const handleAddField = () => {
    const label = prompt("Enter the new field name:");
    if (label) {
      const newField: FormField = { 
        id: `custom_${Date.now()}`, 
        label: label.toUpperCase(), 
        active: true, 
        type: 'text' 
      };
      saveConfig([...fields, newField]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('service_requests')
      .insert([{
        service_type: selectedService,
        client_data: formData,
        status: 'pending'
      }]);

    if (!error) {
      setFormData({});
      setView('success');
      await fetchRequests();
      
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setExiting(false);
          setView('history');
        }, 500);
      }, 2000);
    }
    setLoading(false);
  };

  const handleDeleteRequest = async (id: string) => {
    if (!isAdmin) return;
    
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
      return;
    }

    setDeletingId(id);
    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setRequests(requests.filter(r => r.id !== id));
      setDeletingId(null);
      setConfirmDelete(null);
    } else {
      alert(`Error deleting: ${error.message}`);
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (view === 'success') {
    return (
      <div className={`py-20 text-center bg-blue-50 rounded-[3rem] border-2 border-blue-100 ${exiting ? 'animate-fade-out' : 'animate-fade-in'}`}>
        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
          <CheckCircle2 className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Request Cached</h3>
        <p className="text-blue-600 font-bold uppercase text-[10px] tracking-[0.3em]">Successfully Logged in Ledger</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
        <button 
          onClick={() => setView('form')}
          className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${view === 'form' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Prepare Data
        </button>
        <button 
          onClick={() => setView('history')}
          className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${view === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Cloud Drafts ({requests.length})
        </button>
        {isAdmin && (
          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`px-4 py-3 rounded-xl transition-all ${isAdminMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
            title="Customize Requirements"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {isAdminMode && (
        <div className="p-6 bg-blue-50 rounded-[2rem] border-2 border-dashed border-blue-200 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Requirement Architect</h4>
            </div>
            <button onClick={handleAddField} className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {fields.map(field => (
              <div key={field.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-blue-100 shadow-sm">
                <span className={`text-xs font-bold ${field.active ? 'text-slate-800' : 'text-slate-300'}`}>{field.label}</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleToggleField(field.id)}
                    className={`text-[10px] font-black uppercase ${field.active ? 'text-blue-600' : 'text-slate-300'}`}
                  >
                    {field.active ? 'Active' : 'Disabled'}
                  </button>
                  <button 
                    onClick={() => saveConfig(fields.filter(f => f.id !== field.id))}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block ml-1">Choose Service Provider</label>
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-slate-900 font-black text-lg focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all"
              >
                {SERVICE_LINKS.map(link => (
                  <option key={link.name} value={link.name}>{link.name}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="space-y-5 px-1">
            {fields.filter(f => f.active).map(field => (
              <div key={field.id} className="animate-fade-in">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 block ml-1">{field.label}</label>
                
                {field.type === 'select' && field.options ? (
                  <div className="relative">
                    <select
                      required
                      value={formData[field.id] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="" disabled>Select Option</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ) : (
                  <input
                    type={field.type || 'text'}
                    placeholder={`Enter details...`}
                    required
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold focus:border-blue-500 outline-none transition-all placeholder:text-slate-200 shadow-sm"
                  />
                )}
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-6 rounded-[2rem] hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-4 active:scale-[0.98] mt-4 uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
            Save Application Draft
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">No cloud drafts found</p>
            </div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-blue-300 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h5 className="font-black text-slate-900 text-base uppercase tracking-tight">{req.serviceType}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <History className="w-3 h-3 text-slate-300" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{req.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                      {req.status}
                    </span>
                    {isAdmin && (
                      <button 
                        onClick={() => handleDeleteRequest(req.id)}
                        disabled={deletingId === req.id}
                        className={`p-2 transition-all flex items-center gap-1 rounded-lg ${
                          confirmDelete === req.id 
                            ? 'text-red-600 bg-red-50 px-3' 
                            : 'text-slate-300 hover:text-red-500'
                        }`}
                      >
                        {deletingId === req.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : confirmDelete === req.id ? (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase">CONFIRM?</span>
                          </>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  {Object.entries(req.clientData).map(([key, val]) => {
                    const requirements = SERVICE_REQUIREMENTS[req.serviceType] || [];
                    const index = parseInt(key.split('_')[1]);
                    const fieldLabel = (requirements[index]?.label) || key.replace(/field_\d+_/, '').replace(/_/g, ' ').toUpperCase();
                    
                    return (
                      <div key={key} className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{fieldLabel}</span>
                        <span className="text-sm font-bold text-slate-800 break-words">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};