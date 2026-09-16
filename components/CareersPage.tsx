import React, { useState } from 'react';
import { Icon, IconName } from './Icon';

interface CareerOpening {
  id: string;
  title: string;
  department: 'Engineering & AI' | 'Verification Operations' | 'Product & Design' | 'Legal & Privacy' | 'Enterprise Growth';
  location: string;
  type: string;
  experienceLevel: string;
  salaryKes: string;
  salaryUsd: string;
  equity: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
}

const careerOpenings: CareerOpening[] = [
  {
    id: 'eng-01',
    title: 'Senior Full Stack Engineer (TypeScript & Cloud SQL)',
    department: 'Engineering & AI',
    location: 'Nairobi, Kenya (Hybrid / Remote Option)',
    type: 'Full-time',
    experienceLevel: 'Senior (5+ yrs)',
    salaryKes: 'KES 380,000 - 550,000 / mo',
    salaryUsd: '$3,000 - $4,200 / mo',
    equity: '0.25% - 0.60% ESOP',
    overview: 'Lead the architecture of our high-throughput verification engine, integrating Google Gemini multimodal models with our Cloud SQL and Firebase infrastructure.',
    responsibilities: [
      'Scale low-latency GraphQL & REST API gateways handling thousands of credential checks daily.',
      'Build resilient automated audit trails with cryptographic hash verification.',
      'Collaborate directly with product and field operations teams to streamline investigator workflows.',
    ],
    requirements: [
      'Strong mastery of React 18+, TypeScript, Node.js, and PostgreSQL/Cloud SQL.',
      'Experience with document processing, OCR, or multimodal vision pipelines.',
      'Solid grasp of security protocols, OAuth 2.0, and data encryption standards.',
    ],
  },
  {
    id: 'ai-02',
    title: 'Multimodal AI Vision & Forensic Specialist',
    department: 'Engineering & AI',
    location: 'Nairobi, Kenya or Remote (East Africa)',
    type: 'Full-time',
    experienceLevel: 'Staff / Lead (6+ yrs)',
    salaryKes: 'KES 450,000 - 650,000 / mo',
    salaryUsd: '$3,500 - $5,000 / mo',
    equity: '0.40% - 0.80% ESOP',
    overview: 'Design state-of-the-art anomaly detection systems to automatically flag forged stamps, altered educational certificates, and manipulated flight logs.',
    responsibilities: [
      'Train, fine-tune, and prompt Gemini 2.5 models for surgical visual verification of official documents.',
      'Establish automated confidence scoring and human-in-the-loop escalation rules.',
      'Audit model decisions to eliminate demographic or regional bias.',
    ],
    requirements: [
      'Deep expertise in computer vision, OCR, document forensics, or generative AI embeddings.',
      'Demonstrated track record deploying production AI pipelines in cloud environments.',
      'Mastery of Python or TypeScript with Google Cloud Platform.',
    ],
  },
  {
    id: 'ops-03',
    title: 'Senior Verification Inspector - Aviation & Engineering',
    department: 'Verification Operations',
    location: 'Nairobi HQ (Delta Corner) with travel to regional hubs',
    type: 'Full-time',
    experienceLevel: 'Mid-Senior (4+ yrs in regulatory auditing)',
    salaryKes: 'KES 250,000 - 360,000 / mo',
    salaryUsd: '$1,900 - $2,800 / mo',
    equity: '0.10% - 0.25% ESOP',
    overview: 'Perform high-stakes forensic checks on commercial pilot logbooks, type ratings, and mechanical engineering licensing across East Africa.',
    responsibilities: [
      'Liaise directly with civil aviation authorities (KCAA, UCAA, TCAA) and national engineering boards.',
      'Conduct rigorous reference audits with chief pilots and engineering directors.',
      'Maintain an uncompromising bar for passenger and industrial safety.',
    ],
    requirements: [
      'Direct background in aviation compliance, engineering oversight, or specialized technical recruitment.',
      'Impeccable ethical judgment and attention to minute paperwork details.',
      'Excellent verbal diplomacy for executive-level confidential checks.',
    ],
  },
  {
    id: 'des-04',
    title: 'Lead Product Designer (Design Systems & Micro-Interactions)',
    department: 'Product & Design',
    location: 'Nairobi, Kenya (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Senior (4+ yrs)',
    salaryKes: 'KES 280,000 - 420,000 / mo',
    salaryUsd: '$2,200 - $3,300 / mo',
    equity: '0.20% - 0.45% ESOP',
    overview: 'Craft the digital experience for job seekers claiming their verified badges and enterprise HR directors searching millions of vetted credentials.',
    responsibilities: [
      'Maintain and elevate the VerifiedHire design language across desktop and mobile web.',
      'Prototype intuitive, trustworthy verification statuses, credentials previews, and admin panels.',
      'Conduct weekly user research with real HR executives and job applicants.',
    ],
    requirements: [
      'Stellar portfolio showcasing complex data-dense SaaS dashboards and consumer-grade polish.',
      'Expertise in Tailwind CSS layout tokens, typography scales, and accessibility (WCAG AA).',
      'Proficiency in Figma and interactive prototype validation.',
    ],
  },
  {
    id: 'leg-05',
    title: 'Data Privacy & Regulatory Compliance Counsel',
    department: 'Legal & Privacy',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    experienceLevel: 'Senior (5+ yrs PQE)',
    salaryKes: 'KES 320,000 - 480,000 / mo',
    salaryUsd: '$2,500 - $3,700 / mo',
    equity: '0.20% - 0.40% ESOP',
    overview: 'Ensure all data collection, storage, and cross-border verifications strictly adhere to the Kenya Data Protection Act 2019, GDPR, and African regional frameworks.',
    responsibilities: [
      'Supervise Data Protection Impact Assessments (DPIAs) for all platform features.',
      'Draft institutional enterprise data-sharing agreements and candidate consent declarations.',
      'Represent VerifiedHire before the ODPC and educational accreditation councils.',
    ],
    requirements: [
      'Admitted Advocate of the High Court of Kenya with active practicing certificate.',
      'Certified Information Privacy Professional (CIPP/E) or ODPC registered DPO certification.',
      'Experience in tech, fintech, or HR tech regulatory environments.',
    ],
  },
  {
    id: 'ent-06',
    title: 'Enterprise Account Executive (Fintech & Healthcare)',
    department: 'Enterprise Growth',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    experienceLevel: 'Mid-Senior (3+ yrs B2B SaaS)',
    salaryKes: 'KES 240,000 - 380,000 / mo + uncapped commission',
    salaryUsd: '$1,800 - $2,900 / mo + uncapped commission',
    equity: '0.15% - 0.35% ESOP',
    overview: 'Drive enterprise adoption of our automated verification API and talent pool among Tier-1 commercial banks, airlines, and hospital networks.',
    responsibilities: [
      'Close strategic annual enterprise contracts (KES 2M - 15M ACV).',
      'Deliver executive demos to Chief Human Resource Officers and Chief Risk Officers.',
      'Build deep relationships with HR tech leaders across East Africa.',
    ],
    requirements: [
      'Proven track record exceeding enterprise SaaS sales quotas.',
      'Established executive network in Kenya banking, telecom, or healthcare.',
      'High technological literacy and ability to articulate ROI clearly.',
    ],
  },
];

