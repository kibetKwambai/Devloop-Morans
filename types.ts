
export enum VerificationStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending Verification',
  VERIFIED = 'Verified & Authentic',
  REJECTED = 'Rejected / Incomplete',
  FLAGGED = 'Flagged / Suspicious',
  CREDENTIAL_MISMATCH = 'Credential Mismatch',
  AUTHENTICATED = 'Fully Authenticated',
  SUSPICIOUS_ACTIVITY = 'Suspicious Activity Detected',
  SELF_DECLARED = 'Self Declared',
  DOCUMENT_SUBMITTED = 'Document Submitted',
  SOURCE_VERIFIED = 'Source Verified',
  ISSUER_VERIFIED = 'Issuer Verified',
  ACCREDITED_AGENT_VERIFIED = 'Verified by Accredited Agent',
  CROSS_CHECKED = 'Cross-Checked',
  EXPIRED = 'Expired',
  VERIFICATION_DUE = 'Verification Due',
  UNDER_REVIEW = 'Under Review',
  DISPUTED = 'Disputed',
  REVOKED = 'Revoked',
  UNABLE_TO_VERIFY = 'Unable to Verify',
}

export enum UserRole {
  JobSeeker,
  Employer,
  Admin,
  Agent,
  Issuer,
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string; // 'Present' or a date
  description: string;
  responsibilities: string[];
  isVerified?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isVerified?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  type: 'Hard' | 'Soft';
}

export interface PersonalInfo {
  bloodGroup?: string;
  tribe?: string;
  height?: string;
  weight?: string;
  bmi?: number | string;
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
  maritalStatus?: string;
}

export interface HealthInfo {
  condition?: string;
  disabilities?: string;
  allergies?: string;
  lastMedicalCheckup?: string;
  vaccinationStatus?: string;
}

export interface LegalInfo {
  policeClearanceUrl?: string;
  policeClearanceExpiry?: string;
  hasCriminalRecord: boolean;
  criminalRecordDetails?: string;
  securityClearanceLevel?: string;
  securityClearanceExpiry?: string;
  kRACompliance?: boolean;
  helbCompliance?: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  documentUrl: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'CV' | 'Certificate' | 'Other';
  url: string;
  uploadedAt: string;
}

export interface JobSeekerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  photoUrl: string;
  avatar?: string;
  experienceYears?: number;
  headline: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  jobInterests: string[];
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  isShortlisted?: boolean;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  personalInfo?: PersonalInfo;
  healthInfo?: HealthInfo;
  legalInfo?: LegalInfo;
  documents: Document[];
  certifications: Certification[];
  languages: string[];
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: {
      monthly: string;
      annual: string;
    };
    priceDetails: string;
    annualPrice?: string;
    features: string[];
    ctaText: string;
    isPopular: boolean;
}

export interface Job {
  id: string;
  employerId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  salaryRange?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  termsAndConditions: string;
  legalRights: string;
  postedAt: string;
  deadline: string;
  category: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  status: 'Open' | 'Closed' | 'Draft';
}

export interface Application {
  id: string;
  jobId: string;
  jobSeekerId: string;
  status: 'Applied' | 'Reviewing' | 'Shortlisted' | 'Interviewing' | 'Offered' | 'Accepted' | 'Rejected';
  appliedAt: string;
  coverLetter?: string;
  interestedOnly?: boolean;
  matchScore?: number;
  notes?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Application' | 'StatusChange' | 'Message' | 'System';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  jobId?: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface IndustryCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  sectorTag: string;
  description: string;
  growth: string;
  avgSalary: string;
  cluster: 'tech' | 'finance' | 'engineering' | 'health_agri' | 'logistics' | 'social_creative';
  keySkills: string[];
}

// --- VERIFIED PROFESSIONAL PASSPORT & TRUST CHAIN ---

export interface ProvenanceStep {
  id: string;
  stepName: string;
  actor: string;
  actorRole: string;
  action: string;
  timestamp: string;
  evidenceMethod: string;
  status: 'passed' | 'pending' | 'flagged';
  notes?: string;
}

export interface VerifiableCredential {
  id: string;
  candidateId: string;
  title: string;
  category: 'education' | 'employment' | 'licence' | 'certification' | 'skill' | 'security_clearance' | 'reference' | 'project';
  issuingOrg: string;
  issueDate: string;
  expiryDate?: string;
  credentialNumber?: string;
  verificationState: VerificationStatus;
  verificationMethod: string;
  verifyingEntity: string;
  verifyingAgentId?: string;
  evidenceType: string;
  evidenceUrl?: string;
  lastVerifiedAt: string;
  nextVerificationDue?: string;
  provenanceChain: ProvenanceStep[];
  disputeStatus: 'none' | 'disputed' | 'under_review' | 'resolved';
  isRevoked: boolean;
  isPublicVisible: boolean;
  verificationUrl: string;
  qrPayload: string;
}

export interface VerificationCoverage {
  identity: number;
  employment: number;
  education: number;
  licences: number;
  skills: number;
  references: number;
  overall: number;
  auditExplanation: string;
}

