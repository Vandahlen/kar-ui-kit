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

After editing anything in this package, consuming repos need to
re-run `npm install` to pick up the change (a `file:` dependency is
copied/symlinked at install time, not live-watched).

## What's NOT here

i18n (`I18nContext`/`translations`) stays duplicated per consuming
app - each app's `Translation` interface has entirely different
keys, so there's nothing to share yet beyond the pattern itself.