const benefits = [
  {
    icon: 'shieldCheck' as IconName,
    title: 'Comprehensive Platinum Healthcare',
    description: '100% employer-covered premium health, dental, optical, and inpatient coverage for you and your direct dependents with leading Kenyan hospitals.',
  },
  {
    icon: 'academicCap' as IconName,
    title: 'KES 150,000 Annual Learning Budget',
    description: 'Annual stipend for professional certifications (AWS, PMP, CIPP, CFA), conference travel, textbooks, and masterclasses.',
  },
  {
    icon: 'computerDesktop' as IconName,
    title: 'Top-Tier Hardware & Ergonomic Setup',
    description: 'Latest M3 Max MacBook Pro or high-spec ThinkPad, 4K external monitor, plus KES 60,000 home office ergonomics setup grant.',
  },
  {
    icon: 'calendar' as IconName,
    title: '26 Days Paid Leave & Flexible Time Off',
    description: 'Generous vacation allowances, 16 weeks fully paid maternity leave, 4 weeks paternity leave, plus 2 company wellness rest days every quarter.',
  },
  {
    icon: 'star' as IconName,
    title: 'Direct Equity & Wealth Sharing',
    description: 'Stock option grants (ESOP) for every permanent team member. We succeed together as the verification backbone of Africa.',
  },
  {
    icon: 'globeAlt' as IconName,
    title: 'Annual Team Retreats & Socials',
    description: 'All-expenses-paid company summits in Diani Beach, Naivasha, and the Maasai Mara to celebrate milestones, recharge, and strategize.',
  },
];

