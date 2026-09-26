import { 
  VerifiableCredential, 
  VerificationStatus, 
  VerificationCoverage, 
  SensitiveVaultData, 
  CandidatePrivacySettings, 
  JobRequisition, 
  StructuredInterview, 
  TalentPool, 
  VerificationCase, 
  CredentialIssuer, 
  VerificationMarketplacePackage 
} from '../types';

export const mockVerifiableCredentials: VerifiableCredential[] = [
  {
    id: 'cred_001',
    candidateId: 'usr_00001',
    title: 'Commercial Pilot Licence (CPL - Multi-Engine / Instrument Rating)',
    category: 'licence',
    issuingOrg: 'Kenya Civil Aviation Authority (KCAA)',
    issueDate: '2021-04-12',
    expiryDate: '2027-04-12',
    credentialNumber: 'KCAA/CPL/84920-EA',
    verificationState: VerificationStatus.SOURCE_VERIFIED,
    verificationMethod: 'Primary Source Registry API + Physical Seal Audit',
    verifyingEntity: 'Capt. Evans Kariuki (KCAA Accredited Senior Auditor #AG-041)',
    verifyingAgentId: 'agent_kcaa_041',
    evidenceType: 'Primary Source Biometric Ledger & Logbook Inspection',
    evidenceUrl: 'https://verifiedhire.com/vault/evidence/kcaa-84920-audit.pdf',
    lastVerifiedAt: '2024-02-10T14:30:00Z',
    nextVerificationDue: '2025-02-10T14:30:00Z',
    provenanceChain: [
      {
        id: 'prov_1',
        stepName: 'Candidate Submission',
        actor: 'James Mwangi',
        actorRole: 'Candidate',
        action: 'Uploaded KCAA CPL Licence copy and authenticated logbook hours',
        timestamp: '2024-02-08T09:15:00Z',
        evidenceMethod: 'Document Submission & e-Sign',
        status: 'passed',
      },
      {
        id: 'prov_2',
        stepName: 'Issuer Registry Cross-Check',
        actor: 'KCAA Automated Flight Standards Gateway',
        actorRole: 'Issuing Authority API',
        action: 'Queried KCAA PEL (Personnel Licensing) Database for Licence #84920',
        timestamp: '2024-02-09T11:20:00Z',
        evidenceMethod: 'Automated REST Endpoint verification with cryptographic signature',
        status: 'passed',
        notes: 'Status: ACTIVE. Multi-Engine Rating valid through 2027.',
      },
      {
        id: 'prov_3',
        stepName: 'Accredited Field Agent Audit',
        actor: 'Capt. Evans Kariuki',
        actorRole: 'Accredited Verification Agent',
        action: 'Inspected original flight folio, total PIC hours (1,450 hrs), and medical certificate Class 1',
        timestamp: '2024-02-10T10:00:00Z',
        evidenceMethod: 'Physical in-person inspection at Wilson Airport Verification Desk',
        status: 'passed',
      },
      {
        id: 'prov_4',
        stepName: 'Senior QA Review & Seal',
        actor: 'Dr. Stella Mutua',
        actorRole: 'Senior Platform QA Officer',
        action: 'Reviewed forensic chain of evidence; issued cryptographic SHA-256 trust anchor',
        timestamp: '2024-02-10T14:30:00Z',
        evidenceMethod: 'Secondary QA Audit Approval',
        status: 'passed',
        notes: 'Source Verified with zero discrepancies. Re-audit scheduled in 12 months.',
      }
    ],
    disputeStatus: 'none',
    isRevoked: false,
    isPublicVisible: true,
    verificationUrl: 'https://verifiedhire.com/verify/cred_001',
    qrPayload: 'https://verifiedhire.com/verify/cred_001?sig=sha256_kcaa84920_verified'
  },
  {
    id: 'cred_002',
    candidateId: 'usr_00001',
    title: 'Bachelor of Science in Aeronautical Engineering (First Class Honours)',
    category: 'education',
    issuingOrg: 'Technical University of Kenya (TUK)',
    issueDate: '2019-11-28',
    credentialNumber: 'TUK/ENG/2015/0942',
    verificationState: VerificationStatus.ISSUER_VERIFIED,
    verificationMethod: 'Direct Institutional Registrar Portal Electronic Attestation',
    verifyingEntity: 'Academic Registrar Office, Technical University of Kenya',
    evidenceType: 'Registrar Encrypted Transcript & Degree Parchment Confirmation',
    lastVerifiedAt: '2024-01-15T16:00:00Z',
    provenanceChain: [
      {
        id: 'prov_e1',
        stepName: 'Transcript Upload',
        actor: 'James Mwangi',
        actorRole: 'Candidate',
        action: 'Submitted official degree certificate and graduation serial number',
        timestamp: '2024-01-12T08:00:00Z',
        evidenceMethod: 'PDF Document Upload',
        status: 'passed',
      },
      {
        id: 'prov_e2',
        stepName: 'Institutional Registrar Direct Attestation',
        actor: 'TUK Office of Academic Affairs',
        actorRole: 'Credential Issuer Portal',
        action: 'Validated matriculation record, graduation year 2019, and First Class standing',
        timestamp: '2024-01-15T16:00:00Z',
        evidenceMethod: 'Issuer Portal Cryptographic Direct Signing',
        status: 'passed',
      }
    ],
    disputeStatus: 'none',
    isRevoked: false,
    isPublicVisible: true,
    verificationUrl: 'https://verifiedhire.com/verify/cred_002',
    qrPayload: 'https://verifiedhire.com/verify/cred_002?sig=sha256_tuk_0942_verified'
  },
  {
    id: 'cred_003',
    candidateId: 'usr_00001',
    title: 'Senior Flight Operations Lead & Captain (Twin Otter / Caravan)',
    category: 'employment',
    issuingOrg: 'Safarilink Aviation Ltd',
    issueDate: '2021-06-01',
    expiryDate: '2024-01-31',
    credentialNumber: 'SAF/EMP/2021/04',
    verificationState: VerificationStatus.SOURCE_VERIFIED,
    verificationMethod: 'Corporate HR & Flight Operations Director Counter-Verification',
    verifyingEntity: 'Safarilink Aviation Human Resources & Chief Pilot Office',
    evidenceType: 'Employment Service Letter, Payroll Tax Filing (KRA P9), and Safety Clearance',
    lastVerifiedAt: '2024-02-05T12:00:00Z',
    provenanceChain: [
      {
        id: 'prov_emp1',
        stepName: 'Employment Claim Submission',
        actor: 'James Mwangi',
        actorRole: 'Candidate',
        action: 'Claimed tenure as Senior Flight Operations Lead (June 2021 - January 2024)',
        timestamp: '2024-02-01T10:00:00Z',
        evidenceMethod: 'Employment History Declaration',
        status: 'passed',
      },
      {
        id: 'prov_emp2',
        stepName: 'Enterprise Reference & HR Confirmation',
        actor: 'HR Director - Safarilink Aviation',
        actorRole: 'Authorized Employer Representative',
        action: 'Confirmed active employment dates, role responsibilities, clean safety record, and rehire eligibility',
        timestamp: '2024-02-05T12:00:00Z',
        evidenceMethod: 'Direct Digital Reference & KRA P9 Match',
        status: 'passed',
        notes: 'Safety Record: Flawless. Commended for VIP Bush Operations leadership.',
      }
    ],
    disputeStatus: 'none',
    isRevoked: false,
    isPublicVisible: true,
    verificationUrl: 'https://verifiedhire.com/verify/cred_003',
    qrPayload: 'https://verifiedhire.com/verify/cred_003?sig=sha256_saf_emp_verified'
  },
  {
    id: 'cred_004',
    candidateId: 'usr_00001',
    title: 'Engineers Board of Kenya (EBK) Professional Registration',
    category: 'licence',
    issuingOrg: 'Engineers Board of Kenya (EBK)',
    issueDate: '2022-08-15',
    expiryDate: '2026-12-31',
    credentialNumber: 'EBK/PE/7814',
    verificationState: VerificationStatus.SOURCE_VERIFIED,
    verificationMethod: 'EBK National Engineers Registry Webhook Integration',
    verifyingEntity: 'Engineers Board of Kenya Registrar',
    evidenceType: 'Annual Practicing License & EBK Gazette Notice',
    lastVerifiedAt: '2024-01-20T11:00:00Z',
    nextVerificationDue: '2025-01-20T11:00:00Z',
    provenanceChain: [
      {
        id: 'prov_ebk1',
        stepName: 'Registry Match',
        actor: 'EBK Automated Gateway',
        actorRole: 'Statutory Regulator',
        action: 'Confirmed Professional Engineer in good standing; continuous professional development (CPD) units up to date',
        timestamp: '2024-01-20T11:00:00Z',
        evidenceMethod: 'Statutory Registry Sync',
        status: 'passed',
      }
    ],
    disputeStatus: 'none',
    isRevoked: false,
    isPublicVisible: true,
    verificationUrl: 'https://verifiedhire.com/verify/cred_004',
    qrPayload: 'https://verifiedhire.com/verify/cred_004?sig=sha256_ebk7814_verified'
  }
];

