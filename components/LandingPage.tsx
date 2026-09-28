import React, { useState, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon, IconName } from './Icon';
import { UserRole, IndustryCategory } from '../types';
import { mockProfiles, mockJobs, mockCategories, mockFAQs } from '../services/mockData';
import { VerifiedHireLogo, VerifiedHireIconMark } from './VerifiedHireLogo';

interface LandingPageProps {
    onNavigate: (view: string, role?: 'jobSeeker' | 'employer' | 'agent' | 'admin' | 'all', options?: any) => void;
    isLoggedIn?: boolean;
    userRole?: UserRole | null;
}

interface EnterprisePartner {
    name: string;
    ticker: string;
    sector: string;
    icon: IconName;
}

const enterpriseLeaders: EnterprisePartner[] = [
    { name: 'Safaricom PLC', ticker: 'NSE: SCOM', sector: 'Telecommunications & Tech', icon: 'sparkles' },
    { name: 'Kenya Airways', ticker: 'SkyTeam Member', sector: 'Aviation & Flight Operations', icon: 'globeAlt' },
    { name: 'KCB Group', ticker: 'NSE: KCB', sector: 'Commercial Banking', icon: 'shieldCheck' },
    { name: 'Equity Bank', ticker: 'NSE: EQTY', sector: 'Financial Services', icon: 'checkCircle' },
    { name: 'Andela', ticker: 'Global Tech', sector: 'Software Engineering', icon: 'academicCap' },
    { name: 'Twiga Foods', ticker: 'Supply Chain', sector: 'Agri-Logistics', icon: 'buildingOffice' },
    { name: 'Cellulant', ticker: 'Fintech Hub', sector: 'Payment Gateways', icon: 'zap' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, isLoggedIn, userRole }) => {
    // -------------------------------------------------------------
    // State Management
    // -------------------------------------------------------------
    const [selectedCluster, setSelectedCluster] = useState<string>('all');
    const [categorySearch, setCategorySearch] = useState<string>('');
    const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
    
    // Accordion State: Exactly ONE question open at a time
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Modal States
    const [showEmployerIntakeModal, setShowEmployerIntakeModal] = useState<boolean>(false);
    const [showSeekerIntakeModal, setShowSeekerIntakeModal] = useState<boolean>(false);

    // Form States - Employer (Max 5 fields on step 1)
    const [institutionName, setInstitutionName] = useState<string>('');
    const [institutionEmail, setInstitutionEmail] = useState<string>('');
    const [talentTargetRole, setTalentTargetRole] = useState<string>('');
    const [hiringUrgency, setHiringUrgency] = useState<string>('Immediate (within 14 days)');
    const [contactPhone, setContactPhone] = useState<string>('');
    const [isSubmittingEmployer, setIsSubmittingEmployer] = useState<boolean>(false);
    const [employerSuccess, setEmployerSuccess] = useState<boolean>(false);
    const [employerErrors, setEmployerErrors] = useState<{ [key: string]: string }>({});

    // Form States - Professional (Max 5 fields on step 1)
    const [seekerName, setSeekerName] = useState<string>('');
    const [seekerEmail, setSeekerEmail] = useState<string>('');
    const [seekerSpecialty, setSeekerSpecialty] = useState<string>('');
    const [seekerDegree, setSeekerDegree] = useState<string>('');
    const [seekerExperience, setSeekerExperience] = useState<string>('3-5 years');
    const [isSubmittingSeeker, setIsSubmittingSeeker] = useState<boolean>(false);
    const [seekerSuccess, setSeekerSuccess] = useState<boolean>(false);
    const [seekerErrors, setSeekerErrors] = useState<{ [key: string]: string }>({});

    // Carousel Ref for Mobile Sector Scrolling
    const carouselRef = useRef<HTMLDivElement>(null);

    // Filter Clusters
    const clusters = [
        { id: 'all', label: 'All Industries' },
        { id: 'tech', label: 'Technology & IT' },
        { id: 'finance', label: 'Banking & Legal' },
        { id: 'engineering', label: 'Engineering & Energy' },
        { id: 'health_agri', label: 'Health & Agriculture' },
        { id: 'logistics', label: 'Aviation & Logistics' },
        { id: 'social_creative', label: 'Creative & Public Sector' },
    ];

    const filteredCategories = mockCategories.filter(cat => {
        const matchesCluster = selectedCluster === 'all' || cat.cluster === selectedCluster;
        const matchesSearch = !categorySearch.trim() ||
            cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
            cat.sectorTag.toLowerCase().includes(categorySearch.toLowerCase()) ||
            cat.description.toLowerCase().includes(categorySearch.toLowerCase()) ||
            cat.keySkills.some(s => s.toLowerCase().includes(categorySearch.toLowerCase()));
        return matchesCluster && matchesSearch;
    });

    const displayedCategories = showAllCategories ? filteredCategories : filteredCategories.slice(0, 8);

    // -------------------------------------------------------------
    // Form Handlers with Plain-Language Validation
    // -------------------------------------------------------------
    const handleEmployerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: { [key: string]: string } = {};

        if (!institutionName.trim()) {
            errors.institutionName = 'Please provide your organization or company name.';
        }
        if (!institutionEmail.trim() || !institutionEmail.includes('@') || !institutionEmail.includes('.')) {
            errors.institutionEmail = 'Please provide a valid business email address.';
        }
        if (!talentTargetRole.trim()) {
            errors.talentTargetRole = 'Please specify the role you are looking to hire.';
        }
        if (!contactPhone.trim() || contactPhone.length < 8) {
            errors.contactPhone = 'Please provide a valid direct phone number.';
        }

        if (Object.keys(errors).length > 0) {
            setEmployerErrors(errors);
            return;
        }

        setEmployerErrors({});
        setIsSubmittingEmployer(true);

        setTimeout(() => {
            setIsSubmittingEmployer(false);
            setEmployerSuccess(true);
            setTimeout(() => {
                setShowEmployerIntakeModal(false);
                setEmployerSuccess(false);
                setInstitutionName('');
                setInstitutionEmail('');
                setTalentTargetRole('');
                setContactPhone('');
                onNavigate('signin', 'employer');
            }, 1800);
        }, 900);
    };

    const handleSeekerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: { [key: string]: string } = {};

        if (!seekerName.trim()) {
            errors.seekerName = 'Please enter your full official name.';
        }
        if (!seekerEmail.trim() || !seekerEmail.includes('@') || !seekerEmail.includes('.')) {
            errors.seekerEmail = 'Please provide a valid email address.';
        }
        if (!seekerSpecialty.trim()) {
            errors.seekerSpecialty = 'Please enter your primary profession or role title.';
        }
        if (!seekerDegree.trim()) {
            errors.seekerDegree = 'Please enter your highest completed degree or diploma.';
        }

        if (Object.keys(errors).length > 0) {
            setSeekerErrors(errors);
            return;
        }

        setSeekerErrors({});
        setIsSubmittingSeeker(true);

        setTimeout(() => {
            setIsSubmittingSeeker(false);
            setSeekerSuccess(true);
            setTimeout(() => {
                setShowSeekerIntakeModal(false);
                setSeekerSuccess(false);
                setSeekerName('');
                setSeekerEmail('');
                setSeekerSpecialty('');
                setSeekerDegree('');
                onNavigate('signin', 'jobSeeker');
            }, 1800);
        }, 900);
    };

    // Mobile Carousel Controls
    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -280 : 280;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full max-w-full overflow-x-clip bg-slate-50 dark:bg-[#0B0B0F] text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <div>
                <div role="note" aria-label="Preview data notice" className="border-b border-indigo-200 bg-indigo-50 text-indigo-950 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-100">
                    <div className="container mx-auto flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-3 sm:px-6 lg:px-8">
                        <span className="inline-flex w-fit items-center rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">Preview only</span>
                        <p className="leading-relaxed">Profiles, organizations, metrics, testimonials, and verification records are illustrative sample data. This preview does not perform real checks or process applications.</p>
                    </div>
                </div>
                {/* --------------------------------------------------------- */}
                {/* 1. HERO SECTION: PLAIN LANGUAGE, FLUID TYPOGRAPHY, 5-SEC TEST */}
                {/* --------------------------------------------------------- */}
                <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-200/80 dark:border-[#232330]">
                    {/* Ambient glow (disabled on small screens or reduced motion) */}
                    <div className="hidden md:block motion-reduce:hidden absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F46E5]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            
                            {/* Left: Value Proposition */}
                            <div className="lg:col-span-7 space-y-6 text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5]/20">
                                    <span className="h-2 w-2 rounded-full bg-[#4F46E5] motion-reduce:animate-none animate-pulse" />
                                    <span>Kenya's Verified Career &amp; Talent Platform</span>
                                </div>

                                <h1 className="text-[clamp(2rem,3.6vw+0.35rem,3.25rem)] font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
                                    Get Hired on Verified Merit. <br className="hidden sm:inline" />
                                    <span className="text-[#4F46E5] dark:text-[#818CF8]">Hire with Complete Trust.</span>
                                </h1>

                                <p className="text-[clamp(1rem,1vw+0.6rem,1.25rem)] text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                                    VerifiedHire connects pre-checked Kenyan professionals with top organizations. We verify degrees, past job experience, and statutory clearances directly with primary institutions—giving job seekers priority and employers zero hiring risk.
                                </p>

                                {/* Plain-Language CTAs */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                                    <button 
                                        onClick={() => onNavigate('jobBoard')}
                                        className="px-8 py-4 bg-[#4F46E5] hover:bg-[#6366F1] active:bg-[#4338CA] text-white font-bold rounded-2xl shadow-xl shadow-[#4F46E5]/25 transition-all text-sm sm:text-base flex items-center justify-center gap-2.5 min-h-[48px] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
                                    >
                                        <Icon name="briefcase" className="h-5 w-5" />
                                        <span>Find Verified Jobs</span>
                                    </button>

                                    <button 
                                        onClick={() => setShowEmployerIntakeModal(true)}
                                        className="px-8 py-4 bg-white dark:bg-[#121218] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/80 dark:border-[#232330] font-bold rounded-2xl transition-all text-sm sm:text-base flex items-center justify-center gap-2 min-h-[48px] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                                    >
                                        <span>Hire Pre-Vetted Talent</span>
                                        <Icon name="arrowRight" className="h-4 w-4" />
                                    </button>

                                    <button 
                                        onClick={() => setShowSeekerIntakeModal(true)}
                                        className="px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#4F46E5] dark:hover:text-white transition-colors cursor-pointer text-center min-h-[44px] flex items-center justify-center"
                                    >
                                        Get Your Profile Verified →
                                    </button>
                                </div>

                                {/* Trust Metrics summary */}
                                <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Icon name="checkCircle" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        100% Primary-Source Audited
                                    </span>
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Icon name="shieldCheck" className="h-4 w-4 text-[#4F46E5] dark:text-[#818CF8]" />
                                        Kenya Data Protection Act Aligned
                                    </span>
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Icon name="bolt" className="h-4 w-4 text-amber-500" />
                                        Fast-Track Placement
                                    </span>
                                </div>
                            </div>

                            {/* Right: Verified Candidate Dossier Preview */}
                            <div className="lg:col-span-5">
                                <div className="relative rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] p-6 sm:p-7 shadow-xl">
                                    
                                    {/* Simplified header on mobile, scanner effect only on desktop */}
                                    <div className="hidden md:block motion-reduce:hidden absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent shadow-[0_0_12px_#4F46E5] animate-scan-beam pointer-events-none z-10" />

                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#232330] text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                            <span className="font-bold text-slate-900 dark:text-white">Active Verified Dossier</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-[#4F46E5] dark:text-[#818CF8] bg-[#4F46E5]/10 px-2.5 py-1 rounded-full">
                                            Audit Passed 99.4%
                                        </span>
                                    </div>

                                    {/* Candidate Card Summary */}
                                    <div className="py-4 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] overflow-hidden flex-shrink-0 relative">
                                                <img 
                                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" 
                                                    alt="Portrait of Eng. Amara Kimani" 
                                                    width={56}
                                                    height={56}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover" 
                                                />
                                                <div className="absolute bottom-0 right-0 p-1 bg-[#4F46E5] text-white rounded-tl-md">
                                                    <Icon name="check" className="h-3 w-3" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white text-base">Eng. Amara Kimani, PE</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Lead Cloud &amp; Energy Systems Engineer</p>
                                                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                                    Official Registrar Verified
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-xs">
                                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161F] flex items-center justify-between">
                                                <span className="text-slate-600 dark:text-slate-400">University Degree</span>
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                    <Icon name="checkCircle" className="h-3.5 w-3.5" />
                                                    Confirmed with University
                                                </span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161F] flex items-center justify-between">
                                                <span className="text-slate-600 dark:text-slate-400">Past Employment</span>
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                    <Icon name="checkCircle" className="h-3.5 w-3.5" />
                                                    3 Manager References Verified
                                                </span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161F] flex items-center justify-between">
                                                <span className="text-slate-600 dark:text-slate-400">Statutory Clearances</span>
                                                <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">
                                                    KRA, DCI, HELB Compliant
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-200">
                                            <strong>Why employers love this:</strong> Every item on Amara's resume has been confirmed by our licensed verification agents before an interview ever takes place.
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------- */}
                {/* 2. PLAIN-LANGUAGE "HOW IT WORKS" STRIP (REQUIREMENT 2.2) */}
                {/* --------------------------------------------------------- */}
                <section id="how-it-works" className="py-12 md:py-16 bg-white dark:bg-[#121218] border-b border-slate-200/80 dark:border-[#232330]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-10">
                            <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-widest">
                                Transparent Three-Step Path
                            </span>
                            <h2 className="text-[clamp(1.5rem,2.5vw+0.5rem,2.25rem)] font-black text-slate-900 dark:text-white mt-1">
                                How VerifiedHire Works
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                Straightforward, honest, and fast. No hidden fees for candidates.
                            </p>
                        </div>

                        {/* 3 Steps: Apply -> We verify you -> Get matched */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            
                            {/* Step 1 */}
                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/80 dark:border-[#232330] flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="h-10 w-10 rounded-xl bg-[#4F46E5] text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-[#4F46E5]/20">
                                        1
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Apply</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                        Create your professional profile and upload your credentials in under five minutes.
                                    </p>
                                </div>
                                <div className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] pt-2">
                                    Simple online submission →
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/80 dark:border-[#232330] flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="h-10 w-10 rounded-xl bg-[#4F46E5] text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-[#4F46E5]/20">
                                        2
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">We Verify You</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                        Our accredited verification officers independently confirm your education, past jobs, and references directly with source institutions.
                                    </p>
                                </div>
                                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-2">
                                    Earn your Verified Badge →
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/80 dark:border-[#232330] flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="h-10 w-10 rounded-xl bg-[#4F46E5] text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-[#4F46E5]/20">
                                        3
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Get Matched</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                        Top employers review your authenticated profile and reach out directly with real job offers and interviews.
                                    </p>
                                </div>
                                <div className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] pt-2">
                                    Skip the resume queue →
                                </div>
                            </div>

                        </div>

                        {/* Section Action Button */}
                        <div className="mt-10 text-center">
                            <button 
                                onClick={() => onNavigate('jobBoard')}
                                className="px-6 py-3 bg-[#4F46E5] hover:bg-[#6366F1] text-white font-bold rounded-xl text-sm shadow-md transition-all inline-flex items-center gap-2 min-h-[44px] cursor-pointer"
                            >
                                <span>Browse Available Verified Roles</span>
                                <Icon name="arrowRight" className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------- */}
                {/* 3. TRUST PARTNERS TICKER                                  */}
                {/* --------------------------------------------------------- */}
                <section className="py-10 bg-slate-100/60 dark:bg-[#0E0E14] border-b border-slate-200/80 dark:border-[#232330]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-6">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                Trusted by Leading Employers &amp; Institutions Across Kenya
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                            {enterpriseLeaders.map((corp) => (
                                <div 
                                    key={corp.name}
                                    className="p-3 rounded-xl bg-white dark:bg-[#16161F] border border-slate-200/60 dark:border-[#232330] flex flex-col items-center text-center shadow-xs"
                                >
                                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full">
                                        {corp.name}
                                    </span>
                                    <span className="text-[10px] font-semibold text-[#4F46E5] dark:text-[#818CF8] mt-0.5">
                                        {corp.ticker}
                                    </span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-full">
                                        {corp.sector}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------- */}
                {/* 4. DUAL VERIFICATION PILLARS: PLAIN LANGUAGE REWRITE       */}
                {/* --------------------------------------------------------- */}
                <section className="py-16 md:py-24 bg-white dark:bg-[#121218] border-b border-slate-200/80 dark:border-[#232330]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-widest">
                                Why Verified Candidates Stand Out
                            </span>
                            <h2 className="text-[clamp(1.6rem,2.8vw+0.5rem,2.5rem)] font-black text-slate-900 dark:text-white mt-1">
                                Complete Background Verification You Can Count On
                            </h2>
                            <p className="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                                Standard job boards rely on unverified claims. We combine thorough human background checks with intelligent skill matching to ensure every qualification is authentic.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Pillar 1: Rigorous Background Checks */}
                            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/80 dark:border-[#232330] flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="h-12 w-12 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center">
                                        <Icon name="shieldCheck" className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider">
                                        Pillar 1: In-Depth Human Background Checks
                                    </span>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                        Verified Directly with Issuing Bodies
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        Our accredited field agents review certificates and speak directly with past employers and university registrars. We do not rely on automated guesswork.
                                    </p>
                                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                            <span><strong>Direct Transcript Checks:</strong> Validated with university examination offices.</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                            <span><strong>Manager Phone References:</strong> Direct conversations with prior supervisors.</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                            <span><strong>Statutory Board Standing:</strong> EBK, KCAA, ICPAK, and LSK membership confirmations.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-2">
                                    <button 
                                        onClick={() => setShowEmployerIntakeModal(true)}
                                        className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline inline-flex items-center gap-1.5"
                                    >
                                        <span>Request pre-checked candidate profiles</span>
                                        <Icon name="arrowRight" className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Pillar 2: AI Matching */}
                            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/80 dark:border-[#232330] flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="h-12 w-12 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center">
                                        <Icon name="sparkles" className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider">
                                        Pillar 2: AI-Powered Skills &amp; Role Matching
                                    </span>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                        Connecting the Right Talent to the Right Roles
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        Our Google Gemini AI analyzes validated competencies, technical skills, and career achievements to match candidates with positions where they will thrive.
                                    </p>
                                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                            <span><strong>Smart Resume Matching:</strong> Understands skills beyond generic keywords.</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                            <span><strong>Zero Spam Applications:</strong> Only qualified, verified applicants enter the pipeline.</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                            <span><strong>Blind Bias Screening:</strong> Evaluates capability without gender, age, or ethnic bias.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-2">
                                    <button 
                                        onClick={() => onNavigate('jobBoard')}
                                        className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline inline-flex items-center gap-1.5"
                                    >
                                        <span>Explore verified job requisitions</span>
                                        <Icon name="arrowRight" className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------- */}
                {/* 5. 16 SECTORS: MOBILE CAROUSEL + DESKTOP FILTER GRID      */}
                {/* --------------------------------------------------------- */}
                <section id="sectors-section" className="py-16 md:py-24 bg-slate-50 dark:bg-[#0B0B0F] border-b border-slate-200/80 dark:border-[#232330]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        <div className="text-center max-w-3xl mx-auto mb-10">
                            <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-widest">
                                Comprehensive Kenyan Coverage
                            </span>
                            <h2 className="text-[clamp(1.6rem,2.8vw+0.5rem,2.5rem)] font-black text-slate-900 dark:text-white mt-1">
                                Explore Verified Opportunities by Industry
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                Across 16 major economic sectors with over 1,480 active positions.
                            </p>
                        </div>

                        {/* Search and Cluster Filters */}
                        <div className="max-w-4xl mx-auto mb-8 space-y-4">
                            <div className="relative max-w-md mx-auto">
                                <input 
                                    type="text"
                                    name="industrySearch"
                                    placeholder="Search sectors (e.g. Technology, Aviation, Legal)..."
                                    value={categorySearch}
                                    onChange={(e) => setCategorySearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-sm focus:ring-2 focus:ring-[#4F46E5] outline-none text-slate-900 dark:text-white min-h-[44px]"
                                />
                                <Icon name="search" className="h-5 w-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                {categorySearch && (
                                    <button 
                                        onClick={() => setCategorySearch('')}
                                        aria-label="Clear industry search"
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Cluster Filter Buttons */}
                            <div className="flex flex-wrap justify-center gap-2">
                                {clusters.map((c) => (
                                    <button 
                                        key={c.id}
                                        onClick={() => setSelectedCluster(c.id)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[44px] inline-flex items-center cursor-pointer ${
                                            selectedCluster === c.id 
                                                ? 'bg-[#4F46E5] text-white shadow-sm' 
                                                : 'bg-white dark:bg-[#16161F] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-[#4F46E5]/40'
                                        }`}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* MOBILE CAROUSEL VIEW (< 768px) with Snap Scrolling */}
                        <div className="block md:hidden">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-xs font-bold text-slate-500">Swipe to view sectors</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => scrollCarousel('left')}
                                        aria-label="Scroll sectors left"
                                        className="p-2 rounded-xl bg-white dark:bg-[#16161F] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                    >
                                        <Icon name="arrowLeft" className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => scrollCarousel('right')}
                                        aria-label="Scroll sectors right"
                                        className="p-2 rounded-xl bg-white dark:bg-[#16161F] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                    >
                                        <Icon name="arrowRight" className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div 
                                ref={carouselRef}
                                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-4 px-4"
                            >
                                {filteredCategories.map((cat) => (
                                    <div 
                                        key={cat.id}
                                        onClick={() => onNavigate('jobBoard')}
                                        className="snap-start flex-shrink-0 w-[260px] p-5 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-sm flex flex-col justify-between cursor-pointer"
                                    >
                                        <div>
                                            <div className="h-10 w-10 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center mb-3">
                                                <Icon name={cat.icon as IconName} className="h-5 w-5" />
                                            </div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base">{cat.name}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8]">
                                            <span>{cat.count} Open Roles</span>
                                            <span>View Jobs →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* DESKTOP GRID VIEW (>= 768px) with View All Toggle */}
                        <div className="hidden md:block">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                {displayedCategories.map((cat) => (
                                    <div 
                                        key={cat.id}
                                        onClick={() => onNavigate('jobBoard')}
                                        className="p-6 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] hover:border-[#4F46E5]/40 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group"
                                    >
                                        <div>
                                            <div className="h-12 w-12 rounded-xl bg-[#4F46E5]/10 group-hover:bg-[#4F46E5] text-[#4F46E5] dark:text-[#818CF8] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                                                <Icon name={cat.icon as IconName} className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{cat.name}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">{cat.description}</p>
                                        </div>
                                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#4F46E5] dark:text-[#818CF8]">
                                            <span>{cat.count} Roles Available</span>
                                            <span className="group-hover:translate-x-1 transition-transform">Explore →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* View All Toggle on Desktop */}
                            {filteredCategories.length > 8 && (
                                <div className="mt-8 text-center">
                                    <button 
                                        onClick={() => setShowAllCategories(!showAllCategories)}
                                        className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all min-h-[44px] cursor-pointer"
                                    >
                                        {showAllCategories ? 'Show Fewer Sectors' : `View All (${filteredCategories.length}) Sectors`}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sector Next Step Action */}
                        <div className="mt-12 text-center">
                            <button 
                                onClick={() => onNavigate('jobBoard')}
                                className="px-8 py-3.5 bg-[#4F46E5] hover:bg-[#6366F1] text-white font-bold rounded-2xl shadow-lg transition-all text-sm inline-flex items-center gap-2 min-h-[44px] cursor-pointer"
                            >
                                <Icon name="briefcase" className="h-4 w-4" />
                                <span>Browse All Verified Listings</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------- */}
                {/* 6. RECENT VERIFIED JOBS PREVIEW                           */}
                {/* --------------------------------------------------------- */}
                <section id="jobs-section" className="py-16 md:py-24 bg-white dark:bg-[#121218] border-b border-slate-200/80 dark:border-[#232330]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                            <div>
                                <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-widest">
                                    Live Openings
                                </span>
                                <h2 className="text-[clamp(1.6rem,2.8vw+0.5rem,2.5rem)] font-black text-slate-900 dark:text-white mt-1">
                                    Featured Positions with Verified Employers
                                </h2>
                            </div>
                            <button 
                                onClick={() => onNavigate('jobBoard')}
                                className="text-sm font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline inline-flex items-center gap-1.5 self-start md:self-auto min-h-[44px]"
                            >
                                <span>View all open requisitions</span>
                                <Icon name="arrowRight" className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {mockJobs.slice(0, 3).map((job) => (
                                <div 
                                    key={job.id}
                                    onClick={() => onNavigate('jobBoard')}
                                    className="p-6 rounded-2xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/80 dark:border-[#232330] hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer space-y-4"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-3 mb-3">
                                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                Verified Employer
                                            </span>
                                            <span className="text-xs font-semibold text-slate-500">
                                                {job.location}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug">
                                            {job.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                            {job.companyName}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2">
                                            {job.description}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
                                        <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">
                                            {job.salaryRange}
                                        </span>
                                        <span className="font-bold text-slate-700 dark:text-slate-200">
                                            Apply with 1 Click →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <button 
                                onClick={() => onNavigate('jobBoard')}
                                className="px-8 py-3.5 bg-[#4F46E5] text-white font-bold rounded-xl text-sm shadow-md hover:bg-[#6366F1] transition-all min-h-[44px] cursor-pointer"
                            >
                                Open Full Job Directory
                            </button>
                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------- */}
                {/* 7. FAQ ACCORDION: ACCESSIBLE & KEYBOARD SUPPORT (3.5)     */}
                {/* --------------------------------------------------------- */}
                <section id="faq-section" className="py-16 md:py-24 bg-slate-50 dark:bg-[#0B0B0F] border-b border-slate-200/80 dark:border-[#232330]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-widest">
                                Clear Answers
                            </span>
                            <h2 className="text-[clamp(1.6rem,2.8vw+0.5rem,2.5rem)] font-black text-slate-900 dark:text-white mt-1">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                Everything you need to know about the candidate and employer verification process.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {mockFAQs.map((faq, idx) => {
                                const isOpen = openFaqIndex === idx;
                                const questionId = `faq-q-${idx}`;
                                const answerId = `faq-a-${idx}`;

                                return (
                                    <div 
                                        key={idx}
                                        className="rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] overflow-hidden transition-all shadow-xs"
                                    >
                                        <button 
                                            id={questionId}
                                            aria-expanded={isOpen}
                                            aria-controls={answerId}
                                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setOpenFaqIndex(isOpen ? null : idx);
                                                }
                                            }}
                                            className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] cursor-pointer"
                                        >
                                            <span className="text-sm sm:text-base">{faq.question}</span>
                                            <Icon 
                                                name={isOpen ? 'minus' : 'plus'} 
                                                className={`h-5 w-5 flex-shrink-0 transition-transform ${isOpen ? 'text-[#4F46E5]' : 'text-slate-400'}`} 
                                            />
                                        </button>

                                        {isOpen && (
                                            <div 
                                                id={answerId}
                                                role="region"
                                                aria-labelledby={questionId}
                                                className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3"
                                            >
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Section Action Connection */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Have an unaddressed question?{' '}
                                <button 
                                    onClick={() => onNavigate('contact')}
                                    className="font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline cursor-pointer"
                                >
                                    Speak directly with our verification support team →
                                </button>
                            </p>
                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------- */}
                {/* 8. CLOSING CTA BANNER                                     */}
                {/* --------------------------------------------------------- */}
                <section className="py-20 md:py-28 bg-white dark:bg-[#121218] text-center border-b border-slate-200/80 dark:border-[#232330]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                        <div className="inline-block p-3 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5]">
                            <VerifiedHireIconMark size={40} />
                        </div>
                        <h2 className="text-[clamp(1.8rem,3vw+0.5rem,3rem)] font-black text-slate-900 dark:text-white tracking-tight">
                            Start With Verified Truth.
                        </h2>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                            Whether you are a professional ready to showcase authenticated career records or a company ready to make confident hires, we are here for you.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                            <button 
                                onClick={() => onNavigate('jobBoard')}
                                className="w-full sm:w-auto px-8 py-4 bg-[#4F46E5] hover:bg-[#6366F1] active:bg-[#4338CA] text-white font-bold rounded-2xl shadow-xl shadow-[#4F46E5]/25 text-sm sm:text-base min-h-[48px] cursor-pointer"
                            >
                                Find Your Next Job
                            </button>
                            <button 
                                onClick={() => setShowEmployerIntakeModal(true)}
                                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#16161F] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/80 dark:border-[#232330] font-bold rounded-2xl text-sm sm:text-base min-h-[48px] cursor-pointer"
                            >
                                Schedule Hiring Briefing
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* --------------------------------------------------------- */}
            {/* FOOTER                                                    */}
            {/* --------------------------------------------------------- */}
            <footer className="py-12 bg-slate-100 dark:bg-[#0E0E14] text-slate-600 dark:text-slate-400 text-xs border-t border-slate-200 dark:border-slate-800 pb-24 md:pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <VerifiedHireLogo size="sm" />
                        <span>&copy; {new Date().getFullYear()} VerifiedHire Network. All rights reserved.</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                        <button onClick={() => onNavigate('privacy')} className="hover:text-slate-900 dark:hover:text-white min-h-[44px]">Privacy Policy</button>
                        <button onClick={() => onNavigate('terms')} className="hover:text-slate-900 dark:hover:text-white min-h-[44px]">Terms of Service</button>
                        <button onClick={() => onNavigate('security')} className="hover:text-slate-900 dark:hover:text-white min-h-[44px]">Security Standards</button>
                        <button onClick={() => onNavigate('contact')} className="hover:text-slate-900 dark:hover:text-white min-h-[44px]">Contact Us</button>
                    </div>
                </div>
            </footer>

            {/* --------------------------------------------------------- */}
            {/* STICKY BOTTOM MOBILE CTA BAR (REQUIREMENT 3.2)             */}
            {/* --------------------------------------------------------- */}
            <aside 
                aria-label="Quick mobile action bar"
                className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#0B0B0F]/95 backdrop-blur-md p-3 border-t border-slate-200 dark:border-slate-800 shadow-2xl flex items-center gap-3"
            >
                <button 
                    onClick={() => onNavigate('jobBoard')}
                    className="flex-1 py-3 px-4 bg-[#4F46E5] active:bg-[#4338CA] text-white text-xs font-bold rounded-xl text-center shadow-md min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <Icon name="briefcase" className="h-4 w-4" />
                    <span>Find Jobs</span>
                </button>
                <button 
                    onClick={() => setShowEmployerIntakeModal(true)}
                    className="flex-1 py-3 px-4 bg-slate-100 dark:bg-[#16161F] active:bg-slate-200 dark:active:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl text-center border border-slate-200 dark:border-slate-800 min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <Icon name="userGroup" className="h-4 w-4 text-[#4F46E5]" />
                    <span>Hire Talent</span>
                </button>
            </aside>

            {/* --------------------------------------------------------- */}
            {/* EMPLOYER INTAKE FORM MODAL (MAX 5 FIELDS - STEP 1)        */}
            {/* --------------------------------------------------------- */}
            {showEmployerIntakeModal && (
                <div 
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="employer-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
                >
                    <div className="bg-white dark:bg-[#121218] rounded-3xl w-full max-w-lg p-6 sm:p-8 border border-slate-200/80 dark:border-[#232330] shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button 
                            type="button"
                            onClick={() => setShowEmployerIntakeModal(false)}
                            aria-label="Close employer intake dialog"
                            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                        >
                            <Icon name="close" className="h-5 w-5" />
                        </button>

                        <div className="mb-5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] dark:text-[#818CF8]">
                                Fast-Track Institutional Hiring
                            </span>
                            <h3 id="employer-modal-title" className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                                Request Pre-Vetted Candidates
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                An Enterprise Talent Specialist will reach out within 2 business hours.
                            </p>
                        </div>

                        {employerSuccess ? (
                            <div className="py-8 text-center space-y-3">
                                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                    <Icon name="checkCircle" className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Request Received</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Thank you! We are connecting you to the verified talent network...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleEmployerSubmit} className="space-y-3.5" noValidate>
                                {/* Field 1: Organization Name */}
                                <div>
                                    <label htmlFor="emp-org-name" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Company or Organization Name *
                                    </label>
                                    <input 
                                        id="emp-org-name"
                                        type="text"
                                        name="organization"
                                        autoComplete="organization"
                                        required
                                        placeholder="e.g. Safaricom PLC, KCB, Kenya Airways"
                                        value={institutionName}
                                        onChange={(e) => setInstitutionName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5] min-h-[44px]"
                                    />
                                    {employerErrors.institutionName && (
                                        <p className="text-xs text-rose-500 mt-1 font-medium">{employerErrors.institutionName}</p>
                                    )}
                                </div>

                                {/* Field 2: Work Email */}
                                <div>
                                    <label htmlFor="emp-work-email" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Business Work Email *
                                    </label>
                                    <input 
                                        id="emp-work-email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        required
                                        placeholder="talent@company.com"
                                        value={institutionEmail}
                                        onChange={(e) => setInstitutionEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5] min-h-[44px]"
                                    />
                                    {employerErrors.institutionEmail && (
                                        <p className="text-xs text-rose-500 mt-1 font-medium">{employerErrors.institutionEmail}</p>
                                    )}
                                </div>

                                {/* Field 3: Target Role */}
                                <div>
                                    <label htmlFor="emp-target-role" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Role You Need to Fill *
                                    </label>
                                    <input 
                                        id="emp-target-role"
                                        type="text"
                                        name="roleNeeded"
                                        required
                                        placeholder="e.g. Lead Cloud Architect, Head of Legal, Senior Pilot"
                                        value={talentTargetRole}
                                        onChange={(e) => setTalentTargetRole(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5] min-h-[44px]"
                                    />
                                    {employerErrors.talentTargetRole && (
                                        <p className="text-xs text-rose-500 mt-1 font-medium">{employerErrors.talentTargetRole}</p>
                                    )}
                                </div>

                                {/* Field 4: Direct Phone */}
                                <div>
                                    <label htmlFor="emp-phone" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Contact Phone Number *
                                    </label>
                                    <input 
                                        id="emp-phone"
                                        type="tel"
                                        name="tel"
                                        autoComplete="tel"
                                        required
                                        placeholder="+254 700 000 000"
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5] min-h-[44px]"
                                    />
                                    {employerErrors.contactPhone && (
                                        <p className="text-xs text-rose-500 mt-1 font-medium">{employerErrors.contactPhone}</p>
                                    )}
                                </div>

                                {/* Field 5: Hiring Urgency */}
                                <div>
                                    <label htmlFor="emp-urgency" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Hiring Timeline
                                    </label>
                                    <select
                                        id="emp-urgency"
                                        name="urgency"
                                        value={hiringUrgency}
                                        onChange={(e) => setHiringUrgency(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5] min-h-[44px]"
                                    >
                                        <option value="Immediate (within 14 days)">Immediate (within 14 days)</option>
                                        <option value="1 month">Within 30 days</option>
                                        <option value="Quarterly planning">Future Pipeline (next quarter)</option>
                                    </select>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit"
                                        disabled={isSubmittingEmployer}
                                        className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#6366F1] active:bg-[#4338CA] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all min-h-[44px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                                    >
                                        {isSubmittingEmployer ? (
                                            <>
                                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Submitting Request...</span>
                                            </>
                                        ) : (
                                            <span>Submit Hiring Request (5 Fields)</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* PROFESSIONAL INTAKE FORM MODAL (MAX 5 FIELDS - STEP 1)    */}
            {/* --------------------------------------------------------- */}
            {showSeekerIntakeModal && (
                <div 
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="seeker-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
                >
                    <div className="bg-white dark:bg-[#121218] rounded-3xl w-full max-w-lg p-6 sm:p-8 border border-slate-200/80 dark:border-[#232330] shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button 
                            type="button"
                            onClick={() => setShowSeekerIntakeModal(false)}
                            aria-label="Close candidate intake dialog"
                            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                        >
                            <Icon name="close" className="h-5 w-5" />
                        </button>

                        <div className="mb-5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] dark:text-[#818CF8]">
                                Candidate Fast-Track Verification
                            </span>
                            <h3 id="seeker-modal-title" className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                                Get Your Career Profile Verified
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Verified candidates bypass unread resumes and are interviewed 3x faster.
                            </p>
                        </div>

                        {seekerSuccess ? (
                            <div className="py-8 text-center space-y-3">
                                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                    <Icon name="checkCircle" className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Profile Submitted</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Opening your candidate portal to upload your certificates...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSeekerSubmit} className="space-y-3.5" noValidate>
                                {/* Field 1: Full Name */}
                                <div>
                                    <label htmlFor="skr-name" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Full Legal Name *
                                    </label>
                                    <input 
                                        id="skr-name"
                                        type="text"
                                        name="name"
                                        autoComplete="name"
                                        required
                                        placeholder="e.g. Brian Kiprop"
                                        value={seekerName}
                                        onChange={(e) => setSeekerName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5] min-h-[44px]"
                                    />
                                    {seekerErrors.seekerName && (
                                        <p className="text-xs text-rose-500 mt-1 font-medium">{seekerErrors.seekerName}</p>
                                    )}
                                </div>

                                {/* Field 2: Email */}
                                <div>
                                    <label htmlFor="skr-email" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Email Address *
                                    </label>
                                    <input 
                                        id="skr-email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        required
                                        placeholder="brian.kiprop@example.com"
                                        value={seekerEmail}
                                        onChange={(e) => setSeekerEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5] min-h-[44px]"
                                    />
                                    {seekerErrors.seekerEmail && (
                                        <p className="text-xs text-rose-500 mt-1 font-medium">{seekerErrors.seekerEmail}</p>
                                    )}
                                </div>

                                {/* Field 3: Target Role / Specialty */}
                                <div>
                                    <label htmlFor="skr-role" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Primary Profession / Title *
                                    </label>
                                    <input 
                                        id="skr-role"
                                        type="text"
                                        name="profession"
                                        required
                                        placeholder="e.g. Commercial Pilot (B737) or Fullstack Engineer"
                                        value={seekerSpecialty}
                                        onChange={(e) => setSeekerSpecialty(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5] min-h-[44px]"
                                    />
                                    {seekerErrors.seekerSpecialty && (
                                        <p className="text-xs text-rose-500 mt-1 font-medium">{seekerErrors.seekerSpecialty}</p>
                                    )}
                                </div>

                                {/* Field 4: Degree / Credential */}
                                <div>
                                    <label htmlFor="skr-degree" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Highest Education Qualification *
                                    </label>
                                    <input 
                                        id="skr-degree"
                                        type="text"
                                        name="degree"
                                        required
                                        placeholder="e.g. Bachelor of Science in Aviation or Computer Science"
                                        value={seekerDegree}
                                        onChange={(e) => setSeekerDegree(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5] min-h-[44px]"
                                    />
                                    {seekerErrors.seekerDegree && (
                                        <p className="text-xs text-rose-500 mt-1 font-medium">{seekerErrors.seekerDegree}</p>
                                    )}
                                </div>

                                {/* Field 5: Years of Experience */}
                                <div>
                                    <label htmlFor="skr-exp" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Total Years of Experience
                                    </label>
                                    <select
                                        id="skr-exp"
                                        name="experience"
                                        value={seekerExperience}
                                        onChange={(e) => setSeekerExperience(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5] min-h-[44px]"
                                    >
                                        <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                                        <option value="3-5 years">Mid-Level (3-5 years)</option>
                                        <option value="6-10 years">Senior Specialist (6-10 years)</option>
                                        <option value="10+ years">Executive / Lead (10+ years)</option>
                                    </select>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit"
                                        disabled={isSubmittingSeeker}
                                        className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#6366F1] active:bg-[#4338CA] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all min-h-[44px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                                    >
                                        {isSubmittingSeeker ? (
                                            <>
                                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Submitting Credentials...</span>
                                            </>
                                        ) : (
                                            <span>Continue to Document Upload</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};
