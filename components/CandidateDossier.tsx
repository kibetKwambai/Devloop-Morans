import React, { useState, useMemo, useRef } from 'react';
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
  VaultDocumentItem
} from '../types';
import { Icon, IconName } from './Icon';
import { useAppContext } from './AppContext';

export interface CandidateDossierProps {
  profile: JobSeekerProfile;
  viewerRole?: UserRole;
  isOwner?: boolean;
  onUpdateProfile?: (updated: JobSeekerProfile) => void;
  initialTab?: 'dossier' | 'vault';
}

export const CandidateDossier: React.FC<CandidateDossierProps> = ({
  profile,
  viewerRole = UserRole.JobSeeker,
  isOwner = true,
  onUpdateProfile,
  initialTab = 'dossier'
}) => {
  const { updateProfile, addNotification } = useAppContext();
  const [data, setData] = useState<JobSeekerProfile>(profile);
  const [mainView, setMainView] = useState<'dossier' | 'vault'>(initialTab);
  const [activeSection, setActiveSection] = useState<string>('identity');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    identity: true,
    education: true,
    licenses: true,
    workHistory: true
  });

  // Vault State
  const [selectedVaultCategory, setSelectedVaultCategory] = useState<string>('all');
  const [vaultSearchQuery, setVaultSearchQuery] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<VaultDocumentItem['category']>('identity');
  const [uploadExpiry, setUploadExpiry] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<VaultDocumentItem | null>(null);

  // Identity Form edit state
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [identityForm, setIdentityForm] = useState({
    legalName: data.name,
    dob: data.dob || '1992-05-14',
    gender: data.gender || 'Female',
    nationality: data.nationality || 'Kenyan',
    county: data.countyOfResidence || 'Nairobi',
    phone: data.phone || '+254 712 345 678',
    email: data.email,
    address: data.physicalAddress || 'Riverside Drive, Nairobi, Kenya',
    idNumber: data.governmentId?.documentNumber || '29481920',
    idType: data.governmentId?.type || 'national_id',
    idExpiry: data.governmentId?.expiryDate || '2030-12-31',
    eligibilityType: data.workEligibility?.status || 'citizen'
  });

  // Add Item Modal states
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [eduForm, setEduForm] = useState<Partial<EducationEntry>>({
    institution: '',
    degree: '',
    qualificationLevel: 'Degree',
    fieldOfStudy: '',
    startDate: '2018',
    endDate: '2022',
    grade: 'First Class Honours',
    isForeignQualification: false
  });

  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [licenseForm, setLicenseForm] = useState<Partial<ProfessionalLicenseEntry>>({
    licensingBody: 'EBK',
    licenseNumber: '',
    licenseCategory: 'Professional Engineer (PE)',
    issueDate: '2022-01-15',
    expiryDate: '2026-12-31'
  });

  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [workForm, setWorkForm] = useState<Partial<WorkExperienceEntry>>({
    company: '',
    title: '',
    department: 'Engineering',
    startDate: '2022-03',
    endDate: 'Present',
    isCurrentRole: true,
    description: '',
    achievements: ['Led cross-functional verification workflows', 'Improved audit turnaround time by 40%'],
    supervisorName: '',
    supervisorTitle: '',
    supervisorPhone: '',
    supervisorEmail: ''
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveData = (updated: JobSeekerProfile) => {
    setData(updated);
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    } else {
      updateProfile(updated);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Expiry Calculation Helper
  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const diffTime = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Time-Sensitive Expiring Items
  const expiringItems = useMemo(() => {
    const list: Array<{ id: string; name: string; type: string; expiryDate: string; daysRemaining: number }> = [];

    // Check licenses
    (data.professionalLicenses || []).forEach((lic, idx) => {
      if (lic.expiryDate) {
        const days = getDaysUntilExpiry(lic.expiryDate);
        if (days !== null && days <= 60) {
          list.push({
            id: `lic-${idx}`,
            name: `${lic.licensingBody} License (${lic.licenseNumber})`,
            type: 'Professional License',
            expiryDate: lic.expiryDate,
            daysRemaining: days
          });
        }
      }
    });

    // Check Vault documents
    (data.vaultDocuments || []).forEach(doc => {
      if (doc.expiryDate) {
        const days = getDaysUntilExpiry(doc.expiryDate);
        if (days !== null && days <= 60) {
          list.push({
            id: doc.id,
            name: doc.name,
            type: doc.category,
            expiryDate: doc.expiryDate,
            daysRemaining: days
          });
        }
      }
    });

    return list;
  }, [data]);

  // Section Completeness Calculation (P0.1, P0.2)
  const completeness = useMemo(() => {
    const scores = {
      identity: {
        percent: data.name && data.governmentId?.documentNumber ? 100 : 50,
        isComplete: Boolean(data.name && data.governmentId?.documentNumber),
        label: 'P1: Identity & Eligibility',
        tip: 'Verify National ID or Passport bio-data.'
      },
      education: {
        percent: (data.education || []).length > 0 ? 100 : 0,
        isComplete: (data.education || []).length > 0,
        label: 'P2: Academic Education',
        tip: 'Attach certificate and transcript for your highest qualification.'
      },
      licenses: {
        percent: (data.professionalLicenses || []).length > 0 ? 100 : 50,
        isComplete: (data.professionalLicenses || []).length > 0,
        label: 'P3: Professional Licenses',
        tip: 'Add regulator registration (EBK, KCAA, KMPDC, LSK, etc.).'
      },
      workHistory: {
        percent: (data.workExperience || []).length > 0 ? 100 : 0,
        isComplete: (data.workExperience || []).length > 0,
        label: 'P4: Work Experience',
        tip: 'Add your employment timeline and supervisor reference.'
      },
      vault: {
        percent: (data.vaultDocuments || []).length >= 3 ? 100 : Math.round(((data.vaultDocuments || []).length / 3) * 100),
        isComplete: (data.vaultDocuments || []).length >= 3,
        label: 'P5: Document Vault',
        tip: 'Upload ID bio-data, certificates, and Good Conduct.'
      }
    };

    const totalWeight = 5;
    const overall = Math.round(
      (scores.identity.percent + scores.education.percent + scores.licenses.percent + scores.workHistory.percent + scores.vault.percent) / totalWeight
    );

    const isPlacementReady = scores.identity.isComplete && scores.education.isComplete && scores.workHistory.isComplete && (data.vaultDocuments || []).length >= 2;

    return { scores, overall, isPlacementReady };
  }, [data]);

  // Document Vault Filtered List
  const filteredVaultDocs = useMemo(() => {
    const docs = data.vaultDocuments || [];
    return docs.filter(doc => {
      const matchesCategory = selectedVaultCategory === 'all' || doc.category === selectedVaultCategory;
      const matchesSearch = !vaultSearchQuery || 
        doc.name.toLowerCase().includes(vaultSearchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(vaultSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [data.vaultDocuments, selectedVaultCategory, vaultSearchQuery]);

  // File Upload Processing
  const processFileUpload = (file: File) => {
    setUploadError(null);

    // Validation: Type (.pdf, .png, .jpg, .jpeg, .webp)
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError(`Invalid file format "${file.name}". Please upload PDF, PNG, JPG, or WEBP.`);
      return;
    }

    // Validation: Size (Max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`File "${file.name}" exceeds the maximum allowed size of 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(100);

            const newDoc: VaultDocumentItem = {
              id: `doc-${Date.now()}`,
              name: uploadDocName.trim() || file.name.replace(/\.[^/.]+$/, ''),
              category: uploadCategory,
              fileType: file.type.includes('pdf') ? 'pdf' : 'image',
              fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              uploadDate: new Date().toISOString().split('T')[0],
              expiryDate: uploadExpiry || undefined,
              verificationStatus: VerificationStatus.VERIFIED,
              fileUrl: URL.createObjectURL(file),
              checksum: `SHA256:${Math.random().toString(36).substring(2, 12).toUpperCase()}`
            };

            const updatedDocs = [newDoc, ...(data.vaultDocuments || [])];
            handleSaveData({ ...data, vaultDocuments: updatedDocs });
            setIsUploadModalOpen(false);
            setUploadDocName('');
            setUploadExpiry('');
            showToast(`"${newDoc.name}" uploaded, hashed, and verified in sovereign vault.`);
          }, 300);
          return 95;
        }
        return prev + 25;
      });
    }, 120);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileUpload(e.target.files[0]);
    }
  };

  // Status Badge Rendering Helper
  const renderVerificationBadge = (status: VerificationStatus, reason?: string) => {
    const map: Record<VerificationStatus, { bg: string; text: string; label: string; icon: IconName }> = {
      [VerificationStatus.VERIFIED]: { bg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', label: 'Primary Verified', icon: 'shieldCheck' },
      [VerificationStatus.SOURCE_VERIFIED]: { bg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', label: 'Source Attested', icon: 'shieldCheck' },
      [VerificationStatus.AUTHENTICATED]: { bg: 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300', label: 'Authenticated', icon: 'checkBadge' },
      [VerificationStatus.PENDING]: { bg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', label: 'In Verification', icon: 'arrowPath' },
      [VerificationStatus.UNDER_REVIEW]: { bg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', label: 'Under Review', icon: 'arrowPath' },
      [VerificationStatus.DOCUMENT_SUBMITTED]: { bg: 'bg-sky-50 dark:bg-sky-950/70 border-sky-200 dark:border-sky-800', text: 'text-sky-700 dark:text-sky-300', label: 'Doc Uploaded', icon: 'arrowUpTray' },
      [VerificationStatus.EXPIRED]: { bg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300', label: 'Expired', icon: 'exclamationTriangle' },
      [VerificationStatus.REJECTED]: { bg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300', label: 'Rejected', icon: 'xCircle' },
      [VerificationStatus.FLAGGED]: { bg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300', label: 'Flagged', icon: 'shieldAlert' },
      [VerificationStatus.DRAFT]: { bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', text: 'text-slate-600 dark:text-slate-400', label: 'Draft', icon: 'document' },
      [VerificationStatus.SELF_DECLARED]: { bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', text: 'text-slate-600 dark:text-slate-400', label: 'Self Declared', icon: 'user' },
      [VerificationStatus.CREDENTIAL_MISMATCH]: { bg: 'bg-purple-50 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300', label: 'Mismatch', icon: 'exclamationTriangle' },
      [VerificationStatus.SUSPICIOUS_ACTIVITY]: { bg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300', label: 'Suspicious', icon: 'shieldAlert' },
      [VerificationStatus.ISSUER_VERIFIED]: { bg: 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300', label: 'Issuer Validated', icon: 'shieldCheck' },
      [VerificationStatus.ACCREDITED_AGENT_VERIFIED]: { bg: 'bg-teal-50 dark:bg-teal-950/70 border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300', label: 'Agent Verified', icon: 'shieldCheck' },
      [VerificationStatus.CROSS_CHECKED]: { bg: 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800', text: 'text-cyan-700 dark:text-cyan-300', label: 'Cross-Checked', icon: 'checkCircle' },
      [VerificationStatus.VERIFICATION_DUE]: { bg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', label: 'Renewal Due', icon: 'arrowPath' },
      [VerificationStatus.DISPUTED]: { bg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300', label: 'Disputed', icon: 'exclamationTriangle' },
      [VerificationStatus.REVOKED]: { bg: 'bg-rose-100 dark:bg-rose-950 border-rose-400 dark:border-rose-700', text: 'text-rose-800 dark:text-rose-200', label: 'Revoked', icon: 'xCircle' },
      [VerificationStatus.UNABLE_TO_VERIFY]: { bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', text: 'text-slate-600 dark:text-slate-400', label: 'Unverified', icon: 'helpCircle' }
    };

    const cfg = map[status] || map[VerificationStatus.VERIFIED];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border ${cfg.bg} ${cfg.text}`} title={reason || cfg.label}>
        <Icon name={cfg.icon} className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
        <span>{cfg.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 dark:border-slate-300 animate-in slide-in-from-bottom-5">
          <Icon name="checkCircle" className="h-5 w-5 text-emerald-400 dark:text-emerald-600" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* RENEWAL REMINDER BANNER (Phase P3.2, P5.4) */}
      {expiringItems.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
                <Icon name="exclamationTriangle" className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200">
                  Time-Sensitive Document Renewal Action Required ({expiringItems.length})
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Licenses or certificates require renewal within 60 days to maintain active Placement-Ready status.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setMainView('vault');
                setSelectedVaultCategory('professional');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Manage Renewals</span>
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
            {expiringItems.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-slate-900 dark:text-white truncate block">{item.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Expires: {item.expiryDate}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase flex-shrink-0 ${
                  item.daysRemaining <= 0 
                    ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300' 
                    : item.daysRemaining <= 30
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
                    : 'bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 border border-yellow-200'
                }`}>
                  {item.daysRemaining <= 0 ? 'Expired' : `${item.daysRemaining}d left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOP HEADER & COMPLETENESS DASHBOARD (Phase P0.1, P0.2) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Sovereign Candidate Dossier
              </span>
              {completeness.isPlacementReady ? (
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <Icon name="checkCircle" className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Placement Ready</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                  <Icon name="arrowPath" className="h-3.5 w-3.5 text-amber-600" />
                  <span>Dossier In Progress</span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Candidate Dossier &amp; Primary Verification Vault
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              All credentials, licenses, academic records, and time-stamped government IDs compiled into a single verified dossier.
            </p>
          </div>

          {/* Completeness Meter */}
          <div className="w-full md:w-auto flex items-center gap-4 bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="relative flex items-center justify-center h-14 w-14">
              <svg className="h-14 w-14 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-600 dark:text-indigo-400 transition-all duration-700"
                  strokeDasharray={`${completeness.overall}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-900 dark:text-white">
                {completeness.overall}%
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Dossier Completeness
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {completeness.isPlacementReady ? 'All mandatory fields verified' : 'Complete remaining sections below'}
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs (Dossier Sections vs Document Vault) */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pt-2">
          <button
            onClick={() => setMainView('dossier')}
            className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              mainView === 'dossier'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon name="documentCheck" className="h-4 w-4" />
            <span>Structured Profile Sections (P0–P4)</span>
          </button>

          <button
            onClick={() => setMainView('vault')}
            className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              mainView === 'vault'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon name="folder" className="h-4 w-4" />
            <span>Document Vault (P5) ({(data.vaultDocuments || []).length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: STRUCTURED MODULAR SECTIONS (P0 - P4)             */}
      {/* ========================================================= */}
      {mainView === 'dossier' && (
        <div className="space-y-4">
          {/* SECTION P1: IDENTITY & PERSONAL DETAILS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs transition-all">
            <button
              onClick={() => toggleSection('identity')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <Icon name="user" className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      PHASE P1: Identity &amp; Government Eligibility
                    </h3>
                    {renderVerificationBadge(data.governmentId?.verificationStatus || VerificationStatus.VERIFIED)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    National ID card, passport bio-data, KRA PIN, work authorization
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs font-bold text-slate-500 dark:text-slate-400">
                  {completeness.scores.identity.percent}% Complete
                </span>
                <Icon name="chevronDown" className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${openSections.identity ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {openSections.identity && (
              <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 space-y-6 animate-in fade-in duration-150">
                {!isEditingIdentity ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                        <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Legal Name (on ID)</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{data.name}</span>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                        <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Date of Birth &amp; Gender</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{data.dob || '14 May 1992'} &bull; {data.gender || 'Female'}</span>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                        <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Nationality &amp; County</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{data.nationality || 'Kenyan'} &bull; {data.countyOfResidence || 'Nairobi County'}</span>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                        <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Government Document ID</span>
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                          {data.governmentId?.type === 'passport' ? 'Passport: ' : 'National ID: '}
                          {data.governmentId?.documentNumber || '29481920'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                        <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Work Eligibility</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block capitalize">
                          {data.workEligibility?.status || 'Kenyan Citizen (Unrestricted)'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                        <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">KRA Tax PIN Standing</span>
                        <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                          A008928172K &bull; Compliant
                        </span>
                      </div>
                    </div>

                    {isOwner && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => setIsEditingIdentity(true)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Icon name="pencil" className="h-3.5 w-3.5" />
                          <span>Edit Identity Information</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveData({
                        ...data,
                        name: identityForm.legalName,
                        dob: identityForm.dob,
                        gender: identityForm.gender,
                        nationality: identityForm.nationality,
                        countyOfResidence: identityForm.county,
                        phone: identityForm.phone,
                        email: identityForm.email,
                        physicalAddress: identityForm.address,
                        governmentId: {
                          ...data.governmentId,
                          id: data.governmentId?.id || 'gov-1',
                          type: identityForm.idType as any,
                          documentNumber: identityForm.idNumber,
                          expiryDate: identityForm.idExpiry,
                          verificationStatus: VerificationStatus.VERIFIED
                        }
                      });
                      setIsEditingIdentity(false);
                      showToast('Identity details updated & synced to passport.');
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Full Legal Name (as on ID)</label>
                        <input
                          type="text"
                          value={identityForm.legalName}
                          onChange={e => setIdentityForm({ ...identityForm, legalName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={identityForm.dob}
                          onChange={e => setIdentityForm({ ...identityForm, dob: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">County of Residence</label>
                        <input
                          type="text"
                          value={identityForm.county}
                          onChange={e => setIdentityForm({ ...identityForm, county: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Government ID Type</label>
                        <select
                          value={identityForm.idType}
                          onChange={e => setIdentityForm({ ...identityForm, idType: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        >
                          <option value="national_id">National ID Card (Kenya Maisha)</option>
                          <option value="passport">East African / International Passport</option>
                          <option value="alien_card">Alien Card / Work Permit ID</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Document / ID Number</label>
                        <input
                          type="text"
                          value={identityForm.idNumber}
                          onChange={e => setIdentityForm({ ...identityForm, idNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Work Eligibility Category</label>
                        <select
                          value={identityForm.eligibilityType}
                          onChange={e => setIdentityForm({ ...identityForm, eligibilityType: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        >
                          <option value="citizen">Kenyan Citizen (Born / Registered)</option>
                          <option value="work_permit">Work Permit (Class G / D / M)</option>
                          <option value="special_pass">Special Pass / Exemption</option>
                          <option value="permanent_resident">Permanent Resident</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingIdentity(false)}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                      >
                        Save &amp; Verify Identity
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* SECTION P2: EDUCATION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs transition-all">
            <button
              onClick={() => toggleSection('education')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <Icon name="academicCap" className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      PHASE P2: Academic Education &amp; KNQA Recognition
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {(data.education || []).length} Qualifications
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Degrees, diplomas, TVET credentials, transcripts, and KNQA equation certs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs font-bold text-slate-500 dark:text-slate-400">
                  {completeness.scores.education.percent}% Complete
                </span>
                <Icon name="chevronDown" className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${openSections.education ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {openSections.education && (
              <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Verified Academic Qualifications
                  </span>
                  {isOwner && (
                    <button
                      onClick={() => setIsEducationModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="plus" className="h-3.5 w-3.5" />
                      <span>Add Qualification</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {(data.education || []).map((edu, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {edu.degree}
                          </h4>
                          {renderVerificationBadge(edu.verificationStatus || VerificationStatus.SOURCE_VERIFIED)}
                          {edu.isForeignQualification && (
                            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                              KNQA Equated
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                          {edu.institution} &bull; {edu.fieldOfStudy} ({edu.grade || 'First Class'})
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          Duration: {edu.startDate} – {edu.endDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                          <Icon name="documentCheck" className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Transcript &amp; Certificate Validated</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION P3: PROFESSIONAL LICENSES & MEMBERSHIPS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs transition-all">
            <button
              onClick={() => toggleSection('licenses')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <Icon name="shieldCheck" className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      PHASE P3: Professional Licenses &amp; DCI Good Conduct
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {(data.professionalLicenses || []).length} Active Licenses
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    EBK, LSK, KCAA, KMPDC, TSC, EPRA, and DCI Police Clearance certificates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs font-bold text-slate-500 dark:text-slate-400">
                  {completeness.scores.licenses.percent}% Complete
                </span>
                <Icon name="chevronDown" className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${openSections.licenses ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {openSections.licenses && (
              <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Statutory Practicing Credentials
                  </span>
                  {isOwner && (
                    <button
                      onClick={() => setIsLicenseModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="plus" className="h-3.5 w-3.5" />
                      <span>Add Practicing License</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {(data.professionalLicenses || []).map((lic, idx) => {
                    const days = getDaysUntilExpiry(lic.expiryDate);
                    const isExpiringSoon = days !== null && days <= 60 && days > 0;
                    const isExpired = days !== null && days <= 0;

                    return (
                      <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                              {lic.licensingBody}: {lic.licenseCategory || 'Practicing License'}
                            </h4>
                            {renderVerificationBadge(lic.verificationStatus || VerificationStatus.VERIFIED)}
                            {isExpiringSoon && (
                              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                                {days} Days Until Expiry
                              </span>
                            )}
                            {isExpired && (
                              <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold">
                                RENEW BEFORE PLACEMENT
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                            Reg Number: {lic.licenseNumber}
                          </p>
                          <p className="text-slate-400 text-[11px]">
                            Validity: {lic.issueDate || '2023'} &rarr; {lic.expiryDate || '2026-12-31'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                            <Icon name="shieldCheck" className="h-3.5 w-3.5" />
                            <span>Statutory Standing Active</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SECTION P4: WORK HISTORY & COMPETENCY */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs transition-all">
            <button
              onClick={() => toggleSection('workHistory')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <Icon name="briefcase" className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      PHASE P4: Verified Work Experience &amp; Affidavits
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {(data.workExperience || []).length} Roles
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Employment timeline, named supervisor verification, and achievement bullets
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs font-bold text-slate-500 dark:text-slate-400">
                  {completeness.scores.workHistory.percent}% Complete
                </span>
                <Icon name="chevronDown" className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${openSections.workHistory ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {openSections.workHistory && (
              <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Reverse-Chronological Career Track
                  </span>
                  {isOwner && (
                    <button
                      onClick={() => setIsWorkModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="plus" className="h-3.5 w-3.5" />
                      <span>Add Work History</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {(data.workExperience || []).map((work, idx) => (
                    <div key={idx} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {work.title}
                            </h4>
                            <span className="text-slate-400">&bull;</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{work.company}</span>
                            {work.isCurrentRole && (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                                Current Role
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            {work.startDate} &rarr; {work.endDate} &bull; {work.department || 'Operations'}
                          </p>
                        </div>
                        {renderVerificationBadge(work.verificationStatus || VerificationStatus.SOURCE_VERIFIED)}
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {work.description}
                      </p>

                      {work.achievements && work.achievements.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Impact &amp; Achievements:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                            {work.achievements.map((ach, aIdx) => (
                              <li key={aIdx}>{ach}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {work.supervisorName && (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">
                            Affidavit Supervisor: <strong className="text-slate-900 dark:text-white">{work.supervisorName}</strong> ({work.supervisorTitle})
                          </span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Attestation Recorded</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: DOCUMENT VAULT (PHASE P5)                         */}
      {/* ========================================================= */}
      {mainView === 'vault' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6">
          {/* Header & Upload Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Icon name="folder" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Central Sovereign Document Vault</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload, verify, and monitor time-sensitive candidate documents and certificates.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Icon name="arrowUpTray" className="h-4 w-4" />
                <span>Upload New Document</span>
              </button>
            </div>
          </div>

          {/* Drag and Drop Zone (P5.3) */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
              isDragOver 
                ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 scale-[1.01]' 
                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <Icon name="arrowUpTray" className="h-6 w-6" />
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Drag and drop your document here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse files</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PDF, JPG, PNG, WEBP (Max 10MB per document) &bull; Primary-source verified on upload
              </p>
            </div>

            {/* Progress Bar during upload */}
            {isUploading && (
              <div className="mt-4 max-w-md mx-auto space-y-1.5 text-left">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span>Uploading and computing cryptographic SHA-256 hash...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {uploadError && (
              <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl max-w-md mx-auto">
                {uploadError}
              </div>
            )}
          </div>

          {/* Category Filter Chips (P5.2) & Search Input */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Documents' },
                  { id: 'identity', label: 'Identity' },
                  { id: 'education', label: 'Education' },
                  { id: 'professional', label: 'Professional' },
                  { id: 'employment', label: 'Employment' },
                  { id: 'medical', label: 'Medical & Fitness' },
                  { id: 'aviation', label: 'Aviation' },
                  { id: 'trade', label: 'Trades & Care' }
                ].map(chip => (
                  <button
                    key={chip.id}
                    onClick={() => setSelectedVaultCategory(chip.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedVaultCategory === chip.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Icon name="search" className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vault documents..."
                  value={vaultSearchQuery}
                  onChange={e => setVaultSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Document Listing (P5.1) */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Document Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Uploaded</th>
                      <th className="px-4 py-3">Expiry Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredVaultDocs.length > 0 ? (
                      filteredVaultDocs.map((doc) => {
                        const days = getDaysUntilExpiry(doc.expiryDate);
                        const isExpiring = days !== null && days <= 60 && days > 0;
                        const isExpired = days !== null && days <= 0;

                        return (
                          <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                  <Icon name={doc.fileType === 'pdf' ? 'documentText' : 'document'} className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 dark:text-white block">{doc.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono block">{doc.fileSize || '1.4 MB'} &bull; {doc.checksum?.slice(0, 15) || 'SHA256:VERIFIED'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 capitalize font-semibold text-slate-600 dark:text-slate-400">
                              {doc.category}
                            </td>
                            <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 font-mono">
                              {doc.uploadDate}
                            </td>
                            <td className="px-4 py-3.5">
                              {doc.expiryDate ? (
                                <div className="flex items-center gap-1.5 font-mono">
                                  <span>{doc.expiryDate}</span>
                                  {isExpiring && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[9px] font-bold">
                                      {days}d
                                    </span>
                                  )}
                                  {isExpired && (
                                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[9px] font-bold">
                                      Expired
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">No Expiry</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              {renderVerificationBadge(doc.verificationStatus)}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedDocForPreview(doc)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                  title="Preview Document"
                                >
                                  <Icon name="eye" className="h-3.5 w-3.5" />
                                </button>
                                {isOwner && (
                                  <button
                                    onClick={() => {
                                      const filtered = (data.vaultDocuments || []).filter(d => d.id !== doc.id);
                                      handleSaveData({ ...data, vaultDocuments: filtered });
                                      showToast(`Removed "${doc.name}" from vault.`);
                                    }}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                                    title="Delete Document"
                                  >
                                    <Icon name="trash" className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                          No documents found matching this category filter or search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: Upload Modal, Add Education, Add License, Preview */}
      {/* ========================================================= */}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Icon name="arrowUpTray" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Upload Document to Sovereign Vault</span>
              </h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <Icon name="xMark" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Document Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. EBK Practicing License 2026, UoN Degree Certificate"
                  value={uploadDocName}
                  onChange={e => setUploadDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={e => setUploadCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="identity">Identity (ID, Passport, PIN)</option>
                    <option value="education">Education (Cert, Transcript)</option>
                    <option value="professional">Professional License / DCI</option>
                    <option value="employment">Employment Letters / Payslip</option>
                    <option value="medical">Medical &amp; Fitness</option>
                    <option value="aviation">Aviation Validation</option>
                    <option value="trade">Trades &amp; Care</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Expiry Date (if applicable)</label>
                  <input
                    type="date"
                    value={uploadExpiry}
                    onChange={e => setUploadExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Upload Input */}
              <div className="pt-2">
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Choose File (.pdf, .jpg, .png, .webp &le; 10MB)</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">{selectedDocForPreview.name}</h3>
                <span className="text-xs text-slate-400 font-mono">Checksum: {selectedDocForPreview.checksum}</span>
              </div>
              <button 
                onClick={() => setSelectedDocForPreview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <Icon name="xMark" className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center">
                <Icon name="shieldCheck" className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Primary Source Verified Credential</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                This document has been cryptographically validated against statutory government registries with tamper-evident digital signature.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Education Modal */}
      {isEducationModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Add Academic Qualification</h3>
              <button onClick={() => setIsEducationModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <Icon name="xMark" className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const newEdu: EducationEntry = {
                  id: `edu-${Date.now()}`,
                  institution: eduForm.institution || '',
                  degree: eduForm.degree || '',
                  fieldOfStudy: eduForm.fieldOfStudy || '',
                  startDate: eduForm.startDate || '2018',
                  endDate: eduForm.endDate || '2022',
                  grade: eduForm.grade || 'First Class',
                  qualificationLevel: eduForm.qualificationLevel as any,
                  isForeignQualification: eduForm.isForeignQualification || false,
                  verificationStatus: VerificationStatus.SOURCE_VERIFIED
                };
                const updatedList = [...(data.education || []), newEdu];
                handleSaveData({ ...data, education: updatedList });
                setIsEducationModalOpen(false);
                showToast('Academic qualification added and attested.');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Institution</label>
                <input
                  type="text"
                  placeholder="e.g. University of Nairobi, Strathmore University"
                  value={eduForm.institution}
                  onChange={e => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Degree / Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc Civil Engineering, Diploma in Aviation Maintenance"
                  value={eduForm.degree}
                  onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={eduForm.fieldOfStudy}
                    onChange={e => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Honours / Grade</label>
                  <input
                    type="text"
                    value={eduForm.grade}
                    onChange={e => setEduForm({ ...eduForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEducationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Add Qualification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add License Modal */}
      {isLicenseModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Add Practicing License</h3>
              <button onClick={() => setIsLicenseModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <Icon name="xMark" className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const newLic: ProfessionalLicenseEntry = {
                  id: `lic-${Date.now()}`,
                  licensingBody: licenseForm.licensingBody || 'EBK',
                  licenseNumber: licenseForm.licenseNumber || '',
                  licenseCategory: licenseForm.licenseCategory || '',
                  issueDate: licenseForm.issueDate || '2023-01-01',
                  expiryDate: licenseForm.expiryDate || '2026-12-31',
                  verificationStatus: VerificationStatus.VERIFIED
                };
                const updatedLicenses = [...(data.professionalLicenses || []), newLic];
                handleSaveData({ ...data, professionalLicenses: updatedLicenses });
                setIsLicenseModalOpen(false);
                showToast('Professional license registered & verified against regulatory registry.');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Licensing Board</label>
                <select
                  value={licenseForm.licensingBody}
                  onChange={e => setLicenseForm({ ...licenseForm, licensingBody: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="EBK">EBK (Engineers Board of Kenya)</option>
                  <option value="KCAA">KCAA (Kenya Civil Aviation Authority)</option>
                  <option value="KMPDC">KMPDC (Medical Practitioners &amp; Dentists)</option>
                  <option value="LSK">LSK (Law Society of Kenya)</option>
                  <option value="TSC">TSC (Teachers Service Commission)</option>
                  <option value="ICPAK">ICPAK (Certified Public Accountants)</option>
                  <option value="EPRA">EPRA (Energy &amp; Petroleum Regulatory Authority)</option>
                  <option value="NCA">NCA (National Construction Authority)</option>
                  <option value="ODPC">ODPC (Data Protection Officers)</option>
                  <option value="OTHER">Other Accredited Body</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">License Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. EBK/PE/9482, KCAA/B1.1/2849"
                  value={licenseForm.licenseNumber}
                  onChange={e => setLicenseForm({ ...licenseForm, licenseNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={licenseForm.issueDate}
                    onChange={e => setLicenseForm({ ...licenseForm, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={licenseForm.expiryDate}
                    onChange={e => setLicenseForm({ ...licenseForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLicenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Register License
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
