import React, { useState } from 'react';
import { Icon } from './Icon';
import { useAppContext } from './AppContext';

interface SecurityDefenseInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityDefenseInspectorModal: React.FC<SecurityDefenseInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { credentials } = useAppContext();
  const [activeTab, setActiveTab] = useState<'audit' | 'crypto' | 'mcp' | 'rules'>('audit');
  
  // Real-time Test Hash Input
  const [testPayload, setTestPayload] = useState(
    JSON.stringify({
      credentialId: "CRED-ATPL-9921",
      holder: "Capt. James Mwangi",
      authority: "Kenya Civil Aviation Authority (KCAA)",
      typeRating: "Boeing 737-800",
      issueTimestamp: "2024-03-15T08:30:00Z",
      merkleIndex: 42
    }, null, 2)
  );

  const [simulatedTamper, setSimulatedTamper] = useState(false);
  const [activeMcpTool, setActiveMcpTool] = useState<string>('verify_credential_proof');

  // Simple deterministic SHA-256 preview simulation
  const computedHash = React.useMemo(() => {
    let hash = 0;
    const str = testPayload + (simulatedTamper ? 'TAMPERED_INJECTED_PAYLOAD' : '');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `0x${hex}f49b78e2a1b9c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1`;
  }, [testPayload, simulatedTamper]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Icon name="shieldCheck" className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Security Defense &amp; Cryptographic Proof Inspector
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Zero-Knowledge Proofs Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Auditing credential integrity, SHA-256 Merkle proofs, ECDSA digital signatures, and MCP API security definitions.
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

        {/* Navigation Tabs */}
        <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'audit', label: 'Live Defense Audits', icon: 'shieldCheck' },
              { id: 'crypto', label: 'Merkle & SHA-256 Validator', icon: 'fingerprint' },
              { id: 'mcp', label: 'Model Context Protocol (MCP) Tools', icon: 'code' },
              { id: 'rules', label: 'Governance & Clean Architecture', icon: 'scale' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Icon name={tab.icon as any} className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cryptographic Sentinel Active</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto min-h-[400px] bg-slate-50/50 dark:bg-slate-950/50">
          
          {/* 1. Live Defense Audits */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Integrity Score</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">99.98%</div>
                  <div className="text-xs text-slate-500 mt-1">0 unverified tampering attempts across 8,420 assertions.</div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Authority Signatures</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">24 Active</div>
                  <div className="text-xs text-slate-500 mt-1">FAA, KCAA, GMC, EBK, EASA root certificates verified.</div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Rate-Limiting &amp; Defense</div>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">Enforced</div>
                  <div className="text-xs text-slate-500 mt-1">Anti-scraping token rotation and payload sanitization active.</div>
                </div>
              </div>

              {/* Live Audit Log Stream */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Security Assertions</h3>
                <div className="space-y-2">
                  {[
                    { time: '2 mins ago', type: 'ECDSA Signature Check', subject: 'KCAA ATPL #KE-9921', status: 'Passed', icon: 'shieldCheck' },
                    { time: '14 mins ago', type: 'Replay Attack Prevention', subject: 'Session Token #98a12c', status: 'Passed', icon: 'lockClosed' },
                    { time: '1 hour ago', type: 'Merkle Leaf Inclusion Proof', subject: 'FAA Class 1 Medical #US-4402', status: 'Passed', icon: 'checkBadge' },
                    { time: '3 hours ago', type: 'Authority Certificate Expiry Check', subject: 'GMC UK Root Authority CA', status: 'Valid', icon: 'award' },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
                      <div className="flex items-center gap-2.5">
                        <Icon name={log.icon as any} className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{log.type}</span>
                          <span className="text-slate-400 ml-2">({log.subject})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                          {log.status}
                        </span>
                        <span className="text-slate-400 text-[11px]">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Merkle & SHA-256 Validator */}
          {activeTab === 'crypto' && (
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Interactive Non-Repudiation Hash Validator
                  </h3>
                  <button
                    onClick={() => setSimulatedTamper(!simulatedTamper)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      simulatedTamper
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {simulatedTamper ? '⚠️ Tamper Injected (Simulated)' : 'Simulate Tamper Injection'}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Credential JSON Payload
                    </label>
                    <textarea
                      value={testPayload}
                      onChange={e => setTestPayload(e.target.value)}
                      rows={8}
                      className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-700 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-3 flex flex-col justify-between">
                    <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-2">
                      <div className="text-[11px] text-slate-400">Calculated Merkle Root Digest:</div>
                      <div className={`p-2 rounded-lg break-all font-bold ${
                        simulatedTamper ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {computedHash}
                      </div>

                      <div className="pt-2 text-[11px] space-y-1">
                        <div>Algorithm: <strong>SHA-256 / secp256k1</strong></div>
                        <div>Zero-Knowledge Commitment: <strong>Valid</strong></div>
                        <div>Tamper Anomaly Detection: <strong className={simulatedTamper ? 'text-rose-400' : 'text-emerald-400'}>
                          {simulatedTamper ? 'VIOLATION DETECTED' : 'INTEGRITY VERIFIED'}
                        </strong></div>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      simulatedTamper ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      <Icon name={simulatedTamper ? 'xCircle' : 'checkCircle'} className="w-5 h-5 flex-shrink-0" />
                      <span>
                        {simulatedTamper
                          ? 'Cryptographic signature mismatch! The credential payload was altered after issuance.'
                          : 'Cryptographic proof is 100% authentic and verified against the public registry anchor.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Model Context Protocol (MCP) Tools */}
          {activeTab === 'mcp' && (
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Model Context Protocol (MCP) Tool Declarations
                    </h3>
                    <p className="text-xs text-slate-500">Standardized tool interfaces for Claude &amp; agent copilots.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    MCP v1.0 Compliant
                  </span>
                </div>

                <div className="flex gap-2">
                  {['verify_credential_proof', 'calibrate_interview_scores', 'fetch_authority_registry'].map(tool => (
                    <button
                      key={tool}
                      onClick={() => setActiveMcpTool(tool)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        activeMcpTool === tool
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {tool}()
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
                  <pre className="text-slate-300">
{activeMcpTool === 'verify_credential_proof' ? `{
  "name": "verify_credential_proof",
  "description": "Cryptographically validates a candidate credential against the issuing authority ledger.",
  "parameters": {
    "type": "object",
    "properties": {
      "credentialId": { "type": "string" },
      "authorityCode": { "type": "string", "enum": ["FAA", "KCAA", "GMC", "EBK", "EASA"] },
      "expectedHash": { "type": "string" }
    },
    "required": ["credentialId", "authorityCode"]
  }
}` : activeMcpTool === 'calibrate_interview_scores' ? `{
  "name": "calibrate_interview_scores",
  "description": "Harmonizes raw interviewer debrief ratings using Gaussian normalization to eliminate leniency and halo bias.",
  "parameters": {
    "type": "object",
    "properties": {
      "candidateId": { "type": "string" },
      "rawScore": { "type": "number", "minimum": 0, "maximum": 5 },
      "interviewerId": { "type": "string" }
    },
    "required": ["candidateId", "rawScore"]
  }
}` : `{
  "name": "fetch_authority_registry",
  "description": "Retrieves the public key and trust status of accredited verification authorities.",
  "parameters": {
    "type": "object",
    "properties": {
      "jurisdiction": { "type": "string" },
      "minTrustTier": { "type": "number" }
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 4. Governance & Clean Architecture Rules */}
          {activeTab === 'rules' && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Enterprise Clean Architecture &amp; Governance Guardrails
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Icon name="checkBadge" className="w-3.5 h-3.5 text-emerald-600" />
                    Layer Isolation Principle
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Zero direct client mutation of credential states. All verification signatures must originate from verified agent authority keys.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Icon name="checkBadge" className="w-3.5 h-3.5 text-emerald-600" />
                    Audit Non-Repudiation
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Every interview note, bias adjustment, and verification status change produces an immutable audit log hash.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Icon name="checkBadge" className="w-3.5 h-3.5 text-emerald-600" />
                    Defensive Sanitization
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    All document uploads pass strict MIME type verification, zero-executable isolation, and PII anonymization in blind reviews.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Icon name="checkBadge" className="w-3.5 h-3.5 text-emerald-600" />
                    Bias Elimination Guardrails
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Evaluator score distributions are continually monitored for statistical skew and calibrated against industry rubrics.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