// --- SENSITIVE DATA VAULT & PRIVACY ---

export interface VaultAccessLog {
  id: string;
  requesterName: string;
  organisation: string;
  timestamp: string;
  purpose: string;
  fieldsAccessed: string[];
  status: 'approved' | 'denied' | 'auto_logged';
}

export interface SensitiveVaultData {
  bloodGroup?: string;
  tribe?: string;
  height?: string;
  weight?: string;
  bmi?: number | string;
  gender?: string;
  dateOfBirth?: string;
  medicalConditions?: string;
  disabilityDetails?: string;
  criminalRecordDetails?: string;
  consentGranted: boolean;
  consentExpiresAt?: string;
  purposeRequirement: string;
  legalBasis: string;
  accessLogs: VaultAccessLog[];
}

export interface ProfileViewAudit {
  id: string;
  viewerName: string;
  organisation: string;
  timestamp: string;
  sectionsViewed: string[];
  accessReason: string;
}

export interface CandidatePrivacySettings {
  publicVisibility: boolean;
  verifiedEmployersOnly: boolean;
  appliedEmployersOnly: boolean;
  searchEngineIndexing: boolean;
  allowAgentAudits: boolean;
  whoViewedMe: ProfileViewAudit[];
}

// --- ENTERPRISE ATS & RECRUITMENT PIPELINE ---

export type ATSPipelineStage = 
  | 'Applied' 
  | 'Screening' 
  | 'Interview' 
  | 'Assessment' 
  | 'BackgroundCheck' 
  | 'Offer' 
  | 'Hired' 
  | 'Rejected' 
  | 'Archived';

export interface RequisitionApprovalStep {
  role: string;
  approverName: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Revision_Requested';
  timestamp?: string;
  comment?: string;
}

export interface JobRequisition {
  id: string;
  title: string;
  department: string;
  hiringManager: string;
  openingsCount: number;
  salaryBudget: string;
  status: 'Draft' | 'Pending_Approval' | 'Approved' | 'Rejected';
  createdAt: string;
  approvals: RequisitionApprovalStep[];
}

export interface InterviewCompetencyScore {
  competency: string; // e.g. Technical Depth, Problem Solving, Communication, Regulatory, Leadership
  score: number; // 1 to 5
  evidenceNotes: string;
}

export interface InterviewScorecard {
  id: string;
  interviewId: string;
  interviewerName: string;
  interviewerRole: string;
  scores: InterviewCompetencyScore[];
  overallRecommendation: 'Strong Hire' | 'Hire' | 'Neutral' | 'Do Not Hire';
  summaryRemarks: string;
  submittedAt: string;
}

export interface StructuredInterview {
  id: string;
  applicationId: string;
  candidateName: string;
  candidatePhoto?: string;
  jobTitle: string;
  stageName: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  meetingUrl: string;
  googleMeetSpaceName?: string;
  googleMeetCode?: string;
  googleMeetUri?: string;
  googleMeetActive?: boolean;
  panelMembers: string[];
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
  scorecards: InterviewScorecard[];
}

export interface TalentPool {
  id: string;
  name: string;
  sector: string;
  candidateIds: string[];
  tags: string[];
  notesCount: number;
  createdAt: string;
}

// --- AI MATCHING & CAREER INTELLIGENCE ---

export interface AIMatchAnalysis {
  roleAlignmentPercent: number;
  matchedCriteria: string[];
  missingCriteria: string[];
  recommendations: string[];
  explainabilitySummary: string;
  nonBiasedCertification: boolean;
}

// --- AGENT OPERATIONS & CONFLICT OF INTEREST ---

export interface VerificationCase {
  id: string;
  credentialId: string;
  candidateName: string;
  credentialTitle: string;
  category: string;
  priority: 'High' | 'Normal' | 'Urgent';
  slaDeadline: string;
  complexity: 'Standard' | 'Elevated' | 'Forensic';
  jurisdiction: string;
  status: 'Unassigned' | 'Assigned' | 'Under_Review' | 'QA_Review' | 'Completed' | 'Disputed';
  assignedAgentId?: string;
  conflictDeclared: boolean;
  conflictAcknowledgeTimestamp?: string;
  evidenceChecklist: { item: string; checked: boolean; notes?: string }[];
  qaApprover?: string;
  payoutAmountKES: number;
}

// --- CREDENTIAL ISSUER PORTAL ---

export interface CredentialIssuer {
  id: string;
  orgName: string;
  orgType: 'University' | 'Licensing Board' | 'Certification Authority' | 'Regulator';
  accreditationNumber: string;
  verifiedDomain: string;
  issuedCount: number;
  authorizedSigners: string[];
}

// --- VERIFICATION MARKETPLACE & BILLING ---

export interface VerificationMarketplacePackage {
  id: string;
  title: string;
  priceKES: number;
  turnaroundDays: number;
  coverageItems: string[];
  targetAudience: 'Candidate' | 'Employer';
  isPopular?: boolean;
}

