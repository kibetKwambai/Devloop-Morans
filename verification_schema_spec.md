# Devloop-Morans: Document Verification & Compliance Portal
## Advanced Agent Verification Module: Database Schema & System Architecture Spec

This document details the database schema (relational SQL using PostgreSQL dialect), step-by-step UI/UX agent workflows, eCitizen/DCI query validation flows, and agent payout mechanisms for the **Devloop-Morans** document verification portal.

---

### 1. Database Schema Specification (PostgreSQL DDL)

This schema supports **Role-Based Access Control (RBAC)**, **Agent Performance Tracking**, **Verification Tasks (Checkpoints)**, and a tamper-evident **Agent Audit Logs Ledger**.

```sql
-- Enable UUID extension for cryptographically secure IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLE-BASED ACCESS CONTROL (RBAC) TABLE
CREATE TYPE user_role_enum AS ENUM ('JobSeeker', 'Employer', 'Admin', 'Agent', 'Issuer');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'JobSeeker',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ACCREDITED AGENTS TABLE (Earnings & Certifications)
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accreditation_number VARCHAR(100) UNIQUE NOT NULL, -- e.g., KCAA-PEL-REG-2026
    jurisdiction VARCHAR(100) NOT NULL DEFAULT 'Kenya',
    sla_compliance_rate NUMERIC(5,2) DEFAULT 100.00, -- e.g., 99.80%
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CANDIDATE COMPLIANCE PROFILES
CREATE TABLE candidate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(255) NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'Pending Verification', -- Draft, Pending, Verified, Flagged, Rejected
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ATTACHED EVIDENCE DOCUMENTS (Birth Cert, ID, Academic, Statutory clearances)
CREATE TYPE document_type_enum AS ENUM (
    'birth_cert', 'national_id', 'passport', 
    'kcpe_cert', 'kcse_cert', 'academic_degree', 
    'profile_photo', 'police_clearance', 'statutory_compliance'
);

CREATE TABLE attached_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    document_type document_type_enum NOT NULL,
    declared_value VARCHAR(255) NOT NULL, -- The text value filled by the candidate (e.g., ID number or Serial)
    s3_document_url VARCHAR(512) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. VERIFICATION TASK CASES (SLA & Queue)
CREATE TYPE priority_enum AS ENUM ('High', 'Normal', 'Urgent');
CREATE TYPE complexity_enum AS ENUM ('Standard', 'Elevated', 'Forensic');
CREATE TYPE case_status_enum AS ENUM ('Unassigned', 'Assigned', 'Under_Review', 'QA_Review', 'Completed', 'Disputed');

CREATE TABLE verification_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    priority priority_enum DEFAULT 'Normal',
    complexity complexity_enum DEFAULT 'Standard',
    sla_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    assigned_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    status case_status_enum DEFAULT 'Unassigned',
    conflict_declared BOOLEAN DEFAULT FALSE,
    conflict_acknowledged_at TIMESTAMP WITH TIME ZONE,
    commission_amount_kes NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PRIMARY SOURCE AUDIT LOGS (The Chronological Audit Ledger)
CREATE TYPE payout_status_enum AS ENUM ('Settled_MPESA', 'Approved_QA', 'Pending_Audit', 'Disputed');

CREATE TABLE agent_audit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES verification_cases(id) ON DELETE SET NULL,
    candidate_id UUID NOT NULL REFERENCES users(id),
    agent_id UUID NOT NULL REFERENCES agents(id),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verification_method VARCHAR(150) NOT NULL, -- e.g., "Primary Source Registry Cross-Check"
    statutory_registry_checked VARCHAR(255) NOT NULL, -- e.g., "eCitizen DCI Criminal Register"
    extracted_reference VARCHAR(150) NOT NULL, -- The value manually typed out by the agent
    evidence_checklist_completed TEXT[] NOT NULL, -- Array of checked micro-checklist items
    sworn_no_conflict_signed BOOLEAN NOT NULL DEFAULT FALSE,
    findings_summary TEXT NOT NULL, -- Minimal 20 char description of forensic audit
    authenticity_match_score INT NOT NULL CHECK (authenticity_match_score BETWEEN 50 AND 100),
    payout_amount_kes NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    payout_status payout_status_enum DEFAULT 'Pending_Audit',
    digital_signature_hash VARCHAR(64) NOT NULL, -- sha256 of (agent_id + candidate_id + timestamp + extracted_reference)
    status_result VARCHAR(50) NOT NULL, -- Passed, Flagged, Failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create composite index for fast admin payout & quality reports
CREATE INDEX idx_ledger_agent_status ON agent_audit_ledger(agent_id, payout_status);
CREATE INDEX idx_ledger_candidate ON agent_audit_ledger(candidate_id);
```

---

### 2. Step-by-Step UI/UX Workstation Workflow