export const mockVerificationCoverage: VerificationCoverage = {
  identity: 100,
  employment: 80,
  education: 100,
  licences: 100,
  skills: 65,
  references: 50,
  overall: 84,
  auditExplanation: '84% of all core career assertions are independently source-verified. Identity, degree credentials, and professional regulatory licences (KCAA & EBK) hold active cryptographic primary-source validation.'
};

export const mockSensitiveVault: SensitiveVaultData = {
  bloodGroup: 'O Positive (O+)',
  tribe: 'Protected Characteristic (Stored in Encrypted Vault - Not Disclosed)',
  height: '182 cm',
  weight: '76 kg',
  bmi: 22.9,
  gender: 'Male',
  dateOfBirth: '1992-07-14',
  medicalConditions: 'KCAA Class 1 Medical Fitness Certified (Audiometry, ECG & Vision Cleared)',
  disabilityDetails: 'None declared',
  criminalRecordDetails: 'Directorate of Criminal Investigations (DCI) Police Clearance Certificate No. PCC-2024-91823: NO CRIMINAL RECORD FOUND.',
  consentGranted: false, // Default: Candidate has NOT granted arbitrary disclosure
  consentExpiresAt: '2025-12-31',
  purposeRequirement: 'Strictly required only for statutory safety-critical aircrew licensing and pre-employment fit-for-duty compliance.',
  legalBasis: 'Kenya Data Protection Act 2019 (Section 44 - Processing of Sensitive Personal Data) & Civil Aviation Regulations',
  accessLogs: [
    {
      id: 'log_01',
      requesterName: 'Aviation Medical Examiner Dr. Kamau',
      organisation: 'AMREF Flying Doctors',
      timestamp: '2024-03-01T08:30:00Z',
      purpose: 'Statutory Class 1 Flight Crew Medical Recertification Audit',
      fieldsAccessed: ['KCAA Class 1 Medical Fitness', 'Blood Group'],
      status: 'approved'
    },
    {
      id: 'log_02',
      requesterName: 'Talent Acquisition Team',
      organisation: 'Kenya Airways PLC',
      timestamp: '2024-02-14T14:10:00Z',
      purpose: 'Pre-Interview DCI Background Clearance Verification',
      fieldsAccessed: ['Police Clearance Status (Lawful Summary Only)'],
      status: 'approved'
    }
  ]
};

