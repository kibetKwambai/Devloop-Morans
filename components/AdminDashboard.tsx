
import React, { useState, useMemo } from 'react';
import { JobSeekerProfile, VerificationStatus } from '../types';
import { useAppContext } from './AppContext';
import { Icon } from './Icon';

const statusStyles: Record<VerificationStatus, string> = {
    [VerificationStatus.DRAFT]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    [VerificationStatus.VERIFIED]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    [VerificationStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    [VerificationStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

type StatusFilter = 'pending' | 'verified' | 'rejected' | 'all';

interface AdminDashboardProps {
    onViewProfile: (profileId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewProfile }) => {
    const { profiles } = useAppContext();
    const [activeTab, setActiveTab] = useState<StatusFilter>('pending');

    const filteredProfiles = useMemo(() => {
        switch (activeTab) {
            case 'pending':
                return profiles.filter(p => p.verificationStatus === VerificationStatus.PENDING);
            case 'verified':
                return profiles.filter(p => p.verificationStatus === VerificationStatus.VERIFIED);
            case 'rejected':
                return profiles.filter(p => p.verificationStatus === VerificationStatus.REJECTED);
            case 'all':
            default:
                return profiles;
        }
    }, [profiles, activeTab]);

    const tabs: {id: StatusFilter, label: string}[] = [
        {id: 'pending', label: 'Pending'},
        {id: 'verified', label: 'Verified'},
        {id: 'rejected', label: 'Rejected'},
        {id: 'all', label: 'All Users'},
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Verification Panel</h2>
                <p className="mt-1 text-slate-500 dark:text-indigo-300">Review and manage job seeker profiles.</p>
            </div>

            <div className="bg-white dark:bg-indigo-900 rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-slate-200 dark:border-indigo-800">
                    <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                        {tabs.map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-indigo-300 dark:hover:text-white dark:hover:border-indigo-600'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="overflow-x-auto">
                    {filteredProfiles.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-indigo-800">
                            <thead className="bg-slate-50 dark:bg-indigo-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-indigo-400 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-indigo-400 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-indigo-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">View</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-indigo-900 divide-y divide-slate-200 dark:divide-indigo-800">
                                {filteredProfiles.map(profile => (
                                    <tr key={profile.id} className="hover:bg-slate-50 dark:hover:bg-indigo-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full object-cover" src={profile.photoUrl} alt="" />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{profile.name}</div>
                                                    <div className="text-sm text-slate-500 dark:text-indigo-300">{profile.location}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-indigo-300">{profile.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[profile.verificationStatus]}`}>
                                                {profile.verificationStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => onViewProfile(profile.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-6 text-center text-slate-500 dark:text-indigo-400">No profiles match the current filter.</p>
                    )}
                </div>
            </div>
        </div>
    );
};