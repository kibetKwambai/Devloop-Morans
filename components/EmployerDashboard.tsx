
import React, { useState, useMemo } from 'react';
import { JobSeekerProfile, VerificationStatus } from '../types';
import { useAppContext } from './AppContext';
import { Icon } from './Icon';
import { CandidateCard } from './CandidateCard';

interface EmployerDashboardProps {
    onViewProfile: (profileId: string) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onViewProfile }) => {
    const { profiles } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>('All');
    const [showShortlisted, setShowShortlisted] = useState(false);
    
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

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Candidate Search</h2>
                <p className="mt-1 text-slate-500 dark:text-indigo-300">Discover top-tier, verified talent for your next hire.</p>
            </div>
            <div className="bg-white dark:bg-indigo-900 p-6 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <Icon name="search" className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, headline, or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-indigo-800 dark:text-white dark:border-indigo-700 dark:placeholder-slate-400 text-slate-900"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <Icon name="mapPin" className="h-5 w-5 text-slate-400" />
                        </div>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-indigo-800 dark:text-white dark:border-indigo-700 text-slate-900"
                        >
                            {allLocations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-slate-600 dark:text-indigo-200 mb-2">Filter by skills:</h4>
                    <div className="flex flex-wrap gap-2">
                        {allSkills.map(skill => (
                             <button
                                key={skill}
                                onClick={() => handleSkillToggle(skill)}
                                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                                    selectedSkills.includes(skill)
                                        ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 dark:bg-indigo-950 dark:text-indigo-100 dark:border-indigo-700 dark:hover:bg-indigo-800'
                                }`}
                            >
                               {skill}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end items-center pt-2">
                    <label htmlFor="shortlist-toggle" className="flex items-center cursor-pointer">
                        <span className="mr-3 text-sm font-medium text-slate-700 dark:text-white">Show Shortlisted Only</span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                id="shortlist-toggle"
                                className="sr-only"
                                checked={showShortlisted}
                                onChange={() => setShowShortlisted(!showShortlisted)}
                            />
                            <div className={`block w-14 h-8 rounded-full transition-colors ${showShortlisted ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-indigo-800'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${showShortlisted ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                    </label>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Showing {filteredProfiles.length} Verified Candidate{filteredProfiles.length !== 1 && 's'}
                </h3>
                 {filteredProfiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProfiles.map(profile => (
                           <CandidateCard key={profile.id} profile={profile} onViewProfile={onViewProfile} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-indigo-900 rounded-lg shadow-md">
                        <Icon name="userGroup" className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                        <p className="mt-4 text-slate-500 dark:text-indigo-200 font-semibold">No candidates match your current filters.</p>
                        <p className="text-sm text-slate-400 dark:text-indigo-400 mt-1">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};