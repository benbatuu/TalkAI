import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUpdateProfile } from '../services/userService';
import { useUserProfile } from '../services/authService';
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import type { Theme } from '../types';

export const ThemeSelector: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { data: userProfile } = useUserProfile();
    const updateProfile = useUpdateProfile();

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);

        if (userProfile?.id) {
            updateProfile.mutate({
                userId: userProfile.id,
                data: { theme: newTheme }
            });
        }
    };

    return (
        <div className="flex justify-between items-center gap-2">
            <button
                onClick={() => handleThemeChange('light')}
                className={`p-2 w-full justify-center flex rounded-lg border transition-colors cursor-pointer
                    ${theme === 'light'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                    }`}
                title="Light Mode"
            >
                <MdOutlineLightMode size={20} />
            </button>
            <button
                onClick={() => handleThemeChange('dark')}
                className={`p-2 w-full justify-center flex rounded-lg border transition-colors cursor-pointer
                    ${theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                    }`}
                title="Dark Mode"
            >
                <MdDarkMode size={20} />
            </button>
        </div>
    );
};
