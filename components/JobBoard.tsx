
import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { Job, UserRole } from '../types';
import { Icon } from './Icon';

interface JobBoardProps {
    onViewJob: (jobId: string) => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({ onViewJob }) => {
    const { jobs, applications, getLoggedInSeeker } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedType, setSelectedType] = useState<string>('All');
    
    const categories = useMemo(() => ['All', ...Array.from(new Set(jobs.map(j => j.category)))], [jobs]);
    const types = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

    const filteredJobs = useMemo(() => {
        return jobs.filter(j => {
            const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                j.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                j.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || j.category === selectedCategory;
            const matchesType = selectedType === 'All' || j.type === selectedType;
            return matchesSearch && matchesCategory && matchesType && j.status === 'Open';
        });
    }, [jobs, searchTerm, selectedCategory, selectedType]);

    const seeker = getLoggedInSeeker();
    const seekerApplications = applications.filter(a => a.jobSeekerId === seeker.id);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-indigo-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-indigo-800">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow relative">
                        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search jobs by title, company, or keywords..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-indigo-950 border border-slate-200 dark:border-indigo-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 bg-slate-50 dark:bg-indigo-950 border border-slate-200 dark:border-indigo-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select 
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-3 bg-slate-50 dark:bg-indigo-950 border border-slate-200 dark:border-indigo-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
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
                            className="bg-white dark:bg-indigo-900 p-6 rounded-3xl border border-slate-100 dark:border-indigo-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-indigo-950 flex items-center justify-center border border-slate-100 dark:border-indigo-800 overflow-hidden">
                                        {job.companyLogo ? (
                                            <img src={job.companyLogo} alt={job.companyName} className="h-10 w-10 object-contain" referrerPolicy="no-referrer" />
                                        ) : (
                                            <Icon name="buildingOffice" className="h-8 w-8 text-indigo-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-slate-500 dark:text-indigo-300">
                                            <span className="flex items-center"><Icon name="buildingOffice" className="h-4 w-4 mr-1.5" /> {job.companyName}</span>
                                            <span className="flex items-center"><Icon name="location" className="h-4 w-4 mr-1.5" /> {job.location}</span>
                                            <span className="flex items-center font-bold text-indigo-600 dark:text-indigo-400">{job.salaryRange}</span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-800">{job.type}</span>
                                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-100 dark:border-indigo-800">{job.category}</span>
                                            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-100 dark:border-indigo-800">{job.experienceLevel} Level</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col justify-between items-end gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">Posted {new Date(job.postedAt).toLocaleDateString()}</p>
                                        <p className="text-xs font-bold text-rose-500 mt-1">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {isInterested && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg flex items-center"><Icon name="star" className="h-3 w-3 mr-1" /> Interested</span>}
                                        {hasApplied && <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg flex items-center"><Icon name="check" className="h-3 w-3 mr-1" /> Applied</span>}
                                        <button className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-20 bg-white dark:bg-indigo-900 rounded-3xl border border-slate-100 dark:border-indigo-800 shadow-sm">
                        <Icon name="search" className="mx-auto h-16 w-16 text-slate-200 dark:text-indigo-800 mb-4" />
                        <p className="text-xl font-bold text-slate-900 dark:text-white">No jobs match your search</p>
                        <p className="text-slate-500 dark:text-indigo-300 mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