export const mockPrivacySettings: CandidatePrivacySettings = {
  publicVisibility: true,
  verifiedEmployersOnly: true,
  appliedEmployersOnly: false,
  searchEngineIndexing: false,
  allowAgentAudits: true,
  whoViewedMe: [
    {
      id: 'view_01',
      viewerName: 'Capt. Patrick Ochieng (Chief Pilot)',
      organisation: 'Safaricom Air Wing / Aviation Ops',
      timestamp: '2024-03-14T11:24:00Z',
      sectionsViewed: ['Professional Passport', 'KCAA CPL Licence', 'Flight Hours Folio'],
      accessReason: 'Sourcing candidate for Senior Corporate Flight Captain requisition'
    },
    {
      id: 'view_02',
      viewerName: 'Wanjiku Mwangi (Head of People)',
      organisation: 'Equity Bank Group Technology',
      timestamp: '2024-03-12T09:15:00Z',
      sectionsViewed: ['Education Credentials', 'Engineering Board Registration'],
      accessReason: 'Candidate shortlisted for Systems Engineering leadership'
    },
    {
      id: 'view_03',
      viewerName: 'Field Auditor Desk',
      organisation: 'VerifiedHire Quality Assurance',
      timestamp: '2024-03-08T16:00:00Z',
      sectionsViewed: ['All Credentials & Primary Source Evidence'],
      accessReason: 'Routine annual credential validity refresh'
    }
  ]
};

