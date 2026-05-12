import { createContext, useContext } from 'react';

/**
 * Defines the available theme modes.
 */
export type Theme = 'dark' | 'light' | 'system';

/**
 * Shape of the theme context state and control functions.
 */
export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

/**
 * Initial state for the theme provider.
 * Defaults to 'system' theme.
 */
export const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

/**
 * React context for managing the application's visual theme.
 */
export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

/**
 * Custom hook to access the current theme and the theme setter.
 * @throws Error if used outside of a ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
