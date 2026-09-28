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
import { CandidateDossierBuilder } from './CandidateDossierBuilder';

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
  const [copiedLinkNotice, setCopiedLinkNotice] = useState(false);
  
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

  const handleCopyProfileLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLinkNotice(true);
      setTimeout(() => setCopiedLinkNotice(false), 2500);
    }
  };

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

        {/* Phase P0-P9 Complete Candidate Dossier */}
        <CandidateDossierBuilder 
          profile={profile} 
          viewerRole={viewerRole} 
          isOwner={viewerRole === UserRole.JobSeeker} 
        />
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
