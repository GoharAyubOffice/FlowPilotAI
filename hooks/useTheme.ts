import { useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

// Global theme state
let globalThemeMode: ThemeMode = 'system';
let globalListeners: Set<(mode: ThemeMode) => void> = new Set();

export function useTheme() {
  const systemColorScheme = useNativeColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(globalThemeMode);

  useEffect(() => {
    const listener = (mode: ThemeMode) => {
      setThemeModeState(mode);
    };
    
    globalListeners.add(listener);
    
    return () => {
      globalListeners.delete(listener);
    };
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    globalThemeMode = mode;
    globalListeners.forEach(listener => listener(mode));
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const currentColorScheme = themeMode === 'system' 
    ? (systemColorScheme ?? 'light') 
    : themeMode;

  return {
    themeMode,
    setThemeMode,
    toggleTheme,
    colorScheme: currentColorScheme,
    isDark: currentColorScheme === 'dark',
  };
}