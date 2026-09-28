
import React from 'react';
import { JobSeekerProfile, VerificationStatus, UserRole } from '../types';
import { Icon } from './Icon';

interface ProfileHeaderProps {
  profile: JobSeekerProfile;
  viewerRole?: UserRole; // Optional: to determine if controls should be shown
}

const statusStyles: Record<VerificationStatus, string> = {
  [VerificationStatus.DRAFT]: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
  [VerificationStatus.VERIFIED]: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  [VerificationStatus.PENDING]: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
  [VerificationStatus.REJECTED]: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
  [VerificationStatus.FLAGGED]: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  [VerificationStatus.CREDENTIAL_MISMATCH]: 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
  [VerificationStatus.AUTHENTICATED]: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
  [VerificationStatus.SUSPICIOUS_ACTIVITY]: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border border-rose-400',
  [VerificationStatus.SELF_DECLARED]: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
  [VerificationStatus.DOCUMENT_SUBMITTED]: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200',
  [VerificationStatus.SOURCE_VERIFIED]: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300',
  [VerificationStatus.ISSUER_VERIFIED]: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300',
  [VerificationStatus.ACCREDITED_AGENT_VERIFIED]: 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-300',
  [VerificationStatus.CROSS_CHECKED]: 'bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-300',
  [VerificationStatus.EXPIRED]: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300',
  [VerificationStatus.VERIFICATION_DUE]: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300',
  [VerificationStatus.UNDER_REVIEW]: 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300',
  [VerificationStatus.DISPUTED]: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300',
  [VerificationStatus.REVOKED]: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border-2 border-rose-500',
  [VerificationStatus.UNABLE_TO_VERIFY]: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300',
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const isVerified = profile.verificationStatus === VerificationStatus.VERIFIED;

  const defaultBio = profile.bio || 
    `${profile.headline || 'Verified Professional'}. Demonstrated track record across high-reliability systems, primary-source verified academic degrees, and clean regulatory statutory standing. Accredited by VerifiedHire sovereign trust network.`;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img 
            className="h-28 w-28 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm" 
            src={profile.photoUrl} 
            alt={profile.name} 
          />
          {isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1 rounded-lg shadow-sm" title="Cryptographically Verified">
              <Icon name="shieldCheck" className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="flex-grow text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {profile.name}
                </h1>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusStyles[profile.verificationStatus]}`}>
                  {profile.verificationStatus}
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {profile.headline}
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                <Icon name="checkCircle" className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Primary Source Attested</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Icon name="location" className="h-3.5 w-3.5 text-slate-400" />
              <span>{profile.location}</span>
            </span>
            <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Icon name="mail" className="h-3.5 w-3.5 text-slate-400" />
              <span>{profile.email}</span>
            </a>
            <span className="flex items-center gap-1.5">
              <Icon name="phone" className="h-3.5 w-3.5 text-slate-400" />
              <span>{profile.phone}</span>
            </span>
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Icon name="externalLink" className="h-3.5 w-3.5 text-slate-400" />
                <span>LinkedIn Verified</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Professional Executive Summary */}
      <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon name="documentText" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Executive Career Overview &amp; Attestation
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Candidate ID: {profile.id}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {defaultBio}
        </p>

        {/* Verification Provenance Badges (Consistently styled, no random colors) */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
            <Icon name="shieldCheck" className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>National Identity (Maisha Card) Checked</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
            <Icon name="academicCap" className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>KNEC &amp; University Transcripts Validated</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
            <Icon name="checkCircle" className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>DCI Police Clearance / Good Conduct Verified</span>
          </span>
        </div>
      </div>
    </div>
  );
};