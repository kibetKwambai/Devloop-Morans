import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { JobSeekerProfile, VerificationStatus, VerifiableCredential, StructuredInterview, Application } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export interface AuditEvent {
  id: string;
  candidateId: string;
  timestamp: string;
  category: 'Verification' | 'Pipeline' | 'Interview' | 'Communication' | 'Security' | 'Note';
  title: string;
  actor: string;
  actorRole: string;
  details: string;
  metadata?: {
    verificationMethod?: string;
    hash?: string;
    stageFrom?: string;
    stageTo?: string;
    panelist?: string;
    ipAddress?: string;
    vaultConsentToken?: string;
  };
  severity?: 'normal' | 'success' | 'warning' | 'critical';
}

interface CandidateAuditTrailProps {
  candidate: JobSeekerProfile;
  credentials?: VerifiableCredential[];
  interviews?: StructuredInterview[];
  application?: Application | null;
  mode?: 'drawer' | 'admin' | 'employer';
}

export const CandidateAuditTrail: React.FC<CandidateAuditTrailProps> = ({
  candidate,
  credentials = [],
  interviews = [],
  application,
  mode = 'drawer'
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate deterministic, realistic audit events based on the candidate's real data
  const auditEvents: AuditEvent[] = useMemo(() => {
    const events: AuditEvent[] = [];
    const baseDate = new Date(application?.appliedAt || '2026-09-10T08:30:00Z');

    // 1. Initial Application & Vault Ingestion
    events.push({
      id: `evt_app_${candidate.id}`,
      candidateId: candidate.id,
      timestamp: baseDate.toISOString(),
      category: 'Pipeline',
      title: 'Application Received & Vault Record Initialized',
      actor: 'System Ingestion Gateway',
      actorRole: 'Autonomous ATS Engine',
      details: `Candidate initiated application for target position. KDPA Consent Token #CT-${candidate.id.slice(-4)} granted for primary-source credential discovery.`,
      metadata: {
        stageFrom: 'Unregistered',
        stageTo: 'Applied',
        vaultConsentToken: `KDPA-VER-2026-09-${candidate.id.slice(-4)}`
      },
      severity: 'normal'
    });

    // 2. Identity & Biometric Hash Check
    const idCheckDate = new Date(baseDate.getTime() + 1000 * 60 * 45);
    events.push({
      id: `evt_id_${candidate.id}`,
      candidateId: candidate.id,
      timestamp: idCheckDate.toISOString(),
      category: 'Security',
      title: 'National Identity & Biometric Liveness Passed',
      actor: 'Identity Trust Engine',
      actorRole: 'Automated Forensic Validator',
      details: 'National Registry IPRS API biometric facial vector matches submitted national ID document with 99.7% confidence.',
      metadata: {
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        ipAddress: '197.232.88.14 (Nairobi, KE)'
      },
      severity: 'success'
    });

    // 3. Credential Verifications from primary source ledger
    credentials.forEach((cred, idx) => {
      const credDate = new Date(baseDate.getTime() + 1000 * 60 * 60 * (3 + idx * 4));
      events.push({
        id: `evt_cred_${cred.id}`,
        candidateId: candidate.id,
        timestamp: credDate.toISOString(),
        category: 'Verification',
        title: `Primary Source Verified: ${cred.title}`,
        actor: cred.verifyingEntity || cred.issuingOrg,
        actorRole: 'Accredited Verification Authority',
        details: `Registry record cross-checked against ${cred.issuingOrg} active registry ledger. Method: ${cred.verificationMethod}. Document status: ${cred.verificationState}.`,
        metadata: {
          verificationMethod: cred.verificationMethod,
          hash: `SHA256-${cred.id.slice(0, 12)}`
        },
        severity: cred.verificationState === VerificationStatus.VERIFIED || cred.verificationState === VerificationStatus.AUTHENTICATED ? 'success' : 'warning'
      });
    });

    // 4. If aviation candidate, add KCAA & Medical Logbook Inspection
    if (candidate.headline.toLowerCase().includes('pilot') || candidate.headline.toLowerCase().includes('flight')) {
      const kcaaDate = new Date(baseDate.getTime() + 1000 * 60 * 60 * 18);
      events.push({
        id: `evt_kcaa_${candidate.id}`,
        candidateId: candidate.id,
        timestamp: kcaaDate.toISOString(),
        category: 'Verification',
        title: 'KCAA Personnel Licensing Database Cross-Check: PASS',
        actor: 'Capt. Evans Kariuki',
        actorRole: 'Accredited Aviation Auditor (ID: AG-041)',
        details: 'Checked Flight Time Logbooks (2,450 Verified PIC hours), Multi-Engine Instrument Rating, and Class 1 Medical certificate validity.',
        metadata: {
          verificationMethod: 'KCAA API & In-Person Simulator Telemetry Audit',
          hash: 'KCAA-PLD-B737-VERIFIED-9842'
        },
        severity: 'success'
      });
    }

    // 5. Stage Transition Events
    if (application && application.status !== 'Applied') {
      const stageDate = new Date(baseDate.getTime() + 1000 * 60 * 60 * 28);
      events.push({
        id: `evt_stage_${candidate.id}`,
        candidateId: candidate.id,
        timestamp: stageDate.toISOString(),
        category: 'Pipeline',
        title: `Candidate Advanced to ${application.status}`,
        actor: 'Senior Talent Lead',
        actorRole: 'Recruiter Admin',
        details: `Candidate dossier moved to ${application.status} stage following automated benchmark qualification and trust verification clearance.`,
        metadata: {
          stageFrom: 'Applied',
          stageTo: application.status
        },
        severity: 'normal'
      });
    }

    // 6. Interview Events
    interviews.forEach(int => {
      events.push({
        id: `evt_int_${int.id}`,
        candidateId: candidate.id,
        timestamp: `${int.scheduledDate}T10:00:00Z`,
        category: 'Interview',
        title: `Interview Scheduled: ${int.stageName}`,
        actor: 'Recruiter Coordination Desk',
        actorRole: 'Panel Coordinator',
        details: `Evaluation panel assigned: ${int.panelMembers.join(', ')}. Meeting URL dispatched via encrypted calendar link.`,
        metadata: {
          panelist: int.panelMembers[0]
        },
        severity: 'normal'
      });

      if (int.scorecards && int.scorecards.length > 0) {
        int.scorecards.forEach(sc => {
          events.push({
            id: `evt_sc_${sc.id}`,
            candidateId: candidate.id,
            timestamp: `${int.scheduledDate}T14:30:00Z`,
            category: 'Interview',
            title: `Scorecard Sealed: ${sc.interviewerName} (${sc.overallRecommendation})`,
            actor: sc.interviewerName,
            actorRole: sc.interviewerRole,
            details: `Submitted rubric evaluation. Recommendation: ${sc.overallRecommendation}. Remarks: "${sc.summaryRemarks}"`,
            severity: sc.overallRecommendation === 'Strong Hire' || sc.overallRecommendation === 'Hire' ? 'success' : 'warning'
          });
        });
      }
    });

    // 7. Security / KDPA Consent Check
    events.push({
      id: `evt_kdpa_${candidate.id}`,
      candidateId: candidate.id,
      timestamp: new Date().toISOString(),
      category: 'Security',
      title: 'Zero-Knowledge Cryptographic Proof Signed',
      actor: 'VerifiedHire Trust Enclave',
      actorRole: 'Hardware Security Module (HSM)',
      details: 'Audit trail hashed and sealed to employer tamper-evident immutable log. Sensitive PII stored under AES-256 client-controlled encryption.',
      metadata: {
        hash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
      },
      severity: 'success'
    });

    // Sort descending (newest first)
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [candidate, credentials, interviews, application]);

  const filteredEvents = useMemo(() => {
    return auditEvents.filter(evt => {
      if (filterCategory !== 'all' && evt.category !== filterCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          evt.title.toLowerCase().includes(q) ||
          evt.details.toLowerCase().includes(q) ||
          evt.actor.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditEvents, filterCategory, searchQuery]);

  const categoryIcons: Record<AuditEvent['category'], string> = {
    Verification: 'shieldCheck',
    Pipeline: 'arrowRight',
    Interview: 'calendar',
    Communication: 'mail',
    Security: 'fingerprint',
    Note: 'edit'
  };

  const categoryColors: Record<AuditEvent['category'], string> = {
    Verification: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    Pipeline: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    Interview: 'text-amber-600 bg-amber-100 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    Communication: 'text-blue-600 bg-blue-100 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    Security: 'text-purple-600 bg-purple-100 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    Note: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: `All Events (${auditEvents.length})` },
            { id: 'Verification', label: 'Verifications' },
            { id: 'Pipeline', label: 'Pipeline' },
            { id: 'Interview', label: 'Interviews' },
            { id: 'Security', label: 'Security & KDPA' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                filterCategory === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Icon name="search" className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        <AnimatePresence>
          {filteredEvents.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 28, delay: idx * 0.03 }}
              className="relative group"
            >
              {/* Timeline Pin Icon */}
              <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] ${
                evt.severity === 'success' ? 'bg-emerald-500 text-white' :
                evt.severity === 'warning' ? 'bg-amber-500 text-white' :
                'bg-indigo-600 text-white'
              }`}>
                <Icon name={categoryIcons[evt.category] as any} className="w-2.5 h-2.5" />
              </div>

              {/* Event Card */}
              <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${categoryColors[evt.category]}`}>
                        {evt.category}
                      </span>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        {evt.title}
                      </h5>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      By <strong>{evt.actor}</strong> ({evt.actorRole})
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                    {new Date(evt.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.details}
                </p>

                {/* Metadata Pill Cluster */}
                {evt.metadata && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {evt.metadata.verificationMethod && (
                      <span className="bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                        Method: {evt.metadata.verificationMethod}
                      </span>
                    )}
                    {evt.metadata.stageTo && (
                      <span className="bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                        {evt.metadata.stageFrom} → {evt.metadata.stageTo}
                      </span>
                    )}
                    {evt.metadata.hash && (
                      <span className="bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 truncate max-w-[220px]" title={evt.metadata.hash}>
                        Hash: {evt.metadata.hash}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
