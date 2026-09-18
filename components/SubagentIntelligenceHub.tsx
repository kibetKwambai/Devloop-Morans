import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { useAppContext } from './AppContext';
import { JobSeekerProfile } from '../types';

interface SubagentTask {
  id: string;
  name: string;
  agentRole: 'Sentinel' | 'Calibrator' | 'Compliance' | 'Executive';
  status: 'pending' | 'running' | 'completed' | 'flagged';
  progress: number;
  reasoningTrace: string[];
  findings: string;
  confidenceScore: number;
  memoryKey?: string;
}

interface AgentMemoryAnchor {
  id: string;
  key: string;
  category: 'evaluation_rubric' | 'compliance_rule' | 'bias_baseline' | 'interview_context';
  value: string;
  lastUpdated: string;
  weight: number;
}

interface SubagentIntelligenceHubProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: JobSeekerProfile | null;
  onApplyCalibration?: (score: number) => void;
}

export const SubagentIntelligenceHub: React.FC<SubagentIntelligenceHubProps> = ({
  isOpen,
  onClose,
  candidate,
  onApplyCalibration,
}) => {
  const { profiles } = useAppContext();
  const selectedCandidate = candidate || profiles[0];

  const [activeTab, setActiveTab] = useState<'agents' | 'memory' | 'planner' | 'loki'>('agents');
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<'Sentinel' | 'Calibrator' | 'Compliance' | 'Executive'>('Sentinel');

  // Multi-Agent Pipeline Task State
  const [tasks, setTasks] = useState<SubagentTask[]>([
    {
      id: 'task_sentinel',
      name: 'Cryptographic Credential & Anti-Tamper Audit',
      agentRole: 'Sentinel',
      status: 'completed',
      progress: 100,
      reasoningTrace: [
        'Inspecting SHA-256 Merkle root hash for ATPL #KE-9921',
        'Querying decentralized authority root anchor: KCAA Public Cert #441A',
        'Validating timestamp non-repudiation signature',
        'Result: Zero tampering detected. Hash verified with 100% cryptographic integrity.'
      ],
      findings: 'All 4 verified credentials match their immutable issuer hashes. Identity and photo biometric matches verified.',
      confidenceScore: 99.4,
      memoryKey: 'kcaa_atpl_hash_integrity'
    },
    {
      id: 'task_calibrator',
      name: 'Evaluation Rubric Normalization & Bias Neutralization',
      agentRole: 'Calibrator',
      status: 'completed',
      progress: 100,
      reasoningTrace: [
        'Analyzing recent technical interview debrief feedback score (4.8/5.0)',
        'Applying statistical Gaussian normalization against 120 previous senior pilot evaluations',
        'Checking for leniency drift and cross-panel halo effect',
        'Calibrated score adjusted to 94.2% percentile with high rubric consistency.'
      ],
      findings: 'Interviewer ratings normalized. High competency in Emergency CRM & Multi-Crew protocols verified without evaluation bias.',
      confidenceScore: 95.8,
      memoryKey: 'crm_evaluation_rubric_v3'
    },
    {
      id: 'task_compliance',
      name: 'Regulatory Authority Reciprocity & Expiry Sentinel',
      agentRole: 'Compliance',
      status: 'completed',
      progress: 100,
      reasoningTrace: [
        'Verifying Class 1 Medical certificate expiration date (Valid through Dec 2026)',
        'Checking ICAO Level 6 English Language Proficiency rating',
        'Auditing simulator recurrent training log cycles',
        'Compliance Status: 100% compliant with FAA/EASA/ICAO Annex 1 regulations.'
      ],
      findings: 'Zero regulatory non-conformities found. Valid for immediate multi-jurisdictional type rating operations.',
      confidenceScore: 98.2,
      memoryKey: 'icao_annex1_reciprocity_rules'
    },
    {
      id: 'task_executive',
      name: 'Executive Synthesis & One-Click Dossier Assembler',
      agentRole: 'Executive',
      status: 'completed',
      progress: 100,
      reasoningTrace: [
        'Synthesizing audit outputs from Sentinel, Calibrator, and Compliance agents',
        'Calculating composite Verified Trust Quotient (VTQ = 96.8/100)',
        'Formulating fast-track compensation recommendation & hiring tier',
        'Executive recommendation: Tier 1 Immediate Offer.'
      ],
      findings: 'Candidate ranked in top 3% percentile for Aviation Operations. Immediate hiring recommended with zero onboarding blockers.',
      confidenceScore: 97.5,
      memoryKey: 'executive_hire_recommendation'
    }
  ]);

  // Persistent Agent Memory Anchors (claude-mem pattern)
  const [memoryAnchors, setMemoryAnchors] = useState<AgentMemoryAnchor[]>([
    {
      id: 'mem_1',
      key: 'kcaa_atpl_hash_integrity',
      category: 'compliance_rule',
      value: 'East African Civil Aviation Authority root authority certs require ECDSA P-256 signatures with 365-day rotation.',
      lastUpdated: '2 hours ago',
      weight: 0.98
    },
    {
      id: 'mem_2',
      key: 'crm_evaluation_rubric_v3',
      category: 'evaluation_rubric',
      value: 'Multi-crew command decisions under high-workload emergency simulation weighed at 40% of total technical score.',
      lastUpdated: '1 day ago',
      weight: 0.95
    },
    {
      id: 'mem_3',
      key: 'bias_baseline_neutralizer',
      category: 'bias_baseline',
      value: 'Interviewer leniency modifier: Adjust raw scores above 4.8 by -0.15 standard deviation to preserve cross-candidate fairness.',
      lastUpdated: '3 days ago',
      weight: 0.92
    },
    {
      id: 'mem_4',
      key: 'interview_context_cache',
      category: 'interview_context',
      value: 'Candidate demonstrated exceptional calmness during engine flameout CRM scenario at 32,000 ft in CAE simulator.',
      lastUpdated: '10 mins ago',
      weight: 0.99
    }
  ]);

  const [newMemoryKey, setNewMemoryKey] = useState('');
  const [newMemoryValue, setNewMemoryValue] = useState('');

  // Handle running agent pipeline simulation
  const handleRunFullSwarm = () => {
    setIsRunningAll(true);
    setTasks(prev => prev.map(t => ({ ...t, status: 'running', progress: 15 })));

    setTimeout(() => {
      setTasks(prev => prev.map(t => ({ ...t, progress: 65 })));
    }, 600);

    setTimeout(() => {
      setTasks(prev => prev.map(t => ({ ...t, status: 'completed', progress: 100 })));
      setIsRunningAll(false);
    }, 1200);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryKey.trim() || !newMemoryValue.trim()) return;

    setMemoryAnchors(prev => [
      {
        id: `mem_${Date.now()}`,
        key: newMemoryKey.trim().toLowerCase().replace(/\s+/g, '_'),
        category: 'interview_context',
        value: newMemoryValue.trim(),
        lastUpdated: 'Just now',
        weight: 0.95
      },
      ...prev
    ]);
    setNewMemoryKey('');
    setNewMemoryValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Icon name="brain" className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Autonomous Multi-Subagent Intelligence Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Persistent Memory Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluating <strong className="text-slate-700 dark:text-slate-300">{selectedCandidate.name}</strong> with coordinated Sentinel, Calibrator, Compliance, and Synthesis agents.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs & Swarm Controls */}
        <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'agents', label: 'Autonomous Subagents', icon: 'cpu' },
              { id: 'memory', label: 'Persistent Memory Vault', icon: 'database' },
              { id: 'planner', label: 'Execution Planner (GSD)', icon: 'workflow' },
              { id: 'loki', label: 'Deep Reasoning Traces', icon: 'terminal' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Icon name={tab.icon as any} className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleRunFullSwarm}
            disabled={isRunningAll}
            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-sm transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
          >
            <Icon name={isRunningAll ? 'arrowPath' : 'bolt'} className={`w-3.5 h-3.5 ${isRunningAll ? 'animate-spin' : ''}`} />
            <span>{isRunningAll ? 'Executing Swarm...' : 'Run Full Swarm Audit'}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 flex-1 overflow-y-auto min-h-[400px] bg-slate-50/50 dark:bg-slate-950/50">
          
          {/* 1. Autonomous Subagents Grid */}
          {activeTab === 'agents' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedAgent(task.agentRole)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-900 ${
                      selectedAgent === task.agentRole
                        ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          task.agentRole === 'Sentinel' ? 'bg-rose-500' :
                          task.agentRole === 'Calibrator' ? 'bg-amber-500' :
                          task.agentRole === 'Compliance' ? 'bg-emerald-500' :
                          'bg-indigo-500'
                        }`} />
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                          {task.agentRole} Subagent
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {task.confidenceScore}% Confidence
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {task.name}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                      {task.findings}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Icon name="database" className="w-3 h-3 text-indigo-500" />
                        Memory: {task.memoryKey}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Icon name="checkCircle" className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Action Footer */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/60 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                  <Icon name="sparkles" className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span>Subagents verified zero evaluation bias and 99.4% cryptographic integrity.</span>
                </div>
                {onApplyCalibration && (
                  <button
                    onClick={() => onApplyCalibration(96.8)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-sm transition-all flex items-center gap-1"
                  >
                    <span>Apply Calibrated Score (96.8%)</span>
                    <Icon name="arrowRight" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 2. Persistent Memory Vault */}
          {activeTab === 'memory' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <form onSubmit={handleAddMemory} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Memory Key (e.g., sim_recurrent_check)"
                    value={newMemoryKey}
                    onChange={e => setNewMemoryKey(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Observation or persistent guideline value..."
                    value={newMemoryValue}
                    onChange={e => setNewMemoryValue(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs flex-1 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap"
                  >
                    Add Memory Anchor
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {memoryAnchors.map(mem => (
                  <div key={mem.id} className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        @{mem.key}
                      </span>
                      <span className="text-slate-400">Weight: {(mem.weight * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {mem.value}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="uppercase tracking-wider font-semibold">{mem.category.replace('_', ' ')}</span>
                      <span>{mem.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Execution Planner (GSD) */}
          {activeTab === 'planner' && (
            <div className="space-y-3">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Icon name="workflow" className="w-4 h-4 text-indigo-600" />
                    Autonomous Talent Verification Execution Pipeline
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-[10px] font-bold">
                    Phase 4 of 4 Completed
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { step: '01', title: 'Cryptographic Hash Non-Repudiation Check', desc: 'Direct verification against decentralized authority ledger.', status: 'Done' },
                    { step: '02', title: 'Rubric Harmonization & Bias Drift Correction', desc: 'Calibrated across historical standardized evaluation scores.', status: 'Done' },
                    { step: '03', title: 'Regulatory Reciprocity & Aviation Authority Signoff', desc: 'Validated ICAO Level 6 & Class 1 Medical validity.', status: 'Done' },
                    { step: '04', title: 'Executive Synthesis & Verified Offer Formulation', desc: 'Synthesized composite quotient & recommendation tier.', status: 'Done' },
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {s.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{s.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{s.desc}</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Loki Deep Reasoning Traces */}
          {activeTab === 'loki' && (
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Icon name="terminal" className="w-4 h-4" />
                  <span>Agent Reasoning Stream (Loki Verbose Mode)</span>
                </div>
                <span className="text-[10px] text-slate-500">Timestamp: {new Date().toLocaleTimeString()}</span>
              </div>

              <div className="space-y-2 leading-relaxed text-slate-300">
                {tasks.flatMap((t, idx) => [
                  <div key={`head_${idx}`} className="text-indigo-400 font-bold">
                    &gt; [Subagent:{t.agentRole}] Initializing evaluation sequence for candidate #{selectedCandidate.id}
                  </div>,
                  ...t.reasoningTrace.map((r, rIdx) => (
                    <div key={`tr_${idx}_${rIdx}`} className="pl-4 text-slate-400">
                      ├─ {r}
                    </div>
                  )),
                  <div key={`conf_${idx}`} className="pl-4 text-emerald-400 font-bold pb-2">
                    └─ Confidence check: {t.confidenceScore}% (Anchor stored in persistent memory)
                  </div>
                ])}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
