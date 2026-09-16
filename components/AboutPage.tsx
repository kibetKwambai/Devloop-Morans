import React, { useState } from 'react';
import { Icon, IconName } from './Icon';

interface TeamMember {
  name: string;
  role: string;
  credentials: string;
  bio: string;
  imageUrl: string;
  badge: string;
}

const leadershipTeam: TeamMember[] = [
  {
    name: 'Jenrick Kibet',
    role: 'Chief Executive Officer & Founder',
    credentials: 'MSc Data Science (UoN), ex-Andela VP of Talent Systems',
    bio: 'Pioneered cryptographic credential verification systems across East Africa. Over 12 years of executive talent architecture experience connecting African engineers with global tech leaders.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    badge: 'Executive Founder',
  },
  {
    name: 'Dr. Evans Kwambai',
    role: 'Chief Technology Officer',
    credentials: 'PhD Distributed Systems (ETH Zurich), BEng Telecomm (JKUAT)',
    bio: 'Architected automated document forensics using Google Gemini multimodal vision. Former principal engineer leading security infrastructure for regional core banking solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    badge: 'AI & Systems',
  },
  {
    name: 'Linda Okumu, Esq.',
    role: 'Head of Regulatory & Operations',
    credentials: 'LL.B (Hons), Certified Data Protection Officer (ODPC Registered)',
    bio: 'Spearheads data privacy compliance under Kenya Data Protection Act 2019 and cross-border GDPR compliance. Former legal counsel to aviation and health regulatory boards.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    badge: 'Legal & Compliance',
  },
  {
    name: 'Capt. Felix Nyariki',
    role: 'Lead Aviation & Technical Certifications',
    credentials: 'ATPL Pilot, KCAA Certified Flight Inspector',
    bio: 'Directs the specialised technical verification wing for commercial flight crew, mechanical engineers, and mission-critical operations across sub-Saharan Africa.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    badge: 'Technical Verifications',
  },
];

const stats = [
  { label: 'Credentials Verified', value: '24,800+', note: 'Degrees, licenses & flight logs' },
  { label: 'Enterprise Employers', value: '450+', note: 'Safaricom, KQ, Equity, KCB' },
  { label: 'Verification Accuracy', value: '99.92%', note: 'Zero fraudulent bypasses in 2025' },
  { label: 'Average Turnaround', value: '18.4 hrs', note: 'Down from 3 weeks manually' },
];

const verificationLayers = [
  {
    step: '01',
    title: 'Academic & Institutional Direct Query',
    description: 'Direct API integrations and cryptographically validated transcripts connected to Kenya National Qualifications Authority (KNQA) accredited universities and international evaluation bodies (WES, ECCTIS).',
    icon: 'academicCap' as IconName,
  },
  {
    step: '02',
    title: 'Statutory & Regulatory Board Validation',
    description: 'Instant cross-referencing with statutory bodies including the Engineers Board of Kenya (EBK), Kenya Medical Practitioners & Dentists Council (KMPDC), Law Society of Kenya (LSK), and KCAA.',
    icon: 'shieldCheck' as IconName,
  },
  {
    step: '03',
    title: 'Supervisory & Peer Field Auditing',
    description: 'Human-in-the-loop verification by certified field agents who conduct confidential audio and reference checks with direct past reporting managers rather than automated email surveys.',
    icon: 'userGroup' as IconName,
  },
  {
    step: '04',
    title: 'Multimodal AI Anomaly & Fraud Detection',
    description: 'Google Gemini multimodal vision detects document tampering, pixel-level alterations, font misalignments, stamp forgery, and stolen identity numbers with 99.9% precision.',
    icon: 'sparkles' as IconName,
  },
];

const regionalHubs = [
  {
    city: 'Nairobi HQ',
    address: 'Delta Corner Annex, 8th Floor, Chiromo Rd, Westlands',
    focus: 'Executive Leadership, AI Lab & Global Enterprise Accounts',
    contact: '+254 (0) 20 790 4000',
  },
  {
    city: 'Mombasa Regional Hub',
    address: 'Nyali Links Business Plaza, Block C, Links Road',
    focus: 'Maritime, Logistics & East Africa Port Operations Verifications',
    contact: '+254 (0) 41 230 1120',
  },
  {
    city: 'Kisumu Tech Center',
    address: 'Mega City Complex, Wing B, Oginga Odinga Street',
    focus: 'Western Kenya Healthcare & Agro-technology Talent Verification',
    contact: '+254 (0) 57 202 8840',
  },
  {
    city: 'Eldoret Flight & Engineering Desk',
    address: 'KVDA Plaza, 5th Floor, Oloo Street',
    focus: 'Aviation Pilot Logs, Flight Crew & Mechanical Engineering Audits',
    contact: '+254 (0) 53 206 4300',
  },
];

