
import React, { useState, useEffect, useMemo } from 'react';
import { JobSeekerProfile, VerificationStatus, UserRole, Application, Job } from '../types';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSection } from './ProfileSection';
import { WorkExperienceCard } from './WorkExperienceCard';
import { EducationCard } from './EducationCard';
import { SkillsCard } from './SkillsCard';
import { DocumentsCard } from './DocumentsCard';
import { Icon, IconName } from './Icon';
import { useAppContext } from './AppContext';
import { ProfileForm } from './ProfileForm';
import { JobBoard } from './JobBoard';
import { ProfessionalPassportModal } from './ProfessionalPassportModal';
import { SensitiveDataVaultModal } from './SensitiveDataVaultModal';
import { PrivacyControlCenterModal } from './PrivacyControlCenterModal';
import { AICVStudioModal } from './AICVStudioModal';
import { DigitalProfessionalCardModal } from './DigitalProfessionalCardModal';
import { VerificationMarketplaceModal } from './VerificationMarketplaceModal';
import { VerifiedHireLogo, VerifiedHireIconMark } from './VerifiedHireLogo';
import { CandidateDossierBuilder } from './CandidateDossierBuilder';

const StatCard: React.FC<{ icon: IconName; value: string; label: string; color: string }> = ({ icon, value, label, color }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center transition-all hover:shadow-md">
        <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${color} flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
            <Icon name={icon} className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

const DashboardStats: React.FC<{ applications: Application[] }> = ({ applications }) => {
    const stats = [
        { icon: 'briefcase' as IconName, value: String(applications.length), label: 'Total Applications', color: 'bg-indigo-600' },
        { icon: 'search' as IconName, value: '42', label: 'Search Appearances', color: 'bg-emerald-600' },
        { icon: 'star' as IconName, value: String(applications.filter(a => a.status === 'Shortlisted').length), label: 'Shortlisted', color: 'bg-amber-600' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map(stat => (
                <StatCard key={stat.label} {...stat} />
            ))}
        </div>
    );
};

const ApplicationItem: React.FC<{ application: Application, job: Job, onRespond: (id: string, status: 'Accepted' | 'Rejected') => void }> = ({ application, job, onRespond }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-all">
        <div className="flex items-center">
            <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200/60 dark:border-slate-700 overflow-hidden flex-shrink-0">
                {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                    <Icon name="briefcase" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                )}
            </div>
            <div className="ml-4">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{job.companyName} • {application.interestedOnly ? 'Interested' : 'Applied'} {new Date(application.appliedAt).toLocaleDateString()}</p>
            </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    application.status === 'Shortlisted' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    application.status === 'Offered' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    application.status === 'Accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    application.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                    {application.status}
                </span>
                {application.interestedOnly && !application.status.includes('Accepted') && (
                    <span className="text-[10px] font-bold text-amber-600 mt-1 uppercase tracking-tighter">Interested Only</span>
                )}
            </div>
            
            {application.status === 'Offered' && (
                <div className="flex gap-2">
                    <button 
                        onClick={() => onRespond(application.id, 'Accepted')}
                        className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-all"
                    >
                        Accept
                    </button>
                    <button 
                        onClick={() => onRespond(application.id, 'Rejected')}
                        className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-all"
                    >
                        Reject
                    </button>
                </div>
            )}

            <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Icon name="chevronRight" className="h-5 w-5" />
            </button>
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
  const { 
    currentUserId,
    getLoggedInSeeker, 
    updateProfileStatus, 
    updateProfile, 
    applications, 
    jobs, 
    respondToOffer,
    credentials,
    coverage,
    sensitiveVault,
    privacySettings
  } = useAppContext();

  const currentSeeker = useMemo(() => getLoggedInSeeker(), [getLoggedInSeeker, currentUserId]);
  const [editingProfile, setEditingProfile] = useState<JobSeekerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'applications'>('profile');
  const [showOfferModal, setShowOfferModal] = useState<{ id: string, status: 'Accepted' | 'Rejected' } | null>(null);
  const [feedback, setFeedback] = useState('');

  // Reset editing state when active test account switches
  useEffect(() => {
    setIsEditing(false);
    setEditingProfile(null);
  }, [currentUserId]);

  const profile = editingProfile || currentSeeker;

  // Enterprise Modals State
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [cvStudioModalOpen, setCvStudioModalOpen] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [marketplaceModalOpen, setMarketplaceModalOpen] = useState(false);

  const userApplications = useMemo(() => {
    if (!profile) return [];
    return applications.filter(a => a.jobSeekerId === profile.id);
  }, [applications, profile]);

  const applicationJobs = useMemo(() => {
    const map: Record<string, Job> = {};
    jobs.forEach(j => map[j.id] = j);
    return map;
  }, [jobs]);
  
  const handleSubmitForVerification = () => {
      if (profile) {
        updateProfileStatus(profile.id, VerificationStatus.PENDING);
      }
  };

  const handleSaveProfile = (updatedProfile: JobSeekerProfile) => {
    updateProfile(updatedProfile);
    setIsEditing(false);
  }

  const handleRespondToOffer = () => {
    if (showOfferModal) {
        respondToOffer(showOfferModal.id, showOfferModal.status, feedback);
        setShowOfferModal(null);
        setFeedback('');
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icon name="loader" className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        <span className="ml-4 text-lg text-slate-600 dark:text-slate-300">Loading Your Profile...</span>
      </div>
    );
  }

  if (isEditing) {
    return <ProfileForm profile={profile} onSave={handleSaveProfile} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
        >
            My Profile
        </button>
        <button 
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'applications' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
        >
            My Applications
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Enterprise Trust Architecture Command Center */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-indigo-900/50 space-y-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
                    <VerifiedHireIconMark size={220} />
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                            <VerifiedHireLogo variant="badge" size="xs" />
                            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Cryptographic Trust Protocol
                            </span>
                            <span className="text-xs text-indigo-300 font-mono">
                                Coverage Score: <strong className="text-emerald-400 font-bold">{coverage.overall}%</strong>
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                            Professional Passport & Sovereign Trust Vault
                        </h2>
                        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                            Primary-source verified digital credentials, Kenya Data Protection Act (KDPA) statutory data vaults, recruiter access controls, and ATS export.
                        </p>
                    </div>

                    {/* Coverage Mini Meter */}
                    <div className="flex items-center gap-4 bg-slate-800/80 p-3.5 px-5 rounded-2xl border border-slate-700/80 flex-shrink-0">
                        <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Trust Coverage</span>
                            <span className="text-2xl font-black text-emerald-400 font-mono">{coverage.overall}%</span>
                        </div>
                        <div className="h-10 w-px bg-slate-700" />
                        <div className="text-[11px] text-slate-300 space-y-0.5">
                            <p>Licences: <span className="font-mono text-emerald-400 font-bold">{coverage.licences}%</span></p>
                            <p>Education: <span className="font-mono text-emerald-400 font-bold">{coverage.education}%</span></p>
                            <p>Tenure: <span className="font-mono text-emerald-400 font-bold">{coverage.employment}%</span></p>
                        </div>
                    </div>
                </div>

                {/* Quick Action Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
                    <button
                        onClick={() => setPassportModalOpen(true)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <Icon name="shieldCheck" className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-mono text-emerald-300">{credentials.length}</span>
                        </div>
                        <span className="text-xs font-bold block truncate">Passport</span>
                        <span className="text-[10px] text-slate-400">Trust Chains</span>
                    </button>

                    <button
                        onClick={() => setVaultModalOpen(true)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <Icon name="lockClosed" className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-mono text-amber-300">{sensitiveVault.accessLogs.length} logs</span>
                        </div>
                        <span className="text-xs font-bold block truncate">Data Vault</span>
                        <span className="text-[10px] text-slate-400">KDPA Privacy</span>
                    </button>

                    <button
                        onClick={() => setPrivacyModalOpen(true)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <Icon name="eye" className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-mono text-blue-300">Active</span>
                        </div>
                        <span className="text-xs font-bold block truncate">Privacy Center</span>
                        <span className="text-[10px] text-slate-400">Consent & Erasure</span>
                    </button>

                    <button
                        onClick={() => setCvStudioModalOpen(true)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <Icon name="documentCheck" className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-mono text-indigo-300">Dossier</span>
                        </div>
                        <span className="text-xs font-bold block truncate">ATS Resume</span>
                        <span className="text-[10px] text-slate-400">Verified Dossier</span>
                    </button>

                    <button
                        onClick={() => setCardModalOpen(true)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <Icon name="qrcode" className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-mono text-indigo-300">QR</span>
                        </div>
                        <span className="text-xs font-bold block truncate">Digital Card</span>
                        <span className="text-[10px] text-slate-400">Live Share Link</span>
                    </button>

                    <button
                        onClick={() => setMarketplaceModalOpen(true)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <Icon name="creditCard" className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-mono text-emerald-300">Audit</span>
                        </div>
                        <span className="text-xs font-bold block truncate text-emerald-300">Order Check</span>
                        <span className="text-[10px] text-emerald-400/80">Audit Credits</span>
                    </button>
                </div>
            </div>

            <DashboardStats applications={userApplications} />

            {profile.verificationStatus === VerificationStatus.REJECTED && profile.rejectionReason && (
                <RejectionNotice reason={profile.rejectionReason} onResubmit={handleSubmitForVerification} />
            )}
            {profile.verificationStatus === VerificationStatus.DRAFT && (
                <DraftNotice onSubmit={handleSubmitForVerification} />
            )}

            <ProfileHeader profile={profile} viewerRole={UserRole.JobSeeker} />

            {/* Complete Phase P0-P9 Verifiable Dossier Builder */}
            <CandidateDossierBuilder
              profile={profile}
              viewerRole={UserRole.JobSeeker}
              isOwner={true}
              onUpdateProfile={handleSaveProfile}
            />
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Applications</h2>
            {userApplications.length > 0 ? (
                <div className="space-y-4">
                    {userApplications.map(app => (
                        <ApplicationItem 
                            key={app.id} 
                            application={app} 
                            job={applicationJobs[app.jobId]} 
                            onRespond={(id, status) => setShowOfferModal({ id, status })}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center">
                    <Icon name="briefcase" className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No applications yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Start your career journey by applying to jobs on the job board.</p>
                </div>
            )}
        </div>
      )}

      {showOfferModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {showOfferModal.status === 'Accepted' ? 'Accept Offer' : 'Reject Offer'}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {showOfferModal.status === 'Accepted' 
                            ? 'Congratulations! You are about to accept this job offer.' 
                            : 'We are sorry to hear that. Please let the employer know why.'}
                      </p>
                  </div>
                  <div className="p-8 space-y-6">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                              {showOfferModal.status === 'Accepted' ? 'Message to Employer (Optional)' : 'Reason for Rejection (Optional)'}
                          </label>
                          <textarea 
                              rows={4} 
                              value={feedback} 
                              onChange={(e) => setFeedback(e.target.value)} 
                              placeholder="Add a message or feedback..." 
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white resize-none text-sm"
                          ></textarea>
                      </div>
                      <div className="flex gap-4">
                          <button 
                              onClick={() => setShowOfferModal(null)}
                              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer text-sm"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleRespondToOffer}
                              className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer text-sm ${
                                  showOfferModal.status === 'Accepted' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                              }`}
                          >
                              Confirm {showOfferModal.status}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Enterprise Modals */}
      <ProfessionalPassportModal
        isOpen={passportModalOpen}
        onClose={() => setPassportModalOpen(false)}
        credentials={credentials}
        coverage={coverage}
      />

      <SensitiveDataVaultModal
        isOpen={vaultModalOpen}
        onClose={() => setVaultModalOpen(false)}
      />

      <PrivacyControlCenterModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {profile && (
        <>
          <AICVStudioModal
            isOpen={cvStudioModalOpen}
            onClose={() => setCvStudioModalOpen(false)}
            profile={profile}
            credentials={credentials}
            coverage={coverage}
          />

          <DigitalProfessionalCardModal
            isOpen={cardModalOpen}
            onClose={() => setCardModalOpen(false)}
            profile={profile}
            credentials={credentials}
            coverage={coverage}
          />
        </>
      )}

      <VerificationMarketplaceModal
        isOpen={marketplaceModalOpen}
        onClose={() => setMarketplaceModalOpen(false)}
      />
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