export const mockRequisitions: JobRequisition[] = [
  {
    id: 'req_001',
    title: 'Senior Flight Operations Captain (Turboprop Fleet)',
    department: 'Flight Operations',
    hiringManager: 'Capt. Patrick Ochieng',
    openingsCount: 2,
    salaryBudget: 'KES 450,000 - 650,000/mo',
    status: 'Approved',
    createdAt: '2024-03-01T10:00:00Z',
    approvals: [
      { role: 'Hiring Manager', approverName: 'Capt. Patrick Ochieng', status: 'Approved', timestamp: '2024-03-01T10:30:00Z' },
      { role: 'Department Head', approverName: 'Capt. Brenda Achieng', status: 'Approved', timestamp: '2024-03-01T14:15:00Z' },
      { role: 'HR Director', approverName: 'Faith Chebet', status: 'Approved', timestamp: '2024-03-02T09:00:00Z' },
      { role: 'Finance / Budget Controller', approverName: 'David Kinyua', status: 'Approved', timestamp: '2024-03-02T16:45:00Z', comment: 'Budget approved within FY24 OPEX allocation.' }
    ]
  },
  {
    id: 'req_002',
    title: 'Lead Systems Architect & Cybersecurity Auditor',
    department: 'Digital Trust & Engineering',
    hiringManager: 'Kevin Kipkirui',
    openingsCount: 1,
    salaryBudget: 'KES 380,000 - 520,000/mo',
    status: 'Pending_Approval',
    createdAt: '2024-03-10T11:00:00Z',
    approvals: [
      { role: 'Hiring Manager', approverName: 'Kevin Kipkirui', status: 'Approved', timestamp: '2024-03-10T11:15:00Z' },
      { role: 'Department Head', approverName: 'Sarah M.', status: 'Approved', timestamp: '2024-03-11T10:00:00Z' },
      { role: 'HR Director', approverName: 'Faith Chebet', status: 'Pending' },
      { role: 'Finance / Budget Controller', approverName: 'David Kinyua', status: 'Pending' }
    ]
  }
];

export const mockStructuredInterviews: StructuredInterview[] = [
  {
    id: 'int_001',
    applicationId: 'app_00001',
    candidateName: 'James Mwangi',
    candidatePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    jobTitle: 'Senior Flight Operations Captain (Turboprop Fleet)',
    stageName: 'Technical Board Panel & Simulator Evaluation',
    scheduledDate: '2024-03-24',
    scheduledTime: '10:00 AM EAT',
    durationMinutes: 60,
    meetingUrl: 'https://verifiedhire.com/meet/int_001_flight_board',
    panelMembers: ['Capt. Patrick Ochieng (Chief Pilot)', 'Capt. Brenda Achieng (Fleet Captain)', 'Faith Chebet (People & Culture)'],
    status: 'Scheduled',
    scorecards: [
      {
        id: 'sc_01',
        interviewId: 'int_001',
        interviewerName: 'Capt. Patrick Ochieng',
        interviewerRole: 'Chief Pilot',
        scores: [
          { competency: 'Aviation Safety & Threat Mitigation', score: 5, evidenceNotes: 'Exhibited exceptional CRM (Crew Resource Management) and adverse weather recovery protocol.' },
          { competency: 'Regulatory Knowledge (KCAA/ICAO)', score: 5, evidenceNotes: 'Flawless recall of Part 121 flight duty limitations and airspace operating specifications.' },
          { competency: 'Leadership & Emergency Decisiveness', score: 4, evidenceNotes: 'Decisive command communication; articulated single-engine go-around procedure accurately.' }
        ],
        overallRecommendation: 'Strong Hire',
        summaryRemarks: 'Premier candidate with verified 1,450 PIC hours and impeccable primary source credentials.',
        submittedAt: '2024-03-15T12:00:00Z'
      }
    ]
  }
];

