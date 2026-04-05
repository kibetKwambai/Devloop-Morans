
import React from 'react';
import { Icon, IconName } from './Icon';
import { StatItem } from './StatItem';
import { mockJobs } from '../services/mockData';

import { UserRole } from '../types';

interface JobPortalHomeProps {
    onNavigate: (view: string, role?: 'jobSeeker' | 'employer') => void;
    isLoggedIn?: boolean;
    userRole?: UserRole | null;
}

const CategoryCard: React.FC<{ icon: IconName, title: string, count: number }> = ({ icon, title, count }) => (
    <div className="bg-white dark:bg-indigo-900 p-8 rounded-3xl border border-slate-100 dark:border-indigo-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
            <Icon name={icon} className="h-7 w-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-indigo-300 font-medium">{count} Open Positions</p>
    </div>
);

const StepCard: React.FC<{ number: string, title: string, description: string }> = ({ number, title, description }) => (
    <div className="relative p-8 bg-white dark:bg-indigo-900 rounded-3xl border border-slate-100 dark:border-indigo-800 shadow-sm">
        <div className="absolute -top-6 -left-6 h-12 w-12 bg-indigo-600 text-white flex items-center justify-center text-xl font-black rounded-2xl shadow-lg shadow-indigo-600/20">
            {number}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 mt-2">{title}</h3>
        <p className="text-slate-600 dark:text-indigo-200 leading-relaxed">{description}</p>
    </div>
);

