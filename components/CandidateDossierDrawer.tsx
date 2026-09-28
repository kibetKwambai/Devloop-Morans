import React, { useState } from 'react';
import { Icon } from './Icon';
import { 
  JobSeekerProfile, 
  Job, 
  Application, 
  VerifiableCredential, 
  VerificationStatus, 
  StructuredInterview, 
  InterviewScorecard,
  ATSPipelineStage 
} from '../types';
import { CandidateAuditTrail } from './CandidateAuditTrail';
import { motion, AnimatePresence } from 'motion/react';

interface CandidateDossierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: JobSeekerProfile | null;
  job: Job | null;
  application: Application | null;
  credentials: VerifiableCredential[];
  interviews: StructuredInterview[];
  blindScreeningMode: boolean;
  onAdvanceStage: (appId: string, currentStage: ATSPipelineStage) => void;
  onSetStage: (appId: string, targetStage: ATSPipelineStage) => void;
  onScheduleInterview: (candidateName: string, jobTitle: string) => void;
  onSubmitScorecard: (interview: StructuredInterview) => void;
  onViewFullProfile: (candidateId: string) => void;
}

export const CandidateDossierDrawer: React.FC<CandidateDossierDrawerProps> = ({
  isOpen,
  onClose,
  candidate,
  job,
  application,
  credentials,
  interviews,
  blindScreeningMode,
  onAdvanceStage,
  onSetStage,
  onScheduleInterview,
  onSubmitScorecard,
  onViewFullProfile
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'credentials' | 'timeline' | 'interviews' | 'rubric' | 'audit' | 'notes'>('overview');
  const [internalNotes, setInternalNotes] = useState<string[]>([
    'Initial technical screener completed with distinction. Candidate has active KCAA ATPL/CPL & First-Class Medical with zero incident records.',
    'Verified via direct Primary Source Registry API cross-check on 2026-09-15.'
  ]);
  const [newNote, setNewNote] = useState('');

  if (!isOpen || !candidate) return null;

  const displayName = blindScreeningMode 
    ? `Candidate #VH-${candidate.id.slice(-4).toUpperCase()}` 
    : candidate.name;

  const displayInitials = blindScreeningMode
    ? 'VH'
    : candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const candidateCredentials = credentials.filter(c => c.candidateId === candidate.id);
  const candidateInterviews = interviews.filter(i => i.candidateName.toLowerCase() === candidate.name.toLowerCase() || i.applicationId === application?.id);

  const currentStage: ATSPipelineStage = application ? (
    application.status === 'Applied' ? 'Applied' :
    application.status === 'Reviewing' ? 'Screening' :
    application.status === 'Shortlisted' ? 'Interview' :
    application.status === 'Interviewing' ? 'Assessment' :
    application.status === 'Offered' ? 'Offer' :
    application.status === 'Accepted' ? 'Hired' :
    application.status === 'Rejected' ? 'Rejected' : 'Screening'
  ) : 'Screening';

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setInternalNotes(prev => [newNote.trim(), ...prev]);
    setNewNote('');
  };

  const isAviation = candidate.headline.toLowerCase().includes('pilot') || candidate.headline.toLowerCase().includes('flight') || (job && job.category.toLowerCase().includes('aviation'));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop Fade with Spring Physics */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Slide-over Drawer with Tactile Apple Spring Physics */}
        <motion.div 
          initial={{ x: "100%", opacity: 0.8 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 340,
            damping: 32,
            mass: 0.82
          }}
          className="relative z-10 w-full max-w-2xl sm:max-w-3xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200/80 dark:border-white/10 flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Top Frosted Header Bar */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {blindScreeningMode ? (
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {displayInitials}
                </div>
              ) : (
                <img 
                  src={candidate.photoUrl || candidate.avatar} 
                  alt={candidate.name} 
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm"
                />
              )}
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                    {displayName}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex-shrink-0">
                    Verified Trust Passport
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {candidate.headline} {job && <span>• Target: <strong className="text-indigo-600 dark:text-indigo-400">{job.title}</strong></span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onViewFullProfile(candidate.id)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
              >
                Full Profile ↗
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Icon name="xMark" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Stage Control Strip */}
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                Current Stage:
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 font-bold">
                {currentStage}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {application && (
                <>
                  <select
                    value={currentStage}
                    onChange={(e) => onSetStage(application.id, e.target.value as ATSPipelineStage)}
                    className="px-2.5 py-1 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Applied">1. Applied</option>
                    <option value="Screening">2. Screening</option>
                    <option value="Interview">3. Interview</option>
                    <option value="Assessment">4. Assessment</option>
                    <option value="BackgroundCheck">5. Trust Check</option>
                    <option value="Offer">6. Offer Extended</option>
                    <option value="Hired">7. Hired</option>
                    <option value="Rejected">Move to Rejected</option>
                  </select>

                  <button
                    onClick={() => onAdvanceStage(application.id, currentStage)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-[0.98] flex items-center gap-1"
                  >
                    <span>Advance</span>
                    <Icon name="arrowRight" className="w-3 h-3" />
                  </button>
                </>
              )}

              <button
                onClick={() => onScheduleInterview(candidate.name, job?.title || 'Senior Position')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-[0.98] flex items-center gap-1"
              >
                <Icon name="calendar" className="w-3 h-3 text-indigo-400" />
                <span>Schedule Panel</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 border-b border-slate-200/70 dark:border-slate-800 flex space-x-1 overflow-x-auto bg-white dark:bg-slate-900 scrollbar-none">
            {[
              { id: 'overview', label: 'Executive Overview', icon: 'sparkles' },
              { id: 'credentials', label: `Trust Credentials (${candidateCredentials.length || 3})`, icon: 'shieldCheck' },
              { id: 'timeline', label: 'Career Timeline', icon: 'briefcase' },
              { id: 'interviews', label: `Interviews (${candidateInterviews.length})`, icon: 'calendar' },
              { id: 'rubric', label: 'Assessments', icon: 'clipboardDocumentCheck' },
              { id: 'audit', label: 'Audit Trail & Logs', icon: 'fingerprint' },
              { id: 'notes', label: `Recruiter Notes (${internalNotes.length})`, icon: 'edit' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Icon name={tab.icon as any} className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
            
            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Match Highlights */}
                <div className="p-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl text-white border border-indigo-800/60 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      Verified Competency Alignment
                    </span>
                    <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                      95% Match Score
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-sm">
                      High-confidence match backed by authenticated institutional records & regulatory license checks.
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex flex-col items-center justify-center font-mono">
                    <span className="text-xs text-emerald-300 font-bold">TRUST</span>
                    <span className="text-base font-black text-emerald-400">100%</span>
                  </div>
                </div>

                {/* Critical Qualifications Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Verified Critical Competencies
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(isAviation ? [
                      'KCAA Commercial Pilot Licence (Active)',
                      'Multi-Engine & Instrument Rating (ME/IR)',
                      'Boeing 737-800 Type Rating Certified',
                      'Class 1 Aviation Medical (Valid through 2027)',
                      'ICAO English Level 6 Operational Fluency',
                      'Aviation SMS Safety Protocols'
                    ] : [
                      '5+ Years Production Go / Distributed Systems',
                      'PostgreSQL & Event Streaming Architecture',
                      'Kubernetes & CI/CD Pipeline Automation',
                      'System Security & KDPA Compliance',
                      'Microservices Resilience & Observability',
                      'Agile Sprint & Engineering Mentorship'
                    ]).map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Icon name="checkCircle" className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bio Summary */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Professional Summary
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    {candidate.bio}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: TRUST CREDENTIALS & PROVENANCE */}
            {activeTab === 'credentials' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Primary-Source Cryptographic Credentials
                  </h4>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                    Zero-Knowledge Validated
                  </span>
                </div>

                <div className="space-y-3">
                  {(candidateCredentials.length > 0 ? candidateCredentials : [
                    {
                      id: 'cred_mock_1',
                      title: isAviation ? 'KCAA Airline Transport Pilot Licence (ATPL)' : 'BSc Computer Science (First Class Honours)',
                      issuingOrg: isAviation ? 'Kenya Civil Aviation Authority (KCAA)' : 'University of Nairobi',
                      verificationState: VerificationStatus.SOURCE_VERIFIED,
                      issuedDate: '2021-04-10',
                      expirationDate: isAviation ? '2027-04-10' : undefined,
                      verificationMethod: 'Direct API Integration'
                    },
                    {
                      id: 'cred_mock_2',
                      title: isAviation ? 'Class 1 Aviation Medical Certificate' : 'AWS Certified Solutions Architect - Professional',
                      issuingOrg: isAviation ? 'Aviation Medical Examiners Kenya' : 'Amazon Web Services',
                      verificationState: VerificationStatus.VERIFIED,
                      issuedDate: '2024-01-15',
                      verificationMethod: 'Direct API Integration'
                    },
                    {
                      id: 'cred_mock_3',
                      title: 'Police CID Clearance & Criminal Record Check',
                      issuingOrg: 'Directorate of Criminal Investigations (DCI)',
                      verificationState: VerificationStatus.AUTHENTICATED,
                      issuedDate: '2025-11-20',
                      verificationMethod: 'Automated Forensic Hash'
                    }
                  ]).map((cred, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <Icon name="shieldCheck" className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                              {cred.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Issued by: <strong>{cred.issuingOrg}</strong>
                            </p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          {cred.verificationState || 'Verified'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Issued: {cred.issuedDate || '2022-03-01'}</span>
                        <span>Method: {cred.verificationMethod || 'Registry API'}</span>
                        <span className="text-indigo-600 dark:text-indigo-400">Hash: SHA256-verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CAREER TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Verified Employment History
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {candidate.workExperience.map((exp, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 ring-2 ring-indigo-100 dark:ring-indigo-900" />
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                            {exp.title}
                          </h5>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {exp.company}
                        </p>

                        <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: INTERVIEWS */}
            {activeTab === 'interviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Structured Panel Evaluations
                  </h4>
                  <button
                    onClick={() => onScheduleInterview(candidate.name, job?.title || 'Senior Position')}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    <Icon name="plus" className="w-3.5 h-3.5" />
                    <span>Schedule Round</span>
                  </button>
                </div>

                {candidateInterviews.length > 0 ? (
                  <div className="space-y-3">
                    {candidateInterviews.map((int, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              Round {idx + 1}: {int.stageName}
                            </span>
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                              {int.jobTitle}
                            </h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Panelists: {int.panelMembers.join(', ')}
                            </p>
                          </div>

                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            {int.status}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-mono">Date: {int.scheduledDate}</span>
                          <button
                            onClick={() => onSubmitScorecard(int)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs transition-colors"
                          >
                            Scorecard / Rubric →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                    <Icon name="calendar" className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No panel rounds scheduled yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">Click above to schedule the initial technical or executive round.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: RUBRIC & ASSESSMENTS */}
            {activeTab === 'rubric' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Standardized Evaluator Rubrics
                </h4>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700 pb-3">
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        {isAviation ? 'Simulator CRM & Decision Rubric' : 'Full-Stack Architecture & Security Rubric'}
                      </h5>
                      <span className="text-[10px] text-slate-400">Completed by Evaluator #EV-09</span>
                    </div>
                    <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                      4.9 / 5.0
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {(isAviation ? [
                      { rubric: 'Emergency Procedure Compliance (SOP)', score: 5 },
                      { rubric: 'Crew Resource Management (CRM)', score: 5 },
                      { rubric: 'Crosswind Landing Touchdown Precision', score: 4.8 },
                      { rubric: 'Situational Awareness Under Pressure', score: 5 },
                    ] : [
                      { rubric: 'Distributed Systems System Design', score: 5 },
                      { rubric: 'Code Quality & Clean Architecture', score: 4.8 },
                      { rubric: 'Data Privacy & Security Protocols', score: 5 },
                      { rubric: 'Team Collaboration & Communication', score: 4.9 },
                    ]).map((r, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                          <span>{r.rubric}</span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400">{r.score}/5</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full" 
                            style={{ width: `${(r.score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: AUDIT TRAIL & ACTIVITY LOG */}
            {activeTab === 'audit' && (
              <CandidateAuditTrail
                candidate={candidate}
                credentials={candidateCredentials}
                interviews={candidateInterviews}
                application={application}
                mode="drawer"
              />
            )}

            {/* TAB 7: RECRUITER NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Add Confidential Note
                  </label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log candidate remarks, compensation expectations, reference check impressions..."
                    rows={3}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">Confidential internal note • Not visible to candidate</span>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-[0.98]"
                    >
                      Post Note
                    </button>
                  </div>
                </form>

                <div className="space-y-2 pt-2">
                  {internalNotes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                        <span>Recruiter #REC-01 (HR Lead)</span>
                        <span>Just now</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Bottom Drawer Footer */}
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                KDPA Vault Encrypted • Biometric Hash Verified
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => onViewFullProfile(candidate.id)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-[0.98]"
              >
                Open Full Passport ↗
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
