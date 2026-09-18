
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
    { name: 'Kenya Airways', ticker: 'SkyTeam', sector: 'Aviation & Cargo', icon: 'globeAlt' },
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
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
};

const SectionTitle: React.FC<{ title: string; subtitle?: string; light?: boolean }> = ({ title, subtitle, light }) => (
    <div className="text-center mb-16 md:mb-24 px-4">
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            <motion.h2 
                variants={itemVariants}
                className={`text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-balance ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p 
                    variants={itemVariants}
                    className={`mt-6 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-balance ${light ? 'text-indigo-100' : 'text-slate-600 dark:text-indigo-300 font-medium'}`}
                >
                    {subtitle}
                </motion.p>
            )}
        </motion.div>
    </div>
);

const FeatureCard: React.FC<{ title: string; description: string; icon: IconName }> = ({ title, description, icon }) => (
    <motion.div 
        variants={itemVariants}
        whileHover={{ y: -8, scale: 1.02 }}
        className="glass-card p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group"
    >
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500">
            <Icon name={icon} className="h-8 w-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{title}</h3>
        <p className="text-slate-600 dark:text-indigo-200 leading-relaxed text-lg">{description}</p>
    </motion.div>
);

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <motion.div 
        variants={itemVariants}
        className="relative p-10 glass-card rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/30 transition-colors"
    >
        <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="absolute -top-6 -left-6 h-20 w-20 bg-indigo-600 text-white flex items-center justify-center pt-4 pl-4 rounded-full font-black text-2xl shadow-xl shadow-indigo-600/30"
        >
            {number}
        </motion.span>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-6 leading-tight">{title}</h3>
        <p className="text-slate-600 dark:text-indigo-200 leading-relaxed text-lg">{description}</p>
    </motion.div>
);

const CategoryCard: React.FC<{ 
    category: IndustryCategory; 
    onSelect?: () => void;
}> = ({ category, onSelect }) => (
    <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5 }}
        onClick={onSelect}
        className="group relative flex flex-col justify-between p-7 rounded-[2rem] bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-indigo-800/70 shadow-sm hover:shadow-xl hover:border-indigo-500/80 dark:hover:border-indigo-400 transition-all duration-300 cursor-pointer overflow-hidden"
    >
        {/* Subtle accent backdrop decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-[4rem] pointer-events-none group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-500" />
        
        <div>
            {/* Header: Icon, Category Sector Tag & Growth badge */}
            <div className="flex items-start justify-between gap-3 mb-5">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800/80 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon name={category.icon as IconName} className="h-7 w-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                        {category.growth}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-indigo-300">
                        {category.count} Verified Roles
                    </span>
                </div>
            </div>

            {/* Sector Tag badge */}
            <div className="mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100/80 dark:border-indigo-800/50">
                    {category.sectorTag}
                </span>
            </div>

            {/* Title */}
            <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors leading-tight mb-2.5">
                {category.name}
            </h4>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-indigo-200/90 leading-relaxed line-clamp-3 mb-4 font-normal">
                {category.description}
            </p>

            {/* Key Skills chips */}
            <div className="flex flex-wrap gap-1.5 mb-5">
                {category.keySkills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-indigo-950/70 text-slate-600 dark:text-indigo-200 border border-slate-200/60 dark:border-indigo-900/50">
                        {skill}
                    </span>
                ))}
            </div>
        </div>

        {/* Footer: Average Salary benchmark + Explore CTA */}
        <div className="pt-4 border-t border-slate-100 dark:border-indigo-900/50 flex items-center justify-between mt-auto">
            <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-indigo-400 block">
                    Benchmarked Comp
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {category.avgSalary}
                </span>
            </div>
            <div className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <Icon name="arrowRight" className="h-3.5 w-3.5 ml-1" />
            </div>
        </div>
    </motion.div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-100 dark:border-indigo-800 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
            >
                <span className="text-lg font-bold text-slate-900 dark:text-white">{question}</span>
                <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-600 dark:text-indigo-300 leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, isLoggedIn, userRole }) => {
    const featuredProfiles = mockProfiles.filter(p => p.verificationStatus === VerificationStatus.VERIFIED).slice(0, 8);
    const featuredJobs = mockJobs.slice(0, 3);

    const [selectedCluster, setSelectedCluster] = useState<string>('all');
    const [categorySearch, setCategorySearch] = useState<string>('');

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

    return (
        <div className="bg-white dark:bg-indigo-950 selection:bg-indigo-100 selection:text-indigo-900">
            {/* 1. Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                {/* Animated Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
                    <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-indigo-400 rounded-full blur-[120px] opacity-20 animate-blob" />
                    <div className="absolute bottom-[20%] right-[5%] w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-20 animate-blob animation-delay-2000" />
                    <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-purple-400 rounded-full blur-[100px] opacity-20 animate-blob animation-delay-4000" />
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-5xl mx-auto text-center"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-10 shadow-lg shadow-indigo-500/5 backdrop-blur-sm"
                        >
                            <VerifiedHireIconMark size={20} />
                            <span>VerifiedHire™ Surgical-Grade Integrity Layer</span>
                        </motion.div>
                        
                        <motion.h1 
                            variants={itemVariants}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.95] text-balance mb-10"
                        >
                            Hire with <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 bg-[length:200%_auto] animate-gradient-x">
                                Absolute Confidence
                            </span>.
                        </motion.h1>
                        
                        <motion.p 
                            variants={itemVariants}
                            className="mt-10 text-xl md:text-2xl text-slate-600 dark:text-indigo-200 leading-relaxed max-w-3xl mx-auto text-balance"
                        >
                            The premium marketplace for manually verified professionals. No noise, no fake profiles—just world-class talent, validated at source.
                        </motion.p>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="mt-16 flex flex-col sm:flex-row justify-center gap-6"
                        >
                            <button 
                                onClick={() => onNavigate('jobPortal')}
                                className="btn-primary group"
                            >
                                <span className="flex items-center">
                                    Explore Portal
                                    <Icon name="arrowRight" className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                            <button 
                                onClick={() => onNavigate('signin', 'jobSeeker')}
                                className="btn-secondary"
                            >
                                Get Verified
                            </button>
                            <button 
                                onClick={() => onNavigate('signin', 'employer')}
                                className="px-8 py-4 bg-slate-900 dark:bg-indigo-800 text-white rounded-2xl font-black text-lg hover:bg-black dark:hover:bg-indigo-700 active:scale-95 transition-all shadow-xl"
                            >
                                Hire Talent
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Enterprise Leaders / Trusted By */}
            <section className="py-14 border-y border-slate-200/80 dark:border-indigo-900/50 bg-slate-50/70 dark:bg-indigo-950/40">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2.5">
                            <Icon name="shieldCheck" className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            Pre-Vetted Enterprise Network
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Trusted by Kenya &amp; East Africa's Foremost Employers
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-indigo-300 mt-1.5 max-w-xl mx-auto">
                            Over 450+ verified corporate institutions rely on VerifiedHire to hire with zero fraud risk.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 max-w-7xl mx-auto">
                        {enterpriseLeaders.map((corp) => (
                            <div 
                                key={corp.name} 
                                className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-indigo-800/70 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 flex flex-col items-center text-center group"
                            >
                                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Icon name={corp.icon} className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                                    {corp.name}
                                </span>
                                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-1">
                                    {corp.ticker}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-indigo-300/80 mt-0.5 font-medium leading-tight">
                                    {corp.sector}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Core Value Proposition */}
            <section className="py-24 md:py-32 bg-slate-50/50 dark:bg-indigo-950/20">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Elite Recruitment Standards"
                        subtitle="A radical approach to job platforms: we verify so you don't have to."
                    />
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-10"
                    >
                        <FeatureCard 
                            icon="shieldCheck"
                            title="Manual OSINT Verification"
                            description="Our agents perform deep-dive validation of education, previous roles, and legal credentials for every user."
                        />
                        <FeatureCard 
                            icon="zap"
                            title="Gemini AI Matching"
                            description="Precision matching engine that prioritizes verified competency over keyword stuffing."
                        />
                        <FeatureCard 
                            icon="lockClosed"
                            title="Enterprise-Grade Privacy"
                            description="Bank-level encryption for all sensitive career documents, compliant with the Data Protection Act."
                        />
                    </motion.div>
                </div>
            </section>

            {/* 4. How it Works (Seekers) */}
            <section className="py-24 md:py-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="lg:w-1/2"
                        >
                            <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-tight text-balance">For Job Seekers: <br/><span className="text-indigo-600">Get Noticed by the Elite</span></motion.h2>
                            <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-indigo-300 mb-12 leading-relaxed text-balance">Stop competing in a sea of noise. Get your skills validated and gain exclusive access to top-tier verified opportunities.</motion.p>
                            <div className="space-y-10">
                                <StepCard number="01" title="Elite Profile Creation" description="Build a digital presence that reflects your true professional caliber." />
                                <StepCard number="02" title="Source Verification" description="Our agents validate your career history directly with previous institutions." />
                                <StepCard number="03" title="Accelerated Placement" description="Match with vetted companies specifically looking for verified excellence." />
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="aspect-square bg-indigo-600 rounded-[3rem] rotate-3 absolute inset-0 -z-10 opacity-10 scale-105" />
                            <img src="https://picsum.photos/seed/jobseeker/1000/1000" alt="Job Seeker" className="rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 5. How it Works (Employers) */}
            <section className="py-24 md:py-32 bg-slate-50 dark:bg-indigo-900/5 relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="lg:w-1/2"
                        >
                            <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-tight text-balance">For Employers: <br/><span className="text-indigo-600">Pure Signal, Zero Noise</span></motion.h2>
                            <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-indigo-300 mb-12 leading-relaxed text-balance">Eliminate recruitment risk. Access a locked-down ecosystem of pre-vetted, high-performance professionals.</motion.p>
                            <div className="space-y-10">
                                <StepCard number="01" title="Define the Standard" description="Post roles tailored for elite talent with our AI-assisted job builder." />
                                <StepCard number="02" title="Access Vetted Talent" description="Browse profiles that have already cleared our multi-stage manual verification." />
                                <StepCard number="03" title="Decision with Clarity" description="Hire in days, not months, backed by comprehensive verification dossiers." />
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="aspect-square bg-indigo-600 rounded-[3rem] -rotate-3 absolute inset-0 -z-10 opacity-10 scale-105" />
                            <img src="https://picsum.photos/seed/employer/1000/1000" alt="Employer" className="rounded-[2.5rem] shadow-2xl" referrerPolicy="no-referrer" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 6. Elite Industry Channels */}
            <section className="py-24 md:py-32 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-indigo-950/60 transition-colors">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle 
                        title="Elite Industry Channels"
                        subtitle="Strategic opportunities across Kenya's most critical growth sectors."
                    />

                    {/* Quick Search & Cluster Filter Pills */}
                    <div className="max-w-4xl mx-auto mb-12 space-y-5">
                        {/* Search Input */}
                        <div className="relative">
                            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-indigo-400" />
                            <input 
                                type="text"
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                                placeholder="Search all 16 strategic Kenyan industries by title, sector tag, or skill (e.g. Fintech, Geothermal, KCAA, GlobalGAP)..."
                                className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-indigo-800/80 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-indigo-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                            />
                            {categorySearch && (
                                <button 
                                    onClick={() => setCategorySearch('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                    aria-label="Clear search"
                                >
                                    <Icon name="xMark" className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Cluster Filter Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {clusters.map(cluster => {
                                const count = cluster.id === 'all' 
                                    ? mockCategories.length 
                                    : mockCategories.filter(c => c.cluster === cluster.id).length;
                                const isActive = selectedCluster === cluster.id;
                                return (
                                    <button
                                        key={cluster.id}
                                        onClick={() => setSelectedCluster(cluster.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                                            isActive 
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105' 
                                                : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-indigo-200 hover:bg-slate-100 dark:hover:bg-indigo-900/40 border border-slate-200/80 dark:border-indigo-800/60'
                                        }`}
                                    >
                                        <span>{cluster.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-indigo-500/80 text-white' : 'bg-slate-100 dark:bg-indigo-950 text-slate-500 dark:text-indigo-400'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sector Summary Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-indigo-800/60 shadow-sm">
                        <div className="text-center p-2">
                            <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">16 Sectors</div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-indigo-300 mt-1">Comprehensive Coverage</div>
                        </div>
                        <div className="text-center p-2 border-l border-slate-100 dark:border-indigo-900/40">
                            <div className="text-2xl lg:text-3xl font-black text-indigo-600 dark:text-indigo-400">1,480+</div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-indigo-300 mt-1">Verified Open Roles</div>
                        </div>
                        <div className="text-center p-2 border-l border-slate-100 dark:border-indigo-900/40">
                            <div className="text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-indigo-300 mt-1">Credential Audited</div>
                        </div>
                        <div className="text-center p-2 border-l border-slate-100 dark:border-indigo-900/40">
                            <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">47 Counties</div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-indigo-300 mt-1">National Footprint</div>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    {filteredCategories.length > 0 ? (
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredCategories.map(cat => (
                                <CategoryCard 
                                    key={cat.id} 
                                    category={cat} 
                                    onSelect={() => onNavigate('jobPortal')}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-16 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-indigo-800 max-w-xl mx-auto">
                            <Icon name="search" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No matching industries found</h4>
                            <p className="text-sm text-slate-500 dark:text-indigo-300 mb-6">No industry matching "{categorySearch}". Try searching for another keyword or clear the search.</p>
                            <button
                                onClick={() => { setCategorySearch(''); setSelectedCluster('all'); }}
                                className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                Reset Industry Filters
                            </button>
                        </div>
                    )}

                    {/* National Strategic Alignment Footnote */}
                    <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white border border-indigo-800/60 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                                <Icon name="shieldCheck" className="h-4 w-4 text-indigo-400" />
                                <span>Kenya Vision 2030 & Digital Economy Aligned</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-white">
                                Operating in a specialized sector or niche government concession?
                            </h3>
                            <p className="text-indigo-200 text-sm leading-relaxed">
                                Our surgical field-agent network conducts source-level institutional audits and OSINT checks across all technical disciplines and regulatory boards.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 flex-shrink-0">
                            <button 
                                onClick={() => onNavigate('jobPortal')}
                                className="px-6 py-3.5 bg-white text-indigo-900 hover:bg-indigo-50 text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                            >
                                Explore Verified Roles
                            </button>
                            <button 
                                onClick={() => onNavigate('becomeAnAgent')}
                                className="px-6 py-3.5 bg-indigo-800/80 hover:bg-indigo-700/80 text-white text-sm font-bold rounded-2xl border border-indigo-600/50 transition-all"
                            >
                                Verification Agent Network
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Verification Deep Dive */}
            <section className="py-24 md:py-32 bg-indigo-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-indigo-800 -skew-x-12 translate-x-1/3 -z-0 opacity-50" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="lg:w-1/2"
                        >
                            <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-black mb-10 leading-tight">The Global Standard <br/>for Professional Truth</motion.h2>
                            <ul className="space-y-8">
                                {[
                                    'Direct OSINT validation with HR departments',
                                    'Source-level academic institutional verification',
                                    'Government-linked legal background checks',
                                    'Professional certification authenticity auditing',
                                    'Multidimensional soft-skill references'
                                ].map((item, i) => (
                                    <motion.li variants={itemVariants} key={i} className="flex items-start">
                                        <div className="h-8 w-8 rounded-xl bg-indigo-500/30 backdrop-blur-md flex items-center justify-center mr-6 mt-1 border border-white/20">
                                            <Icon name="check" className="h-5 w-5 text-indigo-200" />
                                        </div>
                                        <span className="text-xl font-medium text-indigo-50 leading-relaxed">{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="lg:w-1/2 glass-card p-12 rounded-[3rem] border-white/20 shadow-2xl relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none rounded-[3rem]" />
                            <div className="flex items-center mb-10">
                                <div className="h-16 w-16 rounded-2xl bg-indigo-500 flex items-center justify-center mr-6 shadow-lg shadow-indigo-600/30">
                                    <Icon name="shieldCheck" className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tight">Verified Signal</h3>
                            </div>
                            <p className="text-xl text-indigo-100 leading-relaxed mb-12">The ultimate mark of professional integrity. Only awarded after clearing our 5-phase proprietary manual verification protocol.</p>
                            <div className="space-y-6">
                                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-indigo-400 to-white"
                                    />
                                </div>
                                <div className="flex justify-between text-sm font-black uppercase tracking-widest text-indigo-300">
                                    <span>Signal Integrity</span>
                                    <span>100% Reliable</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 8. Impact Stats */}
            <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/10">
                <div className="container mx-auto px-4">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12"
                    >
                        <StatItem value="12.5k+" label="Elite Professionals" icon="userGroup" />
                        <StatItem value="450+" label="Global Partners" icon="buildingOffice" />
                        <StatItem value="98.5%" label="Match Precision" icon="checkCircle" />
                    </motion.div>
                </div>
            </section>

            {/* 9. Featured Candidates */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="The Talent Pipeline"
                        subtitle="Accelerated access to pre-vetted professionals ready for immediate impact."
                    />
                    <div className="flex overflow-x-auto space-x-8 pb-12 -mx-4 px-4 scrollbar-hide">
                        {featuredProfiles.map(profile => (
                            <motion.div 
                                key={profile.id}
                                whileHover={{ y: -8 }}
                                className="flex-shrink-0 w-80 glass-card rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <img src={profile.photoUrl} alt={profile.name} className="h-28 w-28 rounded-3xl object-cover mb-6 ring-8 ring-indigo-50 dark:ring-indigo-500/10 shadow-lg" referrerPolicy="no-referrer" />
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{profile.name}</h4>
                                    <p className="text-sm font-medium text-slate-500 dark:text-indigo-400 mt-2">{profile.headline}</p>
                                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                                        {profile.skills.slice(0, 2).map(s => (
                                            <span key={s.id} className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-xs font-black rounded-full uppercase tracking-wider">{s.name}</span>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => onNavigate('signin')}
                                        className="mt-10 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg"
                                    >
                                        View Portfolio
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10. Featured Jobs */}
            <section className="py-24 bg-slate-50 dark:bg-indigo-900/20">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Latest Verified Jobs"
                        subtitle="The most recent opportunities from our partner companies."
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {featuredJobs.map(job => (
                            <motion.div 
                                key={job.id}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-indigo-900/40 p-8 rounded-3xl border border-slate-100 dark:border-indigo-800 shadow-sm hover:shadow-xl transition-all"
                            >
                                <div className="flex items-center mb-6">
                                    <img src={job.companyLogo} alt={job.companyName} className="h-12 w-12 rounded-xl object-cover mr-4" referrerPolicy="no-referrer" />
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{job.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-indigo-300">{job.companyName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-slate-500 dark:text-indigo-300 mb-6">
                                    <Icon name="location" className="h-4 w-4 mr-2" />
                                    {job.location}
                                    <span className="mx-2">•</span>
                                    <Icon name="briefcase" className="h-4 w-4 mr-2" />
                                    {job.type}
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-black">{job.salaryRange}</span>
                                    <button 
                                        onClick={() => onNavigate('jobPortal')}
                                        className="text-slate-900 dark:text-white font-bold text-sm hover:underline"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 11. Testimonials */}
            <section className="py-24 md:py-32 overflow-hidden px-4">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Voice of the Network"
                        subtitle="Elite institutions and high-performance individuals trust VerifiedHire."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="bg-indigo-600 p-12 lg:p-16 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl"
                        >
                            <Icon name="sparkles" className="absolute -top-10 -right-10 h-60 w-60 text-white/10" />
                            <p className="text-2xl lg:text-3xl italic leading-snug mb-12 relative z-10 font-medium">"VerifiedHire has fundamentally shifted our recruitment paradigm. The signal-to-noise ratio is unprecedented."</p>
                            <div className="flex items-center">
                                <img src="https://i.pravatar.cc/150?u=jane" alt="Jane" className="h-16 w-16 lg:h-20 lg:w-20 rounded-[1.5rem] object-cover mr-6 shadow-xl" referrerPolicy="no-referrer" />
                                <div>
                                    <p className="font-bold text-xl lg:text-2xl">Jane Mwangi</p>
                                    <p className="text-indigo-200 text-lg">HR Director, Safaricom</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="bg-slate-900 p-12 lg:p-16 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl"
                        >
                            <Icon name="briefcase" className="absolute -bottom-10 -left-10 h-60 w-60 text-white/10" />
                            <p className="text-2xl lg:text-3xl italic leading-snug mb-12 relative z-10 font-medium">"Getting verified was the catalyst for my move into executive engineering. The platform treats talent with respect."</p>
                            <div className="flex items-center">
                                <img src="https://i.pravatar.cc/150?u=david" alt="David" className="h-16 w-16 lg:h-20 lg:w-20 rounded-[1.5rem] object-cover mr-6 shadow-xl" referrerPolicy="no-referrer" />
                                <div>
                                    <p className="font-bold text-xl lg:text-2xl">David Otieno</p>
                                    <p className="text-slate-400 text-lg">Senior Software Engineer</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 12. For Employers (Bento Grid) */}
            <section className="py-24 md:py-32 bg-slate-50 dark:bg-indigo-950/20">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Decision Intelligence"
                        subtitle="Tools built for precision recruitment at scale."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <motion.div variants={itemVariants} className="md:col-span-2 glass-card p-12 rounded-[3rem] group">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Icon name="search" className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h4 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Advanced Talent Discovery</h4>
                            <p className="text-xl text-slate-600 dark:text-indigo-300 leading-relaxed">Surgical search precision across education, work history, and verified hard-skill metrics.</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="bg-indigo-600 p-12 rounded-[3rem] text-white shadow-xl shadow-indigo-600/20 group">
                            <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8 group-hover:bg-white/30 transition-colors">
                                <Icon name="userPlus" className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold mb-4 text-white">Express Pipeline</h4>
                            <p className="text-indigo-100 font-medium">One-click elite shortlisting with automated dossier generation.</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="glass-card p-12 rounded-[3rem] group">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-colors">
                                <Icon name="chat" className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Direct Channel</h4>
                            <p className="text-slate-600 dark:text-indigo-300 font-medium">Secure, encrypted communications for high-trust executive engagements.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 13. For Job Seekers (Bento Grid) */}
            <section className="py-24 md:py-32 overflow-hidden px-4">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Elevate Your Standing"
                        subtitle="Strategic tools designed to maximize your professional visibility."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <motion.div variants={itemVariants} className="bg-slate-900 p-12 rounded-[3.5rem] text-white group">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-8 group-hover:bg-indigo-500 transition-colors">
                                <Icon name="document" className="h-8 w-8 text-indigo-400 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-2xl font-bold mb-4 text-white">Credentials Vault</h4>
                            <p className="text-slate-400 font-medium">A sovereign space for your validated career history and legal documents.</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="md:col-span-2 glass-card p-12 rounded-[3.5rem] group">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Icon name="academicCap" className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h4 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Verification Signal</h4>
                            <p className="text-xl text-slate-600 dark:text-indigo-300 leading-relaxed">The premier mark of integrity in the digital professional landscape.</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="bg-indigo-50 dark:bg-indigo-500/10 p-12 rounded-[3.5rem] border border-indigo-100 dark:border-indigo-800 group">
                            <div className="h-16 w-16 rounded-2xl bg-white dark:bg-indigo-900/50 flex items-center justify-center mb-8 group-hover:shadow-lg transition-all">
                                <Icon name="arrowTrendingUp" className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Trend Intelligence</h4>
                            <p className="text-slate-600 dark:text-indigo-300 font-medium">Real-time insights into how the market interacts with your profile.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 14. AI Integration */}
            <section className="py-24 md:py-32 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black opacity-100" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="max-w-5xl mx-auto text-center"
                    >
                        <div className="h-24 w-24 bg-white/10 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center mx-auto mb-12 border border-white/20">
                            <Icon name="sparkles" className="h-12 w-12 text-indigo-400" />
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tight leading-none text-balance">Powered by <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300">Gemini AI</span></h2>
                        <p className="text-xl md:text-2xl text-indigo-100/80 leading-relaxed mb-16 max-w-4xl mx-auto text-balance">We integrate Google's most sophisticated intelligence to automate dossier generation and optimize matching.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {['Intent Matching', 'Signal Optimization', 'Insight Generation'].map((item, i) => (
                                <div key={i} className="p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                                    <h4 className="text-xl font-bold mb-4 text-white">{item}</h4>
                                    <p className="text-indigo-200/70 text-sm">Advanced intelligence driving professional excellence.</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 15. Global Reach */}
            <section className="py-24 md:py-32 overflow-hidden px-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="lg:w-1/2">
                            <SectionTitle 
                                title="Global Standards, Local Edge"
                                subtitle="Merging world-class tech with deep-rooted sector expertise."
                            />
                            <div className="grid grid-cols-2 gap-10">
                                {[
                                    { v: '47', l: 'Counties Covered' },
                                    { v: '100%', l: 'Compliance' },
                                    { v: '24/7', l: 'Elite Support' },
                                    { v: '50k+', l: 'Active Network' }
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <h4 className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-2">{stat.v}</h4>
                                        <p className="text-slate-500 dark:text-indigo-300 font-bold uppercase tracking-widest text-xs">{stat.l}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="aspect-square bg-indigo-600/5 rounded-full absolute inset-0 blur-[100px] animate-pulse" />
                            <div className="aspect-video glass-card rounded-[3rem] flex items-center justify-center relative overflow-hidden group">
                                <Icon name="map" className="h-40 w-40 text-indigo-200 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 16. Newsletter */}
            <section className="py-24 md:py-32 bg-indigo-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto glass-card bg-white/95 dark:bg-slate-900/95 rounded-[4rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-16 shadow-2xl relative z-10 border-none">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Elite Signal <br/>Direct to Inbox</h2>
                            <p className="text-xl text-slate-600 dark:text-indigo-300 leading-relaxed font-medium">Join our network and get the most critical insights every week.</p>
                        </div>
                        <div className="md:w-1/2 w-full">
                            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        placeholder="professional@email.com" 
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-indigo-950/50 border-2 border-slate-100 dark:border-indigo-900 rounded-3xl focus:outline-none focus:border-indigo-600 dark:text-white text-lg font-medium transition-colors"
                                    />
                                    <button className="sm:absolute sm:right-2 sm:top-2 px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
                                        Subscribe
                                    </button>
                                </div>
                                <p className="text-sm text-slate-400 dark:text-indigo-500 font-medium tracking-tight">Zero spam. High-integrity signal only.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* 17. FAQ */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Doubt Nothing"
                        subtitle="Detailed clarity on our verification philosophy and ecosystem compliance."
                    />
                    <div className="max-w-4xl mx-auto glass-card p-10 md:p-16 rounded-[4rem]">
                        {mockFAQs.map((faq, i) => <FAQItem key={i} {...faq} />)}
                    </div>
                </div>
            </section>

            {/* 18. Mobile App */}
            <section className="py-24 md:py-48 bg-slate-950 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(79,70,229,0.15)_0%,_transparent_50%)]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="lg:w-1/2">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8">System Mobility</div>
                            <h2 className="text-4xl md:text-7xl font-black mb-10 leading-[0.95] tracking-tight text-balance">VerifiedHire <br/>in Your Pocket</h2>
                            <p className="text-xl md:text-2xl text-slate-400 mb-16 leading-relaxed text-balance">Full power of our engine, natively optimized for the executive move.</p>
                            <div className="flex flex-wrap gap-6">
                                <button className="flex items-center px-10 py-5 bg-white text-slate-950 rounded-[1.5rem] font-black text-lg hover:bg-slate-100 transition-all shadow-2xl active:scale-95">
                                    <Icon name="apple" className="h-7 w-7 mr-4" /> App Store
                                </button>
                                <button className="flex items-center px-10 py-5 bg-white/5 backdrop-blur-xl text-white rounded-[1.5rem] font-black text-lg border-2 border-white/10 hover:bg-white/10 transition-all active:scale-95">
                                    <Icon name="play" className="h-7 w-7 mr-4" /> Play Store
                                </button>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="w-72 md:w-80 h-[600px] bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-800 mx-auto relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-600/30 to-transparent" />
                                <div className="p-8 space-y-6 flex flex-col items-center justify-center text-center">
                                    <div className="h-2 w-16 bg-slate-800 rounded-full mx-auto" />
                                    <div className="py-6 flex flex-col items-center">
                                        <VerifiedHireIconMark size={72} />
                                        <span className="mt-3 text-lg font-black tracking-tight text-white">Verified<span className="text-indigo-400">Hire</span></span>
                                        <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">Mobile Passport</span>
                                    </div>
                                    <div className="w-full space-y-3">
                                        <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/50 flex items-center justify-between text-xs">
                                            <span className="text-slate-300 font-semibold">Sovereign Vault</span>
                                            <span className="text-emerald-400 font-bold">Connected</span>
                                        </div>
                                        <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/50 flex items-center justify-between text-xs">
                                            <span className="text-slate-300 font-semibold">Integrity Score</span>
                                            <span className="text-indigo-400 font-bold">100 / 100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 19. Blog Preview */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <SectionTitle title="Intelligent Insights" subtitle="High-integrity perspectives on recruitment strategy." />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
                        {mockBlogPosts.map(post => (
                            <motion.div key={post.id} whileHover={{ y: -10 }} className="group">
                                <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl bg-slate-100">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                                </div>
                                <h4 className="text-2xl font-black mb-4 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">{post.title}</h4>
                                <div className="flex items-center text-indigo-600 font-black text-sm">Read Article <Icon name="arrowRight" className="h-4 w-4 ml-2" /></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 20. Final CTA */}
            <section className="py-32 md:py-48 relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-slate-950 -z-10" />
                <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_50%,_indigo_0%,_transparent_70%)] opacity-40" />
                <div className="container mx-auto px-4 text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="flex flex-col items-center">
                        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                            <VerifiedHireIconMark size={84} />
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tight leading-[0.9] text-balance">The Future of Hiring <br/>is Verified.</h2>
                        <p className="text-xl md:text-3xl text-indigo-100/70 mb-16 max-w-4xl mx-auto leading-relaxed text-balance">Start with the truth. Scale with the elite.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-8">
                            <button onClick={() => onNavigate('signup')} className="px-14 py-6 bg-white text-indigo-600 rounded-3xl font-black text-2xl shadow-2xl hover:bg-indigo-50 transition-all">Get Started Free</button>
                            <button onClick={() => onNavigate('contact')} className="px-14 py-6 bg-transparent text-white rounded-3xl font-black text-2xl border-4 border-white/20 backdrop-blur-xl hover:bg-white/10 transition-all">Contact Expert</button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};
