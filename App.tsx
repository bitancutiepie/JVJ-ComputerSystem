import React, { useState, useEffect, useRef } from 'react';
import { PasswordGenerator } from './components/PasswordGenerator';
import { ServiceGrid } from './components/ServiceGrid';
import { ClientDetails } from './components/ClientDetails';
import { AgeCalculator } from './components/AgeCalculator';
import { PrintDimensions } from './components/PrintDimensions';
import { ContactForm } from './components/ContactForm';
import { ServiceRequestForm } from './components/ServiceRequest';
import { AdminLogin } from './components/AdminLogin';
import { AdminRequestManager } from './components/AdminRequestManager';
import {
  Monitor,
  ChevronDown,
  Key,
  UserCircle,
  Globe,
  Calendar,
  Ruler,
  Mail,
  ClipboardList,
  Unlock,
  Settings2,
  Cpu,
  Database,
  LogOut,
  LayoutGrid,
  ChevronUp,
  HelpCircle,
  X,
  Sparkles,
  MousePointer2,
  Cloud
} from 'lucide-react';

interface SectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: (id: string) => void;
  accentColor?: string;
}

const CollapsibleSection: React.FC<SectionProps> = ({
  id,
  title,
  icon,
  children,
  isOpen,
  onToggle,
  accentColor = "bg-blue-600"
}) => {
  return (
    <div id={id} className={`relative mb-8 transition-all duration-500 ease-in-out`}>
      <div className={`bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden ${isOpen ? 'ring-2 ring-blue-500/10' : ''}`}>
        <button
          onClick={() => onToggle(id)}
          className="w-full relative flex items-center justify-between p-6 sm:p-8 text-left hover:bg-slate-50/50 transition-colors group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50/20 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className={`relative p-4 rounded-2xl shadow-inner ${isOpen ? accentColor + ' text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
              {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 28, strokeWidth: 2.5 }) : icon}
              <div className="absolute -top-1 -left-1">
                <Cpu className="w-3 h-3 text-slate-300 opacity-20" />
              </div>
            </div>

            <div>
              <h2 className={`text-lg font-extrabold tracking-tight ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>
                {title}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {isOpen ? 'Currently Viewing' : 'Tap to expand'}
              </p>
            </div>
          </div>

          <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-blue-50 rotate-180' : 'bg-slate-50'}`}>
            <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
          </div>
        </button>

        <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="p-8 pt-2 border-t border-slate-100 bg-white">
            {children}
          </div>
        </div>
      </div>

      {!isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-[95%] h-4 bg-slate-200/40 rounded-b-[2rem] -z-10 shadow-sm" />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const [sectionStates, setSectionStates] = useState<Record<string, boolean>>({
    'service-requests': true,
    'inquiry-support': false,
    'master-ledger': true,
    'quick-links': false,
    'security-keys': false,
    'credential-ledger': false,
    'temporal-calc': false,
    'dimension-help': false
  });

  useEffect(() => {
    const adminState = localStorage.getItem('jvj_admin');
    if (adminState === 'true') setIsAdmin(true);

    const hasSeenWelcome = localStorage.getItem('jvj_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    if (showWelcome || showLogin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWelcome, showLogin]);

  const closeWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('jvj_welcome_seen', 'true');
  };

  const handleToggle = (id: string) => {
    setSectionStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const jumpToSection = (id: string) => {
    setSectionStates(prev => ({ ...prev, [id]: true }));
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      localStorage.setItem('jvj_admin', 'true');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('jvj_admin');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans pb-32 lg:pl-56">

      {showLogin && <AdminLogin onLogin={handleLogin} onClose={() => setShowLogin(false)} />}

      {/* Welcome & Tutorial Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xl flex items-start sm:items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] my-auto relative border border-white animate-slide-down">
            <button
              onClick={closeWelcome}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative p-8 sm:p-10 lg:p-14">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

              <div className="mb-10 text-center">
                <div className="inline-flex p-5 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-200 mb-8 animate-bounce-subtle">
                  <Monitor className="w-10 h-10" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tighter uppercase mb-2">
                  WELCOME TO JVJ <span className="text-blue-600">ONLINE</span>
                </h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Maikling gabay sa paggamit</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Menu</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    Pindutin ang mga buttons sa <span className="text-slate-900">kaliwa</span> para lumipat ng tools.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-amber-500">
                      <MousePointer2 className="w-4 h-4" />
                    </div>
                    <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Gamit</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    I-click ang mga <span className="text-slate-900">box</span> para makita ang password o calculator.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-500">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Internet</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    I-save ang data para <span className="text-slate-900">hindi mawala</span> kahit i-refresh ang page.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-rose-500">
                      <Settings2 className="w-4 h-4" />
                    </div>
                    <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Para sa Staff</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    I-click ang <span className="text-slate-900">monitor icon</span> sa taas para makapag-login.
                  </p>
                </div>
              </div>

              <button
                onClick={closeWelcome}
                className="w-full mt-8 bg-slate-900 text-white font-black py-5 rounded-[2rem] hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
              >
                <Sparkles className="w-4 h-4" /> Sige, Tara na!
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="pt-16 pb-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <button
              onClick={() => setShowLogin(true)}
              className="group relative mb-8"
            >
              <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] group-hover:border-blue-400 group-hover:bg-blue-50 transition-all duration-500 shadow-xl shadow-slate-200/50">
                <Monitor className="w-10 h-10 text-slate-400 group-hover:text-blue-600" />
              </div>
              {isAdmin && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white">
                  <Unlock className="w-3.5 h-3.5" />
                </div>
              )}
            </button>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-3">
              JVJ System
            </h1>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em]">
                Digital Utility Infrastructure
              </p>
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl lg:max-w-2xl mx-auto px-4 py-4">
        <CollapsibleSection
          id="service-requests"
          title="Service Requests"
          icon={<ClipboardList />}
          isOpen={sectionStates['service-requests']}
          onToggle={handleToggle}
        >
          <ServiceRequestForm isAdmin={isAdmin} />
        </CollapsibleSection>

        <CollapsibleSection
          id="inquiry-support"
          title="Inquiry Support"
          icon={<Mail />}
          accentColor="bg-slate-700"
          isOpen={sectionStates['inquiry-support']}
          onToggle={handleToggle}
        >
          <ContactForm />
        </CollapsibleSection>

        {isAdmin && (
          <div className="mt-16 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between px-6 mb-8">
              <div className="flex items-center gap-3">
                <Settings2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Admin Control Panel</h3>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-[0.2em] transition-all bg-red-50 px-4 py-2 rounded-xl"
              >
                <LogOut className="w-3 h-3" />
                Log Out
              </button>
            </div>

            <CollapsibleSection
              id="master-ledger"
              title="Master Request Ledger"
              icon={<Database />}
              accentColor="bg-slate-900"
              isOpen={sectionStates['master-ledger']}
              onToggle={handleToggle}
            >
              <AdminRequestManager />
            </CollapsibleSection>

            <CollapsibleSection
              id="quick-links"
              title="Quick Access Links"
              icon={<Globe />}
              accentColor="bg-indigo-600"
              isOpen={sectionStates['quick-links']}
              onToggle={handleToggle}
            >
              <ServiceGrid />
            </CollapsibleSection>

            <CollapsibleSection
              id="security-keys"
              title="Security Keys"
              icon={<Key />}
              accentColor="bg-amber-500"
              isOpen={sectionStates['security-keys']}
              onToggle={handleToggle}
            >
              <PasswordGenerator />
            </CollapsibleSection>

            <CollapsibleSection
              id="credential-ledger"
              title="Credential Ledger"
              icon={<UserCircle />}
              accentColor="bg-emerald-600"
              isOpen={sectionStates['credential-ledger']}
              onToggle={handleToggle}
            >
              <ClientDetails />
            </CollapsibleSection>

            <CollapsibleSection
              id="temporal-calc"
              title="Temporal Calc"
              icon={<Calendar />}
              accentColor="bg-rose-500"
              isOpen={sectionStates['temporal-calc']}
              onToggle={handleToggle}
            >
              <AgeCalculator />
            </CollapsibleSection>

            <CollapsibleSection
              id="dimension-help"
              title="Dimension Help"
              icon={<Ruler />}
              accentColor="bg-cyan-600"
              isOpen={sectionStates['dimension-help']}
              onToggle={handleToggle}
            >
              <PrintDimensions />
            </CollapsibleSection>
          </div>
        )}
      </main>

      {/* Adaptive Floating Command Dock */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-6 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 z-50 px-3 py-3 lg:py-8 lg:px-4 glass-dock rounded-[2.5rem] lg:rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-row lg:flex-col items-center gap-2 lg:gap-1.5 border border-white/50 animate-fade-in transition-all duration-700 lg:w-44 lg:items-start">

        <button
          onClick={() => jumpToSection('service-requests')}
          className="p-3 text-slate-500 hover:text-blue-600 hover:bg-white lg:w-full lg:flex lg:items-center lg:gap-3 lg:px-4 lg:py-3.5 rounded-2xl transition-all group relative"
        >
          <ClipboardList className="w-5 h-5 shrink-0" />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 bg-slate-900 lg:bg-transparent text-white lg:text-slate-600 text-[9px] lg:text-[10px] font-black uppercase tracking-widest lg:tracking-widest px-3 py-1.5 lg:p-0 rounded-lg opacity-0 lg:opacity-100 group-hover:opacity-100 lg:group-hover:text-blue-600 pointer-events-none lg:pointer-events-auto transition-all shadow-xl lg:shadow-none">Requests</span>
        </button>

        <button
          onClick={() => jumpToSection('inquiry-support')}
          className="p-3 text-slate-500 hover:text-blue-600 hover:bg-white lg:w-full lg:flex lg:items-center lg:gap-3 lg:px-4 lg:py-3.5 rounded-2xl transition-all group relative"
        >
          <Mail className="w-5 h-5 shrink-0" />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 bg-slate-900 lg:bg-transparent text-white lg:text-slate-600 text-[9px] lg:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 lg:p-0 rounded-lg opacity-0 lg:opacity-100 group-hover:opacity-100 lg:group-hover:text-blue-600 pointer-events-none lg:pointer-events-auto transition-all shadow-xl lg:shadow-none">Support</span>
        </button>

        {isAdmin && (
          <>
            <div className="w-px lg:w-full h-6 lg:h-px bg-slate-200/50 mx-1 lg:mx-0 lg:my-2" />
            <button
              onClick={() => jumpToSection('master-ledger')}
              className="p-3 text-slate-500 hover:text-blue-600 hover:bg-white lg:w-full lg:flex lg:items-center lg:gap-3 lg:px-4 lg:py-3.5 rounded-2xl transition-all group relative"
            >
              <Database className="w-5 h-5 shrink-0" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 bg-slate-900 lg:bg-transparent text-white lg:text-slate-600 text-[9px] lg:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 lg:p-0 rounded-lg opacity-0 lg:opacity-100 group-hover:opacity-100 lg:group-hover:text-blue-600 pointer-events-none lg:pointer-events-auto transition-all shadow-xl lg:shadow-none">Ledger</span>
            </button>
            <button
              onClick={() => jumpToSection('quick-links')}
              className="p-3 text-slate-500 hover:text-blue-600 hover:bg-white lg:w-full lg:flex lg:items-center lg:gap-3 lg:px-4 lg:py-3.5 rounded-2xl transition-all group relative"
            >
              <Globe className="w-5 h-5 shrink-0" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 bg-slate-900 lg:bg-transparent text-white lg:text-slate-600 text-[9px] lg:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 lg:p-0 rounded-lg opacity-0 lg:opacity-100 group-hover:opacity-100 lg:group-hover:text-blue-600 pointer-events-none lg:pointer-events-auto transition-all shadow-xl lg:shadow-none">Links</span>
            </button>
            <button
              onClick={() => jumpToSection('security-keys')}
              className="p-3 text-slate-500 hover:text-blue-600 hover:bg-white lg:w-full lg:flex lg:items-center lg:gap-3 lg:px-4 lg:py-3.5 rounded-2xl transition-all group relative"
            >
              <Key className="w-5 h-5 shrink-0" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 bg-slate-900 lg:bg-transparent text-white lg:text-slate-600 text-[9px] lg:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 lg:p-0 rounded-lg opacity-0 lg:opacity-100 group-hover:opacity-100 lg:group-hover:text-blue-600 pointer-events-none lg:pointer-events-auto transition-all shadow-xl lg:shadow-none">Keys</span>
            </button>
            <button
              onClick={() => jumpToSection('credential-ledger')}
              className="p-3 text-slate-500 hover:text-blue-600 hover:bg-white lg:w-full lg:flex lg:items-center lg:gap-3 lg:px-4 lg:py-3.5 rounded-2xl transition-all group relative"
            >
              <UserCircle className="w-5 h-5 shrink-0" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 bg-slate-900 lg:bg-transparent text-white lg:text-slate-600 text-[9px] lg:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 lg:p-0 rounded-lg opacity-0 lg:opacity-100 group-hover:opacity-100 lg:group-hover:text-blue-600 pointer-events-none lg:pointer-events-auto transition-all shadow-xl lg:shadow-none">Vault</span>
            </button>
          </>
        )}

        <div className="w-px lg:w-full h-6 lg:h-px bg-slate-200/50 mx-1 lg:mx-0 lg:my-2" />

        <button
          onClick={() => setShowWelcome(true)}
          className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white lg:w-full lg:flex lg:items-center lg:gap-3 lg:px-4 lg:py-3.5 rounded-2xl transition-all group relative"
        >
          <HelpCircle className="w-5 h-5 shrink-0" />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 bg-slate-900 lg:bg-transparent text-white lg:text-slate-600 text-[9px] lg:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 lg:p-0 rounded-lg opacity-0 lg:opacity-100 group-hover:opacity-100 lg:group-hover:text-blue-600 pointer-events-none lg:pointer-events-auto transition-all shadow-xl lg:shadow-none">Gabay</span>
        </button>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 text-blue-600 bg-white lg:w-full lg:flex lg:items-center lg:gap-3 lg:px-4 lg:py-3.5 rounded-full lg:rounded-2xl transition-all shadow-sm hover:scale-105 active:scale-95 group relative"
        >
          <ChevronUp className="w-5 h-5 shrink-0" />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 bg-blue-600 lg:bg-transparent text-white lg:text-blue-600 text-[9px] lg:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 lg:p-0 rounded-lg opacity-0 lg:opacity-100 group-hover:opacity-100 pointer-events-none lg:pointer-events-auto transition-all shadow-xl lg:shadow-none">Top</span>
        </button>
      </nav>

      <footer className="py-20 mt-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em] mb-4">
            Authorized Personnel Only
          </div>
          <p className="text-slate-400 text-sm font-bold">Joshua Vincent Bitancor © 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default App;