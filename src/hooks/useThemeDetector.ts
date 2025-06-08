import { useEffect, useState } from "react";

export const useThemeDetector = (shouldListen: boolean = true) => {
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        if (!shouldListen || typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkTheme(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => {
            setIsDarkTheme(e.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [shouldListen]);

    return isDarkTheme;
};