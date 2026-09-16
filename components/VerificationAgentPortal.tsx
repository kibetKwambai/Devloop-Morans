import React, { useState } from 'react';
import { VerificationCase } from '../types';
import { useAppContext } from './AppContext';
import { Icon } from './Icon';

export const VerificationAgentPortal: React.FC = () => {
  const { 
    agentCases, 
    declareCaseConflict, 
    updateCaseChecklist, 
    submitCaseQA 
  } = useAppContext();

  const [activeCaseId, setActiveCaseId] = useState<string>(agentCases[0]?.id || '');
  const [swornConflictConsent, setSwornConflictConsent] = useState(false);

  const currentCase = agentCases.find(c => c.id === activeCaseId) || agentCases[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight">Accredited Agent Operating Portal</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Agent ID: #AG-041 (KCAA & EBK Certified)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Audit candidate credential claims, verify statutory registries, conduct in-person folio inspections, and issue forensic chain-of-custody attestations.
          </p>
        </div>

        {/* Payouts summary */}
        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-right flex-shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Agent Earnings</span>
          <p className="text-xl font-black text-emerald-400 font-mono">KES 48,500</p>
          <span className="text-[10px] text-teal-300">14 Verified Cases Audited</span>
        </div>
      </div>

      {/* Main Agent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Assigned Case Queue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Verification Case Queue ({agentCases.length})
            </h2>
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">Active SLA Monitor</span>
          </div>

          <div className="space-y-3">
            {agentCases.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  setActiveCaseId(c.id);
                  setSwornConflictConsent(false);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeCaseId === c.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{c.candidateName}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    c.priority === 'Urgent' 
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {c.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">{c.credentialTitle}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>SLA: {c.slaDeadline}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">KES {c.payoutAmountKES.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center & Right Column: Active Case Forensic Workstation */}
        <div className="lg:col-span-2 space-y-6">
          {currentCase && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      CASE #{currentCase.id}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Jurisdiction: {currentCase.jurisdiction}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{currentCase.credentialTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Candidate Subject: <strong className="text-slate-800 dark:text-slate-200">{currentCase.candidateName}</strong></p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400 block">Payout Upon QA Pass</span>
                  <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">KES {currentCase.payoutAmountKES.toLocaleString()}</span>
                </div>
              </div>

              {/* Section 25: Mandatory Conflict-of-Interest Declaration */}
              {!currentCase.conflictDeclared ? (
                <div className="bg-amber-50 dark:bg-amber-950/40 p-6 rounded-2xl border-2 border-amber-300 dark:border-amber-800 space-y-4">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
                    <Icon name="shieldCheck" className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <h4 className="text-sm font-bold">Mandatory Conflict-of-Interest Declaration (Section 25)</h4>
                  </div>
                  <p className="text-xs text-amber-950/80 dark:text-amber-200/80 leading-relaxed">
                    To maintain strict forensic integrity and regulatory compliance under KCAA/EBK verification rules, you must certify that you have no personal, familial, commercial, or prior supervisory relationship with <strong>{currentCase.candidateName}</strong>.
                  </p>

                  <label className="flex items-start gap-3 text-xs text-slate-800 dark:text-slate-200 cursor-pointer pt-1">
                    <input 
                      type="checkbox" 
                      checked={swornConflictConsent} 
                      onChange={(e) => setSwornConflictConsent(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 mt-0.5"
                    />
                    <span>
                      I hereby solemnly declare under penalty of accreditation revocation that I have <strong>zero conflict of interest</strong> with this candidate and will conduct an impartial evidence audit.
                    </span>
                  </label>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      disabled={!swornConflictConsent}
                      onClick={() => declareCaseConflict(currentCase.id, false)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        swornConflictConsent 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Sign Impartiality Declaration & Begin Audit
                    </button>

                    <button
                      onClick={() => declareCaseConflict(currentCase.id, true)}
                      className="px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                    >
                      Declare Conflict & Recuse Myself
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Evidence Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Forensic Audit Checklist</span>
                      <span className="text-xs font-normal text-slate-500">All checks required for QA seal</span>
                    </h4>

                    <div className="space-y-2">
                      {currentCase.evidenceChecklist.map((item, idx) => (
                        <div 
                          key={idx}
                          className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs"
                        >
                          <input 
                            type="checkbox"
                            checked={item.checked}
                            onChange={(e) => updateCaseChecklist(currentCase.id, idx, e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 mt-0.5 cursor-pointer"
                          />
                          <div className="flex-1 space-y-1">
                            <span className={`font-semibold ${item.checked ? 'text-slate-900 dark:text-white line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`}>
                              {item.item}
                            </span>
                            {item.notes && (
                              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                                Auditor Note: {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission to QA */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">Tier-2 Quality Assurance Review</h5>
                      <p className="text-[11px] text-slate-500">Submission transmits findings to Dr. Stella Mutua (Senior QA Lead) for final cryptographic seal.</p>
                    </div>

                    <button
                      onClick={() => submitCaseQA(currentCase.id)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
                    >
                      <Icon name="check" className="w-4 h-4" />
                      Approve & Submit for QA Seal
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
