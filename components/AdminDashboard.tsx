import React, { useState, useMemo } from 'react';
import { JobSeekerProfile, VerificationStatus, Job, UserRole } from '../types';
import { useAppContext } from './AppContext';
import { Icon, IconName } from './Icon';
import { BatchOperationsDock } from './BatchOperationsDock';
import { CandidateAuditTrail } from './CandidateAuditTrail';
import { motion, AnimatePresence } from 'motion/react';

const statusStyles: Record<VerificationStatus, string> = {
  [VerificationStatus.DRAFT]: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  [VerificationStatus.VERIFIED]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
  [VerificationStatus.AUTHENTICATED]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800',
  [VerificationStatus.PENDING]: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
  [VerificationStatus.REJECTED]: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
  [VerificationStatus.FLAGGED]: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border border-orange-300',
  [VerificationStatus.CREDENTIAL_MISMATCH]: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
  [VerificationStatus.SUSPICIOUS_ACTIVITY]: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  [VerificationStatus.SELF_DECLARED]: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  [VerificationStatus.DOCUMENT_SUBMITTED]: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  [VerificationStatus.SOURCE_VERIFIED]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300',
  [VerificationStatus.ISSUER_VERIFIED]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300',
  [VerificationStatus.ACCREDITED_AGENT_VERIFIED]: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
  [VerificationStatus.CROSS_CHECKED]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
  [VerificationStatus.EXPIRED]: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  [VerificationStatus.VERIFICATION_DUE]: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  [VerificationStatus.UNDER_REVIEW]: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  [VerificationStatus.DISPUTED]: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
  [VerificationStatus.REVOKED]: 'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-200',
  [VerificationStatus.UNABLE_TO_VERIFY]: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

type AdminSection = 'candidates' | 'jobs' | 'agentAudits' | 'governance';
type StatusFilter = 'pending' | 'verified' | 'rejected' | 'flagged' | 'all';

interface AdminDashboardProps {
  onViewProfile: (profileId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewProfile }) => {
  const { 
    profiles, 
    jobs, 
    credentials, 
    interviews, 
    applications, 
    agentCases,
    credentialIssuers,
    agentAudits,
    updateAuditPayoutStatus,
    updateProfileStatus, 
    updateProfile,
    updateJob,
    deleteJob,
    postJob
  } = useAppContext();

  const [activeSection, setActiveSection] = useState<AdminSection>('candidates');
  const [activeTab, setActiveTab] = useState<StatusFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [auditCandidate, setAuditCandidate] = useState<JobSeekerProfile | null>(null);

  // Edit Candidate Modal State
  const [editingCandidate, setEditingCandidate] = useState<JobSeekerProfile | null>(null);
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candHeadline, setCandHeadline] = useState('');
  const [candLocation, setCandLocation] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candStatus, setCandStatus] = useState<VerificationStatus>(VerificationStatus.VERIFIED);
  const [candSkills, setCandSkills] = useState('');
  const [candBio, setCandBio] = useState('');

  // Edit / Create Job Modal State
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobEmployerId, setJobEmployerId] = useState('emp_safaricom');
  const [jobLocation, setJobLocation] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [jobType, setJobType] = useState<Job['type']>('Full-time');
  const [jobExperience, setJobExperience] = useState('Senior');
  const [jobStatus, setJobStatus] = useState<Job['status']>('Open');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState('');
  const [jobResps, setJobResps] = useState('');
  const [adminFeedback, setAdminFeedback] = useState<string | null>(null);

  // Job search and filter
  const [jobFilterEmployer, setJobFilterEmployer] = useState<string>('all');

  const pendingCount = profiles.filter(p => p.verificationStatus === VerificationStatus.PENDING).length;
  const verifiedCount = profiles.filter(p => p.verificationStatus === VerificationStatus.VERIFIED || p.verificationStatus === VerificationStatus.AUTHENTICATED).length;
  const flaggedCount = profiles.filter(p => p.verificationStatus === VerificationStatus.FLAGGED || p.verificationStatus === VerificationStatus.CREDENTIAL_MISMATCH).length;

  const filteredProfiles = useMemo(() => {
    let list = profiles;
    switch (activeTab) {
      case 'pending':
        list = profiles.filter(p => p.verificationStatus === VerificationStatus.PENDING);
        break;
      case 'verified':
        list = profiles.filter(p => p.verificationStatus === VerificationStatus.VERIFIED || p.verificationStatus === VerificationStatus.AUTHENTICATED);
        break;
      case 'rejected':
        list = profiles.filter(p => p.verificationStatus === VerificationStatus.REJECTED);
        break;
      case 'flagged':
        list = profiles.filter(p => p.verificationStatus === VerificationStatus.FLAGGED || p.verificationStatus === VerificationStatus.CREDENTIAL_MISMATCH || p.verificationStatus === VerificationStatus.SUSPICIOUS_ACTIVITY);
        break;
      case 'all':
      default:
        list = profiles;
        break;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.email.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q) ||
        p.headline.toLowerCase().includes(q)
      );
    }

    return list;
  }, [profiles, activeTab, searchQuery]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      if (jobFilterEmployer !== 'all') {
        if (jobFilterEmployer === 'safaricom' && !j.companyName.toLowerCase().includes('safaricom')) return false;
        if (jobFilterEmployer === 'kqa' && !j.companyName.toLowerCase().includes('airways')) return false;
      }
      if (searchQuery.trim() && activeSection === 'jobs') {
        const q = searchQuery.toLowerCase();
        return j.title.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q) || j.location.toLowerCase().includes(q) || j.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [jobs, jobFilterEmployer, searchQuery, activeSection]);

  const tabs: {id: StatusFilter, label: string, count?: number}[] = [
    {id: 'pending', label: 'Pending Review', count: pendingCount},
    {id: 'verified', label: 'Verified Talent', count: verifiedCount},
    {id: 'flagged', label: 'Flagged Dossiers', count: flaggedCount},
    {id: 'rejected', label: 'Rejected / Ineligible'},
    {id: 'all', label: 'All Users', count: profiles.length},
  ];

  const handleOpenEditCandidate = (cand: JobSeekerProfile) => {
    setEditingCandidate(cand);
    setCandName(cand.name);
    setCandEmail(cand.email);
    setCandHeadline(cand.headline || '');
    setCandLocation(cand.location || '');
    setCandPhone(cand.phone || '');
    setCandStatus(cand.verificationStatus);
    setCandSkills(cand.skills.map(s => s.name).join(', '));
    setCandBio(cand.bio || '');
  };

  const handleSaveCandidateEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;

    const skillsArray = candSkills.split(',').map((s, idx) => ({
      id: `sk_admin_${idx}_${Date.now()}`,
      name: s.trim(),
      type: 'Hard' as const
    })).filter(s => s.name.length > 0);

    const updated: JobSeekerProfile = {
      ...editingCandidate,
      name: candName,
      email: candEmail,
      headline: candHeadline,
      location: candLocation,
      phone: candPhone,
      verificationStatus: candStatus,
      bio: candBio,
      skills: skillsArray.length > 0 ? skillsArray : editingCandidate.skills
    };

    updateProfile(updated);
    setEditingCandidate(null);
    setAdminFeedback(`Successfully updated candidate profile for ${updated.name}.`);
    setTimeout(() => setAdminFeedback(null), 3500);
  };

  const handleOpenEditJob = (job: Job) => {
    setEditingJob(job);
    setIsCreatingJob(false);
    setJobTitle(job.title);
    setJobCompany(job.companyName);
    setJobEmployerId(job.employerId);
    setJobLocation(job.location);
    setJobSalary(job.salaryRange);
    setJobCategory(job.category);
    setJobType(job.type);
    setJobExperience(job.experienceLevel || 'Senior');
    setJobStatus(job.status || 'Open');
    setJobDesc(job.description);
    setJobReqs(job.requirements.join('\n'));
    setJobResps(job.responsibilities.join('\n'));
  };

  const handleOpenCreateJob = () => {
    setEditingJob(null);
    setIsCreatingJob(true);
    setJobTitle('');
    setJobCompany('Safaricom PLC');
    setJobEmployerId('emp_safaricom');
    setJobLocation('Nairobi, Kenya');
    setJobSalary('KES 280,000 - KES 390,000 / mo');
    setJobCategory('Engineering');
    setJobType('Full-time');
    setJobExperience('Senior');
    setJobStatus('Open');
    setJobDesc('We are looking for an exceptional specialist to join our mission-critical enterprise engineering team.');
    setJobReqs('Bachelor or Master in relevant field\n5+ years proven domain experience\nVerified credentials on VerifiedHire');
    setJobResps('Lead technical architecture & governance\nCollaborate across multidisciplinary teams\nMaintain regulatory compliance');
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    const reqs = jobReqs.split('\n').filter(r => r.trim().length > 0);
    const resps = jobResps.split('\n').filter(r => r.trim().length > 0);

    if (editingJob) {
      const updated: Job = {
        ...editingJob,
        title: jobTitle,
        companyName: jobCompany,
        employerId: jobEmployerId,
        location: jobLocation,
        salaryRange: jobSalary,
        category: jobCategory,
        type: jobType,
        experienceLevel: jobExperience,
        status: jobStatus,
        description: jobDesc,
        requirements: reqs,
        responsibilities: resps
      };
      updateJob(updated);
      setEditingJob(null);
      setAdminFeedback(`Updated requisition "${updated.title}" for ${updated.companyName}.`);
    } else if (isCreatingJob) {
      const newJob: Omit<Job, 'id' | 'postedAt'> = {
        title: jobTitle,
        companyName: jobCompany,
        companyLogo: jobCompany.toLowerCase().includes('airways')
          ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
          : 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
        employerId: jobEmployerId,
        location: jobLocation,
        salaryRange: jobSalary,
        category: jobCategory,
        type: jobType,
        experienceLevel: jobExperience,
        status: jobStatus,
        description: jobDesc,
        requirements: reqs,
        responsibilities: resps,
        benefits: ['Full Medical Cover', 'Performance Bonus', 'Stock Options', 'Cryptographic Career Passport'],
        termsAndConditions: 'Standard Enterprise verified employment terms.',
        legalRights: 'Kenyan labor laws and KDPA compliance guaranteed.',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      postJob(newJob);
      setIsCreatingJob(false);
      setAdminFeedback(`Created new platform requisition "${newJob.title}" on behalf of ${newJob.companyName}.`);
    }
    setTimeout(() => setAdminFeedback(null), 3500);
  };

  const handleDeleteJob = (job: Job) => {
    if (confirm(`Are you sure you want to permanently delete "${job.title}" (${job.companyName})?`)) {
      deleteJob(job.id);
      setAdminFeedback(`Permanently deleted requisition #${job.id}.`);
      setTimeout(() => setAdminFeedback(null), 3500);
    }
  };

  const handleToggleSelect = (candidateId: string) => {
    setSelectedCandidateIds(prev =>
      prev.includes(candidateId) ? prev.filter(id => id !== candidateId) : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCandidateIds(filteredProfiles.map(p => p.id));
  };

  const handleClearSelection = () => {
    setSelectedCandidateIds([]);
  };

  const handleBulkVerify = () => {
    selectedCandidateIds.forEach(id => {
      updateProfileStatus(id, VerificationStatus.VERIFIED);
    });
    setAdminFeedback(`Successfully approved & verified ${selectedCandidateIds.length} candidate dossier(s).`);
    handleClearSelection();
    setTimeout(() => setAdminFeedback(null), 3500);
  };

  const handleBulkFlag = () => {
    selectedCandidateIds.forEach(id => {
      updateProfileStatus(id, VerificationStatus.FLAGGED);
    });
    setAdminFeedback(`Flagged ${selectedCandidateIds.length} candidate dossier(s) for forensic compliance investigation.`);
    handleClearSelection();
    setTimeout(() => setAdminFeedback(null), 3500);
  };

  const handleBulkArchive = () => {
    selectedCandidateIds.forEach(id => {
      updateProfileStatus(id, VerificationStatus.REJECTED);
    });
    setAdminFeedback(`Archived ${selectedCandidateIds.length} candidate dossier(s).`);
    handleClearSelection();
    setTimeout(() => setAdminFeedback(null), 3500);
  };

  const handleBulkEmail = () => {
    setAdminFeedback(`Sent official compliance verification notices to ${selectedCandidateIds.length} candidate(s).`);
    handleClearSelection();
    setTimeout(() => setAdminFeedback(null), 3500);
  };

  const handleBulkExportCSV = () => {
    const selected = profiles.filter(p => selectedCandidateIds.includes(p.id));
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Name,Email,Location,VerificationStatus,Skills\n" +
      selected.map(p => `"${p.id}","${p.name}","${p.email}","${p.location}","${p.verificationStatus}","${p.skills.map(s => s.name).join(';')}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admin_audit_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Superuser Operations Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-full flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
              <span>Chief Compliance & Super Admin Mode</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Platform Governance & Master Command Center</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Superuser full authority: view, edit, seal, or modify any candidate profile, enterprise job requisition, agent case, and statutory registry entry across the entire platform.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleOpenCreateJob}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Icon name="plus" className="h-4 w-4" />
            <span>Post Any Requisition</span>
          </button>
        </div>
      </div>

      {/* Admin Action Feedback Banner */}
      {adminFeedback && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Icon name="check" className="h-4 w-4 text-emerald-600" />
            <span>{adminFeedback}</span>
          </div>
          <button onClick={() => setAdminFeedback(null)} className="text-emerald-600 hover:text-emerald-800">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Primary Section Switcher */}
      <div className="flex bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-2xl">
        <button
          onClick={() => setActiveSection('candidates')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'candidates'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Icon name="userGroup" className="h-4 w-4" />
          <span>Candidate Dossiers ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('jobs')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'jobs'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Icon name="briefcase" className="h-4 w-4" />
          <span>All Platform Jobs ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('agentAudits')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'agentAudits'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Icon name="shieldCheck" className="h-4 w-4" />
          <span>Agent Cases ({agentCases.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('governance')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'governance'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Icon name="academicCap" className="h-4 w-4" />
          <span>Issuers ({credentialIssuers.length})</span>
        </button>
      </div>

      {/* SECTION 1: CANDIDATES DOSSIERS & VERIFICATION */}
      {activeSection === 'candidates' && (
        <div className="space-y-6">
          {/* Metrics KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Triage</span>
                <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
                  <Icon name="clock" className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">{pendingCount}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">Requires investigator sign-off</p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Verified Pool</span>
                <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
                  <Icon name="checkBadge" className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">{verifiedCount}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Active on Employer Job Board</p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Flagged Anomalies</span>
                <div className="h-8 w-8 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center">
                  <Icon name="exclamationTriangle" className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">{flaggedCount}</p>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">AI forgery / reference conflict</p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Audit SLA Health</span>
                <div className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
                  <Icon name="sparkles" className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">18.4 hrs</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">Target SLA: &lt; 24.0 hrs</p>
            </div>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidate, email, headline..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Icon name="search" className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Profiles Table */}
            <div className="overflow-x-auto">
              {filteredProfiles.length > 0 ? (
                <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedCandidateIds.length > 0 && selectedCandidateIds.length === filteredProfiles.length}
                          onChange={e => e.target.checked ? handleSelectAll() : handleClearSelection()}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left">Candidate & Profession</th>
                      <th scope="col" className="px-4 py-3.5 text-left">Email & Location</th>
                      <th scope="col" className="px-4 py-3.5 text-left">Verification Status</th>
                      <th scope="col" className="px-4 py-3.5 text-left">Audit Log</th>
                      <th scope="col" className="px-4 py-3.5 text-right">Admin Controls</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredProfiles.map(profile => {
                      const isSelected = selectedCandidateIds.includes(profile.id);
                      return (
                        <tr 
                          key={profile.id} 
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                            isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/30' : ''
                          }`}
                        >
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(profile.id)}
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img className="h-9 w-9 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" src={profile.photoUrl || profile.avatar} alt="" />
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">{profile.name}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">{profile.headline || 'Job Seeker'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-xs font-medium text-slate-900 dark:text-white">{profile.email}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">{profile.location}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-[10px] font-extrabold uppercase tracking-wider rounded-lg ${statusStyles[profile.verificationStatus]}`}>
                              {profile.verificationStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setAuditCandidate(profile)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <Icon name="fingerprint" className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Audit Trail</span>
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditCandidate(profile)}
                              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-all cursor-pointer"
                            >
                              <Icon name="pencil" className="h-3.5 w-3.5 inline mr-1" />
                              Edit Profile
                            </button>
                            <button
                              onClick={() => onViewProfile(profile.id)}
                              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                            >
                              Inspect Dossier
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                  <Icon name="shieldCheck" className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="font-bold text-base text-slate-800 dark:text-white">No Profiles Found</p>
                  <p className="text-xs mt-1">No candidate records match the currently selected filter and query.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ALL PLATFORM JOB REQUISITIONS */}
      {activeSection === 'jobs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Employer:</span>
                <select
                  value={jobFilterEmployer}
                  onChange={e => setJobFilterEmployer(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white outline-none"
                >
                  <option value="all">All Employers ({jobs.length} total)</option>
                  <option value="safaricom">Safaricom PLC</option>
                  <option value="kqa">Kenya Airways</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs, title, salary..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Icon name="search" className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <button
                  onClick={handleOpenCreateJob}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  <span>Post Job</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 text-left">Company & Requisition</th>
                    <th className="px-4 py-3.5 text-left">Category & Level</th>
                    <th className="px-4 py-3.5 text-left">Location & Salary</th>
                    <th className="px-4 py-3.5 text-left">Status</th>
                    <th className="px-4 py-3.5 text-left">Applicants</th>
                    <th className="px-4 py-3.5 text-right">Superuser Controls</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredJobs.map(job => {
                    const applicantCount = applications.filter(a => a.jobId === job.id).length;
                    return (
                      <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                              {job.companyLogo ? (
                                <img src={job.companyLogo} alt="" className="h-6 w-6 object-contain" />
                              ) : (
                                <Icon name="buildingOffice" className="h-5 w-5 text-indigo-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-xs">{job.title}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{job.companyName} • ID: {job.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-md text-[10px] mr-1.5">
                            {job.category}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">{job.type}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-slate-900 dark:text-white font-medium">{job.location}</div>
                          <div className="text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">{job.salaryRange}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            job.status === 'Closed'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {job.status || 'Open'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap font-mono font-bold text-slate-800 dark:text-slate-200">
                          {applicantCount} applicant(s)
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditJob(job)}
                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-all cursor-pointer"
                          >
                            <Icon name="pencil" className="h-3.5 w-3.5 inline mr-1" />
                            Edit Requisition
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job)}
                            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl hover:bg-rose-100 transition-all cursor-pointer"
                          >
                            <Icon name="trash" className="h-3.5 w-3.5 inline mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: AGENT AUDITS & WORKSTATION OVERSIGHT */}
      {activeSection === 'agentAudits' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Active Assignments Queue */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Icon name="userGroup" className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Active Case Assignments Monitor</h3>
                <p className="text-xs text-slate-500">Real-time status of statutory audit cases, conflict-of-interest declarations, and QA checklists in progress.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {agentCases.map(c => (
                <div key={c.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">Case #{c.id}</span>
                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-lg">
                      {c.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{c.candidateName}</h4>
                    <p className="text-xs text-slate-500">{c.credentialTitle}</p>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div><strong>Assigned Agent ID:</strong> {c.assignedAgentId || 'Agent Wachira (#AG-041)'}</div>
                    <div><strong>Evidence Checklist:</strong> {c.evidenceChecklist.filter(i => i.checked).length} of {c.evidenceChecklist.length} Verified</div>
                    <div><strong>Sworn Conflict Declaration:</strong> {c.conflictDeclared ? 'Conflict Declared' : 'Clear (No Conflict)'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform-Wide Primary Source Verification & Payout Ledger */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 rounded-xl">
                  <Icon name="currency" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Platform-Wide Verification Audit &amp; Earnings Ledger</h3>
                  <p className="text-xs text-slate-500">Administrative command center to audit verified credentials, trace evidence quality, and disburse agent payout commissions.</p>
                </div>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Settled via M-PESA B2C</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  KES {agentAudits.filter(a => a.payoutStatus === 'Settled_MPESA').reduce((sum, a) => sum + a.payoutAmountKES, 0).toLocaleString()}
                </p>
                <span className="text-[9px] text-slate-500">Transferred automatically to agents</span>
              </div>
              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Settlement Queue</span>
                <p className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                  KES {agentAudits.filter(a => a.payoutStatus === 'Approved_QA' || a.payoutStatus === 'Pending_Audit').reduce((sum, a) => sum + a.payoutAmountKES, 0).toLocaleString()}
                </p>
                <span className="text-[9px] text-slate-500">Awaiting Superuser disbursement signature</span>
              </div>
              <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Disputed / Under Audit Review</span>
                <p className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
                  {agentAudits.filter(a => a.payoutStatus === 'Disputed').length} verification(s)
                </p>
                <span className="text-[9px] text-slate-500">Payout paused for quality verification check</span>
              </div>
            </div>

            {/* List of Audits */}
            <div className="space-y-4">
              {agentAudits.map(audit => (
                <div key={audit.id} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                          {audit.id}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{audit.candidateName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Candidate ID: {audit.candidateId}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{audit.candidateHeadline}</p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Commission Fee:</span>
                        <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400">
                          KES {audit.payoutAmountKES.toLocaleString()}
                        </span>
                      </div>
                      {/* Payout Status Badge */}
                      {audit.payoutStatus === 'Settled_MPESA' && (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-bold text-[9px] uppercase tracking-wider">
                          Settled via M-PESA B2C
                        </span>
                      )}
                      {audit.payoutStatus === 'Approved_QA' && (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full font-bold text-[9px] uppercase tracking-wider animate-pulse">
                          Pending Settlement
                        </span>
                      )}
                      {audit.payoutStatus === 'Disputed' && (
                        <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-full font-bold text-[9px] uppercase tracking-wider">
                          Disputed / Hold
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Verification Trace Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Verified Claim</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{audit.credentialTitle}</p>
                      <p className="text-[11px] text-slate-500">{audit.category}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Primary Source Registry</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{audit.statutoryRegistryChecked}</p>
                      <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">Ref: {audit.registrationNumberChecked}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Auditor Identity</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{audit.agentName}</p>
                      <p className="text-[10px] text-slate-400">Verified: {new Date(audit.verifiedAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Findings and Integrity details */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-black text-slate-400">Auditor Registry Findings &amp; Process Summary:</span>
                        <p className="text-slate-800 dark:text-slate-300 leading-relaxed mt-0.5 text-[11px]">
                          "{audit.findingsSummary}"
                        </p>
                      </div>
                      <div className="w-24 text-right">
                        <span className="text-[10px] uppercase font-black text-slate-400 block">Quality Match</span>
                        <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">
                          {audit.authenticityScore}%
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <Icon name="check" className="h-3 w-3" />
                        <span>Sworn Impartiality Declaration Signed (No Conflict of Interest)</span>
                      </div>
                      <div>
                        <span>Sig Hash: {audit.signatureHash}</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {audit.payoutStatus !== 'Settled_MPESA' && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                      {audit.payoutStatus === 'Approved_QA' && (
                        <>
                          <button
                            onClick={() => {
                              updateAuditPayoutStatus(audit.id, 'Settled_MPESA');
                              setAdminFeedback(`Successfully initiated M-PESA B2C disbursement for ${audit.agentName}. KES ${audit.payoutAmountKES.toLocaleString()} transferred.`);
                              setTimeout(() => setAdminFeedback(null), 4000);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-[10px] flex items-center gap-1.5 active:scale-95"
                          >
                            <Icon name="currency" className="h-3.5 w-3.5" />
                            <span>Disburse KES {audit.payoutAmountKES.toLocaleString()} via M-PESA B2C</span>
                          </button>
                          <button
                            onClick={() => {
                              updateAuditPayoutStatus(audit.id, 'Disputed');
                              setAdminFeedback(`Flagged verification audit #${audit.id} as disputed. Commission payout paused.`);
                              setTimeout(() => setAdminFeedback(null), 4000);
                            }}
                            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold rounded-lg border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer text-[10px]"
                          >
                            Flag / Dispute Audit
                          </button>
                        </>
                      )}
                      {audit.payoutStatus === 'Disputed' && (
                        <button
                          onClick={() => {
                            updateAuditPayoutStatus(audit.id, 'Approved_QA');
                            setAdminFeedback(`Resolved dispute for audit #${audit.id}. Restored to pending settlement queue.`);
                            setTimeout(() => setAdminFeedback(null), 4000);
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-[10px]"
                        >
                          Resolve &amp; Reset to Pending
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PLATFORM GOVERNANCE & ISSUERS */}
      {activeSection === 'governance' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 p-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Accredited Credential Registrars & Issuing Authorities</h3>
            <p className="text-xs text-slate-500 mb-6">Official partner institutions issuing cryptographically verifiable credentials into the VerifiedHire registry.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {credentialIssuers.map(issuer => (
                <div key={issuer.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 text-indigo-600">
                      <Icon name="academicCap" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{issuer.orgName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{issuer.orgType} • {issuer.verifiedDomain}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div><strong>Accreditation ID:</strong> {issuer.accreditationNumber}</div>
                    <div><strong>Issued Records:</strong> {issuer.issuedCount} credentials</div>
                    <div><strong>Authorized Signers:</strong> {issuer.authorizedSigners.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BATCH OPERATIONS DOCK */}
      {activeSection === 'candidates' && (
        <BatchOperationsDock
          selectedCount={selectedCandidateIds.length}
          totalFilteredCount={filteredProfiles.length}
          onClearSelection={handleClearSelection}
          onSelectAll={handleSelectAll}
          onBulkMoveStage={handleBulkVerify}
          onBulkSendMessage={handleBulkEmail}
          onBulkAssignAssessment={handleBulkFlag}
          onBulkRequestVerification={handleBulkVerify}
          onBulkArchive={handleBulkArchive}
          onBulkExportCSV={handleBulkExportCSV}
          customTitle="Dossiers Selected"
        />
      )}

      {/* EDIT CANDIDATE MODAL */}
      {editingCandidate && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Icon name="pencil" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Admin Edit Candidate Profile</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Modify identity details, headline, skills, and verification status.</p>
                </div>
              </div>
              <button onClick={() => setEditingCandidate(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCandidateEdits} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={candName}
                    onChange={e => setCandName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={candEmail}
                    onChange={e => setCandEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Headline</label>
                  <input
                    type="text"
                    required
                    value={candHeadline}
                    onChange={e => setCandHeadline(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Location</label>
                  <input
                    type="text"
                    required
                    value={candLocation}
                    onChange={e => setCandLocation(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Phone</label>
                  <input
                    type="text"
                    value={candPhone}
                    onChange={e => setCandPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Verification Status</label>
                  <select
                    value={candStatus}
                    onChange={e => setCandStatus(e.target.value as VerificationStatus)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={VerificationStatus.VERIFIED}>VERIFIED (Cryptographically Sealed)</option>
                    <option value={VerificationStatus.PENDING}>PENDING (Under Review)</option>
                    <option value={VerificationStatus.FLAGGED}>FLAGGED (Anomaly / Investigating)</option>
                    <option value={VerificationStatus.REJECTED}>REJECTED (Ineligible)</option>
                    <option value={VerificationStatus.DRAFT}>DRAFT (Self Declared)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Skills (comma separated)</label>
                <input
                  type="text"
                  value={candSkills}
                  onChange={e => setCandSkills(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Biography / Summary</label>
                <textarea
                  rows={3}
                  value={candBio}
                  onChange={e => setCandBio(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCandidate(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Save Candidate Edits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / CREATE JOB REQUISITION MODAL */}
      {(editingJob || isCreatingJob) && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Icon name={editingJob ? "pencil" : "plus"} className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {editingJob ? `Admin Edit Requisition: ${editingJob.title}` : 'Admin: Create Enterprise Requisition'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Superuser job manager for all platform enterprise postings.</p>
                </div>
              </div>
              <button 
                onClick={() => { setEditingJob(null); setIsCreatingJob(false); }} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Company Name</label>
                  <input
                    type="text"
                    required
                    value={jobCompany}
                    onChange={e => {
                      setJobCompany(e.target.value);
                      if (e.target.value.toLowerCase().includes('airways')) setJobEmployerId('emp_kqa');
                      else setJobEmployerId('emp_safaricom');
                    }}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Location</label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={e => setJobLocation(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Salary Range</label>
                  <input
                    type="text"
                    required
                    value={jobSalary}
                    onChange={e => setJobSalary(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Job Type</label>
                  <select
                    value={jobType}
                    onChange={e => setJobType(e.target.value as Job['type'])}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Category</label>
                  <input
                    type="text"
                    value={jobCategory}
                    onChange={e => setJobCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Status</label>
                  <select
                    value={jobStatus}
                    onChange={e => setJobStatus(e.target.value as Job['status'])}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Description</label>
                <textarea
                  rows={4}
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Requirements (one per line)</label>
                <textarea
                  rows={3}
                  value={jobReqs}
                  onChange={e => setJobReqs(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Key Responsibilities (one per line)</label>
                <textarea
                  rows={3}
                  value={jobResps}
                  onChange={e => setJobResps(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setEditingJob(null); setIsCreatingJob(false); }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {editingJob ? 'Save Requisition Changes' : 'Post Requisition as Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANDIDATE AUDIT TRAIL MODAL WITH APPLE SPRING ANIMATIONS */}
      <AnimatePresence>
        {auditCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
              onClick={() => setAuditCandidate(null)}
            />
            <motion.div 
              initial={{ scale: 0.93, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 max-h-[85vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <img src={auditCandidate.photoUrl || auditCandidate.avatar} alt={auditCandidate.name} className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {auditCandidate.name} • Forensic Audit Trail &amp; Provenance Log
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Registry ID: {auditCandidate.id} • Verified By Accredited Auditors</p>
                  </div>
                </div>
                <button onClick={() => setAuditCandidate(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full">
                  <Icon name="close" className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <CandidateAuditTrail
                  candidate={auditCandidate}
                  credentials={credentials.filter(c => c.candidateId === auditCandidate.id)}
                  interviews={interviews.filter(i => i.candidateName.toLowerCase() === auditCandidate.name.toLowerCase())}
                  application={applications.find(a => a.jobSeekerId === auditCandidate.id) || null}
                  mode="admin"
                />
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Immutable Hash Signed &amp; Validated</span>
                </div>
                <button
                  onClick={() => setAuditCandidate(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Audit Trail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
