
import React from 'react';
import { Icon, IconName } from './Icon';

interface ProfileSectionProps {
  title: string;
  iconName: IconName;
  children: React.ReactNode;
  isOwner?: boolean;
  onEdit?: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ title, iconName, children, onEdit, isOwner = false }) => {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      <header className="flex items-center justify-between p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center">
          <Icon name={iconName} className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="ml-3 text-base font-bold text-slate-900 dark:text-white">{title}</h3>
        </div>
        {isOwner && onEdit && (
            <button
                onClick={onEdit}
                className="flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
                <Icon name="pencil" className="h-3.5 w-3.5 mr-1" />
                Edit
            </button>
        )}
      </header>
      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
};