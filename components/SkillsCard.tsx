
import React from 'react';
import { Skill } from '../types';

interface SkillsCardProps {
  skills: Skill[];
}

export const SkillsCard: React.FC<SkillsCardProps> = ({ skills }) => {
  const hardSkills = skills.filter(s => s.type === 'Hard');
  const softSkills = skills.filter(s => s.type === 'Soft');

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span>Technical & Domain Competencies</span>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">({hardSkills.length})</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {hardSkills.map(skill => (
            <span 
              key={skill.id} 
              className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs inline-flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              <span>{skill.name}</span>
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span>Leadership & Core Skills</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">({softSkills.length})</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {softSkills.map(skill => (
            <span 
              key={skill.id} 
              className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs inline-flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
              <span>{skill.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
