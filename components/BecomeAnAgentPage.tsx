import React, { useState } from 'react';
import { Icon, IconName } from './Icon';

interface BecomeAnAgentPageProps {
    onNavigate: (view: string, role?: 'jobSeeker' | 'employer') => void;
}

const FeatureCard: React.FC<{ icon: IconName; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-indigo-900/30 rounded-2xl border border-slate-100 dark:border-indigo-800/50 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
            <Icon name={icon} className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-indigo-300">{description}</p>
    </div>
);

const CategoryCard: React.FC<{ icon: IconName; title: string; professionals: string }> = ({ icon, title, professionals }) => (
    <div className="flex items-center p-4 bg-slate-50 dark:bg-indigo-900/50 rounded-xl border border-slate-200 dark:border-indigo-800">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm">
            <Icon name={icon} className="h-6 w-6" />
        </div>
        <div className="ml-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
            <p className="text-xs text-slate-500 dark:text-indigo-300">{professionals}</p>
        </div>
    </div>
);

const HowItWorksStep: React.FC<{ title: string; description: string; step: number }> = ({ title, description, step }) => (
    <div className="relative flex flex-col items-center text-center">
        <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white shadow-lg ring-8 ring-white dark:ring-indigo-950">
           {step}
        </div>
        <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-indigo-300">{description}</p>
    </div>
);

