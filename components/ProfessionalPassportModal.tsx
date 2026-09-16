import React, { useState } from 'react';
import { JobSeekerProfile, VerifiableCredential, VerificationCoverage, VerificationStatus } from '../types';
import { Icon, IconName } from './Icon';

interface ProfessionalPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: JobSeekerProfile;
  credentials: VerifiableCredential[];
  coverage: VerificationCoverage;
  onDisputeCredential?: (credId: string) => void;
}

export const ProfessionalPassportModal: React.FC<ProfessionalPassportModalProps> = ({
  isOpen,
  onClose,
  profile,
  credentials,
  coverage,
  onDisputeCredential
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTrustChainCred, setActiveTrustChainCred] = useState<VerifiableCredential | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [disputeSuccessId, setDisputeSuccessId] = useState<string | null>(null);

  if (!isOpen) return null;

  const candidateCredentials = credentials.filter(c => c.candidateId === profile.id || profile.id === 'usr_00001');

  const filteredCredentials = candidateCredentials.filter(c => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://verifiedhire.com/p/${profile.name.toLowerCase().replace(/ /g, '-')}/passport`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDispute = (credId: string) => {
    if (onDisputeCredential) {
      onDisputeCredential(credId);
    }
    setDisputeSuccessId(credId);
    setTimeout(() => setDisputeSuccessId(null), 3000);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.SOURCE_VERIFIED:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
      case VerificationStatus.ISSUER_VERIFIED:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300';
      case VerificationStatus.ACCREDITED_AGENT_VERIFIED:
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-t-3xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <img 
                  src={profile.photoUrl} 
                  alt={profile.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-300 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-indigo-900 shadow-sm" title="Verified Passport">
                  <Icon name="check" className="w-3.5 h-3.5" />
                </span>
              </div>
              
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 text-indigo-200 text-xs font-bold rounded-full border border-indigo-400/30 mb-2">
                  <Icon name="shieldCheck" className="w-3.5 h-3.5 text-emerald-400" />
                  VerifiedHire Professional Passport™
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{profile.name}</h2>
                <p className="text-sm text-indigo-200 font-medium">{profile.headline}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-indigo-300">
                  <span>Passport ID: <strong className="text-white font-mono">VH-PASS-KE-91823</strong></span>
                  <span>•</span>
                  <span>Trust Ledger: <strong className="text-emerald-400">Cryptographically Anchored</strong></span>
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="text-indigo-200 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              <Icon name="xMark" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Passport Content Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">

          {/* Section 4: Verification Coverage Score Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon name="checkCircle" className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Verification Coverage Score
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Percentage of verified professional assertions. Calculated strictly from independent primary sources.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{coverage.overall}%</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Coverage</p>
                </div>
              </div>
            </div>

            {/* Individual Category Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: 'Identity', val: coverage.identity, icon: 'user' },
                { label: 'Education', val: coverage.education, icon: 'academicCap' },
                { label: 'Licences', val: coverage.licences, icon: 'shieldCheck' },
                { label: 'Employment', val: coverage.employment, icon: 'briefcase' },
                { label: 'Skills', val: coverage.skills, icon: 'sparkles' },
                { label: 'References', val: coverage.references, icon: 'document' },
              ].map(m => (
                <div key={m.label} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{m.label}</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">{m.val}%</p>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${m.val === 100 ? 'bg-emerald-500' : m.val >= 70 ? 'bg-indigo-600' : 'bg-amber-500'}`}
                      style={{ width: `${m.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <Icon name="informationCircle" className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>{coverage.auditExplanation}</span>
            </div>
          </div>

          {/* Category Filter & Share Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Verified Claims' },
                { id: 'licence', label: 'Licences & Board Filings' },
                { id: 'education', label: 'Higher Education' },
                { id: 'employment', label: 'Employment Records' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all"
            >
              <Icon name="share" className="w-4 h-4" />
              {copiedLink ? 'Passport Link Copied!' : 'Share Public Passport URL'}
            </button>
          </div>

          {/* Verifiable Credentials List */}
          <div className="space-y-4">
            {filteredCredentials.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <Icon name="document" className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No credentials in this category</p>
                <p className="text-xs text-slate-500 mt-1">Upload licenses or certificates to request independent source verification.</p>
              </div>
            ) : (
              filteredCredentials.map(cred => (
                <div 
                  key={cred.id}
                  className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-sm transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getStatusBadge(cred.verificationState)}`}>
                          {cred.verificationState}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md uppercase">
                          {cred.category}
                        </span>
                        {cred.credentialNumber && (
                          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                            #{cred.credentialNumber}
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 dark:text-white pt-1">{cred.title}</h4>
                      
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Icon name="buildingOffice" className="w-4 h-4 text-slate-400" />
                        Issuing Authority: <strong className="text-slate-900 dark:text-white">{cred.issuingOrg}</strong>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-2 text-xs text-slate-500 dark:text-slate-400">
                        <div>
                          Verification Method: <span className="font-semibold text-slate-700 dark:text-slate-200">{cred.verificationMethod}</span>
                        </div>
                        <div>
                          Audited By: <span className="font-semibold text-slate-700 dark:text-slate-200">{cred.verifyingEntity}</span>
                        </div>
                        <div>
                          Last Verified: <span className="font-semibold text-slate-700 dark:text-slate-200">{new Date(cred.lastVerifiedAt).toLocaleDateString()}</span>
                        </div>
                        {cred.expiryDate && (
                          <div>
                            Validity / Expiry: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{cred.expiryDate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions on Credential */}
                    <div className="flex flex-row md:flex-col items-end gap-2">
                      <button
                        onClick={() => setActiveTrustChainCred(cred)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Icon name="clock" className="w-3.5 h-3.5" />
                        Inspect Trust Chain
                      </button>

                      <button
                        onClick={() => handleDispute(cred.id)}
                        className="px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-medium transition-all"
                      >
                        {disputeSuccessId === cred.id ? 'Dispute Lodged!' : 'Challenge / Dispute'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section 2: QR Code Third-Party Verification Box */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Instant Field Verification</span>
              <h4 className="text-xl font-bold">Authorized QR Verification</h4>
              <p className="text-xs text-indigo-200 max-w-xl">
                Third-party employers and regulatory inspectors can scan this QR code to access cryptographic primary-source proof without exposing confidential evidence or identity documents.
              </p>
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-lg flex-shrink-0 text-center">
              {/* Responsive SVG QR Mock with cryptographic identifier */}
              <div className="w-24 h-24 bg-slate-900 rounded-xl flex items-center justify-center text-white relative">
                <Icon name="shieldCheck" className="w-12 h-12 text-emerald-400" />
                <span className="absolute bottom-1 text-[8px] font-mono text-indigo-300">SCAN TO VERIFY</span>
              </div>
              <p className="text-[10px] font-mono text-slate-700 font-bold mt-1.5">VH-PASS-91823</p>
            </div>
          </div>
        </div>

        {/* Trust Chain Modal Overlay */}
        {activeTrustChainCred && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Credential Provenance & Chain of Custody</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{activeTrustChainCred.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Issuing Authority: {activeTrustChainCred.issuingOrg}</p>
                </div>
                <button 
                  onClick={() => setActiveTrustChainCred(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                >
                  <Icon name="xMark" className="w-5 h-5" />
                </button>
              </div>

              {/* Timeline Steps */}
              <div className="mt-6 space-y-6">
                {activeTrustChainCred.provenanceChain.map((step, idx) => (
                  <div key={step.id} className="relative flex items-start gap-4">
                    {idx < activeTrustChainCred.provenanceChain.length - 1 && (
                      <div className="absolute left-4 top-8 -bottom-6 w-0.5 bg-indigo-200 dark:bg-indigo-900" />
                    )}
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 z-10 shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{step.stepName}</span>
                        <span className="text-[10px] font-mono text-slate-500">{new Date(step.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Actor: {step.actor} ({step.actorRole})</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">{step.action}</p>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                        Methodology: {step.evidenceMethod}
                      </div>
                      {step.notes && (
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                          Result: {step.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveTrustChainCred(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Close Provenance Viewer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
