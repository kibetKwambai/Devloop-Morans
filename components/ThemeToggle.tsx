
import React from 'react';
import { useAppContext } from './AppContext';
import { Icon, IconName } from './Icon';

export const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useAppContext();

    const themes: { name: string; value: 'light' | 'dark' | 'system'; icon: IconName }[] = [
        { name: 'Light', value: 'light', icon: 'sun' },
        { name: 'Dark', value: 'dark', icon: 'moon' },
        { name: 'System', value: 'system', icon: 'computerDesktop' },
    ];

    return (
        <div className="flex items-center space-x-1 bg-slate-200 dark:bg-indigo-900 p-1 rounded-lg">
            {themes.map((t) => (
                <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                        theme === t.value
                            ? 'bg-white dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-indigo-800'
                    }`}
                    aria-label={`Switch to ${t.name} mode`}
                    title={`Switch to ${t.name} mode`}
                >
                    <Icon name={t.icon} className="h-5 w-5" />
                </button>
            ))}
        </div>
    );
};