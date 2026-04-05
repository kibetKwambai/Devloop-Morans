
import React from 'react';
import { Education } from '../types';

interface EducationCardProps {
  education: Education[];
}

export const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  return (
    <div className="space-y-4">
      {education.map(edu => (
        <div key={edu.id}>
          <p className="text-xs text-slate-500 dark:text-indigo-300">{edu.startDate} - {edu.endDate}</p>
          <h4 className="font-semibold text-slate-800 dark:text-white">{edu.institution}</h4>
          <p className="text-sm text-slate-600 dark:text-indigo-200">{edu.degree}, {edu.fieldOfStudy}</p>
        </div>
      ))}
    </div>
  );
};