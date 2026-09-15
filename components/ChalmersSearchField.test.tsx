import React from 'react';
import { TextInput } from 'react-native';
import { renderWithTheme, styleOf } from '../test-utils';
import ChalmersSearchField from './ChalmersSearchField';
import { surfaces, radii } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';

test('matches the measured search field geometry', () => {
  const r = renderWithTheme(
    <ChalmersSearchField testID="sf" value="" onChangeText={() => {}} />,
  );
  const s = styleOf(r, 'sf');
  expect(s.height).toBe(componentSpecs.searchField.height);
  expect(s.borderRadius).toBe(radii.control);
  expect(s.backgroundColor).toBe(surfaces.chrome);
});

test('defaults the placeholder to Swedish "Sok"', () => {
  const r = renderWithTheme(
    <ChalmersSearchField testID="sf" value="" onChangeText={() => {}} />,
  );
  expect(r.root.findByType(TextInput).props.placeholder).toBe('Sök');
});

test('forwards typing to onChangeText', () => {
  const onChangeText = jest.fn();
  const r = renderWithTheme(
    <ChalmersSearchField testID="sf" value="" onChangeText={onChangeText} />,
  );
  r.root.findByType(TextInput).props.onChangeText('pizza');
  expect(onChangeText).toHaveBeenCalledWith('pizza');
});
