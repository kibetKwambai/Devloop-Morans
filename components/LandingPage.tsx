
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon, IconName } from './Icon';
import { StatItem } from './StatItem';
import { UserRole, JobSeekerProfile, VerificationStatus } from '../types';
import { mockProfiles, mockJobs, mockBlogPosts, mockFAQs, mockCategories } from '../services/mockData';

interface LandingPageProps {
    onNavigate: (view: string, role?: 'jobSeeker' | 'employer') => void;
    isLoggedIn?: boolean;
    userRole?: UserRole | null;
}

const companies = ['Safaricom PLC', 'Kenya Airways', 'KCB Group', 'Equity Bank', 'Andela', 'Twiga Foods', 'Cellulant'];

const SectionTitle: React.FC<{ title: string; subtitle?: string; light?: boolean }> = ({ title, subtitle, light }) => (
    <div className="text-center mb-16">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-3xl md:text-4xl font-black tracking-tight ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}
        >
            {title}
        </motion.h2>
        {subtitle && (
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`mt-4 text-lg max-w-2xl mx-auto ${light ? 'text-indigo-100' : 'text-slate-600 dark:text-indigo-300'}`}
            >
                {subtitle}
            </motion.p>
        )}
    </div>
);

const FeatureCard: React.FC<{ title: string; description: string; icon: IconName }> = ({ title, description, icon }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-indigo-900/40 p-8 rounded-3xl border border-slate-100 dark:border-indigo-800 shadow-sm hover:shadow-xl transition-all"
    >
        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center mb-6">
            <Icon name={icon} className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-indigo-200 leading-relaxed">{description}</p>
    </motion.div>
);

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="relative p-8 bg-slate-50 dark:bg-indigo-900/20 rounded-3xl border border-slate-100 dark:border-indigo-800">
        <span className="absolute -top-4 -left-4 h-12 w-12 bg-indigo-600 text-white flex items-center justify-center rounded-2xl font-black text-xl shadow-lg">
            {number}
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 mt-2">{title}</h3>
        <p className="text-slate-600 dark:text-indigo-200 leading-relaxed">{description}</p>
    </div>
);

