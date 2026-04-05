
export enum VerificationStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending Verification',
  VERIFIED = 'Verified & Authentic',
  REJECTED = 'Rejected / Incomplete',
  FLAGGED = 'Flagged / Suspicious',
  CREDENTIAL_MISMATCH = 'Credential Mismatch',
  AUTHENTICATED = 'Fully Authenticated',
  SUSPICIOUS_ACTIVITY = 'Suspicious Activity Detected',
}

export enum UserRole {
  JobSeeker,
  Employer,
  Admin,
  Agent,
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