/* eslint-env jest */
// Karappen is dark-only. Under Jest, useColorScheme() returns null, which
// yields the LIGHT theme and makes every surface assertion wrong. Force dark.
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'dark'),
}));
