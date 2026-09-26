import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon, IconName } from './Icon';
import { StatItem } from './StatItem';
import { UserRole, JobSeekerProfile, VerificationStatus, IndustryCategory } from '../types';
import { mockProfiles, mockJobs, mockBlogPosts, mockFAQs, mockCategories } from '../services/mockData';
import { VerifiedHireLogo, VerifiedHireIconMark } from './VerifiedHireLogo';

interface LandingPageProps {
    onNavigate: (view: string, role?: 'jobSeeker' | 'employer') => void;
    isLoggedIn?: boolean;
    userRole?: UserRole | null;
}

interface EnterpriseLeader {
    name: string;
    ticker: string;
    sector: string;
    icon: IconName;
}

const enterpriseLeaders: EnterpriseLeader[] = [
    { name: 'Safaricom PLC', ticker: 'NSE: SCOM', sector: 'Telco & Mobile Money', icon: 'sparkles' },
    { name: 'Kenya Airways', ticker: 'SkyTeam', sector: 'Aviation & Flight Ops', icon: 'globeAlt' },
    { name: 'KCB Group', ticker: 'NSE: KCB', sector: 'Tier-1 Banking', icon: 'shieldCheck' },
    { name: 'Equity Bank', ticker: 'NSE: EQTY', sector: 'Commercial Finance', icon: 'checkCircle' },
    { name: 'Andela', ticker: 'Global Tech', sector: 'Software Engineering', icon: 'academicCap' },
    { name: 'Twiga Foods', ticker: 'Agri-Logistics', sector: 'Supply Chain Ops', icon: 'buildingOffice' },
    { name: 'Cellulant', ticker: 'Pan-Africa', sector: 'FinTech Payments API', icon: 'zap' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
};

const SectionTitle: React.FC<{ 
    badge?: string;
    title: string; 
    subtitle?: string; 
    light?: boolean;
    align?: 'center' | 'left';
}> = ({ badge, title, subtitle, light, align = 'center' }) => (
    <div className={`mb-14 md:mb-20 px-4 ${align === 'center' ? 'text-center' : 'text-left'}`}>
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
        >
            {badge && (
                <motion.div variants={itemVariants} className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5]/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
                        {badge}
                    </span>
                </motion.div>
            )}
            <motion.h2 
                variants={itemVariants}
                className={`text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-balance ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p 
                    variants={itemVariants}
                    className={`mt-5 text-lg md:text-xl max-w-3xl leading-relaxed text-balance ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-indigo-100/90' : 'text-slate-600 dark:text-slate-400 font-normal'}`}
                >
                    {subtitle}
                </motion.p>
            )}
        </motion.div>
    </div>
);

