
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
  const [theme, setTheme] = useState<Theme>(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      return (storedTheme === 'light' ? 'light' : 'dark');
    }
    return 'dark'; // Default to dark theme
  });
  
  const [isEditingLayout, setIsEditingLayout] = useState<boolean>(false);

  // Apply theme effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, [theme]);

  // Create a stable context value object
  const contextValue = React.useMemo(() => ({
    theme,
    setTheme,
    isEditingLayout,
    setIsEditingLayout
  }), [theme, isEditingLayout]);

  return (
    <ThemeContext.Provider value={contextValue}>
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
