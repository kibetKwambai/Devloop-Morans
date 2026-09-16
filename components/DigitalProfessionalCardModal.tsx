import React, { useState } from 'react';
import { JobSeekerProfile, VerifiableCredential, VerificationCoverage } from '../types';
import { Icon } from './Icon';

interface DigitalProfessionalCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: JobSeekerProfile;
  credentials: VerifiableCredential[];
  coverage: VerificationCoverage;
}

export const DigitalProfessionalCardModal: React.FC<DigitalProfessionalCardModalProps> = ({
  isOpen,
  onClose,
  profile,
  credentials,
  coverage
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cardUrl = `https://verifiedhire.com/p/${profile.name.toLowerCase().replace(/ /g, '-')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Card Visual Body */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 text-white text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/10"
          >
            <Icon name="xMark" className="w-5 h-5" />
          </button>

          <div className="relative inline-block mt-2">
            <img 
              src={profile.photoUrl} 
              alt={profile.name} 
              className="w-24 h-24 rounded-2xl object-cover mx-auto border-2 border-indigo-400 shadow-xl"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-900 shadow">
              <Icon name="check" className="w-4 h-4" />
            </span>
          </div>

          <div>
            <h3 className="text-xl font-black tracking-tight">{profile.name}</h3>
            <p className="text-xs text-indigo-200 font-medium mt-0.5">{profile.headline}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">
              Verified Professional • {coverage.overall}% Coverage Score
            </span>
          </div>

          {/* QR Code */}
          <div className="bg-white p-3 rounded-2xl shadow-lg max-w-[140px] mx-auto text-slate-900 space-y-1">
            <div className="w-full aspect-square bg-slate-900 rounded-xl flex items-center justify-center text-white relative">
              <Icon name="shieldCheck" className="w-10 h-10 text-emerald-400" />
            </div>
            <p className="text-[9px] font-mono font-bold text-slate-700">SCAN TO VERIFY</p>
          </div>

          <div className="text-[10px] font-mono text-indigo-300">
            Passport Serial: VH-KE-{profile.id.toUpperCase()}
          </div>
        </div>

        {/* Card Details & Actions */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Source Verified Badges</span>
            <div className="space-y-1.5">
              {credentials.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{c.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex-shrink-0">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleCopy}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Icon name="share" className="w-4 h-4" />
              {copied ? 'Digital Card URL Copied!' : 'Share Live Digital Card'}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