export const CareersPage: React.FC<{ onNavigate?: (view: any) => void }> = ({ onNavigate }) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [applyingJob, setApplyingJob] = useState<CareerOpening | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantNotes, setApplicantNotes] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const departments = ['All', 'Engineering & AI', 'Verification Operations', 'Product & Design', 'Legal & Privacy', 'Enterprise Growth'];

  const filteredOpenings = selectedDept === 'All'
    ? careerOpenings
    : careerOpenings.filter((job) => job.department === selectedDept);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
  };

  const closeApplyModal = () => {
    setApplyingJob(null);
    setApplicationSubmitted(false);
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setApplicantNotes('');
    setFileName(null);
  };

  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {onNavigate && (
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <Icon name="arrowLeft" className="h-4 w-4 mr-2" />
              Back to Overview
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="text-xs font-bold text-slate-500 dark:text-indigo-300 hover:text-indigo-600 transition-colors"
            >
              Learn More About Our Team & Culture &rarr;
            </button>
          </div>
        )}

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-6">
            We Are Hiring Top Talent
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Build the Foundation of <span className="text-indigo-600 dark:text-indigo-400">Trust in Africa</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-indigo-200 leading-relaxed">
            We are solving one of the most critical structural barriers to economic mobility: verifiable proof of capability. Join an audacious, mission-obsessed team making hiring honest, fast, and fair.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Why You Will Do Your Best Work Here</h2>
            <p className="mt-3 text-slate-600 dark:text-indigo-300">
              We treat our people like the high-integrity professionals they are—with respect, top-tier compensation, and genuine ownership.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-8 bg-slate-50 dark:bg-indigo-900/20 rounded-3xl border border-slate-100 dark:border-indigo-800/60 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-600/20">
                  <Icon name={benefit.icon} className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-600 dark:text-indigo-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Listings Header & Filter */}
        <div id="openings" className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Open Roles ({careerOpenings.length})</h2>
              <p className="mt-2 text-slate-600 dark:text-indigo-300">Find your next mission-critical challenge in Nairobi or remote.</p>
            </div>
            
            {/* Department Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedDept === dept
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-indigo-900/40 text-slate-600 dark:text-indigo-200 hover:bg-slate-200 dark:hover:bg-indigo-800'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Openings Grid */}
          <div className="space-y-6">
            {filteredOpenings.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-indigo-900/30 rounded-3xl p-8 border border-slate-200 dark:border-indigo-800/70 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-indigo-800/50">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
                        {job.department}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-indigo-950 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg">
                        {job.type}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-indigo-950 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg">
                        {job.experienceLevel}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{job.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-indigo-300 mt-1 flex items-center gap-2">
                      <Icon name="location" className="h-4 w-4 text-indigo-500" />
                      {job.location}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
                    <div>
                      <p className="text-base font-black text-slate-900 dark:text-white">{job.salaryKes}</p>
                      <p className="text-xs text-slate-500 dark:text-indigo-400 font-medium">{job.salaryUsd} • {job.equity}</p>
                    </div>
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
                    >
                      Apply for Role
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                  <p className="text-sm text-slate-600 dark:text-indigo-200 leading-relaxed mb-6">{job.overview}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-2">Key Responsibilities</h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-indigo-200">
                        {job.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-2">What You Bring</h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-indigo-200">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Modal */}
        {applyingJob && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-indigo-950 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-indigo-800 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-indigo-900 flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Application Form</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">{applyingJob.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-indigo-300 mt-1">{applyingJob.department} • {applyingJob.location}</p>
                </div>
                <button onClick={closeApplyModal} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <Icon name="close" className="h-6 w-6" />
                </button>
              </div>

              {applicationSubmitted ? (
                <div className="p-8 sm:p-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="check" className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white">Application Received!</h4>
                  <p className="text-sm text-slate-600 dark:text-indigo-200 max-w-md mx-auto">
                    Thank you, <span className="font-bold">{applicantName || 'Applicant'}</span>! Our engineering and talent partners will review your profile and reach out within 48 business hours.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={closeApplyModal}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Amani Kiprono"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="e.g. amani@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1.5">Phone Number (with country code) *</label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+254 712 345 678"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1.5">LinkedIn or GitHub Profile</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Resume Upload Simulator */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1.5">Resume / CV (PDF or DOCX) *</label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-indigo-800 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer relative">
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFileName(e.target.files[0].name);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Icon name="document" className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {fileName ? fileName : 'Click to upload or drag and drop your CV'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-indigo-400 mt-1">Maximum file size: 10MB</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1.5">Why are you excited to build with VerifiedHire?</label>
                    <textarea
                      rows={3}
                      value={applicantNotes}
                      onChange={(e) => setApplicantNotes(e.target.value)}
                      placeholder="Share what draws you to our mission and what unique perspective you bring..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex gap-4">
                    <button
                      type="button"
                      onClick={closeApplyModal}
                      className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-indigo-800 text-slate-700 dark:text-indigo-200 font-bold text-sm hover:bg-slate-100 dark:hover:bg-indigo-900/50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
