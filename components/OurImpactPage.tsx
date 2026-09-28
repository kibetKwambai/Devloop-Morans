import React, { useState, useEffect, useRef } from 'react';
import { Icon, IconName } from './Icon';
import { VerifiedHireLogo } from './VerifiedHireLogo';
import { UserRole } from '../types';

interface OurImpactPageProps {
  onNavigate: (view: string, target?: 'jobSeeker' | 'employer' | 'agent' | 'admin' | 'all') => void;
  isLoggedIn?: boolean;
  userRole?: UserRole | null;
}

interface SectorStory {
  id: string;
  sector: string;
  badge: string;
  icon: IconName;
  headline: string;
  stat: string;
  statSub: string;
  storyQuote: string;
  storyAuthor: string;
  storyRole: string;
  authorAvatar: string;
  before: string;
  after: string;
  accentColor: string;
}

const SECTOR_STORIES: SectorStory[] = [
  {
    id: 'aviation',
    sector: 'Aviation & Aerospace',
    badge: 'KCAA Regulated',
    icon: 'globeAlt',
    headline: 'Safer Skies Over East Africa',
    stat: '100% KCAA Primary Source Verified',
    statSub: 'Every pilot & AME on registry confirmed directly with civil aviation authority',
    storyQuote: '"We caught an applicant with a fabricated Boeing 737 type rating 18 hours before his scheduled line check. That single verification protocol protected hundreds of lives."',
    storyAuthor: 'Capt. David Mutua',
    storyRole: 'Director of Flight Safety Operations, Regional Carrier',
    authorAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
    before: 'Resume claims & unverified photocopies passed between HR desks',
    after: 'Cryptographic KCAA registrar verification with real-time class medical checks',
    accentColor: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'security',
    sector: 'Home Security & Gated Communities',
    badge: 'DCI Good Conduct Checked',
    icon: 'shieldCheck',
    headline: 'The Gatekeeper Test: Real Household Security',
    stat: '99.8% Incident-Free Placement Rate',
    statSub: 'Over 4,200 residential guards and security staff biometric-cleared via DCI',
    storyQuote: '"When our estate association mandated VerifiedHire vetting, we discovered a newly applied guard had an active criminal record for burglary before he was handed our perimeter keys."',
    storyAuthor: 'Grace Wambui',
    storyRole: 'Chairperson, Karen Plains Resident Welfare Association',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    before: 'Neighborhood hearsay, verbal recommendations, and forged ID cards',
    after: 'Forensic DCI police clearance, verified supervisor affidavits & biometric ID',
    accentColor: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'domestic',
    sector: 'Domestic Care, House Managers & Mama Fua',
    badge: '48h Verified Match',
    icon: 'heart',
    headline: 'Dignity, Verified: Safe Homes & Fair Wages',
    stat: 'Under 48 Hours to Trusted Placement',
    statSub: 'Verified National IDs, reference affidavits & health clearances recorded upfront',
    storyQuote: '"Before VerifiedHire, families bargained me down out of suspicion. With my verified digital passport, I found a wonderful home in Kilimani in 2 days and earned double my former rate with full respect."',
    storyAuthor: 'Mary Akinyi',
    storyRole: 'Certified House Manager & Professional Mama Fua, Nairobi',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    before: 'Months of anxiety, vague informal broker networks, and safety risks',
    after: 'Instant identity check, verified referee affidavits, and dignified fair contracts',
    accentColor: 'from-pink-600 to-rose-700'
  },
  {
    id: 'healthcare',
    sector: 'Healthcare & Clinical Medicine',
    badge: 'KMPDC & Nursing Council',
    icon: 'checkBadge',
    headline: 'The Right Hands When Lives Are On The Line',
    stat: 'Zero Unlicensed Practitioners Onboarded',
    statSub: 'Direct statutory validation with KMPDC, Nursing Council & Pharmacy Board',
    storyQuote: '"A clinical officer claiming eight years of surgical experience was blocked during credential screening when our system detected a mismatched KMPDC registration number."',
    storyAuthor: 'Dr. Evans Kiprop',
    storyRole: 'Chief Medical Officer, Nairobi Premier Care Hospital',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    before: 'Framed wall certificates easily forged with desktop design tools',
    after: 'Direct primary-source license validation & Kenya Data Protection-compliant checks',
    accentColor: 'from-cyan-600 to-blue-700'
  },
  {
    id: 'education',
    sector: 'Education & Child Safety',
    badge: 'TSC & KNEC Validated',
    icon: 'academicCap',
    headline: 'The Educators We Trust With Tomorrow',
    stat: '100% TSC Certified Teaching Faculty',
    statSub: 'Academic degree equation & child safety clearances verified before term starts',
    storyQuote: '"We screened all 34 incoming teachers before the opening term. Every parent in our school assembly knows their child is mentored by authentic, vetted professionals."',
    storyAuthor: 'Scholastica Omondi',
    storyRole: 'Principal, Nairobi Academic Leadership School',
    authorAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200&auto=format&fit=crop&q=80',
    before: 'Unverified testimonial letters and unconfirmed academic transcripts',
    after: 'Automated TSC standing validation and KNEC certified degree records',
    accentColor: 'from-amber-600 to-orange-700'
  },
  {
    id: 'finance',
    sector: 'Corporate, Banking & Executive Leadership',
    badge: 'CFO & Board Verified',
    icon: 'briefcase',
    headline: 'The Executive Integrity Layer for East Africa',
    stat: 'KSh 240M+ Fraud Exposure Averted',
    statSub: 'Eliminating executive resume inflation across banking, fintech & legal sectors',
    storyQuote: '"A finalist for our Head of Treasury role had fabricated his CPA-K and MBA honors. VerifiedHire protected our board from a catastrophic regulatory penalty."',
    storyAuthor: 'James Ndung\'u',
    storyRole: 'Chief Financial Officer, Regional Tier-1 Commercial Bank',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    before: 'Polished CVs, charismatic interviews, and unverified reference phone calls',
    after: 'Sealed university registrar records, ICPAK verification, and legal affidavits',
    accentColor: 'from-purple-600 to-indigo-800'
  }
];

