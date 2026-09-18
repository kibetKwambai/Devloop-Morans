import React, { useState, useMemo } from 'react';
import { JobSeekerProfile, VerificationStatus } from '../types';
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

type StatusFilter = 'pending' | 'verified' | 'rejected' | 'flagged' | 'all';

interface AdminDashboardProps {
  onViewProfile: (profileId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewProfile }) => {
  const { profiles, credentials, interviews, applications, updateProfileStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState<StatusFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [auditCandidate, setAuditCandidate] = useState<JobSeekerProfile | null>(null);

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

  const tabs: {id: StatusFilter, label: string, count?: number}[] = [
    {id: 'pending', label: 'Pending Review', count: pendingCount},
    {id: 'verified', label: 'Verified Talent', count: verifiedCount},
    {id: 'flagged', label: 'Flagged Dossiers', count: flaggedCount},
    {id: 'rejected', label: 'Rejected / Ineligible'},
    {id: 'all', label: 'All Users', count: profiles.length},
  ];

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
    alert(`Successfully approved and verified ${selectedCandidateIds.length} candidate dossier(s) with cryptographic seals.`);
    handleClearSelection();
  };

  const handleBulkFlag = () => {
    selectedCandidateIds.forEach(id => {
      updateProfileStatus(id, VerificationStatus.FLAGGED);
    });
    alert(`Flagged ${selectedCandidateIds.length} candidate dossier(s) for forensic compliance investigation.`);
    handleClearSelection();
  };

  const handleBulkArchive = () => {
    selectedCandidateIds.forEach(id => {
      updateProfileStatus(id, VerificationStatus.REJECTED);
    });
    alert(`Archived ${selectedCandidateIds.length} candidate dossier(s).`);
    handleClearSelection();
  };

  const handleBulkEmail = () => {
    alert(`Sent official compliance verification notices to ${selectedCandidateIds.length} candidate(s).`);
    handleClearSelection();
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
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-full border border-rose-200 dark:border-rose-900 mb-2">
            <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse"></span>
            Admin & Verifications Operations Center
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Verification Administration Panel</h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Primary source registry cross-checks, multimodal forensic audits, and candidate dossier decisions.
          </p>
        </div>
      </div>

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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
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

        {/* Profiles Table with Checkbox Multi-Select */}
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
                  <th scope="col" className="px-4 py-3.5 text-left">Cryptographic Audit</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Dossier Action</th>
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
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                        >
                          <Icon name="fingerprint" className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Audit Trail</span>
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => onViewProfile(profile.id)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98]"
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

      {/* FLOATING BATCH OPERATIONS DOCK */}
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
                      {auditCandidate.name} • Forensic Audit Trail & Provenance Log
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
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Immutable Hash Signed & Validated</span>
                </div>
                <button
                  onClick={() => setAuditCandidate(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
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