export const JobPortalHome: React.FC<JobPortalHomeProps> = ({ onNavigate, isLoggedIn, userRole }) => {
    const categories = [
        { icon: 'computerDesktop', title: 'Technology', count: mockJobs.filter(j => j.category === 'Technology').length },
        { icon: 'briefcase', title: 'Business', count: mockJobs.filter(j => j.category === 'Business & Management').length },
        { icon: 'academicCap', title: 'Education', count: 45 },
        { icon: 'sparkles', title: 'Design', count: mockJobs.filter(j => j.category === 'Creative & Design').length },
        { icon: 'globeAlt', title: 'Aviation', count: mockJobs.filter(j => j.category === 'Aviation').length },
        { icon: 'scale', title: 'Legal', count: mockJobs.filter(j => j.category === 'Legal').length },
    ];

    const recentJobs = mockJobs.slice(0, 4);

    const handleSeekerAction = () => {
        if (isLoggedIn && userRole === UserRole.JobSeeker) {
            onNavigate('jobBoard');
        } else {
            onNavigate('signin', 'jobSeeker');
        }
    };

    const handleEmployerAction = () => {
        if (isLoggedIn && userRole === UserRole.Employer) {
            onNavigate('employer');
        } else {
            onNavigate('signin', 'employer');
        }
    };

    return (
        <div className="bg-white dark:bg-indigo-950">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 dark:from-indigo-950/20 pt-24 pb-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 mb-8">
                            <Icon name="sparkles" className="h-4 w-4 mr-2" />
                            Over 2,000+ Verified Jobs in Kenya
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            Your Next <span className="text-indigo-600 dark:text-indigo-400">Career Move</span> Starts with Trust.
                        </h1>
                        <p className="mt-8 text-xl text-slate-600 dark:text-indigo-200 leading-relaxed max-w-2xl mx-auto">
                            Connect with top-tier employers who value verified skills. No more ghosting, no more fake listings—just real opportunities for real talent.
                        </p>
                        <div className="mt-12 flex justify-center gap-6 flex-wrap">
                            <button 
                                onClick={handleSeekerAction}
                                className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 transform hover:scale-105 transition-all"
                            >
                                {isLoggedIn && userRole === UserRole.JobSeeker ? 'Go to Job Board' : 'Find Your Job'}
                            </button>
                            <button 
                                onClick={handleEmployerAction}
                                className="inline-flex items-center justify-center px-10 py-4 border-2 border-indigo-600 text-lg font-bold rounded-2xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all"
                            >
                                {isLoggedIn && userRole === UserRole.Employer ? 'Go to Dashboard' : 'Post a Job'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-slate-50 dark:bg-indigo-900/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatItem value="200+" label="Daily New Jobs" icon="briefcase" />
                        <StatItem value="1.2k" label="Verified Employers" icon="buildingOffice" />
                        <StatItem value="15k" label="Active Seekers" icon="userGroup" />
                        <StatItem value="98%" label="Placement Rate" icon="checkBadge" />
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="py-24 bg-white dark:bg-indigo-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Browse by Category</h2>
                            <p className="text-lg text-slate-600 dark:text-indigo-200">Explore thousands of job opportunities across diverse industries, all manually verified for authenticity.</p>
                        </div>
                        <button className="px-8 py-3 bg-slate-100 dark:bg-indigo-900 text-slate-700 dark:text-indigo-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-indigo-800 transition-all">
                            View All Categories
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat, i) => <CategoryCard key={i} {...cat} />)}
                    </div>
                </div>
            </div>

            {/* How it Works Section */}
            <div className="py-24 bg-slate-50 dark:bg-indigo-900/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">How VerifiedHire Works</h2>
                        <p className="text-lg text-slate-600 dark:text-indigo-200 max-w-2xl mx-auto">A simple, transparent process designed to build trust between job seekers and employers.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <StepCard 
                            number="01" 
                            title="Create Your Profile" 
                            description="Build a comprehensive professional profile and upload your credentials for manual verification by our expert agents." 
                        />
                        <StepCard 
                            number="02" 
                            title="Get Verified" 
                            description="Our team cross-references your work history and education to award you the 'Verified' badge, making you stand out to top employers." 
                        />
                        <StepCard 
                            number="03" 
                            title="Apply with Confidence" 
                            description="Browse verified job listings and apply with a single click. Track your application status in real-time through your dashboard." 
                        />
                    </div>
                </div>
            </div>

            {/* Featured Jobs Section */}
            <div className="py-24 bg-white dark:bg-indigo-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Featured Opportunities</h2>
                        <p className="text-lg text-slate-600 dark:text-indigo-200 max-w-2xl mx-auto">Hand-picked roles from our most trusted partner companies.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {recentJobs.map(job => (
                            <div key={job.id} className="bg-white dark:bg-indigo-900 p-8 rounded-3xl border border-slate-100 dark:border-indigo-800 shadow-sm hover:shadow-xl transition-all flex items-start gap-6">
                                <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-indigo-950 flex items-center justify-center border border-slate-100 dark:border-indigo-800 overflow-hidden flex-shrink-0">
                                    <img src={job.companyLogo} alt={job.companyName} className="h-10 w-10 object-contain" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{job.title}</h3>
                                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-4">{job.companyName} • {job.location}</p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="px-3 py-1 bg-slate-50 dark:bg-indigo-950 text-slate-600 dark:text-indigo-300 text-xs font-bold rounded-full border border-slate-100 dark:border-indigo-800">{job.type}</span>
                                        <span className="px-3 py-1 bg-slate-50 dark:bg-indigo-950 text-slate-600 dark:text-indigo-300 text-xs font-bold rounded-full border border-slate-100 dark:border-indigo-800">{job.salaryRange}</span>
                                    </div>
                                    <button 
                                        onClick={() => onNavigate('signin', 'jobSeeker')}
                                        className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                                    >
                                        View Details <Icon name="arrowRight" className="h-4 w-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 text-center">
                        <button 
                            onClick={() => onNavigate('signin', 'jobSeeker')}
                            className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 transition-all"
                        >
                            Explore All 2,000+ Jobs
                        </button>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-24 bg-indigo-600">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-8">Ready to Hire Kenya's Best?</h2>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Join hundreds of leading companies who trust VerifiedHire to find pre-vetted, high-caliber professionals.
                    </p>
                    <div className="flex justify-center gap-6 flex-wrap">
                        <button 
                            onClick={() => onNavigate('signin', 'employer')}
                            className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl"
                        >
                            Post Your First Job
                        </button>
                        <button 
                            onClick={() => onNavigate('pricing')}
                            className="px-10 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all"
                        >
                            View Pricing Plans
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
