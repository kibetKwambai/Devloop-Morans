import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { Job, JobSeekerProfile, JobRequisition, TalentPool } from '../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: JobSeekerProfile[];
  jobs: Job[];
  requisitions: JobRequisition[];
  talentPools: TalentPool[];
  blindScreeningMode: boolean;
  onSelectCandidate: (candidateId: string) => void;
  onSelectJob: (jobId: string) => void;
  onSelectTab: (tab: 'pipeline' | 'requisitions' | 'interviews' | 'pools' | 'analytics' | 'queue') => void;
  onToggleBlindScreening: () => void;
  onPostNewJob: () => void;
  onExportATS: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  candidates,
  jobs,
  requisitions,
  talentPools,
  blindScreeningMode,
  onSelectCandidate,
  onSelectJob,
  onSelectTab,
  onToggleBlindScreening,
  onPostNewJob,
  onExportATS
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Quick Action Commands
  const quickActions = [
    {
      id: 'act_post_job',
      title: 'Post New Job Requisition',
      subtitle: 'Create and publish an open headcount opening',
      icon: 'plus',
      category: 'Actions',
      action: () => { onPostNewJob(); onClose(); }
    },
    {
      id: 'act_blind_toggle',
      title: blindScreeningMode ? 'Turn Off Blind Screening Mode' : 'Turn On Blind Screening Mode',
      subtitle: 'Mask names & photos to eliminate unconscious bias in hiring',
      icon: 'eye',
      category: 'Actions',
      action: () => { onToggleBlindScreening(); onClose(); }
    },
    {
      id: 'act_export_csv',
      title: 'Export Talent Pipeline to CSV',
      subtitle: 'Download complete ATS candidate records with verification state',
      icon: 'arrowDownTray',
      category: 'Actions',
      action: () => { onExportATS(); onClose(); }
    },
    {
      id: 'nav_requisitions',
      title: 'Go to Requisitions & Approvals',
      subtitle: `View ${requisitions.length} headcount requests and multi-tier sign-offs`,
      icon: 'documentText',
      category: 'Navigation',
      action: () => { onSelectTab('requisitions'); onClose(); }
    },
    {
      id: 'nav_interviews',
      title: 'Go to Interviews & Rubric Scorecards',
      subtitle: 'Manage technical panels, simulator evaluations, and feedback',
      icon: 'calendar',
      category: 'Navigation',
      action: () => { onSelectTab('interviews'); onClose(); }
    },
    {
      id: 'nav_pools',
      title: 'Go to Talent CRM Pools',
      subtitle: `Access ${talentPools.length} curated talent networks & silver medalists`,
      icon: 'userGroup',
      category: 'Navigation',
      action: () => { onSelectTab('pools'); onClose(); }
    },
    {
      id: 'nav_analytics',
      title: 'Go to Funnel & Conversion Analytics',
      subtitle: 'Inspect hiring bottlenecks, time-in-stage, and source ROI',
      icon: 'arrowTrendingUp',
      category: 'Navigation',
      action: () => { onSelectTab('analytics'); onClose(); }
    }
  ];

  // Matched Candidates
  const matchedCandidates = candidates.filter(c => {
    if (!cleanQuery) return false;
    const nameMatch = c.name.toLowerCase().includes(cleanQuery);
    const headlineMatch = c.headline.toLowerCase().includes(cleanQuery);
    const skillsMatch = c.skills.some(s => s.name.toLowerCase().includes(cleanQuery));
    return nameMatch || headlineMatch || skillsMatch;
  }).slice(0, 5);

  // Matched Jobs
  const matchedJobs = jobs.filter(j => {
    if (!cleanQuery) return false;
    return j.title.toLowerCase().includes(cleanQuery) || j.category.toLowerCase().includes(cleanQuery);
  }).slice(0, 4);

  // Filtered Quick Actions
  const matchedActions = quickActions.filter(a => {
    if (!cleanQuery) return true;
    return a.title.toLowerCase().includes(cleanQuery) || a.subtitle.toLowerCase().includes(cleanQuery);
  });

  const totalResults = matchedActions.length + matchedCandidates.length + matchedJobs.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200/80 dark:border-white/10 gap-3">
          <Icon name="search" className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, search candidates, open jobs, or jump to view..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white text-base placeholder-slate-400 dark:placeholder-slate-500 font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md transition-colors"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60 space-y-2">
          {/* Quick Actions / Navigation */}
          {matchedActions.length > 0 && (
            <div className="pt-1">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Commands & Navigation
              </div>
              <div className="space-y-0.5">
                {matchedActions.map(action => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/40 group transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0">
                        <Icon name={action.icon as any} className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {action.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {action.subtitle}
                        </div>
                      </div>
                    </div>
                    <Icon name="arrowRight" className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Candidates */}
          {matchedCandidates.length > 0 && (
            <div className="pt-2">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Candidates
              </div>
              <div className="space-y-0.5">
                {matchedCandidates.map(candidate => {
                  const displayName = blindScreeningMode 
                    ? `Candidate #VH-${candidate.id.slice(-4).toUpperCase()}` 
                    : candidate.name;

                  return (
                    <button
                      key={candidate.id}
                      onClick={() => { onSelectCandidate(candidate.id); onClose(); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/40 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 flex-shrink-0">
                          {blindScreeningMode ? 'VH' : candidate.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-2">
                            <span>{displayName}</span>
                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold">
                              Verified
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {candidate.headline} • {candidate.location}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-2">
                        Inspect Dossier →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matched Open Jobs */}
          {matchedJobs.length > 0 && (
            <div className="pt-2">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Active Job Requisitions
              </div>
              <div className="space-y-0.5">
                {matchedJobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => { onSelectJob(job.id); onClose(); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/40 group transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                        <Icon name="briefcase" className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {job.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {job.category} • {job.location} • {job.salaryRange}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-2">
                      Filter Pipeline →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Icon name="search" className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by candidate skill, position title, or command.</p>
            </div>
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-200 dark:bg-slate-800 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-200 dark:bg-slate-800 rounded">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-200 dark:bg-slate-800 rounded">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="font-semibold text-[11px] text-indigo-600 dark:text-indigo-400">VerifiedHire™ Command Bar</span>
        </div>
      </div>
    </div>
  );
};