The Agent Portal UI enforces **Proof of Work** and blocks one-click approvals through a multi-step modal workstation:

```
[Candidate Queue] ➔ [Click "Review & Verify Claim"] ➔ Opens Workstation Modal
                                                             │
 ┌───────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────┐
 │                                                                                                                      │
▼                                                                                                                      ▼
[Step 1: Sworn Conflict Declaration]                                                                                  [Step 2-10: Checkpoint loop (Birth Cert, ID, Passport, KCPE, KCSE, Degree, Photo, Police, Statutory)]
Agent must check: "I declare no personal or monetary                                                                   For EACH document, the interface splits into:
conflict of interest under Chapter 6 penalty."                                                                         ├── Left Pane: Styled, high-contrast visual scanned document.
                                                                                                                       └── Right Pane: Auditing Action panel
                                                                                                                           ├── ⏱️ 15s Timer: Must elapse before approving.
                                                                                                                           ├── ✍️ Field Extraction: Type exact Serial/ID.
                                                                                                                           ├── 🔗 Proof URL/Screenshot upload log (eCitizen).
                                                                                                                           ├── ☑️ Micro-Checklist: Must check all three criteria.
                                                                                                                           └── 🎛️ Approve / Reject checkpoint.
                                                                                                                               └── (Rejections open mandatory notes field).
                                                                                                                                        │
 ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴────────────────┘
 │
▼
[Step 11: Sealing Inscription Dashboard]
Shows compiled results of all 9 checkpoints (e.g. 8 Approved, 1 Mismatch).
Agent must:
├── Write a Forensic Findings Summary (minimal 20 characters).
├── Confirm final calculated compliance rating:
│     ├── [PASSED]: All 9 documents successfully approved.
│     ├── [FLAGGED]: Non-identity discrepancies found (e.g., minor certificate serial issue).
│     └── [FAILED]: Mismatch or suspected fraud on National ID, Degree Cert, or DCI Police Clearance.
└── Click [Seal & Inscribe Compliance Certificate].
      └── Action locks the audit log into the ledger & dispatches instant notifications.
```

---

### 3. Logic & API Validation Flow

#### A. External DCI/eCitizen Query Link Validation
To authenticate certificates directly from the Directorate of Criminal Investigations (DCI) or the eCitizen portal (`https://dci.ecitizen.go.ke/verify`):

1. **Agent Action**: The agent logs into the eCitizen DCI verification sub-portal, inputs the certificate reference code, and retrieves the QR code or validation page.
2. **Registry Extraction**: The agent copies the resulting validation URL (e.g., `https://dci.ecitizen.go.ke/verify/PCC-2026-98124`) and pastes it into the workstation.
3. **Regex Alignment Checks**: The frontend immediately matches the input format:
   ```typescript
   const dciRegex = /^https:\/\/dci\.ecitizen\.go\.ke\/verify\/PCC-\d{4}-\d{5,8}$/;
   const isValidLink = dciRegex.test(pastedLink);
   ```
4. **Metadata Extraction**: If the link matches the format, the system parses the reference token (`PCC-2026-98124`) and ensures it aligns with the manual extraction input box.
5. **Simulated Sandbox Log**: The workstation logs the MD5 fingerprint of the network handshake query and attaches it as proof evidence to the permanent audit trail.

#### B. Calculating Hidden Agent Earnings & Payout Ledger
To ensure agents are motivated on a highly rigorous gig-economy model while hiding payroll ledger sheets from potential peer-collusion or bribery attempts:

1. **Per-Document Rates**: Payouts are task-based and vary by verification complexity:
   - **Identity documents (Birth Cert, ID)**: KES 150
   - **Passport (International MRZ)**: KES 200
   - **Secondary School (KCSE Cert)**: KES 200
   - **University Degree/Diploma**: KES 250
   - **Police Clearance (DCI eCitizen Portal query)**: KES 300
2. **Hidden Execution**: While verifying, the agent sees the individual task fee, but they **cannot** see their aggregate financial balances, total verifications count, or historical ledger values. This prevents agents from estimating peer work or compiling bulk billing receipts.
3. **Admin Reconciliation**: All verified task commissions are pushed to the `agent_audit_ledger` with `payout_status = 'Pending_Audit'`.
4. **Double-Blind QA Review**: Under the **Admin Dashboard**, the platform superuser reviews the agent's work, matched checklists, and extracted serial numbers.
5. **One-Click Disbursement**: The Admin clicks **"Disburse via M-PESA B2C"** which initiates an automated API handshake with the Safaricom Daraja B2C portal:
   - Payload transmits: `Recipient Phone`, `Payout Commission Fee`, `Audit Reference Hash`.
   - On success, status flips to `Settled_MPESA` with M-PESA transaction IDs (e.g., `TX982301`) written to the database.
