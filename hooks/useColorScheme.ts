import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { getColors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ColorScheme = 'light' | 'dark';

const THEME_STORAGE_KEY = '@theme_preference';

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemColorScheme ?? 'light');
  // Fix: Pass the actual colorScheme string instead of a boolean
  const colors = getColors(colorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setColorScheme(savedTheme as ColorScheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const toggleColorScheme = async () => {
    const newTheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return {
    colorScheme,
    colors,
    isDark: colorScheme === 'dark',
    toggleColorScheme,
  };
}