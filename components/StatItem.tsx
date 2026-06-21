
import React from 'react';
import { Icon, IconName } from './Icon';

interface StatItemProps {
    value: string;
    label: string;
    icon: IconName;
}

export const StatItem: React.FC<StatItemProps> = ({ value, label, icon }) => (
    <div className="flex flex-col items-center p-10 glass-card rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-all duration-500">
            <Icon name={icon} className="h-8 w-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
        </div>
        <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
        <p className="text-sm font-bold text-slate-500 dark:text-indigo-400 uppercase tracking-[0.2em] mt-3">{label}</p>
    </div>
);
