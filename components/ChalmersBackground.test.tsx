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

test('every shape sits on one of the two measured opacity tiers', () => {
  const tiers = new Set(BACKGROUND_SHAPES.map(s => s.opacity));
  expect([...tiers].sort()).toEqual([
    decorative.shapeOpacity.low,
    decorative.shapeOpacity.high,
  ]);
});

test('renders children above the layer', () => {
  const r = renderWithTheme(
    <ChalmersBackground testID="bg">
      <ChalmersBackground testID="inner" />
    </ChalmersBackground>,
  );
  expect(styleOf(r, 'inner')).toBeDefined();
});
