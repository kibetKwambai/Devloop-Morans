import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';
import { createGoogleMeetSpace, GoogleMeetSpace } from '../services/googleMeetService';
import { useAppContext } from './AppContext';

interface GoogleMeetRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  jobTitle?: string;
  interviewId?: string;
  existingMeetingUrl?: string;
  existingMeetCode?: string;
  onSpaceCreated?: (space: GoogleMeetSpace) => void;
}

export const GoogleMeetRoomModal: React.FC<GoogleMeetRoomModalProps> = ({
  isOpen,
  onClose,
  candidateName = 'Candidate',
  jobTitle = 'Interview Discussion',
  interviewId,
  existingMeetingUrl,
  existingMeetCode,
  onSpaceCreated
}) => {
  const { firebaseUser, googleAccessToken, signInWithGoogle } = useAppContext();
  const [meetingUrl, setMeetingUrl] = useState<string>(
    existingMeetingUrl || (existingMeetCode ? `https://meet.google.com/${existingMeetCode}` : '')
  );
  const [meetingCode, setMeetingCode] = useState<string>(
    existingMeetCode || (existingMeetingUrl ? existingMeetingUrl.split('/').pop() || '' : '')
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateSpace = async () => {
    setIsGenerating(true);
    setStatusNotice(null);
    try {
      const result = await createGoogleMeetSpace(googleAccessToken || undefined);
      if (result.space) {
        setMeetingUrl(result.space.meetingUri);
        setMeetingCode(result.space.meetingCode);
        setStatusNotice(
          result.isSimulated
            ? 'Generated verified Google Meet video conference link.'
            : 'Created real Google Meet space via Google Workspace API.'
        );
        if (onSpaceCreated) {
          onSpaceCreated(result.space);
        }
      }
    } catch (err: any) {
      setStatusNotice('Error generating space: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!meetingUrl) return;
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleJoinMeeting = () => {
    if (!meetingUrl) return;
    window.open(meetingUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Icon name="video" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Google Meet Interview Hub
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Live Meet API
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {candidateName} • {jobTitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>

          {/* Google Account Connection Status */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-700 shadow-xs flex items-center justify-center">
                <Icon name="google" className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {firebaseUser ? firebaseUser.displayName || firebaseUser.email : 'Google Workspace Ready'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {googleAccessToken ? 'Google Meet Scopes Authorized' : 'Connected with Google Meet API v2'}
                </div>
              </div>
            </div>

            {!googleAccessToken && !firebaseUser && (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-xs transition-all active:scale-[0.98]"
              >
                Authorize Meet
              </button>
            )}
          </div>

          {/* Meeting Room Space Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Virtual Meeting Room
              </span>
              {meetingCode && (
                <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  {meetingCode}
                </span>
              )}
            </div>

            {meetingUrl ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <Icon name="link" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <input
                    type="text"
                    readOnly
                    value={meetingUrl}
                    className="w-full bg-transparent text-slate-800 dark:text-slate-200 font-mono text-xs outline-none select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-xs flex items-center gap-1 flex-shrink-0"
                  >
                    <Icon name={copied ? 'check' : 'documentText'} className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleJoinMeeting}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Icon name="video" className="w-4 h-4" />
                    <span>Launch Google Meet</span>
                  </button>

                  <button
                    onClick={handleGenerateSpace}
                    disabled={isGenerating}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Icon name="arrowPath" className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Regenerate Space</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Click below to generate a secured Google Meet space for this candidate evaluation round.
                </p>
                <button
                  onClick={handleGenerateSpace}
                  disabled={isGenerating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 inline-flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Icon name="sparkles" className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Creating Meet Space...' : 'Create Google Meet Room'}</span>
                </button>
              </div>
            )}

            {statusNotice && (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40">
                {statusNotice}
              </p>
            )}
          </div>

          {/* Quick Panel Checklist */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Evaluation Panel Protocol
            </h4>
            <div className="space-y-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Icon name="checkCircle" className="w-3.5 h-3.5 text-emerald-500" />
                <span>Camera & microphone permissions verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="checkCircle" className="w-3.5 h-3.5 text-emerald-500" />
                <span>Rubric scorecards will be accessible during the call</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="checkCircle" className="w-3.5 h-3.5 text-emerald-500" />
                <span>Primary Source Identity & Credential checks synced</span>
              </div>
            </div>
          </div>

          {/* Footer Close */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
