import React from 'react';
import { Polygon } from 'react-native-svg';
import { renderWithTheme, styleOf } from '../test-utils';
import ChalmersBackground from './ChalmersBackground';
import { decorative } from '../theme/theme';
import { BACKGROUND_SHAPES } from '../theme/backgroundShapes';

test('paints the measured base colour', () => {
  const r = renderWithTheme(<ChalmersBackground testID="bg" />);
  expect(styleOf(r, 'bg').backgroundColor).toBe(decorative.base);
});

test('renders one polygon per extracted shape', () => {
  const r = renderWithTheme(<ChalmersBackground testID="bg" />);
  expect(r.root.findAllByType(Polygon)).toHaveLength(BACKGROUND_SHAPES.length);
});

test('shape opacities are the measured values, not snapped to the tiers', () => {
  // Snapping every shape to the two nominal tiers pushed turkos 0.35 -> 0.40
  // and orange 0.27 -> 0.15, both visible against the real app. Keep the
  // measured per-shape values.
  const ops = BACKGROUND_SHAPES.map(s => s.opacity);
  expect(ops).toContain(0.35);
  expect(ops).toContain(0.27);
  expect(new Set(ops).size).toBeGreaterThan(2);
});

test('every shape stays within the measured envelope around the tiers', () => {
  for (const s of BACKGROUND_SHAPES) {
    expect(s.opacity).toBeGreaterThanOrEqual(0.1);
    expect(s.opacity).toBeLessThanOrEqual(decorative.shapeOpacity.high + 0.05);
  }
});

test('renders children above the layer', () => {
  const r = renderWithTheme(
    <ChalmersBackground testID="bg">
      <ChalmersBackground testID="inner" />
    </ChalmersBackground>,
  );
  expect(styleOf(r, 'inner')).toBeDefined();
});
