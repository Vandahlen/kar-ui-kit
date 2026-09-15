import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { surfaces, colors } from './theme/theme';

// Override the global dark mock: claim the DEVICE is in light mode.
// Karappen is dark-only, so the provider must ignore this entirely.
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'light'),
}));

function Probe() {
  const t = useTheme();
  return <Text>{`${t.background}|${t.text}|${t.primary}`}</Text>;
}

function render(ui: React.ReactElement) {
  let r: renderer.ReactTestRenderer;
  act(() => {
    r = renderer.create(ui);
  });
  return r!;
}

test('stays dark even when the device reports light mode', () => {
  const r = render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
  const out = r.root.findByType(Text).props.children;
  expect(out).toContain(surfaces.background);
  expect(out).toContain(colors.white);
});

test('section accent still resolves while forced dark', () => {
  const r = render(
    <ThemeProvider section="extra">
      <Probe />
    </ThemeProvider>,
  );
  expect(r.root.findByType(Text).props.children).toContain(colors.turkos);
});

test('an unwrapped consumer also gets dark, not the light default', () => {
  const r = render(<Probe />);
  expect(r.root.findByType(Text).props.children).toContain(surfaces.background);
});
