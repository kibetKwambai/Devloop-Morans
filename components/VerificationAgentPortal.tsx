import React, { useState, useMemo } from 'react';
import { VerificationCase, VerificationStatus, JobSeekerProfile } from '../types';
import { useAppContext } from './AppContext';
import { Icon, IconName } from './Icon';

export const VerificationAgentPortal: React.FC = () => {
  const { 
    agentCases, 
    profiles,
    credentials,
    declareCaseConflict, 
    updateCaseChecklist, 
    submitCaseQA,
    updateProfileStatus,
    addNotification
  } = useAppContext();

  // Active view tab: either Employee/Candidate Verification Queue or Forensic Case Workstation
  const [activeTab, setActiveTab] = useState<'candidates' | 'cases'>('candidates');

  // Candidate inspection state
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [candidateFilter, setCandidateFilter] = useState<'all' | 'pending' | 'draft' | 'verified' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Forensic case workstation state
  const [activeCaseId, setActiveCaseId] = useState<string>(agentCases[0]?.id || '');
  const [swornConflictConsent, setSwornConflictConsent] = useState(false);

  // Filter candidates/employees
  const filteredCandidates = useMemo(() => {
    return profiles.filter(p => {
      // Status filter
      if (candidateFilter === 'pending' && p.verificationStatus !== VerificationStatus.PENDING) return false;
      if (candidateFilter === 'draft' && p.verificationStatus !== VerificationStatus.DRAFT) return false;
      if (candidateFilter === 'verified' && p.verificationStatus !== VerificationStatus.VERIFIED && p.verificationStatus !== VerificationStatus.SOURCE_VERIFIED) return false;
      if (candidateFilter === 'rejected' && p.verificationStatus !== VerificationStatus.REJECTED) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesEmail = p.email.toLowerCase().includes(query);
        const matchesHeadline = p.headline.toLowerCase().includes(query);
        const matchesCompany = p.workExperience.some(w => w.company.toLowerCase().includes(query));
        return matchesName || matchesEmail || matchesHeadline || matchesCompany;
      }
      return true;
    });
  }, [profiles, candidateFilter, searchQuery]);

  // Currently inspected candidate
  const inspectingCandidate = useMemo(() => {
    if (selectedCandidateId) {
      return profiles.find(p => p.id === selectedCandidateId) || null;
    }
    return filteredCandidates[0] || profiles[0] || null;
  }, [selectedCandidateId, profiles, filteredCandidates]);

  // Currently active statutory case
  const currentCase = agentCases.find(c => c.id === activeCaseId) || agentCases[0];

  // Action handlers for verifying candidates/employees
  const handleApproveCandidate = (candidate: JobSeekerProfile) => {
    updateProfileStatus(candidate.id, VerificationStatus.VERIFIED);
    addNotification(
      candidate.id,
      'Credential Dossier Verified',
      `Accredited Agent Wachira (#AG-041) has verified and sealed your professional credentials.`,
      'StatusChange'
    );
    setActionFeedback(`Successfully approved & cryptographically sealed credentials for ${candidate.name}.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleRejectCandidate = (candidate: JobSeekerProfile) => {
    const reason = 'Primary source check: Institutional registrar record requires updated graduation certificate.';
    updateProfileStatus(candidate.id, VerificationStatus.REJECTED, reason);
    addNotification(
      candidate.id,
      'Verification Document Required',
      `Audit note from Agent Wachira: ${reason}`,
      'StatusChange'
    );
    setActionFeedback(`Flagged discrepancy for ${candidate.name}. Notification dispatched.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleRequestMoreInfo = (candidate: JobSeekerProfile) => {
    addNotification(
      candidate.id,
      'Additional Evidence Requested',
      `Agent Wachira requests physical logbook or official transcript certified copy for credential verification.`,
      'StatusChange'
    );
    setActionFeedback(`Dispatched evidence request notification to ${candidate.name}.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Counts for summary
  const pendingCount = useMemo(() => profiles.filter(p => p.verificationStatus === VerificationStatus.PENDING).length, [profiles]);
  const verifiedCount = useMemo(() => profiles.filter(p => p.verificationStatus === VerificationStatus.VERIFIED || p.verificationStatus === VerificationStatus.SOURCE_VERIFIED).length, [profiles]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight">Accredited Agent Operating Portal</h1>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Agent ID: #AG-041 (KCAA &amp; EBK Certified)</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Audit candidate and employee credential claims, verify statutory registries, conduct in-person folio inspections, and issue forensic chain-of-custody attestations.
          </p>
        </div>

        {/* Payouts & Metrics summary */}
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-right min-w-[130px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Audits</span>
            <p className="text-2xl font-black text-amber-400 font-mono">{pendingCount}</p>
            <span className="text-[10px] text-slate-400">Employees in queue</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-right min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Earnings</span>
            <p className="text-2xl font-black text-emerald-400 font-mono">KES 14,850</p>
            <span className="text-[10px] text-teal-300">18 Audits Completed</span>
          </div>
        </div>
      </div>

      {/* Global Action Feedback Alert */}
      {actionFeedback && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <Icon name="checkCircle" className="h-5 w-5 text-emerald-600" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-600 hover:text-emerald-800">
            <Icon name="xMark" className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'candidates'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon name="userGroup" className="h-4 w-4" />
            <span>Employees &amp; Candidates Queue ({profiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cases'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon name="shieldCheck" className="h-4 w-4" />
            <span>Statutory Cases &amp; SLA Monitor ({agentCases.length})</span>
          </button>
        </div>

        {/* Search bar when on candidate queue */}
        {activeTab === 'candidates' && (
          <div className="relative min-w-[240px]">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {/* TAB 1: EMPLOYEES & CANDIDATES VERIFICATION QUEUE */}
      {activeTab === 'candidates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Filterable Candidate List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Status Filter Chips */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: `Pending (${pendingCount})` },
                { id: 'draft', label: 'Drafts' },
                { id: 'verified', label: `Verified (${verifiedCount})` },
                { id: 'rejected', label: 'Flagged' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setCandidateFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    candidateFilter === f.id
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Candidate Card List */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 max-h-[640px] overflow-y-auto">
              {filteredCandidates.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No candidate records matching this filter.
                </div>
              ) : (
                filteredCandidates.map(cand => {
                  const isSelected = inspectingCandidate?.id === cand.id;
                  const isPending = cand.verificationStatus === VerificationStatus.PENDING;
                  const isVerified = cand.verificationStatus === VerificationStatus.VERIFIED || cand.verificationStatus === VerificationStatus.SOURCE_VERIFIED;
                  const isRejected = cand.verificationStatus === VerificationStatus.REJECTED;

                  return (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidateId(cand.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                        isSelected
                          ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={cand.photoUrl}
                            alt={cand.name}
                            className="h-9 w-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-black text-slate-900 dark:text-white block truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              {cand.name}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                              {cand.headline}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
                          isVerified ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' :
                          isPending ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 animate-pulse' :
                          isRejected ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {cand.verificationStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/40 dark:border-slate-800">
                        <span>ID: {cand.id}</span>
                        <span>{cand.location}</span>
                        <span>{cand.workExperience.length} Experience Records</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right: Detailed Forensic Dossier Workstation (7 cols) */}
          <div className="lg:col-span-7">
            {inspectingCandidate ? (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                
                {/* Candidate Summary Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <img
                      src={inspectingCandidate.photoUrl}
                      alt={inspectingCandidate.name}
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-600/30 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">
                          {inspectingCandidate.name}
                        </h2>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                          inspectingCandidate.verificationStatus === VerificationStatus.VERIFIED || inspectingCandidate.verificationStatus === VerificationStatus.SOURCE_VERIFIED
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {inspectingCandidate.verificationStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{inspectingCandidate.headline}</p>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">{inspectingCandidate.email} • {inspectingCandidate.location}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-col items-end gap-2">
                    <button
                      onClick={() => handleApproveCandidate(inspectingCandidate)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="check" className="h-4 w-4" />
                      <span>Approve &amp; Verify</span>
                    </button>
                    <button
                      onClick={() => handleRejectCandidate(inspectingCandidate)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold transition-all border border-rose-200 dark:border-rose-800 cursor-pointer"
                    >
                      Flag Discrepancy
                    </button>
                  </div>
                </div>

                {/* Audit Evidence Sections */}
                <div className="space-y-6">
                  
                  {/* Work Experience Claims */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Work Experience History ({inspectingCandidate.workExperience.length})
                    </h3>
                    <div className="space-y-2">
                      {inspectingCandidate.workExperience.map((exp, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-start justify-between gap-3 text-xs">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{exp.title}</span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{exp.company} • {exp.location}</span>
                            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{exp.startDate} – {exp.endDate}</span>
                            {exp.description && (
                              <p className="text-[11px] text-slate-500 mt-1">{exp.description}</p>
                            )}
                          </div>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                            Verified Claim
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education & Academic Degrees */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Academic Degrees &amp; Credentials
                    </h3>
                    <div className="space-y-2">
                      {inspectingCandidate.education.map((edu, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-start justify-between gap-3 text-xs">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{edu.degree}</span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{edu.institution} • {edu.fieldOfStudy}</span>
                            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{edu.startDate} – {edu.endDate}</span>
                          </div>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex-shrink-0">
                            CUE Accredited
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regulatory & Identity Clearance Checklist */}
                  <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                      <Icon name="shieldCheck" className="h-4 w-4 text-indigo-600" />
                      <span>Primary Source Registry Checks</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
                        <span>National ID / IPRS Registry:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Icon name="checkCircle" className="h-3.5 w-3.5" /> Matched
                        </span>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
                        <span>KRA Tax Compliance PIN:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Icon name="checkCircle" className="h-3.5 w-3.5" /> Validated
                        </span>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
                        <span>DCI Police Clearance:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Icon name="checkCircle" className="h-3.5 w-3.5" /> No Record
                        </span>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
                        <span>Board License (KCAA/EBK):</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Icon name="checkCircle" className="h-3.5 w-3.5" /> Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleRequestMoreInfo(inspectingCandidate)}
                      className="px-4 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-xl transition-all"
                    >
                      Request Additional Folio Evidence
                    </button>

                    <button
                      onClick={() => handleApproveCandidate(inspectingCandidate)}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Icon name="checkCircle" className="h-4 w-4" />
                      <span>Issue Agent Certification Seal</span>
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
                Select a candidate or employee from the left queue to inspect their dossier.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: STATUTORY CASES & SLA MONITOR */}
      {activeTab === 'cases' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Assigned Case Queue */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Verification Case Queue ({agentCases.length})
              </h2>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">Active SLA Monitor</span>
            </div>

            <div className="space-y-3">
              {agentCases.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveCaseId(c.id);
                    setSwornConflictConsent(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    activeCaseId === c.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{c.candidateName}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      c.priority === 'Urgent' 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {c.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">{c.credentialTitle}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>SLA: {c.slaDeadline}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">KES {c.payoutAmountKES.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center & Right Column: Active Case Forensic Workstation */}
          <div className="lg:col-span-2 space-y-6">
            {currentCase && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        CASE #{currentCase.id}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Jurisdiction: {currentCase.jurisdiction}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{currentCase.credentialTitle}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Candidate Subject: <strong className="text-slate-800 dark:text-slate-200">{currentCase.candidateName}</strong></p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-400 block">Payout Upon QA Pass</span>
                    <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">KES {currentCase.payoutAmountKES.toLocaleString()}</span>
                  </div>
                </div>

                {/* Section 25: Mandatory Conflict-of-Interest Declaration */}
                {!currentCase.conflictDeclared ? (
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-6 rounded-2xl border-2 border-amber-300 dark:border-amber-800 space-y-4">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
                      <Icon name="shieldCheck" className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <h4 className="text-sm font-bold">Mandatory Conflict-of-Interest Declaration (Section 25)</h4>
                    </div>
                    <p className="text-xs text-amber-950/80 dark:text-amber-200/80 leading-relaxed">
                      To maintain strict forensic integrity and regulatory compliance under KCAA/EBK verification rules, you must certify that you have no personal, familial, commercial, or prior supervisory relationship with <strong>{currentCase.candidateName}</strong>.
                    </p>

                    <label className="flex items-start gap-3 text-xs text-slate-800 dark:text-slate-200 cursor-pointer pt-1">
                      <input 
                        type="checkbox" 
                        checked={swornConflictConsent} 
                        onChange={(e) => setSwornConflictConsent(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 mt-0.5"
                      />
                      <span>
                        I hereby solemnly declare under penalty of accreditation revocation that I have <strong>zero conflict of interest</strong> with this candidate and will conduct an impartial evidence audit.
                      </span>
                    </label>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        disabled={!swornConflictConsent}
                        onClick={() => declareCaseConflict(currentCase.id, false)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          swornConflictConsent 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer' 
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Sign Impartiality Declaration &amp; Begin Audit
                      </button>

                      <button
                        onClick={() => declareCaseConflict(currentCase.id, true)}
                        className="px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer"
                      >
                        Declare Conflict &amp; Recuse Myself
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* Evidence Checklist */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>Forensic Audit Checklist</span>
                        <span className="text-xs font-normal text-slate-500">All checks required for QA seal</span>
                      </h4>

                      <div className="space-y-2">
                        {currentCase.evidenceChecklist.map((item, idx) => (
                          <div 
                            key={idx}
                            className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs"
                          >
                            <input 
                              type="checkbox"
                              checked={item.checked}
                              onChange={(e) => updateCaseChecklist(currentCase.id, idx, e.target.checked)}
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300 mt-0.5 cursor-pointer"
                            />
                            <div className="flex-1 space-y-1">
                              <span className={`font-semibold ${item.checked ? 'text-slate-900 dark:text-white line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`}>
                                {item.item}
                              </span>
                              {item.notes && (
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                                  Auditor Note: {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submission to QA */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">Tier-2 Quality Assurance Review</h5>
                        <p className="text-[11px] text-slate-500">Submission transmits findings to Dr. Stella Mutua (Senior QA Lead) for final cryptographic seal.</p>
                      </div>

                      <button
                        onClick={() => {
                          submitCaseQA(currentCase.id);
                          setActionFeedback(`Case #${currentCase.id} successfully submitted for Tier-2 QA Seal.`);
                        }}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                      >
                        <Icon name="check" className="w-4 h-4" />
                        <span>Approve &amp; Submit for QA Seal</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
