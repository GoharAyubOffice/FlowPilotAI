import { useTheme } from './useTheme';

export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}