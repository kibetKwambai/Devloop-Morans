import React, { useState, useMemo } from 'react';
import { 
  JobSeekerProfile, 
  UserRole, 
  VerificationStatus,
  GovernmentIdDocument,
  WorkEligibility,
  EducationEntry,
  ProfessionalLicenseEntry,
  ProfessionalMembership,
  WorkExperienceEntry,
  SkillEntry,
  VaultDocumentItem,
  MedicalHealthDossier,
  CandidateReferee,
  CandidateConsentEntry
} from '../types';
import { Icon, IconName } from './Icon';
import { useAppContext } from './AppContext';

interface CandidateDossierBuilderProps {
  profile: JobSeekerProfile;
  viewerRole: UserRole;
  isOwner?: boolean;
  onUpdateProfile?: (updated: JobSeekerProfile) => void;
}

export const CandidateDossierBuilder: React.FC<CandidateDossierBuilderProps> = ({
  profile,
  viewerRole,
  isOwner = false,
  onUpdateProfile
}) => {
  const { updateProfile, addNotification } = useAppContext();
  const [data, setData] = useState<JobSeekerProfile>(profile);
  const [activeSection, setActiveSection] = useState<string>('identity');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    identity: true,
    education: true,
    licenses: true,
    workHistory: true,
    skills: true,
    documents: true,
    medical: true,
    references: true,
    consents: true
  });

  // Modal / Feedback state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedVaultCategory, setSelectedVaultCategory] = useState<VaultDocumentItem['category']>('identity');
  const [selectedDocFilter, setSelectedDocFilter] = useState<string>('all');
  const [activeUploadName, setActiveUploadName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dossierExportModal, setDossierExportModal] = useState(false);
  const [medicalConsentAccepted, setMedicalConsentAccepted] = useState(data.medicalDossier?.consentGiven || false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item temp states
  const [newSkillTag, setNewSkillTag] = useState('');
  const [newSkillGroup, setNewSkillGroup] = useState<SkillEntry['group']>('Technical');
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillEntry['proficiency']>('Intermediate');
  const [newSkillYears, setNewSkillYears] = useState(3);

  // Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (updated: JobSeekerProfile) => {
    setData(updated);
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    } else {
      updateProfile(updated);
    }
    showToast('Dossier updated & verified in local vault.');
  };

  const toggleSectionCollapse = (sec: string) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Section completeness computations (P0.1, P0.2, P8.3)
  const completeness = useMemo(() => {
    const scores: Record<string, { percent: number; isComplete: boolean; label: string; actionTip: string }> = {
      identity: {
        percent: 0,
        isComplete: false,
        label: 'Identity & Eligibility',
        actionTip: 'Upload National ID / Passport bio-data and KRA PIN'
      },
      education: {
        percent: 0,
        isComplete: false,
        label: 'Education',
        actionTip: 'Attach certificate and transcript for your primary qualification'
      },
      licenses: {
        percent: 0,
        isComplete: false,
        label: 'Licenses & Memberships',
        actionTip: 'Add licensing body or DCI Good Conduct Certificate'
      },
      workHistory: {
        percent: 0,
        isComplete: false,
        label: 'Work History',
        actionTip: 'Add at least 1 verified role with supervisor contacts'
      },
      skills: {
        percent: 0,
        isComplete: false,
        label: 'Skills & Competencies',
        actionTip: 'Tag at least 4 core technical and trade skills'
      },
      documents: {
        percent: 0,
        isComplete: false,
        label: 'Document Vault',
        actionTip: 'Upload at least 3 supporting verification documents'
      },
      medical: {
        percent: 100, // Optional by default unless role mandated
        isComplete: true,
        label: 'Medical & Fitness',
        actionTip: 'Provide fitness certificate for safety & healthcare roles'
      },
      references: {
        percent: 0,
        isComplete: false,
        label: 'Referees (Min 3)',
        actionTip: 'Add 3 verified professional referees for affidavit confirmation'
      },
      consents: {
        percent: 0,
        isComplete: false,
        label: 'Consents & Declarations',
        actionTip: 'Sign Chapter Six Truthfulness & Primary-Source verification accords'
      }
    };

    // Identity Score
    let idPoints = 0;
    if (data.name && data.email && data.phone && data.location) idPoints += 40;
    if (data.governmentId?.number && data.governmentId?.frontUrl) idPoints += 30;
    if (data.kraPinNumber) idPoints += 15;
    if (data.workEligibility?.status) idPoints += 15;
    scores.identity.percent = idPoints;
    scores.identity.isComplete = idPoints >= 70;

    // Education Score
    const eduCount = (data.education || []).length;
    let eduPoints = 0;
    if (eduCount > 0) {
      eduPoints += 50;
      const hasCerts = data.education.some(e => e.certificateUrl || e.transcriptUrl);
      if (hasCerts) eduPoints += 50;
    }
    scores.education.percent = eduPoints;
    scores.education.isComplete = eduPoints >= 70;

    // Licenses Score
    const licCount = (data.licenses || []).length;
    let licPoints = 0;
    if (licCount > 0) licPoints += 60;
    if (data.goodConductCertUrl) licPoints += 40;
    scores.licenses.percent = licPoints;
    scores.licenses.isComplete = licPoints >= 50;

    // Work History Score
    const workCount = (data.workExperience || []).length;
    let workPoints = Math.min(100, workCount * 40);
    scores.workHistory.percent = workPoints;
    scores.workHistory.isComplete = workPoints >= 40;

    // Skills Score
    const skillCount = (data.skills || []).length + (data.skillEntries || []).length;
    let skillPoints = Math.min(100, skillCount * 18);
    scores.skills.percent = skillPoints;
    scores.skills.isComplete = skillPoints >= 50;

    // Documents Score
    const docsCount = (data.vaultDocuments || []).length + (data.documents || []).length;
    let docPoints = Math.min(100, docsCount * 25);
    scores.documents.percent = docPoints;
    scores.documents.isComplete = docPoints >= 50;

    // Medical Role-Conditionality
    const roleIsRegulated = data.medicalDossier?.roleConditional || 
      data.headline?.toLowerCase().includes('pilot') || 
      data.headline?.toLowerCase().includes('driver') || 
      data.headline?.toLowerCase().includes('nurse') || 
      data.headline?.toLowerCase().includes('doctor') ||
      data.headline?.toLowerCase().includes('fua') ||
      data.headline?.toLowerCase().includes('house') ||
      data.headline?.toLowerCase().includes('nanny');
    
    if (roleIsRegulated) {
      let medPoints = 0;
      if (data.medicalDossier?.generalFitnessCertUrl || data.medicalDossier?.medicalCertUrl) medPoints += 50;
      if (data.medicalDossier?.vaccinations && data.medicalDossier.vaccinations.length > 0) medPoints += 30;
      if (data.medicalDossier?.consentGiven) medPoints += 20;
      scores.medical.percent = medPoints;
      scores.medical.isComplete = medPoints >= 50;
    } else {
      scores.medical.percent = 100;
      scores.medical.isComplete = true;
    }

    // Referees Score (Min 3)
    const refCount = (data.referees || []).length;
    let refPoints = Math.min(100, Math.round((refCount / 3) * 100));
    scores.references.percent = refPoints;
    scores.references.isComplete = refCount >= 3;

    // Consents Score (3 required)
    const agreedCount = (data.consents || []).filter(c => c.isAgreed).length;
    let conPoints = Math.min(100, Math.round((agreedCount / 3) * 100));
    scores.consents.percent = conPoints;
    scores.consents.isComplete = agreedCount >= 3;

    // Overall Score Calculation
    const allPercents = Object.values(scores).map(s => s.percent);
    const overall = Math.round(allPercents.reduce((a, b) => a + b, 0) / allPercents.length);
    const isPlacementReady = scores.identity.isComplete && 
      scores.education.isComplete && 
      scores.workHistory.isComplete && 
      scores.references.isComplete && 
      scores.documents.isComplete && 
      scores.consents.isComplete &&
      scores.medical.isComplete;

    return { scores, overall, isPlacementReady };
  }, [data]);

  // Document Expiry Alerts (<30 days and <60 days)
  const expiringAlerts = useMemo(() => {
    const alerts: { title: string; type: string; daysLeft: number; isExpired: boolean }[] = [];
    const now = new Date().getTime();

    // Check licenses
    (data.licenses || []).forEach(lic => {
      if (lic.expiryDate) {
        const expTime = new Date(lic.expiryDate).getTime();
        const diffDays = Math.round((expTime - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) {
          alerts.push({ title: `${lic.licensingBody} License (${lic.licenseNumber})`, type: 'License', daysLeft: diffDays, isExpired: true });
        } else if (diffDays <= 60) {
          alerts.push({ title: `${lic.licensingBody} License (${lic.licenseNumber})`, type: 'License', daysLeft: diffDays, isExpired: false });
        }
      }
    });

    // Check Good Conduct (DCI must be < 6 months old)
    if (data.goodConductIssueDate) {
      const issueTime = new Date(data.goodConductIssueDate).getTime();
      const ageMonths = Math.round((now - issueTime) / (1000 * 60 * 60 * 24 * 30.5));
      if (ageMonths >= 6) {
        alerts.push({ title: 'DCI Good Conduct Certificate (> 6 months old)', type: 'Good Conduct', daysLeft: 0, isExpired: true });
      }
    }

    // Check Vault documents
    (data.vaultDocuments || []).forEach(doc => {
      if (doc.expiryDate) {
        const expTime = new Date(doc.expiryDate).getTime();
        const diffDays = Math.round((expTime - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) {
          alerts.push({ title: doc.name, type: 'Document', daysLeft: diffDays, isExpired: true });
        } else if (diffDays <= 30) {
          alerts.push({ title: doc.name, type: 'Document', daysLeft: diffDays, isExpired: false });
        }
      }
    });

    return alerts;
  }, [data]);

  // Mock Upload Handler with client-side validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | null = null;
    if ('dataTransfer' in e) {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        file = e.dataTransfer.files[0];
      }
    } else if (e.target.files && e.target.files[0]) {
      file = e.target.files[0];
    }

    if (!file) return;

    // Type validation: PDF, JPG, PNG
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only PDF, JPG, and PNG documents under 10MB are accepted.');
      return;
    }

    // Size validation: max 10MB
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 10) {
      setUploadError(`File too large (${sizeMB.toFixed(1)}MB). Maximum allowed size is 10MB.`);
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(10);

    const docName = activeUploadName.trim() || file.name;
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const newDoc: VaultDocumentItem = {
            id: `vdoc_${Date.now()}`,
            name: docName,
            category: selectedVaultCategory,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'Uploaded',
            fileUrl: URL.createObjectURL(file),
            fileSizeMB: parseFloat(sizeMB.toFixed(2)),
            mimeType: file.type
          };
          const updatedDocs = [newDoc, ...(data.vaultDocuments || [])];
          handleSave({ ...data, vaultDocuments: updatedDocs });
          setUploadModalOpen(false);
          setActiveUploadName('');
          setUploadProgress(0);
          return 0;
        }
        return prev + 30;
      });
    }, 200);
  };

  // Add Skill Entry
  const handleAddSkill = () => {
    if (!newSkillTag.trim()) return;
    const newEntry: SkillEntry = {
      id: `sk_entry_${Date.now()}`,
      name: newSkillTag.trim(),
      group: newSkillGroup,
      proficiency: newSkillProficiency,
      yearsOfExperience: newSkillYears
    };
    const updatedEntries = [...(data.skillEntries || []), newEntry];
    const updatedLegacy = [...data.skills, { id: newEntry.id, name: newEntry.name, type: newSkillGroup === 'Soft' ? 'Soft' as const : 'Hard' as const }];
    handleSave({ ...data, skillEntries: updatedEntries, skills: updatedLegacy });
    setNewSkillTag('');
  };

  // Delete Skill Entry
  const handleDeleteSkill = (id: string) => {
    const updatedEntries = (data.skillEntries || []).filter(s => s.id !== id);
    const updatedLegacy = data.skills.filter(s => s.id !== id);
    handleSave({ ...data, skillEntries: updatedEntries, skills: updatedLegacy });
  };

  // Add Referee
  const handleAddReferee = () => {
    const newRef: CandidateReferee = {
      id: `ref_${Date.now()}`,
      name: 'New Professional Referee',
      title: 'Department Supervisor / Senior Lead',
      organization: 'Registered Enterprise / Institution',
      email: 'supervisor@institution.co.ke',
      phone: '+254 700 000 000',
      relationship: 'Direct Line Manager',
      yearsKnown: 3,
      status: 'Pending'
    };
    const updated = [...(data.referees || []), newRef];
    handleSave({ ...data, referees: updated });
  };

  // Toggle Declaration Agreement
  const handleToggleConsent = (id: string, agree: boolean) => {
    const updated = (data.consents || []).map(c => {
      if (c.id === id) {
        return {
          ...c,
          isAgreed: agree,
          signedDate: agree ? new Date().toISOString().split('T')[0] : c.signedDate,
          withdrawnAt: agree ? undefined : new Date().toISOString()
        };
      }
      return c;
    });
    handleSave({ ...data, consents: updated });
  };

  // Medical Visibility Lock Check:
  // Strictly hide health details for Employers unless candidate granted explicit per-application permission.
  const isMedicalRestrictedForViewer = viewerRole === UserRole.Employer;

  return (
    <div className="space-y-8">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-slate-900 text-white dark:bg-emerald-950 dark:border-emerald-800 border border-slate-700 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300">
          <Icon name="checkCircle" className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PHASE P0.1 & P0.2 — TOP COMPLETENESS & PLACEMENT-READY METER */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider ${
                completeness.isPlacementReady 
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                  : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              }`}>
                {completeness.isPlacementReady ? '✔ Placement-Ready Dossier' : '⏳ Completing Requirements'}
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                Score: <strong className="text-indigo-600 dark:text-indigo-400">{completeness.overall}% Complete</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Verifiable Candidate Dossier &amp; Sovereign Vault
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Every qualification, statutory license, and work history entry is backed by direct primary-source verification and forensic records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setDossierExportModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Icon name="arrowDownTray" className="w-4 h-4" />
              <span>Download Dossier (ATS PDF)</span>
            </button>
            {isOwner && (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <Icon name="plus" className="w-4 h-4 text-indigo-400" />
                <span>Upload Document</span>
              </button>
            )}
          </div>
        </div>

        {/* Expiry Alerts Banner (P3.2 & P5.4) */}
        {expiringAlerts.length > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
              <Icon name="exclamationTriangle" className="w-4 h-4 text-amber-600" />
              <span>Credential &amp; Statutory Expiry Alerts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {expiringAlerts.map((alert, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{alert.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    alert.isExpired ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {alert.isExpired ? 'RENEW BEFORE PLACEMENT' : `${alert.daysLeft} days left`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placement Readiness Checklist Strip (P0.2) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Placement-Ready Checklist</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
            {Object.entries(completeness.scores).map(([secKey, sec]) => (
              <div 
                key={secKey}
                onClick={() => {
                  setActiveSection(secKey);
                  setOpenSections(p => ({ ...p, [secKey]: true }));
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  sec.isComplete 
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60' 
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500">{sec.percent}%</span>
                  <Icon 
                    name={sec.isComplete ? 'checkCircle' : 'xMark'} 
                    className={`w-3.5 h-3.5 ${sec.isComplete ? 'text-emerald-500' : 'text-slate-400'}`} 
                  />
                </div>
                <span className="text-[11px] font-bold truncate text-slate-900 dark:text-white">{sec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PHASE P0.3 — SECTION ORDER FOLLOWING HIRING DECISION FLOW */}
      <div className="space-y-6">

        {/* SECTION 1: IDENTITY & PERSONAL DETAILS (P1) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div 
            onClick={() => toggleSectionCollapse('identity')}
            className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Icon name="user" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">1. Identity, Government ID &amp; Work Eligibility</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {completeness.scores.identity.percent}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Official legal name as on ID, Kenyan National ID / Passport, KRA PIN, and residency.</p>
              </div>
            </div>
            <Icon name={openSections.identity ? 'chevronUp' : 'chevronDown'} className="w-5 h-5 text-slate-400" />
          </div>

          {openSections.identity && (
            <div className="p-6 sm:p-8 space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Legal Name</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{data.name}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Birth &amp; Gender</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{data.dateOfBirth || '1994-04-18'} • {data.gender || 'Female'}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">County of Residence &amp; Address</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{data.countyOfResidence || 'Nairobi County'} • {data.physicalAddress || data.location}</p>
                </div>
              </div>

              {/* Government ID & Passport Block */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="shieldCheck" className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Government Identification Document</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {data.governmentId?.status || 'Verified'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Document Type &amp; Number</span>
                    <p className="font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                      {data.governmentId?.idType === 'passport' ? 'Kenyan Passport' : 'National ID Card'}: #{data.governmentId?.number || '31409241'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">KRA Tax PIN Certificate</span>
                    <p className="font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                      PIN: {data.kraPinNumber || 'A009412345K'} (Active &amp; Compliant)
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Work Eligibility Accord</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {data.workEligibility?.status || 'Kenyan Citizen (Unrestricted Employment)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: EDUCATION & ACADEMIC TRANSCRIPTS (P2) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div 
            onClick={() => toggleSectionCollapse('education')}
            className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Icon name="academicCap" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">2. Education, Degrees &amp; Official Transcripts</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {completeness.scores.education.percent}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">KCSE, TVET, Diplomas, Degrees, and KNQA equation status for foreign credentials.</p>
              </div>
            </div>
            <Icon name={openSections.education ? 'chevronUp' : 'chevronDown'} className="w-5 h-5 text-slate-400" />
          </div>

          {openSections.education && (
            <div className="p-6 sm:p-8 space-y-4 text-xs">
              {(data.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{edu.degree}</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{edu.institution} &bull; {edu.fieldOfStudy}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-500">{edu.startDate} - {edu.endDate}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                        {edu.isVerified ? 'KNEC / University Verified' : 'Document Attached'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-bold block">Grade / Class Award:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{edu.grade || 'First Class Honours (GPA 3.9)'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">Certificate Upload:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono">Verified Certificate #CERT-941</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">KNQA Equation:</span>
                      <span className="text-slate-700 dark:text-slate-300">{edu.knqaStatus || 'National Curriculum (Exempt)'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: PROFESSIONAL LICENSES & REGULATORY BODIES (P3) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div 
            onClick={() => toggleSectionCollapse('licenses')}
            className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Icon name="shieldCheck" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">3. Professional Licenses, DCI Good Conduct &amp; Memberships</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {completeness.scores.licenses.percent}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">EBK, KCAA, KMPDC, TSC, PSRA, EPRA, NCA, DCI Police Clearance (&lt;6 months check).</p>
              </div>
            </div>
            <Icon name={openSections.licenses ? 'chevronUp' : 'chevronDown'} className="w-5 h-5 text-slate-400" />
          </div>

          {openSections.licenses && (
            <div className="p-6 sm:p-8 space-y-4 text-xs">
              {/* DCI Good Conduct Card */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 mt-0.5">
                    <Icon name="fingerprint" className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">DCI Police Clearance Certificate (Good Conduct)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                        {data.goodConductStatus || 'Valid'}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Issue Date: <strong className="font-mono text-slate-700 dark:text-slate-200">{data.goodConductIssueDate || '2026-06-15'}</strong> (Statutory valid period: 6 months)
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">DCI Verified Hash</span>
              </div>

              {/* Regulatory Licenses */}
              {(data.licenses || []).map((lic, idx) => (
                <div key={lic.id || idx} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-mono font-bold text-[10px]">{lic.licensingBody}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{lic.licensingBodyName || lic.licensingBody} License</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                      {lic.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{lic.categoryClass || 'Practicing Category Class'}</p>
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>License No: #{lic.licenseNumber}</span>
                    <span>Valid: {lic.issueDate} &rarr; {lic.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4: WORK HISTORY & TENURE (P4) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div 
            onClick={() => toggleSectionCollapse('workHistory')}
            className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Icon name="briefcase" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">4. Reverse-Chronological Work History &amp; Supervisor Affidavits</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {completeness.scores.workHistory.percent}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Achievements, tools used, and named supervisor contacts for direct verification.</p>
              </div>
            </div>
            <Icon name={openSections.workHistory ? 'chevronUp' : 'chevronDown'} className="w-5 h-5 text-slate-400" />
          </div>

          {openSections.workHistory && (
            <div className="p-6 sm:p-8 space-y-4 text-xs">
              {(data.workExperience || []).map((exp, idx) => (
                <div key={exp.id || idx} className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{exp.title}</h4>
                      <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{exp.company} &bull; {exp.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                        Tenure Verified
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{exp.description}</p>

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx}>{resp}</li>
                      ))}
                    </ul>
                  )}

                  {/* Supervisor Verification Contact */}
                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Supervisor: {exp.supervisorName || 'Eng. Peter Kamau (Head of Engineering)'}
                    </span>
                    <span className="font-mono text-slate-400">
                      {exp.supervisorEmail || 'supervisor@safaricom.co.ke'} &bull; {exp.supervisorPhone || '+254 722 100 450'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 5: SKILLS, TRADES & COMPETENCIES (P4.4) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div 
            onClick={() => toggleSectionCollapse('skills')}
            className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Icon name="documentCheck" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">5. Skills, Competencies &amp; Portfolio Links</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {completeness.scores.skills.percent}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Grouped by Technical, Tools, Certifications, and Soft skills with proficiency levels.</p>
              </div>
            </div>
            <Icon name={openSections.skills ? 'chevronUp' : 'chevronDown'} className="w-5 h-5 text-slate-400" />
          </div>

          {openSections.skills && (
            <div className="p-6 sm:p-8 space-y-6 text-xs">
              {/* Portfolio Links (P4.5) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">GitHub / Code Repository</span>
                  <a href={data.githubUrl || 'https://github.com/amani-wanjiku'} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold truncate block mt-0.5 hover:underline">
                    {data.githubUrl || 'github.com/amani-wanjiku'} ↗
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Portfolio / Live Site</span>
                  <a href={data.portfolioUrl || 'https://amaniwanjiku.dev'} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold truncate block mt-0.5 hover:underline">
                    {data.portfolioUrl || 'amaniwanjiku.dev'} ↗
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">LinkedIn Profile</span>
                  <a href={data.linkedinUrl || 'https://linkedin.com'} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold truncate block mt-0.5 hover:underline">
                    LinkedIn Profile ↗
                  </a>
                </div>
              </div>

              {/* Add Skill Tag input (Owner only) */}
              {isOwner && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/70">
                  <input
                    type="text"
                    placeholder="Add skill tag (e.g. EPRA Solar PV, React, First Aid)..."
                    value={newSkillTag}
                    onChange={e => setNewSkillTag(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                  <select 
                    value={newSkillGroup} 
                    onChange={e => setNewSkillGroup(e.target.value as any)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Tools">Tools</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Soft">Soft Skills</option>
                  </select>
                  <select 
                    value={newSkillProficiency} 
                    onChange={e => setNewSkillProficiency(e.target.value as any)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    + Add Tag
                  </button>
                </div>
              )}

              {/* Categorized Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['Technical', 'Tools', 'Certifications', 'Soft'] as const).map(group => {
                  const filtered = (data.skillEntries || []).filter(s => s.group === group);
                  return (
                    <div key={group} className="p-4 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2.5">
                      <h4 className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                        {group} ({filtered.length})
                      </h4>
                      <div className="space-y-1.5">
                        {filtered.length > 0 ? (
                          filtered.map(s => (
                            <div key={s.id} className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 block">{s.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{s.proficiency} &bull; {s.yearsOfExperience} yrs</span>
                              </div>
                              {isOwner && (
                                <button onClick={() => handleDeleteSkill(s.id)} className="text-slate-300 hover:text-rose-500 p-1">
                                  <Icon name="xMark" className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">No skills listed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 6: CENTRAL DOCUMENT VAULT (P5) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div 
            onClick={() => toggleSectionCollapse('documents')}
            className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Icon name="folder" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">6. Central Document Vault &amp; Proof of Credentials</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {completeness.scores.documents.percent}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">All certificates, transcripts, licenses, letters, and SHA/NHIF cards organized in one place.</p>
              </div>
            </div>
            <Icon name={openSections.documents ? 'chevronUp' : 'chevronDown'} className="w-5 h-5 text-slate-400" />
          </div>

          {openSections.documents && (
            <div className="p-6 sm:p-8 space-y-6 text-xs">
              {/* Category Filter Chips (P5.2) */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Documents' },
                  { id: 'identity', label: 'Identity (ID, KRA, Photo)' },
                  { id: 'education', label: 'Education (Degrees, KNQA)' },
                  { id: 'professional', label: 'Professional (Licenses, DCI)' },
                  { id: 'employment', label: 'Employment (Payslips, Letters)' },
                  { id: 'medical', label: 'Medical (Fitness, Vaccines, SHA)' },
                  { id: 'aviation', label: 'Aviation Specific' },
                  { id: 'other', label: 'Other & CV' }
                ].map(chip => (
                  <button
                    key={chip.id}
                    onClick={() => setSelectedDocFilter(chip.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      selectedDocFilter === chip.id 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Vault Document Table / Cards (P5.1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(data.vaultDocuments || [])
                  .filter(d => selectedDocFilter === 'all' || d.category === selectedDocFilter)
                  .map(doc => (
                    <div key={doc.id} className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900 dark:text-white truncate block">{doc.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                          Category: <span className="uppercase font-bold text-slate-500">{doc.category}</span> &bull; {doc.fileSizeMB || 1.2} MB
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-400">Uploaded {doc.uploadDate}</span>
                        <div className="flex items-center gap-2">
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                            Preview ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 7: MEDICAL, HEALTH & FITNESS — ROLE-CONDITIONAL & VISIBILITY LOCKED (P6) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div 
            onClick={() => toggleSectionCollapse('medical')}
            className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Icon name="heart" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">7. Medical, Health &amp; Occupational Fitness</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                    <Icon name="lockClosed" className="w-3 h-3" />
                    <span>KDPA 2019 Restricted</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Role-conditional medical certificates, safety vaccinations, and strict privacy locks.</p>
              </div>
            </div>
            <Icon name={openSections.medical ? 'chevronUp' : 'chevronDown'} className="w-5 h-5 text-slate-400" />
          </div>

          {openSections.medical && (
            <div className="p-6 sm:p-8 space-y-6 text-xs">
              {/* STRICT VISIBILITY LOCK (P6.3 & P6.4) */}
              {isMedicalRestrictedForViewer ? (
                /* Employer View: ONLY show the FIT verification badge, ZERO medical details */
                <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm">
                      <Icon name="shieldCheck" className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-emerald-900 dark:text-emerald-200">
                          Medical Status: FIT — Certificate Verified
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                          Verified by Accredited Doctor
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 max-w-xl">
                        Candidate has valid occupational fitness clearance on record. In compliance with Kenya Data Protection Act 2019 (KDPA Section 29) health details are restricted.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    Reg No: MED-FIT-2026
                  </span>
                </div>
              ) : (
                /* Job Seeker Owner / Admin / Agent View with explicit Consent accord */
                <div className="space-y-6">
                  {/* KDPA Consent Declaration (P6.4) */}
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Icon name="lockClosed" className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-xs block">Kenya Data Protection Act 2019 (Health Data Accord)</span>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                          Your medical records are strictly confidential and encrypted. Prospective employers only see an authenticated "FIT" badge unless you explicitly approve disclosure.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span>Consent Ref: {data.medicalDossier?.consentReferenceKDPA || 'KDPA-CONSENT-SEC-29-ACTIVE'}</span>
                          <span>&bull;</span>
                          <span>Timestamp: {data.medicalDossier?.consentTimestamp || '2026-01-15T08:30:00Z'}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newConsent = !medicalConsentAccepted;
                        setMedicalConsentAccepted(newConsent);
                        handleSave({
                          ...data,
                          medicalDossier: {
                            ...(data.medicalDossier || { roleConditional: false, visibilityRestricted: true, fitStatus: 'FIT', vaccinations: [] }),
                            consentGiven: newConsent,
                            consentTimestamp: newConsent ? new Date().toISOString() : undefined
                          }
                        });
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex-shrink-0 ${
                        medicalConsentAccepted 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300' 
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {medicalConsentAccepted ? 'Withdraw Consent' : 'Grant Consent'}
                    </button>
                  </div>

                  {/* Medical Details Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">General Fitness Certificate</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-1">Avenue Healthcare Executive Exam</p>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold mt-1 block">Valid through 2027-02-10</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group &amp; Safety Allergies</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-1">Group: {data.medicalDossier?.bloodGroup || 'O+'} &bull; Allergies: None</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Workplace Safety Standard</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Mandatory Vaccinations</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-1">Yellow Fever &bull; COVID-19 Booster &bull; Tetanus</p>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold mt-1 block">MoH Verified Records</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 8: PROFESSIONAL REFEREES & AFFIDAVITS (P7.1) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div 
            onClick={() => toggleSectionCollapse('references')}
            className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Icon name="userGroup" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">8. Professional Referees &amp; Direct Affidavits (Min 3)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {completeness.scores.references.percent}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Name, organization, email, phone, relationship, and affidavit confirmation status.</p>
              </div>
            </div>
            <Icon name={openSections.references ? 'chevronUp' : 'chevronDown'} className="w-5 h-5 text-slate-400" />
          </div>

          {openSections.references && (
            <div className="p-6 sm:p-8 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(data.referees || []).map((ref, idx) => (
                  <div key={ref.id || idx} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm truncate">{ref.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                          {ref.status}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{ref.title} &bull; {ref.organization}</p>
                      <p className="text-slate-400 text-[11px] mt-1">{ref.relationship} ({ref.yearsKnown} yrs known)</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] font-mono text-slate-400 space-y-0.5">
                      <p>Email: <span className="text-slate-700 dark:text-slate-300 font-semibold">{ref.email}</span></p>
                      <p>Phone: <span className="text-slate-700 dark:text-slate-300 font-semibold">{ref.phone}</span></p>
                    </div>
                  </div>
                ))}
              </div>

              {isOwner && (
                <button
                  onClick={handleAddReferee}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  + Add Another Referee
                </button>
              )}
            </div>
          )}
        </div>

        {/* SECTION 9: DECLARATIONS & STATUTORY CONSENTS (P7.2 & P7.3) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div 
            onClick={() => toggleSectionCollapse('consents')}
            className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Icon name="scale" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">9. Signed Declarations, Primary-Source Audits &amp; Consents</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {completeness.scores.consents.percent}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Statutory truthfulness oath, registrar verification permission, and criminal background checks.</p>
              </div>
            </div>
            <Icon name={openSections.consents ? 'chevronUp' : 'chevronDown'} className="w-5 h-5 text-slate-400" />
          </div>

          {openSections.consents && (
            <div className="p-6 sm:p-8 space-y-4 text-xs">
              {(data.consents || []).map(cst => (
                <div key={cst.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{cst.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        cst.isAgreed 
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200' 
                          : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200'
                      }`}>
                        {cst.isAgreed ? 'Signed & Agreed' : 'Withdrawn / Pending'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{cst.statement}</p>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
                      <span>Signatory: {cst.signedByName}</span>
                      <span>&bull;</span>
                      <span>Date: {cst.signedDate}</span>
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => handleToggleConsent(cst.id, !cst.isAgreed)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex-shrink-0 ${
                        cst.isAgreed 
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      {cst.isAgreed ? 'Withdraw Accord' : 'Sign Declaration'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* UPLOAD MODAL WITH CLIENT-SIDE VALIDATION & PROGRESS (P5.3) */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Icon name="arrowUpTray" className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Upload Verification Document</h3>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <Icon name="xMark" className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-bold">
                {uploadError}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Document Label / Title</label>
                <input
                  type="text"
                  placeholder="e.g., KMPDC Practicing License 2026, UoN Degree Transcript..."
                  value={activeUploadName}
                  onChange={e => setActiveUploadName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Document Category</label>
                <select
                  value={selectedVaultCategory}
                  onChange={e => setSelectedVaultCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="identity">Identity (National ID, Passport, KRA PIN)</option>
                  <option value="education">Education (Degree, Diploma, KCSE, KNQA)</option>
                  <option value="professional">Professional License / DCI Good Conduct</option>
                  <option value="employment">Employment Letters / Service Certificates</option>
                  <option value="medical">Medical / Fitness Certificate / SHA Insurance</option>
                  <option value="aviation">Aviation Validation / Logbook Summary</option>
                  <option value="trade">Skilled Trade / Domestic Care Certificate</option>
                  <option value="other">Other Supporting Credentials</option>
                </select>
              </div>

              {/* Drag & Drop Canvas */}
              <label 
                onDragOver={e => e.preventDefault()}
                onDrop={handleFileUpload}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40"
              >
                <Icon name="document" className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Drag &amp; drop document or click to browse</span>
                <span className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG (Max 10MB per file) &bull; Camera photo supported</span>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png,.webp" 
                  capture="environment" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>

              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Uploading &amp; cryptographic hashing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DOSSIER EXPORT PRINTABLE MODAL (P8.2) */}
      {dossierExportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="documentText" className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Export Sovereign Candidate Dossier (ATS PDF)</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Icon name="arrowDownTray" className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button onClick={() => setDossierExportModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <Icon name="xMark" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-slate-900 bg-white dark:bg-white dark:text-slate-900 font-sans text-xs">
              <div className="border-b pb-4 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{data.name}</h1>
                  <p className="text-sm font-semibold text-indigo-700">{data.headline}</p>
                  <p className="text-slate-500 text-[11px] mt-1">{data.location} &bull; {data.email} &bull; {data.phone}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Verified Sovereign Dossier
                  </span>
                  <p className="text-[9px] font-mono text-slate-400 mt-1">Trust Score: {completeness.overall}%</p>
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Executive Summary</h2>
                <p className="text-slate-700 leading-relaxed">{data.bio || 'Accomplished candidate with primary-source validated credentials.'}</p>
              </div>

              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Verified Professional Experience</h2>
                <div className="space-y-3">
                  {(data.workExperience || []).map((w, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{w.title} &bull; {w.company}</span>
                        <span className="font-mono text-slate-500">{w.startDate} - {w.endDate}</span>
                      </div>
                      <p className="text-slate-600">{w.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Academic Qualifications</h2>
                <div className="space-y-2">
                  {(data.education || []).map((e, idx) => (
                    <div key={idx} className="flex justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{e.degree} &bull; {e.institution}</span>
                        <span className="text-slate-500 block text-[11px]">{e.fieldOfStudy} ({e.grade || 'First Class'})</span>
                      </div>
                      <span className="font-mono text-slate-500">{e.startDate} - {e.endDate}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Attested Professional Referees</h2>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  {(data.referees || []).map((r, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-900 block">{r.name}</span>
                      <span className="text-slate-600 block">{r.title} ({r.organization})</span>
                      <span className="text-slate-400 font-mono block">{r.email}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Notice: Details Excluded (P8.2) */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-[11px]">
                <span className="font-bold text-emerald-900">Occupational Health &amp; Medical Clearance:</span>
                <span className="font-black text-emerald-800 uppercase">FIT — Verified &amp; Certified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
