import React from 'react';
import { Text } from 'react-native';
import { renderWithTheme, styleOf } from '../test-utils';
import ChalmersFilterButton from './ChalmersFilterButton';
import FilterIcon from './icons/FilterIcon';
import { surfaces, radii, colors } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';

test('matches the measured filter button geometry', () => {
  const r = renderWithTheme(
    <ChalmersFilterButton testID="fb" onPress={() => {}} />,
  );
  const s = styleOf(r, 'fb');
  expect(s.height).toBe(componentSpecs.filterButton.height);
  expect(s.borderRadius).toBe(radii.control);
  expect(s.backgroundColor).toBe(surfaces.chrome);
});

test('shows a bare label with no count', () => {
  const r = renderWithTheme(
    <ChalmersFilterButton testID="fb" onPress={() => {}} />,
  );
  expect(r.root.findByType(Text).props.children).toBe('FILTER');
});

test('appends the count when given', () => {
  const r = renderWithTheme(
    <ChalmersFilterButton testID="fb" onPress={() => {}} count={2} />,
  );
  expect(r.root.findByType(Text).props.children).toBe('FILTER (2)');
});

test('tints the icon with the section accent', () => {
  const r = renderWithTheme(
    <ChalmersFilterButton testID="fb" onPress={() => {}} />,
    'mat',
  );
  expect(r.root.findByType(FilterIcon).props.color).toBe(colors.gron);
});

test('calls onPress', () => {
  const onPress = jest.fn();
  const r = renderWithTheme(
    <ChalmersFilterButton testID="fb" onPress={onPress} />,
  );
  // Pressable exposes no callable onPress on its HOST node under
  // react-test-renderer. Reach the composite Pressable instead.
  const pressable = r.root
    .findAllByProps({ testID: 'fb' })
    .find(n => typeof n.type !== 'string' && n.props.onPress);
  pressable!.props.onPress();
  expect(onPress).toHaveBeenCalled();
});
