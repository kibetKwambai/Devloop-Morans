import React, { useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { Icon } from './Icon';

interface CommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCandidate: (id: string) => void;
  onOpenPassport: () => void;
  onOpenVault: () => void;
  onOpenPrivacy: () => void;
}

export const CommandCenterModal: React.FC<CommandCenterModalProps> = ({
  isOpen,
  onClose,
  onSelectCandidate,
  onOpenPassport,
  onOpenVault,
  onOpenPrivacy
}) => {
  const { profiles, jobs, credentials, theme, setTheme } = useAppContext();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCandidates = profiles.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.headline.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(query.toLowerCase()) || 
    (j.category && j.category.toLowerCase().includes(query.toLowerCase())) ||
    j.companyName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredCreds = credentials.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.issuingOrg.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 z-70 bg-slate-950/75 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Icon name="magnifyingGlass" className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search candidates, jobs, credentials... (Press ESC to exit)"
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
          />
          <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500 rounded-md border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* Quick Shortcuts */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Quick Navigation</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5">
              <button
                onClick={() => { onOpenPassport(); onClose(); }}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl border border-slate-200 dark:border-slate-700 text-left transition-all group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 block">Professional Passport</span>
                <span className="text-[10px] text-slate-500">Coverage & Trust Chains</span>
              </button>

              <button
                onClick={() => { onOpenVault(); onClose(); }}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl border border-slate-200 dark:border-slate-700 text-left transition-all group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 block">Sensitive Data Vault</span>
                <span className="text-[10px] text-slate-500">KDPA Statutory Compliance</span>
              </button>

              <button
                onClick={() => { onOpenPrivacy(); onClose(); }}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl border border-slate-200 dark:border-slate-700 text-left transition-all group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 block">Privacy Center</span>
                <span className="text-[10px] text-slate-500">Who Viewed Me & Erasure</span>
              </button>
            </div>
          </div>

          {/* Candidates */}
          {filteredCandidates.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Verified Candidates</span>
              <div className="space-y-1.5 mt-1.5">
                {filteredCandidates.map(c => (
                  <div
                    key={c.id}
                    onClick={() => { onSelectCandidate(c.id); onClose(); }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={c.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                        <span className="text-slate-400 text-[11px] block">{c.headline}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">View Dossier →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jobs */}
          {filteredJobs.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Active Requisitions & Roles</span>
              <div className="space-y-1.5 mt-1.5">
                {filteredJobs.map(j => (
                  <div
                    key={j.id}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{j.title}</span>
                      <span className="text-slate-400 text-[11px] block">{j.category || j.companyName} • {j.location}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">{j.salaryRange || 'Competitive'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Credentials */}
          {filteredCreds.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Verifiable Credentials</span>
              <div className="space-y-1.5 mt-1.5">
                {filteredCreds.map(cr => (
                  <div
                    key={cr.id}
                    onClick={() => { onOpenPassport(); onClose(); }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{cr.title}</span>
                      <span className="text-slate-400 text-[11px] block">Issuer: {cr.issuingOrg}</span>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {cr.verificationState}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span>Tip: Press <kbd className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border">Cmd+K</kbd> anywhere to open</span>
          <span>VerifiedHire Trust Architecture</span>
        </div>

      </div>
    </div>
  );
};
