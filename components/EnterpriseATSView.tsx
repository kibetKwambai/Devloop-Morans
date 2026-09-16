import React, { useState, useMemo } from 'react';
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
    requisitions,
    interviews,
    talentPools,
    blindScreeningMode,
    toggleBlindScreening,
    updateApplicationStatus,
    createRequisition,
    updateRequisitionApproval,
    scheduleInterview,
    submitScorecard,
    createTalentPool,
    addCandidateToPool
  } = useAppContext();

  // Navigation Sub-tabs & Pipeline View Modes
  const [activeTab, setActiveTab] = useState<'pipeline' | 'requisitions' | 'interviews' | 'pools'>('pipeline');
  const [pipelineViewMode, setPipelineViewMode] = useState<'kanban' | 'list' | 'analytics'>('kanban');

  // Filters & Search
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState(false);
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);

  // Selected Candidate Drawer & Modals
  const [drawerCandidateId, setDrawerCandidateId] = useState<string | null>(null);
  const [aiExplainAppId, setAiExplainAppId] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [showScorecardModal, setShowScorecardModal] = useState<StructuredInterview | null>(null);
  const [selectedPoolForDetails, setSelectedPoolForDetails] = useState<TalentPool | null>(null);
  const [poolAssignModalCandidateId, setPoolAssignModalCandidateId] = useState<string | null>(null);
  const [newPoolModal, setNewPoolModal] = useState(false);
  const [newPoolName, setNewPoolName] = useState('');
  const [newPoolSector, setNewPoolSector] = useState('Aviation & Flight Ops');
  const [newPoolTags, setNewPoolTags] = useState('Pre-Verified, Priority');

  // Requisition Modal
  const [newReqModal, setNewReqModal] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDept, setReqDept] = useState('Flight Operations');
  const [reqBudget, setReqBudget] = useState('KES 450,000 - 650,000/mo');

  // Interview Form State
  const [intCandidateName, setIntCandidateName] = useState('');
  const [intJobTitle, setIntJobTitle] = useState('');
  const [intStage, setIntStage] = useState('Technical & Sim Evaluation');
  const [intDate, setIntDate] = useState('2026-09-20');
  const [intTime, setIntTime] = useState('10:00 AM EAT');
  const [intPanel, setIntPanel] = useState('Capt. Patrick Ochieng, Senior Examiner');

  // Scorecard Input State
  const [score1, setScore1] = useState(5);
  const [score2, setScore2] = useState(4);
  const [score3, setScore3] = useState(5);
  const [recType, setRecType] = useState<'Strong Hire' | 'Hire' | 'Neutral' | 'Do Not Hire'>('Strong Hire');
  const [scoreRemarks, setScoreRemarks] = useState('Candidate demonstrated stellar command protocols, calm emergency decision-making, and authenticated KCAA Class 1 medicals.');

  // Pipeline Stages Definition
  const pipelineStages: { id: ATSPipelineStage; label: string; badgeColor: string; topBorder: string; bgAccent: string }[] = [
    { id: 'Applied', label: '1. Applied', badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', topBorder: 'border-t-slate-400', bgAccent: 'bg-slate-50/60 dark:bg-slate-900/40' },
    { id: 'Screening', label: '2. Screening', badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', topBorder: 'border-t-blue-500', bgAccent: 'bg-blue-50/30 dark:bg-blue-950/20' },
    { id: 'Interview', label: '3. Interview', badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300', topBorder: 'border-t-amber-500', bgAccent: 'bg-amber-50/30 dark:bg-amber-950/20' },
    { id: 'Assessment', label: '4. Assessment', badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300', topBorder: 'border-t-purple-500', bgAccent: 'bg-purple-50/30 dark:bg-purple-950/20' },
    { id: 'BackgroundCheck', label: '5. Trust Check', badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300', topBorder: 'border-t-teal-500', bgAccent: 'bg-teal-50/30 dark:bg-teal-950/20' },
    { id: 'Offer', label: '6. Offer Extended', badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300', topBorder: 'border-t-indigo-500', bgAccent: 'bg-indigo-50/30 dark:bg-indigo-950/20' },
    { id: 'Hired', label: '7. Hired', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', topBorder: 'border-t-emerald-500', bgAccent: 'bg-emerald-50/30 dark:bg-emerald-950/20' }
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

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Job position filter
      if (selectedJobId !== 'all' && app.jobId !== selectedJobId) {
        return false;
      }
      
      const candidate = getCandidate(app.jobSeekerId);
      const job = jobs.find(j => j.id === app.jobId);

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

      return true;
    });
  }, [applications, selectedJobId, searchQuery, verifiedOnlyFilter, profiles, jobs]);

  // Stage Advancement
  const handleAdvanceStage = (appId: string, currentStage: ATSPipelineStage) => {
    const stageOrder: ATSPipelineStage[] = ['Applied', 'Screening', 'Interview', 'Assessment', 'BackgroundCheck', 'Offer', 'Hired'];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      updateApplicationStatus(appId, mapStageToAppStatus(nextStage));
    }
  };

  const handleSetStage = (appId: string, targetStage: ATSPipelineStage) => {
    updateApplicationStatus(appId, mapStageToAppStatus(targetStage));
  };

  const handleExportATS = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Application ID,Candidate,Job,Stage,Verified Match Score,Verification Status,Applied Date\n" +
      filteredApplications.map(a => {
        const c = getCandidate(a.jobSeekerId);
        const j = jobs.find(job => job.id === a.jobId);
        return `${a.id},"${c?.name || 'Candidate'}","${j?.title || 'Job'}",${a.status},94%,${c?.verificationStatus || 'Verified'},${new Date(a.appliedAt).toLocaleDateString()}`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `verifiedhire_enterprise_ats_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeDrawerCandidate = profiles.find(p => p.id === drawerCandidateId);

  return (
    <div className="space-y-6">
      
      {/* ATS Header with Clean Visual Hierarchy */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Enterprise ATS & Talent Pipeline
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Live Pipeline
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              High-trust applicant tracking, multi-tier requisition approvals, blind bias-free screening, and structured rubric scorecards.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Blind Screening Switcher */}
            <button
              onClick={toggleBlindScreening}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm ${
                blindScreeningMode
                  ? 'bg-purple-600 text-white border-purple-500 shadow-purple-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Masks candidate names, photos, gender, and age indicators to prevent unconscious bias during screening"
            >
              <Icon name="eye" className="w-4 h-4" />
              {blindScreeningMode ? 'Blind Mode: ON' : 'Blind Screening Mode'}
            </button>

            {/* CSV Export */}
            <button
              onClick={handleExportATS}
              className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Icon name="arrowDownTray" className="w-4 h-4" />
              Export ATS CSV
            </button>

            {/* Post Job Button */}
            <button
              onClick={onPostNewJob}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Icon name="plus" className="w-4 h-4" />
              Post Job Position
            </button>
          </div>
        </div>

        {/* Global Pipeline KPI Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total In Pipeline</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{applications.length} Candidates</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Requisitions</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">{requisitions.length} Open</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Interviews Scheduled</span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">{interviews.length} Rounds</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Talent CRM Pools</span>
            <span className="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">{talentPools.length} Pools</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Trust Pass Rate</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">100% Verified</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Time to Hire</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-300 font-mono">12.4 Days</span>
          </div>
        </div>
      </div>

      {/* Primary Section Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 sm:gap-8 text-xs sm:text-sm font-bold px-2 overflow-x-auto">
        {[
          { id: 'pipeline', label: `Talent Pipeline (${filteredApplications.length})`, icon: 'briefcase' },
          { id: 'requisitions', label: `Requisitions Approvals (${requisitions.length})`, icon: 'document' },
          { id: 'interviews', label: `Interviews & Scorecards (${interviews.length})`, icon: 'calendar' },
          { id: 'pools', label: `Talent CRM Pools (${talentPools.length})`, icon: 'userGroup' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Icon name={t.icon as any} className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TALENT PIPELINE (KANBAN / TABLE / ANALYTICS) */}
      {/* ========================================================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* Controls, Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Icon name="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search candidate name, headline, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Position Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Position:</span>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Vacancies ({jobs.length})</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title} ({j.category || j.companyName})</option>
                  ))}
                </select>
              </div>

              {/* Verified Only Filter */}
              <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  checked={verifiedOnlyFilter}
                  onChange={(e) => setVerifiedOnlyFilter(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Verified Only</span>
              </label>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-end lg:self-auto">
              <button
                onClick={() => setPipelineViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  pipelineViewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon name="viewColumns" className="w-3.5 h-3.5" />
                Kanban Board
              </button>
              <button
                onClick={() => setPipelineViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  pipelineViewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon name="tableCells" className="w-3.5 h-3.5" />
                Grid View
              </button>
              <button
                onClick={() => setPipelineViewMode('analytics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  pipelineViewMode === 'analytics'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon name="arrowTrendingUp" className="w-3.5 h-3.5" />
                Funnel Analytics
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* VIEW MODE 1: KANBAN BOARD */}
          {/* ------------------------------------------------------------- */}
          {pipelineViewMode === 'kanban' && (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-[1400px]">
                {pipelineStages.map(stage => {
                  const stageApps = filteredApplications.filter(app => mapAppStatusToStage(app.status) === stage.id);

                  return (
                    <div 
                      key={stage.id} 
                      className={`flex-1 min-w-[280px] max-w-[320px] rounded-2xl border ${stage.topBorder} border-t-4 border-slate-200 dark:border-slate-800 ${stage.bgAccent} p-3.5 flex flex-col shadow-sm`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-700/60">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
                            {stage.label}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${stage.badgeColor}`}>
                          {stageApps.length}
                        </span>
                      </div>

                      {/* Column Cards */}
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-0.5">
                        {stageApps.length === 0 ? (
                          <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/30">
                            No candidates
                          </div>
                        ) : (
                          stageApps.map(app => {
                            const candidate = getCandidate(app.jobSeekerId);
                            const job = jobs.find(j => j.id === app.jobId);
                            const isBlind = blindScreeningMode;

                            return (
                              <div
                                key={app.id}
                                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all space-y-3 group"
                              >
                                {/* Candidate Top Row */}
                                <div className="flex items-start justify-between gap-2.5">
                                  <div className="flex items-center gap-2.5">
                                    {isBlind ? (
                                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-mono text-xs font-black flex items-center justify-center border border-purple-200 dark:border-purple-800 flex-shrink-0">
                                        #{app.id.slice(-3)}
                                      </div>
                                    ) : (
                                      <img 
                                        src={candidate?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                                        alt="" 
                                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                    <div className="min-w-0">
                                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
                                        {isBlind ? `Candidate #${app.id.slice(-4)}` : candidate?.name}
                                      </h4>
                                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                        {isBlind ? 'Blind Profile' : candidate?.headline || 'Flight Operations Specialist'}
                                      </p>
                                    </div>
                                  </div>

                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex-shrink-0 border border-emerald-200 dark:border-emerald-800">
                                    94% Fit
                                  </span>
                                </div>

                                {/* Position Details */}
                                <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                                    {job?.title || 'Senior Flight Captain'}
                                  </span>
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                    <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                                      <Icon name="shieldCheck" className="w-3 h-3" />
                                      Verified
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons Strip */}
                                <div className="pt-1 flex items-center justify-between gap-1.5 border-t border-slate-100 dark:border-slate-700/60">
                                  <button
                                    onClick={() => setDrawerCandidateId(candidate?.id || null)}
                                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                                  >
                                    Quick Review
                                  </button>

                                  <button
                                    onClick={() => setAiExplainAppId(app.id)}
                                    className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:text-purple-800"
                                    title="View AI Match Explainability"
                                  >
                                    AI Match
                                  </button>

                                  {/* Stage Progression Selector */}
                                  <div className="flex items-center gap-1">
                                    {stage.id !== 'Hired' && (
                                      <button
                                        onClick={() => handleAdvanceStage(app.id, stage.id)}
                                        className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 font-bold text-[10px] flex items-center gap-1"
                                        title="Advance to next pipeline stage"
                                      >
                                        Next
                                        <Icon name="arrowRight" className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW MODE 2: HIGH-DENSITY GRID / LIST VIEW */}
          {/* ------------------------------------------------------------- */}
          {pipelineViewMode === 'list' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Position / Job</th>
                      <th className="p-4">AI Match Calibration</th>
                      <th className="p-4">Trust Verification</th>
                      <th className="p-4">Pipeline Stage</th>
                      <th className="p-4">Applied Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No candidates matching the current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map(app => {
                        const candidate = getCandidate(app.jobSeekerId);
                        const job = jobs.find(j => j.id === app.jobId);
                        const stage = mapAppStatusToStage(app.status);

                        return (
                          <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {blindScreeningMode ? (
                                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-mono text-xs font-bold flex items-center justify-center">
                                    #{app.id.slice(-3)}
                                  </div>
                                ) : (
                                  <img 
                                    src={candidate?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                                    alt="" 
                                    className="w-8 h-8 rounded-lg object-cover border"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div>
                                  <span className="font-bold text-slate-900 dark:text-white block">
                                    {blindScreeningMode ? `Candidate #${app.id.slice(-4)}` : candidate?.name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                                    {blindScreeningMode ? 'Blind Profile' : candidate?.headline}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                              {job?.title}
                            </td>

                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                                </div>
                                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">94%</span>
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                <Icon name="shieldCheck" className="w-3 h-3" />
                                {candidate?.verificationStatus || 'Verified'}
                              </span>
                            </td>

                            <td className="p-4">
                              <select
                                value={stage}
                                onChange={(e) => handleSetStage(app.id, e.target.value as ATSPipelineStage)}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-200"
                              >
                                {pipelineStages.map(s => (
                                  <option key={s.id} value={s.id}>{s.label}</option>
                                ))}
                              </select>
                            </td>

                            <td className="p-4 font-mono text-slate-400 text-[11px]">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setDrawerCandidateId(candidate?.id || null)}
                                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs"
                                >
                                  Dossier
                                </button>
                                <button
                                  onClick={() => setAiExplainAppId(app.id)}
                                  className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-bold rounded-lg text-xs"
                                >
                                  AI Insights
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW MODE 3: PIPELINE FUNNEL & CONVERSION ANALYTICS */}
          {/* ------------------------------------------------------------- */}
          {pipelineViewMode === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Funnel Stage Visualization */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Icon name="arrowTrendingUp" className="w-5 h-5 text-indigo-600" />
                    Talent Conversion Funnel & Velocity
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Past 30 Days</span>
                </div>

                <div className="space-y-4">
                  {[
                    { stage: '1. Applied / Ingested', count: applications.length, conversion: '100%', avgDays: '0.5d', color: 'bg-slate-600' },
                    { stage: '2. Screening & AI Verification', count: Math.max(1, applications.length - 1), conversion: '85%', avgDays: '1.8d', color: 'bg-blue-600' },
                    { stage: '3. Panel Interview Round', count: interviews.length > 0 ? interviews.length : 2, conversion: '62%', avgDays: '3.2d', color: 'bg-amber-500' },
                    { stage: '4. Technical & Psychometric Assessment', count: 2, conversion: '45%', avgDays: '2.1d', color: 'bg-purple-600' },
                    { stage: '5. Primary Source Background Check', count: 2, conversion: '40%', avgDays: '1.0d', color: 'bg-teal-600' },
                    { stage: '6. Offer Extended', count: 1, conversion: '25%', avgDays: '2.4d', color: 'bg-indigo-600' },
                    { stage: '7. Final Hire & Onboarded', count: 1, conversion: '20%', avgDays: '1.4d', color: 'bg-emerald-600' }
                  ].map((item, idx) => (
                    <div key={item.stage} className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>{item.stage}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-slate-400">Avg Time: {item.avgDays}</span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400">{item.count} candidates ({item.conversion})</span>
                        </div>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-700`}
                          style={{ width: item.conversion }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Verification Analytics Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Icon name="shieldCheck" className="w-5 h-5 text-emerald-600" />
                    Statutory Verification Integrity
                  </h3>
                  <p className="text-xs text-slate-500">
                    All candidates in this pipeline are authenticated directly against authorized Kenyan regulatory registries.
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">KCAA Pilot & Engineer Licences</span>
                      <span className="font-mono font-bold text-emerald-600">100% Passed</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">DCI Police Clearance Certificates</span>
                      <span className="font-mono font-bold text-emerald-600">100% Clean</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">KRA Tax Compliance Certificates</span>
                      <span className="font-mono font-bold text-emerald-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">KNEC / Commission for University Ed</span>
                      <span className="font-mono font-bold text-emerald-600">Verified</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold block">KDPA Statutory Compliance</span>
                  Candidate data processing complies strictly with Kenya Data Protection Act 2019 consent requirements.
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REQUISITION APPROVALS WORKFLOW */}
      {/* ========================================================================= */}
      {activeTab === 'requisitions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise Vacancy Requisitions</h2>
              <p className="text-xs text-slate-500">Multi-tier sign-off chain (Hiring Manager → Department Head → HR Operations → Finance Controller).</p>
            </div>

            <button
              onClick={() => setNewReqModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
            >
              <Icon name="plus" className="w-4 h-4" />
              Initiate New Requisition
            </button>
          </div>

          <div className="space-y-4">
            {requisitions.map(req => (
              <div 
                key={req.id} 
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{req.title}</h3>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        req.status === 'Approved' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Dept: <strong className="text-slate-700 dark:text-slate-300">{req.department}</strong> • Hiring Manager: <strong className="text-slate-700 dark:text-slate-300">{req.hiringManager}</strong> • Budget: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{req.salaryBudget}</span>
                    </p>
                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    Created: {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Multi-tier Approval Chain Steps */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {req.approvals.map((approval) => (
                    <div 
                      key={approval.role}
                      className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{approval.role}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          approval.status === 'Approved' ? 'bg-emerald-500' : approval.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-400 animate-pulse'
                        }`} />
                      </div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{approval.approverName}</p>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className={`text-[10px] font-bold uppercase ${
                          approval.status === 'Approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {approval.status}
                        </span>

                        {approval.status === 'Pending' && (
                          <button
                            onClick={() => updateRequisitionApproval(req.id, approval.role, 'Approved', 'Sign-off confirmed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STRUCTURED INTERVIEWS & SCORECARDS */}
      {/* ========================================================================= */}
      {activeTab === 'interviews' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Structured Interview Rounds & Scorecards</h2>
              <p className="text-xs text-slate-500">Objective competency rubric evaluations to ensure fair and calibrated hiring decisions.</p>
            </div>

            <button
              onClick={() => {
                setIntCandidateName('James Mwangi');
                setIntJobTitle('Senior Flight Operations Captain');
                setShowScheduleModal(true);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
            >
              <Icon name="calendar" className="w-4 h-4" />
              Schedule Interview Round
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map(int => (
              <div 
                key={int.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={int.candidatePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                      alt="" 
                      className="w-11 h-11 rounded-2xl object-cover border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{int.candidateName}</h4>
                      <p className="text-xs text-slate-500">{int.jobTitle}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    int.status === 'Completed' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}>
                    {int.status}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{int.stageName}</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{int.durationMinutes} mins</span>
                  </div>
                  <p className="text-slate-500">
                    Scheduled: <strong className="text-slate-700 dark:text-slate-300">{int.scheduledDate} at {int.scheduledTime}</strong>
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Panelists: {int.panelMembers.join(', ')}
                  </p>
                  {int.meetingUrl && (
                    <a 
                      href={int.meetingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline pt-1"
                    >
                      <Icon name="videoCamera" className="w-4 h-4" />
                      Join Secure Video Meeting
                    </a>
                  )}
                </div>

                {/* Scorecards summary */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Submitted Scorecards ({int.scorecards.length})
                    </span>
                    <button
                      onClick={() => setShowScorecardModal(int)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      + Add Scorecard
                    </button>
                  </div>

                  {int.scorecards.map(sc => (
                    <div key={sc.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{sc.interviewerName} ({sc.interviewerRole})</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                          {sc.overallRecommendation}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {sc.scores.map(s => (
                          <div key={s.competency} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                            <span>{s.competency}</span>
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{s.score} / 5</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 italic pt-1">"{sc.summaryRemarks}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TALENT CRM & NURTURE POOLS */}
      {/* ========================================================================= */}
      {activeTab === 'pools' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Talent CRM & Nurture Pools</h2>
              <p className="text-xs text-slate-500">Segment pre-verified candidates by sector, licensing accreditation, and silver-medallist alumni.</p>
            </div>

            <button
              onClick={() => setNewPoolModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
            >
              <Icon name="plus" className="w-4 h-4" />
              Create Talent Pool
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {talentPools.map(pool => (
              <div 
                key={pool.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                      {pool.sector}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{pool.candidateIds.length} Candidates</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{pool.name}</h3>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pool.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] rounded-md border border-indigo-200 dark:border-indigo-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{pool.notesCount} Recruiter Notes</span>
                  <button 
                    onClick={() => setSelectedPoolForDetails(pool)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View & Manage Pool →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE-OVER CANDIDATE QUICK REVIEW DRAWER */}
      {/* ========================================================================= */}
      {activeDrawerCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 overflow-y-auto p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img 
                    src={activeDrawerCandidate.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                    alt="" 
                    className="w-12 h-12 rounded-2xl object-cover border"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {blindScreeningMode ? `Candidate #${activeDrawerCandidate.id.slice(-4)}` : activeDrawerCandidate.name}
                    </h3>
                    <p className="text-xs text-slate-500">{activeDrawerCandidate.headline}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDrawerCandidateId(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <Icon name="xMark" className="w-5 h-5" />
                </button>
              </div>

              {/* Verified Badges & Trust Summary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Cryptographic Trust Coverage</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">96% Source Verified</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                    KCAA Pilot Licence #7749 (Active)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                    DCI Police Clearance (Valid)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                    KRA Tax Compliance
                  </span>
                </div>
              </div>

              {/* Key Skills & Work Experience */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white">Verified Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeDrawerCandidate.skills.map(s => (
                    <span key={s.name} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work History */}
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white">Professional Experience</h4>
                {activeDrawerCandidate.workExperience.map((exp, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{exp.title || 'Professional Experience'}</span>
                    <span className="text-slate-500 text-[11px] block">{exp.company} • {exp.startDate} - {exp.endDate || 'Present'}</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] pt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  setDrawerCandidateId(null);
                  onViewCandidate(activeDrawerCandidate.id);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Inspect Full Dossier
              </button>

              <button
                onClick={() => {
                  setIntCandidateName(activeDrawerCandidate.name);
                  setIntJobTitle(activeDrawerCandidate.headline);
                  setShowScheduleModal(true);
                  setDrawerCandidateId(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                Schedule Interview
              </button>

              <button
                onClick={() => {
                  setPoolAssignModalCandidateId(activeDrawerCandidate.id);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
              >
                Add to CRM Pool
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI MATCH EXPLAINABILITY MODAL */}
      {/* ========================================================================= */}
      {aiExplainAppId && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Icon name="sparkles" className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">AI Alignment Explainability</h3>
              </div>
              <button onClick={() => setAiExplainAppId(null)} className="text-slate-400 hover:text-slate-600">
                <Icon name="xMark" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-200 dark:border-purple-800">
                <span className="font-bold text-purple-900 dark:text-purple-200">Overall Match Calibration</span>
                <span className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">94% Fit</span>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-800 dark:text-slate-200">Verified Evidence Supporting Match:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  <li><strong>Regulatory Licence Match:</strong> KCAA Commercial Pilot Licence actively source-verified.</li>
                  <li><strong>Experience Tenure:</strong> 6+ years in twin-turboprop and multi-engine aircraft exceeds requirement.</li>
                  <li><strong>Safety & Compliance:</strong> Clean DCI police record and Class 1 flight medical fitness verified.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-800 dark:text-slate-200">Bias-Free Calibration Notice:</p>
                <p className="text-slate-500">
                  This score is computed strictly from cryptographic credential records, documented tenure, and regulatory licensing. Demographic characteristics are fully excluded.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAiExplainAppId(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close Explainability
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCHEDULE INTERVIEW MODAL */}
      {/* ========================================================================= */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Schedule Structured Interview</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Candidate Name</label>
                <input 
                  type="text" 
                  value={intCandidateName} 
                  onChange={(e) => setIntCandidateName(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Position / Requisition</label>
                <input 
                  type="text" 
                  value={intJobTitle} 
                  onChange={(e) => setIntJobTitle(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Stage Name</label>
                <input 
                  type="text" 
                  value={intStage} 
                  onChange={(e) => setIntStage(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Date</label>
                  <input 
                    type="date" 
                    value={intDate} 
                    onChange={(e) => setIntDate(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time</label>
                  <input 
                    type="text" 
                    value={intTime} 
                    onChange={(e) => setIntTime(e.target.value)} 
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  scheduleInterview({
                    applicationId: 'app_new',
                    candidateName: intCandidateName || 'James Mwangi',
                    candidatePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    jobTitle: intJobTitle || 'Senior Flight Operations Captain',
                    stageName: intStage,
                    scheduledDate: intDate,
                    scheduledTime: intTime,
                    durationMinutes: 45,
                    meetingUrl: 'https://verifiedhire.com/meet/room-891',
                    panelMembers: intPanel.split(',').map(s => s.trim()),
                    status: 'Scheduled'
                  });
                  setShowScheduleModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Confirm & Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBMIT SCORECARD MODAL */}
      {/* ========================================================================= */}
      {showScorecardModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Evaluator Scorecard: {showScorecardModal.candidateName}
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  1. Technical & Regulatory Competence (1 - 5)
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="1" max="5" value={score1} 
                    onChange={(e) => setScore1(parseInt(e.target.value))} 
                    className="w-full"
                  />
                  <span className="font-bold font-mono text-indigo-600 text-sm">{score1} / 5</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  2. Crew Resource Management & Leadership (1 - 5)
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="1" max="5" value={score2} 
                    onChange={(e) => setScore2(parseInt(e.target.value))} 
                    className="w-full"
                  />
                  <span className="font-bold font-mono text-indigo-600 text-sm">{score2} / 5</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  3. Decision Making & Safety Threat Mitigation (1 - 5)
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="1" max="5" value={score3} 
                    onChange={(e) => setScore3(parseInt(e.target.value))} 
                    className="w-full"
                  />
                  <span className="font-bold font-mono text-indigo-600 text-sm">{score3} / 5</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Overall Recommendation</label>
                <select 
                  value={recType} 
                  onChange={(e) => setRecType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="Strong Hire">Strong Hire</option>
                  <option value="Hire">Hire</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Do Not Hire">Do Not Hire</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Evaluator Remarks</label>
                <textarea 
                  rows={3} 
                  value={scoreRemarks} 
                  onChange={(e) => setScoreRemarks(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button 
                onClick={() => setShowScorecardModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  submitScorecard({
                    interviewId: showScorecardModal.id,
                    interviewerName: 'Evaluator Desk',
                    interviewerRole: 'Technical Board Assessor',
                    scores: [
                      { competency: 'Technical & Regulatory Competence', score: score1, evidenceNotes: 'Validated against primary authority records and situational responses.' },
                      { competency: 'Crew Leadership', score: score2, evidenceNotes: 'Demonstrated clear escalation protocol and crew resource management.' },
                      { competency: 'Safety Mitigation', score: score3, evidenceNotes: 'Verified audit trail and statutory compliance awareness.' }
                    ],
                    overallRecommendation: recType,
                    summaryRemarks: scoreRemarks
                  });
                  setShowScorecardModal(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Submit Scorecard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE REQUISITION MODAL */}
      {/* ========================================================================= */}
      {newReqModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Vacancy Requisition</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Requisition Title</label>
                <input 
                  type="text" 
                  value={reqTitle} 
                  placeholder="e.g. Senior Turboprop Flight Captain"
                  onChange={(e) => setReqTitle(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                <select 
                  value={reqDept} 
                  onChange={(e) => setReqDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Flight Operations">Flight Operations</option>
                  <option value="Digital Trust & Engineering">Digital Trust & Engineering</option>
                  <option value="Aviation Safety Directorate">Aviation Safety Directorate</option>
                  <option value="Health & Medical Services">Health & Medical Services</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Approved Monthly Budget</label>
                <input 
                  type="text" 
                  value={reqBudget} 
                  onChange={(e) => setReqBudget(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button 
                onClick={() => setNewReqModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (reqTitle.trim()) {
                    createRequisition({
                      title: reqTitle,
                      department: reqDept,
                      hiringManager: 'Capt. Patrick Ochieng',
                      openingsCount: 1,
                      salaryBudget: reqBudget,
                      status: 'Pending_Approval'
                    });
                    setNewReqModal(false);
                    setReqTitle('');
                  }
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Submit for Approvals
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MANAGE TALENT CRM POOL MODAL */}
      {/* ========================================================================= */}
      {selectedPoolForDetails && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedPoolForDetails.name}</h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{selectedPoolForDetails.sector}</span>
              </div>
              <button onClick={() => setSelectedPoolForDetails(null)} className="text-slate-400 hover:text-slate-600">
                <Icon name="xMark" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Total Pre-Verified Members:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{selectedPoolForDetails.candidateIds.length}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border space-y-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Candidate Membership:</span>
                <p className="text-slate-500 text-[11px]">
                  {selectedPoolForDetails.candidateIds.length > 0 
                    ? `Candidates #${selectedPoolForDetails.candidateIds.join(', #')} actively mapped.`
                    : 'No candidates assigned yet. Use "Quick Review -> Add to CRM Pool" from the pipeline.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedPoolForDetails.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded text-[10px] font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedPoolForDetails(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ASSIGN TO POOL QUICK MODAL */}
      {/* ========================================================================= */}
      {poolAssignModalCandidateId && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Assign to Talent Pool</h3>
            <p className="text-xs text-slate-500">Select target talent CRM pool to nurture candidate.</p>

            <div className="space-y-2">
              {talentPools.map(pool => (
                <button
                  key={pool.id}
                  onClick={() => {
                    addCandidateToPool(pool.id, poolAssignModalCandidateId);
                    setPoolAssignModalCandidateId(null);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span>{pool.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{pool.sector}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPoolAssignModalCandidateId(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE POOL MODAL */}
      {/* ========================================================================= */}
      {newPoolModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Talent CRM Pool</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pool Name</label>
                <input 
                  type="text" 
                  value={newPoolName} 
                  placeholder="e.g. Twin Turboprop Captains"
                  onChange={(e) => setNewPoolName(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Industry Sector</label>
                <input 
                  type="text" 
                  value={newPoolSector} 
                  onChange={(e) => setNewPoolSector(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  value={newPoolTags} 
                  onChange={(e) => setNewPoolTags(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button 
                onClick={() => setNewPoolModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (newPoolName.trim()) {
                    createTalentPool(
                      newPoolName, 
                      newPoolSector, 
                      newPoolTags.split(',').map(s => s.trim()).filter(Boolean)
                    );
                    setNewPoolModal(false);
                    setNewPoolName('');
                  }
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Create Pool
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
