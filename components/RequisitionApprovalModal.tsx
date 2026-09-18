import React, { useState } from 'react';
import { Icon } from './Icon';
import { JobRequisition, RequisitionApprovalStep } from '../types';

interface RequisitionApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  requisition: JobRequisition | null;
  onUpdateApproval: (reqId: string, role: string, status: 'Approved' | 'Rejected', comment?: string) => void;
}

export const RequisitionApprovalModal: React.FC<RequisitionApprovalModalProps> = ({
  isOpen,
  onClose,
  requisition,
  onUpdateApproval
}) => {
  const [activeStepRole, setActiveStepRole] = useState<string>('');
  const [commentText, setCommentText] = useState('');
  const [actionStatus, setActionStatus] = useState<'Approved' | 'Rejected' | 'Revision_Requested'>('Approved');

  if (!isOpen || !requisition) return null;

  const handleAction = () => {
    if (!activeStepRole) return;
    onUpdateApproval(requisition.id, activeStepRole, actionStatus === 'Approved' ? 'Approved' : 'Rejected', commentText);
    setActiveStepRole('');
    setCommentText('');
  };

  const approvedCount = requisition.approvals.filter(a => a.status === 'Approved').length;
  const progressPercent = Math.round((approvedCount / requisition.approvals.length) * 100);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
              <Icon name="documentText" className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">{requisition.id}</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {requisition.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Department: {requisition.department} • Hiring Manager: {requisition.hiringManager}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Key Requisition Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Headcount Openings</span>
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{requisition.openingsCount} Positions</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Budget Allocation</span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono truncate block">{requisition.salaryBudget}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Status</span>
              <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                requisition.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                requisition.status === 'Pending_Approval' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {requisition.status.replace('_', ' ')}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Approval Progress</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">{progressPercent}%</span>
            </div>
          </div>

          {/* Multi-Tier Approval Chain */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Multi-Tier Governance Sign-Off Hierarchy
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {approvedCount} of {requisition.approvals.length} Tiers Approved
              </span>
            </div>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-6">
              {requisition.approvals.map((step, idx) => {
                const isApproved = step.status === 'Approved';
                const isPending = step.status === 'Pending';
                const isRejected = step.status === 'Rejected';

                return (
                  <div key={idx} className="relative pl-6">
                    {/* Step Marker */}
                    <div className={`absolute -left-2.5 top-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isApproved ? 'bg-emerald-600 text-white' :
                      isPending ? 'bg-amber-500 text-white animate-pulse' :
                      isRejected ? 'bg-rose-600 text-white' :
                      'bg-slate-300 dark:bg-slate-700 text-slate-600'
                    }`}>
                      {isApproved ? <Icon name="check" className="w-3 h-3" /> : idx + 1}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            {step.role}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            isApproved ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            isPending ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                          {step.approverName}
                        </div>
                        {step.comment && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-1 bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                            "{step.comment}"
                          </p>
                        )}
                        {step.timestamp && (
                          <div className="text-[10px] text-slate-400 mt-1 font-mono">
                            Timestamp: {new Date(step.timestamp).toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Action Trigger for Pending Step */}
                      {isPending && (
                        <button
                          onClick={() => {
                            setActiveStepRole(step.role);
                            setActionStatus('Approved');
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] whitespace-nowrap self-start sm:self-center"
                        >
                          Execute Sign-Off →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Sign-off Drawer / Subform */}
          {activeStepRole && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Executing Sign-off for Tier: <strong className="text-indigo-600 dark:text-indigo-400">{activeStepRole}</strong>
                </span>
                <button 
                  onClick={() => setActiveStepRole('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActionStatus('Approved')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    actionStatus === 'Approved'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Approve Requisition
                </button>
                <button
                  type="button"
                  onClick={() => setActionStatus('Rejected')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    actionStatus === 'Rejected'
                      ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Reject / Request Revisions
                </button>
              </div>

              <textarea
                placeholder="Enter governance notes, compensation notes, or revision reasons..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleAction}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]"
                >
                  Confirm {actionStatus}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Audit Trail Hash: <strong className="font-mono text-[11px] text-slate-500">SHA256_REQ_{requisition.id}_GOV</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
