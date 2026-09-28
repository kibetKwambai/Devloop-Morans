import React, { useState, useMemo, useEffect } from 'react';
import { VerificationCase, VerificationStatus, JobSeekerProfile } from '../types';
import { useAppContext } from './AppContext';
import { Icon, IconName } from './Icon';

interface DocumentCheckpoint {
  id: string;
  name: string;
  category: string;
  expectedValue: string;
  fieldName: string;
  placeholder: string;
  checklist: string[];
  mockScanTitle: string;
  mockScanBody: string;
  externalLink?: string;
  payoutKES: number;
}

const DOCUMENT_CHECKPOINTS: DocumentCheckpoint[] = [
  {
    id: 'birth_cert',
    name: 'Birth Certificate (B Cert)',
    category: 'Identity Registry',
    expectedValue: 'B-1994-0418-941',
    fieldName: 'Entry Number (e.g. B-YYYY-MMDD-XXX)',
    placeholder: 'Look at the top-right entry index and type it...',
    checklist: [
      'Child full legal names match profile registration name',
      'Mother and Father names verified against sub-county record register',
      'Official registrar seal of civil registration department present'
    ],
    mockScanTitle: 'REPUBLIC OF KENYA - CERTIFICATE OF BIRTH',
    mockScanBody: 'Entry No: B-1994-0418-941\nDistrict: Mombasa Municipal\nName: Amani Wanjiku Mwangi\nDate of Birth: 18th April 1994\nFather: Joseph Mwangi Karanja\nMother: Mary Nyambura Mwangi\nRegistered: 22nd April 1994',
    payoutKES: 150
  },
  {
    id: 'national_id',
    name: 'National ID / Maisha Card',
    category: 'Identity Registry',
    expectedValue: '31409241',
    fieldName: 'National ID Card Number',
    placeholder: 'Type the bold 8-digit ID number from Maisha card...',
    checklist: [
      'ID Card Number aligns with candidate physical card photocopy',
      'Facial scan features match candidate profile photo structure (>95% match)',
      'Date of Birth corresponds to Birth Certificate & secondary school indices'
    ],
    mockScanTitle: 'JAMHURI YA KENYA - NATIONAL IDENTITY CARD',
    mockScanBody: 'ID Number: 31409241\nNames: AMANI WANJIKU MWANGI\nDate of Birth: 18.04.1994\nGender: F\nDistrict of Birth: MOMBASA\nSerial Number: 834920194',
    payoutKES: 150
  },
  {
    id: 'passport',
    name: 'Travel Passport',
    category: 'Identity Registry',
    expectedValue: 'AK0948123',
    fieldName: 'Passport Number',
    placeholder: 'Type the passport document number (9 chars)...',
    checklist: [
      'Document remains actively valid for international travel (>6 months expiry)',
      'Machine Readable Zone (MRZ) string integrity verified',
      'Passport holder signature matches digital portal profile signature'
    ],
    mockScanTitle: 'KENYA PASSPORT - PASIPOTI',
    mockScanBody: 'Passport No: AK0948123\nType: P  Country: KEN\nName: MWANGI, AMANI WANJIKU\nNationality: KENYAN\nDate of Birth: 18 APR 1994\nDate of Issue: 12 DEC 2021\nDate of Expiry: 11 DEC 2031\nMRZ: P<KENMWANGI<<AMANI<<<<<<<<<<<<<<<<<<<<<<',
    payoutKES: 200
  },
  {
    id: 'kcpe_cert',
    name: 'KCPE Certificate',
    category: 'Primary Education',
    expectedValue: 'E1049281',
    fieldName: 'Certificate Serial Number',
    placeholder: 'Enter the certificate serial number on bottom left...',
    checklist: [
      'Candidate school index corresponds with registered school code',
      'Conferred total marks aggregate reflects KNEC national repository',
      'Holographic crest logo matches state academic issuer standard'
    ],
    mockScanTitle: 'THE KENYA NATIONAL EXAMINATIONS COUNCIL - KCPE',
    mockScanBody: 'This is to certify that AMANI WANJIKU MWANGI\nIndex: 12345678/02  Year: 2010\nSchool: MOMBASA ACADEMY\nObtained the following marks:\nENGLISH: A  KISWAHILI: A  MATHEMATICS: B\nSCIENCE: B  SOCIAL STUDIES & RELIGION: A\nTOTAL MARKS: 412 OF 500\nCertificate Serial No: E1049281',
    payoutKES: 150
  },
  {
    id: 'kcse_cert',
    name: 'KCSE Certificate',
    category: 'Secondary Education',
    expectedValue: 'K4920412',
    fieldName: 'Certificate Serial Number',
    placeholder: 'Enter the KCSE certificate serial number...',
    checklist: [
      'KNEC secondary school index code matches physical high school records',
      'Grade breakdown aligns exactly with declaration',
      'Hologram strip validated under high-definition scanner'
    ],
    mockScanTitle: 'THE KENYA NATIONAL EXAMINATIONS COUNCIL - KCSE',
    mockScanBody: 'This is to certify that AMANI WANJIKU MWANGI\nIndex: 12345678/001  Year: 2014\nSchool: ALLIANCE GIRLS HIGH SCHOOL\nObtained the following grades:\nENGLISH: A-  KISWAHILI: A  MATHEMATICS: A\nPHYSICS: B+  CHEMISTRY: A-  BIOLOGY: A\nMEAN GRADE: A (PLAIN)\nCertificate Serial No: K4920412',
    payoutKES: 200
  },
  {
    id: 'academic_degree',
    name: 'University Degree / Diploma',
    category: 'Higher Education',
    expectedValue: 'UON-DEG-94812',
    fieldName: 'Degree Serial Number',
    placeholder: 'Type the university degree registry serial...',
    checklist: [
      'Graduation list record verified against University Registrar database',
      'Field of study and major align with career declarations',
      'Conferred honours classification matches academic transcripts'
    ],
    mockScanTitle: 'UNIVERSITY OF NAIROBI - DEGREE CONFERMENT',
    mockScanBody: 'The Senate hereby certifies that AMANI WANJIKU MWANGI\nhaving satisfied the requirements for the award of the degree of\nBACHELOR OF SCIENCE IN COMPUTER SCIENCE\nwas admitted to the degree with FIRST CLASS HONOURS\non the 6th of December 2019\nCertificate Serial No: UON-DEG-94812',
    payoutKES: 250
  },
  {
    id: 'profile_photo',
    name: 'Profile Photo (Liveness)',
    category: 'Facial Biometrics',
    expectedValue: 'LIVENESS_OK',
    fieldName: 'Type "LIVENESS_OK" to confirm realness check',
    placeholder: 'Review the liveness scanner report and type confirmation...',
    checklist: [
      'Analyzed for generative adversarial network (GAN) artificial artifacts',
      'Verified zero stock image duplication on global Google Lens search',
      'Eye focus, shadow coordinates, and facial bone structure verify a live person'
    ],
    mockScanTitle: 'BIOMETRIC INTEGRITY ANALYSIS - DEVLOOP ENGINE',
    mockScanBody: 'Facial Match with ID Document: 99.4%\nDeepfake Synthetic Probability: 0.01% (PASS)\nLiveness Detection Score: 98.9% (SECURE_PERSON)\nNo static background anomalies detected.\nBiometric verification code: LIVENESS_OK',
    payoutKES: 100
  },
  {
    id: 'police_clearance',
    name: 'Police Clearance (Good Conduct)',
    category: 'Statutory Clearances',
    expectedValue: 'PCC-2026-98124',
    fieldName: 'DCI Reference Code',
    placeholder: 'Type the DCI certificate reference code...',
    checklist: [
      'Verified directly against DCI database (dci.ecitizen.go.ke/verify)',
      'Certificate remains actively valid (< 6 months from issue date)',
      'Criminal record check database returns zero active offense flags'
    ],
    mockScanTitle: 'DCI KENYA - POLICE CLEARANCE CERTIFICATE',
    mockScanBody: 'This is to certify that AMANI WANJIKU MWANGI\nof ID Number 31409241 has been checked in our criminal records.\nResult: NIL (NO ADVERSE RECORD FOUND)\nReference No: PCC-2026-98124\nVerification Link: https://dci.ecitizen.go.ke/verify/PCC-2026-98124',
    externalLink: 'https://dci.ecitizen.go.ke/verify',
    payoutKES: 300
  },
  {
    id: 'statutory_compliance',
    name: 'Statutory Compliance Bundle',
    category: 'Statutory Clearances',
    expectedValue: 'A009418241X',
    fieldName: 'KRA iTax PIN Number',
    placeholder: 'Type the verified KRA iTax PIN...',
    checklist: [
      'KRA iTax PIN registered and validated active with PIN checker',
      'HELB clearance certificate number cross-referenced successfully',
      'NSSF & NHIF accounts confirmed matching user identity records'
    ],
    mockScanTitle: 'KENYA REVENUE AUTHORITY - PIN CERTIFICATE',
    mockScanBody: 'PIN Number: A009418241X\nName: AMANI WANJIKU MWANGI\nStatus: ACTIVE / TAX COMPLIANT\nHELB Compliance Code: HELB-COM-84210\nNSSF Number: 981240182\nNHIF Number: 418204128',
    payoutKES: 250
  }
];

