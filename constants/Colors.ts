export const Colors = {
  light: {
    primary: '#6D9886',
    accent: '#A89BC9',
    coral: '#FF8A5C',
    background: '#F7F7F7',
    white: '#FFFFFF',
    text: '#1E1E1E',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradientStart: '#6D9886',
    gradientEnd: '#A89BC9',
    card: '#FFFFFF',
    surface: '#F9FAFB',
  },
  dark: {
    primary: '#7BA896',
    accent: '#B8A9D9',
    coral: '#FF9A6C',
    background: '#0F0F0F',
    white: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textLight: '#71717A',
    border: '#27272A',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    gradientStart: '#7BA896',
    gradientEnd: '#B8A9D9',
    card: '#1A1A1A',
    surface: '#262626',
  }
} as const;

// Helper function to get current theme colors
// Helper function to get current theme colors
export const getColors = (isDark: boolean) => {
  // Ensure we're using the correct theme colors
  return isDark ? Colors.dark : Colors.light;
};