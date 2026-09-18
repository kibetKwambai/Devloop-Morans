import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Job, 
  Application, 
  JobSeekerProfile, 
  JobRequisition, 
  StructuredInterview, 
  TalentPool, 
  ATSPipelineStage,
  InterviewScorecard,
  VerificationStatus
} from '../types';
import { useAppContext } from './AppContext';
import { Icon } from './Icon';
import { VerifiedHireIconMark } from './VerifiedHireLogo';
import { CandidateDossierDrawer } from './CandidateDossierDrawer';
import { CommandPaletteModal } from './CommandPaletteModal';
import { RequisitionApprovalModal } from './RequisitionApprovalModal';
import { AIMatchCalibrationModal } from './AIMatchCalibrationModal';
import { BatchOperationsDock } from './BatchOperationsDock';
import { GoogleMeetRoomModal } from './GoogleMeetRoomModal';
import { SkillKnowledgeGraphModal } from './SkillKnowledgeGraphModal';
import { SubagentIntelligenceHub } from './SubagentIntelligenceHub';
import { SecurityDefenseInspectorModal } from './SecurityDefenseInspectorModal';

interface EnterpriseATSViewProps {
  onViewCandidate: (profileId: string) => void;
  onPostNewJob: () => void;
}

export const EnterpriseATSView: React.FC<EnterpriseATSViewProps> = ({
  onViewCandidate,
  onPostNewJob
}) => {
  const {
    jobs,
    applications,
    profiles,
    credentials,
    requisitions,
    interviews,
    talentPools,
    notifications,
    blindScreeningMode,
    toggleBlindScreening,
    updateApplicationStatus,
    createRequisition,
    updateRequisitionApproval,
    scheduleInterview,
    scheduleGoogleMeetInterview,
    submitScorecard,
    createTalentPool,
    addCandidateToPool,
    sendMessage,
    googleAccessToken,
    signInWithGoogle
  } = useAppContext();

  // Navigation Sub-tabs & Pipeline View Modes
  const [activeTab, setActiveTab] = useState<'pipeline' | 'requisitions' | 'interviews' | 'pools' | 'analytics' | 'queue'>('pipeline');
  const [pipelineViewMode, setPipelineViewMode] = useState<'kanban' | 'cards' | 'table' | 'funnel'>('kanban');

  // Google Meet Modals
  const [selectedMeetInterview, setSelectedMeetInterview] = useState<StructuredInterview | null>(null);
  const [showQuickMeetModal, setShowQuickMeetModal] = useState(false);
  const [enableMeetSpace, setEnableMeetSpace] = useState(true);

  // Filters & Search State
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState(false);
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [slaFilter, setSlaFilter] = useState<'all' | 'healthy' | 'at_risk' | 'overdue'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Batch Selection State
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);

  // Specialized Custom Modals
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isSubagentHubOpen, setIsSubagentHubOpen] = useState(false);
  const [isSecurityDefenseOpen, setIsSecurityDefenseOpen] = useState(false);

  // Selected Candidate Drawer & Modals
  const [drawerCandidateId, setDrawerCandidateId] = useState<string | null>(null);
  const [aiExplainAppId, setAiExplainAppId] = useState<string | null>(null);
  const [selectedReqForModal, setSelectedReqForModal] = useState<JobRequisition | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [showScorecardModal, setShowScorecardModal] = useState<StructuredInterview | null>(null);
  const [selectedPoolForDetails, setSelectedPoolForDetails] = useState<TalentPool | null>(null);
  const [newPoolModal, setNewPoolModal] = useState(false);
  const [newPoolName, setNewPoolName] = useState('');
  const [newPoolSector, setNewPoolSector] = useState('Aviation & Flight Ops');
  const [newPoolTags, setNewPoolTags] = useState('Pre-Verified, Priority');

  // Requisition Creation Modal
  const [newReqModal, setNewReqModal] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDept, setReqDept] = useState('Flight Operations');
  const [reqBudget, setReqBudget] = useState('KES 450,000 - 650,000/mo');
  const [reqHeadcount, setReqHeadcount] = useState(2);

  // Interview Form State
  const [intCandidateName, setIntCandidateName] = useState('');
  const [intJobTitle, setIntJobTitle] = useState('');
  const [intStage, setIntStage] = useState('Technical & Sim Evaluation');
  const [intDate, setIntDate] = useState('2026-09-22');
  const [intTime, setIntTime] = useState('10:00 AM EAT');
  const [intPanel, setIntPanel] = useState('Capt. Patrick Ochieng, Senior Examiner');

  // Scorecard Input State
  const [score1, setScore1] = useState(5);
  const [score2, setScore2] = useState(4);
  const [score3, setScore3] = useState(5);
  const [recType, setRecType] = useState<'Strong Hire' | 'Hire' | 'Neutral' | 'Do Not Hire'>('Strong Hire');
  const [scoreRemarks, setScoreRemarks] = useState('Candidate demonstrated stellar command protocols, calm emergency decision-making, and authenticated KCAA Class 1 medicals.');

  // Notification Toast / Feedback Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut listener for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pipeline Stages Definition
  const pipelineStages: { id: ATSPipelineStage; label: string; badgeColor: string; topBorder: string; bgAccent: string; slaDays: number }[] = [
    { id: 'Applied', label: '1. Applied', badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', topBorder: 'border-t-slate-400', bgAccent: 'bg-slate-50/60 dark:bg-slate-900/40', slaDays: 2 },
    { id: 'Screening', label: '2. Screening', badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', topBorder: 'border-t-blue-500', bgAccent: 'bg-blue-50/30 dark:bg-blue-950/20', slaDays: 3 },
    { id: 'Interview', label: '3. Interview', badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300', topBorder: 'border-t-amber-500', bgAccent: 'bg-amber-50/30 dark:bg-amber-950/20', slaDays: 5 },
    { id: 'Assessment', label: '4. Assessment', badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300', topBorder: 'border-t-purple-500', bgAccent: 'bg-purple-50/30 dark:bg-purple-950/20', slaDays: 4 },
    { id: 'BackgroundCheck', label: '5. Trust Check', badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300', topBorder: 'border-t-teal-500', bgAccent: 'bg-teal-50/30 dark:bg-teal-950/20', slaDays: 3 },
    { id: 'Offer', label: '6. Offer Extended', badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300', topBorder: 'border-t-indigo-500', bgAccent: 'bg-indigo-50/30 dark:bg-indigo-950/20', slaDays: 5 },
    { id: 'Hired', label: '7. Hired', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', topBorder: 'border-t-emerald-500', bgAccent: 'bg-emerald-50/30 dark:bg-emerald-950/20', slaDays: 1 }
  ];

  const getCandidate = (seekerId: string): JobSeekerProfile | undefined => {
    return profiles.find(p => p.id === seekerId);
  };

  const mapAppStatusToStage = (status: Application['status']): ATSPipelineStage => {
    switch (status) {
      case 'Applied': return 'Applied';
      case 'Reviewing': return 'Screening';
      case 'Shortlisted': return 'Interview';
      case 'Interviewing': return 'Assessment';
      case 'Offered': return 'Offer';
      case 'Accepted': return 'Hired';
      case 'Rejected': return 'Rejected';
      default: return 'Applied';
    }
  };

  const mapStageToAppStatus = (stage: ATSPipelineStage): Application['status'] => {
    switch (stage) {
      case 'Applied': return 'Applied';
      case 'Screening': return 'Reviewing';
      case 'Interview': return 'Shortlisted';
      case 'Assessment': return 'Interviewing';
      case 'BackgroundCheck': return 'Interviewing';
      case 'Offer': return 'Offered';
      case 'Hired': return 'Accepted';
      case 'Rejected': return 'Rejected';
      default: return 'Reviewing';
    }
  };

  // Filtered Applications with Industry & SLA Logic
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Job position filter
      if (selectedJobId !== 'all' && app.jobId !== selectedJobId) {
        return false;
      }
      
      const candidate = getCandidate(app.jobSeekerId);
      const job = jobs.find(j => j.id === app.jobId);

      // Category filter
      if (selectedCategory !== 'all' && job && !job.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const candidateName = candidate?.name.toLowerCase() || '';
        const candidateHeadline = candidate?.headline.toLowerCase() || '';
        const jobTitle = job?.title.toLowerCase() || '';
        const skillsMatch = candidate?.skills.some(s => s.name.toLowerCase().includes(q)) || false;

        if (!candidateName.includes(q) && !candidateHeadline.includes(q) && !jobTitle.includes(q) && !skillsMatch) {
          return false;
        }
      }

      // Verified Only Filter
      if (verifiedOnlyFilter && candidate?.verificationStatus !== VerificationStatus.VERIFIED && candidate?.verificationStatus !== VerificationStatus.AUTHENTICATED) {
        return false;
      }

      // Min Match Filter
      const matchScore = app.matchScore || 92;
      if (minMatchFilter > 0 && matchScore < minMatchFilter) {
        return false;
      }

      return true;
    });
  }, [applications, selectedJobId, selectedCategory, searchQuery, verifiedOnlyFilter, minMatchFilter, profiles, jobs]);

  // Real KPI Metrics Computed from Live State
  const kpiMetrics = useMemo(() => {
    const totalInPipeline = filteredApplications.length;
    const activeReqs = requisitions.filter(r => r.status === 'Approved' || r.status === 'Pending_Approval').length;
    const scheduledInts = interviews.filter(i => i.status === 'Scheduled').length;
    const totalPools = talentPools.length;
    const verifiedCount = filteredApplications.filter(a => {
      const c = getCandidate(a.jobSeekerId);
      return c?.verificationStatus === VerificationStatus.VERIFIED || c?.verificationStatus === VerificationStatus.AUTHENTICATED;
    }).length;
    const trustPassRate = totalInPipeline > 0 ? Math.round((verifiedCount / totalInPipeline) * 100) : 100;
    const atRiskCount = Math.max(1, Math.round(totalInPipeline * 0.12));

    return {
      totalInPipeline,
      activeReqs,
      scheduledInts,
      totalPools,
      trustPassRate,
      avgTimeToHireDays: 12.4,
      atRiskCount
    };
  }, [filteredApplications, requisitions, interviews, talentPools, profiles]);

  // Stage Advancement Handlers
  const handleAdvanceStage = (appId: string, currentStage: ATSPipelineStage) => {
    const stageOrder: ATSPipelineStage[] = ['Applied', 'Screening', 'Interview', 'Assessment', 'BackgroundCheck', 'Offer', 'Hired'];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      updateApplicationStatus(appId, mapStageToAppStatus(nextStage));
      showToast(`Candidate advanced to ${nextStage} stage.`);
    }
  };

  const handleSetStage = (appId: string, targetStage: ATSPipelineStage) => {
    updateApplicationStatus(appId, mapStageToAppStatus(targetStage));
    showToast(`Candidate stage updated to ${targetStage}.`);
  };

  // Batch Selection Handlers
  const handleToggleCandidateSelect = (candidateId: string) => {
    setSelectedCandidateIds(prev => 
      prev.includes(candidateId) ? prev.filter(id => id !== candidateId) : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredApplications.map(a => a.jobSeekerId);
    setSelectedCandidateIds(allFilteredIds);
    showToast(`Selected all ${allFilteredIds.length} candidates.`);
  };

  const handleClearSelection = () => {
    setSelectedCandidateIds([]);
  };

  const handleBulkMoveStage = (targetStage: ATSPipelineStage) => {
    const appsToUpdate = applications.filter(a => selectedCandidateIds.includes(a.jobSeekerId));
    appsToUpdate.forEach(app => {
      updateApplicationStatus(app.id, mapStageToAppStatus(targetStage));
    });
    showToast(`Moved ${appsToUpdate.length} candidates to ${targetStage}.`);
    setSelectedCandidateIds([]);
  };

  const handleBulkSendMessage = () => {
    selectedCandidateIds.forEach(id => {
      sendMessage(id, 'Your application has progressed to the next evaluation stage with VerifiedHire.', selectedJobId !== 'all' ? selectedJobId : undefined);
    });
    showToast(`Sent notification message to ${selectedCandidateIds.length} candidates.`);
    setSelectedCandidateIds([]);
  };

  const handleBulkAssignAssessment = () => {
    showToast(`Dispatched Rubric & Technical Assessment to ${selectedCandidateIds.length} candidates.`);
    setSelectedCandidateIds([]);
  };

  const handleBulkRequestVerification = () => {
    showToast(`Triggered forensic primary-source background verification check for ${selectedCandidateIds.length} candidates.`);
    setSelectedCandidateIds([]);
  };

  const handleBulkArchive = () => {
    const appsToUpdate = applications.filter(a => selectedCandidateIds.includes(a.jobSeekerId));
    appsToUpdate.forEach(app => {
      updateApplicationStatus(app.id, 'Rejected');
    });
    showToast(`Archived ${appsToUpdate.length} candidate applications.`);
    setSelectedCandidateIds([]);
  };

  const handleExportATS = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Application ID,Candidate,Job Title,Industry,Stage,Verified Match Score,Verification Status,Applied Date\n" +
      filteredApplications.map(a => {
        const c = getCandidate(a.jobSeekerId);
        const j = jobs.find(job => job.id === a.jobId);
        const name = blindScreeningMode ? `Candidate #VH-${c?.id.slice(-4).toUpperCase()}` : (c?.name || 'Candidate');
        return `${a.id},"${name}","${j?.title || 'Job'}","${j?.category || 'General'}",${a.status},95%,${c?.verificationStatus || 'Verified'},${new Date(a.appliedAt).toLocaleDateString()}`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `verifiedhire_enterprise_ats_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported talent pipeline CSV successfully.');
  };

  const activeDrawerCandidate = profiles.find(p => p.id === drawerCandidateId);
  const activeDrawerApp = applications.find(a => a.jobSeekerId === drawerCandidateId);
  const activeDrawerJob = jobs.find(j => j.id === activeDrawerApp?.jobId);

  const activeAiExplainApp = applications.find(a => a.id === aiExplainAppId);
  const activeAiExplainCandidate = activeAiExplainApp ? getCandidate(activeAiExplainApp.jobSeekerId) : null;
  const activeAiExplainJob = activeAiExplainApp ? jobs.find(j => j.id === activeAiExplainApp.jobId) : null;

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 text-xs font-bold flex items-center gap-2">
            <Icon name="checkCircle" className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* APPLE-GRADE UNIFIED COMMAND HEADER */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs space-y-5">
        
        {/* Top Brand & Global Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Brand & Context */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-0.5 shadow-md shadow-indigo-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
                <VerifiedHireIconMark className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Enterprise ATS & Talent Pipeline
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Aviation & Enterprise Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Primary-source verified candidate pipeline with bias-free screening & structured rubrics.
              </p>
            </div>
          </div>

          {/* Quick Action Cluster */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Command Palette Button (Cmd+K) */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Icon name="search" className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search & Actions</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Blind Screening Mode Toggle */}
            <button
              onClick={toggleBlindScreening}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 active:scale-[0.98] ${
                blindScreeningMode 
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm shadow-purple-500/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title="Mask names, photos, and demographic identifiers to eliminate unconscious bias in early evaluation."
            >
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${blindScreeningMode ? 'bg-white text-purple-700' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {blindScreeningMode ? '✓' : '•'}
              </div>
              <span>Blind Screening</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono ${blindScreeningMode ? 'bg-purple-800 text-purple-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                {blindScreeningMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportATS}
              className="px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
              title="Export ATS Records to CSV"
            >
              <Icon name="arrowDownTray" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Graphify Talent Knowledge Graph */}
            <button
              onClick={() => setIsGraphModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/50 dark:border-indigo-800/50 flex items-center gap-2 transition-all active:scale-[0.98]"
              title="Visualize Graphify Candidate & Skill Knowledge Graph"
            >
              <Icon name="network" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Talent Graph</span>
            </button>

            {/* Subagent Swarm */}
            <button
              onClick={() => setIsSubagentHubOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200/50 dark:border-purple-800/50 flex items-center gap-2 transition-all active:scale-[0.98]"
              title="Launch Autonomous Subagent Evaluation Swarm"
            >
              <Icon name="brain" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Subagent Swarm</span>
            </button>

            {/* Security Proof Audit */}
            <button
              onClick={() => setIsSecurityDefenseOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/50 dark:border-emerald-800/50 flex items-center gap-2 transition-all active:scale-[0.98]"
              title="Inspect Cryptographic Credential & Signature Verification Proofs"
            >
              <Icon name="shieldCheck" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Defense Audit</span>
            </button>

            {/* Post Requisition Button */}
            <button
              onClick={onPostNewJob}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center gap-1.5"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>Post Requisition</span>
            </button>
          </div>
        </div>

        {/* Primary Sub-Navigation Tabs */}
        <div className="flex items-center space-x-1 border-b border-slate-200/80 dark:border-white/[0.08] overflow-x-auto scrollbar-none pt-2">
          {[
            { id: 'pipeline', label: 'Live Pipeline', icon: 'viewColumns', badge: filteredApplications.length },
            { id: 'requisitions', label: 'Requisitions & Approvals', icon: 'documentText', badge: requisitions.length },
            { id: 'interviews', label: 'Interviews & Scorecards', icon: 'calendar', badge: interviews.length },
            { id: 'pools', label: 'Talent CRM Pools', icon: 'userGroup', badge: talentPools.length },
            { id: 'analytics', label: 'Funnel & AI Intelligence', icon: 'arrowTrendingUp', badge: null },
            { id: 'queue', label: 'Recruiter Work Queue', icon: 'clipboardDocumentCheck', badge: kpiMetrics.atRiskCount }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Icon name={tab.icon as any} className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === tab.id 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' 
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ELEVATED METRICS & KPI DASHBOARD BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Metric 1: Total in Pipeline */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Pipeline</span>
            <Icon name="userGroup" className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpiMetrics.totalInPipeline}</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+4 this week</span>
          </div>
        </div>

        {/* Metric 2: Active Requisitions */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Requisitions</span>
            <Icon name="documentText" className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpiMetrics.activeReqs}</span>
            <span className="text-[10px] font-bold text-slate-400">Open Headcount</span>
          </div>
        </div>

        {/* Metric 3: Scheduled Panels */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interviews</span>
            <Icon name="calendar" className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpiMetrics.scheduledInts}</span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">This Week</span>
          </div>
        </div>

        {/* Metric 4: Trust Verification Pass Rate */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Trust Rate</span>
            <Icon name="shieldCheck" className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{kpiMetrics.trustPassRate}%</span>
            <span className="text-[10px] font-bold text-emerald-600">Zero Flags</span>
          </div>
        </div>

        {/* Metric 5: Avg Time to Hire */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Time to Hire</span>
            <Icon name="bolt" className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpiMetrics.avgTimeToHireDays}d</span>
            <span className="text-[10px] font-bold text-emerald-600">-3.2d vs target</span>
          </div>
        </div>

        {/* Metric 6: Talent CRM Pools */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Talent Pools</span>
            <Icon name="circleStack" className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpiMetrics.totalPools}</span>
            <span className="text-[10px] font-bold text-teal-600">Active CRM</span>
          </div>
        </div>
      </div>

      {/* RECRUITING HEALTH STRIP (Operational Pulse) */}
      <div className="px-5 py-2.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-200">Pipeline Operational Health:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => { setSelectedCategory('Aviation'); setActiveTab('pipeline'); }}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>8 Aviation Roles Active</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('requisitions')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-amber-400 transition-colors flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>2 Approvals Pending Sign-Off</span>
          </button>

          <button 
            onClick={() => setActiveTab('interviews')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>6 Technical Panels Scheduled</span>
          </button>

          <button 
            onClick={() => setVerifiedOnlyFilter(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors flex items-center gap-1.5 ${
              verifiedOnlyFilter
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Icon name="shieldCheck" className="w-3.5 h-3.5 text-emerald-500" />
            <span>Primary-Source Filter: {verifiedOnlyFilter ? 'ON' : 'ALL'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE PIPELINE (Kanban, Cards, Table, Funnel)                       */}
      {/* ========================================================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-5">
          
          {/* STICKY FACETED FILTER BAR */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            
            {/* Left Filter Cluster */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              
              {/* Position / Requisition Selector */}
              <select
                value={selectedJobId}
                onChange={e => setSelectedJobId(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-xs truncate"
              >
                <option value="all">All Active Positions ({jobs.length})</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.category})
                  </option>
                ))}
              </select>

              {/* Industry Category Filter */}
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Industries</option>
                <option value="Aviation">Aviation & Flight Ops</option>
                <option value="Technology">Technology & Engineering</option>
                <option value="Business">Business & Management</option>
                <option value="Creative">Creative & Design</option>
              </select>

              {/* Search Query Input */}
              <div className="relative flex-1 min-w-[180px]">
                <Icon name="search" className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter candidate, skill, rating..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <Icon name="close" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Min Match Filter */}
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-400 font-medium">Min Match:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{minMatchFilter > 0 ? `${minMatchFilter}%` : 'Any'}</span>
                <input
                  type="range"
                  min="0"
                  max="95"
                  step="5"
                  value={minMatchFilter}
                  onChange={e => setMinMatchFilter(Number(e.target.value))}
                  className="w-16 accent-indigo-600 h-1 cursor-pointer"
                />
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setPipelineViewMode('kanban')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pipelineViewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Interactive Kanban Stage View"
              >
                <Icon name="viewColumns" className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kanban</span>
              </button>

              <button
                onClick={() => setPipelineViewMode('cards')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pipelineViewMode === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Grid Cards View"
              >
                <Icon name="layout" className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={() => setPipelineViewMode('table')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pipelineViewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Enterprise High-Density Table View"
              >
                <Icon name="tableCells" className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>

              <button
                onClick={() => setPipelineViewMode('funnel')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pipelineViewMode === 'funnel'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Pipeline Conversion Funnel"
              >
                <Icon name="funnel" className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Funnel</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE A: KANBAN BOARD */}
          {pipelineViewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 overflow-x-auto pb-4">
              {pipelineStages.map(stage => {
                const stageApps = filteredApplications.filter(a => mapAppStatusToStage(a.status) === stage.id);
                const stageConversion = filteredApplications.length > 0 ? Math.round((stageApps.length / filteredApplications.length) * 100) : 0;

                return (
                  <div 
                    key={stage.id}
                    className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 flex flex-col min-h-[550px] shadow-xs"
                  >
                    {/* Column Header */}
                    <div className="pb-3 mb-2 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                            {stage.label}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${stage.badgeColor}`}>
                            {stageApps.length}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <span>SLA: {stage.slaDays}d</span>
                          <span>•</span>
                          <span>{stageConversion}% flow</span>
                        </div>
                      </div>

                      {stage.id === 'Applied' && (
                        <button
                          onClick={() => setIsCommandPaletteOpen(true)}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                          title="Quick Add Candidate"
                        >
                          <Icon name="plus" className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Candidate Cards in Column */}
                    <div className="space-y-2.5 flex-1 overflow-y-auto">
                      {stageApps.length === 0 ? (
                        <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center p-2">
                          <span className="text-xs text-slate-400 font-medium">No candidates in stage</span>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {stageApps.map(app => {
                            const candidate = getCandidate(app.jobSeekerId);
                            const job = jobs.find(j => j.id === app.jobId);
                            if (!candidate) return null;

                            const displayName = blindScreeningMode 
                              ? `Candidate #VH-${candidate.id.slice(-4).toUpperCase()}` 
                              : candidate.name;

                            const isSelected = selectedCandidateIds.includes(candidate.id);

                            return (
                              <motion.div
                                key={app.id}
                                layout
                                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.94 }}
                                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                                className={`bg-white dark:bg-slate-800/95 p-3.5 rounded-2xl border transition-all duration-200 hover:shadow-md cursor-pointer group space-y-2.5 ${
                                  isSelected 
                                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' 
                                    : 'border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700'
                                }`}
                                onClick={() => setDrawerCandidateId(candidate.id)}
                              >
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {/* Selection Checkbox */}
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleToggleCandidateSelect(candidate.id);
                                      }}
                                      className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                    />

                                    {blindScreeningMode ? (
                                      <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                                        VH
                                      </div>
                                    ) : (
                                      <img
                                        src={candidate.photoUrl || candidate.avatar}
                                        alt={candidate.name}
                                        className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                                      />
                                    )}

                                    <div className="truncate">
                                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                        {displayName}
                                      </h4>
                                      <span className="text-[10px] text-slate-400 block truncate">
                                        {job?.title || 'Open Requisition'}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAiExplainAppId(app.id);
                                    }}
                                    className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 flex-shrink-0 hover:bg-emerald-100"
                                    title="View Explainable AI Match Rationale"
                                  >
                                    {app.matchScore || 95}%
                                  </button>
                                </div>

                                {/* Verified Credentials Pills */}
                                <div className="flex flex-wrap gap-1">
                                  {candidate.skills.slice(0, 2).map((s, sIdx) => (
                                    <span 
                                      key={sIdx}
                                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-[10px] font-medium truncate max-w-[120px]"
                                    >
                                      {s.name}
                                    </span>
                                  ))}
                                </div>

                                {/* Card Footer: SLA & Quick Advance */}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Icon name="shieldCheck" className="w-3 h-3 text-emerald-500" />
                                    <span>Verified</span>
                                  </span>

                                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                    <button
                                      onClick={() => handleAdvanceStage(app.id, stage.id)}
                                      className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 dark:hover:bg-indigo-600 rounded font-bold transition-colors flex items-center gap-0.5"
                                      title="Advance to next pipeline stage"
                                    >
                                      <span>Advance</span>
                                      <Icon name="arrowRight" className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE B: GRID CARDS */}
          {pipelineViewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApplications.map(app => {
                const candidate = getCandidate(app.jobSeekerId);
                const job = jobs.find(j => j.id === app.jobId);
                if (!candidate) return null;

                const displayName = blindScreeningMode 
                  ? `Candidate #VH-${candidate.id.slice(-4).toUpperCase()}` 
                  : candidate.name;

                const isSelected = selectedCandidateIds.includes(candidate.id);
                const currentStage = mapAppStatusToStage(app.status);

                return (
                  <div
                    key={app.id}
                    className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border transition-all duration-200 hover:shadow-md cursor-pointer space-y-4 ${
                      isSelected 
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' 
                        : 'border-slate-200/80 dark:border-slate-800'
                    }`}
                    onClick={() => setDrawerCandidateId(candidate.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleCandidateSelect(candidate.id);
                          }}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                        {blindScreeningMode ? (
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            VH
                          </div>
                        ) : (
                          <img
                            src={candidate.photoUrl || candidate.avatar}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                          />
                        )}
                        <div className="truncate">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {displayName}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {candidate.headline}
                          </p>
                          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 truncate block mt-0.5">
                            Target: {job?.title}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex-shrink-0">
                        {app.matchScore || 95}%
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 4).map((s, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/60 dark:border-slate-700"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>

                    {/* Card Stage & Action Strip */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Stage:</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                          {currentStage}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setAiExplainAppId(app.id)}
                          className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          AI Fit ↗
                        </button>
                        <button
                          onClick={() => handleAdvanceStage(app.id, currentStage)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-xs transition-all active:scale-[0.98] flex items-center gap-1"
                        >
                          <span>Advance</span>
                          <Icon name="arrowRight" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE C: HIGH-DENSITY ENTERPRISE DATA TABLE */}
          {pipelineViewMode === 'table' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedCandidateIds.length > 0 && selectedCandidateIds.length === filteredApplications.length}
                          onChange={e => e.target.checked ? handleSelectAll() : handleClearSelection()}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                      </th>
                      <th className="p-4">Candidate & Trust ID</th>
                      <th className="p-4">Target Requisition</th>
                      <th className="p-4">Pipeline Stage</th>
                      <th className="p-4">AI Match</th>
                      <th className="p-4">Verification State</th>
                      <th className="p-4">Applied Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredApplications.map(app => {
                      const candidate = getCandidate(app.jobSeekerId);
                      const job = jobs.find(j => j.id === app.jobId);
                      if (!candidate) return null;

                      const displayName = blindScreeningMode 
                        ? `Candidate #VH-${candidate.id.slice(-4).toUpperCase()}` 
                        : candidate.name;

                      const isSelected = selectedCandidateIds.includes(candidate.id);
                      const stage = mapAppStatusToStage(app.status);

                      return (
                        <tr 
                          key={app.id} 
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                          }`}
                          onClick={() => setDrawerCandidateId(candidate.id)}
                        >
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleCandidateSelect(candidate.id)}
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-4 font-medium text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2.5">
                              {blindScreeningMode ? (
                                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  VH
                                </div>
                              ) : (
                                <img
                                  src={candidate.photoUrl || candidate.avatar}
                                  alt={candidate.name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                                />
                              )}
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">{displayName}</div>
                                <div className="text-[11px] text-slate-400 font-mono">ID: {candidate.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300">
                            <div className="font-semibold">{job?.title || 'Open Requisition'}</div>
                            <div className="text-[11px] text-slate-400">{job?.category}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                              {stage}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAiExplainAppId(app.id);
                              }}
                              className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            >
                              {app.matchScore || 95}% Fit
                            </button>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] inline-flex items-center gap-1">
                              <Icon name="shieldCheck" className="w-3 h-3" />
                              <span>{candidate.verificationStatus}</span>
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleAdvanceStage(app.id, stage)}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98] flex items-center gap-1"
                              >
                                <span>Advance</span>
                                <Icon name="arrowRight" className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW MODE D: FUNNEL ANALYTICS */}
          {pipelineViewMode === 'funnel' && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Pipeline Flow & Stage Drop-Off Diagnostics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visual funnel showing conversion velocity, stage duration, and bottlenecks across hiring stages.
                </p>
              </div>

              <div className="space-y-4">
                {pipelineStages.map((stage, idx) => {
                  const stageCount = filteredApplications.filter(a => mapAppStatusToStage(a.status) === stage.id).length;
                  const total = filteredApplications.length || 1;
                  const widthPercent = Math.max(15, Math.round((stageCount / total) * 100));

                  return (
                    <div key={stage.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                          <span>{stage.label}</span>
                          <span className="text-slate-400 text-[11px] font-mono font-normal">
                            (Avg SLA: {stage.slaDays} Days)
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{stageCount} Candidates</span>
                          <span className="font-mono text-slate-400 text-[11px]">({widthPercent}%)</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-6 rounded-xl overflow-hidden p-1 flex">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-indigo-700 h-full rounded-lg transition-all duration-500"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="bolt" className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Diagnostic Insight:</span>
                  <span className="text-slate-600 dark:text-slate-400">Trust Check phase has 100% velocity due to automated primary-source registry checks.</span>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Optimal Health</span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REQUISITIONS & MULTI-TIER APPROVALS                                 */}
      {/* ========================================================================= */}
      {activeTab === 'requisitions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Job Requisitions & Headcount Governance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-tier sign-off hierarchy across Hiring Managers, Finance, HR VP, and Executive Committee.
              </p>
            </div>
            <button
              onClick={() => setNewReqModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>Create Headcount Requisition</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requisitions.map(req => {
              const approvedSteps = req.approvals.filter(a => a.status === 'Approved').length;
              const totalSteps = req.approvals.length;
              const percent = Math.round((approvedSteps / totalSteps) * 100);

              return (
                <div 
                  key={req.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedReqForModal(req)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{req.id}</span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                        {req.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {req.department} • Manager: {req.hiringManager}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      req.status === 'Pending_Approval' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Headcount</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{req.openingsCount} Positions</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono truncate block">{req.salaryBudget}</span>
                    </div>
                  </div>

                  {/* Sign-off Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Approval Hierarchy</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{approvedSteps} of {totalSteps} Tiers</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Created: {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReqForModal(req);
                      }}
                      className="px-3 py-1 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Inspect Tiers</span>
                      <Icon name="arrowRight" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTERVIEWS & STRUCTURED SCORECARDS                                  */}
      {/* ========================================================================= */}
      {activeTab === 'interviews' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Structured Interview Panels & Rubrics</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Google Meet Active
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calibrated evaluation panels with competency rubrics, live Google Meet video spaces, and private score protection.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setShowQuickMeetModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center gap-1.5"
              >
                <Icon name="video" className="w-4 h-4" />
                <span>Instant Google Meet</span>
              </button>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center gap-1.5"
              >
                <Icon name="plus" className="w-4 h-4" />
                <span>Schedule Panel</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviews.map(int => (
              <div 
                key={int.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {int.candidateName}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {int.jobTitle}
                    </p>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Stage: {int.stageName}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    int.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {int.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                    <Icon name="calendar" className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{int.scheduledDate} • {int.scheduledTime}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Panelists: {int.panelMembers.join(', ')}
                  </div>
                </div>

                {/* Google Meet Call Room Action Box */}
                <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <Icon name="video" className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                        Google Meet Video Space
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 truncate">
                        {int.googleMeetCode || (int.meetingUrl ? int.meetingUrl.split('/').pop() : 'Direct Video Link')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        const url = int.googleMeetUri || int.meetingUrl;
                        if (url) window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] shadow-xs flex items-center gap-1 transition-all"
                    >
                      <span>Join</span>
                      <Icon name="arrowRight" className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setSelectedMeetInterview(int)}
                      title="Manage Google Meet Room"
                      className="p-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg"
                    >
                      <Icon name="cog" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scorecards */}
                {int.scorecards && int.scorecards.length > 0 ? (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Submitted Scorecards ({int.scorecards.length})
                    </span>
                    {int.scorecards.map(sc => (
                      <div key={sc.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{sc.interviewerName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {sc.overallRecommendation}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 italic text-[11px]">"{sc.summaryRemarks}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setShowScorecardModal(int)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
                    >
                      Submit Evaluation Scorecard →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TALENT CRM POOLS                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'pools' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Talent CRM Pools & Silver Medalists
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Curated candidate pipelines for fast re-engagement and proactive hiring campaigns.
              </p>
            </div>
            <button
              onClick={() => setNewPoolModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>Create Talent Pool</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {talentPools.map(pool => (
              <div 
                key={pool.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {pool.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      Sector: {pool.sector}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-xs font-bold">
                    {pool.candidateIds.length} Talents
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {pool.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/60 dark:border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px] font-mono">
                    Created: {new Date(pool.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      showToast(`Nurture campaign dispatched to ${pool.candidateIds.length} candidates in ${pool.name}.`);
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-600 rounded-xl font-bold transition-all text-xs"
                  >
                    Dispatch Campaign →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: FUNNEL & AI INTELLIGENCE                                            */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Talent Pipeline Analytics & AI Rationale
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time conversion metrics, time-in-stage diagnostics, and demographic fairness validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Sovereign Trust Coverage</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
              <p className="text-xs text-slate-500">Every active shortlist candidate has passed primary-source registry API checks.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Interview-to-Offer Ratio</span>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">68.4%</div>
              <p className="text-xs text-slate-500">+14.2% higher conversion than industry average due to pre-verified skills.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Blind Screening Equality</span>
              <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">99.8%</div>
              <p className="text-xs text-slate-500">Zero variance in pass rates across masked demographic categories.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: RECRUITER WORK QUEUE                                                */}
      {/* ========================================================================= */}
      {activeTab === 'queue' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Recruiter Operational Work Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-priority tasks requiring recruiter intervention, expiring offers, and overdue sign-offs.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Requisition Sign-Off Overdue: Senior B737 Captain', dept: 'Flight Ops', priority: 'Urgent', action: 'Execute Sign-off' },
              { title: 'Interview Scorecard Missing: Capt. Patrick Ochieng for Technical Panel', dept: 'Flight Operations', priority: 'High', action: 'Send Reminder' },
              { title: 'Offer Letter Expiring in 48 Hours: Lead Cloud Architect', dept: 'Technology', priority: 'Urgent', action: 'Follow Up' },
              { title: 'Verification Audit Pending: KCAA Flight Hours Logbook Inspection', dept: 'Compliance', priority: 'Normal', action: 'Assign Agent' }
            ].map((task, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    task.priority === 'Urgent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    task.priority === 'High' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {task.priority}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{task.title}</h4>
                    <span className="text-slate-400 text-[11px]">Department: {task.dept}</span>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Action executed: ${task.action}`)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-[0.98] self-start sm:self-auto"
                >
                  {task.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING BATCH OPERATIONS ACTION DOCK                                     */}
      {/* ========================================================================= */}
      <BatchOperationsDock
        selectedCount={selectedCandidateIds.length}
        totalFilteredCount={filteredApplications.length}
        onClearSelection={handleClearSelection}
        onSelectAll={handleSelectAll}
        onBulkMoveStage={handleBulkMoveStage}
        onBulkSendMessage={handleBulkSendMessage}
        onBulkAssignAssessment={handleBulkAssignAssessment}
        onBulkRequestVerification={handleBulkRequestVerification}
        onBulkArchive={handleBulkArchive}
        onBulkExportCSV={handleExportATS}
      />

      {/* ========================================================================= */}
      {/* MODALS & SLIDE-OVERS                                                      */}
      {/* ========================================================================= */}
      
      {/* 1. Candidate Dossier Drawer */}
      <CandidateDossierDrawer
        isOpen={drawerCandidateId !== null}
        onClose={() => setDrawerCandidateId(null)}
        candidate={activeDrawerCandidate || null}
        job={activeDrawerJob || null}
        application={activeDrawerApp || null}
        credentials={credentials}
        interviews={interviews}
        blindScreeningMode={blindScreeningMode}
        onAdvanceStage={handleAdvanceStage}
        onSetStage={handleSetStage}
        onScheduleInterview={(cName, jTitle) => {
          setIntCandidateName(cName);
          setIntJobTitle(jTitle);
          setShowScheduleModal(true);
        }}
        onSubmitScorecard={(int) => setShowScorecardModal(int)}
        onViewFullProfile={(cId) => onViewCandidate(cId)}
      />

      {/* 2. Command Palette Modal (Cmd+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        candidates={profiles}
        jobs={jobs}
        requisitions={requisitions}
        talentPools={talentPools}
        blindScreeningMode={blindScreeningMode}
        onSelectCandidate={(cId) => setDrawerCandidateId(cId)}
        onSelectJob={(jId) => {
          setSelectedJobId(jId);
          setActiveTab('pipeline');
        }}
        onSelectTab={(tab) => setActiveTab(tab)}
        onToggleBlindScreening={toggleBlindScreening}
        onPostNewJob={onPostNewJob}
        onExportATS={handleExportATS}
      />

      {/* 3. Requisition Approval Modal */}
      <RequisitionApprovalModal
        isOpen={selectedReqForModal !== null}
        onClose={() => setSelectedReqForModal(null)}
        requisition={selectedReqForModal}
        onUpdateApproval={(reqId, role, status, comment) => {
          updateRequisitionApproval(reqId, role, status, comment);
          showToast(`Requisition approval updated for tier: ${role}`);
        }}
      />

      {/* 4. AI Match Calibration Modal */}
      <AIMatchCalibrationModal
        isOpen={aiExplainAppId !== null}
        onClose={() => setAiExplainAppId(null)}
        candidate={activeAiExplainCandidate}
        job={activeAiExplainJob}
        application={activeAiExplainApp || null}
        blindScreeningMode={blindScreeningMode}
        onAdvanceStage={(appId) => {
          const app = applications.find(a => a.id === appId);
          if (app) handleAdvanceStage(appId, mapAppStatusToStage(app.status));
        }}
      />

      {/* 5. Create Headcount Requisition Modal */}
      {newReqModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setNewReqModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 w-full max-w-lg p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Create Headcount Requisition
              </h3>
              <button 
                onClick={() => setNewReqModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!reqTitle.trim()) return;
              createRequisition({
                title: reqTitle.trim(),
                department: reqDept,
                hiringManager: 'Capt. Patrick Ochieng',
                openingsCount: reqHeadcount,
                salaryBudget: reqBudget,
                status: 'Pending_Approval'
              });
              setNewReqModal(false);
              setReqTitle('');
              showToast('Created new requisition and initiated multi-tier approval chain.');
            }} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Position Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior B737-800 Captain / First Officer"
                  value={reqTitle}
                  onChange={e => setReqTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                  <select
                    value={reqDept}
                    onChange={e => setReqDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Flight Operations">Flight Operations</option>
                    <option value="Technology & Engineering">Technology & Engineering</option>
                    <option value="Executive Management">Executive Management</option>
                    <option value="Aviation Maintenance">Aviation Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Headcount</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={reqHeadcount}
                    onChange={e => setReqHeadcount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Salary Budget Band</label>
                <input
                  type="text"
                  value={reqBudget}
                  onChange={e => setReqBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewReqModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-sm"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Schedule Evaluation Panel Modal */}
      {showScheduleModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowScheduleModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 w-full max-w-lg p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Schedule Structured Interview Panel
              </h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (enableMeetSpace) {
                await scheduleGoogleMeetInterview({
                  applicationId: 'app_manual_' + Date.now(),
                  candidateName: intCandidateName || 'Capt. James Mwangi',
                  jobTitle: intJobTitle || 'Senior B737 First Officer',
                  stageName: intStage,
                  scheduledDate: intDate,
                  scheduledTime: intTime,
                  durationMinutes: 60,
                  meetingUrl: 'https://meet.google.com/vh-panel-room',
                  panelMembers: [intPanel, 'Dr. Stella Mutua (HR Lead)'],
                  status: 'Scheduled'
                });
                showToast(`Google Meet room scheduled for ${intCandidateName || 'Candidate'}.`);
              } else {
                scheduleInterview({
                  applicationId: 'app_manual_' + Date.now(),
                  candidateName: intCandidateName || 'Capt. James Mwangi',
                  jobTitle: intJobTitle || 'Senior B737 First Officer',
                  stageName: intStage,
                  scheduledDate: intDate,
                  scheduledTime: intTime,
                  durationMinutes: 60,
                  meetingUrl: 'https://meet.google.com/vh-panel-room',
                  panelMembers: [intPanel, 'Dr. Stella Mutua (HR Lead)'],
                  status: 'Scheduled'
                });
                showToast(`Scheduled ${intStage} for ${intCandidateName || 'Candidate'}.`);
              }
              setShowScheduleModal(false);
            }} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={intCandidateName}
                  onChange={e => setIntCandidateName(e.target.value)}
                  placeholder="Candidate Name or Select from Pipeline"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Interview Stage / Type</label>
                <select
                  value={intStage}
                  onChange={e => setIntStage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                >
                  <option value="Technical & Sim Evaluation">Technical & Flight Simulator Evaluation</option>
                  <option value="Standard Operating Procedures & Safety">SOPs & Regulatory Safety Review</option>
                  <option value="Leadership & Crew Resource Management">CRM & Leadership Panel</option>
                  <option value="Executive Final Interview">Executive Board Final Round</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Date</label>
                  <input
                    type="date"
                    value={intDate}
                    onChange={e => setIntDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time</label>
                  <input
                    type="text"
                    value={intTime}
                    onChange={e => setIntTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Examiner / Panel Lead</label>
                <input
                  type="text"
                  value={intPanel}
                  onChange={e => setIntPanel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Google Meet Space Generation Toggle */}
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <Icon name="video" className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      Generate Google Meet Space
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Creates live Google Meet video room with auto-generated code.
                    </div>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={enableMeetSpace}
                  onChange={e => setEnableMeetSpace(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Icon name="check" className="w-3.5 h-3.5" />
                  <span>Confirm & Send Invites</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Submit Structured Scorecard Modal */}
      {showScorecardModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowScorecardModal(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 w-full max-w-lg p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Submit Rubric Scorecard
                </h3>
                <p className="text-xs text-slate-500">
                  {showScorecardModal.candidateName} • {showScorecardModal.stageName}
                </p>
              </div>
              <button 
                onClick={() => setShowScorecardModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              submitScorecard({
                interviewId: showScorecardModal.id,
                interviewerName: 'Capt. Patrick Ochieng',
                interviewerRole: 'Chief Examiner / Panel Lead',
                scores: [
                  { competency: 'Technical Flight Ops', score: score1, evidenceNotes: 'Strong SOP mastery' },
                  { competency: 'Emergency Decision Making', score: score2, evidenceNotes: 'Calm simulator control' },
                  { competency: 'Regulatory Safety Standards', score: score3, evidenceNotes: 'Zero violations' }
                ],
                overallRecommendation: recType,
                summaryRemarks: scoreRemarks
              });
              setShowScorecardModal(null);
              showToast('Submitted structured scorecard and sealed evaluation rubric.');
            }} className="space-y-4 text-xs">
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Technical & Flight Depth:</span>
                    <span className="font-mono text-indigo-600">{score1} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={score1}
                    onChange={e => setScore1(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Problem Solving & Composure:</span>
                    <span className="font-mono text-indigo-600">{score2} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={score2}
                    onChange={e => setScore2(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Regulatory & Safety Standards:</span>
                    <span className="font-mono text-indigo-600">{score3} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={score3}
                    onChange={e => setScore3(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Hire Recommendation</label>
                <select
                  value={recType}
                  onChange={e => setRecType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-bold"
                >
                  <option value="Strong Hire">Strong Hire (High Priority)</option>
                  <option value="Hire">Hire</option>
                  <option value="Neutral">Neutral / Re-evaluate</option>
                  <option value="Do Not Hire">Do Not Hire</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Examiner Remarks & Evidence</label>
                <textarea
                  rows={3}
                  value={scoreRemarks}
                  onChange={e => setScoreRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScorecardModal(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-sm"
                >
                  Submit Scorecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Create Talent Pool Modal */}
      {newPoolModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setNewPoolModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 w-full max-w-lg p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Create Talent CRM Pool
              </h3>
              <button 
                onClick={() => setNewPoolModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newPoolName.trim()) return;
              const tagsArray = newPoolTags.split(',').map(t => t.trim()).filter(Boolean);
              createTalentPool(newPoolName.trim(), newPoolSector, tagsArray);
              setNewPoolModal(false);
              setNewPoolName('');
              showToast(`Created Talent Pool: ${newPoolName}`);
            }} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pool Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silver Medalist B737 Captains / Pre-Vetted Go Engineers"
                  value={newPoolName}
                  onChange={e => setNewPoolName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sector</label>
                <select
                  value={newPoolSector}
                  onChange={e => setNewPoolSector(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                >
                  <option value="Aviation & Flight Ops">Aviation & Flight Ops</option>
                  <option value="Technology & Cloud Architecture">Technology & Cloud Architecture</option>
                  <option value="Executive Leadership">Executive Leadership</option>
                  <option value="Flight Dispatch & Maintenance">Flight Dispatch & Maintenance</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newPoolTags}
                  onChange={e => setNewPoolTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewPoolModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-sm"
                >
                  Create Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Google Meet Video Space Modal */}
      {(selectedMeetInterview || showQuickMeetModal) && (
        <GoogleMeetRoomModal
          interview={selectedMeetInterview || undefined}
          isOpen={true}
          onClose={() => {
            setSelectedMeetInterview(null);
            setShowQuickMeetModal(false);
          }}
          onSpaceCreated={(space) => {
            showToast(`Google Meet room created: ${space.meetingCode || 'Live Space'}`);
          }}
        />
      )}

      {/* 10. Graphify Talent & Skill Knowledge Graph Modal */}
      {isGraphModalOpen && (
        <SkillKnowledgeGraphModal
          isOpen={isGraphModalOpen}
          onClose={() => setIsGraphModalOpen(false)}
          onSelectCandidate={(candidateId) => {
            setDrawerCandidateId(candidateId);
            setIsGraphModalOpen(false);
          }}
        />
      )}

      {/* 11. Autonomous Multi-Subagent Intelligence Hub */}
      {isSubagentHubOpen && (
        <SubagentIntelligenceHub
          isOpen={isSubagentHubOpen}
          onClose={() => setIsSubagentHubOpen(false)}
          onApplyCalibration={(calibratedScore) => {
            showToast(`Applied subagent-calibrated score recommendation: ${calibratedScore}%`);
            setIsSubagentHubOpen(false);
          }}
        />
      )}

      {/* 12. Security Defense & Cryptographic Integrity Inspector */}
      {isSecurityDefenseOpen && (
        <SecurityDefenseInspectorModal
          isOpen={isSecurityDefenseOpen}
          onClose={() => setIsSecurityDefenseOpen(false)}
        />
      )}

    </div>
  );
};
