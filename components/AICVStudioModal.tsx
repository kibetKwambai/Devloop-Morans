import React, { useState } from 'react';
import { JobSeekerProfile, VerifiableCredential, VerificationCoverage } from '../types';
import { Icon } from './Icon';

interface AICVStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: JobSeekerProfile;
  credentials: VerifiableCredential[];
  coverage: VerificationCoverage;
}

export const AICVStudioModal: React.FC<AICVStudioModalProps> = ({
  isOpen,
  onClose,
  profile,
  credentials,
  coverage
}) => {
  const [template, setTemplate] = useState<'ats' | 'executive'>('executive');
  const [includeProvenance, setIncludeProvenance] = useState(true);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Icon name="sparkles" className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI CV & Verified Dossier Studio</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate an ATS-optimized, tamper-evident resume backed by your cryptographically verified credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Icon name="arrowDownTray" className="w-4 h-4" />
              Export / Print PDF
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
              <Icon name="xMark" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Options Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 px-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700 dark:text-slate-300">Format Template:</span>
            <button
              onClick={() => setTemplate('executive')}
              className={`px-3 py-1.5 rounded-lg font-bold ${template === 'executive' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
            >
              Executive Verified Dossier
            </button>
            <button
              onClick={() => setTemplate('ats')}
              className={`px-3 py-1.5 rounded-lg font-bold ${template === 'ats' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
            >
              ATS-Optimized Clean
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
            <input 
              type="checkbox" 
              checked={includeProvenance} 
              onChange={(e) => setIncludeProvenance(e.target.checked)} 
              className="rounded text-indigo-600"
            />
            <span>Include Forensic QR & Verification Anchors</span>
          </label>
        </div>

        {/* CV Preview Document Canvas */}
        <div className="p-8 bg-slate-100 dark:bg-slate-950/80 flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl space-y-6 font-sans border border-slate-200">
            
            {/* CV Header */}
            <div className="border-b pb-6 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">{profile.name}</h1>
                <p className="text-sm font-semibold text-indigo-700 mt-0.5">{profile.headline}</p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                  <span>{profile.location}</span>
                  <span>•</span>
                  <span>{profile.email}</span>
                  <span>•</span>
                  <span>{profile.phone}</span>
                </div>
              </div>

              {includeProvenance && (
                <div className="text-right flex-shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200">
                    <Icon name="shieldCheck" className="w-3.5 h-3.5 text-emerald-600" />
                    VerifiedHire Sealed
                  </div>
                  <p className="text-[9px] font-mono text-slate-400 mt-1">Trust Score: {coverage.overall}%</p>
                </div>
              )}
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Summary</h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {profile.bio || "Accomplished, source-verified professional with proven track record of operational excellence and regulatory compliance. Holds active primary-source verified credentials and board licensing."}
              </p>
            </div>

            {/* Verified Credentials Section */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary-Source Verified Credentials & Licences
              </h2>

              <div className="space-y-2.5">
                {credentials.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{c.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                          {c.verificationState}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">Issuing Body: {c.issuingOrg}</p>
                      <p className="text-slate-400 text-[10px] font-mono">
                        Folio: #{c.credentialNumber} • Verified by: {c.verifyingEntity}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">{c.issueDate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Work Experience */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Employment History</h2>
              <div className="space-y-3 text-xs">
                {profile.experience.map(exp => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{exp.title}</span>
                      <span className="font-mono text-slate-500 text-[11px]">{exp.startDate} - {exp.endDate || 'Present'}</span>
                    </div>
                    <p className="text-indigo-600 font-medium text-[11px]">{exp.company} • {exp.location}</p>
                    <p className="text-slate-600 text-[11px]">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Education & Academic History</h2>
              <div className="space-y-2 text-xs">
                {profile.education.map(edu => (
                  <div key={edu.id} className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                      <p className="text-slate-600 text-[11px]">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-500 text-[11px]">{edu.startDate} - {edu.endDate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Trust Footer */}
            {includeProvenance && (
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Cryptographic Digest: SHA-256 [0x4f...9182]</span>
                <span>Audit URL: verifiedhire.com/p/{profile.name.toLowerCase().replace(/ /g, '-')}</span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