const ALL_16_SECTORS = [
  { id: '1', name: 'Aviation & Piloting', claim: 'Zero unlicensed flight personnel on active routes', icon: 'globeAlt' as IconName },
  { id: '2', name: 'Home Security & Guards', claim: 'DCI forensic police clearance for every gate officer', icon: 'shieldCheck' as IconName },
  { id: '3', name: 'Mama Fua & Domestic Care', claim: 'Fair pay & instant trust in under 48 hours', icon: 'heart' as IconName },
  { id: '4', name: 'Healthcare & Surgery', claim: '100% KMPDC statutory license check before triage', icon: 'checkBadge' as IconName },
  { id: '5', name: 'Education & Teachers', claim: 'TSC registered educators safeguarding schools', icon: 'academicCap' as IconName },
  { id: '6', name: 'Banking & Financial Risk', claim: 'CPA-K & ICPAK audit checks for executive hires', icon: 'briefcase' as IconName },
  { id: '7', name: 'Legal & Compliance', claim: 'LSK advocate practicing status verified at source', icon: 'scale' as IconName },
  { id: '8', name: 'Engineering & Construction', claim: 'EBK & NCA certified structural engineers', icon: 'wrenchScrewdriver' as IconName },
  { id: '9', name: 'Electrical & Energy', claim: 'EPRA licensed wiremen and solar technicians', icon: 'bolt' as IconName },
  { id: '10', name: 'Hospitality & Culinary', claim: 'Public health certificates & verified hotel chefs', icon: 'sparkles' as IconName },
  { id: '11', name: 'Logistics & Fleet Drivers', claim: 'NTSA commercial driving badges & clean records', icon: 'map' as IconName },
  { id: '12', name: 'Childcare & Nannies', claim: 'Pediatric first aid & household background clearance', icon: 'heart' as IconName },
  { id: '13', name: 'Plumbing & Artisans', claim: 'NITA certified master technicians & artisans', icon: 'wrenchScrewdriver' as IconName },
  { id: '14', name: 'Agriculture & Agribusiness', claim: 'Verified agronomists & food safety certifiers', icon: 'sun' as IconName },
  { id: '15', name: 'Cybersecurity & Tech', claim: 'ODPC data protection officers & ethical hackers', icon: 'terminal' as IconName },
  { id: '16', name: 'Public Sector & County Gov', claim: 'Statutory Chapter 6 integrity & ethics clearance', icon: 'buildingOffice' as IconName }
];

