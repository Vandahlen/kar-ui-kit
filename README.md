# kar-ui-kit

Shared Chalmers Studentkår ("Kårappen") design-system primitives -
theme tokens, `ChalmersText`, `ChalmersButton`, and a small hand-
authored icon set. Consumed by `agila`, `study-rooms`, and
`Chalmers-app-sommaren-2026` as a local `file:` dependency.

## Using this package

In a consuming repo's `package.json`:

```json
"dependencies": {
  "kar-ui-kit": "file:../kar-ui-kit"
}
```

Then `npm install` and import what you need:

```ts
import { ThemeProvider, useTheme, ChalmersText, ChalmersButton, SearchIcon, FlagUK, FlagSE } from 'kar-ui-kit';
```

Because `kar-ui-kit` is set up with a Metro `watchFolders` entry in each
consuming repo (see "Required Metro/Jest setup" below), source edits here
are picked up live - no reinstall needed. Consuming repos only need to
re-run `npm install` if kar-ui-kit's own dependencies change (e.g. after
editing this package's `package.json`).

## Required Metro/Jest setup

`kar-ui-kit` is pulled in via a `file:` dependency, which npm resolves as
a symlink into the consumer's `node_modules`. That means code physically
living in `kar-ui-kit`'s own directory - which ships its own
`node_modules` (react, react-native, react-native-svg, @babel/runtime,
etc., installed for this package's own devDependency-driven tests) - can
have its bare-specifier requires resolve to **its own** copies instead of
the consumer's. That produces duplicate React instances ("Invalid hook
call") and duplicate React Native bridge/native-module singletons
(`BatchedBridge`, `NativeModules`, `TurboModuleRegistry`, etc.), plus a
second copy of `react-native-svg`.

Every consuming repo needs BOTH of the following, or it will silently end
up bundling duplicate copies of these singleton packages:

**`metro.config.js`** - redirect any bare-specifier require made by code
physically inside `kar-ui-kit` to resolve from the consumer's own root:

```js
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const KAR_UI_KIT_PATH = path.resolve(__dirname, '..', 'kar-ui-kit');

function isBareSpecifier(moduleName) {
  return !moduleName.startsWith('.') && !moduleName.startsWith('/');
}

const config = {
  watchFolders: [KAR_UI_KIT_PATH],
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      const requestingFromKarUiKit = context.originModulePath.startsWith(KAR_UI_KIT_PATH);
      if (requestingFromKarUiKit && isBareSpecifier(moduleName)) {
        return context.resolveRequest(
          { ...context, originModulePath: path.join(__dirname, 'metro.config.js') },
          moduleName,
          platform,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

**`jest.config.js`** - map the same singleton packages (including deep
imports and `react-native-svg`) to the consumer's own copies:

```js
moduleNameMapper: {
  '^react$': require.resolve('react'),
  '^react/(.*)$': '<rootDir>/node_modules/react/$1',
  '^react-native$': require.resolve('react-native'),
  '^react-native/(.*)$': '<rootDir>/node_modules/react-native/$1',
  '^react-native-svg$': require.resolve('react-native-svg'),
},
```

## What's NOT here

i18n (`I18nContext`/`translations`) stays duplicated per consuming
app - each app's `Translation` interface has entirely different
keys, so there's nothing to share yet beyond the pattern itself.
