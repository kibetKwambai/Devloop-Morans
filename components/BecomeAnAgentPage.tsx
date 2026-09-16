import React, { useState } from 'react';
import { Icon, IconName } from './Icon';

interface AgentTier {
  name: string;
  badge: string;
  payPerVerification: string;
  requirements: string;
  scope: string;
  icon: IconName;
}

const agentTiers: AgentTier[] = [
  {
    name: 'Associate Verification Agent (Tier 1)',
    badge: 'Entry / Academic',
    payPerVerification: 'KES 2,500 - 4,000 per dossier',
    requirements: 'Bachelor degree + 2 yrs HR/administrative experience',
    scope: 'KNQA university transcripts, diploma validation, entry-to-mid career employer references.',
    icon: 'academicCap',
  },
  {
    name: 'Senior Field Inspector (Tier 2)',
    badge: 'Technical & Regulated',
    payPerVerification: 'KES 6,000 - 10,000 per dossier',
    requirements: '5+ yrs specialized industry practice or professional board registration (EBK, LSK, KMPDC)',
    scope: 'Senior engineering licenses, medical practitioner validations, confidential supervisor audio audits.',
    icon: 'shieldCheck',
  },
  {
    name: 'Lead Aviation & Forensic Certifier (Tier 3)',
    badge: 'Mission-Critical & Executive',
    payPerVerification: 'KES 15,000 - 30,000 per dossier',
    requirements: '8+ yrs flight operations (ATPL/CPL) or senior executive forensics audit experience',
    scope: 'Commercial airline pilot logbooks, type ratings, C-suite background vetting, fraud forensic reports.',
    icon: 'sparkles',
  },
];

const agentReviews = [
  {
    name: 'Eng. Dennis Omondi',
    role: 'Senior Civil Engineering Certifier',
    location: 'Nairobi Hub',
    verificationsDone: '340+ Verified Dossiers',
    earnings: 'Avg. KES 145,000 / month part-time',
    quote: 'Being a VerifiedHire agent gives me flexible supplemental income while protecting our national infrastructure from unqualified impostors.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Dr. Sharon Koech',
    role: 'Medical & Clinical Staff Certifier',
    location: 'Eldoret Hub',
    verificationsDone: '210+ Verified Dossiers',
    earnings: 'Avg. KES 120,000 / month part-time',
    quote: 'The AI-assisted document screening makes the job seamless. I conduct rigorous peer references and ensure genuine healthcare professionals get hired.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200',
  },
];

