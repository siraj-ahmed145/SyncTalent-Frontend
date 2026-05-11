'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

function readStoredDarkMode() {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('darkMode') || localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || saved === 'true') return true;
  if (saved === 'light' || saved === 'false') return false;
  return prefersDark;
}

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => readStoredDarkMode());
  const [isInitialized, setIsInitialized] = useState(false);

  const applyDarkMode = useCallback((isDark) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0f1729';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '';
    }
    localStorage.setItem('darkMode', String(isDark));
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    applyDarkMode(darkMode);
    setIsInitialized(true);
  }, [darkMode, applyDarkMode]);

  const toggleDarkMode = () => {
    setDarkMode((d) => !d);
  };

  const setDarkModeExplicit = (isDark) => {
    setDarkMode(!!isDark);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, setDarkModeExplicit, isInitialized }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// Hook to use dark mode context
export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
}
