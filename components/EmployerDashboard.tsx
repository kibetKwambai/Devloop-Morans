import React, { useState, useMemo } from 'react';
import { JobSeekerProfile, VerificationStatus, Job, Application, Notification, ATSPipelineStage } from '../types';
import { useAppContext } from './AppContext';
import { Icon, IconName } from './Icon';
import { CandidateCard } from './CandidateCard';
import { EnterpriseATSView } from './EnterpriseATSView';
import { BatchOperationsDock } from './BatchOperationsDock';
import { CandidateAuditTrail } from './CandidateAuditTrail';
import { motion, AnimatePresence } from 'motion/react';

interface EmployerDashboardProps {
  onViewProfile: (profileId: string) => void;
}

const StatCard: React.FC<{ icon: IconName; value: string; label: string; color: string }> = ({ icon, value, label, color }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center transition-all hover:shadow-md">
    <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${color} flex items-center justify-center shadow-md`}>
      <Icon name={icon} className="h-6 w-6 text-white" />
    </div>
    <div className="ml-4">
      <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onViewProfile }) => {
  const { profiles, jobs, applications, notifications, credentials, interviews, updateApplicationStatus, markNotificationAsRead, postJob, updateJob, deleteJob } = useAppContext();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'search' | 'jobs' | 'applications' | 'notifications'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [showShortlisted, setShowShortlisted] = useState(false);
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Edit Job state
  const [editTitle, setEditTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState<Job['type']>('Full-time');
  const [editDesc, setEditDesc] = useState('');
  const [editReqs, setEditReqs] = useState('');
  const [editResps, setEditResps] = useState('');
  const [editStatus, setEditStatus] = useState<Job['status']>('Open');

  // Multi-select state for bulk actions
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [auditCandidate, setAuditCandidate] = useState<JobSeekerProfile | null>(null);

  // Dynamic Employer ID and Company matching based on active session
  const { currentUserId } = useAppContext();
  const activeEmployerId = currentUserId || 'emp_safaricom';
  
  const employerAccount = useMemo(() => {
    return Object.values(useAppContext.name ? {} : {}) // safe lookup
      ? [
          { id: 'emp_safaricom', company: 'Safaricom PLC', name: 'Safaricom PLC Talent' },
          { id: 'emp_kqa', company: 'Kenya Airways', name: 'Kenya Airways HR' },
        ].find(e => e.id === activeEmployerId)
      : undefined;
  }, [activeEmployerId]);

  const companyKeyword = useMemo(() => {
    if (activeEmployerId.includes('kqa') || activeEmployerId.includes('airways')) return 'airways';
    if (activeEmployerId.includes('safaricom')) return 'safaricom';
    return 'safaricom';
  }, [activeEmployerId]);

  const employerJobs = useMemo(() => {
    const matched = jobs.filter(j => 
      j.employerId === activeEmployerId || 
      (j.companyName && companyKeyword && j.companyName.toLowerCase().includes(companyKeyword))
    );
    return matched;
  }, [jobs, activeEmployerId, companyKeyword]);

  const employerApplications = useMemo(() => {
    const jobIds = employerJobs.map(j => j.id);
    return applications.filter(a => jobIds.includes(a.jobId));
  }, [applications, employerJobs]);

  const employerNotifications = useMemo(() => {
    const notifs = notifications.filter(n => n.userId === activeEmployerId || n.userId === 'emp_001');
    if (notifs.length > 0) return notifs;
    return notifications.slice(0, 3);
  }, [notifications, activeEmployerId]);

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    profiles
      .filter(p => p.verificationStatus === VerificationStatus.VERIFIED || p.verificationStatus === VerificationStatus.AUTHENTICATED)
      .forEach(p => p.skills.forEach(s => skillSet.add(s.name)));
    return Array.from(skillSet).sort();
  }, [profiles]);

  const allLocations = useMemo(() => {
    const locSet = new Set<string>(['All']);
    profiles.forEach(p => locSet.add(p.location));
    return Array.from(locSet).sort();
  }, [profiles]);

  const handleSkillToggle = (skillName: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillName)
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    );
  };

  const filteredProfiles = useMemo(() => {
    return profiles
      .filter(p => p.verificationStatus === VerificationStatus.VERIFIED || p.verificationStatus === VerificationStatus.AUTHENTICATED)
      .filter(p => !showShortlisted || p.isShortlisted)
      .filter(p => selectedLocation === 'All' || p.location === selectedLocation)
      .filter(p => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(lowerSearchTerm) ||
          p.headline.toLowerCase().includes(lowerSearchTerm) ||
          p.workExperience.some(exp => exp.title.toLowerCase().includes(lowerSearchTerm));

        const matchesSkills =
          selectedSkills.length === 0 ||
          selectedSkills.every(skill =>
            p.skills.some(s => s.name === skill)
          );
        
        return matchesSearch && matchesSkills;
      });
  }, [profiles, searchTerm, selectedSkills, showShortlisted, selectedLocation]);

  const handleToggleSelectCandidate = (candidateId: string) => {
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

  const handleBulkMoveStage = (targetStage: ATSPipelineStage) => {
    selectedCandidateIds.forEach(cId => {
      const app = applications.find(a => a.jobSeekerId === cId);
      if (app) {
        const statusMap: Record<ATSPipelineStage, Application['status']> = {
          Applied: 'Applied',
          Screening: 'Reviewing',
          Interview: 'Shortlisted',
          Assessment: 'Interviewing',
          BackgroundCheck: 'Reviewing',
          Offer: 'Offered',
          Hired: 'Accepted',
          Rejected: 'Rejected',
          Archived: 'Rejected'
        };
        updateApplicationStatus(app.id, statusMap[targetStage]);
      }
    });
    alert(`Successfully moved ${selectedCandidateIds.length} candidate(s) to ${targetStage}.`);
    handleClearSelection();
  };

  const handleBulkSendMessage = () => {
    const candidateNames = profiles.filter(p => selectedCandidateIds.includes(p.id)).map(p => p.name).join(', ');
    alert(`Bulk message modal queued for ${selectedCandidateIds.length} candidates (${candidateNames}). Encrypted email invitations dispatched.`);
    handleClearSelection();
  };

  const handleBulkAssignAssessment = () => {
    alert(`Dispatched technical & competency rubric assessment links to ${selectedCandidateIds.length} selected candidate(s).`);
    handleClearSelection();
  };

  const handleBulkRequestVerification = () => {
    alert(`Requested automated primary-source registry audits for ${selectedCandidateIds.length} selected candidate(s).`);
    handleClearSelection();
  };

  const handleBulkArchive = () => {
    selectedCandidateIds.forEach(cId => {
      const app = applications.find(a => a.jobSeekerId === cId);
      if (app) {
        updateApplicationStatus(app.id, 'Rejected');
      }
    });
    alert(`Archived ${selectedCandidateIds.length} candidate dossier(s).`);
    handleClearSelection();
  };

  const handleBulkExportCSV = () => {
    const selected = profiles.filter(p => selectedCandidateIds.includes(p.id));
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Name,Email,Headline,Location,VerificationStatus,Skills\n" +
      selected.map(p => `"${p.id}","${p.name}","${p.email}","${p.headline}","${p.location}","${p.verificationStatus}","${p.skills.map(s => s.name).join(';')}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `verifiedhire_candidates_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePostJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newJob: Omit<Job, 'id' | 'postedAt'> = {
      employerId: activeEmployerId,
      companyName: activeEmployerId.includes('kqa') ? 'Kenya Airways' : 'Safaricom PLC',
      companyLogo: activeEmployerId.includes('kqa') 
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150' 
        : 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
      title: formData.get('title') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as Job['type'],
      salaryRange: formData.get('salaryRange') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      requirements: (formData.get('requirements') as string).split('\n').filter(r => r.trim()),
      responsibilities: (formData.get('responsibilities') as string).split('\n').filter(r => r.trim()),
      benefits: ['Medical Insurance', 'Retirement Plan', 'Flexible Working', 'Cryptographic Vault Access'],
      termsAndConditions: 'Standard VerifiedHire employment terms apply.',
      legalRights: 'All rights reserved under Kenyan labor laws and KDPA compliance.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      experienceLevel: 'Senior',
      status: 'Open'
    };

    postJob(newJob);
    setIsPostingJob(false);
  };

  const handleOpenEditJob = (job: Job) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditLocation(job.location);
    setEditSalary(job.salaryRange);
    setEditCategory(job.category);
    setEditType(job.type);
    setEditDesc(job.description);
    setEditReqs(job.requirements.join('\n'));
    setEditResps(job.responsibilities.join('\n'));
    setEditStatus(job.status || 'Open');
  };

  const handleSaveJobEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const updated: Job = {
      ...editingJob,
      title: editTitle,
      location: editLocation,
      salaryRange: editSalary,
      category: editCategory,
      type: editType,
      description: editDesc,
      requirements: editReqs.split('\n').filter(r => r.trim().length > 0),
      responsibilities: editResps.split('\n').filter(r => r.trim().length > 0),
      status: editStatus
    };

    updateJob(updated);
    setEditingJob(null);
  };

  return (
    <div className="space-y-8">
      {isPostingJob && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Post an Enterprise Requisition</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sovereign pre-vetted talent matching with automated compliance.</p>
              </div>
              <button onClick={() => setIsPostingJob(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <Icon name="close" className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handlePostJob} className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">Job Title</label>
                  <input name="title" required placeholder="e.g. Senior Airline Pilot (B737-800)" className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">Location</label>
                  <input name="location" required placeholder="e.g. Nairobi, Kenya (HKJK Base)" className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">Job Type</label>
                  <select name="type" className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">Salary Range</label>
                  <input name="salaryRange" required placeholder="e.g. KES 650,000 - 950,000 / mo" className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">Category</label>
                  <input name="category" required placeholder="e.g. Aviation / Flight Operations" className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">Job Description</label>
                <textarea name="description" required rows={3} placeholder="Describe the role and mission..." className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">Requirements (One per line)</label>
                <textarea name="requirements" required rows={3} placeholder="e.g. Valid KCAA ATPL licence&#10;1,500+ PIC hours on transport category aircraft" className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              <div className="pt-3 flex gap-3">
                <button type="button" onClick={() => setIsPostingJob(false)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-md transition-all">
                  Publish Requisition
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Main Top Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise Talent Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sovereign recruiting engine, primary-source candidate discovery, and automated workflows.</p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          {[
            { id: 'pipeline', label: 'ATS Pipeline', icon: 'sparkles' },
            { id: 'search', label: 'Talent Search', icon: 'search' },
            { id: 'jobs', label: `Jobs (${employerJobs.length})`, icon: 'briefcase' },
            { id: 'applications', label: `Applications (${employerApplications.length})`, icon: 'clipboardDocumentCheck' },
            { id: 'notifications', label: 'Activity Logs', icon: 'bell' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon name={tab.icon as any} className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: ATS PIPELINE (EMBEDS FULL ENTERPRISE ATS SUITE) */}
      {activeTab === 'pipeline' && (
        <EnterpriseATSView 
          onViewCandidate={onViewProfile}
          onPostNewJob={() => setIsPostingJob(true)}
        />
      )}

      {/* TAB 2: CANDIDATE SEARCH & DISCOVERY WITH MULTI-SELECT & FLOATING DOCK */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by verified candidate name, job title, headline, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 dark:bg-slate-800 dark:text-white text-xs text-slate-900"
                />
              </div>
              <div className="relative">
                <Icon name="location" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 dark:bg-slate-800 dark:text-white text-xs text-slate-900 cursor-pointer"
                >
                  {allLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Filter by Verified Competencies:</h4>
              <div className="flex flex-wrap gap-1.5">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`text-xs font-bold px-3 py-1 rounded-xl border transition-all ${
                      selectedSkills.includes(skill)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (selectedCandidateIds.length === filteredProfiles.length) {
                      handleClearSelection();
                    } else {
                      handleSelectAll();
                    }
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                >
                  <input
                    type="checkbox"
                    checked={selectedCandidateIds.length > 0 && selectedCandidateIds.length === filteredProfiles.length}
                    readOnly
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Select All ({filteredProfiles.length})</span>
                </button>

                {selectedCandidateIds.length > 0 && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedCandidateIds.length} candidate(s) currently selected
                  </span>
                )}
              </div>

              <label className="flex items-center cursor-pointer group">
                <span className="mr-2 text-xs font-bold text-slate-600 dark:text-slate-300">Show Shortlisted Only</span>
                <input
                  type="checkbox"
                  checked={showShortlisted}
                  onChange={() => setShowShortlisted(!showShortlisted)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Candidate Cards Grid */}
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">
              Showing {filteredProfiles.length} Verified Candidate{filteredProfiles.length !== 1 && 's'}
            </h3>
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProfiles.map(profile => (
                  <CandidateCard 
                    key={profile.id} 
                    profile={profile} 
                    onViewProfile={onViewProfile}
                    isSelected={selectedCandidateIds.includes(profile.id)}
                    onToggleSelect={handleToggleSelectCandidate}
                    onViewAuditTrail={(p) => setAuditCandidate(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <Icon name="userGroup" className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-base font-bold text-slate-900 dark:text-white">No candidates match the specified filters</p>
                <p className="text-xs text-slate-400 mt-1">Try broadening your search query or skill filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: JOBS POSTINGS */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Active Employer Job Postings</h3>
            <button 
              onClick={() => setIsPostingJob(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Icon name="plus" className="h-4 w-4" />
              <span>Post New Requisition</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {employerJobs.length > 0 ? employerJobs.map(job => (
              <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:shadow-md transition-all">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 flex-shrink-0">
                    <Icon name="briefcase" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{job.location} • {job.type} • {job.salaryRange}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-lg font-black text-slate-900 dark:text-white">{applications.filter(a => a.jobId === job.id && a.interestedOnly).length}</p>
                    <p className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Interested</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:border-slate-800"></div>
                  <div className="text-center">
                    <p className="text-lg font-black text-slate-900 dark:text-white">{applications.filter(a => a.jobId === job.id && !a.interestedOnly).length}</p>
                    <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Applied</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:border-slate-800"></div>
                  <button 
                    onClick={() => handleOpenEditJob(job)}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    title="Edit Job Requisition"
                  >
                    <Icon name="pencil" className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => deleteJob(job.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Job"
                  >
                    <Icon name="trash" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <Icon name="briefcase" className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-base font-bold text-slate-900 dark:text-white">No active job postings yet</p>
                <p className="text-xs text-slate-400 mt-1">Click "Post New Requisition" to open a hiring pipeline.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: RECENT APPLICATIONS WITH CHECKBOX SELECTION */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Recent Received Applications</h3>
            <button
              onClick={() => {
                if (selectedCandidateIds.length === employerApplications.length) {
                  handleClearSelection();
                } else {
                  setSelectedCandidateIds(employerApplications.map(a => a.jobSeekerId));
                }
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {selectedCandidateIds.length === employerApplications.length ? 'Clear Selection' : 'Select All Applications'}
            </button>
          </div>

          <div className="space-y-3">
            {employerApplications.map(app => {
              const candidate = profiles.find(p => p.id === app.jobSeekerId);
              const job = jobs.find(j => j.id === app.jobId);
              if (!candidate || !job) return null;
              const isSelected = selectedCandidateIds.includes(candidate.id);

              return (
                <div 
                  key={app.id} 
                  className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectCandidate(candidate.id)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <img src={candidate.photoUrl || candidate.avatar} alt={candidate.name} className="h-11 w-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
                    <div className="ml-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{candidate.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {app.interestedOnly ? 'Interested in' : 'Applied for'} <span className="font-bold text-indigo-600 dark:text-indigo-400">{job.title}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'Shortlisted' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300' :
                      app.status === 'Offered' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-300' :
                      app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300' :
                      app.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300' :
                      'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300'
                    }`}>
                      {app.status}
                    </span>
                    <button 
                      onClick={() => setAuditCandidate(candidate)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                    >
                      <Icon name="fingerprint" className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Audit Log</span>
                    </button>
                    <button 
                      onClick={() => onViewProfile(candidate.id)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      Passport ↗
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: NOTIFICATIONS & AUDIT ACTIVITY */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <h3 className="text-base font-black text-slate-900 dark:text-white">Institutional Audit & Activity Log</h3>
          <div className="space-y-3">
            {employerNotifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-5 rounded-2xl border transition-all ${
                  notif.isRead 
                    ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800' 
                    : 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-xs'
                }`}
                onClick={() => markNotificationAsRead(notif.id)}
              >
                <div className="flex items-start">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'Application' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' :
                    notif.type === 'StatusChange' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' :
                    'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
                  }`}>
                    <Icon name={notif.type === 'Application' ? 'briefcase' : 'bell'} className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                      <span className="text-[11px] font-mono text-slate-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{notif.message}</p>
                  </div>
                  {!notif.isRead && <div className="h-2 w-2 bg-indigo-600 rounded-full ml-4 mt-2"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FLOATING BATCH OPERATIONS ACTION DOCK */}
      <BatchOperationsDock
        selectedCount={selectedCandidateIds.length}
        totalFilteredCount={filteredProfiles.length}
        onClearSelection={handleClearSelection}
        onSelectAll={handleSelectAll}
        onBulkMoveStage={handleBulkMoveStage}
        onBulkSendMessage={handleBulkSendMessage}
        onBulkAssignAssessment={handleBulkAssignAssessment}
        onBulkRequestVerification={handleBulkRequestVerification}
        onBulkArchive={handleBulkArchive}
        onBulkExportCSV={handleBulkExportCSV}
      />

      {/* EDIT JOB MODAL */}
      {editingJob && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Icon name="pencil" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Your Requisition</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update job details, salary compensation, requirements, and status.</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingJob(null)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJobEdits} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Job Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Salary Range</label>
                  <input
                    type="text"
                    required
                    value={editSalary}
                    onChange={e => setEditSalary(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Category</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Job Type</label>
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value as Job['type'])}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as Job['status'])}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Job Description</label>
                <textarea
                  rows={4}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Requirements (one per line)</label>
                <textarea
                  rows={3}
                  value={editReqs}
                  onChange={e => setEditReqs(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Responsibilities (one per line)</label>
                <textarea
                  rows={3}
                  value={editResps}
                  onChange={e => setEditResps(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANDIDATE AUDIT TRAIL MODAL (APPLE SPRING ANIMATED) */}
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
                      {auditCandidate.name} • Audit Trail & Verification Logs
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {auditCandidate.id} • KDPA Vault Tamper-Evident Record</p>
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
                  mode="employer"
                />
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex justify-end">
                <button
                  onClick={() => setAuditCandidate(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Close Audit Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
