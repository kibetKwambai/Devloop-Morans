
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { 
  JobSeekerProfile, 
  VerificationStatus, 
  UserRole, 
  Job, 
  Application, 
  Notification, 
  Message,
  VerifiableCredential,
  VerificationCoverage,
  SensitiveVaultData,
  CandidatePrivacySettings,
  JobRequisition,
  StructuredInterview,
  InterviewScorecard,
  TalentPool,
  VerificationCase,
  CredentialIssuer,
  VerificationMarketplacePackage
} from '../types';
import { mockProfiles, mockJobs, mockApplications, mockNotifications } from '../services/mockData';
import { 
  mockVerifiableCredentials, 
  mockVerificationCoverage, 
  mockSensitiveVault, 
  mockPrivacySettings, 
  mockRequisitions, 
  mockStructuredInterviews, 
  mockTalentPools, 
  mockAgentCases, 
  mockCredentialIssuers,
  mockVerificationPackages
} from '../services/enterpriseTrustData';

export type Theme = 'light' | 'dark' | 'system';

interface AppContextType {
  profiles: JobSeekerProfile[];
  jobs: Job[];
  applications: Application[];
  notifications: Notification[];
  credentials: VerifiableCredential[];
  coverage: VerificationCoverage;
  coverageScore: VerificationCoverage;
  sensitiveVault: SensitiveVaultData;
  privacySettings: CandidatePrivacySettings;
  requisitions: JobRequisition[];
  interviews: StructuredInterview[];
  talentPools: TalentPool[];
  agentCases: VerificationCase[];
  credentialIssuers: CredentialIssuer[];
  marketplacePackages: VerificationMarketplacePackage[];
  blindScreeningMode: boolean;
  creditsBalance: number;
  getProfileById: (id: string) => JobSeekerProfile | undefined;
  updateProfileStatus: (id: string, status: VerificationStatus, reason?: string) => void;
  toggleShortlist: (id: string) => void;
  getLoggedInSeeker: () => JobSeekerProfile;
  addUser: (user: Omit<JobSeekerProfile, 'id'>) => void;
  updateProfile: (profile: JobSeekerProfile) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyToJob: (jobId: string, jobSeekerId: string, coverLetter?: string, interestedOnly?: boolean) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  addNotification: (userId: string, title: string, message: string, type: Notification['type'], link?: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  postJob: (job: Omit<Job, 'id' | 'postedAt'>) => void;
  deleteJob: (jobId: string) => void;
  respondToOffer: (applicationId: string, status: 'Accepted' | 'Rejected', feedback?: string) => void;
  sendMessage: (receiverId: string, content: string, jobId?: string) => void;
  
  // Enterprise Trust & Passport actions
  addCredential: (cred: Omit<VerifiableCredential, 'id' | 'lastVerifiedAt' | 'provenanceChain' | 'verificationUrl' | 'qrPayload'>) => void;
  updateCredentialStatus: (credId: string, status: VerificationStatus, notes?: string) => void;
  updateVaultConsent: (granted: boolean) => void;
  logVaultAccess: (requesterName: string, org: string, purpose: string, fields: string[]) => void;
  updatePrivacySetting: <K extends keyof CandidatePrivacySettings>(key: K, value: CandidatePrivacySettings[K]) => void;
  logProfileView: (viewerName: string, org: string, sections: string[], reason: string) => void;
  toggleBlindScreening: () => void;
  createRequisition: (req: Omit<JobRequisition, 'id' | 'createdAt' | 'approvals'>) => void;
  updateRequisitionApproval: (reqId: string, role: string, status: 'Approved' | 'Rejected', comment?: string) => void;
  scheduleInterview: (interview: Omit<StructuredInterview, 'id' | 'scorecards'>) => void;
  submitScorecard: (scorecard: Omit<InterviewScorecard, 'id' | 'submittedAt'>) => void;
  createTalentPool: (name: string, sector: string, tags: string[]) => void;
  addCandidateToPool: (poolId: string, candidateId: string) => void;
  declareCaseConflict: (caseId: string, hasConflict: boolean) => void;
  updateCaseChecklist: (caseId: string, itemIndex: number, checked: boolean, notes?: string) => void;
  submitCaseQA: (caseId: string) => void;
  issueVerifiableCredential: (cred: Omit<VerifiableCredential, 'id' | 'lastVerifiedAt' | 'provenanceChain' | 'verificationUrl' | 'qrPayload'>) => void;
  purchaseVerificationPackage: (pkgId: string, method: 'mpesa' | 'card', referenceId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<JobSeekerProfile[]>(mockProfiles);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // Enterprise Trust States with LocalStorage Persistence
  const [credentials, setCredentials] = useState<VerifiableCredential[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vh_credentials');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return mockVerifiableCredentials;
  });

  const [coverageScore, setCoverageScore] = useState<VerificationCoverage>(mockVerificationCoverage);

  const [sensitiveVault, setSensitiveVault] = useState<SensitiveVaultData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vh_sensitive_vault');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return mockSensitiveVault;
  });

  const [privacySettings, setPrivacySettings] = useState<CandidatePrivacySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vh_privacy_settings');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return mockPrivacySettings;
  });

  const [requisitions, setRequisitions] = useState<JobRequisition[]>(mockRequisitions);
  const [interviews, setInterviews] = useState<StructuredInterview[]>(mockStructuredInterviews);
  const [talentPools, setTalentPools] = useState<TalentPool[]>(mockTalentPools);
  const [agentCases, setAgentCases] = useState<VerificationCase[]>(mockAgentCases);
  const [credentialIssuers, setCredentialIssuers] = useState<CredentialIssuer[]>(mockCredentialIssuers);
  const [marketplacePackages] = useState<VerificationMarketplacePackage[]>(mockVerificationPackages);
  const [blindScreeningMode, setBlindScreeningMode] = useState<boolean>(false);
  const [creditsBalance, setCreditsBalance] = useState<number>(12);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vh_credentials', JSON.stringify(credentials));
    }
  }, [credentials]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vh_sensitive_vault', JSON.stringify(sensitiveVault));
    }
  }, [sensitiveVault]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vh_privacy_settings', JSON.stringify(privacySettings));
    }
  }, [privacySettings]);
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
        return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };
  
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    
    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && Boolean(mediaQuery?.matches));
      
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    if (mediaQuery && mediaQuery.addEventListener) {
      const handler = () => {
        if (theme === 'system') applyTheme();
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  const getProfileById = useCallback((id: string) => {
    return profiles.find(p => p.id === id);
  }, [profiles]);

  const updateProfileStatus = useCallback((id: string, status: VerificationStatus, reason?: string) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p => {
        if (p.id === id) {
          const updatedProfile = { ...p, verificationStatus: status };
          if (status === VerificationStatus.REJECTED) {
            updatedProfile.rejectionReason = reason;
          }
          if (status === VerificationStatus.PENDING || status === VerificationStatus.VERIFIED) {
             delete updatedProfile.rejectionReason;
          }
          return updatedProfile;
        }
        return p;
      })
    );
  }, []);

  const toggleShortlist = useCallback((id: string) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p =>
        p.id === id ? { ...p, isShortlisted: !p.isShortlisted } : p
      )
    );
  }, []);
  
  const addUser = useCallback((user: Omit<JobSeekerProfile, 'id'>) => {
    const newUser: JobSeekerProfile = {
      ...user,
      id: `usr_${String(Date.now()).slice(-6)}`,
    };
    setProfiles(prevProfiles => [newUser, ...prevProfiles]);
  }, []);

  const updateProfile = useCallback((updatedProfile: JobSeekerProfile) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p =>
        p.id === updatedProfile.id ? updatedProfile : p
      )
    );
  }, []);
  
  const applyToJob = useCallback((jobId: string, jobSeekerId: string, coverLetter?: string, interestedOnly?: boolean) => {
    const newApp: Application = {
        id: `app_${Date.now()}`,
        jobId,
        jobSeekerId,
        status: 'Applied',
        appliedAt: new Date().toISOString(),
        coverLetter,
        interestedOnly
    };
    setApplications(prev => [newApp, ...prev]);
    
    // Notify employer
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        addNotification(
            job.employerId,
            interestedOnly ? 'New Interest' : 'New Application',
            `A candidate is ${interestedOnly ? 'interested in' : 'applied for'} ${job.title}`,
            'Application',
            `/employer/jobs/${jobId}`
        );
    }
  }, [jobs]);

  const updateApplicationStatus = useCallback((applicationId: string, status: Application['status']) => {
    setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, status } : app));
    
    // Notify job seeker
    const app = applications.find(a => a.id === applicationId);
    if (app) {
        addNotification(
            app.jobSeekerId,
            'Application Status Updated',
            `Your application for a position has been moved to "${status}"`,
            'StatusChange'
        );
    }
  }, [applications]);

  const addNotification = useCallback((userId: string, title: string, message: string, type: Notification['type'], link?: string) => {
    const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId,
        title,
        message,
        type,
        isRead: false,
        createdAt: new Date().toISOString(),
        link
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  }, []);

  const postJob = useCallback((job: Omit<Job, 'id' | 'postedAt'>) => {
    const newJob: Job = {
        ...job,
        id: `job_${Date.now()}`,
        postedAt: new Date().toISOString()
    };
    setJobs(prev => [newJob, ...prev]);
  }, []);

  const deleteJob = useCallback((jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    // Also cleanup applications for this job
    setApplications(prev => prev.filter(a => a.jobId !== jobId));
  }, []);

  const respondToOffer = useCallback((applicationId: string, status: 'Accepted' | 'Rejected', feedback?: string) => {
    setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, status, coverLetter: feedback ? `${app.coverLetter}\n\nFeedback: ${feedback}` : app.coverLetter } : app));
    
    // Notify employer
    const app = applications.find(a => a.id === applicationId);
    if (app) {
        const job = jobs.find(j => j.id === app.jobId);
        if (job) {
            addNotification(
                job.employerId,
                `Offer ${status}`,
                `A candidate has ${status.toLowerCase()} your offer for ${job.title}`,
                'StatusChange',
                `/employer/applications/${applicationId}`
            );
        }
    }
  }, [applications, jobs]);

  // For demonstration, the profile with id 'usr_00001' is considered the logged-in user.
  const getLoggedInSeeker = useCallback(() => {
    const seeker = profiles.find(p => p.id === 'usr_00001');
    if (!seeker) {
        return profiles[0];
    }
    return seeker;
  }, [profiles]);

  const sendMessage = useCallback((receiverId: string, content: string, jobId?: string) => {
    const seeker = getLoggedInSeeker();
    const newMsg: Message = {
        id: `msg_${Date.now()}`,
        senderId: seeker.id,
        receiverId,
        jobId,
        content,
        sentAt: new Date().toISOString(),
        isRead: false
    };
    // In a real app, we'd have a messages state. For now, we'll just notify.
    addNotification(
        receiverId,
        'New Message',
        `You have a new message regarding a position.`,
        'Message',
        jobId ? `/jobs/${jobId}` : undefined
    );
    console.log('Message sent:', newMsg);
  }, [addNotification, getLoggedInSeeker]);

  const addCredential = useCallback((cred: Omit<VerifiableCredential, 'id' | 'lastVerifiedAt' | 'provenanceChain' | 'verificationUrl' | 'qrPayload'>) => {
    const newId = `cred_${Date.now()}`;
    const newCredential: VerifiableCredential = {
      ...cred,
      id: newId,
      lastVerifiedAt: new Date().toISOString(),
      provenanceChain: [
        {
          id: `prov_${Date.now()}`,
          stepName: 'Candidate Direct Attestation',
          actor: 'Self Declared',
          actorRole: 'Candidate',
          action: `Submitted credential record for ${cred.title}`,
          timestamp: new Date().toISOString(),
          evidenceMethod: 'Credential Wallet Upload',
          status: 'pending',
        }
      ],
      verificationUrl: `https://verifiedhire.com/verify/${newId}`,
      qrPayload: `https://verifiedhire.com/verify/${newId}?sig=sha256_${newId}`
    };

    setCredentials(prev => [newCredential, ...prev]);
    addNotification(
      cred.candidateId,
      'Credential Stored in Wallet',
      `"${cred.title}" has been saved to your Professional Passport and queued for verification.`,
      'System'
    );
  }, [addNotification]);

  const updateCredentialStatus = useCallback((credId: string, status: VerificationStatus, notes?: string) => {
    setCredentials(prev => prev.map(c => {
      if (c.id === credId) {
        const newChainStep = {
          id: `prov_${Date.now()}`,
          stepName: `Status Updated to ${status}`,
          actor: 'Accredited Verification Authority',
          actorRole: 'Verification Operations',
          action: notes || `Credential moved to ${status} following review.`,
          timestamp: new Date().toISOString(),
          evidenceMethod: 'Verification Audit Board Decision',
          status: status === VerificationStatus.REJECTED || status === VerificationStatus.FLAGGED ? 'flagged' as const : 'passed' as const,
          notes
        };
        return {
          ...c,
          verificationState: status,
          lastVerifiedAt: new Date().toISOString(),
          provenanceChain: [...c.provenanceChain, newChainStep]
        };
      }
      return c;
    }));
  }, []);

  const updateVaultConsent = useCallback((granted: boolean) => {
    setSensitiveVault(prev => ({
      ...prev,
      consentGranted: granted,
      consentExpiresAt: granted ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
    }));
    addNotification(
      'usr_00001',
      granted ? 'Sensitive Data Vault Access Enabled' : 'Sensitive Data Vault Revoked',
      granted 
        ? 'Prospective verified employers may now request purpose-audited minimum disclosure for statutory compliance.'
        : 'All external employer access to sensitive vault records has been immediately blocked.',
      'System'
    );
  }, [addNotification]);

  const logVaultAccess = useCallback((requesterName: string, org: string, purpose: string, fields: string[]) => {
    const newLog = {
      id: `log_${Date.now()}`,
      requesterName,
      organisation: org,
      timestamp: new Date().toISOString(),
      purpose,
      fieldsAccessed: fields,
      status: 'approved' as const
    };
    setSensitiveVault(prev => ({
      ...prev,
      accessLogs: [newLog, ...prev.accessLogs]
    }));
  }, []);

  const updatePrivacySetting = useCallback(<K extends keyof CandidatePrivacySettings>(key: K, value: CandidatePrivacySettings[K]) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const logProfileView = useCallback((viewerName: string, org: string, sections: string[], reason: string) => {
    const newAudit = {
      id: `view_${Date.now()}`,
      viewerName,
      organisation: org,
      timestamp: new Date().toISOString(),
      sectionsViewed: sections,
      accessReason: reason
    };
    setPrivacySettings(prev => ({
      ...prev,
      whoViewedMe: [newAudit, ...prev.whoViewedMe]
    }));
  }, []);

  const toggleBlindScreening = useCallback(() => {
    setBlindScreeningMode(prev => !prev);
  }, []);

  const createRequisition = useCallback((req: Omit<JobRequisition, 'id' | 'createdAt' | 'approvals'>) => {
    const newReq: JobRequisition = {
      ...req,
      id: `req_${Date.now()}`,
      createdAt: new Date().toISOString(),
      approvals: [
        { role: 'Hiring Manager', approverName: req.hiringManager, status: 'Approved', timestamp: new Date().toISOString() },
        { role: 'Department Head', approverName: 'Department Director', status: 'Pending' },
        { role: 'HR Operations', approverName: 'Talent Acquisition Lead', status: 'Pending' },
        { role: 'Finance / Budget Controller', approverName: 'Finance Controller', status: 'Pending' }
      ]
    };
    setRequisitions(prev => [newReq, ...prev]);
    addNotification('emp_001', 'Requisition Created', `New vacancy requisition "${req.title}" submitted for chain approvals.`, 'System');
  }, [addNotification]);

  const updateRequisitionApproval = useCallback((reqId: string, role: string, status: 'Approved' | 'Rejected', comment?: string) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id === reqId) {
        const updatedApprovals = r.approvals.map(a => 
          a.role === role ? { ...a, status, timestamp: new Date().toISOString(), comment } : a
        );
        const allApproved = updatedApprovals.every(a => a.status === 'Approved');
        const anyRejected = updatedApprovals.some(a => a.status === 'Rejected');
        return {
          ...r,
          approvals: updatedApprovals,
          status: anyRejected ? 'Rejected' : allApproved ? 'Approved' : 'Pending_Approval'
        };
      }
      return r;
    }));
  }, []);

  const scheduleInterview = useCallback((interview: Omit<StructuredInterview, 'id' | 'scorecards'>) => {
    const newInterview: StructuredInterview = {
      ...interview,
      id: `int_${Date.now()}`,
      scorecards: []
    };
    setInterviews(prev => [newInterview, ...prev]);
    addNotification(
      'emp_001',
      'Interview Scheduled',
      `${interview.candidateName} scheduled for ${interview.stageName} on ${interview.scheduledDate} at ${interview.scheduledTime}.`,
      'System'
    );
  }, [addNotification]);

  const submitScorecard = useCallback((scorecard: Omit<InterviewScorecard, 'id' | 'submittedAt'>) => {
    const newScorecard: InterviewScorecard = {
      ...scorecard,
      id: `sc_${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    setInterviews(prev => prev.map(i => {
      if (i.id === scorecard.interviewId) {
        return {
          ...i,
          scorecards: [...i.scorecards, newScorecard],
          status: 'Completed'
        };
      }
      return i;
    }));
  }, []);

  const createTalentPool = useCallback((name: string, sector: string, tags: string[]) => {
    const newPool: TalentPool = {
      id: `pool_${Date.now()}`,
      name,
      sector,
      candidateIds: [],
      tags,
      notesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTalentPools(prev => [newPool, ...prev]);
  }, []);

  const addCandidateToPool = useCallback((poolId: string, candidateId: string) => {
    setTalentPools(prev => prev.map(p => {
      if (p.id === poolId && !p.candidateIds.includes(candidateId)) {
        return {
          ...p,
          candidateIds: [...p.candidateIds, candidateId]
        };
      }
      return p;
    }));
  }, []);

  const declareCaseConflict = useCallback((caseId: string, hasConflict: boolean) => {
    setAgentCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          conflictDeclared: true,
          conflictAcknowledgeTimestamp: new Date().toISOString(),
          status: hasConflict ? 'Unassigned' : 'Under_Review',
          assignedAgentId: hasConflict ? undefined : c.assignedAgentId
        };
      }
      return c;
    }));
  }, []);

  const updateCaseChecklist = useCallback((caseId: string, itemIndex: number, checked: boolean, notes?: string) => {
    setAgentCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const checklist = [...c.evidenceChecklist];
        checklist[itemIndex] = { ...checklist[itemIndex], checked, notes: notes || checklist[itemIndex].notes };
        return {
          ...c,
          evidenceChecklist: checklist
        };
      }
      return c;
    }));
  }, []);

  const submitCaseQA = useCallback((caseId: string) => {
    setAgentCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'Completed',
          qaApprover: 'Senior QA Review Board'
        };
      }
      return c;
    }));
    addNotification('emp_001', 'Verification Completed', `Verification case ${caseId} has successfully passed double-blind QA inspection.`, 'System');
  }, [addNotification]);

  const issueVerifiableCredential = useCallback((cred: Omit<VerifiableCredential, 'id' | 'lastVerifiedAt' | 'provenanceChain' | 'verificationUrl' | 'qrPayload'>) => {
    const newId = `cred_iss_${Date.now()}`;
    const issuedCred: VerifiableCredential = {
      ...cred,
      id: newId,
      verificationState: VerificationStatus.ISSUER_VERIFIED,
      lastVerifiedAt: new Date().toISOString(),
      provenanceChain: [
        {
          id: `prov_${Date.now()}`,
          stepName: 'Primary Source Direct Issuance',
          actor: cred.issuingOrg,
          actorRole: 'Accredited Credential Issuer',
          action: `Cryptographically minted verifiable credential #${cred.credentialNumber || newId}`,
          timestamp: new Date().toISOString(),
          evidenceMethod: 'Direct Institutional Registrar Portal',
          status: 'passed'
        }
      ],
      verificationUrl: `https://verifiedhire.com/verify/${newId}`,
      qrPayload: `https://verifiedhire.com/verify/${newId}?sig=sha256_issuer_${newId}`
    };
    setCredentials(prev => [issuedCred, ...prev]);
    setCredentialIssuers(prev => prev.map(i => {
      if (i.orgName === cred.issuingOrg) {
        return { ...i, issuedCount: i.issuedCount + 1 };
      }
      return i;
    }));
  }, []);

  const purchaseVerificationPackage = useCallback((pkgId: string, method: 'mpesa' | 'card', referenceId?: string) => {
    const pkg = marketplacePackages.find(p => p.id === pkgId);
    setCreditsBalance(prev => prev + 5);
    addNotification(
      'usr_00001',
      'Verification Order Confirmed',
      `Payment of KES ${pkg?.priceKES.toLocaleString() || '3,500'} via ${method.toUpperCase()} (${referenceId || 'MPESA-TX9823'}) processed. 5 verification audit credits added to your wallet.`,
      'System'
    );
  }, [addNotification, marketplacePackages]);

  const value = {
    profiles,
    jobs,
    applications,
    notifications,
    credentials,
    coverage: coverageScore,
    coverageScore,
    sensitiveVault,
    privacySettings,
    requisitions,
    interviews,
    talentPools,
    agentCases,
    credentialIssuers,
    marketplacePackages,
    blindScreeningMode,
    creditsBalance,
    getProfileById,
    updateProfileStatus,
    toggleShortlist,
    getLoggedInSeeker,
    addUser,
    updateProfile,
    theme,
    setTheme,
    applyToJob,
    updateApplicationStatus,
    addNotification,
    markNotificationAsRead,
    postJob,
    deleteJob,
    respondToOffer,
    sendMessage,
    addCredential,
    updateCredentialStatus,
    updateVaultConsent,
    logVaultAccess,
    updatePrivacySetting,
    logProfileView,
    toggleBlindScreening,
    createRequisition,
    updateRequisitionApproval,
    scheduleInterview,
    submitScorecard,
    createTalentPool,
    addCandidateToPool,
    declareCaseConflict,
    updateCaseChecklist,
    submitCaseQA,
    issueVerifiableCredential,
    purchaseVerificationPackage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};