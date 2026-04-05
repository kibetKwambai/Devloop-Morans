
import React, { useState, useMemo } from 'react';
import { JobSeekerProfile, VerificationStatus, Job, Application, Notification } from '../types';
import { useAppContext } from './AppContext';
import { Icon, IconName } from './Icon';
import { CandidateCard } from './CandidateCard';

interface EmployerDashboardProps {
    onViewProfile: (profileId: string) => void;
}

const StatCard: React.FC<{ icon: IconName; value: string; label: string; color: string }> = ({ icon, value, label, color }) => (
    <div className="bg-white dark:bg-indigo-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-indigo-800 flex items-center transition-all hover:shadow-md">
        <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${color} flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
            <Icon name={icon} className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-indigo-300 uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onViewProfile }) => {
    const { profiles, jobs, applications, notifications, updateApplicationStatus, markNotificationAsRead, postJob, deleteJob } = useAppContext();
    const [activeTab, setActiveTab] = useState<'search' | 'jobs' | 'applications' | 'notifications'>('search');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>('All');
    const [showShortlisted, setShowShortlisted] = useState(false);
    const [isPostingJob, setIsPostingJob] = useState(false);
    
    // Employer ID for mock purposes (let's say 'emp_001')
    const employerId = 'emp_001';

    const employerJobs = useMemo(() => jobs.filter(j => j.employerId === employerId), [jobs]);
    const employerApplications = useMemo(() => {
        const jobIds = employerJobs.map(j => j.id);
        return applications.filter(a => jobIds.includes(a.jobId));
    }, [applications, employerJobs]);
    const employerNotifications = useMemo(() => notifications.filter(n => n.userId === employerId), [notifications]);

    const allSkills = useMemo(() => {
        const skillSet = new Set<string>();
        profiles
            .filter(p => p.verificationStatus === VerificationStatus.VERIFIED || p.verificationStatus === VerificationStatus.AUTHENTICATED)
            .forEach(p => p.skills.forEach(s => skillSet.add(s.name)));
        return Array.from(skillSet).sort();
    }, [profiles]);

    const allLocations = useMemo(() => {
        const locSet = new Set<string>(['All']);
        profiles.forEach(p => locSet.add(p.location));
        return Array.from(locSet).sort();
    }, [profiles]);

    const handleSkillToggle = (skillName: string) => {
        setSelectedSkills(prev =>
            prev.includes(skillName)
                ? prev.filter(s => s !== skillName)
                : [...prev, skillName]
        );
    };

    const filteredProfiles = useMemo(() => {
        return profiles
            .filter(p => p.verificationStatus === VerificationStatus.VERIFIED || p.verificationStatus === VerificationStatus.AUTHENTICATED)
            .filter(p => !showShortlisted || p.isShortlisted)
            .filter(p => selectedLocation === 'All' || p.location === selectedLocation)
            .filter(p => {
                const lowerSearchTerm = searchTerm.toLowerCase();
                const matchesSearch =
                    p.name.toLowerCase().includes(lowerSearchTerm) ||
                    p.headline.toLowerCase().includes(lowerSearchTerm) ||
                    p.workExperience.some(exp => exp.title.toLowerCase().includes(lowerSearchTerm));

                const matchesSkills =
                    selectedSkills.length === 0 ||
                    selectedSkills.every(skill =>
                        p.skills.some(s => s.name === skill)
                    );
                
                return matchesSearch && matchesSkills;
            });
    }, [profiles, searchTerm, selectedSkills, showShortlisted, selectedLocation]);

    const handlePostJob = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const newJob: Omit<Job, 'id' | 'postedAt'> = {
            employerId,
            companyName: 'VerifiedHire Corp', // Mock company name
            companyLogo: 'https://i.pravatar.cc/150?u=verifiedhire',
            title: formData.get('title') as string,
            location: formData.get('location') as string,
            type: formData.get('type') as Job['type'],
            salaryRange: formData.get('salaryRange') as string,
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            requirements: (formData.get('requirements') as string).split('\n').filter(r => r.trim()),
            responsibilities: (formData.get('responsibilities') as string).split('\n').filter(r => r.trim()),
            benefits: ['Health Insurance', 'Retirement Plan', 'Paid Time Off'], // Default benefits
            termsAndConditions: 'Standard VerifiedHire employment terms apply.',
            legalRights: 'All rights reserved under Kenyan labor laws.',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            experienceLevel: 'Mid',
            status: 'Open'
        };

        postJob(newJob);
        setIsPostingJob(false);
    };

    return (
        <div className="space-y-8">
            {isPostingJob && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-indigo-950 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-indigo-900 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Post a New Job</h2>
                            <button onClick={() => setIsPostingJob(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-indigo-900 rounded-full transition-colors">
                                <Icon name="close" className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handlePostJob} className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-indigo-200 mb-2">Job Title</label>
                                    <input name="title" required placeholder="e.g. Senior Software Engineer" className="w-full px-4 py-2 border border-slate-200 dark:border-indigo-800 rounded-xl bg-slate-50 dark:bg-indigo-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-indigo-200 mb-2">Location</label>
                                    <input name="location" required placeholder="e.g. Nairobi, Kenya" className="w-full px-4 py-2 border border-slate-200 dark:border-indigo-800 rounded-xl bg-slate-50 dark:bg-indigo-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-indigo-200 mb-2">Job Type</label>
                                    <select name="type" className="w-full px-4 py-2 border border-slate-200 dark:border-indigo-800 rounded-xl bg-slate-50 dark:bg-indigo-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-indigo-200 mb-2">Salary Range</label>
                                    <input name="salaryRange" required placeholder="e.g. KES 150k - 250k" className="w-full px-4 py-2 border border-slate-200 dark:border-indigo-800 rounded-xl bg-slate-50 dark:bg-indigo-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-indigo-200 mb-2">Category</label>
                                    <input name="category" required placeholder="e.g. Technology" className="w-full px-4 py-2 border border-slate-200 dark:border-indigo-800 rounded-xl bg-slate-50 dark:bg-indigo-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-indigo-200 mb-2">Job Description</label>
                                <textarea name="description" required rows={4} placeholder="Describe the role and your company..." className="w-full px-4 py-2 border border-slate-200 dark:border-indigo-800 rounded-xl bg-slate-50 dark:bg-indigo-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-indigo-200 mb-2">Requirements (One per line)</label>
                                <textarea name="requirements" required rows={4} placeholder="e.g. 5+ years of React experience..." className="w-full px-4 py-2 border border-slate-200 dark:border-indigo-800 rounded-xl bg-slate-50 dark:bg-indigo-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-indigo-200 mb-2">Responsibilities (One per line)</label>
                                <textarea name="responsibilities" required rows={4} placeholder="e.g. Lead the frontend development team..." className="w-full px-4 py-2 border border-slate-200 dark:border-indigo-800 rounded-xl bg-slate-50 dark:bg-indigo-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsPostingJob(false)} className="flex-1 py-3 border-2 border-slate-200 dark:border-indigo-800 text-slate-700 dark:text-indigo-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-indigo-900 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">
                                    Post Job Listing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon="briefcase" value={String(employerJobs.length)} label="Active Jobs" color="bg-indigo-600" />
                <StatCard icon="userGroup" value={String(employerApplications.length)} label="Total Applications" color="bg-emerald-600" />
                <StatCard icon="star" value={String(employerApplications.filter(a => a.status === 'Shortlisted').length)} label="Shortlisted" color="bg-amber-600" />
                <StatCard icon="bell" value={String(employerNotifications.filter(n => !n.isRead).length)} label="New Alerts" color="bg-rose-600" />
            </div>

            <div className="flex border-b border-slate-200 dark:border-indigo-800">
                <button 
                    onClick={() => setActiveTab('search')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'search' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-indigo-300 hover:text-slate-700 dark:hover:text-white'}`}
                >
                    Candidate Search
                </button>
                <button 
                    onClick={() => setActiveTab('jobs')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'jobs' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-indigo-300 hover:text-slate-700 dark:hover:text-white'}`}
                >
                    My Job Postings
                </button>
                <button 
                    onClick={() => setActiveTab('applications')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'applications' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-indigo-300 hover:text-slate-700 dark:hover:text-white'}`}
                >
                    Applications
                </button>
                <button 
                    onClick={() => setActiveTab('notifications')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'notifications' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-indigo-300 hover:text-slate-700 dark:hover:text-white'}`}
                >
                    Notifications
                </button>
            </div>

            {activeTab === 'search' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-indigo-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-indigo-800 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, headline, or role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 dark:bg-indigo-800 dark:text-white dark:border-indigo-700 text-slate-900"
                                />
                            </div>
                            <div className="relative">
                                <Icon name="location" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 dark:bg-indigo-800 dark:text-white dark:border-indigo-700 text-slate-900"
                                >
                                    {allLocations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-600 dark:text-indigo-200 mb-3 uppercase tracking-wider">Filter by skills:</h4>
                            <div className="flex flex-wrap gap-2">
                                {allSkills.map(skill => (
                                    <button
                                        key={skill}
                                        onClick={() => handleSkillToggle(skill)}
                                        className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${
                                            selectedSkills.includes(skill)
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                                                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800 dark:hover:bg-indigo-800'
                                        }`}
                                    >
                                    {skill}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end items-center pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <span className="mr-3 text-sm font-bold text-slate-700 dark:text-indigo-200 group-hover:text-indigo-600 transition-colors">Show Shortlisted Only</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={showShortlisted}
                                        onChange={() => setShowShortlisted(!showShortlisted)}
                                    />
                                    <div className={`block w-12 h-6 rounded-full transition-colors ${showShortlisted ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-indigo-800'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showShortlisted ? 'translate-x-6' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                            Showing {filteredProfiles.length} Verified Candidate{filteredProfiles.length !== 1 && 's'}
                        </h3>
                        {filteredProfiles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProfiles.map(profile => (
                                <CandidateCard key={profile.id} profile={profile} onViewProfile={onViewProfile} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-indigo-900 rounded-3xl border border-slate-100 dark:border-indigo-800 shadow-sm">
                                <Icon name="userGroup" className="mx-auto h-16 w-16 text-slate-200 dark:text-indigo-800 mb-4" />
                                <p className="text-xl font-bold text-slate-900 dark:text-white">No candidates found</p>
                                <p className="text-slate-500 dark:text-indigo-300 mt-2">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'jobs' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Job Postings</h3>
                        <button 
                            onClick={() => setIsPostingJob(true)}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center"
                        >
                            <Icon name="plus" className="h-5 w-5 mr-2" />
                            Post New Job
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {employerJobs.length > 0 ? employerJobs.map(job => (
                            <div key={job.id} className="bg-white dark:bg-indigo-900 p-6 rounded-2xl border border-slate-100 dark:border-indigo-800 flex items-center justify-between hover:shadow-md transition-all">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-800 flex items-center justify-center border border-indigo-100 dark:border-indigo-700">
                                        <Icon name="briefcase" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-indigo-300">{job.location} • {job.type} • {job.salaryRange}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">{applications.filter(a => a.jobId === job.id && a.interestedOnly).length}</p>
                                        <p className="text-[10px] uppercase font-bold text-amber-500 tracking-widest">Interested</p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-100 dark:bg-indigo-800"></div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">{applications.filter(a => a.jobId === job.id && !a.interestedOnly).length}</p>
                                        <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest">Applied</p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-100 dark:bg-indigo-800"></div>
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                        <Icon name="edit" className="h-5 w-5" />
                                    </button>
                                    <button 
                                        onClick={() => deleteJob(job.id)}
                                        className="p-2 text-slate-400 hover:text-rose-600"
                                    >
                                        <Icon name="trash" className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-white dark:bg-indigo-900 rounded-3xl border border-slate-100 dark:border-indigo-800 shadow-sm">
                                <Icon name="briefcase" className="mx-auto h-16 w-16 text-slate-200 dark:text-indigo-800 mb-4" />
                                <p className="text-xl font-bold text-slate-900 dark:text-white">No job postings yet</p>
                                <p className="text-slate-500 dark:text-indigo-300 mt-2">Click "Post New Job" to start hiring.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Applications</h3>
                    <div className="space-y-4">
                        {employerApplications.map(app => {
                            const candidate = profiles.find(p => p.id === app.jobSeekerId);
                            const job = jobs.find(j => j.id === app.jobId);
                            if (!candidate || !job) return null;
                            return (
                                <div key={app.id} className="bg-white dark:bg-indigo-900 p-6 rounded-2xl border border-slate-100 dark:border-indigo-800 flex items-center justify-between hover:shadow-md transition-all">
                                    <div className="flex items-center">
                                        <img src={candidate.photoUrl} alt={candidate.name} className="h-12 w-12 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-800" />
                                        <div className="ml-4">
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{candidate.name}</h4>
                                            <p className="text-sm text-slate-500 dark:text-indigo-300">
                                                {app.interestedOnly ? 'Interested in' : 'Applied for'} <span className="font-bold text-indigo-600 dark:text-indigo-400">{job.title}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {app.interestedOnly && (
                                            <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                Interested Only
                                            </span>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            app.status === 'Shortlisted' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            app.status === 'Offered' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                            app.status === 'Accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            app.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                            {app.status}
                                        </span>
                                        <button 
                                            onClick={() => onViewProfile(candidate.id)}
                                            className="px-4 py-2 bg-slate-100 dark:bg-indigo-800 text-slate-700 dark:text-indigo-200 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-indigo-700 transition-all"
                                        >
                                            View Profile
                                        </button>
                                        <div className="flex space-x-1">
                                            <button 
                                                onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                                                className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg"
                                                title="Shortlist"
                                            >
                                                <Icon name="star" className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => updateApplicationStatus(app.id, 'Offered')}
                                                className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                                                title="Send Offer"
                                            >
                                                <Icon name="sparkles" className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                title="Reject"
                                            >
                                                <Icon name="close" className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                    <div className="space-y-4">
                        {employerNotifications.map(notif => (
                            <div 
                                key={notif.id} 
                                className={`p-6 rounded-2xl border transition-all ${notif.isRead ? 'bg-white dark:bg-indigo-900 border-slate-100 dark:border-indigo-800' : 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-700 shadow-sm'}`}
                                onClick={() => markNotificationAsRead(notif.id)}
                            >
                                <div className="flex items-start">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        notif.type === 'Application' ? 'bg-blue-100 text-blue-600' :
                                        notif.type === 'StatusChange' ? 'bg-amber-100 text-amber-600' :
                                        'bg-indigo-100 text-indigo-600'
                                    }`}>
                                        <Icon name={notif.type === 'Application' ? 'briefcase' : 'bell'} className="h-5 w-5" />
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                                            <span className="text-xs text-slate-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-indigo-200 mt-1">{notif.message}</p>
                                        {notif.link && (
                                            <button className="mt-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                                                View Details
                                            </button>
                                        )}
                                    </div>
                                    {!notif.isRead && <div className="h-2 w-2 bg-indigo-600 rounded-full ml-4 mt-2"></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