const CategoryCard: React.FC<{ name: string; icon: IconName; count: number }> = ({ name, icon, count }) => (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className="flex items-center p-6 bg-white dark:bg-indigo-900/40 rounded-2xl border border-slate-100 dark:border-indigo-800 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-800/50 transition-all"
    >
        <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mr-4">
            <Icon name={icon} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
            <h4 className="font-bold text-slate-900 dark:text-white">{name}</h4>
            <p className="text-sm text-slate-500 dark:text-indigo-300">{count} Open Positions</p>
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

    return (
        <div className="bg-white dark:bg-indigo-950 selection:bg-indigo-100 selection:text-indigo-900">
            {/* 1. Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 dark:opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]" />
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-8"
                        >
                            <Icon name="sparkles" className="h-4 w-4 mr-2" />
                            Kenya's #1 Verified Talent Network
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
                        >
                            Hire with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Absolute Confidence</span>.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 text-xl text-slate-600 dark:text-indigo-200 leading-relaxed max-w-2xl mx-auto"
                        >
                            We manually verify every professional, so you can focus on building your team. No more fake CVs, just top-tier talent.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
                        >
                            <button 
                                onClick={() => onNavigate('jobPortal')}
                                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transform hover:scale-105 transition-all"
                            >
                                Explore Job Portal
                            </button>
                            <button 
                                onClick={() => onNavigate('signin', 'jobSeeker')}
                                className="px-8 py-4 bg-white dark:bg-indigo-900 text-indigo-600 dark:text-white border-2 border-indigo-100 dark:border-indigo-800 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-indigo-800 transition-all"
                            >
                                Find Your Dream Job
                            </button>
                            <button 
                                onClick={() => onNavigate('signin', 'employer')}
                                className="px-8 py-4 bg-slate-100 dark:bg-indigo-800 text-slate-900 dark:text-white rounded-2xl font-black text-lg hover:bg-slate-200 dark:hover:bg-indigo-700 transition-all"
                            >
                                Hire Verified Talent
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Logo Cloud */}
            <section className="py-12 border-y border-slate-100 dark:border-indigo-900/50">
                <div className="container mx-auto px-4">
                    <p className="text-center text-sm font-bold text-slate-400 dark:text-indigo-500 uppercase tracking-widest mb-8">Trusted by industry leaders</p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-50 dark:invert dark:opacity-30">
                        {companies.map(name => <span key={name} className="text-xl font-black tracking-tighter">{name}</span>)}
                    </div>
                </div>
            </section>

            {/* 3. Core Value Proposition */}
            <section className="py-24 bg-slate-50/50 dark:bg-indigo-950/50">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Why VerifiedHire?"
                        subtitle="We've built a platform that prioritizes trust, speed, and quality above all else."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon="shieldCheck"
                            title="Manual Verification"
                            description="Our agents personally verify work history, education, and legal clearances for every candidate."
                        />
                        <FeatureCard 
                            icon="zap"
                            title="AI-Powered Matching"
                            description="Gemini AI helps match the right talent to the right roles based on verified skills and experience."
                        />
                        <FeatureCard 
                            icon="lockClosed"
                            title="Secure & Compliant"
                            description="Fully compliant with the Data Protection Act of Kenya and international security standards."
                        />
                    </div>
                </div>
            </section>

            {/* 4. How it Works (Seekers) */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">For Job Seekers: <br/><span className="text-indigo-600">Get Noticed by the Best</span></h2>
                            <p className="text-lg text-slate-600 dark:text-indigo-300 mb-10 leading-relaxed">Stop competing with thousands of unverified profiles. Get your skills validated and stand out to top employers.</p>
                            <div className="space-y-8">
                                <StepCard number="01" title="Create Your Profile" description="Build a comprehensive professional profile showcasing your skills and experience." />
                                <StepCard number="02" title="Get Verified" description="Our agents will review your documents and verify your history with previous employers." />
                                <StepCard number="03" title="Land Your Role" description="Apply to exclusive jobs or let top companies find you through our verified network." />
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="aspect-square bg-indigo-600 rounded-[40px] rotate-3 absolute inset-0 -z-10 opacity-10" />
                            <img src="https://picsum.photos/seed/jobseeker/800/800" alt="Job Seeker" className="rounded-[40px] shadow-2xl" referrerPolicy="no-referrer" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. How it Works (Employers) */}
            <section className="py-24 bg-slate-50 dark:bg-indigo-900/20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">For Employers: <br/><span className="text-indigo-600">Hire with Zero Risk</span></h2>
                            <p className="text-lg text-slate-600 dark:text-indigo-300 mb-10 leading-relaxed">Reduce your time-to-hire by 60% by accessing a pool of pre-vetted, high-caliber professionals.</p>
                            <div className="space-y-8">
                                <StepCard number="01" title="Post Your Role" description="Define your requirements and reach our network of verified professionals." />
                                <StepCard number="02" title="Review Verified Talent" description="Browse profiles with pre-verified work history and AI-generated summaries." />
                                <StepCard number="03" title="Hire with Confidence" description="Make offers directly and manage your hiring pipeline through our dashboard." />
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="aspect-square bg-indigo-600 rounded-[40px] -rotate-3 absolute inset-0 -z-10 opacity-10" />
                            <img src="https://picsum.photos/seed/employer/800/800" alt="Employer" className="rounded-[40px] shadow-2xl" referrerPolicy="no-referrer" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Featured Categories */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Explore by Category"
                        subtitle="Find opportunities across Kenya's fastest-growing industries."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockCategories.map(cat => <CategoryCard key={cat.name} {...cat as any} />)}
                    </div>
                </div>
            </section>

            {/* 7. Verification Deep Dive */}
            <section className="py-24 bg-indigo-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-800 -skew-x-12 translate-x-1/4 -z-0" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-black mb-8 leading-tight">The Gold Standard of <br/>Professional Verification</h2>
                            <ul className="space-y-6">
                                {[
                                    'Direct contact with previous HR departments',
                                    'Validation of academic certificates with institutions',
                                    'Police clearance and legal background checks',
                                    'Professional certification authenticity checks',
                                    'Reference validation and soft skill assessment'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center mr-4 mt-1">
                                            <Icon name="check" className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-lg text-indigo-100">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:w-1/2 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                            <div className="flex items-center mb-6">
                                <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center mr-4">
                                    <Icon name="shieldCheck" className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">Verified Badge</h3>
                            </div>
                            <p className="text-indigo-100 leading-relaxed mb-8">This badge is only awarded to candidates who pass our 5-stage manual verification process. It represents the highest level of professional trust in the market.</p>
                            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    className="h-full bg-indigo-400"
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-sm font-bold text-indigo-300">
                                <span>Verification Progress</span>
                                <span>100% Complete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. Impact Stats */}
            <section className="py-24 bg-slate-50 dark:bg-indigo-900/20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <StatItem value="12,500+" label="Verified Professionals" icon="userGroup" />
                        <StatItem value="450+" label="Partner Companies" icon="buildingOffice" />
                        <StatItem value="98.5%" label="Hiring Success Rate" icon="checkCircle" />
                    </div>
                </div>
            </section>

            {/* 9. Featured Candidates */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Top Verified Talent"
                        subtitle="Connect with pre-vetted professionals ready for their next challenge."
                    />
                    <div className="flex overflow-x-auto space-x-6 pb-8 -mx-4 px-4 scrollbar-hide">
                        {featuredProfiles.map(profile => (
                            <motion.div 
                                key={profile.id}
                                whileHover={{ y: -5 }}
                                className="flex-shrink-0 w-72 bg-white dark:bg-indigo-900/40 rounded-3xl border border-slate-100 dark:border-indigo-800 p-8 shadow-sm hover:shadow-xl transition-all"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <img src={profile.photoUrl} alt={profile.name} className="h-24 w-24 rounded-2xl object-cover mb-4 ring-4 ring-indigo-50 dark:ring-indigo-500/20" referrerPolicy="no-referrer" />
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name}</h4>
                                    <p className="text-sm text-slate-500 dark:text-indigo-300 mt-1">{profile.headline}</p>
                                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                                        {profile.skills.slice(0, 2).map(s => (
                                            <span key={s.id} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">{s.name}</span>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => onNavigate('signin')}
                                        className="mt-8 w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                                    >
                                        View Profile
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
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="What Our Users Say"
                        subtitle="Join thousands of satisfied professionals and employers."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-indigo-600 p-10 rounded-[40px] text-white relative overflow-hidden">
                            <Icon name="sparkles" className="absolute -top-10 -right-10 h-40 w-40 text-white/10" />
                            <p className="text-xl italic leading-relaxed mb-8 relative z-10">"VerifiedHire has completely changed how we recruit. The quality of candidates is unmatched, and the verification badge gives us peace of mind."</p>
                            <div className="flex items-center">
                                <img src="https://i.pravatar.cc/150?u=jane" alt="Jane" className="h-14 w-14 rounded-2xl object-cover mr-4" referrerPolicy="no-referrer" />
                                <div>
                                    <p className="font-bold text-lg">Jane Mwangi</p>
                                    <p className="text-indigo-200">HR Director, Safaricom</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 p-10 rounded-[40px] text-white relative overflow-hidden">
                            <Icon name="briefcase" className="absolute -bottom-10 -left-10 h-40 w-40 text-white/10" />
                            <p className="text-xl italic leading-relaxed mb-8 relative z-10">"I landed my dream role at a top tech firm within two weeks of getting my profile verified. The process was smooth and professional."</p>
                            <div className="flex items-center">
                                <img src="https://i.pravatar.cc/150?u=david" alt="David" className="h-14 w-14 rounded-2xl object-cover mr-4" referrerPolicy="no-referrer" />
                                <div>
                                    <p className="font-bold text-lg">David Otieno</p>
                                    <p className="text-slate-400">Senior Software Engineer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 12. For Employers (Bento Grid) */}
            <section className="py-24 bg-slate-50 dark:bg-indigo-900/20">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Powerful Tools for Employers"
                        subtitle="Everything you need to build a world-class team."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2 bg-white dark:bg-indigo-900/40 p-8 rounded-3xl border border-slate-100 dark:border-indigo-800">
                            <Icon name="search" className="h-10 w-10 text-indigo-600 mb-6" />
                            <h4 className="text-2xl font-bold mb-4">Advanced Talent Search</h4>
                            <p className="text-slate-600 dark:text-indigo-300">Filter by verified skills, industry experience, and legal compliance with surgical precision.</p>
                        </div>
                        <div className="bg-indigo-600 p-8 rounded-3xl text-white">
                            <Icon name="userPlus" className="h-10 w-10 text-white mb-6" />
                            <h4 className="text-xl font-bold mb-4">Quick Shortlisting</h4>
                            <p className="text-indigo-100 text-sm">Organize your pipeline with one-click shortlisting and notes.</p>
                        </div>
                        <div className="bg-white dark:bg-indigo-900/40 p-8 rounded-3xl border border-slate-100 dark:border-indigo-800">
                            <Icon name="chat" className="h-10 w-10 text-indigo-600 mb-6" />
                            <h4 className="text-xl font-bold mb-4">Direct Messaging</h4>
                            <p className="text-slate-600 dark:text-indigo-300 text-sm">Securely communicate with candidates directly on the platform.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 13. For Job Seekers (Bento Grid) */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Elevate Your Professional Standing"
                        subtitle="Tools designed to help you stand out and succeed."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-slate-900 p-8 rounded-3xl text-white">
                            <Icon name="document" className="h-10 w-10 text-indigo-400 mb-6" />
                            <h4 className="text-xl font-bold mb-4">Document Vault</h4>
                            <p className="text-slate-400 text-sm">Securely store and share all your professional credentials.</p>
                        </div>
                        <div className="md:col-span-2 bg-white dark:bg-indigo-900/40 p-8 rounded-3xl border border-slate-100 dark:border-indigo-800">
                            <Icon name="academicCap" className="h-10 w-10 text-indigo-600 mb-6" />
                            <h4 className="text-2xl font-bold mb-4">Verification Badge</h4>
                            <p className="text-slate-600 dark:text-indigo-300">The ultimate mark of professional integrity in the Kenyan job market.</p>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-500/20 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                            <Icon name="arrowTrendingUp" className="h-10 w-10 text-indigo-600 mb-6" />
                            <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Career Insights</h4>
                            <p className="text-slate-600 dark:text-indigo-300 text-sm">Track who views your profile and get market salary data.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 14. AI Integration */}
            <section className="py-24 bg-gradient-to-br from-indigo-900 to-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                            <Icon name="sparkles" className="h-10 w-10 text-indigo-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-8">Powered by Gemini AI</h2>
                        <p className="text-xl text-indigo-100 leading-relaxed mb-12">We leverage Google's most advanced AI to help you write better job descriptions, summarize candidate profiles, and provide intelligent career coaching.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                                <h4 className="font-bold mb-2">Smart Summaries</h4>
                                <p className="text-sm text-indigo-200">Instant, professional summaries of verified candidate profiles.</p>
                            </div>
                            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                                <h4 className="font-bold mb-2">Job Optimization</h4>
                                <p className="text-sm text-indigo-200">AI-driven suggestions to make your job postings more attractive.</p>
                            </div>
                            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                                <h4 className="font-bold mb-2">Skill Gap Analysis</h4>
                                <p className="text-sm text-indigo-200">Personalized advice on which skills to learn next to advance your career.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 15. Global Reach */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <SectionTitle 
                                title="Global Standards, Local Expertise"
                                subtitle="We combine world-class technology with a deep understanding of the Kenyan job market."
                            />
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-4xl font-black text-indigo-600 mb-2">47</h4>
                                    <p className="text-slate-600 dark:text-indigo-300 font-bold">Counties Covered</p>
                                </div>
                                <div>
                                    <h4 className="text-4xl font-black text-indigo-600 mb-2">100%</h4>
                                    <p className="text-slate-600 dark:text-indigo-300 font-bold">Compliance</p>
                                </div>
                                <div>
                                    <h4 className="text-4xl font-black text-indigo-600 mb-2">24/7</h4>
                                    <p className="text-slate-600 dark:text-indigo-300 font-bold">Agent Support</p>
                                </div>
                                <div>
                                    <h4 className="text-4xl font-black text-indigo-600 mb-2">50k+</h4>
                                    <p className="text-slate-600 dark:text-indigo-300 font-bold">Monthly Users</p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="aspect-video bg-slate-100 dark:bg-indigo-900/40 rounded-[40px] flex items-center justify-center border border-slate-200 dark:border-indigo-800">
                                <Icon name="map" className="h-32 w-32 text-indigo-200 dark:text-indigo-800" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 16. Newsletter */}
            <section className="py-24 bg-indigo-600">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Stay Ahead of the Curve</h2>
                            <p className="text-slate-600 dark:text-indigo-300">Get the latest hiring trends, career advice, and exclusive job alerts delivered to your inbox.</p>
                        </div>
                        <div className="md:w-1/2 w-full">
                            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="flex-1 px-6 py-4 bg-slate-50 dark:bg-indigo-950 border border-slate-200 dark:border-indigo-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white"
                                />
                                <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all">
                                    Subscribe
                                </button>
                            </form>
                            <p className="mt-4 text-xs text-slate-400 dark:text-indigo-500">We respect your privacy. Unsubscribe at any time.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 17. FAQ */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Frequently Asked Questions"
                        subtitle="Everything you need to know about VerifiedHire."
                    />
                    <div className="max-w-3xl mx-auto">
                        {mockFAQs.map((faq, i) => <FAQItem key={i} {...faq} />)}
                    </div>
                </div>
            </section>

            {/* 18. Mobile App */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">VerifiedHire in Your Pocket</h2>
                            <p className="text-xl text-slate-400 mb-12 leading-relaxed">Manage your profile, track applications, and message employers on the go with our top-rated mobile app.</p>
                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all">
                                    <Icon name="apple" className="h-6 w-6 mr-3" />
                                    App Store
                                </button>
                                <button className="flex items-center px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black border border-white/20 hover:bg-white/20 transition-all">
                                    <Icon name="play" className="h-6 w-6 mr-3" />
                                    Google Play
                                </button>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="w-64 h-[500px] bg-slate-800 rounded-[40px] border-8 border-slate-700 mx-auto relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-600/20 to-transparent" />
                                <div className="p-6">
                                    <div className="h-2 w-12 bg-slate-700 rounded-full mx-auto mb-8" />
                                    <div className="space-y-4">
                                        <div className="h-12 w-full bg-slate-700/50 rounded-xl" />
                                        <div className="h-32 w-full bg-indigo-600/20 rounded-xl border border-indigo-500/30" />
                                        <div className="h-12 w-full bg-slate-700/50 rounded-xl" />
                                        <div className="h-12 w-full bg-slate-700/50 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 19. Blog Preview */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <SectionTitle 
                        title="Latest from Our Blog"
                        subtitle="Expert advice to help you navigate the modern job market."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {mockBlogPosts.map(post => (
                            <motion.div 
                                key={post.id}
                                whileHover={{ y: -5 }}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-video rounded-3xl overflow-hidden mb-6">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                                </div>
                                <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">{post.category}</span>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-2 mb-4 group-hover:text-indigo-600 transition-colors">{post.title}</h4>
                                <p className="text-slate-600 dark:text-indigo-300 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 20. Final CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600 -z-10" />
                <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[150px]" />
                </div>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Ready to Join the <br/>Future of Hiring?</h2>
                    <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">Whether you're looking for your next career move or your next star hire, VerifiedHire is here to help you succeed.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button 
                            onClick={() => onNavigate('signup')}
                            className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xl shadow-2xl hover:bg-slate-50 transform hover:scale-105 transition-all"
                        >
                            Get Started for Free
                        </button>
                        <button 
                            onClick={() => onNavigate('contact')}
                            className="px-12 py-5 bg-indigo-700 text-white rounded-2xl font-black text-xl border-2 border-indigo-500 hover:bg-indigo-800 transition-all"
                        >
                            Talk to an Expert
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
