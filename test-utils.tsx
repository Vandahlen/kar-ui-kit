/**
 * test-utils.tsx
 *
 * Test-only helpers. NOT exported from index.ts.
 *
 * Two non-obvious things this exists to hide:
 *   1. React 19 requires renderer.create() inside act(); without it toJSON()
 *      returns null and assertions pass vacuously or fail confusingly.
 *   2. findAllByProps({testID}) returns composite wrappers AND the host
 *      element. Only the host carries the component's internal style.
 */
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeProvider } from './theme/ThemeContext';
import { Section } from './theme/theme';

export function renderWithTheme(
  ui: React.ReactElement,
  section?: Section,
): renderer.ReactTestRenderer {
  let r: renderer.ReactTestRenderer;
  act(() => {
    r = renderer.create(<ThemeProvider section={section}>{ui}</ThemeProvider>);
  });
  return r!;
}

export function hostWithTestID(
  r: renderer.ReactTestRenderer,
  testID: string,
): renderer.ReactTestInstance {
  const host = r.root
    .findAllByProps({ testID })
    .find(n => typeof n.type === 'string');
  if (!host) {
    throw new Error(`No host element with testID "${testID}"`);
  }
  return host;
}

export function styleOf(
  r: renderer.ReactTestRenderer,
  testID: string,
): ViewStyle & TextStyle {
  return StyleSheet.flatten(
    hostWithTestID(r, testID).props.style,
  ) as ViewStyle & TextStyle;
}
