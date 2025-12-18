import { create } from "zustand";
import { persist } from "zustand/middleware";

// Apply theme to document
const applyTheme = (theme) => {
    const root = document.documentElement;

    if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', systemPrefersDark);
        return systemPrefersDark ? 'dark' : 'light';
    }

    root.classList.toggle('dark', theme === 'dark');
    return theme;
};

// Get initial resolved theme
const getInitialResolvedTheme = (theme) => {
    if (typeof window === 'undefined') return 'light';

    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
};

const useThemeStore = create(
    persist(
        (set, get) => ({
            theme: 'system', // 'light' | 'dark' | 'system'
            resolvedTheme: 'light', // actual applied theme

            setTheme: (newTheme) => {
                const resolved = applyTheme(newTheme);
                set({ theme: newTheme, resolvedTheme: resolved });
            },

            initializeTheme: () => {
                const { theme } = get();
                const resolved = applyTheme(theme);
                set({ resolvedTheme: resolved });

                // Listen for system preference changes
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const handleChange = () => {
                    const currentTheme = get().theme;
                    if (currentTheme === 'system') {
                        const newResolved = applyTheme('system');
                        set({ resolvedTheme: newResolved });
                    }
                };

                mediaQuery.addEventListener('change', handleChange);
                return () => mediaQuery.removeEventListener('change', handleChange);
            },
        }),
        {
            name: "theme-storage",
            partialize: (state) => ({ theme: state.theme }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Apply theme immediately after rehydration
                    setTimeout(() => {
                        state.initializeTheme();
                    }, 0);
                }
            },
        }
    )
);

export default useThemeStore;
