import React from 'react';
import { JobSeekerProfile, VerificationStatus } from '../types';
import { Icon } from './Icon';
import { useAppContext } from './AppContext';

interface CandidateCardProps {
  profile: JobSeekerProfile;
  onViewProfile: (profileId: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (profileId: string) => void;
  onViewAuditTrail?: (profile: JobSeekerProfile) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ 
  profile, 
  onViewProfile,
  isSelected = false,
  onToggleSelect,
  onViewAuditTrail
}) => {
  const { toggleShortlist } = useAppContext();

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 flex flex-col space-y-4 hover:shadow-md transition-all duration-300 relative border ${
      isSelected 
        ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/20 dark:bg-indigo-950/20' 
        : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
    }`}>
      {/* Top action row with checkbox and star */}
      <div className="flex items-center justify-between">
        {onToggleSelect ? (
          <label className="flex items-center gap-2 cursor-pointer" onClick={e => e.stopPropagation()}>
            <input 
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(profile.id)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-[11px] font-mono font-semibold text-slate-400">#VH-{profile.id.slice(-4).toUpperCase()}</span>
          </label>
        ) : (
          <span className="text-[11px] font-mono font-semibold text-slate-400">#VH-{profile.id.slice(-4).toUpperCase()}</span>
        )}

        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleShortlist(profile.id);
          }} 
          className="text-slate-300 dark:text-slate-600 hover:text-amber-500 dark:hover:text-amber-400 transition-colors p-1"
          aria-label="Shortlist candidate"
        >
          <Icon name="star" className={`h-5 w-5 ${profile.isShortlisted ? 'text-amber-400 fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex items-center space-x-3.5">
        <div className="relative">
          <img 
            className="h-14 w-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 border border-slate-200 dark:border-slate-700" 
            src={profile.photoUrl || profile.avatar} 
            alt={profile.name} 
          />
          {profile.verificationStatus === VerificationStatus.VERIFIED && (
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="Verified & Authentic">
              <Icon name="check" className="h-2.5 w-2.5" />
            </div>
          )}
          {profile.verificationStatus === VerificationStatus.AUTHENTICATED && (
            <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="Fully Authenticated">
              <Icon name="shieldCheck" className="h-2.5 w-2.5" />
            </div>
          )}
          {profile.verificationStatus === VerificationStatus.PENDING && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="Pending Verification">
              <Icon name="loader" className="h-2.5 w-2.5 animate-spin" />
            </div>
          )}
          {profile.verificationStatus === VerificationStatus.FLAGGED && (
            <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="Flagged / Suspicious">
              <Icon name="xMark" className="h-2.5 w-2.5" />
            </div>
          )}
          {profile.verificationStatus === VerificationStatus.SUSPICIOUS_ACTIVITY && (
            <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs animate-pulse" title="Suspicious Activity Detected">
              <Icon name="exclamationTriangle" className="h-2.5 w-2.5" />
            </div>
          )}
          {profile.verificationStatus === VerificationStatus.REJECTED && (
            <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="Rejected">
              <Icon name="xCircle" className="h-2.5 w-2.5" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
            {profile.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile.headline}</p>
          <div className="flex items-center text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            <Icon name="mapPin" className="h-3 w-3 mr-1" />
            {profile.location}
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Verified Skills</h4>
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 3).map(skill => (
            <span key={skill.id} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex-grow flex items-end gap-2">
        {onViewAuditTrail && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewAuditTrail(profile);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="View cryptographic verification logs and history"
          >
            <Icon name="fingerprint" className="h-3.5 w-3.5 text-indigo-500" />
            <span>Audit Log</span>
          </button>
        )}
        <button 
          onClick={() => onViewProfile(profile.id)}
          className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 shadow-xs transition-all active:scale-[0.98]"
        >
          View Passport
        </button>
      </div>
    </div>
  );
};
