
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isEditingLayout: boolean;
  setIsEditingLayout: (isEditing: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Use a function for the initial state to avoid direct localStorage access during SSR
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark theme
  const [isEditingLayout, setIsEditingLayout] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Only access localStorage on the client side after component is mounted
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    }
  }, []);
  
  // Apply theme effects
  useEffect(() => {
    if (!mounted) return;
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Update data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update dark class for Tailwind
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  // Create a stable context value object with useMemo to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    theme,
    setTheme,
    isEditingLayout,
    setIsEditingLayout
  }), [theme, isEditingLayout]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