const CategoryCard: React.FC<{ 
    category: IndustryCategory; 
    onSelect?: () => void;
}> = ({ category, onSelect }) => (
    <motion.div 
        variants={itemVariants}
        whileHover={{ y: -4 }}
        onClick={onSelect}
        className="group relative flex flex-col justify-between p-7 rounded-[2rem] bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-sm hover:shadow-xl hover:border-[#4F46E5]/40 transition-all duration-300 cursor-pointer overflow-hidden"
    >
        {/* Subtle accent backdrop decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F46E5]/5 rounded-bl-[4rem] pointer-events-none group-hover:scale-110 group-hover:bg-[#4F46E5]/10 transition-all duration-300" />
        
        <div>
            {/* Header: Icon, Category Sector Tag & Growth badge in #4F46E5 */}
            <div className="flex items-start justify-between gap-3 mb-5">
                <div className="h-13 w-13 rounded-2xl bg-[#4F46E5]/10 dark:bg-[#4F46E5]/15 border border-[#4F46E5]/20 flex items-center justify-center group-hover:bg-[#4F46E5] text-[#4F46E5] dark:text-[#818CF8] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon name={category.icon as IconName} className="h-6 w-6 transition-colors" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5]/20">
                        {category.growth}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {category.count} Verified Roles
                    </span>
                </div>
            </div>

            {/* Sector Tag badge */}
            <div className="mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-semibold text-[#4F46E5] dark:text-[#818CF8] bg-[#4F46E5]/5 dark:bg-[#4F46E5]/10 border border-[#4F46E5]/15">
                    {category.sectorTag}
                </span>
            </div>

            {/* Title */}
            <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors leading-tight mb-2.5">
                {category.name}
            </h4>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4 font-normal">
                {category.description}
            </p>

            {/* Key Skills chips */}
            <div className="flex flex-wrap gap-1.5 mb-5">
                {category.keySkills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-[#16161F] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-[#232330]">
                        {skill}
                    </span>
                ))}
            </div>
        </div>

        {/* Footer: Average Salary benchmark + Explore CTA */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#232330] flex items-center justify-between mt-auto">
            <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Benchmarked Comp
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {category.avgSalary}
                </span>
            </div>
            <div className="inline-flex items-center text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <Icon name="arrowRight" className="h-3.5 w-3.5 ml-1" />
            </div>
        </div>
    </motion.div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-100 dark:border-[#232330] last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
            >
                <span className="text-lg font-bold text-slate-900 dark:text-white pr-4">{question}</span>
                <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} className="h-5 w-5 text-[#4F46E5] dark:text-[#818CF8] flex-shrink-0" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, isLoggedIn, userRole }) => {
    const featuredProfiles = mockProfiles.filter(p => p.verificationStatus === VerificationStatus.VERIFIED).slice(0, 6);
    const featuredJobs = mockJobs.slice(0, 3);

    const [selectedCluster, setSelectedCluster] = useState<string>('all');
    const [categorySearch, setCategorySearch] = useState<string>('');
    const [showTalentIntakeModal, setShowTalentIntakeModal] = useState<boolean>(false);
    const [showEmployerIntakeModal, setShowEmployerIntakeModal] = useState<boolean>(false);
    const [institutionName, setInstitutionName] = useState<string>('');
    const [institutionEmail, setInstitutionEmail] = useState<string>('');
    const [talentTargetRole, setTalentTargetRole] = useState<string>('');
    const [intakeSuccess, setIntakeSuccess] = useState<boolean>(false);

    const clusters = [
        { id: 'all', label: 'All Industries (16)' },
        { id: 'tech', label: 'Technology & Cyber' },
        { id: 'finance', label: 'Banking & Legal' },
        { id: 'engineering', label: 'Engineering & Energy' },
        { id: 'health_agri', label: 'Health & Agribusiness' },
        { id: 'logistics', label: 'Aviation & Maritime' },
        { id: 'social_creative', label: 'Creative, Tourism & NGOs' },
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

    const handleInstitutionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIntakeSuccess(true);
        setTimeout(() => {
            setShowEmployerIntakeModal(false);
            setIntakeSuccess(false);
            onNavigate('signin', 'employer');
        }, 1800);
    };

    return (
        <div className="bg-slate-50 dark:bg-[#0B0B0F] selection:bg-[#4F46E5] selection:text-white transition-colors duration-300">
            <div role="note" aria-label="Preview data notice" className="border-b border-indigo-200 bg-indigo-50 text-indigo-950 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-100">
                <div className="container mx-auto flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-3 sm:px-6 lg:px-8">
                    <span className="inline-flex w-fit items-center rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">Preview only</span>
                    <p className="leading-relaxed">Profiles, organizations, metrics, testimonials, and verification records are illustrative sample data. This preview does not perform real checks or process applications.</p>
                </div>
            </div>
            
            {/* 1. Hero Section: Dual-Pillar Promise + Laser Verification Radar Animation */}
            <section className="relative min-h-[92vh] flex items-center pt-16 pb-20 lg:pt-28 lg:pb-32 overflow-hidden bg-grid-pattern">
                {/* Ambient Radial Spotlight anchored in #4F46E5 */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#4F46E5]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        
                        {/* Hero Left: Editorial Positioning & Dual-Pillar Promise */}
                        <div className="lg:col-span-7 text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200"
                            >
                                <span className="h-2 w-2 rounded-full bg-[#4F46E5] animate-pulse" />
                                <span>The Elite Standard for Professional Integrity</span>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <span className="text-[#4F46E5] dark:text-[#818CF8]">Private Members' Network</span>
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.04]"
                            >
                                Where Integrity Meets <br className="hidden sm:inline" />
                                <span className="text-[#4F46E5]">Surgical Precision</span>.
                            </motion.h1>

                            <motion.p 
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal"
                            >
                                VerifiedHire connects pre-vetted, high-integrity talent with high-performance institutions through two uncompromising pillars: <strong className="text-slate-900 dark:text-white font-bold">(1) Surgical-grade manual human verification</strong> and <strong className="text-slate-900 dark:text-white font-bold">(2) Google Gemini AI-powered matching</strong>.
                            </motion.p>

                            {/* Dual Core Pillar Badges */}
                            <motion.div 
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl"
                            >
                                <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-xs flex items-start gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center flex-shrink-0">
                                        <Icon name="shieldCheck" className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pillar I: Human Audit</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Primary-source registrar checks &amp; supervisor affidavits.</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-xs flex items-start gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center flex-shrink-0">
                                        <Icon name="sparkles" className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pillar II: Gemini AI</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">High-dimensional competency matching with zero noise.</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Action Buttons: Distinct Institutional vs Talent Flows */}
                            <motion.div 
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
                            >
                                <button 
                                    onClick={() => setShowEmployerIntakeModal(true)}
                                    className="px-8 py-4 bg-[#4F46E5] hover:bg-[#6366F1] active:bg-[#4338CA] text-white font-bold rounded-2xl shadow-xl shadow-[#4F46E5]/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Request Vetted Talent</span>
                                    <Icon name="arrowRight" className="h-4 w-4" />
                                </button>

                                <button 
                                    onClick={() => onNavigate('signin', 'jobSeeker')}
                                    className="px-8 py-4 bg-white dark:bg-[#121218] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#4F46E5] dark:text-white border border-slate-200/80 dark:border-[#232330] font-bold rounded-2xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Icon name="userCheck" className="h-4 w-4 text-[#4F46E5]" />
                                    <span>Apply for Vetting</span>
                                </button>

                                <button 
                                    onClick={() => onNavigate('jobPortal')}
                                    className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#4F46E5] dark:hover:text-white transition-colors cursor-pointer text-center"
                                >
                                    Browse Portal →
                                </button>
                            </motion.div>
                        </div>

                        {/* Hero Right: Deliberate Motion Moment — Surgical Verification Laser Dossier Scanner */}
                        <div className="lg:col-span-5">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] p-6 shadow-2xl overflow-hidden"
                            >
                                {/* Active Verification Laser Scan Beam */}
                                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent shadow-[0_0_15px_#4F46E5] animate-scan-beam pointer-events-none z-20" />

                                {/* Radar Reticle Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#232330] text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#4F46E5] animate-ping" />
                                        <span className="font-mono font-bold text-slate-900 dark:text-white">SURGICAL_AUDIT_STREAM</span>
                                    </div>
                                    <span className="font-mono text-[10px] text-[#4F46E5] dark:text-[#818CF8] font-bold bg-[#4F46E5]/10 px-2 py-0.5 rounded">
                                        LIVE ECDSA PROTOCOL
                                    </span>
                                </div>

                                {/* Simulated Candidate Dossier Being Audited */}
                                <div className="py-4 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] overflow-hidden flex-shrink-0 relative">
                                            <img 
                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
                                                alt="Audited Professional" 
                                                className="h-full w-full object-cover" 
                                            />
                                            <div className="absolute bottom-0 right-0 p-0.5 bg-[#4F46E5] text-white rounded-tl-md">
                                                <Icon name="check" className="h-3 w-3" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-base">Eng. Amara Kimani, PE</h3>
                                                <span className="px-2 py-0.2 bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] text-[10px] font-mono font-bold rounded">
                                                    Score: 99.4%
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Chief Avionics &amp; Systems Architect</p>
                                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">Leaf: 0x4f46e5a192...c38b</p>
                                        </div>
                                    </div>

                                    {/* Verification Checkpoints (4 Rigorous Stages) */}
                                    <div className="space-y-2 font-mono text-xs">
                                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/60 dark:border-[#232330] flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Icon name="checkCircle" className="h-4 w-4 text-[#4F46E5]" />
                                                <span className="text-slate-700 dark:text-slate-300">KNQA Primary Academic Source</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#4F46E5] dark:text-[#818CF8]">ATTESTED</span>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/60 dark:border-[#232330] flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Icon name="checkCircle" className="h-4 w-4 text-[#4F46E5]" />
                                                <span className="text-slate-700 dark:text-slate-300">Engineers Board of Kenya (EBK) #PE-2041</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#4F46E5] dark:text-[#818CF8]">ACTIVE_GOOD_STANDING</span>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/60 dark:border-[#232330] flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Icon name="checkCircle" className="h-4 w-4 text-[#4F46E5]" />
                                                <span className="text-slate-700 dark:text-slate-300">Supervisor Audio Affidavit Recorded</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#4F46E5] dark:text-[#818CF8]">VERIFIED_SOURCE</span>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/60 dark:border-[#232330] flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Icon name="sparkles" className="h-4 w-4 text-[#4F46E5]" />
                                                <span className="text-slate-700 dark:text-slate-300">Google Gemini Competency Vector</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#4F46E5] dark:text-[#818CF8]">0.998 MATCH</span>
                                        </div>
                                    </div>

                                    {/* Non-Repudiation Footer Badge */}
                                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Icon name="lockClosed" className="h-3.5 w-3.5 text-[#4F46E5]" />
                                            <span>Zero-Knowledge Proof Anchor</span>
                                        </div>
                                        <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">100% NON-REPUDIATION</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 2. Institutional Trust Strip: Stats & Enterprise Logos */}
            <section className="py-12 border-y border-slate-200/80 dark:border-[#232330] bg-white dark:bg-[#121218]/60 transition-colors">
                <div className="container mx-auto px-4">
                    
                    {/* Precision Telemetry Strip */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-10 pb-8 border-b border-slate-100 dark:border-[#232330]">
                        <div className="text-center">
                            <div className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">4.2%</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Acceptance Rate (95.8% Filtered)</div>
                        </div>
                        <div className="text-center border-l border-slate-200/60 dark:border-[#232330]">
                            <div className="text-3xl lg:text-4xl font-black text-[#4F46E5] dark:text-[#818CF8]">48h</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Surgical Verification Window</div>
                        </div>
                        <div className="text-center border-l border-slate-200/60 dark:border-[#232330]">
                            <div className="text-3xl lg:text-4xl font-black text-[#4F46E5] dark:text-[#818CF8]">100%</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Non-Repudiation Guarantee</div>
                        </div>
                        <div className="text-center border-l border-slate-200/60 dark:border-[#232330]">
                            <div className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">450+</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Institutional Partners</div>
                        </div>
                    </div>

                    {/* Partner Marquee Ticker */}
                    <div className="text-center mb-6">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            Pre-Vetted Network Serving Market Leaders Across East Africa &amp; Global Institutions
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 max-w-7xl mx-auto">
                        {enterpriseLeaders.map((corp) => (
                            <div 
                                key={corp.name} 
                                className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-[#16161F] border border-slate-200/60 dark:border-[#232330] flex flex-col items-center text-center group hover:border-[#4F46E5]/40 transition-colors"
                            >
                                <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-[#4F46E5] transition-colors">
                                    {corp.name}
                                </span>
                                <span className="text-[10px] font-semibold text-[#4F46E5] dark:text-[#818CF8] mt-0.5">
                                    {corp.ticker}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-full">
                                    {corp.sector}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* 3. The Dual-Pillar Architecture Breakdown */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4 max-w-6xl">
                    <SectionTitle 
                        badge="The Dual-Pillar Standard"
                        title="Two Pillars. Absolute Certainty."
                        subtitle="Generic job boards rely on unverified claims and algorithmic keyword stuffing. VerifiedHire merges physical human investigative auditing with Google Gemini AI matching."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Pillar 1 Deep Dive */}
                        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-sm flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="h-14 w-14 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center">
                                    <Icon name="shieldCheck" className="h-7 w-7" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-widest">Pillar 01</span>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Surgical Manual Human Verification</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Licensed field verification officers and compliance attorneys examine source records directly. We do not rely on digital self-attestation.
                                </p>
                                <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                                    <li className="flex items-start gap-2.5">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                                        <span><strong>Registrar Direct Validation:</strong> Primary-source transcript validation with university registrars.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                                        <span><strong>Statutory Board Licensure:</strong> Active standing confirmation with EBK, LSK, KCAA, KMPDC, and KNQA.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                                        <span><strong>Supervisor Audio Affidavits:</strong> Structured integrity and culture interviews with direct managers.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                                        <span><strong>Cryptographic Merkle Proof:</strong> Non-repudiation audit hash anchored on immutable ledger.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-8 mt-6 border-t border-slate-100 dark:border-[#232330] flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase">Human Oversight Standard</span>
                                <span className="text-xs font-mono font-bold text-[#4F46E5] dark:text-[#818CF8]">Zero Self-Attestation</span>
                            </div>
                        </div>

                        {/* Pillar 2 Deep Dive */}
                        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-sm flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="h-14 w-14 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center">
                                    <Icon name="sparkles" className="h-7 w-7" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-widest">Pillar 02</span>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Google Gemini AI Precision Matching</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Our matching engine executes high-dimensional vector embeddings on verified competency rubrics, eliminating keyword stuffing and candidate embellishments.
                                </p>
                                <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                                    <li className="flex items-start gap-2.5">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                                        <span><strong>Semantic Competency Analysis:</strong> Evaluates actual technical depth from validated work portfolios.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                                        <span><strong>Role Readiness Calibration:</strong> Calibrates candidate readiness against enterprise requisition rubrics.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                                        <span><strong>Automated Dossier Generation:</strong> Generates executive briefing notes for interview panels in seconds.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                                        <span><strong>Hallucination Defense:</strong> Grounded strictly in verified primary documents with citation roots.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-8 mt-6 border-t border-slate-100 dark:border-[#232330] flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase">AI Intelligence Engine</span>
                                <span className="text-xs font-mono font-bold text-[#4F46E5] dark:text-[#818CF8]">Gemini Flash &amp; Pro Powered</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. Sequential 3-Step Visual Process: How It Works */}
            <section className="py-20 md:py-28 bg-white dark:bg-[#121218]/40 border-y border-slate-200/80 dark:border-[#232330]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <SectionTitle 
                        badge="Sequential Process"
                        title="The Verification Architecture"
                        subtitle="A deliberate three-stage pipeline engineered to eliminate recruitment risk and honor professional excellence."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Step 01 */}
                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/80 dark:border-[#232330] relative group hover:border-[#4F46E5]/40 transition-colors">
                            <span className="text-4xl font-mono font-black text-[#4F46E5]/40 block mb-4">01</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sovereign Application</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Candidates submit certified credentials, historical compensation data, and sign legal authorizations permitting primary-source forensic audits.
                            </p>
                            <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-[#232330] text-[11px] font-mono text-[#4F46E5] dark:text-[#818CF8]">
                                Phase I: Intake &amp; Consent
                            </div>
                        </div>

                        {/* Step 02 */}
                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/80 dark:border-[#232330] relative group hover:border-[#4F46E5]/40 transition-colors">
                            <span className="text-4xl font-mono font-black text-[#4F46E5]/40 block mb-4">02</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Surgical Human Vetting</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Accredited field agents verify transcripts with university deans, query national regulatory registries, and conduct audio supervisor integrity audits.
                            </p>
                            <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-[#232330] text-[11px] font-mono text-[#4F46E5] dark:text-[#818CF8]">
                                Phase II: Forensic Verification
                            </div>
                        </div>

                        {/* Step 03 */}
                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#16161F] border border-slate-200/80 dark:border-[#232330] relative group hover:border-[#4F46E5]/40 transition-colors">
                            <span className="text-4xl font-mono font-black text-[#4F46E5]/40 block mb-4">03</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gemini Precision Placement</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Verified profiles enter the private members' talent registry. Gemini AI pairs them directly with institutional requisitions for immediate placement.
                            </p>
                            <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-[#232330] text-[11px] font-mono text-[#4F46E5] dark:text-[#818CF8]">
                                Phase III: Private Introduction
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Dedicated Verification Standard (The Key Differentiator) */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5]/20">
                                The Verification Standard
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                What Surgical-Grade Review Actually Checks.
                            </h2>
                            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                                Recruitment fraud, resume exaggeration, and credential mills cost East African enterprises hundreds of millions annually. We establish an immutable record of authentic competence.
                            </p>

                            <div className="space-y-4 pt-2">
                                {[
                                    { title: 'Statutory Regulator Inquiries', desc: 'Direct API and physical confirmation with EBK, LSK, KCAA, KMPDC, and KNQA.' },
                                    { title: 'Academic Primary Source Transcript', desc: 'Seal authentication and graduation ledger audits with accredited university registrars.' },
                                    { title: 'Sworn Supervisor Audio Affidavits', desc: 'Independent recorded interviews assessing managerial track record and ethical standing.' },
                                    { title: 'Forensic Identity & Legal OSINT', desc: 'Criminal background screening, civil litigation checks, and tax compliance validation.' },
                                    { title: 'Cryptographic SHA-256 Non-Repudiation', desc: 'Tamper-evident Merkle digest ensuring verified dossiers cannot be altered post-audit.' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3.5">
                                        <div className="h-6 w-6 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Icon name="check" className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="p-8 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-xl space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#232330]">
                                    <div>
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white">Forensic Audit Dossier #VH-9842</h4>
                                        <p className="text-xs text-slate-400">Cryptographically Sealed &amp; Timestamped</p>
                                    </div>
                                    <span className="px-3 py-1 bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] font-mono text-xs font-bold rounded-full">
                                        100% Non-Repudiation
                                    </span>
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161F] flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Academic Authenticity</span>
                                        <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">Primary Source Verified</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161F] flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Statutory Board Standing</span>
                                        <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">EBK Registered PE #29401</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161F] flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Past Employer References</span>
                                        <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">3/3 Affidavits Sworn</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161F] flex items-center justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Gemini Neural Competency Index</span>
                                        <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">Top 1.2% Percentile</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-[#4F46E5]/5 dark:bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center gap-3">
                                    <Icon name="shieldCheck" className="h-6 w-6 text-[#4F46E5] flex-shrink-0" />
                                    <p className="text-xs text-slate-700 dark:text-slate-300">
                                        Backed by our <strong>100% Integrity Guarantee</strong>. If any verified credential is found false, VerifiedHire indemnifies recruitment costs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Elite Industry Channels (With 100% in #4F46E5) */}
            <section className="py-24 md:py-32 bg-white dark:bg-[#121218]/40 border-y border-slate-200/80 dark:border-[#232330]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5]/20 mb-4">
                            Sovereign Career Taxonomy
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            Elite Industry Channels
                        </h2>
                        <p className="text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed max-w-2xl mx-auto">
                            Explore audited talent pools across 16 specialized economic sectors. Every profile carries primary-source statutory verification.
                        </p>
                    </div>

                    {/* Filter Bar & Search */}
                    <div className="max-w-5xl mx-auto mb-10 space-y-4">
                        <div className="relative max-w-xl mx-auto">
                            <input 
                                type="text"
                                placeholder="Search by industry, skill, or sector tag (e.g., Aviation, Cyber, EBK)..."
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-2xl text-sm focus:ring-2 focus:ring-[#4F46E5] outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                            />
                            <Icon name="search" className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            {categorySearch && (
                                <button 
                                    onClick={() => setCategorySearch('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Cluster Filter Buttons */}
                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                            {clusters.map(cluster => {
                                const isActive = selectedCluster === cluster.id;
                                const count = cluster.id === 'all' 
                                    ? mockCategories.length 
                                    : mockCategories.filter(c => c.cluster === cluster.id).length;
                                return (
                                    <button
                                        key={cluster.id}
                                        onClick={() => setSelectedCluster(cluster.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                            isActive 
                                                ? 'bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/20 scale-105' 
                                                : 'bg-white dark:bg-[#16161F] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-[#232330]'
                                        }`}
                                    >
                                        <span>{cluster.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#4338CA] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sector Summary Stats Bar — USER REQUIREMENT: 100% in #4F46E5 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12 p-6 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-sm">
                        <div className="text-center p-2">
                            <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">16 Sectors</div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Comprehensive Coverage</div>
                        </div>
                        <div className="text-center p-2 border-l border-slate-100 dark:border-[#232330]">
                            <div className="text-2xl lg:text-3xl font-black text-[#4F46E5] dark:text-[#818CF8] tracking-tight">1,480+</div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Verified Open Roles</div>
                        </div>
                        <div className="text-center p-2 border-l border-slate-100 dark:border-[#232330]">
                            {/* LOCKED BRAND COLOR #4F46E5 FOR 100% */}
                            <div className="text-2xl lg:text-3xl font-black text-[#4F46E5] dark:text-[#818CF8] tracking-tight">100%</div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Credential Audited</div>
                        </div>
                        <div className="text-center p-2 border-l border-slate-100 dark:border-[#232330]">
                            <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">47 Counties</div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">National Footprint</div>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    {filteredCategories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {filteredCategories.map(cat => (
                                <CategoryCard 
                                    key={cat.id} 
                                    category={cat} 
                                    onSelect={() => onNavigate('jobPortal')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 p-8 bg-white dark:bg-[#121218] rounded-3xl border border-slate-200 dark:border-[#232330] max-w-xl mx-auto">
                            <Icon name="search" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No matching industries found</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">No industry matching "{categorySearch}". Try another keyword or clear search.</p>
                            <button
                                onClick={() => { setCategorySearch(''); setSelectedCluster('all'); }}
                                className="px-5 py-2.5 bg-[#4F46E5] text-white text-xs font-bold rounded-xl hover:bg-[#6366F1] transition-colors cursor-pointer"
                            >
                                Reset Industry Filters
                            </button>
                        </div>
                    )}

                </div>
            </section>

            {/* 7. Distinct Pathways: Talent vs Institutions */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4 max-w-6xl">
                    <SectionTitle 
                        badge="Private Members' Access"
                        title="Two Distinct Portals. One High-Integrity Standard."
                        subtitle="Whether seeking top-decile verified talent or applying for individual certification, our ecosystem maintains rigorous criteria."
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Institutions Portal Card */}
                        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-xl flex flex-col justify-between group hover:border-[#4F46E5]/40 transition-all">
                            <div className="space-y-6">
                                <div className="h-16 w-16 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center">
                                    <Icon name="buildingOffice" className="h-8 w-8" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-widest">For Institutions &amp; Enterprises</span>
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">Hire Zero-Risk Verified Talent</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    Eliminate hiring risk and candidate fraud. Access pre-audited executive, technical, and regulatory talent whose records have already cleared direct registrar and statutory audits.
                                </p>
                                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                        <span>Full cryptographic candidate dossiers ready on day one.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                        <span>Gemini AI calibrated role-readiness matching.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                        <span>Dedicated enterprise talent partner &amp; SLA compliance.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-8 mt-8 border-t border-slate-100 dark:border-[#232330]">
                                <button 
                                    onClick={() => setShowEmployerIntakeModal(true)}
                                    className="w-full py-4 bg-[#4F46E5] hover:bg-[#6366F1] active:bg-[#4338CA] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#4F46E5]/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
                                >
                                    <span>Deploy Pre-Vetted Talent</span>
                                    <Icon name="arrowRight" className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Talent Portal Card */}
                        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] shadow-xl flex flex-col justify-between group hover:border-[#4F46E5]/40 transition-all">
                            <div className="space-y-6">
                                <div className="h-16 w-16 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center">
                                    <Icon name="academicCap" className="h-8 w-8" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-widest">For High-Integrity Professionals</span>
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">Apply to the Private Registry</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    Stand apart from the noise of public job boards. When you hold verified credentials, premier enterprises seek you out directly with confidential executive opportunities.
                                </p>
                                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                        <span>Lifetime sovereign credential passport (ECDSA signed).</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                        <span>Skip generic ATS filters straight to hiring decision-makers.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Icon name="check" className="h-4 w-4 text-[#4F46E5]" />
                                        <span>Premium compensation benchmarking across 16 sectors.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-8 mt-8 border-t border-slate-100 dark:border-[#232330]">
                                <button 
                                    onClick={() => onNavigate('signin', 'jobSeeker')}
                                    className="w-full py-4 bg-white dark:bg-[#16161F] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#4F46E5] dark:text-white border border-slate-200/80 dark:border-[#232330] font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-sm"
                                >
                                    <Icon name="userCheck" className="h-4 w-4 text-[#4F46E5]" />
                                    <span>Initiate Candidate Accreditation</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 8. Bidirectional Social Proof: Institutional Leader & Vetted Professional */}
            <section className="py-24 md:py-32 bg-white dark:bg-[#121218]/40 border-y border-slate-200/80 dark:border-[#232330]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <SectionTitle 
                        badge="Bidirectional Proof"
                        title="Voices of the Vetted Ecosystem"
                        subtitle="Hear from the leaders relying on our verification layer and the professionals whose careers it accelerated."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Testimonial 1: Institutional Leader */}
                        <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] relative overflow-hidden">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] dark:text-[#818CF8]">Hiring Institution Perspective</span>
                            <blockquote className="mt-4 text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                                "VerifiedHire completely transformed our executive technical recruitment. Knowing that every candidate's degree, regulatory license, and supervisor background have been forensically audited saves our HR and legal teams hundreds of hours."
                            </blockquote>
                            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-[#232330] flex items-center gap-4">
                                <img 
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
                                    alt="Jane Mwangi" 
                                    className="h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-[#232330]" 
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Jane Mwangi</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Head of Talent &amp; Culture, Tier-1 Telco Partner</p>
                                    <p className="text-[10px] text-[#4F46E5] dark:text-[#818CF8] font-mono mt-0.5">Verified Institutional Partner #KE-881</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2: Vetted Professional */}
                        <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-[#121218] border border-slate-200/80 dark:border-[#232330] relative overflow-hidden">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] dark:text-[#818CF8]">Vetted Professional Perspective</span>
                            <blockquote className="mt-4 text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                                "The surgical vetting process gave me a credential that stands on its own. Within 10 days of my dossier being verified, I was connected directly with the VP of Engineering at an enterprise bank. No spam, no ghosting."
                            </blockquote>
                            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-[#232330] flex items-center gap-4">
                                <img 
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
                                    alt="David Otieno" 
                                    className="h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-[#232330]" 
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">David Otieno, PE</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Principal Distributed Systems Architect</p>
                                    <p className="text-[10px] text-[#4F46E5] dark:text-[#818CF8] font-mono mt-0.5">Verified Member #VH-5912 • 100% Score</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. FAQs Section */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4 max-w-4xl">
                    <SectionTitle 
                        badge="Clarity &amp; Assurance"
                        title="Frequently Addressed Inquiries"
                        subtitle="Everything you need to know about our forensic audit methodology, data governance, and placement model."
                    />
                    <div className="bg-white dark:bg-[#121218] p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-[#232330] shadow-sm">
                        {mockFAQs.map((faq, i) => <FAQItem key={i} {...faq} />)}
                    </div>
                </div>
            </section>

            {/* 10. Closing Strategic CTA & Trust Seal */}
            <section className="py-24 md:py-36 bg-white dark:bg-[#0B0B0F] border-t border-slate-200/80 dark:border-[#232330] relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-[#4F46E5]/5 via-transparent to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="inline-block p-4 rounded-3xl bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] mb-8">
                        <VerifiedHireIconMark size={56} />
                    </div>
                    
                    <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05]">
                        The Future of Hiring <br />is Verified.
                    </h2>
                    
                    <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Join the high-integrity ecosystem setting the benchmark for African enterprise talent. Start with verified truth.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => setShowEmployerIntakeModal(true)}
                            className="w-full sm:w-auto px-8 py-4 bg-[#4F46E5] hover:bg-[#6366F1] active:bg-[#4338CA] text-white font-bold rounded-2xl shadow-xl shadow-[#4F46E5]/25 transition-all text-sm cursor-pointer"
                        >
                            Schedule Institutional Briefing
                        </button>
                        <button 
                            onClick={() => onNavigate('signin', 'jobSeeker')}
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#121218] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/80 dark:border-[#232330] font-bold rounded-2xl transition-all text-sm cursor-pointer"
                        >
                            Apply for Vetting
                        </button>
                    </div>

                    {/* Trust and Compliance Badges */}
                    <div className="mt-16 pt-8 border-t border-slate-100 dark:border-[#232330] flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <Icon name="shieldCheck" className="h-4 w-4 text-[#4F46E5]" />
                            ISO 27001 Aligned
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Icon name="lockClosed" className="h-4 w-4 text-[#4F46E5]" />
                            Kenya Data Protection Act 2019
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Icon name="checkCircle" className="h-4 w-4 text-[#4F46E5]" />
                            KNQA Registry Interoperable
                        </span>
                    </div>
                </div>
            </section>

            {/* Institutional Intake Modal */}
            {showEmployerIntakeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-[#121218] rounded-3xl w-full max-w-lg p-8 border border-slate-200/80 dark:border-[#232330] shadow-2xl relative">
                        <button 
                            onClick={() => setShowEmployerIntakeModal(false)}
                            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                            <Icon name="close" className="h-5 w-5" />
                        </button>

                        <div className="mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] dark:text-[#818CF8]">Institutional Talent Acquisition</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">Request Pre-Vetted Talent</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                An Enterprise Talent Partner will contact you within 2 business hours.
                            </p>
                        </div>

                        {intakeSuccess ? (
                            <div className="py-8 text-center space-y-3">
                                <div className="h-14 w-14 rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center mx-auto">
                                    <Icon name="checkCircle" className="h-7 w-7" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Briefing Request Registered</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Redirecting you to the enterprise access gateway...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleInstitutionSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Institution / Enterprise Name
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g., Safaricom PLC, KCB, KQ..."
                                        value={institutionName}
                                        onChange={e => setInstitutionName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Work Email
                                    </label>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="talent.director@company.com"
                                        value={institutionEmail}
                                        onChange={e => setInstitutionEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Primary Role Type Needed
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., Principal Cloud Architect, Head of Legal, PE Engineer..."
                                        value={talentTargetRole}
                                        onChange={e => setTalentTargetRole(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#16161F] border border-slate-200 dark:border-[#232330] rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4F46E5]"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit"
                                        className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#6366F1] active:bg-[#4338CA] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#4F46E5]/20 transition-all cursor-pointer"
                                    >
                                        Submit Institutional Request
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
