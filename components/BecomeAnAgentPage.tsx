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
    payPerVerification: 'KES 50 - 70 bob per verified record',
    requirements: 'Bachelor degree or diploma + 1 yr administrative / HR experience',
    scope: 'KNQA university transcripts, diploma validation, entry-level employer contact cross-checks.',
    icon: 'academicCap',
  },
  {
    name: 'Senior Field Inspector (Tier 2)',
    badge: 'Technical & Regulated',
    payPerVerification: 'KES 75 - 90 bob per verified dossier',
    requirements: '3+ yrs industry practice or professional board registration (EBK, LSK, KMPDC)',
    scope: 'Engineering board registry lookups, clinical license verifications, direct employer references.',
    icon: 'shieldCheck',
  },
  {
    name: 'Lead Aviation & Forensic Certifier (Tier 3)',
    badge: 'Mission-Critical & Executive',
    payPerVerification: 'KES 95 - 100 bob per verified dossier',
    requirements: '5+ yrs specialized compliance, aviation operations, or forensic audit background',
    scope: 'Commercial airline pilot logbooks, type ratings, C-suite background vetting, forensic fraud checks.',
    icon: 'sparkles',
  },
];

const agentReviews = [
  {
    name: 'Eng. Dennis Omondi',
    role: 'Senior Civil Engineering Certifier',
    location: 'Nairobi Hub',
    verificationsDone: '210+ Verified Records',
    earnings: 'Avg. KES 18,500 / month part-time',
    quote: 'Being a VerifiedHire agent gives me flexible supplemental income at 85 to 100 bob per dossier while keeping fraudulent engineers off our national projects.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Dr. Sharon Koech',
    role: 'Medical & Clinical Staff Certifier',
    location: 'Eldoret Hub',
    verificationsDone: '160+ Verified Records',
    earnings: 'Avg. KES 14,200 / month part-time',
    quote: 'The automated screening makes each verification take mere minutes. At 80 to 90 bob per person with instant M-Pesa payouts, it fits effortlessly into my evenings.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200',
  },
];

