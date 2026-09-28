import React, { useState } from 'react';
import { Icon } from './Icon';
import { useAppContext } from './AppContext';
import { UserRole } from '../types';

interface JobBoardProps {
    onViewJob: (jobId: string) => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({ onViewJob }) => {
    const { jobs, applications, getLoggedInSeeker, currentUserRole, loginUser } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All');

    const isAdmin = currentUserRole === UserRole.Admin;
    const isGuest = currentUserRole === null || currentUserRole === undefined;

    const categories = ['All', ...Array.from(new Set(jobs.map(j => j.category)))];
    const types = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'];

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
        const matchesType = selectedType === 'All' || job.type === selectedType;
        return matchesSearch && matchesCategory && matchesType;
    });

    const seeker = currentUserRole === UserRole.JobSeeker ? getLoggedInSeeker() : null;
    const seekerApplications = seeker ? applications.filter(a => a.jobSeekerId === seeker.id) : [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {isGuest && (
                <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 text-white rounded-xl flex-shrink-0">
                            <Icon name="globeAlt" className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                Public Job Directory &bull; Guest Visitor Mode
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                                You can browse and inspect all verified job postings freely. To apply for any position, you must sign in with a verified Job Seeker account.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    const nextUrl = new URL(window.location.href);
                                    nextUrl.searchParams.set('page', 'signin');
                                    window.history.pushState({ page: 'signin' }, '', nextUrl);
                                    window.dispatchEvent(new PopStateEvent('popstate'));
                                }
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <Icon name="login" className="h-3.5 w-3.5" />
                            <span>Sign In to Apply</span>
                        </button>
                        <button
                            onClick={() => loginUser('usr_00001', UserRole.JobSeeker)}
                            className="px-3.5 py-2 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Instant login with test persona Amani Wanjiku"
                        >
                            <Icon name="sparkles" className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>1-Click Test Seeker</span>
                        </button>
                    </div>
                </div>
            )}

            {isAdmin && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 font-bold">
                    <div className="flex items-center gap-2">
                        <Icon name="shieldCheck" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span>Super Admin Mode: You have full authority to view, edit, or delete any requisition across all platform employers.</span>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow relative">
                        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search jobs by title, company, or keywords..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select 
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                        >
                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredJobs.length > 0 ? filteredJobs.map(job => {
                    const hasApplied = seekerApplications.some(a => a.jobId === job.id && !a.interestedOnly);
                    const isInterested = seekerApplications.some(a => a.jobId === job.id && a.interestedOnly);
                    
                    return (
                        <div 
                            key={job.id} 
                            onClick={() => onViewJob(job.id)}
                            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200/80 dark:border-slate-700 overflow-hidden flex-shrink-0">
                                        {job.companyLogo ? (
                                            <img src={job.companyLogo} alt={job.companyName} className="h-10 w-10 object-contain" referrerPolicy="no-referrer" />
                                        ) : (
                                            <Icon name="buildingOffice" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center"><Icon name="buildingOffice" className="h-4 w-4 mr-1.5" /> {job.companyName}</span>
                                            <span className="flex items-center"><Icon name="location" className="h-4 w-4 mr-1.5" /> {job.location}</span>
                                            <span className="flex items-center font-bold text-indigo-600 dark:text-indigo-400">{job.salaryRange}</span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-200 dark:border-indigo-800/60">{job.type}</span>
                                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">{job.category}</span>
                                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">{job.experienceLevel} Level</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col justify-between items-end gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">Posted {new Date(job.postedAt).toLocaleDateString()}</p>
                                        <p className="text-xs font-bold text-rose-500 mt-1">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {isInterested && <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold rounded-lg flex items-center"><Icon name="star" className="h-3 w-3 mr-1" /> Interested</span>}
                                        {hasApplied && <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 text-xs font-bold rounded-lg flex items-center"><Icon name="check" className="h-3 w-3 mr-1" /> Applied</span>}
                                        <button className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <Icon name="search" className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                        <p className="text-xl font-bold text-slate-900 dark:text-white">No jobs match your search</p>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
