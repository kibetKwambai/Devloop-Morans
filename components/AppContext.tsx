
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
  VerificationMarketplacePackage,
  AgentAuditRecord
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
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  firebaseSignOut, 
  onAuthStateChanged, 
  FirebaseUser,
  setCachedGoogleAccessToken,
  getCachedGoogleAccessToken,
  doc,
  setDoc,
  collection,
  onSnapshot,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection
} from '../services/firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import { createGoogleMeetSpace } from '../services/googleMeetService';

export type Theme = 'light' | 'dark' | 'system';

export interface TestAccountDefinition {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  title: string;
  avatar: string;
  badge: string;
  company?: string;
  verified: boolean;
}

export const TEST_ACCOUNTS: Record<UserRole, TestAccountDefinition[]> = {
  [UserRole.JobSeeker]: [
    {
      id: 'usr_00001',
      name: 'Amani Wanjiku',
      email: 'amani.wanjiku@example.com',
      role: UserRole.JobSeeker,
      roleLabel: 'Job Seeker',
      title: 'Lead Cloud & AI Solutions Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Top Tier 99.2% Verified',
      company: 'Ex-Safaricom Cloud',
      verified: true,
    },
  ],
  [UserRole.Employer]: [
    {
      id: 'emp_safaricom',
      name: 'Safaricom PLC Talent',
      email: 'talent@safaricom.co.ke',
      role: UserRole.Employer,
      roleLabel: 'Employer',
      title: 'Enterprise Talent Acquisition',
      company: 'Safaricom PLC',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
      badge: 'Enterprise Partner',
      verified: true,
    },
  ],
  [UserRole.Agent]: [
    {
      id: 'ag_041',
      name: 'Agent Wachira',
      email: 'agent.wachira@verifiedhire.africa',
      role: UserRole.Agent,
      roleLabel: 'Verification Agent',
      title: 'Lead Credential Auditor #AG-041',
      company: 'VerifiedHire Field Operations',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badge: 'EBK & KCAA Accredited',
      verified: true,
    },
  ],
  [UserRole.Admin]: [
    {
      id: 'admin_root',
      name: 'Chief Compliance Officer',
      email: 'admin.compliance@verifiedhire.africa',
      role: UserRole.Admin,
      roleLabel: 'Platform Administrator',
      title: 'Security, Provenance & Governance',
      company: 'VerifiedHire Governance Board',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      badge: 'Super Admin',
      verified: true,
    },
  ],
  [UserRole.Issuer]: [
    {
      id: 'iss_kcaa',
      name: 'Kenya Civil Aviation Authority (KCAA)',
      email: 'registrar@kcaa.or.ke',
      role: UserRole.Issuer,
      roleLabel: 'Accredited Authority',
      title: 'Statutory Credential Registrar',
      company: 'Kenya Civil Aviation Authority',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: 'Official Issuer',
      verified: true,
    },
  ],
};

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
  agentAudits: AgentAuditRecord[];
  performAgentVerification: (audit: Omit<AgentAuditRecord, 'id' | 'verifiedAt' | 'signatureHash'>) => void;
  updateAuditPayoutStatus: (auditId: string, status: AgentAuditRecord['payoutStatus']) => void;
  credentialIssuers: CredentialIssuer[];
  marketplacePackages: VerificationMarketplacePackage[];
  blindScreeningMode: boolean;
  creditsBalance: number;
  currentUserId: string;
  currentUserRole: UserRole | null;
  firebaseUser: FirebaseUser | null;
  isFirebaseConnected: boolean;
  googleAccessToken: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOutGoogle: () => Promise<void>;
  setCurrentUserId: (id: string) => void;
  loginUser: (identifier: string, role: UserRole) => JobSeekerProfile;
  logoutUser: () => void;
  getProfileById: (id: string) => JobSeekerProfile | undefined;
  updateProfileStatus: (id: string, status: VerificationStatus, reason?: string) => void;
  toggleShortlist: (id: string) => void;
  getLoggedInSeeker: () => JobSeekerProfile;
  addUser: (user: Omit<JobSeekerProfile, 'id'>) => JobSeekerProfile;
  updateProfile: (profile: JobSeekerProfile) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyToJob: (jobId: string, jobSeekerId: string, coverLetter?: string, interestedOnly?: boolean) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  addNotification: (userId: string, title: string, message: string, type: Notification['type'], link?: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  postJob: (job: Omit<Job, 'id' | 'postedAt'>) => void;
  updateJob: (job: Job) => void;
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
  scheduleGoogleMeetInterview: (interview: Omit<StructuredInterview, 'id' | 'scorecards'>, customTitle?: string) => Promise<StructuredInterview>;
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
  
  // Firebase Auth & Connection state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

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
  const [interviews, setInterviews] = useState<StructuredInterview[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vh_interviews');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return mockStructuredInterviews;
  });
  const [talentPools, setTalentPools] = useState<TalentPool[]>(mockTalentPools);
  const [agentCases, setAgentCases] = useState<VerificationCase[]>(mockAgentCases);
  const [agentAudits, setAgentAudits] = useState<AgentAuditRecord[]>(() => {
    return [
      {
        id: 'aud_091',
        candidateId: 'usr_avi_001',
        candidateName: 'Brian Kiprop',
        candidateHeadline: 'Senior First Officer Boeing 737-800',
        credentialTitle: 'Airline Transport Pilot Licence (ATPL/IR/Multi-Engine)',
        category: 'Aviation Safety',
        agentId: 'ag_041',
        agentName: 'Agent Wachira (#AG-041)',
        verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        verificationMethod: 'Primary Source Registry Cross-Check & Folio Inspection',
        statutoryRegistryChecked: 'KCAA Air Transport Licensing Authority (PEL-REG-2024)',
        registrationNumberChecked: 'KCAA-ATPL-09482',
        checklistCompleted: [
          'Statutory Aircrew Register checked',
          'Class 1 Aviation Medical assessed',
          'B737 Type Rating & Simulator Check validated',
          'No flight safety violations found'
        ],
        swornNoConflictConfirmed: true,
        findingsSummary: 'Primary source KCAA PEL registry verified active. 4,200 PIC/SIC flight hours confirmed against official simulator logbook stamps. All ratings compliant with ICAO Annex 1.',
        authenticityScore: 99,
        payoutAmountKES: 1500,
        payoutStatus: 'Settled_MPESA',
        signatureHash: 'sha256_9f83a028eb194b38d93701239840134',
        status: VerificationStatus.VERIFIED
      },
      {
        id: 'aud_088',
        candidateId: 'usr_00001',
        candidateName: 'Amani Wanjiku',
        candidateHeadline: 'Lead Cloud & AI Solutions Architect',
        credentialTitle: 'AWS Certified Solutions Architect – Professional',
        category: 'Cloud Engineering',
        agentId: 'ag_041',
        agentName: 'Agent Wachira (#AG-041)',
        verifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        verificationMethod: 'Credly / AWS Digital Badge API Primary Inscription',
        statutoryRegistryChecked: 'Amazon Web Services Digital Badge Authority',
        registrationNumberChecked: 'AWS-SAP-892301-WANJIKU',
        checklistCompleted: [
          'Digital badge cryptographically validated',
          'Credential holder identity matched National ID',
          'Expiry date checked against AWS registry'
        ],
        swornNoConflictConfirmed: true,
        findingsSummary: 'Direct Credly cryptographic payload validated. Candidate identity matched National ID. Active certification valid through 2027.',
        authenticityScore: 100,
        payoutAmountKES: 850,
        payoutStatus: 'Settled_MPESA',
        signatureHash: 'sha256_b3749a0298d023910398401394aeb',
        status: VerificationStatus.VERIFIED
      },
      {
        id: 'aud_082',
        candidateId: 'usr_00002',
        candidateName: 'Faith Muthoni',
        candidateHeadline: 'Fintech Product & Fraud Risk Lead',
        credentialTitle: 'Certified Anti-Money Laundering Specialist (CAMS)',
        category: 'Fintech & Risk Compliance',
        agentId: 'ag_041',
        agentName: 'Agent Wachira (#AG-041)',
        verifiedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        verificationMethod: 'ACAMS Global Member Verification Registry',
        statutoryRegistryChecked: 'Association of Certified Anti-Money Laundering Specialists',
        registrationNumberChecked: 'ACAMS-MEM-2021-9842',
        checklistCompleted: [
          'ACAMS global member in good standing',
          'Continuing education units checked',
          'Certified copy of certificate verified'
        ],
        swornNoConflictConfirmed: true,
        findingsSummary: 'ACAMS institutional registrar verified active membership in good standing. 60 recertification credits verified.',
        authenticityScore: 98,
        payoutAmountKES: 950,
        payoutStatus: 'Approved_QA',
        signatureHash: 'sha256_c739194a0298d023910398401394bca',
        status: VerificationStatus.VERIFIED
      }
    ];
  });
  const [credentialIssuers, setCredentialIssuers] = useState<CredentialIssuer[]>(mockCredentialIssuers);
  const [marketplacePackages] = useState<VerificationMarketplacePackage[]>(mockVerificationPackages);
  const [blindScreeningMode, setBlindScreeningMode] = useState<boolean>(false);
  const [creditsBalance, setCreditsBalance] = useState<number>(12);

  // Active Authenticated User Session
  const [currentUserId, setCurrentUserIdState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vh_auth_userId') || 'usr_00001';
    }
    return 'usr_00001';
  });

  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vh_auth_role');
      if (saved) {
        if (saved === 'jobSeeker' || saved === '0') return UserRole.JobSeeker;
        if (saved === 'employer' || saved === '1') return UserRole.Employer;
        if (saved === 'admin' || saved === '2') return UserRole.Admin;
        if (saved === 'agent' || saved === '3') return UserRole.Agent;
        if (saved === 'issuer' || saved === '4') return UserRole.Issuer;
      }
    }
    return null;
  });

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsFirebaseConnected(true);
      }
    });

    testFirestoreConnection().then(connected => {
      setIsFirebaseConnected(connected);
    });

    return () => unsubscribe();
  }, []);

  // Sync interviews to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vh_interviews', JSON.stringify(interviews));
      } catch (e) { /* ignore */ }
    }
  }, [interviews]);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential && credential.accessToken) {
        setCachedGoogleAccessToken(credential.accessToken);
        setGoogleAccessToken(credential.accessToken);
      }
      setFirebaseUser(result.user);
      
      // Auto register / match user profile
      if (result.user.email) {
        const matched = profiles.find(p => p.email.toLowerCase() === result.user.email?.toLowerCase());
        if (matched) {
          setCurrentUserIdState(matched.id);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vh_auth_userId', matched.id);
          }
        }
      }
      return true;
    } catch (error: any) {
      console.warn('Google Sign-in failed or cancelled:', error);
      handleFirestoreError(error, OperationType.READ, 'auth/google-sign-in');
      return false;
    }
  }, [profiles]);

  const signOutGoogle = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setCachedGoogleAccessToken(null);
      setGoogleAccessToken(null);
      setFirebaseUser(null);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }, []);

  const setCurrentUserId = useCallback((id: string) => {
    setCurrentUserIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vh_auth_userId', id);
    }
  }, []);

  const loginUser = useCallback((identifier: string, role: UserRole): JobSeekerProfile => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vh_auth_role', String(role));
    }
    setCurrentUserRole(role);

    let cleanIdentifier = (identifier || '').trim().toLowerCase();
    
    // Default to primary test account for role if identifier is empty
    if (!cleanIdentifier && TEST_ACCOUNTS[role] && TEST_ACCOUNTS[role].length > 0) {
      cleanIdentifier = TEST_ACCOUNTS[role][0].id.toLowerCase();
    }

    // 1. Check if identifier matches any test accounts
    let matchedTestAccount: TestAccountDefinition | undefined;
    const allRoleAccounts = [
      ...(TEST_ACCOUNTS[role] || []),
      ...Object.values(TEST_ACCOUNTS).flat()
    ];
    
    matchedTestAccount = allRoleAccounts.find(
      acc => acc.id.toLowerCase() === cleanIdentifier || 
             acc.email.toLowerCase() === cleanIdentifier ||
             cleanIdentifier.includes(acc.id.toLowerCase()) ||
             (cleanIdentifier.includes('amani') && acc.id === 'usr_00001') ||
             (cleanIdentifier.includes('test.jobseeker') && acc.id === 'usr_00001') ||
             (cleanIdentifier.includes('staging') && acc.id === 'usr_00001') ||
             (cleanIdentifier.includes('seeker') && acc.id === 'usr_00001') ||
             (cleanIdentifier.includes('safaricom') && acc.id === 'emp_safaricom') ||
             (cleanIdentifier.includes('wachira') && acc.id === 'ag_041') ||
             (cleanIdentifier.includes('compliance') && acc.id === 'admin_root')
    );

    if (matchedTestAccount) {
      setCurrentUserId(matchedTestAccount.id);

      // Check if candidate profile already exists
      const existingProfile = profiles.find(
        p => p.id.toLowerCase() === matchedTestAccount!.id.toLowerCase() || 
             p.email.toLowerCase() === matchedTestAccount!.email.toLowerCase()
      );
      if (existingProfile) {
        return existingProfile;
      }

      // Otherwise create unified test profile for context lookups
      const testProfile: JobSeekerProfile = {
        id: matchedTestAccount.id,
        name: matchedTestAccount.name,
        email: matchedTestAccount.email,
        phone: '+254 711 000 000',
        location: 'Nairobi, Kenya',
        photoUrl: matchedTestAccount.avatar,
        headline: matchedTestAccount.title,
        verificationStatus: VerificationStatus.VERIFIED,
        workExperience: [
          {
            id: `exp_test_${matchedTestAccount.id}`,
            title: matchedTestAccount.title,
            company: matchedTestAccount.company || 'VerifiedHire Network',
            location: 'Nairobi, Kenya',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: `Operating as authenticated ${matchedTestAccount.roleLabel} within the VerifiedHire sovereign ecosystem.`,
            responsibilities: ['Verified credential audit management', 'Enterprise workflow compliance'],
            isVerified: true,
          }
        ],
        education: [
          {
            id: `edu_test_${matchedTestAccount.id}`,
            institution: 'University of Nairobi',
            degree: 'Bachelor of Science',
            fieldOfStudy: role === UserRole.Agent ? 'Forensic Audit & Regulatory Law' : 'Computer Science & Systems',
            startDate: '2016',
            endDate: '2020',
            isVerified: true,
          }
        ],
        skills: [
          { id: `sk_1_${matchedTestAccount.id}`, name: 'Verified Credential Analysis', type: 'Hard' },
          { id: `sk_2_${matchedTestAccount.id}`, name: 'Statutory Board Compliance', type: 'Hard' },
          { id: `sk_3_${matchedTestAccount.id}`, name: 'Integrity Governance', type: 'Soft' }
        ],
        documents: [],
        certifications: [],
        jobInterests: ['Full-time', 'Enterprise Requisitions'],
        languages: ['English', 'Swahili']
      };

      setProfiles(prev => [testProfile, ...prev.filter(p => p.id !== testProfile.id)]);
      return testProfile;
    }

    // 2. Look for exact match by ID or Email in existing profiles
    const existing = profiles.find(
      p => p.id.toLowerCase() === cleanIdentifier || p.email.toLowerCase() === cleanIdentifier
    );

    if (existing) {
      setCurrentUserId(existing.id);
      return existing;
    }

    // 3. Fallback: synthesize new profile for custom input
    const isEmail = cleanIdentifier.includes('@');
    const name = isEmail ? cleanIdentifier.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : identifier.trim();
    const email = isEmail ? cleanIdentifier : `${cleanIdentifier.replace(/\s+/g, '.').toLowerCase()}@verifiedhire.africa`;
    const assignedId = role === UserRole.Employer 
      ? `emp_${String(Date.now()).slice(-6)}` 
      : role === UserRole.Agent 
        ? `ag_${String(Date.now()).slice(-6)}` 
        : `usr_${String(Date.now()).slice(-6)}`;

    setCurrentUserId(assignedId);

    const newProfile: JobSeekerProfile = {
      id: assignedId,
      name: name || 'Verified Candidate',
      email: email,
      phone: '+254 700 000 000',
      location: 'Nairobi, Kenya',
      photoUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
      headline: role === UserRole.Employer ? 'Enterprise Talent Partner' : role === UserRole.Agent ? 'Verification Agent Auditor' : 'Certified Professional',
      verificationStatus: VerificationStatus.VERIFIED,
      workExperience: [
        {
          id: `exp_init_${Date.now()}`,
          title: role === UserRole.Employer ? 'Senior Talent Partner' : role === UserRole.Agent ? 'Accredited Field Auditor' : 'Professional Specialist',
          company: role === UserRole.Employer ? 'Enterprise Partner' : 'VerifiedHire Network',
          location: 'Nairobi, Kenya',
          startDate: 'Jan 2022',
          endDate: 'Present',
          description: 'Managing enterprise workflows with verified forensic credentials.',
          responsibilities: ['End-to-end credential auditing', 'Cross-functional pipeline execution'],
          isVerified: true,
        }
      ],
      education: [
        {
          id: `edu_init_${Date.now()}`,
          institution: 'University of Nairobi',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Information Technology & Systems',
          startDate: '2017',
          endDate: '2021',
          isVerified: true,
        }
      ],
      skills: [
        { id: `sk_${Date.now()}_1`, name: 'Strategic Execution', type: 'Hard' },
        { id: `sk_${Date.now()}_2`, name: 'Verifiable Integrity', type: 'Soft' },
        { id: `sk_${Date.now()}_3`, name: 'Cloud Architecture', type: 'Hard' }
      ],
      documents: [],
      certifications: [],
      jobInterests: ['Full-time', 'Enterprise Requisitions'],
      languages: ['English', 'Swahili'],
    };

    setProfiles(prev => [newProfile, ...prev]);
    return newProfile;
  }, [profiles, setCurrentUserId]);

  const logoutUser = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vh_auth_role');
      localStorage.removeItem('vh_auth_userId');
    }
    setCurrentUserRole(null);
    setCurrentUserIdState('usr_00001');
  }, []);

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
  
  const addUser = useCallback((user: Omit<JobSeekerProfile, 'id'>): JobSeekerProfile => {
    const newUser: JobSeekerProfile = {
      ...user,
      id: `usr_${String(Date.now()).slice(-6)}`,
    };
    setProfiles(prevProfiles => [newUser, ...prevProfiles]);
    setCurrentUserId(newUser.id);
    return newUser;
  }, [setCurrentUserId]);

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

  const updateJob = useCallback((updatedJob: Job) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
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

  // Returns currently active authenticated seeker profile
  const getLoggedInSeeker = useCallback(() => {
    const seeker = profiles.find(
      p => p.id === currentUserId || p.email.toLowerCase() === currentUserId.toLowerCase()
    );
    if (!seeker) {
      return profiles[0] || mockProfiles[0];
    }
    return seeker;
  }, [profiles, currentUserId]);

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

  const scheduleGoogleMeetInterview = useCallback(async (
    interview: Omit<StructuredInterview, 'id' | 'scorecards'>,
    customTitle?: string
  ): Promise<StructuredInterview> => {
    let meetSpaceResult = await createGoogleMeetSpace(googleAccessToken || undefined);
    const meetingUrl = meetSpaceResult.space?.meetingUri || `https://meet.google.com/${meetSpaceResult.space?.meetingCode || 'vh-panel-room'}`;
    const meetingCode = meetSpaceResult.space?.meetingCode || 'vh-panel-room';

    const newInterview: StructuredInterview = {
      ...interview,
      id: `int_${Date.now()}`,
      meetingUrl,
      googleMeetSpaceName: meetSpaceResult.space?.name,
      googleMeetCode: meetingCode,
      googleMeetUri: meetingUrl,
      googleMeetActive: true,
      scorecards: []
    };

    setInterviews(prev => [newInterview, ...prev]);

    // Firestore sync with safe fallback
    try {
      if (auth.currentUser) {
        const interviewDocRef = doc(db, 'interviews', newInterview.id);
        await setDoc(interviewDocRef, {
          id: newInterview.id,
          candidateName: newInterview.candidateName,
          jobTitle: newInterview.jobTitle,
          stageName: newInterview.stageName,
          scheduledDate: newInterview.scheduledDate,
          scheduledTime: newInterview.scheduledTime,
          durationMinutes: newInterview.durationMinutes,
          meetingUrl: newInterview.meetingUrl,
          googleMeetCode: newInterview.googleMeetCode,
          googleMeetUri: newInterview.googleMeetUri,
          status: newInterview.status,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `interviews/${newInterview.id}`);
    }

    addNotification(
      'emp_001',
      'Google Meet Panel Scheduled',
      `Google Meet video space generated (${meetingCode}) for ${interview.candidateName} on ${interview.scheduledDate} at ${interview.scheduledTime}.`,
      'System'
    );

    return newInterview;
  }, [addNotification, googleAccessToken]);

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

  const performAgentVerification = useCallback((auditData: Omit<AgentAuditRecord, 'id' | 'verifiedAt' | 'signatureHash'>) => {
    const newId = `aud_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const signatureHash = `sha256_${Date.now()}_${auditData.candidateId}_${auditData.agentId}`;

    const newAuditRecord: AgentAuditRecord = {
      ...auditData,
      id: newId,
      verifiedAt: timestamp,
      signatureHash
    };

    // 1. Prepend to agent audits ledger
    setAgentAudits(prev => [newAuditRecord, ...prev]);

    // 2. Update candidate profile verification status
    setProfiles(prev => prev.map(p => {
      if (p.id === auditData.candidateId) {
        return {
          ...p,
          verificationStatus: auditData.status
        };
      }
      return p;
    }));

    // 3. Update or link candidate credential in credentials list
    setCredentials(prev => {
      const match = prev.find(c => c.candidateId === auditData.candidateId && c.title.toLowerCase() === auditData.credentialTitle.toLowerCase());
      if (match) {
        return prev.map(c => c.id === match.id ? {
          ...c,
          verificationState: auditData.status,
          verifyingAgentId: auditData.agentId,
          lastVerifiedAt: timestamp
        } : c);
      } else {
        // Create verified credential entry in passport
        const newCred: VerifiableCredential = {
          id: `cred_${Date.now()}`,
          candidateId: auditData.candidateId,
          title: auditData.credentialTitle,
          category: auditData.category.toLowerCase().includes('pilot') || auditData.category.toLowerCase().includes('aviation') ? 'licence' : 'certification',
          issuingOrg: auditData.statutoryRegistryChecked,
          issueDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          credentialNumber: auditData.registrationNumberChecked,
          verificationState: auditData.status,
          verificationMethod: auditData.verificationMethod,
          verifyingEntity: auditData.agentName,
          verifyingAgentId: auditData.agentId,
          evidenceType: 'Statutory Registry Audit Folio',
          lastVerifiedAt: timestamp,
          provenanceChain: [
            {
              id: `prov_${Date.now()}`,
              stepName: 'Accredited Agent Primary Source Inscription',
              actor: auditData.agentName,
              actorRole: 'Accredited Statutory Agent',
              action: `Audit completed: ${auditData.findingsSummary}`,
              timestamp,
              evidenceMethod: auditData.verificationMethod,
              status: 'passed'
            }
          ],
          disputeStatus: 'none',
          isRevoked: false,
          isPublicVisible: true,
          verificationUrl: `https://verifiedhire.com/verify/${newId}`,
          qrPayload: `https://verifiedhire.com/verify/${newId}?sig=${signatureHash}`
        };
        return [newCred, ...prev];
      }
    });

    // 4. Update agent case status if matching case exists
    setAgentCases(prev => prev.map(c => {
      if (c.candidateName.toLowerCase() === auditData.candidateName.toLowerCase() || c.credentialTitle.toLowerCase() === auditData.credentialTitle.toLowerCase()) {
        return {
          ...c,
          status: 'Completed',
          payoutAmountKES: auditData.payoutAmountKES
        };
      }
      return c;
    }));

    // 5. Send notification to candidate
    addNotification(
      auditData.candidateId,
      'Credential Audit Verified & Sealed',
      `${auditData.agentName} has inspected and cryptographically sealed your ${auditData.credentialTitle} (${auditData.statutoryRegistryChecked}).`,
      'StatusChange'
    );
  }, [addNotification]);

  const updateAuditPayoutStatus = useCallback((auditId: string, status: AgentAuditRecord['payoutStatus']) => {
    setAgentAudits(prev => prev.map(a => a.id === auditId ? { ...a, payoutStatus: status } : a));
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
    agentAudits,
    performAgentVerification,
    updateAuditPayoutStatus,
    credentialIssuers,
    marketplacePackages,
    blindScreeningMode,
    creditsBalance,
    currentUserId,
    currentUserRole,
    firebaseUser,
    isFirebaseConnected,
    googleAccessToken,
    signInWithGoogle,
    signOutGoogle,
    setCurrentUserId,
    loginUser,
    logoutUser,
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
    updateJob,
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
    scheduleGoogleMeetInterview,
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