export const BecomeAnAgentPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [step, setStep] = useState<number>(1);
  const [weeklyVerifications, setWeeklyVerifications] = useState<number>(35);
  const [ratePerVerification, setRatePerVerification] = useState<number>(90);
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

  // Realistic Kenyan earnings: rate between 50 and 100 bob per person
  const estimatedWeeklyEarnings = weeklyVerifications * ratePerVerification;
  const estimatedMonthlyEarnings = estimatedWeeklyEarnings * 4.33;
  const dailyAverageVerifications = Math.round(weeklyVerifications / 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'VHA-' + Math.floor(100000 + Math.random() * 900000);
    setApplicationId(id);
    setSubmitted(true);
  };

  return (
    <div className="py-10 sm:py-16 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 mb-6 shadow-xs">
            <Icon name="shieldCheck" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Accredited Field Agent Network
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Verify the Best. <span className="text-indigo-600 dark:text-indigo-400">Earn On Your Schedule.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Apply to become an accredited VerifiedHire field certifier. Validate career credentials for software engineers, pilots, healthcare personnel, and executive talent with instant M-Pesa payouts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-sm cursor-pointer"
            >
              Start Agent Application
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-8 py-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all text-sm cursor-pointer"
            >
              How Verification Works
            </button>
          </div>
        </div>

        {/* Realistic Interactive Earnings Calculator */}
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md mb-24 transition-colors">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Transparent Compensation &amp; Instant Settlement</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Interactive Agent Earnings Calculator</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Agents earn direct compensation per candidate credential audit completed, benchmarked realistically at <span className="font-bold text-slate-900 dark:text-white">KES 50 to 100 bob per person</span>.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Rate Selector: 100 bob or less */}
            <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Verification Payout Rate</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Per candidate / credential check (Max 100 Bob)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    KES {ratePerVerification} bob
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/ person</span>
                </div>
              </div>

              {/* Quick rate presets & slider */}
              <div className="space-y-3">
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={ratePerVerification}
                  onChange={(e) => setRatePerVerification(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  {[
                    { label: '50 bob (Quick ID)', rate: 50 },
                    { label: '70 bob (Academic)', rate: 70 },
                    { label: '85 bob (Employment)', rate: 85 },
                    { label: '100 bob (Forensic/Reg)', rate: 100 },
                  ].map((preset) => (
                    <button
                      key={preset.rate}
                      type="button"
                      onClick={() => setRatePerVerification(preset.rate)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                        ratePerVerification === preset.rate
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Volume Slider */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Weekly Verification Volume</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Number of people / credentials audited per week</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    {weeklyVerifications} people
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    (~{dailyAverageVerifications}/day)
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={weeklyVerifications}
                onChange={(e) => setWeeklyVerifications(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs font-semibold text-slate-400 dark:text-slate-400 mt-2">
                <span>5 people/wk (Casual review)</span>
                <span>35 people/wk (Part-time evening)</span>
                <span>100+ people/wk (Dedicated auditor)</span>
              </div>
            </div>

            {/* Output Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rate Per Person</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                  {ratePerVerification} bob
                </p>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Under 100 bob cap</span>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Weekly Earnings</span>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
                  KES {estimatedWeeklyEarnings.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Paid every Friday</span>
              </div>

              <div className="p-5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Estimated Monthly</span>
                <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
                  KES {Math.round(estimatedMonthlyEarnings).toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">~${Math.round(estimatedMonthlyEarnings / 130).toLocaleString()} USD / month</span>
              </div>
            </div>

            {/* Realistic Market Context Note */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
              <Icon name="checkCircle" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Realistic Kenyan Compensation Model:</p>
                <p className="mt-0.5">
                  Verification checks are streamlined with automated optical OCR and direct government registry integrations (KNQA, EBK, LSK, KCAA). Each audit takes approximately 3 to 7 minutes on the mobile agent dashboard, enabling you to comfortably verify 5 to 10 candidates in an hour and earn 500 to 1,000 bob per session with direct M-Pesa disbursement.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Tier Breakdown */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Agent Tiers &amp; Specializations</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Progress through our accredited tiers as your verification volume and accuracy rating increase.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agentTiers.map((tier) => (
              <div key={tier.name} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center">
                      <Icon name={tier.icon} className="h-6 w-6" />
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold uppercase rounded-full tracking-wider border border-indigo-200/60 dark:border-indigo-800/60">
                      {tier.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                  <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-2 font-mono">{tier.payPerVerification}</p>
                  
                  <div className="mt-6 space-y-3 text-xs">
                    <div>
                      <p className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Qualification Bar:</p>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">{tier.requirements}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Verification Scope:</p>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">{tier.scope}</p>
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
            <p className="mt-2 text-slate-600 dark:text-slate-300">Learn how certified professionals earn reliable supplemental income and uphold standards across Kenya.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agentReviews.map((rev) => (
              <div key={rev.name} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row gap-6 items-center sm:items-start shadow-xs">
                <img src={rev.image} alt={rev.name} className="h-20 w-20 rounded-2xl object-cover flex-shrink-0 border border-slate-200/80 dark:border-slate-800" />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{rev.name}</h4>
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                      {rev.location}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{rev.role}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{rev.verificationsDone} • <span className="font-bold text-indigo-600 dark:text-indigo-400">{rev.earnings}</span></p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 italic leading-relaxed">"{rev.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form Section */}
        <div id="application-form" className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl transition-colors">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Join the Certification Corps</span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Agent Accreditation Application</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Applications are reviewed within 48 business hours.</p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-800">
                  <Icon name="checkCircle" className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Application Dossier Submitted!</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl max-w-sm mx-auto border border-slate-200/80 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Candidate Reference ID</p>
                  <p className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400 mt-1">{applicationId}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
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
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
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
                          ? 'bg-indigo-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {step > item.s ? '✓' : item.s}
                      </div>
                      <span className={`text-xs font-semibold hidden sm:inline ${step === item.s ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Full Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="As appearing on Kenyan National ID or Passport"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Phone Number (M-Pesa registered) *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+254 7..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Primary Base Location *</label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                          <option value="Nairobi">Nairobi &amp; Environs</option>
                          <option value="Mombasa">Mombasa &amp; Coast</option>
                          <option value="Kisumu">Kisumu &amp; Western</option>
                          <option value="Eldoret">Eldoret &amp; North Rift</option>
                          <option value="Nakuru">Nakuru &amp; Central Rift</option>
                          <option value="Other">Other Kenya Counties</option>
                        </select>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (fullName && email && phone) setStep(2);
                          }}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          Next: Expertise &amp; Domain →
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Domain of Specialized Competency *</label>
                        <select
                          value={primaryDomain}
                          onChange={(e) => setPrimaryDomain(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                          <option value="Software & Technology">Software Engineering, Cloud &amp; AI</option>
                          <option value="Aviation & Flight Ops">Commercial Aviation, Piloting &amp; Maintenance</option>
                          <option value="Civil & Mechanical Eng">Civil, Mechanical &amp; Electrical Engineering</option>
                          <option value="Healthcare & Nursing">Medicine, Nursing &amp; Clinical Laboratory</option>
                          <option value="Banking & Finance">Banking, Actuarial &amp; Financial Audit</option>
                          <option value="Legal & Compliance">Legal Practice &amp; Corporate Governance</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Industry Experience *</label>
                          <select
                            value={yearsExperience}
                            onChange={(e) => setYearsExperience(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                          >
                            <option value="2-3 years">2 - 3 Years</option>
                            <option value="3-5 years">3 - 5 Years</option>
                            <option value="5-8 years">5 - 8 Years</option>
                            <option value="8+ years">8+ Years (Senior Lead)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Professional License # (If applicable)</label>
                          <input
                            type="text"
                            value={professionalBoard}
                            onChange={(e) => setProfessionalBoard(e.target.value)}
                            placeholder="e.g. EBK #18294 or KCAA Lic #..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile URL *</label>
                        <input
                          type="url"
                          required
                          value={linkedInUrl}
                          onChange={(e) => setLinkedInUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (linkedInUrl) setStep(3);
                          }}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          Next: Code of Conduct →
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Why do you wish to join as a Verification Agent? *</label>
                        <textarea
                          required
                          rows={4}
                          value={motivation}
                          onChange={(e) => setMotivation(e.target.value)}
                          placeholder="Describe your background and commitment to rigorous, unbiased verification standards..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                        <p className="font-bold text-slate-900 dark:text-white">Accreditation Pledge:</p>
                        <p>1. I will conduct verification investigations with absolute neutrality, zero bribery tolerance, and strict adherence to the Kenya Data Protection Act 2019.</p>
                        <p>2. I understand any intentional false attestation constitutes criminal perjury and will result in immediate disqualification and regulatory escalation.</p>
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
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