export const mockTalentPools: TalentPool[] = [
  {
    id: 'pool_01',
    name: 'Aviation Flight Deck & Captains',
    sector: 'Aviation',
    candidateIds: ['usr_00001', 'usr_00004'],
    tags: ['KCAA CPL/ATPL', 'Multi-Engine', '1000+ PIC Hrs', 'Turbine Rated'],
    notesCount: 8,
    createdAt: '2024-01-10'
  },
  {
    id: 'pool_02',
    name: 'FinTech Cloud & High-Throughput Engineers',
    sector: 'Technology',
    candidateIds: ['usr_00002', 'usr_00005', 'usr_00008'],
    tags: ['M-PESA APIs', 'Kubernetes', 'FastAPI', 'High Concurrency'],
    notesCount: 14,
    createdAt: '2024-01-15'
  },
  {
    id: 'pool_03',
    name: 'EBK Registered Professional Civil Engineers',
    sector: 'Infrastructure',
    candidateIds: ['usr_00003', 'usr_00007'],
    tags: ['EBK Licensed', 'FIDIC Contracts', 'Bridge & Geotech'],
    notesCount: 5,
    createdAt: '2024-02-01'
  }
];

export const mockAgentCases: VerificationCase[] = [
  {
    id: 'case_801',
    credentialId: 'cred_001',
    candidateName: 'James Mwangi',
    credentialTitle: 'KCAA Commercial Pilot Licence #84920',
    category: 'Aviation Licence',
    priority: 'Urgent',
    slaDeadline: '4 hours remaining (SLA: 24h)',
    complexity: 'Forensic',
    jurisdiction: 'Kenya / KCAA Aviation Safety Directorate',
    status: 'QA_Review',
    assignedAgentId: 'agent_041',
    conflictDeclared: true,
    conflictAcknowledgeTimestamp: '2024-03-14T08:00:00Z',
    evidenceChecklist: [
      { item: 'KCAA Personnel Licensing (PEL) Registry API Match', checked: true, notes: 'Confirmed active status' },
      { item: 'Physical Logbook PIC hours stamp check', checked: true, notes: '1,450 verified hours validated' },
      { item: 'KCAA Class 1 Aviation Medical validation', checked: true, notes: 'Valid through Dec 2024' },
      { item: 'No prior conflict of interest with applicant', checked: true, notes: 'Agent signed sworn conflict disclosure' }
    ],
    qaApprover: 'Dr. Stella Mutua (Senior QA Lead)',
    payoutAmountKES: 100
  },
  {
    id: 'case_802',
    credentialId: 'cred_002',
    candidateName: 'Faith Wanjiru',
    credentialTitle: 'Strathmore University MSc Data Science & Analytics',
    category: 'Higher Education',
    priority: 'Normal',
    slaDeadline: '18 hours remaining (SLA: 48h)',
    complexity: 'Standard',
    jurisdiction: 'Kenya / Commission for University Education (CUE)',
    status: 'Assigned',
    assignedAgentId: 'agent_041',
    conflictDeclared: false,
    evidenceChecklist: [
      { item: 'Strathmore University Registrar Electronic Confirmation', checked: true },
      { item: 'Verification of academic transcript authenticity', checked: false },
      { item: 'Conflict of interest declaration signed', checked: false }
    ],
    payoutAmountKES: 85
  }
];