const AgentApplicationForm: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        expertise: '',
        experience: '',
        linkedin: '',
        motivation: ''
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    return (
        <div className="mt-20 max-w-2xl mx-auto bg-white dark:bg-indigo-900/50 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-indigo-800">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Application</h3>
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Step {step} of 3</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-indigo-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>
            </div>

            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-indigo-200 mb-1">Full Name</label>
                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-indigo-700 bg-white dark:bg-indigo-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-indigo-200 mb-1">Email Address</label>
                        <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-indigo-700 bg-white dark:bg-indigo-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john@example.com" />
                    </div>
                    <button onClick={handleNext} className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Continue</button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-indigo-200 mb-1">Primary Area of Expertise</label>
                        <select className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-indigo-700 bg-white dark:bg-indigo-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option>Aviation (Pilots & Crew)</option>
                            <option>Software Engineering</option>
                            <option>Mechanical/Civil Engineering</option>
                            <option>Finance & Accounting</option>
                            <option>Healthcare & Medical</option>
                            <option>Legal Services</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-indigo-200 mb-1">Years of Professional Experience</label>
                        <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-indigo-700 bg-white dark:bg-indigo-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 10" />
                    </div>
                    <div className="flex space-x-4 mt-6">
                        <button onClick={handleBack} className="flex-1 px-4 py-3 border border-slate-300 dark:border-indigo-700 text-slate-700 dark:text-indigo-200 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-indigo-800 transition-colors">Back</button>
                        <button onClick={handleNext} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Continue</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-indigo-200 mb-1">LinkedIn Profile URL</label>
                        <input type="url" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-indigo-700 bg-white dark:bg-indigo-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://linkedin.com/in/johndoe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-indigo-200 mb-1">Why do you want to be a Verification Agent?</label>
                        <textarea className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-indigo-700 bg-white dark:bg-indigo-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none h-32" placeholder="Tell us about your passion for quality and verification..."></textarea>
                    </div>
                    <div className="flex space-x-4 mt-6">
                        <button onClick={handleBack} className="flex-1 px-4 py-3 border border-slate-300 dark:border-indigo-700 text-slate-700 dark:text-indigo-200 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-indigo-800 transition-colors">Back</button>
                        <button onClick={() => alert('Application submitted!')} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20">Submit Application</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const BecomeAnAgentPage: React.FC<BecomeAnAgentPageProps> = ({ onNavigate }) => {
    return (
        <div className="bg-white dark:bg-indigo-950">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 dark:from-indigo-950/20 pt-14">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium leading-6 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-600/10 dark:ring-indigo-400/20 mb-6">
                            Join the Elite Verification Team
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Verify the World's <br/> <span className="text-indigo-600 dark:text-indigo-400">Top Talent.</span>
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-indigo-200">
                            Apply to become a Verification Agent. Use your industry expertise to validate skills for pilots, engineers, developers, and more. Help build the most trusted talent pool in the region.
                        </p>
                        <div className="mt-10 flex justify-center space-x-4">
                            <button 
                                onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transform hover:scale-105 transition-transform"
                            >
                                <Icon name="userPlus" className="h-5 w-5 mr-2" />
                                Apply Now
                            </button>
                            <button 
                                onClick={() => onNavigate('about')}
                                className="inline-flex items-center justify-center px-8 py-3.5 border border-slate-300 dark:border-indigo-700 text-base font-medium rounded-md text-slate-700 dark:text-indigo-200 bg-white dark:bg-indigo-900 hover:bg-slate-50 dark:hover:bg-indigo-800 shadow-sm transition-colors"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Categories */}
            <div className="py-16 bg-slate-50 dark:bg-indigo-900/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Verification Categories</h2>
                        <p className="mt-4 text-slate-600 dark:text-indigo-300">We are looking for experts in these high-demand fields.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <CategoryCard icon="academicCap" title="Aviation" professionals="Pilots, Engineers, Crew" />
                        <CategoryCard icon="computerDesktop" title="Software" professionals="Devs, Architects, QA" />
                        <CategoryCard icon="buildingOffice" title="Engineering" professionals="Civil, Mech, Electrical" />
                        <CategoryCard icon="dollarSign" title="Finance & Banking" professionals="Bankers, Analysts, Backers" />
                        <CategoryCard icon="scale" title="Professional" professionals="Legal, HR, Management" />
                    </div>
                </div>
            </div>

            {/* Why Become an Agent Section */}
            <div className="py-16 sm:py-24 bg-white dark:bg-indigo-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why become an Agent?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                       <FeatureCard icon="dollarSign" title="Earn per Verification" description="Get paid for every profile you successfully verify. Set your own pace and workload." />
                       <FeatureCard icon="star" title="Build Reputation" description="Earn badges and increase your agent tier as you provide high-quality verifications." />
                       <FeatureCard icon="globeAlt" title="Network Globally" description="Connect with top professionals and industry leaders across various sectors." />
                    </div>
                </div>
            </div>
            
             {/* How It Works Section */}
            <div className="bg-white dark:bg-indigo-900/50 py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">The Verification Process</h2>
                    </div>
                    <div className="relative">
                        <div className="hidden sm:block absolute top-6 left-0 w-full h-px bg-slate-300 dark:bg-indigo-800" aria-hidden="true"></div>
                        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-y-12 sm:gap-x-8 max-w-3xl mx-auto">
                            <HowItWorksStep step={1} title="Review Documents" description="Examine licenses, certifications, and work history submitted by candidates."/>
                            <HowItWorksStep step={2} title="Conduct Interview" description="Perform a brief technical interview to validate the candidate's practical skills."/>
                            <HowItWorksStep step={3} title="Issue Verification" description="Submit your final report and grant the 'Verified' badge to deserving talent."/>
                        </div>
                    </div>
                </div>
            </div>


            {/* Application Form Section */}
             <div id="application-form" className="bg-white dark:bg-indigo-950 py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Start your journey</h2>
                        <p className="mt-4 text-slate-600 dark:text-indigo-300">Fill out the form below and our team will review your application within 48 hours.</p>
                    </div>
                     <AgentApplicationForm />
                </div>
            </div>

             {/* Final CTA Section */}
            <div className="bg-indigo-700">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Help us build the future of hiring.</h2>
                    <p className="mt-4 text-indigo-100 max-w-xl mx-auto">Join a community of experts dedicated to quality and integrity in the workforce.</p>
                    <div className="mt-8 flex justify-center">
                         <button 
                            onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 shadow-lg transform hover:scale-105 transition-transform"
                        >
                            <Icon name="userPlus" className="h-5 w-5 mr-2" />
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