const KENYA_COUNTY_DATA = [
  { name: 'Nairobi', count: 6420, topSector: 'Tech, Finance & Domestic Care', coords: 'cx="230" cy="270"' },
  { name: 'Mombasa', count: 1840, topSector: 'Aviation, Maritime & Security', coords: 'cx="310" cy="360"' },
  { name: 'Kisumu', count: 1420, topSector: 'Healthcare, Education & Trades', coords: 'cx="140" cy="240"' },
  { name: 'Nakuru', count: 1180, topSector: 'Engineering, Agriculture & Logistics', coords: 'cx="190" cy="235"' },
  { name: 'Uasin Gishu (Eldoret)', count: 980, topSector: 'Aviation Training & Healthcare', coords: 'cx="160" cy="205"' },
  { name: 'Kiambu', count: 1350, topSector: 'Domestic Managers, Construction & Security', coords: 'cx="225" cy="255"' },
  { name: 'Machakos', count: 740, topSector: 'Manufacturing & Artisans', coords: 'cx="250" cy="285"' },
  { name: 'Kilifi', count: 620, topSector: 'Hospitality & Maritime', coords: 'cx="315" cy="330"' },
  { name: 'Garissa & North Eastern', count: 480, topSector: 'Logistics & Healthcare Missions', coords: 'cx="310" cy="220"' },
  { name: 'Turkana & Northern Kenya', count: 390, topSector: 'Energy, Logistics & Engineering', coords: 'cx="150" cy="110"' }
];

const TESTIMONIALS = [
  {
    quote: "VerifiedHire eliminated the guessing game in our flight operations. We only review candidates who have verified KCAA credentials.",
    name: "Capt. David Mutua",
    role: "Director of Flight Operations",
    org: "Regional Air Carrier",
    sector: "Aviation",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80"
  },
  {
    quote: "Finding a verified Mama Fua and house manager who has a DCI clearance gave my family safety and gave our house manager fair pay.",
    name: "Dr. Sarah Njoroge",
    role: "Parent & Surgeon",
    org: "Kilimani Resident",
    sector: "Domestic Care",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
  },
  {
    quote: "My VerifiedHire digital passport proved my skills and clean record. Within 48 hours, I was hired with a 100% salary increase.",
    name: "Mary Akinyi",
    role: "Certified House Manager",
    org: "Verified Candidate",
    sector: "Home Management",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  },
  {
    quote: "We caught three fraudulent credentials before onboarding last quarter. VerifiedHire saves institutions millions and protects patients.",
    name: "Dr. Evans Kiprop",
    role: "Chief Medical Officer",
    org: "Nairobi Premier Care",
    sector: "Healthcare",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
  }
];

