import React, { useState } from 'react';
import { Icon } from './Icon';
import { ATSPipelineStage } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BatchOperationsDockProps {
  selectedCount: number;
  totalFilteredCount: number;
  onClearSelection: () => void;
  onSelectAll: () => void;
  onBulkMoveStage: (targetStage: ATSPipelineStage) => void;
  onBulkSendMessage: () => void;
  onBulkAssignAssessment: () => void;
  onBulkRequestVerification: () => void;
  onBulkExportCSV: () => void;
  onBulkArchive?: () => void;
  customTitle?: string;
}

export const BatchOperationsDock: React.FC<BatchOperationsDockProps> = ({
  selectedCount,
  totalFilteredCount,
  onClearSelection,
  onSelectAll,
  onBulkMoveStage,
  onBulkSendMessage,
  onBulkAssignAssessment,
  onBulkRequestVerification,
  onBulkExportCSV,
  onBulkArchive,
  customTitle
}) => {
  const [showStageMenu, setShowStageMenu] = useState(false);

  const stages: { id: ATSPipelineStage; label: string }[] = [
    { id: 'Applied', label: '1. Applied' },
    { id: 'Screening', label: '2. Screening' },
    { id: 'Interview', label: '3. Interview' },
    { id: 'Assessment', label: '4. Assessment' },
    { id: 'BackgroundCheck', label: '5. Trust Check' },
    { id: 'Offer', label: '6. Offer Extended' },
    { id: 'Hired', label: '7. Hired' },
    { id: 'Rejected', label: 'Archive / Rejected' }
  ];

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.94 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 28,
              mass: 0.7
            }}
            className="pointer-events-auto max-w-4xl w-full bg-slate-950/95 dark:bg-slate-900/98 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/20 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sm:gap-4 ring-1 ring-black/10"
          >
            {/* Selection Count Pill */}
            <div className="flex items-center gap-2.5">
              <div className="h-7 px-3 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-2 text-xs font-bold font-mono shadow-inner">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                {selectedCount} {customTitle || 'Selected'}
              </div>
              {selectedCount < totalFilteredCount && (
                <button
                  onClick={onSelectAll}
                  className="text-xs text-slate-300 hover:text-white underline decoration-slate-500 font-medium transition-colors"
                >
                  Select all {totalFilteredCount}
                </button>
              )}
            </div>

            {/* Action Buttons Cluster */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap relative">
              
              {/* Move Stage Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStageMenu(!showStageMenu)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98] shadow-sm flex items-center gap-1.5"
                >
                  <Icon name="arrowRight" className="w-3.5 h-3.5" />
                  <span>Move Stage</span>
                  <Icon name="chevronDown" className="w-3 h-3 ml-0.5" />
                </button>

                <AnimatePresence>
                  {showStageMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="absolute bottom-full mb-2 left-0 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden py-1.5 z-50 text-xs font-medium"
                    >
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        Target Pipeline Stage
                      </div>
                      {stages.map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            onBulkMoveStage(s.id);
                            setShowStageMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-between"
                        >
                          <span>{s.label}</span>
                          <Icon name="arrowRight" className="w-3 h-3 opacity-60" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bulk Email */}
              <button
                onClick={onBulkSendMessage}
                className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all active:scale-[0.98] flex items-center gap-1.5"
                title="Send direct email notification to selected candidates"
              >
                <Icon name="mail" className="w-3.5 h-3.5 text-indigo-400" />
                <span>Bulk Email</span>
              </button>

              {/* Assign Assessment */}
              <button
                onClick={onBulkAssignAssessment}
                className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all active:scale-[0.98] flex items-center gap-1.5"
                title="Assign technical / simulator rubric assessment"
              >
                <Icon name="clipboardDocumentCheck" className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Assign Rubric</span>
              </button>

              {/* Request Trust Verification */}
              <button
                onClick={onBulkRequestVerification}
                className="hidden sm:inline-flex items-center px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all active:scale-[0.98] gap-1.5"
                title="Trigger automated primary-source registry check"
              >
                <Icon name="shieldCheck" className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verify</span>
              </button>

              {/* Archive */}
              <button
                onClick={() => {
                  if (onBulkArchive) {
                    onBulkArchive();
                  } else {
                    onBulkMoveStage('Rejected');
                  }
                }}
                className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white rounded-xl text-xs font-bold border border-rose-800/60 transition-all active:scale-[0.98] flex items-center gap-1.5"
                title="Archive selected candidates"
              >
                <Icon name="archiveBox" className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>

              {/* Export Selected */}
              <button
                onClick={onBulkExportCSV}
                className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all active:scale-[0.98] flex items-center gap-1.5"
                title="Download CSV for selected candidates"
              >
                <Icon name="arrowDownTray" className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Export</span>
              </button>

              {/* Deselect / Clear */}
              <button
                onClick={onClearSelection}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors ml-1"
                title="Clear candidate selection"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
