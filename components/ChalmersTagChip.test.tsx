import React from 'react';
import { Text } from 'react-native';
import { renderWithTheme, styleOf } from '../test-utils';
import ChalmersTagChip from './ChalmersTagChip';
import { surfaces, radii, colors } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';

test('matches the measured chip geometry', () => {
  const r = renderWithTheme(<ChalmersTagChip testID="tc" label="ÖVRIGT" />);
  const s = styleOf(r, 'tc');
  expect(s.height).toBe(componentSpecs.tagChip.height);
  expect(s.borderRadius).toBe(radii.control);
  expect(s.backgroundColor).toBe(surfaces.tagOverlay);
});

test('hugs its label rather than filling the row', () => {
  const r = renderWithTheme(<ChalmersTagChip testID="tc" label="ÖVRIGT" />);
  expect(styleOf(r, 'tc').alignSelf).toBe('flex-start');
});

test('colours the label with the section accent', () => {
  const r = renderWithTheme(
    <ChalmersTagChip testID="tc" label="ÖVRIGT" />,
    'event',
  );
  expect(r.root.findByType(Text).props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ color: colors.orange }),
    ]),
  );
});
