
import React from 'react';
import { Skill } from '../types';

interface SkillsCardProps {
  skills: Skill[];
}

export const SkillsCard: React.FC<SkillsCardProps> = ({ skills }) => {
  const hardSkills = skills.filter(s => s.type === 'Hard');
  const softSkills = skills.filter(s => s.type === 'Soft');

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-wider mb-2">Hard Skills</h4>
        <div className="flex flex-wrap gap-2">
          {hardSkills.map(skill => (
            <span key={skill.id} className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/30">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-wider mb-2">Soft Skills</h4>
        <div className="flex flex-wrap gap-2">
          {softSkills.map(skill => (
            <span key={skill.id} className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
