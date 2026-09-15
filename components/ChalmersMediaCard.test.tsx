import React from 'react';
import { Image, Text } from 'react-native';
import { renderWithTheme, styleOf } from '../test-utils';
import ChalmersMediaCard from './ChalmersMediaCard';
import { surfaces, radii, borderWidth } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';

test('matches the measured card geometry', () => {
  const r = renderWithTheme(<ChalmersMediaCard testID="mc" title="S.M.A.K." />);
  const s = styleOf(r, 'mc');
  expect(s.borderRadius).toBe(radii.card);
  expect(s.backgroundColor).toBe(surfaces.listCard);
  expect(s.borderWidth).toBe(borderWidth.hairline);
  expect(s.borderColor).toBe(surfaces.border);
  expect(s.marginHorizontal).toBe(componentSpecs.mediaCard.marginHorizontal);
});

test('renders title and subtitle', () => {
  const r = renderWithTheme(
    <ChalmersMediaCard
      testID="mc"
      title="S.M.A.K."
      subtitle="Sven Hultins gata 6"
    />,
  );
  const labels = r.root.findAllByType(Text).map(n => n.props.children);
  expect(labels).toContain('S.M.A.K.');
  expect(labels).toContain('Sven Hultins gata 6');
});

test('omits the subtitle when not given', () => {
  const r = renderWithTheme(<ChalmersMediaCard testID="mc" title="S.M.A.K." />);
  expect(r.root.findAllByType(Text)).toHaveLength(1);
});

test('omits the media strip when no image is given', () => {
  const r = renderWithTheme(<ChalmersMediaCard testID="mc" title="S.M.A.K." />);
  expect(r.root.findAllByType(Image)).toHaveLength(0);
});

test('renders the media strip at the measured height', () => {
  const r = renderWithTheme(
    <ChalmersMediaCard
      testID="mc"
      title="S.M.A.K."
      imageSource={{ uri: 'https://example.invalid/a.png' }}
    />,
  );
  const s = styleOf(r, 'mc-image');
  expect(s.height).toBe(componentSpecs.mediaCard.imageHeight);
});
