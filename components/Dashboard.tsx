
import React, { useState, useEffect } from 'react';
import { JobSeekerProfile, VerificationStatus, UserRole } from '../types';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSection } from './ProfileSection';
import { WorkExperienceCard } from './WorkExperienceCard';
import { EducationCard } from './EducationCard';
import { SkillsCard } from './SkillsCard';
import { DocumentsCard } from './DocumentsCard';
import { Icon, IconName } from './Icon';
import { useAppContext } from './AppContext';
import { ProfileForm } from './ProfileForm';

const StatCard: React.FC<{ icon: IconName; value: string; label: string; color: string }> = ({ icon, value, label, color }) => (
    <div className="bg-white dark:bg-indigo-900 p-6 rounded-lg shadow-md flex items-center">
        <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${color} flex items-center justify-center`}>
            <Icon name={icon} className="h-7 w-7 text-white" />
        </div>
        <div className="ml-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm text-slate-500 dark:text-indigo-300">{label}</p>
        </div>
    </div>
);

const DashboardStats: React.FC = () => {
    // Mock data for the stats
    const stats = [
        { icon: 'userGroup' as IconName, value: '128', label: 'Profile Views (30 days)', color: 'bg-indigo-500' },
        { icon: 'search' as IconName, value: '42', label: 'Search Appearances', color: 'bg-emerald-500' },
        { icon: 'star' as IconName, value: '3', label: 'Times Shortlisted', color: 'bg-amber-500' },
    ];

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Your Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
        </div>
    );
};

const RejectionNotice: React.FC<{reason: string, onResubmit: () => void}> = ({ reason, onResubmit }) => (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-md mb-6" role="alert">
        <h4 className="font-bold">Profile Rejected</h4>
        <p className="mt-1">Your profile was rejected for the following reason:</p>
        <p className="mt-2 pl-2 border-l-2 border-red-200 dark:border-red-700/50 italic">"{reason}"</p>
        <p className="mt-3">Please review your profile, make the necessary corrections, and resubmit.</p>
        <button 
          onClick={onResubmit}
          className="mt-4 flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Resubmit for Verification
        </button>
    </div>
);

const DraftNotice: React.FC<{onSubmit: () => void}> = ({ onSubmit }) => (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-700 text-blue-700 dark:text-blue-300 p-4 rounded-md mb-6" role="alert">
        <h4 className="font-bold">Your Profile is a Draft</h4>
        <p className="mt-1">Your profile is not yet visible to employers. Complete all sections and submit it for verification.</p>
        <button 
          onClick={onSubmit}
          className="mt-4 flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Submit for Verification
        </button>
    </div>
);

export const Dashboard: React.FC = () => {
  const { getLoggedInSeeker, updateProfileStatus, updateProfile } = useAppContext();
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // The profile will now be reactive to context changes
    setProfile(getLoggedInSeeker());
  }, [getLoggedInSeeker]);
  
  const handleSubmitForVerification = () => {
      if (profile) {
        updateProfileStatus(profile.id, VerificationStatus.PENDING);
      }
  };

  const handleSaveProfile = (updatedProfile: JobSeekerProfile) => {
    updateProfile(updatedProfile);
    setIsEditing(false);
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icon name="loader" className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        <span className="ml-4 text-lg text-slate-600 dark:text-indigo-200">Loading Your Profile...</span>
      </div>
    );
  }

  if (isEditing) {
    return <ProfileForm profile={profile} onSave={handleSaveProfile} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="space-y-8">
      <DashboardStats />

      {profile.verificationStatus === VerificationStatus.REJECTED && profile.rejectionReason && (
          <RejectionNotice reason={profile.rejectionReason} onResubmit={handleSubmitForVerification} />
      )}
      {profile.verificationStatus === VerificationStatus.DRAFT && (
          <DraftNotice onSubmit={handleSubmitForVerification} />
      )}

      <ProfileHeader profile={profile} viewerRole={UserRole.JobSeeker} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProfileSection title="Work Experience" iconName="briefcase" onEdit={() => setIsEditing(true)} isOwner={true}>
            <WorkExperienceCard experience={profile.workExperience} />
          </ProfileSection>

          <ProfileSection title="Education" iconName="academicCap" onEdit={() => setIsEditing(true)} isOwner={true}>
            <EducationCard education={profile.education} />
          </ProfileSection>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <ProfileSection title="Skills" iconName="sparkles" onEdit={() => setIsEditing(true)} isOwner={true}>
            <SkillsCard skills={profile.skills} />
          </ProfileSection>
          
          <ProfileSection title="Documents & Certifications" iconName="document" isOwner={true}>
            <DocumentsCard documents={profile.documents} viewerRole={UserRole.JobSeeker}/>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
};