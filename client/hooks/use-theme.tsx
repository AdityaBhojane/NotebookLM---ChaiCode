import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type SourceTheme = 'default' | 'nodejs' | 'javascript';

interface ThemeContextType {
  theme: Theme;
  sourceTheme: SourceTheme;
  setTheme: (theme: Theme) => void;
  setSourceTheme: (sourceTheme: SourceTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [sourceTheme, setSourceTheme] = useState<SourceTheme>('default');

  useEffect(() => {
    const root = window.document.documentElement;

    // Only handle dark/light mode for the entire app
    root.classList.remove('dark');
    if (theme === 'dark') {
      root.classList.add('dark');
    }

    // Source themes are now handled by CSS classes on specific components
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    sourceTheme,
    setTheme,
    setSourceTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
