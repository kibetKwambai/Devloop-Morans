
import React, { useState, useCallback } from 'react';
import { JobSeekerProfile, VerificationStatus, UserRole } from '../types';
import { generateProfileSummary } from '../services/geminiService';
import { Icon } from './Icon';

interface ProfileHeaderProps {
  profile: JobSeekerProfile;
  viewerRole?: UserRole; // Optional: to determine if controls should be shown
}

const statusStyles: Record<VerificationStatus, string> = {
  [VerificationStatus.DRAFT]: 'bg-slate-100 text-slate-800 dark:bg-indigo-800 dark:text-indigo-100',
  [VerificationStatus.VERIFIED]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  [VerificationStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  [VerificationStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, viewerRole = UserRole.JobSeeker }) => {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string>('');

  const handleGenerateSummary = useCallback(async () => {
    setIsGenerating(true);
    setSummaryError('');
    setSummary('');
    try {
      const generatedText = await generateProfileSummary(profile);
      setSummary(generatedText);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setSummaryError(e.message);
      } else {
        setSummaryError('An unknown error occurred.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [profile]);

  const isOwner = viewerRole === UserRole.JobSeeker;

  return (
    <div className="bg-white dark:bg-indigo-900 p-6 sm:p-8 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-200 dark:ring-indigo-500/50" src={profile.photoUrl} alt="Profile" />
        <div className="flex-grow text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
          <p className="text-slate-500 dark:text-indigo-300 flex items-center justify-center sm:justify-start">
            <Icon name="mapPin" className="h-4 w-4 mr-1" />
            {profile.location}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm text-slate-600 dark:text-indigo-200">
            <a href={`mailto:${profile.email}`} className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400">
              <Icon name="mail" className="h-4 w-4 mr-1" />
              {profile.email}
            </a>
            <span className="flex items-center">
              <Icon name="phone" className="h-4 w-4 mr-1" />
              {profile.phone}
            </span>
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400">
                <Icon name="externalLink" className="h-4 w-4 mr-1" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
        <div className={`text-sm font-medium px-4 py-2 rounded-full self-center sm:self-start ${statusStyles[profile.verificationStatus]}`}>
          {profile.verificationStatus}
        </div>
      </div>

      {isOwner && (
        <div className="mt-6 border-t border-slate-200 dark:border-indigo-800 pt-6">
          <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">AI-Powered Summary</h3>
              <button
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
              >
                  {isGenerating ? <Icon name="loader" className="animate-spin h-5 w-5 mr-2" /> : <Icon name="sparkles" className="h-5 w-5 mr-2" />}
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
              </button>
          </div>
          
          {isGenerating && (
              <div className="bg-slate-50 dark:bg-indigo-800/50 p-4 rounded-md text-slate-600 dark:text-indigo-200">
                  <p>Gemini is analyzing your profile to create a professional summary...</p>
              </div>
          )}

          {summaryError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-md">
                  <p><span className="font-bold">Error:</span> {summaryError}</p>
                  {summaryError.includes("API Key") && <p className="text-sm mt-1">Please ensure the Gemini API key is correctly configured in your environment variables.</p>}
              </div>
          )}

          {summary && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/50 p-4 rounded-md">
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{summary}</p>
              </div>
          )}
          
          {!summary && !isGenerating && !summaryError && (
              <div className="bg-slate-50 dark:bg-indigo-800/50 p-4 rounded-md text-slate-500 dark:text-indigo-300 text-center">
                  <p>Click the "Generate with AI" button to create a professional summary of your profile.</p>
              </div>
          )}
        </div>
      )}
    </div>
  );
};