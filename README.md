# kar-ui-kit

Shared Chalmers Studentkår ("Kårappen") design-system primitives -
theme tokens, `ChalmersText`, `ChalmersButton`, and a small hand-
authored icon set. Consumed by `agila`, `study-rooms`, and
`Chalmers-app-sommaren-2026` as a local `file:` dependency.

## Design tokens

Everything below was **measured from the shipping Karappen**
(`com.helo.karappen` v2.2.0-csu) via lossless screencaps: colours sampled
per element, radii fitted as circular arcs, translucent fills solved over two
different backdrops. Where a value is *not* measured it says so.

### Brand palette

| Token | Hex | Notes |
|---|---|---|
| `bla` | `#00ACFF` | also ships a 24% tint, `#00ACFF3D` |
| `gron` | `#27AD72` | |
| `orange` | `#F86600` | |
| `turkos` | `#7CCDC2` | |
| `rod` | `#D8004D` | semantic: errors |
| `mattRod` | `#F8686D` | |
| `lila` | `#843690` | used only in the decorative layer |
| `varmGra` | `#634C3D` | **unverified** - never observed in the app |

### Section accents

Karappen has **no single app-wide primary**. Each bottom-tab section owns a
brand colour, and `theme.primary` resolves from the nearest enclosing
`<ThemeProvider section=...>`. Every one matched its token exactly:

`hem` -> bla | `mat` -> gron | `event` -> orange | `extra` -> turkos

### Surfaces (dark-only)

The app ignores the system colour scheme - forcing a device to light mode
produces a pixel-identical screen - so `ThemeProvider` is always dark.

| Token | Value | |
|---|---|---|
| `surfaces.background` | `#19242B` | base of the decorative wallpaper |
| `surfaces.elevated` | `#222D34` | tab bar; exact bundle literal |
| `surfaces.card` | `rgba(34,45,52,0.8)` | translucent over the background |
| `surfaces.chrome` | `#374750` | search field, filter button, segmented control |
| `surfaces.listCard` | `rgba(55,71,80,0.5)` | media list cards |
| `surfaces.overlay` / `border` | `rgba(255,255,255,0.2)` | solved with err 0 |
| `surfaces.tagOverlay` | `rgba(0,0,0,0.3)` | tag chips over photography |
| `surfaces.subText` | `#CBD4D8` | muted text, inactive icons |

### Radii

`card` 12 | `chip` 12 | `control` 5 | `button` 16 | `tabBar` 16

The primary button is **not** a pill - it measured 16dp at 50dp tall.

### Type scale

Open Sans (Light 300 through ExtraBold 800). Sizes in `typography`:
Titel 30, H1 20, H2 16, Subheading1 11, Paragraph1 16, Paragraph2 13,
Caption1 12, Caption2 10, Label 10.

`paragraph1.lineHeight` is **22**, measured from two independent 16sp blocks
that agreed exactly. The other variants have no measured lineHeight.
`subheading1.letterSpacing: 0.5` is **unverified** - it comes from the printed
graphic profile, and two independent measurement methods disagreed by enough
to flip its sign, so it was left as a labelled guess.

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
