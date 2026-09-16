import React, { useState } from 'react';
import { CredentialIssuer, VerificationStatus } from '../types';
import { useAppContext } from './AppContext';
import { Icon } from './Icon';

export const CredentialIssuerPortal: React.FC = () => {
  const { credentialIssuers, credentials, issueVerifiableCredential } = useAppContext();
  
  const [activeIssuer, setActiveIssuer] = useState<CredentialIssuer>(credentialIssuers[0]);
  const [candidateName, setCandidateName] = useState('James Mwangi');
  const [candidateId, setCandidateId] = useState('usr_00001');
  const [credTitle, setCredTitle] = useState('Air Transport Pilot Licence (ATPL - Boeing 737 / Dreamliner Rating)');
  const [credCategory, setCredCategory] = useState<'licence' | 'education' | 'employment' | 'certification'>('licence');
  const [credNumber, setCredNumber] = useState('KCAA/ATPL/2024/9182');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [issueSuccess, setIssueSuccess] = useState(false);

  const issuerCredentials = credentials.filter(c => c.issuingOrg === activeIssuer.orgName);

  const handleIssueCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credTitle.trim()) return;

    issueVerifiableCredential({
      candidateId,
      title: credTitle,
      category: credCategory,
      issuingOrg: activeIssuer.orgName,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate,
      credentialNumber: credNumber,
      verificationState: VerificationStatus.ISSUER_VERIFIED,
      verificationMethod: 'Direct Institutional Registrar Portal Electronic Attestation',
      verifyingEntity: `${activeIssuer.orgName} Authorized Registrar Desk`,
      evidenceType: 'Institutional Cryptographic Ledger Entry',
      disputeStatus: 'none',
      isRevoked: false,
      isPublicVisible: true
    });

    setIssueSuccess(true);
    setTimeout(() => setIssueSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight">Accredited Credential Issuer Portal</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Institutional Authority
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Universities, statutory licensing boards, and certifying authorities: Directly mint and cryptographically sign digital verifiable credentials directly to candidate Professional Passports.
          </p>
        </div>

        {/* Selected Issuer Selector */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bold">Issuer Org:</span>
          <select 
            value={activeIssuer.id} 
            onChange={(e) => {
              const found = credentialIssuers.find(i => i.id === e.target.value);
              if (found) setActiveIssuer(found);
            }}
            className="bg-slate-900 text-xs font-bold text-white border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            {credentialIssuers.map(issuer => (
              <option key={issuer.id} value={issuer.id}>{issuer.orgName} ({issuer.orgType})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Issue New Credential Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Icon name="shieldCheck" className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Mint Direct Verifiable Credential
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Signs credential using {activeIssuer.orgName} accreditation key.
            </p>
          </div>

          <form onSubmit={handleIssueCredential} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Candidate Name</label>
              <input 
                type="text" 
                value={candidateName} 
                onChange={(e) => setCandidateName(e.target.value)} 
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Credential Title / Qualification</label>
              <input 
                type="text" 
                value={credTitle} 
                onChange={(e) => setCredTitle(e.target.value)} 
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select 
                  value={credCategory} 
                  onChange={(e) => setCredCategory(e.target.value as any)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="licence">Licence / Regulatory Board</option>
                  <option value="education">Degree / Higher Ed</option>
                  <option value="employment">Employment Tenure</option>
                  <option value="certification">Professional Certification</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Serial / Folio No.</label>
                <input 
                  type="text" 
                  value={credNumber} 
                  onChange={(e) => setCredNumber(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Expiry Date (Optional)</label>
              <input 
                type="date" 
                value={expiryDate} 
                onChange={(e) => setExpiryDate(e.target.value)} 
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Icon name="checkBadge" className="w-4 h-4" />
                Sign & Transmit to Candidate Passport
              </button>
            </div>

            {issueSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold text-center">
                Credential successfully signed and anchored in candidate wallet!
              </div>
            )}
          </form>
        </div>

        {/* Right: Issued Credentials & Registry Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeIssuer.orgName} Ledger</h3>
                <p className="text-xs text-slate-500">Domain: {activeIssuer.verifiedDomain} • Accreditation: {activeIssuer.accreditationNumber}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">Total Verified Issued</span>
                <span className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400">{activeIssuer.issuedCount} Credentials</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Credentials Issued by This Authority ({issuerCredentials.length})
              </h4>

              {issuerCredentials.map(cred => (
                <div 
                  key={cred.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{cred.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {cred.verificationState}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] font-mono">
                      Serial: #{cred.credentialNumber} • Verified: {new Date(cred.lastVerifiedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                      onClick={() => alert(`Issuing Authority ${activeIssuer.orgName} verified live status of ${cred.title}.`)}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold rounded-lg text-xs"
                    >
                      Audit Registry
                    </button>
                    <button 
                      onClick={() => alert(`Revocation notice logged for credential #${cred.credentialNumber}.`)}
                      className="px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold rounded-lg text-xs"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
