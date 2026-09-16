import React, { useState } from 'react';
import { JobSeekerProfile, UserRole, VerificationStatus } from '../types';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSection } from './ProfileSection';
import { WorkExperienceCard } from './WorkExperienceCard';
import { EducationCard } from './EducationCard';
import { SkillsCard } from './SkillsCard';
import { DocumentsCard } from './DocumentsCard';
import { Icon } from './Icon';
import { useAppContext } from './AppContext';
import { RejectionModal } from './RejectionModal';
import { ProfessionalPassportModal } from './ProfessionalPassportModal';
import { SensitiveDataVaultModal } from './SensitiveDataVaultModal';

interface ProfileViewProps {
  profile: JobSeekerProfile;
  viewerRole: UserRole;
  onBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, viewerRole, onBack }) => {
  const { updateProfileStatus, credentials, coverage } = useAppContext();
  const [isRejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [isPassportModalOpen, setPassportModalOpen] = useState(false);
  const [isVaultModalOpen, setVaultModalOpen] = useState(false);

  const handleApprove = () => {
    updateProfileStatus(profile.id, VerificationStatus.VERIFIED);
    onBack();
  };

  const handleReject = (reason: string) => {
    updateProfileStatus(profile.id, VerificationStatus.REJECTED, reason);
    setRejectionModalOpen(false);
    onBack();
  };
  
  const AdminActions = () => (
    <div className="flex items-center space-x-3">
        <button
            onClick={() => setRejectionModalOpen(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
            <Icon name="xMark" className="h-5 w-5 mr-2" />
            Reject
        </button>
        <button
            onClick={handleApprove}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
            <Icon name="check" className="h-5 w-5 mr-2" />
            Approve
        </button>
    </div>
  );

  const EmployerActions = () => (
     <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
        <Icon name="mail" className="h-5 w-5 mr-2" />
        Contact Candidate
      </button>
  );

  return (
    <>
      <RejectionModal 
        isOpen={isRejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        onSubmit={handleReject}
      />
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600">
                <Icon name="arrowLeft" className="h-5 w-5 mr-2" />
                Back to list
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
                <button
                    onClick={() => setPassportModalOpen(true)}
                    className="px-3.5 py-2 bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm border border-slate-700"
                >
                    <Icon name="shieldCheck" className="w-4 h-4 text-emerald-400" />
                    Inspect Professional Passport ({coverage.overall}%)
                </button>

                <button
                    onClick={() => setVaultModalOpen(true)}
                    className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                    <Icon name="lockClosed" className="w-4 h-4 text-amber-600" />
                    Sensitive Data Vault
                </button>

                {viewerRole === UserRole.Admin && profile.verificationStatus === VerificationStatus.PENDING && <AdminActions />}
                {viewerRole === UserRole.Employer && <EmployerActions />}
            </div>
        </div>
        
        {/* Pass viewerRole to hide AI generator for others */}
        <ProfileHeader profile={profile} viewerRole={viewerRole} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProfileSection title="Work Experience" iconName="briefcase">
              <WorkExperienceCard experience={profile.workExperience} />
            </ProfileSection>
            <ProfileSection title="Education" iconName="academicCap">
              <EducationCard education={profile.education} />
            </ProfileSection>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <ProfileSection title="Job Interests" iconName="star">
              <div className="flex flex-wrap gap-2">
                {profile.jobInterests.map((interest, idx) => (
                  <span key={idx} className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/30">
                    {interest}
                  </span>
                ))}
              </div>
            </ProfileSection>

            <ProfileSection title="Personal Information" iconName="user">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Blood Group</p>
                  <p className="text-slate-900 dark:text-white font-medium">{profile.personalInfo?.bloodGroup || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Tribe</p>
                  <p className="text-slate-900 dark:text-white font-medium">{profile.personalInfo?.tribe || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Height / Weight</p>
                  <p className="text-slate-900 dark:text-white font-medium">{profile.personalInfo?.height || 'N/A'} / {profile.personalInfo?.weight || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">BMI</p>
                  <p className="text-slate-900 dark:text-white font-medium">{profile.personalInfo?.bmi || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Gender</p>
                  <p className="text-slate-900 dark:text-white font-medium">{profile.personalInfo?.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Nationality</p>
                  <p className="text-slate-900 dark:text-white font-medium">{profile.personalInfo?.nationality || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Marital Status</p>
                  <p className="text-slate-900 dark:text-white font-medium">{profile.personalInfo?.maritalStatus || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Languages</p>
                  <p className="text-slate-900 dark:text-white font-medium">{profile.languages?.join(', ') || 'N/A'}</p>
                </div>
              </div>
            </ProfileSection>

            <ProfileSection title="Health & Legal" iconName="shieldCheck">
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Health Condition</p>
                        <p className="text-slate-900 dark:text-white font-medium">{profile.healthInfo?.condition || 'Excellent'}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Vaccination</p>
                        <p className="text-slate-900 dark:text-white font-medium">{profile.healthInfo?.vaccinationStatus || 'Verified'}</p>
                    </div>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Police Clearance</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center">
                        <Icon name="checkCircle" className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-slate-900 dark:text-white font-medium">Verified Clearance</span>
                    </div>
                    {profile.legalInfo?.policeClearanceExpiry && (
                        <span className="text-xs text-slate-500 dark:text-indigo-400 italic">Expires: {profile.legalInfo.policeClearanceExpiry}</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Criminal Record</p>
                        <p className={`font-bold ${profile.legalInfo?.hasCriminalRecord ? 'text-red-600' : 'text-green-600'}`}>
                            {profile.legalInfo?.hasCriminalRecord ? 'Record Found' : 'No Record Found'}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">KRA Compliance</p>
                        <p className={`font-bold ${profile.legalInfo?.kRACompliance ? 'text-green-600' : 'text-amber-600'}`}>
                            {profile.legalInfo?.kRACompliance ? 'Compliant' : 'Pending'}
                        </p>
                    </div>
                </div>
                {profile.legalInfo?.securityClearanceLevel && (
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <p className="text-slate-500 dark:text-indigo-400 text-xs uppercase font-bold tracking-wider">Security Clearance</p>
                    <p className="text-slate-900 dark:text-white font-bold text-lg">{profile.legalInfo.securityClearanceLevel}</p>
                    {profile.legalInfo.securityClearanceExpiry && (
                        <p className="text-xs text-slate-500 dark:text-indigo-400 mt-1">Valid until: {profile.legalInfo.securityClearanceExpiry}</p>
                    )}
                  </div>
                )}
              </div>
            </ProfileSection>

            <ProfileSection title="Skills" iconName="sparkles">
              <SkillsCard skills={profile.skills} />
            </ProfileSection>
            <ProfileSection title="Documents & Certifications" iconName="document">
              {/* Pass viewerRole to hide upload button for others */}
              <DocumentsCard documents={profile.documents} viewerRole={viewerRole} />
            </ProfileSection>
          </div>
        </div>
      </div>

      <ProfessionalPassportModal
        isOpen={isPassportModalOpen}
        onClose={() => setPassportModalOpen(false)}
        credentials={credentials}
        coverage={coverage}
      />

      <SensitiveDataVaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setVaultModalOpen(false)}
      />
    </>
  );
};
