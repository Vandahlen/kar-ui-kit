/**
 * theme/ThemeContext.tsx
 *
 * Provides the app's design tokens (see getTheme in theme.ts) to whichever
 * app imports this package. ALWAYS DARK - Karappen has no light mode, and
 * following useColorScheme() made light-mode devices render an unverified
 * palette that looks nothing like the real app.
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
import { getTheme, ThemeTokens, Section } from './theme';

/**
 * Karappen is DARK-ONLY, so the default is dark too - an unwrapped consumer
 * must not fall back to the unverified light palette.
 */
const ThemeContext = createContext<ThemeTokens>(getTheme(true));

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
  const inherited = useContext(ThemeContext);
  const resolved = section ?? inherited.section;
  // Always dark. The shipping app ignores the system colour scheme entirely -
  // forcing the device to light mode produces a pixel-identical screen - so
  // this deliberately does NOT call useColorScheme(). `getTheme(false, ...)`
  // still exists for any consumer that genuinely wants the light palette.
  const value = useMemo(() => getTheme(true, resolved), [resolved]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}

/** Convenience: the current section's accent colour. */
export function useAccent(): string {
  return useContext(ThemeContext).primary;
}
