
import React from 'react';
import { useAppContext } from './AppContext';
import { Icon, IconName } from './Icon';

export const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useAppContext();

    const themes: { name: string; value: 'light' | 'dark' | 'system'; icon: IconName; tooltip: string }[] = [
        { name: 'Day', value: 'light', icon: 'sun', tooltip: 'Switch to Day / Light mode' },
        { name: 'Night', value: 'dark', icon: 'moon', tooltip: 'Switch to Night / Dark mode' },
        { name: 'Auto', value: 'system', icon: 'computerDesktop', tooltip: 'Sync with System appearance' },
    ];

    return (
        <div 
            className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-indigo-900/60 rounded-xl shadow-inner"
            role="radiogroup"
            aria-label="Theme mode selector"
        >
            {themes.map((t) => {
                const isActive = theme === t.value;
                return (
                    <button
                        key={t.value}
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => setTheme(t.value)}
                        className={`flex items-center justify-center h-8 w-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            isActive
                                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm scale-105'
                                : 'text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-indigo-900/40'
                        }`}
                        aria-label={t.tooltip}
                        title={t.tooltip}
                    >
                        <Icon name={t.icon} className="h-4 w-4" />
                    </button>
                );
            })}
        </div>
    );
};