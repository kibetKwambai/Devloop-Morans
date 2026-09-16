import React, { useState } from 'react';
import { SensitiveVaultData } from '../types';
import { Icon } from './Icon';

interface SensitiveDataVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  vault: SensitiveVaultData;
  onToggleConsent: (granted: boolean) => void;
}

export const SensitiveDataVaultModal: React.FC<SensitiveDataVaultModalProps> = ({
  isOpen,
  onClose,
  vault,
  onToggleConsent
}) => {
  const [activeTab, setActiveTab] = useState<'records' | 'logs' | 'legal'>('records');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-indigo-950 text-white p-6 sm:p-8 rounded-t-3xl border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Icon name="lockClosed" className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">Sensitive Data Vault</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Hardware-Encrypted
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Statutory background & safety compliance records. Protected by Kenya Data Protection Act 2019 (Section 44). Quarantined from standard search and AI matching algorithms.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
          >
            <Icon name="xMark" className="w-6 h-6" />
          </button>
        </div>

        {/* Master Consent Banner */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${vault.consentGranted ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {vault.consentGranted ? 'External Employer Access: AUTHORIZED' : 'External Employer Access: BLOCKED / REVOKED'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {vault.consentGranted 
                ? `Authorized employers can request minimum-necessary statutory clearance until ${vault.consentExpiresAt}.`
                : 'Zero external employers can query sensitive health or background records.'}
            </p>
          </div>

          <button
            onClick={() => onToggleConsent(!vault.consentGranted)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
              vault.consentGranted 
                ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Icon name={vault.consentGranted ? 'lockClosed' : 'checkCircle'} className="w-4 h-4" />
            {vault.consentGranted ? 'Revoke All Access Now' : 'Grant Verified Purpose Consent'}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 gap-6 text-xs font-bold">
          {[
            { id: 'records', label: 'Vault Data & Protected Attributes' },
            { id: 'logs', label: `Real-Time Access Audit Trail (${vault.accessLogs.length})` },
            { id: 'legal', label: 'Statutory Purpose & Data Protection' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3.5 border-b-2 transition-all ${
                activeTab === t.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {activeTab === 'records' && (
            <div className="space-y-6">
              
              {/* Sensitive Item Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Criminal Record Clearance */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Police Clearance Check</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                      Primary Source Verified
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Directorate of Criminal Investigations (DCI)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    {vault.criminalRecordDetails}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    *Employers receive lawful binary confirmation ("Clean Record") without revealing sensitive investigative notes.
                  </p>
                </div>

                {/* Medical & Health Conditions */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Occupational Medical Clearance</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300">
                      Class 1 Aviation Certified
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Statutory Flight Crew Fitness</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    {vault.medicalConditions}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400 pt-1">
                    <span>Blood Group: <strong className="text-slate-900 dark:text-white">{vault.bloodGroup}</strong></span>
                    <span>Height: <strong className="text-slate-900 dark:text-white">{vault.height}</strong></span>
                    <span>BMI: <strong className="text-slate-900 dark:text-white">{vault.bmi}</strong></span>
                  </div>
                </div>

                {/* Ethnicity / Tribe Protection Quarantined Notice */}
                <div className="bg-amber-50/60 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Icon name="shieldCheck" className="w-5 h-5 flex-shrink-0" />
                    <h4 className="text-sm font-bold">Protected Characteristic Quarantine (Ethnicity, Community, Tribe)</h4>
                  </div>
                  <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                    Under VerifiedHire fair-opportunity principles and Article 27 of the Constitution of Kenya, tribal, ethnic, and community characteristics are strictly quarantined in this encrypted vault. <strong>They are never indexed, cannot be queried or filtered by employers, and are zero-weighted in all AI matching engines.</strong>
                  </p>
                  <div className="text-xs font-mono text-amber-800 dark:text-amber-400 bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/40">
                    Encrypted Token State: SHA-256 [0x98f...741b] • Status: QUARANTINED
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Every query to this vault generates an immutable cryptographic audit record.
                </p>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  {vault.accessLogs.length} Access Entries Logged
                </span>
              </div>

              <div className="space-y-3">
                {vault.accessLogs.map(log => (
                  <div 
                    key={log.id} 
                    className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{log.requesterName}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{log.organisation}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">Declared Purpose: {log.purpose}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {log.fieldsAccessed.map(f => (
                          <span key={f} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] rounded-md border border-indigo-200 dark:border-indigo-800">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-mono text-slate-400 text-[11px] block">{new Date(log.timestamp).toLocaleString()}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Legal Basis for Processing</h4>
              <p>
                Processing of sensitive personal data is performed pursuant to <strong>Section 44 of the Kenya Data Protection Act 2019</strong> (Processing of Sensitive Personal Data) and the <strong>Kenya Civil Aviation Regulations</strong> (Personnel Licensing Requirements).
              </p>
              
              <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-2">Minimum Necessary Disclosure Rule</h4>
              <p>
                VerifiedHire implements strict minimum-necessary field access. Employers requesting pre-employment safety clearance are only provided with statutory compliance attestations (e.g., "Cleared for Commercial Operations") rather than raw diagnostic metrics.
              </p>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-2">Candidate Revocation Rights</h4>
              <p>
                You retain the unilateral right to withdraw consent at any moment via the Master Consent Toggle. Withdrawal immediately terminates pending external verification inquiries.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
