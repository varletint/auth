import React from 'react';
import useThemeStore from '../store/useThemeStore';
import { Sun02Icon, Moon02Icon, ComputerIcon } from 'hugeicons-react';

export default function ThemeToggle({ className = '' }) {
    const { theme, setTheme } = useThemeStore();

    const options = [
        { value: 'light', IconComponent: Sun02Icon, label: 'Light' },
        { value: 'dark', IconComponent: Moon02Icon, label: 'Dark' },
        { value: 'system', IconComponent: ComputerIcon, label: 'System' },
    ];

    return (
        <div className={`flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}>
            {options.map(({ value, IconComponent, label }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    title={label}
                    className={`p-2 rounded-md transition-all duration-200 ${theme === value
                        ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                >
                    <IconComponent size={18} />
                </button>
            ))}
        </div>
    );
}