export const AboutPage: React.FC<{ onNavigate?: (view: any) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'methodology' | 'compliance' | 'roadmap'>('mission');

  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {onNavigate && (
          <div className="mb-8">
            <button
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <Icon name="arrowLeft" className="h-4 w-4 mr-2" />
              Back to Overview
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-6">
            Institutional Trust Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Building the Gold Standard for <span className="text-indigo-600 dark:text-indigo-400">Professional Integrity</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-indigo-200 leading-relaxed">
            In an era where resume fabrication and credential inflation distort the global talent economy, VerifiedHire provides verified proof. We ensure that merit, verified skill, and true experience win.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 bg-slate-50 dark:bg-indigo-900/30 rounded-2xl border border-slate-100 dark:border-indigo-800/60 text-center hover:shadow-lg transition-all">
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">{stat.value}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{stat.label}</p>
              <p className="text-xs text-slate-500 dark:text-indigo-300 mt-1">{stat.note}</p>
            </div>
          ))}
        </div>

        {/* Tabbed Interactive Story Section */}
        <div className="bg-white dark:bg-indigo-900/20 rounded-3xl border border-slate-200 dark:border-indigo-800/70 overflow-hidden shadow-xl mb-24">
          <div className="flex border-b border-slate-200 dark:border-indigo-800 overflow-x-auto scrollbar-hide">
            {[
              { id: 'mission', label: 'Our Genesis & Mission', icon: 'sparkles' as IconName },
              { id: 'methodology', label: '4-Layer Verification Protocol', icon: 'shieldCheck' as IconName },
              { id: 'compliance', label: 'Accreditation & Legal Framework', icon: 'scale' as IconName },
              { id: 'roadmap', label: 'Strategic Vision & Expansion', icon: 'globeAlt' as IconName },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/40'
                    : 'border-transparent text-slate-500 dark:text-indigo-300 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Icon name={tab.icon} className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 sm:p-12">
            {activeTab === 'mission' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Why VerifiedHire Was Born</h3>
                <p className="text-base sm:text-lg text-slate-600 dark:text-indigo-200 leading-relaxed">
                  In 2024, our founders identified an urgent crisis within the East African professional sphere: more than 38% of candidate resumes submitted for mission-critical jobs in aviation, healthcare, engineering, and enterprise software contained material misrepresentations—from exaggerated senior roles to forged certificates and ghost references.
                </p>
                <p className="text-base sm:text-lg text-slate-600 dark:text-indigo-200 leading-relaxed">
                  Companies spent months and millions on bad hires, while honest, extraordinary African talent struggled to break through without connections. VerifiedHire was architected as an immutable, trust-first layer. By pairing direct primary-source verification with multimodal AI, we level the playing field, making pure capability and honesty the sole currency of career advancement.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="p-5 bg-indigo-50/70 dark:bg-indigo-900/40 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">Radical Fairness</h4>
                    <p className="text-xs text-slate-600 dark:text-indigo-300 mt-2">Zero nepotism or referral bias. Candidates are judged solely on verified credentials and validated skills.</p>
                  </div>
                  <div className="p-5 bg-indigo-50/70 dark:bg-indigo-900/40 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">Surgical Speed</h4>
                    <p className="text-xs text-slate-600 dark:text-indigo-300 mt-2">Automated checks finish in minutes, and manual field investigations are finalized within 18 business hours.</p>
                  </div>
                  <div className="p-5 bg-indigo-50/70 dark:bg-indigo-900/40 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">Guaranteed Authenticity</h4>
                    <p className="text-xs text-slate-600 dark:text-indigo-300 mt-2">Every Verified Badge is backed by digital verification hashes verifiable by employers and embassies worldwide.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'methodology' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Our 4-Layer Surgical Verification Protocol</h3>
                  <p className="text-slate-600 dark:text-indigo-200 mt-2">
                    Unlike ordinary job boards that accept self-uploaded PDF resumes without scrutiny, every candidate profile on VerifiedHire must pass a four-layer verification protocol.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {verificationLayers.map((layer) => (
                    <div key={layer.step} className="p-6 bg-slate-50 dark:bg-indigo-900/30 rounded-2xl border border-slate-200 dark:border-indigo-800/60 flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0">
                        {layer.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{layer.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-indigo-300 mt-2 leading-relaxed">{layer.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Statutory & Regulatory Alignment</h3>
                <p className="text-slate-600 dark:text-indigo-200">
                  VerifiedHire operates under the strictest Kenyan and international data governance frameworks. Candidate privacy is fully protected under explicit consent protocols.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-slate-200 dark:border-indigo-800 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="shieldCheck" className="h-6 w-6 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">Kenya Data Protection Act 2019</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-indigo-300 leading-relaxed">
                      Registered Data Controller & Processor with the Office of the Data Protection Commissioner (ODPC). All candidate documents are encrypted at rest with AES-256 and transmitted with TLS 1.3.
                    </p>
                  </div>
                  <div className="p-6 border border-slate-200 dark:border-indigo-800 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="academicCap" className="h-6 w-6 text-indigo-600" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">KNQA Framework Compatibility</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-indigo-300 leading-relaxed">
                      Academic degrees and vocational certificates are mapped to the Kenya National Qualifications Framework (KNQF) Level Descriptors, guaranteeing standardization and cross-border equivalence.
                    </p>
                  </div>
                  <div className="p-6 border border-slate-200 dark:border-indigo-800 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="checkBadge" className="h-6 w-6 text-indigo-600" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">ISO/IEC 27001 Certified Infrastructure</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-indigo-300 leading-relaxed">
                      Hosted in tier-3 cloud facilities with continuous automated vulnerability scans, role-based database permissions, and non-repudiable administrative audit logs.
                    </p>
                  </div>
                  <div className="p-6 border border-slate-200 dark:border-indigo-800 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="lockClosed" className="h-6 w-6 text-amber-600" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">Explicit Candidate Consent</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-indigo-300 leading-relaxed">
                      Employers can never view unredacted sensitive documents (National ID number, salary history, or medical details) without explicit, time-limited candidate authorization.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Our Strategic Horizon</h3>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-full">2024</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Foundational Architecture</h4>
                      <p className="text-sm text-slate-600 dark:text-indigo-300">Launched nationwide verification pilot across Nairobi with 50 enterprise partners in banking and telecommunications.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-full">2025</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Multimodal AI Vision & Field Agent Network</h4>
                      <p className="text-sm text-slate-600 dark:text-indigo-300">Integrated Google Gemini vision models for forensic document analysis and mobilized over 150 certified field verification agents.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full">2026</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Pan-African Verified Talent Corridor</h4>
                      <p className="text-sm text-slate-600 dark:text-indigo-300">Expanding direct integration to Uganda, Rwanda, Tanzania, and Nigeria, establishing a unified verifiable credentials network for African talent globally.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Executive Leadership Team */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Executive Leadership & Advisory</h2>
            <p className="mt-4 text-slate-600 dark:text-indigo-300 text-base sm:text-lg">
              Steered by veteran talent architects, systems engineers, regulatory lawyers, and aviation safety leaders.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((member) => (
              <div key={member.name} className="bg-white dark:bg-indigo-900/30 rounded-3xl p-6 border border-slate-200 dark:border-indigo-800 flex flex-col hover:-translate-y-1 transition-all shadow-sm hover:shadow-xl">
                <div className="relative mb-6">
                  <img src={member.imageUrl} alt={member.name} className="h-44 w-full object-cover rounded-2xl" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white rounded-full shadow-md">
                    {member.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{member.role}</p>
                <p className="text-xs text-slate-500 dark:text-indigo-300 mt-2 font-medium">{member.credentials}</p>
                <p className="text-xs text-slate-600 dark:text-indigo-200 mt-4 leading-relaxed flex-grow">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Verification Hubs */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Regional Verification Hubs</h2>
            <p className="mt-3 text-slate-600 dark:text-indigo-300">
              Our on-the-ground verification centers ensure authentic physical audits and in-person interviews.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regionalHubs.map((hub) => (
              <div key={hub.city} className="p-6 bg-slate-50 dark:bg-indigo-900/20 rounded-2xl border border-slate-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{hub.city}</h3>
                  <span className="text-xs px-2.5 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-800/60 dark:text-indigo-300 rounded-full font-bold">Active Hub</span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-indigo-200">{hub.address}</p>
                <p className="text-xs text-slate-500 dark:text-indigo-300 mt-2"><span className="font-bold">Domain Focus:</span> {hub.focus}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-2">{hub.contact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Action Pathways */}
        {onNavigate && (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white border border-indigo-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
            <div className="space-y-2 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-black">Ready to experience verified integrity?</h3>
              <p className="text-sm sm:text-base text-indigo-200 max-w-xl">
                Whether you are an ambitious professional looking to prove your authentic skills or an enterprise looking to hire with confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onNavigate('jobPortal')}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                Browse Job Opportunities
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition-all"
              >
                Contact Verification Desk
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
