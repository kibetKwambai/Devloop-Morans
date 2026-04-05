
import React from 'react';
import { JobSeekerProfile, VerificationStatus } from '../types';
import { Icon } from './Icon';
import { useAppContext } from './AppContext';

interface CandidateCardProps {
    profile: JobSeekerProfile;
    onViewProfile: (profileId: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ profile, onViewProfile }) => {
    const { toggleShortlist } = useAppContext();

    return (
        <div className="bg-white dark:bg-indigo-900 rounded-lg shadow-md p-6 flex flex-col space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
            <button 
              onClick={() => toggleShortlist(profile.id)} 
              className="absolute top-4 right-4 text-slate-300 dark:text-slate-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              aria-label="Shortlist candidate"
            >
                <Icon name="star" className={`h-6 w-6 ${profile.isShortlisted ? 'text-yellow-400 fill-current' : ''}`} />
            </button>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-500/30" src={profile.photoUrl} alt={profile.name} />
                    {profile.verificationStatus === VerificationStatus.VERIFIED && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white dark:border-indigo-900 shadow-sm" title="Verified & Authentic">
                            <Icon name="check" className="h-3 w-3" />
                        </div>
                    )}
                    {profile.verificationStatus === VerificationStatus.AUTHENTICATED && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-indigo-900 shadow-sm" title="Fully Authenticated">
                            <Icon name="shieldCheck" className="h-3 w-3" />
                        </div>
                    )}
                    {profile.verificationStatus === VerificationStatus.PENDING && (
                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white p-1 rounded-full border-2 border-white dark:border-indigo-900 shadow-sm" title="Pending Verification">
                            <Icon name="loader" className="h-3 w-3 animate-spin" />
                        </div>
                    )}
                    {profile.verificationStatus === VerificationStatus.FLAGGED && (
                        <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-1 rounded-full border-2 border-white dark:border-indigo-900 shadow-sm" title="Flagged / Suspicious">
                            <Icon name="xMark" className="h-3 w-3" />
                        </div>
                    )}
                    {profile.verificationStatus === VerificationStatus.SUSPICIOUS_ACTIVITY && (
                        <div className="absolute -bottom-1 -right-1 bg-red-600 text-white p-1 rounded-full border-2 border-white dark:border-indigo-900 shadow-sm animate-pulse" title="Suspicious Activity Detected">
                            <Icon name="exclamationTriangle" className="h-3 w-3" />
                        </div>
                    )}
                    {profile.verificationStatus === VerificationStatus.REJECTED && (
                        <div className="absolute -bottom-1 -right-1 bg-red-500 text-white p-1 rounded-full border-2 border-white dark:border-indigo-900 shadow-sm" title="Rejected">
                            <Icon name="xCircle" className="h-3 w-3" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                        {profile.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-indigo-300 truncate">{profile.headline}</p>
                    <div className="flex items-center text-xs text-slate-400 dark:text-indigo-400 mt-1">
                        <Icon name="mapPin" className="h-3 w-3 mr-1" />
                        {profile.location}
                    </div>
                </div>
            </div>
            
            <div>
                <h4 className="text-xs font-semibold text-slate-400 dark:text-indigo-400 uppercase tracking-wider mb-2">Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                    {profile.skills.slice(0, 4).map(skill => (
                        <span key={skill.id} className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full">
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-indigo-800 flex-grow flex items-end">
                <button 
                  onClick={() => onViewProfile(profile.id)}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    View Full Profile
                </button>
            </div>
        </div>
    );
};