export const BecomeAnAgentPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [step, setStep] = useState<number>(1);
  const [weeklyVerifications, setWeeklyVerifications] = useState<number>(4);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [applicationId, setApplicationId] = useState<string>('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [primaryDomain, setPrimaryDomain] = useState('Software & Technology');
  const [yearsExperience, setYearsExperience] = useState('3-5 years');
  const [professionalBoard, setProfessionalBoard] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [motivation, setMotivation] = useState('');

  // Earnings calculation: approx KES 6,500 average per verification * 4.3 weeks
  const estimatedMonthlyEarnings = weeklyVerifications * 6500 * 4.33;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'VHA-' + Math.floor(100000 + Math.random() * 900000);
    setApplicationId(id);
    setSubmitted(true);
  };

  return (
    <div className="bg-white dark:bg-indigo-950 py-12 sm:py-20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-6">
            Elite Verification Agent Network
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Verify the Best. <span className="text-indigo-600 dark:text-indigo-400">Earn On Your Schedule.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-indigo-200 leading-relaxed">
            Apply to become an accredited VerifiedHire field certifier. Validate credentials for pilots, software engineers, doctors, and executive talent using our AI-assisted platform.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-sm"
            >
              Start Agent Application
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-8 py-3.5 bg-slate-100 dark:bg-indigo-900 text-slate-700 dark:text-indigo-200 hover:bg-slate-200 dark:hover:bg-indigo-800 font-bold rounded-xl transition-all text-sm"
            >
              How Verification Works
            </button>
          </div>
        </div>

        {/* Interactive Earnings Calculator */}
        <div className="bg-slate-50 dark:bg-indigo-900/30 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-indigo-800/80 shadow-xl mb-24">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Transparent Compensation</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Interactive Agent Earnings Calculator</h2>
            <p className="text-sm text-slate-600 dark:text-indigo-300 mt-2">
              Agents are paid directly per completed and audited verification dossier. Estimate your monthly earnings based on weekly commitment.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-indigo-200">Weekly Completed Verifications</p>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{weeklyVerifications} dossier{weeklyVerifications > 1 ? 's' : ''} / week</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm font-bold text-slate-700 dark:text-indigo-200">Estimated Monthly Earnings</p>
                <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  KES {Math.round(estimatedMonthlyEarnings).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-indigo-400 mt-1">~${Math.round(estimatedMonthlyEarnings / 130).toLocaleString()} USD / month</p>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={weeklyVerifications}
              onChange={(e) => setWeeklyVerifications(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs font-semibold text-slate-400 dark:text-indigo-400 mt-2">
              <span>1 dossier/week (Casual)</span>
              <span>10 dossiers/week (Part-time)</span>
              <span>20 dossiers/week (Full-time inspector)</span>
            </div>
          </div>
        </div>

        {/* Tier Breakdown */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Agent Tiers & Specializations</h2>
            <p className="mt-2 text-slate-600 dark:text-indigo-300">
              Progress through our accredited tiers as your verification volume and accuracy rating increase.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agentTiers.map((tier) => (
              <div key={tier.name} className="bg-white dark:bg-indigo-900/20 p-8 rounded-3xl border border-slate-200 dark:border-indigo-800 flex flex-col justify-between hover:shadow-xl transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Icon name={tier.icon} className="h-6 w-6" />
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                      {tier.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                  <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-2">{tier.payPerVerification}</p>
                  
                  <div className="mt-6 space-y-3 text-xs">
                    <div>
                      <p className="font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300">Qualification Bar:</p>
                      <p className="text-slate-600 dark:text-indigo-200 mt-1">{tier.requirements}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300">Verification Scope:</p>
                      <p className="text-slate-600 dark:text-indigo-200 mt-1">{tier.scope}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Agent Spotlights */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Voices From the Field</h2>
            <p className="mt-2 text-slate-600 dark:text-indigo-300">Learn how certified professionals earn and uphold standards across Kenya.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agentReviews.map((rev) => (
              <div key={rev.name} className="p-8 bg-slate-50 dark:bg-indigo-900/20 rounded-3xl border border-slate-200 dark:border-indigo-800 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <img src={rev.image} alt={rev.name} className="h-20 w-20 rounded-2xl object-cover flex-shrink-0" />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{rev.name}</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded">
                      {rev.location}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{rev.role}</p>
                  <p className="text-xs text-slate-500 dark:text-indigo-300 mt-1">{rev.verificationsDone} • <span className="font-bold text-emerald-600 dark:text-emerald-400">{rev.earnings}</span></p>
                  <p className="text-xs text-slate-600 dark:text-indigo-200 mt-3 italic leading-relaxed">"{rev.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form Section */}
        <div id="application-form" className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-indigo-900/30 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-indigo-800 shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Join the Certification Corps</span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Agent Accreditation Application</h2>
              <p className="text-xs text-slate-500 dark:text-indigo-300 mt-1">Applications are reviewed within 48 business hours.</p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="checkCircle" className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Application Dossier Submitted!</h3>
                <div className="p-4 bg-slate-50 dark:bg-indigo-900/40 rounded-2xl max-w-sm mx-auto border border-slate-200 dark:border-indigo-800">
                  <p className="text-xs text-slate-500 dark:text-indigo-300 uppercase font-bold tracking-wider">Candidate Reference ID</p>
                  <p className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400 mt-1">{applicationId}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-indigo-200 max-w-md mx-auto">
                  Thank you, <span className="font-bold">{fullName}</span>! Our Chief Verification Officer has received your submission. We have dispatched next steps to <span className="font-bold">{email}</span>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setStep(1);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                      setMotivation('');
                    }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-8 px-4">
                  {[
                    { s: 1, label: 'Identity' },
                    { s: 2, label: 'Expertise' },
                    { s: 3, label: 'Declaration' },
                  ].map((item) => (
                    <div key={item.s} className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        step === item.s
                          ? 'bg-indigo-600 text-white'
                          : step > item.s
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-indigo-800 text-slate-500 dark:text-indigo-300'
                      }`}>
                        {step > item.s ? '✓' : item.s}
                      </div>
                      <span className={`text-xs font-semibold hidden sm:inline ${step === item.s ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-indigo-300'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Full Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="As appearing on Kenyan National ID or Passport"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Phone Number (M-Pesa registered) *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+254 7..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Primary Base Location *</label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Nairobi">Nairobi & Environs</option>
                          <option value="Mombasa">Mombasa & Coast</option>
                          <option value="Kisumu">Kisumu & Western</option>
                          <option value="Eldoret">Eldoret & North Rift</option>
                          <option value="Nakuru">Nakuru & Central Rift</option>
                          <option value="Other">Other Kenya Counties</option>
                        </select>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (fullName && email && phone) setStep(2);
                          }}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                        >
                          Next: Expertise & Domain →
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Domain of Specialized Competency *</label>
                        <select
                          value={primaryDomain}
                          onChange={(e) => setPrimaryDomain(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Software & Technology">Software Engineering, Cloud & AI</option>
                          <option value="Aviation & Flight Ops">Commercial Aviation, Piloting & Maintenance</option>
                          <option value="Civil & Mechanical Eng">Civil, Mechanical & Electrical Engineering</option>
                          <option value="Healthcare & Nursing">Medicine, Nursing & Clinical Laboratory</option>
                          <option value="Banking & Finance">Banking, Actuarial & Financial Audit</option>
                          <option value="Legal & Compliance">Legal Practice & Corporate Governance</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Industry Experience *</label>
                          <select
                            value={yearsExperience}
                            onChange={(e) => setYearsExperience(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="2-3 years">2 - 3 Years</option>
                            <option value="3-5 years">3 - 5 Years</option>
                            <option value="5-8 years">5 - 8 Years</option>
                            <option value="8+ years">8+ Years (Senior Lead)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Professional License # (If applicable)</label>
                          <input
                            type="text"
                            value={professionalBoard}
                            onChange={(e) => setProfessionalBoard(e.target.value)}
                            placeholder="e.g. EBK #18294 or KCAA Lic #..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">LinkedIn Profile URL *</label>
                        <input
                          type="url"
                          required
                          value={linkedInUrl}
                          onChange={(e) => setLinkedInUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 text-slate-700 dark:text-indigo-200 font-bold text-xs"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (linkedInUrl) setStep(3);
                          }}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                        >
                          Next: Code of Conduct →
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 mb-1">Why do you wish to join as a Verification Agent? *</label>
                        <textarea
                          required
                          rows={4}
                          value={motivation}
                          onChange={(e) => setMotivation(e.target.value)}
                          placeholder="Describe your background and commitment to rigorous, unbiased verification standards..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-900/40 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="p-4 bg-indigo-50/70 dark:bg-indigo-900/40 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-xs text-slate-700 dark:text-indigo-200 space-y-2">
                        <p className="font-bold text-indigo-900 dark:text-white">Accreditation Pledge:</p>
                        <p>1. I will conduct verification investigations with absolute neutrality, zero bribery tolerance, and strict adherence to the Kenya Data Protection Act 2019.</p>
                        <p>2. I understand any intentional false attestation constitutes criminal perjury and will result in immediate disqualification and regulatory escalation.</p>
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-800 text-slate-700 dark:text-indigo-200 font-bold text-xs"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                        >
                          Submit Formal Accreditation Dossier
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
