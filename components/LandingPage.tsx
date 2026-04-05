

import React from 'react';
import { Icon, IconName } from './Icon';
import { JobSeekerProfile, VerificationStatus } from '../types';
import { mockProfiles } from '../services/mockData';

interface LandingPageProps {
    onNavigate: (view: string, role?: 'jobSeeker' | 'employer') => void;
}

const companies = ['Safaricom PLC', 'Kenya Airways', 'KCB Group', 'Equity Bank', 'Andela', 'Twiga Foods', 'Cellulant'];

const StatItem: React.FC<{ value: string, label: string, icon: IconName }> = ({ value, label, icon }) => (
    <div className="flex flex-col items-center text-center">
        <Icon name={icon} className="h-10 w-10 text-indigo-500 dark:text-indigo-400 mb-2"/>
        <p className="text-4xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="mt-1 text-slate-500 dark:text-indigo-300">{label}</p>
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

const FeatureSection: React.FC<{ title: string, description: string, icon: IconName, children?: React.ReactNode }> = ({ title, description, icon, children }) => (
    <div className="py-12 border-b border-slate-100 dark:border-indigo-900/50 last:border-0">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-500/20 p-4 rounded-2xl">
                <Icon name={icon} className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-lg text-slate-600 dark:text-indigo-200 leading-relaxed max-w-3xl">{description}</p>
                {children && <div className="mt-6">{children}</div>}
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

            {/* Detailed Content Sections - Unhinged God Mode */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-5xl mx-auto">
                    <FeatureSection 
                        icon="shieldCheck"
                        title="1. Rigorous Manual Verification"
                        description="Every single profile on VerifiedHire undergoes a multi-stage manual verification process. Our dedicated agents cross-reference work history, contact previous employers, and validate educational credentials directly with institutions. This ensures that when you see a 'Verified' badge, it truly means something."
                    />
                    <FeatureSection 
                        icon="userGroup"
                        title="2. Specialized Talent Pools"
                        description="We don't just list generic jobs. We have specialized verticals for Aviation (Pilots, Engineers, Cabin Crew), Technology (Software Devs, Data Scientists, AI Experts), Healthcare, and Legal professionals. Each vertical is managed by agents with industry-specific expertise."
                    />
                    <FeatureSection 
                        icon="sparkles"
                        title="3. AI-Enhanced Profile Summaries"
                        description="Leveraging the power of Google's Gemini AI, we provide job seekers with professional, concise summaries of their verified skills and experience. This helps employers quickly grasp a candidate's value proposition without sifting through pages of text."
                    />
                    <FeatureSection 
                        icon="lockClosed"
                        title="4. Uncompromising Data Security"
                        description="Your personal and professional data is protected by industry-leading encryption and security protocols. We adhere strictly to the Data Protection Act of Kenya and international GDPR standards, ensuring your privacy is never compromised."
                    />
                    <FeatureSection 
                        icon="briefcase"
                        title="5. Real-Time Job Matching"
                        description="Our intelligent matching algorithm connects verified candidates with roles that perfectly align with their skills, location preferences, and career aspirations. No more irrelevant job alerts; only opportunities that matter."
                    />
                    <FeatureSection 
                        icon="academicCap"
                        title="6. Continuous Professional Development"
                        description="VerifiedHire isn't just a job board; it's a career growth partner. We offer resources, webinars, and certification verification services to help you stay ahead in your field and continuously enhance your professional standing."
                    />
                    <FeatureSection 
                        icon="globeAlt"
                        title="7. Global Standards, Local Expertise"
                        description="While we operate on a global technological scale, our roots are firmly in Kenya. We understand the local job market dynamics, cultural nuances, and specific industry requirements that make hiring in Kenya unique."
                    />
                    <FeatureSection 
                        icon="scale"
                        title="8. Ethical Hiring Practices"
                        description="We promote fair and unbiased hiring. By focusing on verified skills and experience, we help eliminate unconscious bias in the recruitment process, ensuring that the best talent gets the best opportunities."
                    />
                    <FeatureSection 
                        icon="documentDuplicate"
                        title="9. Comprehensive Document Management"
                        description="Securely store and manage all your professional documents—CVs, certificates, police clearances, and more—in one centralized location. Share them with potential employers with a single click."
                    />
                    <FeatureSection 
                        icon="phone"
                        title="10. Dedicated Agent Support"
                        description="Our network of verification agents is always available to assist both job seekers and employers. Whether you need help with the verification process or finding the right candidate, our human-centric support is here for you."
                    />
                    <FeatureSection 
                        icon="star"
                        title="11. Candidate Shortlisting & Management"
                        description="Employers can easily shortlist candidates, add private notes, and manage their hiring pipeline through our intuitive dashboard. Streamline your recruitment workflow from initial discovery to final hire."
                    />
                    <FeatureSection 
                        icon="arrowTrendingUp"
                        title="12. Market Insights & Analytics"
                        description="Access real-time data on hiring trends, salary benchmarks, and skill demand in Kenya. Make informed decisions whether you're looking for your next hire or your next career move."
                    />
                    <FeatureSection 
                        icon="buildingOffice"
                        title="13. Employer Branding Solutions"
                        description="Showcase your company culture and values to attract top-tier talent. Our employer profiles allow you to tell your story and stand out as an employer of choice in a competitive market."
                    />
                    <FeatureSection 
                        icon="checkCircle"
                        title="14. Verified Work Experience Indicators"
                        description="We don't just verify the profile; we verify individual work experiences. Each entry in a candidate's history can be individually validated, providing an unprecedented level of granular trust."
                    />
                    <FeatureSection 
                        icon="mail"
                        title="15. Seamless Communication"
                        description="Our integrated messaging system allows for secure and direct communication between employers and candidates. Schedule interviews, ask follow-up questions, and manage offers all within the platform."
                    />
                    <FeatureSection 
                        icon="cog"
                        title="16. Customizable Search Filters"
                        description="Find exactly who you're looking for with advanced filters for location, specific hard and soft skills, verification status, and industry-specific certifications."
                    />
                    <FeatureSection 
                        icon="computerDesktop"
                        title="17. Mobile-First Responsive Design"
                        description="Access VerifiedHire anytime, anywhere. Our platform is fully optimized for mobile devices, ensuring a smooth experience whether you're on a desktop at the office or on your phone on the go."
                    />
                    <FeatureSection 
                        icon="serverStack"
                        title="18. Scalable Infrastructure"
                        description="Built on robust cloud technology, VerifiedHire is designed to scale with your needs. Whether you're a small startup or a large multinational, our platform handles your hiring volume with ease."
                    />
                    <FeatureSection 
                        icon="circleStack"
                        title="19. Transparent Pricing Models"
                        description="We believe in clear and honest pricing. Choose from a range of plans designed for different hiring volumes and budgets, with no hidden fees or complicated contracts."
                    />
                    <FeatureSection 
                        icon="login"
                        title="20. Join a Community of Excellence"
                        description="By joining VerifiedHire, you're becoming part of an elite community of professionals and companies committed to quality, integrity, and the future of work in Kenya."
                    />
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 sm:py-24 bg-slate-50 dark:bg-indigo-900/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                       <StatItem value="1,200+" label="Verified Candidates" icon="userGroup" />
                       <StatItem value="250+" label="Partner Companies" icon="buildingOffice" />
                       <StatItem value="99.9%" label="Verification Accuracy" icon="shieldCheck" />
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
                    <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 scrollbar-hide">
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
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Ready to Elevate Your Career or Team?</h2>
                    <p className="mt-4 max-w-xl mx-auto text-xl text-slate-600 dark:text-indigo-200">Join VerifiedHire today and connect with the best. Your next opportunity is just a click away.</p>
                    <div className="mt-10 flex justify-center gap-6 flex-wrap">
                        <button 
                            onClick={() => onNavigate('signup')}
                            className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xl transform hover:scale-105 transition-all"
                        >
                            Get Started Now
                        </button>
                        <button 
                            onClick={() => onNavigate('contact')}
                            className="inline-flex items-center justify-center px-10 py-4 border-2 border-indigo-600 text-lg font-bold rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
