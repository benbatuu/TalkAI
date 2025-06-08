import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useUserProfile } from '../services/authService';

import type { Theme } from '../types';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { data: userProfile } = useUserProfile();
    
    // Get initial theme
    const getInitialTheme = (): Theme => {
        // First check userProfile theme
        if (userProfile?.theme && ['light', 'dark', 'system'].includes(userProfile.theme)) {
            return userProfile.theme as Theme;
        }
        
        // Then check localStorage
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme') as Theme;
            if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
                return storedTheme;
            }
        }
        
        return 'system';
    };

    // Get system preference
    const getSystemTheme = (): 'light' | 'dark' => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    };

    const [theme, setThemeState] = useState<Theme>(getInitialTheme);
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);

    // Update theme when user profile changes
    useEffect(() => {
        if (userProfile?.theme && ['light', 'dark', 'system'].includes(userProfile.theme)) {
            setThemeState(userProfile.theme as Theme);
        }
    }, [userProfile?.theme]);

    // Calculate effective theme
    const effectiveTheme = theme === 'system' ? systemTheme : theme;

    // Listen for system theme changes
    useEffect(() => {
        if (typeof window === 'undefined' || theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? 'dark' : 'light');
        };

        setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
            return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
        } else {
            mediaQuery.addListener(handleSystemThemeChange);
            return () => mediaQuery.removeListener(handleSystemThemeChange);
        }
    }, [theme]);

    // Apply theme to DOM
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(effectiveTheme);

        // Only update localStorage if no user profile or theme differs from profile
        if (!userProfile?.theme || theme !== userProfile.theme) {
            if (theme === 'system') {
                localStorage.removeItem('theme');
            } else {
                localStorage.setItem('theme', theme);
            }
        }
    }, [theme, effectiveTheme, userProfile?.theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        // Theme updates should be handled by profile update mutation in the component
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
