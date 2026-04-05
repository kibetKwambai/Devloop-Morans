

import React from 'react';
import { Icon } from './Icon';
import { JobSeekerProfile, VerificationStatus } from '../types';
import { mockProfiles } from '../services/mockData';

interface LandingPageProps {
    onNavigate: (view: string, role?: 'jobSeeker' | 'employer') => void;
}

const companies = ['Safaricom PLC', 'Kenya Airways', 'KCB Group', 'Equity Bank', 'Andela', 'Twiga Foods', 'Cellulant'];

const StatItem: React.FC<{ value: string, label: string, icon: any }> = ({ value, label, icon }) => (
    <div className="flex flex-col items-center text-center">
        <Icon name={icon} className="h-10 w-10 text-indigo-500 dark:text-indigo-400 mb-2"/>
        <p className="text-4xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="mt-1 text-slate-500 dark:text-indigo-300">{label}</p>
    </div>
);

const HowItWorksStep: React.FC<{ title: string, description: string, step: number }> = ({ title, description, step }) => (
    <div className="relative flex flex-col items-center text-center">
        <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white shadow-lg ring-8 ring-white dark:ring-indigo-900/50">
           {step}
        </div>
        <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-indigo-300">{description}</p>
    </div>
);


const FeaturedCandidateCard: React.FC<{ profile: JobSeekerProfile }> = ({ profile }) => (
    <div className="flex-shrink-0 w-72 bg-white dark:bg-indigo-900 rounded-xl shadow-lg p-6 border border-slate-100 dark:border-indigo-800 transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex flex-col items-center text-center">
            <img className="h-20 w-20 rounded-full object-cover ring-4 ring-indigo-100 dark:ring-indigo-500/30" src={profile.photoUrl} alt={profile.name} />
            <h4 className="mt-4 font-bold text-slate-800 dark:text-white">{profile.name}</h4>
            <p className="text-sm text-slate-500 dark:text-indigo-300 leading-tight">{profile.headline}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {profile.skills.slice(0, 3).map(skill => (
                    <span key={skill.id} className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full">
                        {skill.name}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

const TestimonialCard: React.FC<{ quote: string, name: string, role: string, avatar: string }> = ({ quote, name, role, avatar }) => (
     <div className="bg-indigo-700/50 p-8 rounded-xl shadow-lg backdrop-blur-sm">
        <p className="text-indigo-100 italic">"{quote}"</p>
        <div className="mt-4 flex items-center">
            <img className="h-12 w-12 rounded-full object-cover" src={avatar} alt={name}/>
            <div className="ml-4">
                <p className="font-semibold text-white">{name}</p>
                <p className="text-indigo-200 text-sm">{role}</p>
            </div>
        </div>
    </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const featuredProfiles = mockProfiles.filter(p => p.verificationStatus === VerificationStatus.VERIFIED).slice(0, 8);

    return (
        <div className="bg-white dark:bg-indigo-950">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 dark:from-indigo-950/20 pt-14">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Find <span className="text-indigo-600 dark:text-indigo-400">Verified Talent</span>. Land Your Dream Job.
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-indigo-200">
                            The premier platform in Kenya connecting top-tier, manually verified professionals with leading companies. No more guesswork, just qualified candidates.
                        </p>
                        <div className="mt-8 flex justify-center gap-4 flex-wrap">
                            <button 
                                onClick={() => onNavigate('signin', 'jobSeeker')}
                                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transform hover:scale-105 transition-transform"
                            >
                                I'm a Job Seeker
                            </button>
                            <button
                                onClick={() => onNavigate('signin', 'employer')}
                                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-indigo-200 dark:border-indigo-700 text-base font-medium rounded-md text-indigo-700 dark:text-white bg-white dark:bg-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-800 shadow-lg transform hover:scale-105 transition-transform"
                            >
                                I'm an Employer
                            </button>
                        </div>
                    </div>
                    <div className="mt-20 text-center">
                         <p className="text-sm font-semibold text-slate-500 dark:text-indigo-400 uppercase tracking-wider">Trusted by Kenya's leading companies</p>
                         <div className="mt-4 flex justify-center items-center gap-x-8 gap-y-4 flex-wrap opacity-60 dark:opacity-40">
                            {companies.map(name => <span key={name} className="font-medium text-slate-700 dark:text-indigo-300">{name}</span>)}
                         </div>
                    </div>
                </div>
            </div>
            
            {/* Stats Section */}
            <div className="py-16 sm:py-24 bg-white dark:bg-indigo-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                       <StatItem value="120+" label="Verified Candidates" icon="userGroup" />
                       <StatItem value="55+" label="Partner Companies" icon="buildingOffice" />
                       <StatItem value="95%" label="Profile Approval Rate" icon="shieldCheck" />
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-white dark:bg-indigo-900/50 py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">A Seamless Hiring Experience</h2>
                        <p className="mt-3 text-lg text-slate-500 dark:text-indigo-300">Built on trust, quality, and simplicity.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20">
                        {/* For Job Seekers */}
                        <div className="space-y-10">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white text-center">For Job Seekers</h3>
                            <div className="relative">
                                <div className="hidden sm:block absolute top-6 left-0 w-full h-px bg-slate-300 dark:bg-indigo-800" aria-hidden="true"></div>
                                <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-y-12 sm:gap-x-8">
                                    <HowItWorksStep step={1} title="Create Your Profile" description="Build a comprehensive professional profile that showcases your skills and experience."/>
                                    <HowItWorksStep step={2} title="Get Verified" description="Submit your documents for our team to review. We verify every detail for authenticity."/>
                                    <HowItWorksStep step={3} title="Get Discovered" description="Once verified, your profile becomes visible to top employers actively hiring in Kenya."/>
                                </div>
                            </div>
                        </div>
                         {/* For Employers */}
                         <div className="space-y-10">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white text-center">For Employers</h3>
                            <div className="relative">
                                <div className="hidden sm:block absolute top-6 left-0 w-full h-px bg-slate-300 dark:bg-indigo-800" aria-hidden="true"></div>
                                <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-y-12 sm:gap-x-8">
                                    <HowItWorksStep step={1} title="Choose a Plan" description="Sign up for a plan that suits your company's hiring needs."/>
                                    <HowItWorksStep step={2} title="Find Talent" description="Use our powerful search and filtering tools to find the perfect, pre-vetted candidates."/>
                                    <HowItWorksStep step={3} title="Hire with Confidence" description="Connect with and hire top-tier professionals, knowing their credentials are fully verified."/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Candidates Section */}
            <div className="bg-white dark:bg-indigo-950 py-16 sm:py-24">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Meet Our Top Talent</h2>
                         <p className="mt-3 text-lg text-slate-500 dark:text-indigo-300">A glimpse of the high-caliber professionals on our platform.</p>
                    </div>
                    <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4">
                        {featuredProfiles.map(profile => <FeaturedCandidateCard key={profile.id} profile={profile} />)}
                    </div>
                 </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-indigo-800 dark:bg-indigo-950 py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-white">Loved by Recruiters & Job Seekers</h2>
                         <p className="mt-3 text-lg text-indigo-200 dark:text-indigo-300">Don't just take our word for it. Here's what they say.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <TestimonialCard 
                            quote="VerifiedHire has revolutionized our hiring process. We save countless hours by accessing a pool of pre-vetted candidates. It's a game-changer for finding quality talent in Kenya."
                            name="Jane Doe"
                            role="HR Manager at KCB Group"
                            avatar="https://i.pravatar.cc/150?u=hr-jane"
                        />
                         <TestimonialCard 
                            quote="After getting my profile verified, I received three interview requests within a month. The platform helped me stand out and land a fantastic role at a top tech company."
                            name="David Otieno"
                            role="Senior Software Engineer"
                            avatar="https://i.pravatar.cc/150?u=dev-david"
                        />
                    </div>
                </div>
            </div>

             {/* Final CTA Section */}
            <div className="bg-white dark:bg-indigo-900/50">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Ready to Elevate Your Career or Team?</h2>
                    <p className="mt-4 max-w-xl mx-auto text-lg text-slate-600 dark:text-indigo-200">Join VerifiedHire today and connect with the best. Your next opportunity is just a click away.</p>
                    <div className="mt-8 flex justify-center gap-4 flex-wrap">
                        <button 
                            onClick={() => onNavigate('signup')}
                            className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transform hover:scale-105 transition-transform"
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};