import React from 'react';
import { Text } from 'react-native';
import { renderWithTheme, styleOf } from './test-utils';
import { useTheme } from './theme/ThemeContext';
import ChalmersButton from './components/ChalmersButton';
import { radii, colors, surfaces } from './theme/theme';

function Probe() {
  const t = useTheme();
  return <Text>{`${t.background}|${t.primary}|${t.section}`}</Text>;
}

test('renders in the dark theme, not light', () => {
  const r = renderWithTheme(<Probe />);
  expect(r.root.findByType(Text).props.children).toContain(surfaces.background);
});

test('section argument resolves the accent', () => {
  const r = renderWithTheme(<Probe />, 'mat');
  expect(r.root.findByType(Text).props.children).toContain(colors.gron);
});

test('styleOf returns the host style, not the caller style', () => {
  const r = renderWithTheme(
    <ChalmersButton testID="btn" label="Hej" onPress={() => {}} />,
  );
  const s = styleOf(r, 'btn');
  expect(s.borderRadius).toBe(radii.button);
  expect(s.backgroundColor).toBe(colors.bla);
});
