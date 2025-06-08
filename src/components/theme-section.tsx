import { useTheme } from "../context/ThemeContext";
import { ThemeSelector } from "./theme-selector";


export const ThemeSection = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);


    return (
        <div className={`rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Theme Preferences
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p className="font-medium">Current Theme</p>
                        <p className="text-sm">{theme === 'system' ? 'System Default' : theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                    </div>
                    <ThemeSelector />
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your theme preference will be saved to your profile and synced across devices.
                </p>
            </div>
        </div>
    );
};
