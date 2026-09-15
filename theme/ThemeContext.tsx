/**
 * theme/ThemeContext.tsx
 *
 * Provides scheme-dependent design tokens (see getTheme in theme.ts) to
 * whichever app imports this package, via useColorScheme().
 *
 * Also carries the active bottom-tab SECTION. Karappen has no single app-wide
 * primary - each tab owns a brand accent (see `sectionAccent`), so `theme.primary`
 * is resolved from the nearest enclosing section.
 *
 * Usage: one ThemeProvider at the app root, then nest one per tab screen:
 *
 *   <ThemeProvider>                    // root, defaults to 'hem'
 *     <ThemeProvider section="mat">    // inside the food tab
 *       ...                            // theme.primary === colors.gron here
 *     </ThemeProvider>
 *   </ThemeProvider>
 *
 * A nested provider that omits `section` inherits the enclosing one rather
 * than resetting to the default.
 */
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, ThemeTokens, Section } from './theme';

const ThemeContext = createContext<ThemeTokens>(getTheme(false));

export interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * Bottom-tab section this subtree belongs to. Omit to inherit from an
   * enclosing ThemeProvider (or 'hem' at the root).
   */
  section?: Section;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  section,
}) => {
  const isDark = useColorScheme() === 'dark';
  const inherited = useContext(ThemeContext);
  const resolved = section ?? inherited.section;
  const value = useMemo(
    () => getTheme(isDark, resolved),
    [isDark, resolved],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}

/** Convenience: the current section's accent colour. */
export function useAccent(): string {
  return useContext(ThemeContext).primary;
}
