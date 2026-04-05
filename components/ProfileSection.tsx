
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
    <section className="bg-white dark:bg-indigo-900 rounded-lg shadow-md overflow-hidden">
      <header className="flex items-center justify-between p-4 sm:p-6 bg-slate-50 dark:bg-indigo-900/50 border-b border-slate-200 dark:border-indigo-800">
        <div className="flex items-center">
          <Icon name={iconName} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="ml-3 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        {isOwner && onEdit && (
            <button
                onClick={onEdit}
                className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
                <Icon name="edit" className="h-4 w-4 mr-1" />
                Edit
            </button>
        )}
      </header>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </section>
  );
};