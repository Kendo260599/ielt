import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            const storedTheme = window.localStorage.getItem('theme') as Theme | null;
            if (storedTheme) {
                return storedTheme;
            }
            // Fallback to user's system preference
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } catch (error) {
            return 'light'; // Default to light if localStorage is not available
        }
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        try {
            window.localStorage.setItem('theme', theme);
        } catch (error) {
            console.error("Error saving theme to localStorage", error);
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);

    return { theme, toggleTheme };
};
