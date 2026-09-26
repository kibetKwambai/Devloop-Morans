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
  const { updateProfileStatus, updateProfile, credentials, coverage } = useAppContext();
  const [isRejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [isPassportModalOpen, setPassportModalOpen] = useState(false);
  const [isVaultModalOpen, setVaultModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Edit Profile form state
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editHeadline, setEditHeadline] = useState(profile.headline || '');
  const [editLocation, setEditLocation] = useState(profile.location || '');
  const [editPhone, setEditPhone] = useState(profile.phone || '');
  const [editBio, setEditBio] = useState(profile.bio || '');
  const [editStatus, setEditStatus] = useState<VerificationStatus>(profile.verificationStatus);
  const [editSkills, setEditSkills] = useState(profile.skills.map(s => s.name).join(', '));
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const handleApprove = () => {
    updateProfileStatus(profile.id, VerificationStatus.VERIFIED);
    onBack();
  };

  const handleReject = (reason: string) => {
    updateProfileStatus(profile.id, VerificationStatus.REJECTED, reason);
    setRejectionModalOpen(false);
    onBack();
  };

  const handleSaveProfileEdits = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = editSkills.split(',').map((s, idx) => ({
      id: `sk_edit_${idx}_${Date.now()}`,
      name: s.trim(),
      type: 'Hard' as const
    })).filter(s => s.name.length > 0);

    const updated: JobSeekerProfile = {
      ...profile,
      name: editName,
      email: editEmail,
      headline: editHeadline,
      location: editLocation,
      phone: editPhone,
      bio: editBio,
      verificationStatus: editStatus,
      skills: skillsArray.length > 0 ? skillsArray : profile.skills
    };

    updateProfile(updated);
    setSaveFeedback('Profile details updated successfully.');
    setTimeout(() => {
      setSaveFeedback(null);
      setIsEditModalOpen(false);
    }, 1500);
  };
  
  const AdminActions = () => (
    <div className="flex items-center space-x-2">
        <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center px-3.5 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 transition-colors cursor-pointer"
        >
            <Icon name="pencil" className="h-4 w-4 mr-1.5" />
            Edit Profile (Admin)
        </button>
        {profile.verificationStatus !== VerificationStatus.VERIFIED && (
          <button
              onClick={handleApprove}
              className="flex items-center px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
          >
              <Icon name="check" className="h-4 w-4 mr-1.5" />
              Verify & Seal
          </button>
        )}
        {profile.verificationStatus !== VerificationStatus.REJECTED && (
          <button
              onClick={() => setRejectionModalOpen(true)}
              className="flex items-center px-3.5 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
          >
              <Icon name="xMark" className="h-4 w-4 mr-1.5" />
              Flag / Reject
          </button>
        )}
    </div>
  );

  const EmployerActions = () => (
     <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
        <Icon name="mail" className="h-5 w-5 mr-2" />
        Contact Candidate
      </button>
  );

  const AgentActions = () => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setRejectionModalOpen(true)}
        className="flex items-center px-3.5 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-colors"
      >
        <Icon name="xMark" className="h-4 w-4 mr-1.5" />
        Flag Discrepancy
      </button>
      <button
        onClick={handleApprove}
        className="flex items-center px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-sm transition-colors"
      >
        <Icon name="check" className="h-4 w-4 mr-1.5" />
        Agent Attestation Seal
      </button>
    </div>
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
                {viewerRole === UserRole.Agent && <AgentActions />}
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

      {/* Admin Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Icon name="pencil" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Admin Edit Candidate Dossier</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Directly update candidate identity, title, skills, and verification status.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            {saveFeedback && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-bold text-center">
                {saveFeedback}
              </div>
            )}

            <form onSubmit={handleSaveProfileEdits} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Professional Headline</label>
                  <input
                    type="text"
                    required
                    value={editHeadline}
                    onChange={e => setEditHeadline(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Location</label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Verification Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as VerificationStatus)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={VerificationStatus.VERIFIED}>VERIFIED (Cryptographically Sealed)</option>
                    <option value={VerificationStatus.PENDING}>PENDING (Under Review)</option>
                    <option value={VerificationStatus.FLAGGED}>FLAGGED (Anomaly / Investigating)</option>
                    <option value={VerificationStatus.REJECTED}>REJECTED (Ineligible)</option>
                    <option value={VerificationStatus.DRAFT}>DRAFT (Candidate Editing)</option>
                    <option value={VerificationStatus.SOURCE_VERIFIED}>SOURCE_VERIFIED (Direct Primary Source)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={e => setEditSkills(e.target.value)}
                  placeholder="AWS, Python, Kubernetes, React"
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Professional Summary & Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
