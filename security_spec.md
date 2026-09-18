# Security Specification: VerifiedHire Firebase Security Model

## 1. Core Data Invariants & Authorization Boundaries
1. **User Identity & Isolation**: A user can only create/update their own profile (`/users/{userId}` where `userId == request.auth.uid`). Public profiles do not expose private identity parameters to unauthenticated visitors.
2. **Requisition & Job Ownership**: A job posting (`/jobs/{jobId}`) can only be created, updated, or deleted by the authenticated employer who owns `employerId == request.auth.uid` or an authorized platform administrator.
3. **Application Privacy**: A candidate can only submit an application (`/applications/{applicationId}`) where `jobSeekerId == request.auth.uid`. An application can be read only by the candidate (`jobSeekerId == request.auth.uid`) or the employer owning the referenced job.
4. **Google Meet Interviews**: An interview record (`/interviews/{interviewId}`) containing Google Meet space parameters (`googleMeetUri`, `googleMeetCode`) can be viewed only by authenticated participants (the candidate, the employer/interviewer, or platform admin).
5. **Verifiable Credential Integrity**: A candidate can only manage their own credentials (`/credentials/{credentialId}` where `candidateId == request.auth.uid`), and verification state mutations are restricted to trusted authorities or administrators.
6. **Notification Direct Delivery**: Notifications (`/notifications/{notificationId}`) are strictly isolated to `userId == request.auth.uid`.
7. **Talent Pools**: Talent pools (`/talentPools/{poolId}`) are accessible only by authenticated employer enterprise accounts.
8. **Catch-All Default Deny**: All unspecified paths are closed by default.

---

## 2. The "Dirty Dozen" Threat Payloads (Must Return PERMISSION_DENIED)
1. **Payload 1 (ID Spoofing)**: Attacker with UID `attacker_123` attempts to write to `/users/victim_999`.
2. **Payload 2 (Ghost Field Injection)**: Attacker attempts to update `/users/attacker_123` with unauthorized system key `{ isAdmin: true }`.
3. **Payload 3 (Orphaned Application)**: Attacker attempts to create an application with `jobSeekerId: "someone_else"`.
4. **Payload 4 (Unauthorized Job Deletion)**: Job seeker attempts to issue `delete` on `/jobs/job_tech_001`.
5. **Payload 5 (Junk Path Flooding)**: Attacker attempts document write with 2KB string ID containing malicious script tags.
6. **Payload 6 (PII Harvesting)**: Unauthenticated user attempts `get` or `list` on private user data.
7. **Payload 7 (Unbounded Array Injection)**: Attacker attempts to inject a 10,000-item array to cause denial-of-wallet read inflation.
8. **Payload 8 (Google Meet Space Hijack)**: Unrelated candidate attempts to alter the `googleMeetUri` or `panelMembers` of an interview.
9. **Payload 9 (Credential Forgery)**: Candidate attempts to self-certify a credential by setting `verificationState: "Issuer_Verified"`.
10. **Payload 10 (Notification Snooping)**: User `A` attempts to list notifications where `userId == "user_B"`.
11. **Payload 11 (Terminal State Override)**: Employer attempts to mutate a rejected/archived application without proper status change permissions.
12. **Payload 12 (Blanket List Scraping)**: Unauthenticated scraper sends broad queries without UID scoping.