export const mockCredentialIssuers: CredentialIssuer[] = [
  {
    id: 'issuer_kcaa',
    orgName: 'Kenya Civil Aviation Authority (KCAA)',
    orgType: 'Regulator',
    accreditationNumber: 'KCAA-REG-001',
    verifiedDomain: 'kcaa.or.ke',
    issuedCount: 1480,
    authorizedSigners: ['Director Flight Safety Standards', 'Chief Licensing Officer']
  },
  {
    id: 'issuer_ebk',
    orgName: 'Engineers Board of Kenya (EBK)',
    orgType: 'Licensing Board',
    accreditationNumber: 'EBK-STAT-1969',
    verifiedDomain: 'ebk.go.ke',
    issuedCount: 3200,
    authorizedSigners: ['Registrar of Engineers', 'Professional Review Board Chair']
  },
  {
    id: 'issuer_strathmore',
    orgName: 'Strathmore University',
    orgType: 'University',
    accreditationNumber: 'CUE-UNI-004',
    verifiedDomain: 'strathmore.edu',
    issuedCount: 5400,
    authorizedSigners: ['Academic Registrar', 'Dean Faculty of Computing']
  },
  {
    id: 'issuer_lsk',
    orgName: 'Law Society of Kenya (LSK)',
    orgType: 'Licensing Board',
    accreditationNumber: 'LSK-ADV-001',
    verifiedDomain: 'lsk.or.ke',
    issuedCount: 2150,
    authorizedSigners: ['Secretary / CEO', 'Advocates Roll Keeper']
  }
];

export const mockVerificationPackages: VerificationMarketplacePackage[] = [
  {
    id: 'pkg_starter',
    title: 'Essential Career Trust Check',
    priceKES: 3500,
    turnaroundDays: 2,
    coverageItems: [
      'Government ID & Biometric Verification',
      'Highest Academic Degree Primary-Source Check',
      'Police Clearance Certificate (DCI Criminal Records Check)',
      'Digital Professional Passport Seal'
    ],
    targetAudience: 'Candidate',
    isPopular: false
  },
  {
    id: 'pkg_pro',
    title: 'Full Professional Passport Accreditation',
    priceKES: 8500,
    turnaroundDays: 3,
    coverageItems: [
      'All Academic Degrees & Transcripts Check',
      'Last 5 Years Verified Employment History & HR Callouts',
      'Statutory Licences & Board Registration Validations',
      'Structured Digital References (2 Executive Referees)',
      'Verification Coverage Score calculation (Target 85%+)',
      'Shareable Digital Professional Card & Live QR Verification'
    ],
    targetAudience: 'Candidate',
    isPopular: true
  },
  {
    id: 'pkg_forensic',
    title: 'Safety-Critical & Forensic License Audit',
    priceKES: 16500,
    turnaroundDays: 4,
    coverageItems: [
      'Aviation (KCAA) / Engineering (EBK) / Medical (KMPDC) Audit',
      'In-person physical folio & logbook ledger inspection',
      'Direct Regulatory Agency Primary Source Gateway Query',
      'Senior QA Board sign-off and forensic timestamp',
      'Immunity against counterfeit credentials guarantee'
    ],
    targetAudience: 'Employer',
    isPopular: false
  },
  {
    id: 'pkg_enterprise_pool',
    title: 'Enterprise High-Volume Candidate Screening',
    priceKES: 35000,
    turnaroundDays: 2,
    coverageItems: [
      '10-Candidate Multi-Stage Verification credits',
      'Direct ATS Kanban integration and automated status webhooks',
      'Dedicated Accredited Field Agent assignment',
      'Sanctions, AML & Adverse Media Screening',
      'Priority SLA Turnaround Guarantee'
    ],
    targetAudience: 'Employer',
    isPopular: false
  }
];
