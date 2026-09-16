import React, { useState } from 'react';
import { CandidatePrivacySettings } from '../types';
import { Icon } from './Icon';

interface PrivacyControlCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  privacy: CandidatePrivacySettings;
  onUpdateSetting: <K extends keyof CandidatePrivacySettings>(key: K, value: CandidatePrivacySettings[K]) => void;
}

export const PrivacyControlCenterModal: React.FC<PrivacyControlCenterModalProps> = ({
  isOpen,
  onClose,
  privacy,
  onUpdateSetting
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [erasureModal, setErasureModal] = useState(false);

  if (!isOpen) return null;

  const handleDownloadData = () => {
    setDownloadSuccess(true);
    // Simulate generation of encrypted verifiable data package
    const dataBlob = new Blob([JSON.stringify(privacy, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'verifiedhire-data-subject-export.json';
    link.click();
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-t-3xl border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Icon name="shieldCheck" className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">Privacy & Visibility Control Center</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  GDPR & KDPA Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Control who can view your credentials, monitor employer inspections, and exercise your statutory data subject rights.
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

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">

          {/* Section 7: Granular Visibility Controls */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Profile Audience & Visibility Toggles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Public Visibility */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Public Profile Visibility</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Allow verified credentials to be viewed via direct passport URL.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.publicVisibility}
                  onChange={(e) => onUpdateSetting('publicVisibility', e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Verified Employers Only */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Verified Employers Only</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Only KYC-authenticated enterprise employers can view full credentials.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.verifiedEmployersOnly}
                  onChange={(e) => onUpdateSetting('verifiedEmployersOnly', e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Applied Employers Only */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Strict Applied-Only Mode</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Restrict access exclusively to employers you have actively submitted applications to.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.appliedEmployersOnly}
                  onChange={(e) => onUpdateSetting('appliedEmployersOnly', e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Search Engine Indexing */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Search Engine Indexing</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Allow Google/Bing to index your public verified career passport.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.searchEngineIndexing}
                  onChange={(e) => onUpdateSetting('searchEngineIndexing', e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

            </div>
          </div>

          {/* Who Viewed My Profile Real-Time Audit */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Who Viewed My Profile Audit Log
                </h3>
                <p className="text-xs text-slate-500">Every external employer and auditor viewing your profile is recorded with declared reason.</p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {privacy.whoViewedMe.length} Views Recorded
              </span>
            </div>

            <div className="space-y-3">
              {privacy.whoViewedMe.map(view => (
                <div 
                  key={view.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{view.viewerName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{view.organisation}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">Reason: {view.accessReason}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {view.sectionsViewed.map(sec => (
                        <span key={sec} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded-md font-medium">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 flex-shrink-0">
                    {new Date(view.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 52: Data Subject Rights (KDPA / GDPR) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Statutory Data Subject Rights
            </h3>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleDownloadData}
                className="px-5 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all flex items-center gap-2 shadow-sm"
              >
                <Icon name="arrowDownTray" className="w-4 h-4" />
                {downloadSuccess ? 'Dossier Downloaded!' : 'Download Complete Verified Dossier (JSON / Archive)'}
              </button>

              <button
                onClick={() => setErasureModal(true)}
                className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-2"
              >
                <Icon name="trash" className="w-4 h-4" />
                Request Data Erasure (Right to be Forgotten)
              </button>
            </div>

            {erasureModal && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 space-y-2">
                <p className="font-bold">Confirmation Required for Data Erasure Request</p>
                <p>
                  Per Section 40 of KDPA, initiating erasure permanently purges all non-statutory candidate data and revokes your VerifiedHire Professional Passport seal. Primary-source fraud records, if any, are retained under statutory compliance obligations.
                </p>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      alert('Your erasure ticket #ER-2024-091 has been logged and assigned to the Data Protection Officer.');
                      setErasureModal(false);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
                  >
                    Submit Erasure Request
                  </button>
                  <button 
                    onClick={() => setErasureModal(false)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