export const OurImpactPage: React.FC<OurImpactPageProps> = ({ onNavigate, isLoggedIn, userRole }) => {
  // Animated Hero Counter
  const [fraudCounter, setFraudCounter] = useState(0);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeCounty, setActiveCounty] = useState(KENYA_COUNTY_DATA[0]);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingSlider = useRef(false);

  // Counter animation on load
  useEffect(() => {
    let current = 0;
    const target = 11; // 1 falsified credential every 11 minutes (illustrative)
    const interval = setInterval(() => {
      current += 1;
      if (current <= target) {
        setFraudCounter(current);
      } else {
        clearInterval(interval);
      }
    }, 90);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotating testimonials
  useEffect(() => {
    if (isTestimonialPaused) return;
    const timer = setInterval(() => {
      setTestimonialIdx(prev => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isTestimonialPaused]);

  // Handle Drag / Touch on Before/After slider
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseDown = () => {
    isDraggingSlider.current = true;
  };

  const handleMouseUp = () => {
    isDraggingSlider.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSlider.current) {
      handleSliderMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="bg-[#0B0B0F] text-slate-100 font-sans min-h-screen selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      {/* Standalone Impact Page Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0B0B0F]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <VerifiedHireLogo 
            variant="horizontal" 
            size="md" 
            onClick={() => onNavigate('landing')}
          />
          <span className="hidden sm:inline-block h-4 w-px bg-slate-800" />
          <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-indigo-400">
            Our National Impact &bull; 16 Sectors
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Icon name="arrowLeft" className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>
          
          <button
            onClick={() => onNavigate('employer')}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Hire Verified Talent
          </button>
        </div>
      </header>

      {/* Skip to stats link for accessibility */}
      <a
        href="#stats-ticker"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl"
      >
        Skip to impact stats &amp; metrics
      </a>

      {/* ========================================================= */}
      {/* PHASE I0 — HERO: THE STAKES                              */}
      {/* ========================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 text-center overflow-hidden">
        {/* Subtle Ambient Mesh & Slow Particle Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-blue-500/10 rounded-full blur-[140px] animate-pulse duration-1000" />
          <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-teal-500/20 via-indigo-700/20 to-transparent rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-7">
          {/* Live Risk Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-bold shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>The Reality of Unverified Hiring in East Africa</span>
          </div>

          {/* Visceral Headline (I0.1) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
            One Unverified Hire Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-indigo-300 to-teal-300">Cost Everything.</span>
          </h1>

          {/* Plain Language Subhead */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed text-balance">
            VerifiedHire verifies real people against real primary records — so the <strong className="text-white font-bold">pilot flying your family</strong>, the <strong className="text-white font-bold">guard watching your gate</strong>, and the <strong className="text-white font-bold">nurse in your ward</strong> are exactly who they claim to be.
          </p>

          {/* Animated Risk Counter (I0.2) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                1 in {fraudCounter || 11} min
              </div>
              <div className="text-left text-xs leading-snug">
                <span className="font-bold text-slate-200 block">Falsified Credential Detected</span>
                <span className="text-[10px] text-slate-500 block">*Illustrative sample rate across East African corporate audits</span>
              </div>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('sector-stories');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Sector Impact Stories</span>
              <Icon name="arrowDownTray" className="h-4 w-4 rotate-[-90deg]" />
            </button>
          </div>

          {/* Scroll Cue (I0.3) */}
          <div className="pt-10 flex flex-col items-center gap-2 opacity-70 animate-bounce">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Scroll to Witness Impact</span>
            <Icon name="chevronDown" className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PHASE I1 — THE VERIFIED ECONOMY TICKER                   */}
      {/* ========================================================= */}
      <section id="stats-ticker" className="border-y border-slate-800/80 bg-slate-950/80 py-5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-around gap-6 text-center">
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">14,820+</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Primary-Verified Passports</div>
              <div className="text-[9px] text-slate-500">*Illustrative verified candidate benchmark</div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">4,250+</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Families &amp; Estates Protected</div>
              <div className="text-[9px] text-slate-500">*Home guards, nannies &amp; house managers</div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono tracking-tight">16</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Statutory Regulated Sectors</div>
              <div className="text-[9px] text-slate-500">*Aviation, KMPDC, EBK, LSK, DCI, TSC, etc.</div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono tracking-tight">47</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kenyan Counties Covered</div>
              <div className="text-[9px] text-slate-500">*Nationwide primary source verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PHASE I2 — SECTOR STORIES (Core Chapters)                */}
      {/* ========================================================= */}
      <section id="sector-stories" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Chapter By Chapter</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How Verification Changes Real Lives Across Kenya
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From cockpit safety to household peace of mind, examine the human reality behind verified credentials.
          </p>
        </div>

        {/* Individual Story Chapters */}
        <div className="space-y-20">
          {SECTOR_STORIES.map((story, idx) => (
            <div 
              key={story.id} 
              className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all hover:border-slate-700"
            >
              {/* Background gradient accent */}
              <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${story.accentColor} opacity-10 rounded-full blur-[100px] pointer-events-none`} />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Sector Badge, Headline & Stat */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                      <Icon name={story.icon} className="h-3.5 w-3.5" />
                      <span>{story.sector}</span>
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {story.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {story.headline}
                  </h3>

                  {/* Striking Stat Card */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <div className="text-lg sm:text-xl font-black text-indigo-400 font-mono">
                      {story.stat}
                    </div>
                    <div className="text-xs text-slate-400">
                      {story.statSub}
                    </div>
                  </div>

                  {/* Human Micro-Story (First Person Quote) */}
                  <div className="p-5 rounded-2xl bg-indigo-950/20 border-l-4 border-indigo-500 space-y-3">
                    <p className="text-sm sm:text-base text-slate-200 italic font-medium leading-relaxed">
                      {story.storyQuote}
                    </p>
                    <div className="flex items-center gap-3">
                      <img 
                        src={story.authorAvatar} 
                        alt={story.storyAuthor} 
                        className="h-10 w-10 rounded-full object-cover border border-slate-700" 
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{story.storyAuthor}</div>
                        <div className="text-[11px] text-slate-400">{story.storyRole}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Before vs After Contrast */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                      <Icon name="xCircle" className="h-4 w-4" />
                      <span>Before VerifiedHire (The Risk)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {story.before}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <Icon name="checkCircle" className="h-4 w-4" />
                      <span>With VerifiedHire (The Certainty)</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      {story.after}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 16 SECTORS FINALE CONSTELLATION (I2.7) */}
        <div className="pt-10 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-teal-400">Complete Economic Coverage</span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              16 Regulated Sectors Protected By Verified Sovereignty
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Tap any sector to see how statutory verification safeguards operations and integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {ALL_16_SECTORS.map(sec => {
              const isSelected = selectedSectorFilter === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectorFilter(isSelected ? null : sec.id)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-600/30 border-indigo-500 shadow-lg shadow-indigo-600/20 scale-[1.02]' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 flex-shrink-0">
                      <Icon name={sec.icon} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{sec.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{sec.claim}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PHASE I3 — THE BEFORE/AFTER INTERACTIVE WALL             */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Interactive Proof</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            The Before &amp; After Hiring Wall
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Drag the slider or use keyboard arrow keys to compare unverified hiring chaos against verified certainty.
          </p>
        </div>

        {/* Draggable Slider Container */}
        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          tabIndex={0}
          role="slider"
          aria-valuenow={Math.round(sliderPosition)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Before and After Verification Comparison Slider"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setSliderPosition(prev => Math.max(0, prev - 5));
            if (e.key === 'ArrowRight') setSliderPosition(prev => Math.min(100, prev + 5));
          }}
          className="relative h-96 sm:h-[420px] rounded-3xl border border-slate-700 overflow-hidden select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xl"
        >
          {/* Right Layer: Verified Certainty (Emerald/Brand) */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 p-8 sm:p-12 flex flex-col justify-between">
            <div className="flex justify-end">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <Icon name="shieldCheck" className="h-4 w-4" />
                <span>VerifiedHire (Order &amp; Trust)</span>
              </span>
            </div>

            <div className="max-w-md ml-auto text-right space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white">48-Hour Sealed Dossiers</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Primary-source validation across KCAA, KMPDC, EBK, DCI &amp; KNEC. Direct employer affidavits, sealed cryptographic stamps, zero fraud exposure.
              </p>
              <div className="flex justify-end gap-2 text-xs font-mono text-emerald-400">
                <span>✔ 100% Validated</span>
                <span>•</span>
                <span>✔ SLA Timers</span>
                <span>•</span>
                <span>✔ 99.8% Trust</span>
              </div>
            </div>
          </div>

          {/* Left Layer: Unverified Chaos (Red) */}
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-br from-rose-950 via-slate-950 to-slate-900 p-8 sm:p-12 flex flex-col justify-between overflow-hidden border-r-2 border-white"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="flex justify-start">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 whitespace-nowrap">
                <Icon name="exclamationTriangle" className="h-4 w-4" />
                <span>Unverified Chaos (The Risk)</span>
              </span>
            </div>

            <div className="max-w-md space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-rose-100 whitespace-nowrap">Forged Certificates &amp; Ghosting</h3>
              <p className="text-xs sm:text-sm text-rose-200/80">
                Unchecked CV claims, fake degrees, stolen identities, prolonged dispute delays, and catastrophic organizational liability.
              </p>
              <div className="flex gap-2 text-xs font-mono text-rose-400">
                <span>✗ 42 Days Lost</span>
                <span>•</span>
                <span>✗ Fake References</span>
              </div>
            </div>
          </div>

          {/* Slider Thumb Handle */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center font-bold text-xs pointer-events-none z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            &harr;
          </div>
        </div>

        {/* 3 Real-World Cost Callouts (I3.2) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400">Bad Executive Hire Cost</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">KSh 4.8M</div>
            <p className="text-[11px] text-slate-400">*Average replacement, remediation &amp; severance liability (illustrative sample)</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Annual Credential Fraud Loss</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">KSh 18.2B</div>
            <p className="text-[11px] text-slate-400">*Estimated industry-wide exposure from unqualified personnel (illustrative sample)</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Ghosting Delay Averted</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">42 Days &rarr; 48 Hrs</div>
            <p className="text-[11px] text-slate-400">*Turnaround reduction with primary-source pre-verified passports</p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PHASE I4 — KENYA MAP & REACH (47 Counties)               */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-teal-400">Nationwide Reach</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            14,800+ Verified Professionals Across 47 Counties
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tap or hover a county cluster to inspect sector breakdowns and verified personnel density (*sample data).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Interactive Kenya SVG Map (I4.1) */}
          <div className="lg:col-span-7 flex items-center justify-center p-4">
            <svg 
              viewBox="0 0 450 450" 
              className="w-full max-w-md h-auto filter drop-shadow-[0_0_20px_rgba(79,70,229,0.15)]"
              aria-label="Map of Kenya showing verified talent distribution"
            >
              {/* Kenya Map Outline Path */}
              <path
                d="M 120 70 L 220 50 L 330 90 L 390 190 L 360 270 L 320 380 L 250 350 L 190 320 L 130 270 L 110 180 Z"
                fill="#13141F"
                stroke="#3730A3"
                strokeWidth="2"
              />

              {/* County Pulsing Hotspots */}
              {KENYA_COUNTY_DATA.map((county, cIdx) => (
                <g 
                  key={cIdx}
                  onClick={() => setActiveCounty(county)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={county.name.includes('Nairobi') ? 220 : county.name.includes('Mombasa') ? 310 : county.name.includes('Kisumu') ? 140 : county.name.includes('Nakuru') ? 180 : county.name.includes('Eldoret') ? 150 : county.name.includes('Kiambu') ? 210 : county.name.includes('Machakos') ? 240 : county.name.includes('Kilifi') ? 315 : county.name.includes('Garissa') ? 300 : 160}
                    cy={county.name.includes('Nairobi') ? 260 : county.name.includes('Mombasa') ? 350 : county.name.includes('Kisumu') ? 230 : county.name.includes('Nakuru') ? 225 : county.name.includes('Eldoret') ? 195 : county.name.includes('Kiambu') ? 250 : county.name.includes('Machakos') ? 275 : county.name.includes('Kilifi') ? 320 : county.name.includes('Garissa') ? 210 : 110}
                    r={activeCounty.name === county.name ? 10 : 6}
                    fill={activeCounty.name === county.name ? "#4F46E5" : "#10B981"}
                    className="transition-all duration-300 animate-pulse"
                  />
                  <circle
                    cx={county.name.includes('Nairobi') ? 220 : county.name.includes('Mombasa') ? 310 : county.name.includes('Kisumu') ? 140 : county.name.includes('Nakuru') ? 180 : county.name.includes('Eldoret') ? 150 : county.name.includes('Kiambu') ? 210 : county.name.includes('Machakos') ? 240 : county.name.includes('Kilifi') ? 315 : county.name.includes('Garissa') ? 300 : 160}
                    cy={county.name.includes('Nairobi') ? 260 : county.name.includes('Mombasa') ? 350 : county.name.includes('Kisumu') ? 230 : county.name.includes('Nakuru') ? 225 : county.name.includes('Eldoret') ? 195 : county.name.includes('Kiambu') ? 250 : county.name.includes('Machakos') ? 275 : county.name.includes('Kilifi') ? 320 : county.name.includes('Garissa') ? 210 : 110}
                    r={activeCounty.name === county.name ? 18 : 12}
                    fill="none"
                    stroke={activeCounty.name === county.name ? "#818CF8" : "#34D399"}
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Active County Details Card (I4.2) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">County Regional Hub</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Active Field Agents</span>
              </div>

              <h3 className="text-2xl font-black text-white">{activeCounty.name}</h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Verified Talent</span>
                  <span className="text-lg font-black text-white font-mono mt-0.5 block">{activeCounty.count.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Avg Match SLA</span>
                  <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">&le; 48 Hrs</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Top Verified Sectors:</span>
                <span className="text-slate-200 font-semibold mt-0.5 block">{activeCounty.topSector}</span>
              </div>

              <div className="text-[10px] text-slate-500 italic">
                *Illustrative county registry distribution sample. Tap any marker to switch regions.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PHASE I5 — VOICES (Testimonials With Faces)              */}
      {/* ========================================================= */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8"
        onMouseEnter={() => setIsTestimonialPaused(true)}
        onMouseLeave={() => setIsTestimonialPaused(false)}
        onFocus={() => setIsTestimonialPaused(true)}
        onBlur={() => setIsTestimonialPaused(false)}
      >
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Authentic Voices</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tested and Proven by Industry Leaders &amp; Everyday Heroes
          </h2>
        </div>

        {/* Carousel Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              Sector: {TESTIMONIALS[testimonialIdx].sector}
            </div>

            <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed italic">
              &ldquo;{TESTIMONIALS[testimonialIdx].quote}&rdquo;
            </p>

            <div className="flex flex-col items-center gap-2">
              <img 
                src={TESTIMONIALS[testimonialIdx].avatar} 
                alt={TESTIMONIALS[testimonialIdx].name} 
                className="h-14 w-14 rounded-full object-cover border-2 border-indigo-500 shadow-md"
              />
              <div className="text-sm font-black text-white">{TESTIMONIALS[testimonialIdx].name}</div>
              <div className="text-xs text-slate-400">{TESTIMONIALS[testimonialIdx].role} &bull; {TESTIMONIALS[testimonialIdx].org}</div>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setTestimonialIdx(prev => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                aria-label="Previous Testimonial"
              >
                <Icon name="arrowLeft" className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {TESTIMONIALS.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setTestimonialIdx(dotIdx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      testimonialIdx === dotIdx ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-700'
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setTestimonialIdx(prev => (prev + 1) % TESTIMONIALS.length)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                aria-label="Next Testimonial"
              >
                <Icon name="arrowRight" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PHASE I6 — THE CLIMAX & CTA                              */}
      {/* ========================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-[#0B0B0F] via-slate-950 to-black relative">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-block p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/30">
            <VerifiedHireLogo variant="icon" size="lg" />
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            The Verified Economy Starts With One Hire.
          </h2>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Whether you are protecting your home, staffing an airline cockpit, or building a sovereign career passport — choose certainty over chance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('employer')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm sm:text-base shadow-2xl shadow-indigo-600/40 transition-all active:scale-95 cursor-pointer"
            >
              Hire Verified Talent (ATS) &rarr;
            </button>

            <button
              onClick={() => onNavigate('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Get Verified — Build Your Passport
            </button>
          </div>
        </div>
      </section>

      {/* Dedicated Impact Page Footer */}
      <footer className="border-t border-slate-800 bg-[#07070A] py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <VerifiedHireLogo variant="horizontal" size="sm" onClick={() => onNavigate('landing')} />
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} VerifiedHire Sovereign Impact</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => onNavigate('landing')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => onNavigate('jobPortal')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Job Portal
            </button>
            <button onClick={() => onNavigate('pricing')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Pricing
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => onNavigate('security')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Security &amp; ODPC
            </button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA Bar (Phase I6.2) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 z-40 flex items-center gap-2">
        <button
          onClick={() => onNavigate('employer')}
          className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs text-center shadow-md"
        >
          Hire Verified Talent
        </button>
        <button
          onClick={() => onNavigate('signup')}
          className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs text-center"
        >
          Get Verified
        </button>
      </div>
    </div>
  );
};
