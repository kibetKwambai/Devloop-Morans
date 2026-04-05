
import React from 'react';
import { Icon, IconName } from './Icon';

interface StatItemProps {
    value: string;
    label: string;
    icon: IconName;
}

export const StatItem: React.FC<StatItemProps> = ({ value, label, icon }) => (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-indigo-900/50 rounded-2xl border border-slate-100 dark:border-indigo-800 shadow-sm hover:shadow-md transition-all">
        <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-4">
            <Icon name={icon} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs font-bold text-slate-500 dark:text-indigo-300 uppercase tracking-widest mt-1">{label}</p>
    </div>
);
