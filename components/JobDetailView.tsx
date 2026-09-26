
import React, { useState } from 'react';
import { Job, UserRole } from '../types';
import { useAppContext } from './AppContext';
import { Icon } from './Icon';

interface JobDetailViewProps {
    job: Job;
    onBack: () => void;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({ job, onBack }) => {
    const { applyToJob, applications, getLoggedInSeeker, sendMessage, currentUserRole, deleteJob, updateJob, currentUserId } = useAppContext();
    const [isApplying, setIsApplying] = useState(false);
    const [isMessaging, setIsMessaging] = useState(false);
    const [isEditingJob, setIsEditingJob] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Job edit form state
    const [editTitle, setEditTitle] = useState(job.title);
    const [editCompany, setEditCompany] = useState(job.companyName);
    const [editLocation, setEditLocation] = useState(job.location);
    const [editSalary, setEditSalary] = useState(job.salaryRange);
    const [editType, setEditType] = useState<Job['type']>(job.type);
    const [editCategory, setEditCategory] = useState(job.category);
    const [editExperience, setEditExperience] = useState(job.experienceLevel || 'Mid-Senior');
    const [editDescription, setEditDescription] = useState(job.description);
    const [editRequirements, setEditRequirements] = useState(job.requirements.join('\n'));
    const [editResponsibilities, setEditResponsibilities] = useState(job.responsibilities.join('\n'));
    const [editStatus, setEditStatus] = useState<Job['status']>(job.status || 'Open');
    
    const isJobSeeker = currentUserRole === UserRole.JobSeeker || !currentUserRole;
    const isAdmin = currentUserRole === UserRole.Admin;
    const isEmployer = currentUserRole === UserRole.Employer;
    const isAgent = currentUserRole === UserRole.Agent;

    const isOwnJob = isEmployer && (job.employerId === currentUserId || (currentUserId && currentUserId.includes('safaricom') && job.companyName.toLowerCase().includes('safaricom')) || (currentUserId && currentUserId.includes('kqa') && job.companyName.toLowerCase().includes('airways')));

    const seeker = getLoggedInSeeker();
    const application = applications.find(a => a.jobId === job.id && a.jobSeekerId === seeker.id);
    const hasApplied = application && !application.interestedOnly;
    const isInterested = application && application.interestedOnly;

    const handleSendMessage = () => {
        if (messageContent.trim()) {
            sendMessage(job.employerId, messageContent, job.id);
            setIsMessaging(false);
            setMessageContent('');
        }
    };

    const handleApply = (interestedOnly: boolean = false) => {
        setIsSubmitting(true);
        // Simulate a small delay
        setTimeout(() => {
            applyToJob(job.id, seeker.id, interestedOnly ? '' : coverLetter, interestedOnly);
            setIsSubmitting(false);
            setIsApplying(false);
        }, 800);
    };

    const handleSaveJobEdits = (e: React.FormEvent) => {
        e.preventDefault();
        const updated: Job = {
            ...job,
            title: editTitle,
            companyName: editCompany,
            location: editLocation,
            salaryRange: editSalary,
            type: editType,
            category: editCategory,
            experienceLevel: editExperience,
            description: editDescription,
            requirements: editRequirements.split('\n').filter(r => r.trim().length > 0),
            responsibilities: editResponsibilities.split('\n').filter(r => r.trim().length > 0),
            status: editStatus
        };
        updateJob(updated);
        setIsEditingJob(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
                onClick={onBack}
                className="flex items-center text-sm font-bold text-slate-500 dark:text-indigo-300 hover:text-indigo-600 transition-colors group"
            >
                <Icon name="arrowLeft" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Job Board
            </button>

            <div className="bg-white dark:bg-indigo-900 rounded-3xl shadow-xl border border-slate-100 dark:border-indigo-800 overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-indigo-800 bg-slate-50/50 dark:bg-indigo-950/50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-2xl bg-white dark:bg-indigo-900 flex items-center justify-center border border-slate-100 dark:border-indigo-800 shadow-sm overflow-hidden">
                                {job.companyLogo ? (
                                    <img src={job.companyLogo} alt={job.companyName} className="h-12 w-12 object-contain" referrerPolicy="no-referrer" />
                                ) : (
                                    <Icon name="buildingOffice" className="h-10 w-10 text-indigo-600" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-slate-600 dark:text-indigo-200">
                                    <span className="flex items-center font-medium"><Icon name="buildingOffice" className="h-5 w-5 mr-2 text-indigo-500" /> {job.companyName}</span>
                                    <span className="flex items-center font-medium"><Icon name="location" className="h-5 w-5 mr-2 text-indigo-500" /> {job.location}</span>
                                    <span className="flex items-center font-bold text-indigo-600 dark:text-indigo-400">{job.salaryRange}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            {isJobSeeker && (
                                <>
                                    {!hasApplied && !isInterested && (
                                        <>
                                            <button 
                                                onClick={() => handleApply(true)}
                                                disabled={isSubmitting}
                                                className="flex-1 md:flex-none px-6 py-3 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all flex items-center justify-center cursor-pointer"
                                            >
                                                <Icon name="star" className="h-5 w-5 mr-2" />
                                                Interested
                                            </button>
                                            <button 
                                                onClick={() => setIsApplying(true)}
                                                className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center cursor-pointer"
                                            >
                                                Apply Now
                                            </button>
                                        </>
                                    )}
                                    {isInterested && !hasApplied && (
                                        <>
                                            <span className="px-6 py-3 bg-amber-100 text-amber-700 font-bold rounded-xl flex items-center justify-center">
                                                <Icon name="star" className="h-5 w-5 mr-2" />
                                                Interested
                                            </span>
                                            <button 
                                                onClick={() => setIsApplying(true)}
                                                className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center cursor-pointer"
                                            >
                                                Complete Application
                                            </button>
                                        </>
                                    )}
                                    {hasApplied && (
                                        <div className="flex-1 md:flex-none px-8 py-3 bg-green-100 text-green-700 font-bold rounded-xl flex items-center justify-center border border-green-200">
                                            <Icon name="check" className="h-5 w-5 mr-2" />
                                            Application Submitted
                                        </div>
                                    )}
                                </>
                            )}

                            {isAdmin && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsEditingJob(true)}
                                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                                    >
                                        <Icon name="pencil" className="h-4 w-4" />
                                        <span>Edit Requisition (Admin)</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
                                                deleteJob(job.id);
                                                onBack();
                                            }
                                        }}
                                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                                    >
                                        <Icon name="trash" className="h-4 w-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}

                            {isEmployer && (
                                <div className="flex items-center gap-2">
                                    {isOwnJob && (
                                        <button
                                            onClick={() => setIsEditingJob(true)}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Icon name="pencil" className="h-4 w-4" />
                                            <span>Edit My Requisition</span>
                                        </button>
                                    )}
                                    <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {isOwnJob ? 'Your Active Posting' : 'Enterprise Requisition'}
                                    </div>
                                </div>
                            )}

                            {isAgent && (
                                <div className="px-4 py-2 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                                    <Icon name="shieldCheck" className="h-4 w-4 text-teal-500" />
                                    <span>Audit Reference Only</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Icon name="documentText" className="h-5 w-5 mr-2 text-indigo-500" />
                                Job Description
                            </h2>
                            <p className="text-slate-600 dark:text-indigo-200 leading-relaxed whitespace-pre-line">{job.description}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Icon name="checkCircle" className="h-5 w-5 mr-2 text-indigo-500" />
                                Key Responsibilities
                            </h2>
                            <ul className="space-y-3">
                                {job.responsibilities.map((resp, i) => (
                                    <li key={i} className="flex items-start text-slate-600 dark:text-indigo-200">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3 flex-shrink-0"></div>
                                        {resp}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Icon name="academicCap" className="h-5 w-5 mr-2 text-indigo-500" />
                                Requirements
                            </h2>
                            <ul className="space-y-3">
                                {job.requirements.map((req, i) => (
                                    <li key={i} className="flex items-start text-slate-600 dark:text-indigo-200">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3 flex-shrink-0"></div>
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Icon name="sparkles" className="h-5 w-5 mr-2 text-indigo-500" />
                                Benefits
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {job.benefits.map((benefit, i) => (
                                    <div key={i} className="bg-slate-50 dark:bg-indigo-950 p-4 rounded-2xl border border-slate-100 dark:border-indigo-800 flex items-center">
                                        <Icon name="check" className="h-5 w-5 text-green-500 mr-3" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-indigo-200">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-indigo-50 dark:bg-indigo-950 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                            <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center">
                                <Icon name="scale" className="h-5 w-5 mr-2" />
                                Legal Rights & Terms
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Terms & Conditions</h3>
                                    <p className="text-sm text-indigo-800 dark:text-indigo-200">{job.termsAndConditions}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">International Labor Standards</h3>
                                    <p className="text-sm text-indigo-800 dark:text-indigo-200">{job.legalRights}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-slate-50 dark:bg-indigo-950 p-6 rounded-3xl border border-slate-100 dark:border-indigo-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Job Overview</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-slate-500 dark:text-indigo-300">
                                        <Icon name="calendar" className="h-5 w-5 mr-3" />
                                        <span className="text-sm font-medium">Posted Date</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{new Date(job.postedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-slate-500 dark:text-indigo-300">
                                        <Icon name="clock" className="h-5 w-5 mr-3" />
                                        <span className="text-sm font-medium">Deadline</span>
                                    </div>
                                    <span className="text-sm font-bold text-rose-500">{new Date(job.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-slate-500 dark:text-indigo-300">
                                        <Icon name="briefcase" className="h-5 w-5 mr-3" />
                                        <span className="text-sm font-medium">Job Type</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{job.type}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-slate-500 dark:text-indigo-300">
                                        <Icon name="userGroup" className="h-5 w-5 mr-3" />
                                        <span className="text-sm font-medium">Experience</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{job.experienceLevel} Level</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-slate-500 dark:text-indigo-300">
                                        <Icon name="cog" className="h-5 w-5 mr-3" />
                                        <span className="text-sm font-medium">Category</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{job.category}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl shadow-indigo-600/20 text-white">
                            <h3 className="text-xl font-bold mb-4 text-white">Why work with us?</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                                At {job.companyName}, we believe in fostering a culture of innovation, inclusion, and excellence. Join us and be part of a team that's shaping the future of {job.category}.
                            </p>
            <button 
                onClick={() => handleApply(true)}
                disabled={isSubmitting}
                className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all border-2 border-indigo-100 mb-3"
            >
                Learn More About Us
            </button>
            <button 
                onClick={() => setIsMessaging(true)}
                className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-all flex items-center justify-center"
            >
                <Icon name="chat" className="h-5 w-5 mr-2" />
                Ask a Question
            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isApplying && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-indigo-950 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-indigo-900 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Apply for {job.title}</h2>
                                <p className="text-sm text-slate-500 dark:text-indigo-300 mt-1">at {job.companyName}</p>
                            </div>
                            <button onClick={() => setIsApplying(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-indigo-900 rounded-full transition-colors">
                                <Icon name="close" className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-indigo-200 mb-2">Cover Letter (Optional)</label>
                                <textarea 
                                    rows={8} 
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Tell the employer why you're a great fit for this role..." 
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-indigo-900 border border-slate-200 dark:border-indigo-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white resize-none"
                                ></textarea>
                            </div>
                            <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-start">
                                <Icon name="shieldCheck" className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                                <p className="text-xs text-indigo-800 dark:text-indigo-300">
                                    Your verified profile data (CV, Education, Work Experience) will be automatically shared with the employer upon submission.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setIsApplying(false)}
                                    className="flex-1 py-3 border-2 border-slate-200 dark:border-indigo-800 text-slate-700 dark:text-indigo-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-indigo-900 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleApply(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isMessaging && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-indigo-950 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-indigo-900 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ask a Question</h2>
                            <button onClick={() => setIsMessaging(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-indigo-900 rounded-full transition-colors">
                                <Icon name="close" className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <p className="text-sm text-slate-500 dark:text-indigo-300">
                                Have a question about the role at <span className="font-bold text-indigo-600">{job.companyName}</span>? Send a message directly to the hiring team.
                            </p>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-indigo-200 mb-2">Your Message</label>
                                <textarea 
                                    rows={5} 
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    placeholder="Type your question here..." 
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-indigo-900 border border-slate-200 dark:border-indigo-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white resize-none"
                                ></textarea>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setIsMessaging(false)}
                                    className="flex-1 py-3 border-2 border-slate-200 dark:border-indigo-800 text-slate-700 dark:text-indigo-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-indigo-900 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!messageContent.trim()}
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:shadow-none"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Requisition Modal (Admin & Employer) */}
            {isEditingJob && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                                    <Icon name="pencil" className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Job Requisition</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Update job title, requirements, salary compensation, and publishing status.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsEditingJob(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                            >
                                <Icon name="close" className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveJobEdits} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Company Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editCompany}
                                        onChange={e => setEditCompany(e.target.value)}
                                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={editLocation}
                                        onChange={e => setEditLocation(e.target.value)}
                                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Salary Range</label>
                                    <input
                                        type="text"
                                        required
                                        value={editSalary}
                                        onChange={e => setEditSalary(e.target.value)}
                                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Job Type</label>
                                    <select
                                        value={editType}
                                        onChange={e => setEditType(e.target.value as Job['type'])}
                                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Category</label>
                                    <input
                                        type="text"
                                        value={editCategory}
                                        onChange={e => setEditCategory(e.target.value)}
                                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Status</label>
                                    <select
                                        value={editStatus}
                                        onChange={e => setEditStatus(e.target.value as Job['status'])}
                                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Job Description</label>
                                <textarea
                                    rows={4}
                                    value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}
                                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Requirements (one per line)</label>
                                <textarea
                                    rows={3}
                                    value={editRequirements}
                                    onChange={e => setEditRequirements(e.target.value)}
                                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Key Responsibilities (one per line)</label>
                                <textarea
                                    rows={3}
                                    value={editResponsibilities}
                                    onChange={e => setEditResponsibilities(e.target.value)}
                                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingJob(false)}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                                >
                                    Save Requisition Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
