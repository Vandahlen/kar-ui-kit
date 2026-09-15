/* eslint-env jest */
// Karappen is dark-only and ThemeProvider now forces dark regardless of the
// device, so this mock no longer drives the theme. It stays as a guard for any
// component that reads the colour scheme directly: under Jest useColorScheme()
// returns null, which such a component would read as "light".
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'dark'),
}));