interface VerificationAgentPortalProps {
  onViewProfile?: (profileId: string) => void;
}

export const VerificationAgentPortal: React.FC<VerificationAgentPortalProps> = ({ onViewProfile }) => {
  const { 
    agentCases, 
    profiles,
    credentials,
    declareCaseConflict, 
    updateCaseChecklist, 
    submitCaseQA,
    updateProfileStatus,
    addNotification,
    agentAudits,
    performAgentVerification
  } = useAppContext();

  // Active view tab: either Employee/Candidate Verification Queue, Forensic Case Workstation, Guidelines, or Agent Profile
  const [activeTab, setActiveTab] = useState<'candidates' | 'cases' | 'guidelines' | 'agentProfile'>('candidates');

  // Agent Auditor Profile State (Editable)
  const [agentName, setAgentName] = useState('Agent Wachira');
  const [agentLicense, setAgentLicense] = useState('AG-041-EBK-KCAA');
  const [agentEmail, setAgentEmail] = useState('agent.wachira@verifiedhire.africa');
  const [agentPhone, setAgentPhone] = useState('+254 (0) 711 948 201');
  const [agentJurisdiction, setAgentJurisdiction] = useState('Nairobi Metropolitan & Coast Region (Kenya)');
  const [agentAccreditation, setAgentAccreditation] = useState('Engineers Board of Kenya (EBK) & KCAA Accredited Forensic Registrar');
  const [agentBio, setAgentBio] = useState('Senior Credential Forensics Auditor specializing in aviation licenses, engineering certifications, university degree transcript authenticity, and DCI criminal clearance validation.');
  const [agentSpecialties, setAgentSpecialties] = useState('Aviation Licences (KCAA ATPL/CPL), Higher Education, DCI Police Clearance, Statutory Tax Compliance');
  const [agentProfileSaved, setAgentProfileSaved] = useState<string | null>(null);

  // Candidate inspection state
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [candidateFilter, setCandidateFilter] = useState<'all' | 'pending' | 'draft' | 'verified' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Advanced Document Checklist Workstation States
  const [activeVerificationCandidate, setActiveVerificationCandidate] = useState<JobSeekerProfile | null>(null);
  const [activeCheckpointIndex, setActiveCheckpointIndex] = useState<number>(0);
  const [swornNoConflict, setSwornNoConflict] = useState(false);
  const [checkpointStates, setCheckpointStates] = useState<Record<string, 'pending' | 'approved' | 'rejected'>>({});
  const [checkpointInputs, setCheckpointInputs] = useState<Record<string, string>>({});
  const [checkpointChecklists, setCheckpointChecklists] = useState<Record<string, string[]>>({});
  const [checkpointProofUrls, setCheckpointProofUrls] = useState<Record<string, string>>({});
  const [checkpointTimers, setCheckpointTimers] = useState<Record<string, number>>({});
  const [checkpointRejectionReasons, setCheckpointRejectionReasons] = useState<Record<string, string>>({});
  const [checkpointRejectionNotes, setCheckpointRejectionNotes] = useState<Record<string, string>>({});

  const [verificationMethod, setVerificationMethod] = useState('Primary Source Registry API Match');
  const [checkedRegistry, setCheckedRegistry] = useState('');
  const [checkedReference, setCheckedReference] = useState('');
  const [findingsSummary, setFindingsSummary] = useState('');
  const [authenticityScore, setAuthenticityScore] = useState(100);

  // Timer effect for the active checkpoint
  useEffect(() => {
    if (!activeVerificationCandidate) return;
    const currentDocId = DOCUMENT_CHECKPOINTS[activeCheckpointIndex].id;
    
    // Initialize timer for this document if not already set
    if (checkpointTimers[currentDocId] === undefined) {
      setCheckpointTimers(prev => ({ ...prev, [currentDocId]: 15 }));
    }

    if ((checkpointTimers[currentDocId] ?? 15) > 0 && (checkpointStates[currentDocId] || 'pending') === 'pending') {
      const interval = setInterval(() => {
        setCheckpointTimers(prev => {
          const currentVal = prev[currentDocId] ?? 15;
          if (currentVal <= 1) {
            clearInterval(interval);
            return { ...prev, [currentDocId]: 0 };
          }
          return { ...prev, [currentDocId]: currentVal - 1 };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeVerificationCandidate, activeCheckpointIndex, checkpointTimers, checkpointStates]);

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

  const getCandidateChecklistItems = (candidate: JobSeekerProfile) => {
    if (candidate.headline.toLowerCase().includes('pilot') || candidate.headline.toLowerCase().includes('aviation')) {
      return [
        'Statutory Aircrew Register PEL checked and status verified active',
        'Class 1 Aviation Medical Certificate assessed and matched against statutory expiry',
        'Aircraft Type Rating B737 Simulator logs cross-checked with certified registrar stamp',
        'Checked for prior flight safety, navigation, or general airmanship violations'
      ];
    }
    if (candidate.headline.toLowerCase().includes('cloud') || candidate.headline.toLowerCase().includes('solutions') || candidate.headline.toLowerCase().includes('engineer')) {
      return [
        'Direct cryptographic credential hash verified via Credly or AWS badge API',
        'Matched candidate legal name & photo against National Identification Card',
        'Verified certification is active and checked for direct registrar expiry'
      ];
    }
    return [
      'Direct academic registrar confirmation of degree certificate authenticity',
      'Degree holograms and signature authenticity verified under Forensic scanner',
      'No disciplinary issues, registry discrepancy, or grading misconduct reported'
    ];
  };

  const handleOpenVerifyModal = (candidate: JobSeekerProfile) => {
    setActiveVerificationCandidate(candidate);
    setActiveCheckpointIndex(0);
    setSwornNoConflict(false);
    
    // Clear dynamic states
    setCheckpointStates({});
    setCheckpointInputs({});
    setCheckpointChecklists({});
    setCheckpointProofUrls({});
    setCheckpointTimers({});
    setCheckpointRejectionReasons({});
    setCheckpointRejectionNotes({});

    // Start timer for first document
    const firstDocId = DOCUMENT_CHECKPOINTS[0].id;
    setCheckpointTimers({ [firstDocId]: 15 });

    setVerificationMethod('Multi-Point Primary Source Document Extraction & Review');
    setCheckedRegistry('KCAA, eCitizen DCI, KNEC, UoN Registrar, KRA');
    setCheckedReference('MULTIPLE_DOCS_VERIFIED');
    setFindingsSummary('');
    setAuthenticityScore(100);
  };

  const handleExecuteVerificationStamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVerificationCandidate) return;

    // Check sworn impartiality statement
    if (!swornNoConflict) {
      alert("You must check and confirm the sworn impartiality declaration first.");
      return;
    }

    const totalCheckpoints = DOCUMENT_CHECKPOINTS.length;
    const approvedList = DOCUMENT_CHECKPOINTS.filter(cp => checkpointStates[cp.id] === 'approved');
    const rejectedList = DOCUMENT_CHECKPOINTS.filter(cp => checkpointStates[cp.id] === 'rejected');
    const pendingList = DOCUMENT_CHECKPOINTS.filter(cp => (checkpointStates[cp.id] || 'pending') === 'pending');

    if (pendingList.length > 0) {
      alert(`Proof of Work Incomplete! Please review and either Approve or Reject all ${totalCheckpoints} document checkpoints first.`);
      return;
    }

    // Determine final status
    let finalStatus = VerificationStatus.VERIFIED;
    if (rejectedList.length > 0) {
      const hasCriticalRejection = rejectedList.some(r => r.id === 'national_id' || r.id === 'academic_degree' || r.id === 'police_clearance');
      finalStatus = hasCriticalRejection ? VerificationStatus.REJECTED : VerificationStatus.FLAGGED;
    }

    // Calculate dynamic payouts based on approved checklist items
    const totalPayoutAmountKES = approvedList.reduce((sum, cp) => sum + cp.payoutKES, 0);

    // Compile dynamic findings summary
    const findingsStr = DOCUMENT_CHECKPOINTS.map(cp => {
      const state = checkpointStates[cp.id];
      const typedVal = checkpointInputs[cp.id] || 'N/A';
      const checklistDone = checkpointChecklists[cp.id] || [];
      const rejectReason = checkpointRejectionReasons[cp.id] ? ` [Rejected: ${checkpointRejectionReasons[cp.id]} - ${checkpointRejectionNotes[cp.id] || ''}]` : '';
      return `${cp.name}: ${state?.toUpperCase()}${rejectReason} (Extracted: ${typedVal}, Checks completed: ${checklistDone.length}/${cp.checklist.length})`;
    }).join('; ');

    const computedScore = Math.max(50, Math.floor(100 - (rejectedList.length * 11.1)));

    performAgentVerification({
      candidateId: activeVerificationCandidate.id,
      candidateName: activeVerificationCandidate.name,
      candidateHeadline: activeVerificationCandidate.headline,
      credentialTitle: 'Full Dossier Compliance Stamp',
      category: 'Comprehensive Compliance Audit',
      agentId: 'ag_041',
      agentName: 'Agent Wachira (#AG-041)',
      verificationMethod: 'Multi-Point Primary Source Document Extraction & Review',
      statutoryRegistryChecked: 'KCAA, eCitizen DCI, KNEC, UoN Registrar, KRA',
      registrationNumberChecked: checkpointInputs['national_id'] || 'MULTIPLE_DOCS_VERIFIED',
      checklistCompleted: approvedList.map(cp => cp.name),
      swornNoConflictConfirmed: swornNoConflict,
      findingsSummary: findingsStr,
      authenticityScore: computedScore,
      payoutAmountKES: totalPayoutAmountKES,
      payoutStatus: 'Approved_QA',
      status: finalStatus
    });

    setActiveVerificationCandidate(null);
    setActionFeedback(`Dossier verification finalized for ${activeVerificationCandidate.name}. Final compliance status compiled as [${finalStatus.toUpperCase()}]. Total task-based earnings of KES ${totalPayoutAmountKES.toLocaleString()} registered to Administrative Ledger.`);
    setTimeout(() => setActionFeedback(null), 6000);
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

  const myCompletedAudits = useMemo(() => {
    return agentAudits.filter(a => a.agentId === 'ag_041');
  }, [agentAudits]);

  const totalEarningsKES = useMemo(() => {
    return myCompletedAudits.reduce((acc, a) => acc + a.payoutAmountKES, 0);
  }, [myCompletedAudits]);

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
            <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA Compliance Rate</span>
            <p className="text-2xl font-black text-emerald-400 font-mono">99.8%</p>
            <span className="text-[10px] text-slate-400">Accreditation Active</span>
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
            <Icon name="close" className="h-4 w-4" />
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

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'guidelines'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon name="info" className="h-4 w-4" />
            <span>SOP &amp; Guidelines</span>
          </button>

          <button
            onClick={() => setActiveTab('agentProfile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'agentProfile'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon name="shieldCheck" className="h-4 w-4" />
            <span>Auditor Profile &amp; Accreditation</span>
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
                    {onViewProfile && (
                      <button
                        onClick={() => onViewProfile(inspectingCandidate.id)}
                        className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition-all hover:bg-indigo-100 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Icon name="document" className="h-4 w-4" />
                        <span>Inspect Full Dossier</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenVerifyModal(inspectingCandidate)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="check" className="h-4 w-4" />
                      <span>Review &amp; Verify Claim</span>
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
                      onClick={() => handleOpenVerifyModal(inspectingCandidate)}
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

      {/* TAB 3: SOP & COMPLIANCE GUIDELINES */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Icon name="documentText" className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Statutory Field Auditor Standard Operating Procedures (SOP)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Standards compliant with Kenya Data Protection Act 2019 and VerifiedHire Trust Protocol v4.2.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Icon name="shieldCheck" className="h-4 w-4" />
                  <span>1. Primary Source Direct Lookup Rule</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Never attest to a credential based solely on candidate-uploaded PDF photocopies. Every academic degree, statutory clearance, and aviation rating must be validated against the corresponding authoritative registry (KNEC, KCAA, eCitizen, EBK).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Icon name="lockClosed" className="h-4 w-4" />
                  <span>2. Conflict of Interest Protocol</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Field agents must execute the sworn impartiality accord before accessing candidate folios. If any personal, family, or prior employment relationship exists, immediately click "Declare Conflict &amp; Recuse".
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Icon name="clock" className="h-4 w-4" />
                  <span>3. SLA Turnaround Benchmark (4 Hours)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Standard enterprise requisitions carry a 4-hour SLA deadline from assignment to QA submission. Urgent priority cases must be triaged within 90 minutes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Icon name="checkCircle" className="h-4 w-4" />
                  <span>4. Cryptographic Proof of Work Sealing</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Upon completion of all 9 mandatory document checkpoints, the system computes an ECDSA P-256 digital signature hash inscribed directly into the candidate's Professional Passport.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDITOR PROFILE & ACCREDITATION DOSSIER */}
      {activeTab === 'agentProfile' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Top Identity Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                  alt="Agent Wachira"
                  className="h-20 w-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                />
                <div className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-1 rounded-lg shadow-sm" title="EBK & KCAA Accredited">
                  <Icon name="shieldCheck" className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{agentName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                    <Icon name="checkBadge" className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Statutory Agent License: {agentLicense}</span>
                  </span>
                </div>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{agentAccreditation}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Jurisdiction: {agentJurisdiction}</span>
                  <span>&bull;</span>
                  <span>Compliance SLA: 99.8%</span>
                  <span>&bull;</span>
                  <span>Seal Hash: 0x7F9B...4D81</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setAgentProfileSaved('Auditor credentials and biometric seal synchronized with National Compliance Registry.');
                setTimeout(() => setAgentProfileSaved(null), 3000);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex-shrink-0"
            >
              Save Auditor Profile
            </button>
          </div>

          {agentProfileSaved && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold animate-in fade-in">
              <Icon name="checkCircle" className="h-5 w-5 text-emerald-600" />
              <span>{agentProfileSaved}</span>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Details Form */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon name="user" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Auditor Registration Dossier</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={e => setAgentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">
                      Official Auditor License Number
                    </label>
                    <input
                      type="text"
                      value={agentLicense}
                      onChange={e => setAgentLicense(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      value={agentEmail}
                      onChange={e => setAgentEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">
                      Emergency Operational Hotline
                    </label>
                    <input
                      type="text"
                      value={agentPhone}
                      onChange={e => setAgentPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">
                      Accreditation Authorities &amp; Boards
                    </label>
                    <input
                      type="text"
                      value={agentAccreditation}
                      onChange={e => setAgentAccreditation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">
                      Forensic Audit Specializations
                    </label>
                    <input
                      type="text"
                      value={agentSpecialties}
                      onChange={e => setAgentSpecialties(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">
                      Professional Executive Statement &amp; Auditor Background
                    </label>
                    <textarea
                      rows={3}
                      value={agentBio}
                      onChange={e => setAgentBio(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Accredited Verification Authority Badges */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon name="shieldCheck" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Statutory Authority &amp; Jurisdictional Seal Privileges</span>
                </h3>

                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                        <Icon name="checkBadge" className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Kenya Civil Aviation Authority (KCAA)</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Authorized flight operations licence verification auditor (#KCAA-EXT-41)</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">Active</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                        <Icon name="checkBadge" className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Engineers Board of Kenya (EBK)</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Attestation seal authority for graduate and consulting engineers</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">Active</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                        <Icon name="checkBadge" className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">eCitizen DCI Forensic Police Portal Integration</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Direct biometric reference lookup and certificate validation</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Agent Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Completed Audits</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">142 Cases</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Average SLA Speed</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">2.8 Hours</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Accuracy Verification Rate</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">99.8%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Earned Payouts</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">KES 178,500</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                  <Icon name="shieldCheck" className="h-4 w-4" />
                  <span>Sovereign Cryptographic Key</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Every attestation is signed by your registered hardware token.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-[10px] text-teal-300 break-all border border-slate-800">
                  did:key:z6MkpTHR8VNsBxYAA5neuWTrnpKt
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeVerificationCandidate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 flex-shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Icon name="shieldCheck" className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Accredited Document Verification Workstation</h3>
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded">Proof of Work Mode</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Primary source auditing and forensic verification of professional credentials and identity portfolios.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveVerificationCandidate(null)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              
              {/* Left Sidebar: Document Checkpoints List */}
              <div className="w-80 border-r border-slate-200/80 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 overflow-y-auto p-4 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Candidate Dossier</span>
                  <div className="flex items-center gap-2.5 p-2 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200/40 dark:border-slate-700/60">
                    <img src={activeVerificationCandidate.photoUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate text-xs">{activeVerificationCandidate.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{activeVerificationCandidate.headline}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block pb-1 border-b border-slate-100 dark:border-slate-800">Checkpoints (9)</span>
                  <div className="space-y-1">
                    {DOCUMENT_CHECKPOINTS.map((cp, idx) => {
                      const state = checkpointStates[cp.id] || 'pending';
                      const isActive = activeCheckpointIndex === idx;
                      return (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => {
                            setActiveCheckpointIndex(idx);
                            // Start timer for this index if not set
                            if (checkpointTimers[cp.id] === undefined) {
                              setCheckpointTimers(prev => ({ ...prev, [cp.id]: 15 }));
                            }
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs font-semibold cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                              0{idx + 1}
                            </span>
                            <span className="truncate">{cp.name}</span>
                          </div>
                          
                          {state === 'approved' && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                              <Icon name="checkCircle" className="h-3.5 w-3.5" />
                            </span>
                          )}
                          {state === 'rejected' && (
                            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                              <Icon name="xCircle" className="h-3.5 w-3.5" />
                            </span>
                          )}
                          {state === 'pending' && (
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Final Submit Segment */}
                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                  <button
                    type="button"
                    onClick={() => setActiveCheckpointIndex(9)} // special page for seal
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      activeCheckpointIndex === 9
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon name="checkBadge" className="h-4 w-4" />
                    <span>Sealing Inscription Dashboard</span>
                  </button>
                  <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                    Progress: {Object.keys(checkpointStates).length} of 9 checkpoints finalized.
                  </div>
                </div>
              </div>

              {/* Right Panel: Checkpoint Auditing Workspace */}
              <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto p-6 sm:p-8">
                
                {/* 1. DOCUMENT CHECKPOINT REVIEW PANELS */}
                {activeCheckpointIndex >= 0 && activeCheckpointIndex < 9 && (() => {
                  const cp = DOCUMENT_CHECKPOINTS[activeCheckpointIndex];
                  const timer = checkpointTimers[cp.id] ?? 15;
                  const isLocked = timer > 0;
                  const state = checkpointStates[cp.id] || 'pending';
                  const typedValue = checkpointInputs[cp.id] || '';
                  const hasMatched = typedValue.trim().toLowerCase() === cp.expectedValue.toLowerCase();
                  const currentChecklist = checkpointChecklists[cp.id] || [];
                  const allChecklistItemsChecked = cp.checklist.every(item => currentChecklist.includes(item));
                  
                  // Verification screenshot simulate URL
                  const proofUrl = checkpointProofUrls[cp.id] || '';
                  const hasProof = cp.id === 'police_clearance' ? proofUrl.trim().length > 0 : true;

                  const canApprove = !isLocked && hasMatched && allChecklistItemsChecked && hasProof;

                  return (
                    <div className="space-y-6 animate-in fade-in duration-200 text-xs">
                      
                      {/* Active Checkpoint Banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-mono font-bold rounded">
                              CHECKPOINT 0{activeCheckpointIndex + 1}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{cp.category}</span>
                          </div>
                          <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">{cp.name}</h4>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Commission payout upon seal</span>
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">KES {cp.payoutKES.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* WORKSTATION GRID */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* LEFT COLUMN: SCANNED DOCUMENT VISUAL EVIDENCE PREVIEW */}
                        <div className="lg:col-span-6 space-y-4">
                          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Scanned Document Evidence Photocopy</span>
                          
                          {/* Styled Document Simulator */}
                          <div className="relative border-2 border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-950 p-5 text-slate-200 font-mono text-[10.5px] leading-relaxed select-all shadow-inner overflow-hidden min-h-[280px] flex flex-col justify-between">
                            
                            {/* Document background watermarks & holograms simulation */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center select-none rotate-12">
                              <div className="text-white text-5xl font-black text-center tracking-widest leading-normal">
                                DEVLOOP MORANS<br />SECURITY SYSTEM VERIFIED<br />REPUBLIC OF KENYA
                              </div>
                            </div>

                            {/* Seal hologram corner indicator */}
                            <div className="absolute top-3 right-3 h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 via-teal-400 to-indigo-500 opacity-20 border border-white animate-pulse" />

                            <div className="space-y-3 relative z-10">
                              <div className="pb-2.5 border-b border-slate-800 text-center">
                                <span className="font-bold text-[11px] tracking-wider text-slate-400 block">{cp.mockScanTitle}</span>
                                <span className="text-[9px] text-slate-600 tracking-widest block">MINTED CRYPTOGRAPHIC ORIGINAL RECORD</span>
                              </div>
                              <div className="whitespace-pre-line text-slate-300">
                                {cp.mockScanBody}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-500 relative z-10 font-mono">
                              <span>SECURE CUSTODY SHA-256 SEALS REGISTERED</span>
                              <span>MD5_MATCHED_OK</span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                            <Icon name="info" className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <p className="text-[10.5px] text-slate-500 leading-normal">
                              To prevent accidental approvals, the system matches what you type in real time. Hover and select document texts directly from scan to copy details if needed.
                            </p>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: FORENSIC DATA ENTRY & AUDIT CHECKS */}
                        <div className="lg:col-span-6 space-y-5">
                          
                          {/* 1. TIMED EVIDENCE LOCK SCREEN */}
                          {isLocked ? (
                            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5">
                              <Icon name="loader" className="h-4 w-4 text-amber-500 animate-spin mt-0.5 flex-shrink-0" />
                              <div className="space-y-0.5">
                                <span className="font-bold text-amber-950 dark:text-amber-200">Timed Review Constraint Lock Active</span>
                                <p className="text-[11px] text-amber-950/80 dark:text-amber-300/80">
                                  Forensic auditing rules require deep analysis of this document's watermarks. You must focus on the evidence for another <strong className="font-mono text-xs">{timer}s</strong> before approval actions activate.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
                              <Icon name="checkCircle" className="h-4.5 w-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <div className="space-y-0.5">
                                <span className="font-bold text-emerald-950 dark:text-emerald-200">Timed Review Met</span>
                                <p className="text-[11px] text-emerald-950/80 dark:text-amber-300/80">Minimum evidence focus period cleared (15 seconds elapsed successfully).</p>
                              </div>
                            </div>
                          )}

                          {/* 2. MANDATORY FIELD EXTRACTION */}
                          <div className="space-y-1.5">
                            <label className="block font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                              {cp.fieldName} <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={typedValue}
                                onChange={e => setCheckpointInputs(prev => ({ ...prev, [cp.id]: e.target.value }))}
                                placeholder={cp.placeholder}
                                className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none font-semibold focus:ring-2 focus:ring-indigo-500"
                              />
                              <div className="absolute right-3.5 top-3">
                                {hasMatched ? (
                                  <Icon name="checkCircle" className="h-4 w-4 text-emerald-600" />
                                ) : typedValue.trim().length > 0 ? (
                                  <Icon name="xCircle" className="h-4 w-4 text-rose-500" />
                                ) : (
                                  <Icon name="document" className="h-4 w-4 text-slate-300" />
                                )}
                              </div>
                            </div>
                            
                            {/* Live matching status indicators */}
                            {hasMatched ? (
                              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                                <Icon name="check" className="h-3 w-3" /> Validated: Matches candidate's declared value
                              </p>
                            ) : typedValue.trim().length > 0 ? (
                              <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1">
                                ⚠️ Extracted serial does not match. Expected: <strong className="font-mono">{cp.expectedValue}</strong>
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-400 mt-1">
                                Please type the exact serial/index/number shown on the scanned photocopy.
                              </p>
                            )}
                          </div>

                          {/* 3. EXTERNAL PORTALS AND PROOF ATTACHMENTS (DCI, ETC.) */}
                          {cp.id === 'police_clearance' && (
                            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-2xl space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-indigo-900 dark:text-indigo-300 text-[11px] block">Government Portals Integration (eCitizen / DCI)</span>
                                <a 
                                  href="https://dci.ecitizen.go.ke/verify" 
                                  target="_blank" 
                                  rel="no-referrer" 
                                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                  Open Government Portal <Icon name="share" className="h-3 w-3" />
                                </a>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-normal">
                                Enter eCitizen/DCI verification reference number, or run a query directly and paste the confirmation link to upload your audit log.
                              </p>

                              <div className="space-y-1.5">
                                <label className="block text-[10px] uppercase font-bold text-slate-500">Pasted eCitizen Verification Proof Link / Ref <span className="text-rose-500">*</span></label>
                                <input
                                  type="text"
                                  placeholder="e.g. https://dci.ecitizen.go.ke/verify/PCC-2026-98124"
                                  value={proofUrl}
                                  onChange={e => setCheckpointProofUrls(prev => ({ ...prev, [cp.id]: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-xs focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCheckpointProofUrls(prev => ({ ...prev, [cp.id]: 'https://dci.ecitizen.go.ke/verify/PCC-2026-98124' }));
                                    setCheckpointInputs(prev => ({ ...prev, [cp.id]: 'PCC-2026-98124' }));
                                  }}
                                  className="px-3.5 py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px] hover:bg-indigo-700 transition-colors shadow-xs"
                                >
                                  Simulate eCitizen Portal Query screenshot
                                </button>
                                {proofUrl.length > 0 && (
                                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                    <Icon name="check" className="h-3 w-3" /> screenshot_log_dci.png (MD5 SECURE)
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 4. MICRO-CHECKLIST FOR ACTIVE COMPONENT */}
                          <div className="space-y-1.5">
                            <label className="block font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                              Micro-Checklist Checks ({currentChecklist.length} of {cp.checklist.length} Completed) <span className="text-rose-500">*</span>
                            </label>
                            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                              {cp.checklist.map((item, index) => {
                                const checked = currentChecklist.includes(item);
                                return (
                                  <label key={index} className="flex items-start gap-2.5 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        if (checked) {
                                          setCheckpointChecklists(prev => ({
                                            ...prev,
                                            [cp.id]: (prev[cp.id] || []).filter(i => i !== item)
                                          }));
                                        } else {
                                          setCheckpointChecklists(prev => ({
                                            ...prev,
                                            [cp.id]: [...(prev[cp.id] || []), item]
                                          }));
                                        }
                                      }}
                                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 mt-0.5 cursor-pointer"
                                    />
                                    <span className={`text-[11px] leading-relaxed font-medium ${checked ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                                      {item}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* 5. DECISION CONTROLS */}
                          <div className="pt-2 flex items-center justify-between gap-3">
                            <div className="flex gap-2">
                              {/* Approve Button */}
                              <button
                                type="button"
                                disabled={!canApprove}
                                onClick={() => {
                                  setCheckpointStates(prev => ({ ...prev, [cp.id]: 'approved' }));
                                  // Auto go to next document after a split second
                                  setTimeout(() => {
                                    if (activeCheckpointIndex < 8) {
                                      setActiveCheckpointIndex(prev => prev + 1);
                                      // Start timer for next if not set
                                      const nextId = DOCUMENT_CHECKPOINTS[activeCheckpointIndex + 1].id;
                                      if (checkpointTimers[nextId] === undefined) {
                                        setCheckpointTimers(p => ({ ...p, [nextId]: 15 }));
                                      }
                                    } else {
                                      setActiveCheckpointIndex(9); // final dashboard
                                    }
                                  }, 600);
                                }}
                                className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5 ${
                                  canApprove
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 cursor-pointer'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                <Icon name="checkCircle" className="h-4.5 w-4.5" />
                                <span>Approve Checkpoint</span>
                              </button>

                              {/* Reject Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setCheckpointStates(prev => ({ ...prev, [cp.id]: 'rejected' }));
                                }}
                                className={`px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800 rounded-xl transition-all cursor-pointer ${
                                  state === 'rejected' ? 'ring-2 ring-rose-500 bg-rose-100 dark:bg-rose-950' : ''
                                }`}
                              >
                                <span>Flag Discrepancy</span>
                              </button>
                            </div>

                            <span className="text-[11px] font-mono text-slate-400 font-semibold">
                              Status: <strong className={state === 'approved' ? 'text-emerald-600' : state === 'rejected' ? 'text-rose-600' : 'text-amber-500'}>{state.toUpperCase()}</strong>
                            </span>
                          </div>

                          {/* REJECTION EXTRA FORM */}
                          {state === 'rejected' && (
                            <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 rounded-2xl space-y-3 animate-in slide-in-from-top-2 duration-200">
                              <span className="font-bold text-rose-900 dark:text-rose-300 text-[11px] block">Standardized Rejection Registry</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Rejection Reason</label>
                                  <select
                                    value={checkpointRejectionReasons[cp.id] || 'Blurred Image'}
                                    onChange={e => setCheckpointRejectionReasons(prev => ({ ...prev, [cp.id]: e.target.value }))}
                                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                                  >
                                    <option value="Blurred Image">Blurred Image / Unreadable Scan</option>
                                    <option value="Expired Document">Expired Document Validity</option>
                                    <option value="Serial Number Mismatch">Serial Number / Index Mismatch</option>
                                    <option value="Suspected Fraud">Suspected Fraud / GAN Deepfake</option>
                                    <option value="Incomplete Submissions">Incomplete Submissions Bundle</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Auditor Forensic Notes</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Type mandatory detailed notes..."
                                    value={checkpointRejectionNotes[cp.id] || ''}
                                    onChange={e => setCheckpointRejectionNotes(prev => ({ ...prev, [cp.id]: e.target.value }))}
                                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* WORKSTATION BOTTOM STEP NAV */}
                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky bottom-0">
                        <button
                          type="button"
                          disabled={activeCheckpointIndex === 0}
                          onClick={() => {
                            setActiveCheckpointIndex(prev => prev - 1);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 ${
                            activeCheckpointIndex === 0
                              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer'
                          }`}
                        >
                          <Icon name="arrowLeft" className="h-4 w-4" />
                          <span>Previous Document</span>
                        </button>

                        <div className="text-[11px] text-slate-400 font-semibold font-mono">
                          Document Checkpoint {activeCheckpointIndex + 1} of 9
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (activeCheckpointIndex < 8) {
                              setActiveCheckpointIndex(prev => prev + 1);
                              // Start timer for next if not set
                              const nextId = DOCUMENT_CHECKPOINTS[activeCheckpointIndex + 1].id;
                              if (checkpointTimers[nextId] === undefined) {
                                setCheckpointTimers(p => ({ ...p, [nextId]: 15 }));
                              }
                            } else {
                              setActiveCheckpointIndex(9); // go to final seal page
                            }
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 cursor-pointer"
                        >
                          <span>{activeCheckpointIndex === 8 ? 'Final Seal Dashboard' : 'Next Document'}</span>
                          <Icon name="arrowRight" className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  );
                })()}

                {/* 2. OVERALL SEAL & CERTIFICATION DASHBOARD PAGE */}
                {activeCheckpointIndex === 9 && (() => {
                  const approvedList = DOCUMENT_CHECKPOINTS.filter(cp => checkpointStates[cp.id] === 'approved');
                  const rejectedList = DOCUMENT_CHECKPOINTS.filter(cp => checkpointStates[cp.id] === 'rejected');
                  const pendingList = DOCUMENT_CHECKPOINTS.filter(cp => (checkpointStates[cp.id] || 'pending') === 'pending');
                  
                  const totalCheckpoints = DOCUMENT_CHECKPOINTS.length;
                  const totalPayout = approvedList.reduce((sum, cp) => sum + cp.payoutKES, 0);

                  let finalReportStatus = 'PASSED';
                  if (rejectedList.length > 0) {
                    const hasCritical = rejectedList.some(r => r.id === 'national_id' || r.id === 'academic_degree' || r.id === 'police_clearance');
                    finalReportStatus = hasCritical ? 'FAILED' : 'FLAGGED';
                  }

                  const isAuditReady = pendingList.length === 0 && swornNoConflict && findingsSummary.trim().length >= 20;

                  return (
                    <div className="space-y-6 animate-in fade-in duration-200 text-xs">
                      
                      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">Forensic Inscription &amp; Central Ledger Seal</h4>
                        <p className="text-xs text-slate-500 mt-1">Compile the multi-checkpoint checks, calculate agent payouts, and seal the final candidate report.</p>
                      </div>

                      {/* COMPILATION SUMMARY */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Checkpoint Statuses</span>
                          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                            {approvedList.length} / {totalCheckpoints} Approved
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">{rejectedList.length} flagged discrepancy</span>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated Agent Fee</span>
                          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                            KES {totalPayout.toLocaleString()}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">Commission locked to Admin ledger</span>
                        </div>

                        <div className="p-4 rounded-2xl border text-center flex flex-col justify-center items-center h-full min-h-[90px] font-mono font-black uppercase text-xs tracking-widest border-dashed bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Calculated Compliance</span>
                          <span className={`text-base font-black tracking-widest ${
                            finalReportStatus === 'PASSED' ? 'text-emerald-600 dark:text-emerald-400' :
                            finalReportStatus === 'FLAGGED' ? 'text-amber-500 dark:text-amber-400' :
                            'text-rose-600 dark:text-rose-400'
                          }`}>
                            [{finalReportStatus}]
                          </span>
                        </div>
                      </div>

                      {/* COMPREHENSIVE DOSSIER TABLE CHECK */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                          <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-2.5 text-left">Checkpoint</th>
                              <th className="px-4 py-2.5 text-left">Auditor Input</th>
                              <th className="px-4 py-2.5 text-left">Verification Proof / screenshot Log</th>
                              <th className="px-4 py-2.5 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                            {DOCUMENT_CHECKPOINTS.map((cp, idx) => {
                              const state = checkpointStates[cp.id] || 'pending';
                              const input = checkpointInputs[cp.id] || '';
                              const proof = checkpointProofUrls[cp.id] || '';
                              return (
                                <tr key={cp.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20">
                                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                                    0{idx + 1}. {cp.name}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-[10.5px] text-slate-600 dark:text-slate-400">
                                    {input || '—'}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500 truncate max-w-[200px]">
                                    {proof || (cp.id === 'police_clearance' ? '—' : 'screenshot_query_log.png')}
                                  </td>
                                  <td className="px-4 py-3 text-right font-mono">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      state === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                      state === 'rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                                      'bg-slate-100 text-slate-400'
                                    }`}>
                                      {state.toUpperCase()}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* PENDING NOTIFICATION */}
                      {pendingList.length > 0 && (
                        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-300 flex gap-2.5 items-start">
                          <Icon name="shieldAlert" className="h-5 w-5 text-amber-600 flex-shrink-0" />
                          <div>
                            <p className="font-bold">Proof of Work Incomplete!</p>
                            <p className="text-[11px] leading-normal text-amber-950/80 dark:text-amber-300/80 mt-0.5">
                              You have {pendingList.length} unprocessed document checkpoints. To prevent blind approvals, you must focus on each scanned copy, input the mandatory extracted values, complete micro-checklists, and mark each document as Approved or Rejected before signing.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 1. Sworn Impartiality Declaration */}
                      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-2">
                        <h5 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                          <Icon name="shieldCheck" className="h-4.5 w-4.5 text-amber-600" />
                          <span>Sworn Impartiality &amp; Anti-Bribery Accord</span>
                        </h5>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            required
                            checked={swornNoConflict}
                            onChange={e => setSwornNoConflict(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 mt-0.5 cursor-pointer"
                          />
                          <span className="text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed select-none">
                            I hereby solemnly declare under penalty of direct accreditation revocation and criminal prosecution under Chapter 6 of the Kenyan Constitution that I have <strong>zero personal, familial, supervisory, or commercial conflict of interest</strong> with candidate <strong>{activeVerificationCandidate.name}</strong>, and have conducted a comprehensive and independent primary source audit of all attached folios.
                          </span>
                        </label>
                      </div>

                      {/* 2. Mandatory Findings Summary */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                          Comprehensive Forensic Findings &amp; Inscription Summary <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Type at least 20 characters summarizing your primary source cross-referencing process, phone audits, and statutory database checks..."
                          value={findingsSummary}
                          onChange={e => setFindingsSummary(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-semibold"
                        />
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span>Findings Summary length: {findingsSummary.length} characters (minimum required: 20 characters).</span>
                          {findingsSummary.trim().length >= 20 ? (
                            <span className="text-emerald-600 font-bold">✅ Minimum length constraint met</span>
                          ) : (
                            <span className="text-rose-500 font-bold">❌ Needs {20 - findingsSummary.trim().length} more characters</span>
                          )}
                        </div>
                      </div>

                      {/* SUBMIT BUTTONS */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
                        <button
                          type="button"
                          onClick={() => setActiveCheckpointIndex(0)}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Back to Evidence Workstation
                        </button>
                        <button
                          type="submit"
                          disabled={!isAuditReady}
                          className={`px-6 py-2.5 font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${
                            isAuditReady
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 cursor-pointer'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Icon name="checkBadge" className="h-4.5 w-4.5" />
                          <span>Seal &amp; Inscribe Compliance Certificate</span>
                        </button>
                      </div>

                    </div>
                  );
                })()}

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
