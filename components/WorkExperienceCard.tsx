
import React from 'react';
import { WorkExperience } from '../types';
import { Icon } from './Icon';

interface WorkExperienceCardProps {
  experience: WorkExperience[];
}

export const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({ experience }) => {
  return (
    <div className="space-y-6">
      {experience.map((exp, index) => (
        <div key={exp.id} className={`relative pl-8 ${index < experience.length - 1 ? 'pb-6 border-l-2 border-slate-200 dark:border-indigo-800' : ''}`}>
          <div className="absolute left-0 top-1 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-indigo-900 border-2 border-indigo-600 dark:border-indigo-400 rounded-full"></div>
          <p className="text-xs text-slate-500 dark:text-indigo-300">{exp.startDate} - {exp.endDate}</p>
          <h4 className="font-semibold text-slate-800 dark:text-white">{exp.title}</h4>
          <div className="flex items-center text-sm text-slate-600 dark:text-indigo-200">
            <span>{exp.company}</span>
            {exp.isVerified && (
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" title="Verified by Admin">
                <Icon name="checkCircle" className="h-3 w-3 mr-0.5" />
                Verified
              </span>
            )}
            <span className="mx-1.5">&middot;</span>
            <span>{exp.location}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-indigo-300 leading-relaxed">{exp.description}</p>
          {exp.responsibilities && exp.responsibilities.length > 0 && (
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-slate-500 dark:text-indigo-300">
                {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};