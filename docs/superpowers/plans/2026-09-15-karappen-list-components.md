# Kårappen List Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the six Kårappen components that `kar-ui-kit` does not yet have — search field, filter button, segmented control, tag chip, media card, and the decorative background layer they are designed to sit on — built against measured specs rather than guesses.

**Architecture:** Each component is a single presentational file in `components/`, following the existing `ChalmersText` / `ChalmersButton` house style: default export, exported `*Props` interface, JSDoc header, styles in a `StyleSheet.create` block at the bottom. Every dimension and colour comes from `theme/theme.ts` or `theme/componentSpecs.ts` — no literals in component files. Section-dependent colours (accents) are read at render time from `useTheme().primary`, which resolves from the nearest enclosing `ThemeProvider section=...`.

**Tech Stack:** React 19.2.3, React Native 0.86.0, react-native-svg ^15.15.5, TypeScript 5.8, Jest 29 with `@react-native/jest-preset`, `react-test-renderer` 19.2.3.

## Global Constraints

These apply to **every** task. They are not repeated per task.

- **All numbers and colours come from tokens.** Import from `../theme/theme` (`surfaces`, `radii`, `spacing`, `typography`, `borderWidth`) or `../theme/componentSpecs`. A raw hex string or magic dp number in a component file is a defect.
- **`react-test-renderer` requires `act()` in React 19.** `renderer.create(...)` outside `act()` returns `null` from `toJSON()` and every assertion silently fails. Always use the `renderWithTheme` helper from Task 1.
- **The app is dark-only.** `useColorScheme()` returns `null` under Jest, which yields the *light* theme. Task 1 adds a global Jest mock forcing `'dark'`. Do not remove it.
- **Colours in `react-native-svg` props are transformed.** A rendered `<Line stroke="#fff">` appears as `{"type":0,"payload":4294967295}`, not `"#fff"`. Never assert on colour values inside SVG nodes; assert on `strokeWidth`, coordinates, or on the `color` prop passed to the icon component.
- **Style assertions must target the host node.** `findAllByProps({ testID })` returns composite wrappers *and* the host element. Only the host carries the component's internal style. Use the `styleOf` helper from Task 1.
- **Comments and JSDoc are ASCII.** Existing files write "Karappen", not "Kårappen". Swedish characters are fine in user-facing string defaults (e.g. `'Sök'`), not in comments.
- **Every component takes `testID?: string` and `style?: StyleProp<ViewStyle>`**, applied to its root element, with `style` last so callers can override.
- **Run `npx tsc --noEmit -p .` and `npx eslint .` before each commit.** Both must be clean.
- **End every commit message with:**
  ```
  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
  ```

## Provenance note

Numbers in `theme/componentSpecs.ts` were measured from lossless screencaps of `com.helo.karappen` v2.2.0-csu at density 3.0; radii are circle-arc fits with sub-pixel error, translucent fills solved over two backdrops. Two values are **explicitly not measured** and are flagged inline where they appear:

- `mediaCard.sectionRule.color` — marked `confidence: 'approximate'` in the spec file.
- Media card title/subtitle **type variants** — chosen by eye in Task 6, flagged in code.

Do not silently "clean up" those flags.

## File Structure

| File | Responsibility |
|---|---|
| `jest.setup.js` (create) | Global `useColorScheme` → `'dark'` mock |
| `jest.config.js` (modify) | Register `setupFiles` |
| `test-utils.tsx` (create) | `renderWithTheme`, `styleOf`, `hostWithTestID` |
| `components/ChalmersSearchField.tsx` (create) | Search input row |
| `components/ChalmersFilterButton.tsx` (create) | Filter button with optional count |
| `components/ChalmersSegmentedControl.tsx` (create) | Two-segment switch |
| `components/ChalmersTagChip.tsx` (create) | Category tag over imagery |
| `components/ChalmersMediaCard.tsx` (create) | List card with media strip |
| `theme/backgroundShapes.ts` (create) | Extracted decorative shape polygons |
| `components/ChalmersBackground.tsx` (create) | Decorative layer the translucent surfaces sit on |
| `components/*.test.tsx` (create) | One colocated test file per component |
| `index.ts` (modify) | Public exports, appended per task |

Tests are colocated beside components, matching the existing `theme/theme.test.ts`. `test-utils.tsx` lives at the repo root and is **not** exported from `index.ts` — it is test-only.

---

### Task 1: Test infrastructure

Without this, every later task's tests render the light theme and assert against `null`. Build it first.

**Files:**
- Create: `jest.setup.js`
- Modify: `jest.config.js`
- Create: `test-utils.tsx`
- Test: `test-utils.test.tsx`

**Interfaces:**
- Consumes: `ThemeProvider`, `Section` from `theme/ThemeContext` and `theme/theme`.
- Produces:
  - `renderWithTheme(ui: React.ReactElement, section?: Section): renderer.ReactTestRenderer`
  - `hostWithTestID(r: renderer.ReactTestRenderer, testID: string): renderer.ReactTestInstance`
  - `styleOf(r: renderer.ReactTestRenderer, testID: string): ViewStyle & TextStyle`

- [ ] **Step 1: Write the failing test**

Create `test-utils.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test-utils -t "renders in the dark theme"`
Expected: FAIL — `Cannot find module './test-utils'`.

- [ ] **Step 3: Create the Jest setup file**

Create `jest.setup.js`:

```js
// Karappen is dark-only. Under Jest, useColorScheme() returns null, which
// yields the LIGHT theme and makes every surface assertion wrong. Force dark.
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'dark'),
}));
```

- [ ] **Step 4: Register it in `jest.config.js`**

Replace the whole file with:

```js
module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
};
```

- [ ] **Step 5: Write the helpers**

Create `test-utils.tsx`:

```tsx
/**
 * test-utils.tsx
 *
 * Test-only helpers. NOT exported from index.ts.
 *
 * Two non-obvious things this exists to hide:
 *   1. React 19 requires renderer.create() inside act(); without it toJSON()
 *      returns null and assertions pass vacuously or fail confusingly.
 *   2. findAllByProps({testID}) returns composite wrappers AND the host
 *      element. Only the host carries the component's internal style.
 */
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeProvider } from './theme/ThemeContext';
import { Section } from './theme/theme';

export function renderWithTheme(
  ui: React.ReactElement,
  section?: Section,
): renderer.ReactTestRenderer {
  let r: renderer.ReactTestRenderer;
  act(() => {
    r = renderer.create(<ThemeProvider section={section}>{ui}</ThemeProvider>);
  });
  return r!;
}

export function hostWithTestID(
  r: renderer.ReactTestRenderer,
  testID: string,
): renderer.ReactTestInstance {
  const host = r.root
    .findAllByProps({ testID })
    .find(n => typeof n.type === 'string');
  if (!host) {
    throw new Error(`No host element with testID "${testID}"`);
  }
  return host;
}

export function styleOf(
  r: renderer.ReactTestRenderer,
  testID: string,
): ViewStyle & TextStyle {
  return StyleSheet.flatten(
    hostWithTestID(r, testID).props.style,
  ) as ViewStyle & TextStyle;
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx jest test-utils`
Expected: PASS, 3 tests.

- [ ] **Step 7: Verify the existing suite still passes**

Run: `npx jest`
Expected: PASS, 8 tests across 2 suites (5 existing + 3 new).

- [ ] **Step 8: Typecheck, lint, commit**

```bash
npx tsc --noEmit -p . && npx eslint .
git add jest.setup.js jest.config.js test-utils.tsx test-utils.test.tsx
git commit -m "$(cat <<'EOF'
test: add dark-theme render helpers for component tests

React 19 needs act() around renderer.create, and useColorScheme returns
null under Jest which would render the light theme.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: ChalmersSearchField

Measured: 42dp tall, `radii.control` radius, opaque `surfaces.chrome` fill, 15dp left padding, 16sp placeholder.

**Files:**
- Create: `components/ChalmersSearchField.tsx`
- Test: `components/ChalmersSearchField.test.tsx`
- Modify: `index.ts`

**Interfaces:**
- Consumes: `renderWithTheme`, `styleOf` (Task 1); existing `SearchIcon` from `./icons/SearchIcon` (props `{ size?: number; color: string; style?: StyleProp<ViewStyle> }`).
- Produces: `ChalmersSearchField`, `ChalmersSearchFieldProps { value: string; onChangeText: (t: string) => void; placeholder?: string; style?: StyleProp<ViewStyle>; testID?: string }`

- [ ] **Step 1: Write the failing test**

Create `components/ChalmersSearchField.test.tsx`:

```tsx
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
```

Note: `componentSpecs` is re-exported through `theme/theme`? It is **not** — it lives in `theme/componentSpecs.ts`. Import it as shown below instead:

```tsx
import { surfaces, radii } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';
```

Use these two import lines in place of the single combined one above.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest ChalmersSearchField`
Expected: FAIL — `Cannot find module './ChalmersSearchField'`.

- [ ] **Step 3: Write the implementation**

Create `components/ChalmersSearchField.tsx`:

```tsx
/**
 * components/ChalmersSearchField.tsx
 *
 * Search input used on the mat and event tabs.
 *
 * Measured from the shipping Karappen (v2.2.0-csu): 42dp tall, arc-fit 4.7dp
 * radius, opaque #374750 fill, 15dp left padding, 16sp placeholder.
 */
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import SearchIcon from './icons/SearchIcon';
import { surfaces, radii, typography, spacing } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';
import { useTheme } from '../theme/ThemeContext';

export interface ChalmersSearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ChalmersSearchField: React.FC<ChalmersSearchFieldProps> = ({
  value,
  onChangeText,
  placeholder = 'Sök',
  style,
  testID,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <SearchIcon size={20} color={surfaces.subText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={surfaces.subText}
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: componentSpecs.searchField.height,
    borderRadius: radii.control,
    backgroundColor: surfaces.chrome,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: componentSpecs.searchField.paddingLeft,
    gap: spacing.sm + 4,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: typography.paragraph1.fontFamily,
    fontSize: componentSpecs.searchField.placeholderSize,
  },
});

export default ChalmersSearchField;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest ChalmersSearchField`
Expected: PASS, 3 tests.

- [ ] **Step 5: Export it**

Append to `index.ts`:

```ts
export { default as ChalmersSearchField } from './components/ChalmersSearchField';
export type { ChalmersSearchFieldProps } from './components/ChalmersSearchField';
```

- [ ] **Step 6: Typecheck, lint, commit**

```bash
npx tsc --noEmit -p . && npx eslint . && npx jest
git add components/ChalmersSearchField.tsx components/ChalmersSearchField.test.tsx index.ts
git commit -m "$(cat <<'EOF'
feat: add ChalmersSearchField from measured app specs

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: ChalmersFilterButton

Measured: 42dp tall (shares the search field's row), `radii.control`, opaque `surfaces.chrome`, 21dp left padding, 12sp uppercase label. The bars icon renders in the **section accent**; the label renders in the normal text colour.

**Files:**
- Create: `components/ChalmersFilterButton.tsx`
- Test: `components/ChalmersFilterButton.test.tsx`
- Modify: `index.ts`

**Interfaces:**
- Consumes: `renderWithTheme`, `styleOf` (Task 1); existing `FilterIcon` and `ChalmersText`.
- Produces: `ChalmersFilterButton`, `ChalmersFilterButtonProps { onPress: () => void; label?: string; count?: number; style?: StyleProp<ViewStyle>; testID?: string }`

- [ ] **Step 1: Write the failing test**

Create `components/ChalmersFilterButton.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest ChalmersFilterButton`
Expected: FAIL — `Cannot find module './ChalmersFilterButton'`.

- [ ] **Step 3: Write the implementation**

Create `components/ChalmersFilterButton.tsx`:

```tsx
/**
 * components/ChalmersFilterButton.tsx
 *
 * "FILTER" / "FILTER (n)" button that shares a row with ChalmersSearchField.
 *
 * Measured from the shipping Karappen (v2.2.0-csu): 42dp tall, arc-fit 4.3dp
 * radius, opaque #374750 fill, 21dp left padding, 12sp uppercase label.
 * The bars icon takes the section accent; the label takes the text colour.
 */
import React from 'react';
import {
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import ChalmersText from './ChalmersText';
import FilterIcon from './icons/FilterIcon';
import { surfaces, radii, spacing } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';
import { useTheme } from '../theme/ThemeContext';

export interface ChalmersFilterButtonProps {
  onPress: () => void;
  label?: string;
  count?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ChalmersFilterButton: React.FC<ChalmersFilterButtonProps> = ({
  onPress,
  label = 'FILTER',
  count,
  style,
  testID,
}) => {
  const theme = useTheme();
  const text = count === undefined ? label : `${label} (${count})`;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="button"
    >
      <ChalmersText variant="caption1" color={theme.text} style={styles.label}>
        {text}
      </ChalmersText>
      <FilterIcon size={20} color={theme.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: componentSpecs.filterButton.height,
    borderRadius: radii.control,
    backgroundColor: surfaces.chrome,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: componentSpecs.filterButton.paddingLeft,
    gap: spacing.sm + 2,
  },
  label: {
    fontWeight: '600',
  },
});

export default ChalmersFilterButton;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest ChalmersFilterButton`
Expected: PASS, 5 tests.

- [ ] **Step 5: Export it**

Append to `index.ts`:

```ts
export { default as ChalmersFilterButton } from './components/ChalmersFilterButton';
export type { ChalmersFilterButtonProps } from './components/ChalmersFilterButton';
```

- [ ] **Step 6: Typecheck, lint, commit**

```bash
npx tsc --noEmit -p . && npx eslint . && npx jest
git add components/ChalmersFilterButton.tsx components/ChalmersFilterButton.test.tsx index.ts
git commit -m "$(cat <<'EOF'
feat: add ChalmersFilterButton with section-accent icon

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: ChalmersSegmentedControl

Measured: container 44dp tall, `radii.control`, `surfaces.chrome`; active pill 26dp tall, `radii.control`, filled with the **section accent**, inset 5dp horizontally and 9dp vertically. Labels 12sp uppercase — active white, inactive `surfaces.mutedLabel`.

**Files:**
- Create: `components/ChalmersSegmentedControl.tsx`
- Test: `components/ChalmersSegmentedControl.test.tsx`
- Modify: `index.ts`

**Interfaces:**
- Consumes: `renderWithTheme`, `styleOf` (Task 1); `ChalmersText`.
- Produces: `ChalmersSegmentedControl`, `ChalmersSegmentedControlProps { segments: string[]; selectedIndex: number; onChange: (index: number) => void; style?: StyleProp<ViewStyle>; testID?: string }`

- [ ] **Step 1: Write the failing test**

Create `components/ChalmersSegmentedControl.test.tsx`:

```tsx
import React from 'react';
import { Text } from 'react-native';
import { renderWithTheme, styleOf } from '../test-utils';
import ChalmersSegmentedControl from './ChalmersSegmentedControl';
import { surfaces, radii, colors } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';

const SEGMENTS = ['EVENTKALENDER', 'BOKNINGAR'];

test('matches the measured container geometry', () => {
  const r = renderWithTheme(
    <ChalmersSegmentedControl
      testID="sc"
      segments={SEGMENTS}
      selectedIndex={0}
      onChange={() => {}}
    />,
  );
  const s = styleOf(r, 'sc');
  expect(s.height).toBe(componentSpecs.segmentedControl.height);
  expect(s.borderRadius).toBe(radii.control);
  expect(s.backgroundColor).toBe(surfaces.chrome);
});

test('fills the active segment with the section accent', () => {
  const r = renderWithTheme(
    <ChalmersSegmentedControl
      testID="sc"
      segments={SEGMENTS}
      selectedIndex={0}
      onChange={() => {}}
    />,
    'event',
  );
  const s = styleOf(r, 'sc-segment-0');
  expect(s.backgroundColor).toBe(colors.orange);
  expect(s.height).toBe(componentSpecs.segmentedControl.activeHeight);
});

test('leaves the inactive segment unfilled', () => {
  const r = renderWithTheme(
    <ChalmersSegmentedControl
      testID="sc"
      segments={SEGMENTS}
      selectedIndex={0}
      onChange={() => {}}
    />,
    'event',
  );
  expect(styleOf(r, 'sc-segment-1').backgroundColor).toBeUndefined();
});

test('renders every segment label', () => {
  const r = renderWithTheme(
    <ChalmersSegmentedControl
      testID="sc"
      segments={SEGMENTS}
      selectedIndex={0}
      onChange={() => {}}
    />,
  );
  const labels = r.root.findAllByType(Text).map(n => n.props.children);
  expect(labels).toEqual(SEGMENTS);
});

test('reports the tapped index', () => {
  const onChange = jest.fn();
  const r = renderWithTheme(
    <ChalmersSegmentedControl
      testID="sc"
      segments={SEGMENTS}
      selectedIndex={0}
      onChange={onChange}
    />,
  );
  const pressable = r.root
    .findAllByProps({ testID: 'sc-segment-1' })
    .find(n => typeof n.type !== 'string' && n.props.onPress);
  pressable!.props.onPress();
  expect(onChange).toHaveBeenCalledWith(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest ChalmersSegmentedControl`
Expected: FAIL — `Cannot find module './ChalmersSegmentedControl'`.

- [ ] **Step 3: Write the implementation**

Create `components/ChalmersSegmentedControl.tsx`:

```tsx
/**
 * components/ChalmersSegmentedControl.tsx
 *
 * Two-segment switch (EVENTKALENDER / BOKNINGAR on the event tab).
 *
 * Measured from the shipping Karappen (v2.2.0-csu): container 44dp tall with
 * an arc-fit 4.7dp radius on #374750; active pill 26dp tall, same radius,
 * inset 5dp horizontally and 9dp vertically, filled with the SECTION ACCENT.
 * Labels are 12sp uppercase - active white, inactive #9BA3A7.
 */
import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import ChalmersText from './ChalmersText';
import { colors, surfaces, radii } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';
import { useTheme } from '../theme/ThemeContext';

export interface ChalmersSegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const spec = componentSpecs.segmentedControl;

const ChalmersSegmentedControl: React.FC<ChalmersSegmentedControlProps> = ({
  segments,
  selectedIndex,
  onChange,
  style,
  testID,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      {segments.map((label, i) => {
        const active = i === selectedIndex;
        return (
          <Pressable
            key={label}
            onPress={() => onChange(i)}
            testID={testID ? `${testID}-segment-${i}` : undefined}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.segment,
              active && { backgroundColor: theme.primary },
            ]}
          >
            <ChalmersText
              variant="caption1"
              color={active ? colors.white : surfaces.mutedLabel}
              style={styles.label}
            >
              {label}
            </ChalmersText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: spec.height,
    borderRadius: radii.control,
    backgroundColor: surfaces.chrome,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spec.activeInset,
  },
  segment: {
    flex: 1,
    height: spec.activeHeight,
    borderRadius: radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});

export default ChalmersSegmentedControl;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest ChalmersSegmentedControl`
Expected: PASS, 5 tests.

- [ ] **Step 5: Export it**

Append to `index.ts`:

```ts
export { default as ChalmersSegmentedControl } from './components/ChalmersSegmentedControl';
export type { ChalmersSegmentedControlProps } from './components/ChalmersSegmentedControl';
```

- [ ] **Step 6: Typecheck, lint, commit**

```bash
npx tsc --noEmit -p . && npx eslint . && npx jest
git add components/ChalmersSegmentedControl.tsx components/ChalmersSegmentedControl.test.tsx index.ts
git commit -m "$(cat <<'EOF'
feat: add ChalmersSegmentedControl with section-accent active pill

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: ChalmersTagChip

Measured: 23dp tall, `radii.control`, fill `surfaces.tagOverlay` (`rgba(0,0,0,0.3)` — solved at both edges as pure black with no tint), 10dp horizontal padding, 12sp uppercase label in the **section accent**. Width hugs the label.

**Files:**
- Create: `components/ChalmersTagChip.tsx`
- Test: `components/ChalmersTagChip.test.tsx`
- Modify: `index.ts`

**Interfaces:**
- Consumes: `renderWithTheme`, `styleOf` (Task 1); `ChalmersText`.
- Produces: `ChalmersTagChip`, `ChalmersTagChipProps { label: string; style?: StyleProp<ViewStyle>; testID?: string }`

- [ ] **Step 1: Write the failing test**

Create `components/ChalmersTagChip.test.tsx`:

```tsx
import React from 'react';
import { Text } from 'react-native';
import { renderWithTheme, styleOf } from '../test-utils';
import ChalmersTagChip from './ChalmersTagChip';
import { surfaces, radii, colors } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';

test('matches the measured chip geometry', () => {
  const r = renderWithTheme(<ChalmersTagChip testID="tc" label="ÖVRIGT" />);
  const s = styleOf(r, 'tc');
  expect(s.height).toBe(componentSpecs.tagChip.height);
  expect(s.borderRadius).toBe(radii.control);
  expect(s.backgroundColor).toBe(surfaces.tagOverlay);
});

test('hugs its label rather than filling the row', () => {
  const r = renderWithTheme(<ChalmersTagChip testID="tc" label="ÖVRIGT" />);
  expect(styleOf(r, 'tc').alignSelf).toBe('flex-start');
});

test('colours the label with the section accent', () => {
  const r = renderWithTheme(
    <ChalmersTagChip testID="tc" label="ÖVRIGT" />,
    'event',
  );
  expect(r.root.findByType(Text).props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ color: colors.orange }),
    ]),
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest ChalmersTagChip`
Expected: FAIL — `Cannot find module './ChalmersTagChip'`.

- [ ] **Step 3: Write the implementation**

Create `components/ChalmersTagChip.tsx`:

```tsx
/**
 * components/ChalmersTagChip.tsx
 *
 * Category tag shown over event artwork ("MOTEN & WORKSHOP").
 *
 * Measured from the shipping Karappen (v2.2.0-csu): 23dp tall, arc-fit 5.3dp
 * radius, 10dp horizontal padding, 12sp uppercase label in the SECTION ACCENT.
 * The fill solved to pure black at 30% over two different backdrops - it is
 * NOT a tinted grey (a #374750 fit gives inconsistent per-channel alphas).
 */
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import ChalmersText from './ChalmersText';
import { surfaces, radii } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';
import { useTheme } from '../theme/ThemeContext';

export interface ChalmersTagChipProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ChalmersTagChip: React.FC<ChalmersTagChipProps> = ({
  label,
  style,
  testID,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <ChalmersText variant="caption1" color={theme.primary} style={styles.label}>
        {label}
      </ChalmersText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: componentSpecs.tagChip.height,
    borderRadius: radii.control,
    backgroundColor: surfaces.tagOverlay,
    paddingHorizontal: componentSpecs.tagChip.paddingLeft,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});

export default ChalmersTagChip;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest ChalmersTagChip`
Expected: PASS, 3 tests.

- [ ] **Step 5: Export it**

Append to `index.ts`:

```ts
export { default as ChalmersTagChip } from './components/ChalmersTagChip';
export type { ChalmersTagChipProps } from './components/ChalmersTagChip';
```

- [ ] **Step 6: Typecheck, lint, commit**

```bash
npx tsc --noEmit -p . && npx eslint . && npx jest
git add components/ChalmersTagChip.tsx components/ChalmersTagChip.test.tsx index.ts
git commit -m "$(cat <<'EOF'
feat: add ChalmersTagChip with black-30 overlay fill

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: ChalmersMediaCard

Measured: 16dp horizontal margins, arc-fit 12.3dp radius (matches `radii.card`), fill `surfaces.listCard` (`rgba(55,71,80,0.5)` — solved with **err=0**, and the same rgba string is itself a literal in the app bundle), 1dp `surfaces.border` hairline, media strip inset 20dp from the card's content edge and 72dp tall.

**Unverified in this task:** the title and subtitle **type variants** are chosen by eye, not measured. They are flagged in the code with a comment. Do not remove the flag; verify against a device before relying on them.

**Files:**
- Create: `components/ChalmersMediaCard.tsx`
- Test: `components/ChalmersMediaCard.test.tsx`
- Modify: `index.ts`

**Interfaces:**
- Consumes: `renderWithTheme`, `styleOf` (Task 1); `ChalmersText`.
- Produces: `ChalmersMediaCard`, `ChalmersMediaCardProps { title: string; subtitle?: string; imageSource?: ImageSourcePropType; onPress?: () => void; children?: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string }`

- [ ] **Step 1: Write the failing test**

Create `components/ChalmersMediaCard.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest ChalmersMediaCard`
Expected: FAIL — `Cannot find module './ChalmersMediaCard'`.

- [ ] **Step 3: Write the implementation**

Create `components/ChalmersMediaCard.tsx`:

```tsx
/**
 * components/ChalmersMediaCard.tsx
 *
 * Restaurant / event list card with an optional media strip.
 *
 * Measured from the shipping Karappen (v2.2.0-csu): 16dp margins, arc-fit
 * 12.3dp radius, 1dp white-20% hairline border, media strip inset 20dp from
 * the content edge and 72dp tall.
 *
 * The fill is #374750 at 50% - solved with err=0, and `rgba(55, 71, 80, 0.5)`
 * is itself a literal in the app bundle, so it is confirmed twice over. Do not
 * flatten it to an opaque colour: the card is translucent over the decorative
 * wallpaper and must reveal it.
 */
import React from 'react';
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import ChalmersText from './ChalmersText';
import { surfaces, radii, borderWidth, spacing } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';

export interface ChalmersMediaCardProps {
  title: string;
  subtitle?: string;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const spec = componentSpecs.mediaCard;

const ChalmersMediaCard: React.FC<ChalmersMediaCardProps> = ({
  title,
  subtitle,
  imageSource,
  onPress,
  children,
  style,
  testID,
}) => {
  // Do NOT write `const Container = onPress ? Pressable : View`. That gives a
  // union component type and `View` rejects `onPress`, so it fails tsc.
  const content = (
    <>
      {/* UNVERIFIED: these two type variants were chosen by eye, not measured
          from the app. Verify on a device before relying on them. */}
      <ChalmersText variant="heading1">{title}</ChalmersText>
      {subtitle !== undefined && (
        <ChalmersText variant="paragraph2" color={surfaces.subText}>
          {subtitle}
        </ChalmersText>
      )}
      {imageSource !== undefined && (
        <Image
          source={imageSource}
          style={styles.image}
          testID={testID ? `${testID}-image` : undefined}
          resizeMode="cover"
        />
      )}
      {children}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.card, style]}
        testID={testID}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, style]} testID={testID}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    backgroundColor: surfaces.listCard,
    borderWidth: borderWidth.hairline,
    borderColor: surfaces.border,
    marginHorizontal: spec.marginHorizontal,
    paddingHorizontal: spec.imageInset,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  image: {
    height: spec.imageHeight,
    borderRadius: radii.sm,
    marginTop: spacing.sm,
  },
});

export default ChalmersMediaCard;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest ChalmersMediaCard`
Expected: PASS, 5 tests.

- [ ] **Step 5: Export it**

Append to `index.ts`:

```ts
export { default as ChalmersMediaCard } from './components/ChalmersMediaCard';
export type { ChalmersMediaCardProps } from './components/ChalmersMediaCard';
```

- [ ] **Step 6: Run the whole suite**

Run: `npx jest`
Expected: PASS — 29 tests across 7 suites (5 theme, 3 test-utils, 21 component: 3 + 5 + 5 + 3 + 5).

- [ ] **Step 7: Typecheck, lint, commit**

```bash
npx tsc --noEmit -p . && npx eslint . && npx jest
git add components/ChalmersMediaCard.tsx components/ChalmersMediaCard.test.tsx index.ts
git commit -m "$(cat <<'EOF'
feat: add ChalmersMediaCard with translucent list-card fill

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: ChalmersBackground — the decorative layer

**This is the task that makes everything else look right.** The other six components are translucent *by measurement* — `surfaces.card` is `rgba(34,45,52,0.8)` and `surfaces.listCard` is `rgba(55,71,80,0.5)`. They are designed to reveal a decorative layer beneath them. On a flat background they do not merely lack shapes, they read as muddy flat grey.

The background is **65% of the screen** in the shipping app.

**Provenance:** the shape polygons in `backgroundShapes.ts` were extracted programmatically from the app's own `assets_graphics_globalbackgroundcsu.png` — colour-segmented, connected-component labelled, convex-hulled and simplified, then each region solved back to a brand token and opacity (most with err 0–2 of 255). Coordinates are percentages of the viewport, so the layer scales to any screen the way the app's own full-bleed wallpaper does. This reproduces the design **without shipping their artwork file**, which also sidesteps the rights question.

**Files:**
- Create: `theme/backgroundShapes.ts`
- Create: `components/ChalmersBackground.tsx`
- Test: `components/ChalmersBackground.test.tsx`
- Modify: `index.ts`

**Interfaces:**
- Consumes: `renderWithTheme`, `styleOf` (Task 1); `colors` and `decorative` from `../theme/theme`.
- Produces: `ChalmersBackground`, `ChalmersBackgroundProps { children?: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string }`; plus `BACKGROUND_SHAPES` and the `ShapeToken` / `BackgroundShape` types.

- [ ] **Step 1: Write the failing test**

Create `components/ChalmersBackground.test.tsx`:

```tsx
import React from 'react';
import { Polygon } from 'react-native-svg';
import { renderWithTheme, styleOf } from '../test-utils';
import ChalmersBackground from './ChalmersBackground';
import { decorative } from '../theme/theme';
import { BACKGROUND_SHAPES } from '../theme/backgroundShapes';

test('paints the measured base colour', () => {
  const r = renderWithTheme(<ChalmersBackground testID="bg" />);
  expect(styleOf(r, 'bg').backgroundColor).toBe(decorative.base);
});

test('renders one polygon per extracted shape', () => {
  const r = renderWithTheme(<ChalmersBackground testID="bg" />);
  expect(r.root.findAllByType(Polygon)).toHaveLength(BACKGROUND_SHAPES.length);
});

test('every shape sits on one of the two measured opacity tiers', () => {
  const tiers = new Set(BACKGROUND_SHAPES.map(s => s.opacity));
  expect([...tiers].sort()).toEqual([
    decorative.shapeOpacity.low,
    decorative.shapeOpacity.high,
  ]);
});

test('renders children above the layer', () => {
  const r = renderWithTheme(
    <ChalmersBackground testID="bg">
      <ChalmersBackground testID="inner" />
    </ChalmersBackground>,
  );
  expect(styleOf(r, 'inner')).toBeDefined();
});
```

Note: do **not** assert on polygon `fill` colours — `react-native-svg` converts them to numeric payloads (see Global Constraints). `points` and `fillOpacity` survive as written.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest ChalmersBackground`
Expected: FAIL — `Cannot find module './ChalmersBackground'`.

- [ ] **Step 3: Create the shape data**

Create `theme/backgroundShapes.ts`:

```ts
/**
 * theme/backgroundShapes.ts
 *
 * The decorative shape layer, extracted from the shipping Karappen's own
 * background asset (assets_graphics_globalbackgroundcsu.png, 786x2954).
 *
 * Method: the asset was colour-segmented, its regions connected-component
 * labelled and convex-hulled, then each region solved back to a brand token
 * plus an opacity over `decorative.base`. Most regions matched a token with
 * an error of 0-2 of 255. Opacities snap to the two measured tiers (15% and
 * 40%) - individual regions measured 11-15% and 35-40%.
 *
 * Coordinates are PERCENTAGES of the viewport, rendered with
 * preserveAspectRatio="none", so the layer stretches to any screen the way
 * the app's own full-bleed wallpaper does.
 *
 * NOT included: the vivid full-opacity band across the top ~60dp of the list
 * tabs. It exists (see `decorative.headerBandHeight`) and differs per tab -
 * pixel-diffing two tabs shows 46% difference - but its geometry was never
 * extracted, so inventing it here would be a guess.
 */

/** Brand tokens the decorative layer draws with. */
export type ShapeToken =
  | 'bla'
  | 'lila'
  | 'rod'
  | 'mattRod'
  | 'orange'
  | 'gron'
  | 'turkos';

export interface BackgroundShape {
  token: ShapeToken;
  /** One of the two measured tiers: 0.15 or 0.4. */
  opacity: number;
  /** SVG polygon points, in viewport percentages. */
  points: string;
}

export const BACKGROUND_SHAPES: BackgroundShape[] = [
  { token: 'gron', opacity: 0.4, points: '73.3,10.3 99.6,12.2 99.6,27.6 87.8,31.1 64.5,27.3' },
  { token: 'bla', opacity: 0.4, points: '3.8,44.8 45.4,38.3 54.2,42.6 22.5,53.6' },
  { token: 'turkos', opacity: 0.4, points: '0.0,59.8 23.3,59.8 23.3,72.8 5.3,72.6 0.0,69.2' },
  { token: 'gron', opacity: 0.15, points: '21.0,79.2 41.2,77.7 59.5,82.8 53.8,89.4 37.4,89.3' },
  { token: 'gron', opacity: 0.15, points: '68.7,46.3 83.6,44.4 99.6,47.4 99.6,54.8 76.3,52.8' },
  { token: 'lila', opacity: 0.4, points: '49.2,57.6 74.8,53.7 98.1,55.6 85.9,60.3' },
  { token: 'bla', opacity: 0.15, points: '35.1,21.6 57.3,21.6 57.6,29.9 48.1,29.8' },
  { token: 'turkos', opacity: 0.15, points: '0.0,5.0 32.1,6.0 21.4,11.1 0.0,7.9' },
  { token: 'orange', opacity: 0.15, points: '56.5,63.8 77.9,64.9 92.4,69.5 89.7,75.9 65.6,69.6' },
  { token: 'lila', opacity: 0.15, points: '0.4,28.0 17.2,23.8 17.6,31.5 5.3,31.4' },
  { token: 'orange', opacity: 0.15, points: '74.8,67.1 88.9,70.4 87.8,72.0 79.8,71.0' },
];
```

- [ ] **Step 4: Write the component**

Create `components/ChalmersBackground.tsx`:

```tsx
/**
 * components/ChalmersBackground.tsx
 *
 * The decorative shape layer Karappen draws behind every screen, with the
 * screen's own content composited on top.
 *
 * Wrap a screen root in this. Without it, the translucent surfaces
 * (`surfaces.card` at 80%, `surfaces.listCard` at 50%) have nothing to
 * reveal and read as flat grey - the design depends on this layer.
 *
 * The shapes are brand tokens at two measured opacity tiers over
 * `decorative.base`. See theme/backgroundShapes.ts for provenance.
 */
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { colors, decorative } from '../theme/theme';
import { BACKGROUND_SHAPES } from '../theme/backgroundShapes';

export interface ChalmersBackgroundProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ChalmersBackground: React.FC<ChalmersBackgroundProps> = ({
  children,
  style,
  testID,
}) => (
  <View style={[styles.root, style]} testID={testID}>
    <Svg
      style={StyleSheet.absoluteFill}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      pointerEvents="none"
    >
      {BACKGROUND_SHAPES.map((shape, i) => (
        <Polygon
          key={i}
          points={shape.points}
          fill={colors[shape.token]}
          fillOpacity={shape.opacity}
        />
      ))}
    </Svg>
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: decorative.base,
  },
});

export default ChalmersBackground;
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx jest ChalmersBackground`
Expected: PASS, 4 tests.

- [ ] **Step 6: Export it**

Append to `index.ts`:

```ts
export { default as ChalmersBackground } from './components/ChalmersBackground';
export type { ChalmersBackgroundProps } from './components/ChalmersBackground';
export * from './theme/backgroundShapes';
```

- [ ] **Step 7: Run the whole suite**

Run: `npx jest`
Expected: PASS — 33 tests across 8 suites (29 from Task 6, plus these 4).

- [ ] **Step 8: Typecheck, lint, commit**

```bash
npx tsc --noEmit -p . && npx eslint . && npx jest
git add theme/backgroundShapes.ts components/ChalmersBackground.tsx components/ChalmersBackground.test.tsx index.ts
git commit -m "$(cat <<'EOF'
feat: add ChalmersBackground decorative shape layer

Shapes extracted from the app's own background asset and re-expressed as
brand tokens at the two measured opacity tiers, so the layer is reproduced
without shipping their artwork.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Notes for the implementer

**Why the components read `useTheme().primary` instead of importing an accent.** Kårappen has no single app-wide primary — each bottom-tab section owns a brand colour (`hem` → blå, `mat` → grön, `event` → orange, `extra` → turkos), and the accent is resolved from the nearest enclosing `<ThemeProvider section=...>`. Hardcoding `colors.bla` is correct on exactly one of the four tabs.

**Why `surfaces.chrome` is used directly rather than through `useTheme()`.** The measured surfaces belong to a dark-only app. `getTheme()`'s light branch is unverified — it comes from a printed profile doc, and the one value from that doc that could be checked (`varmGra`) turned out not to appear in the app at all. Using `surfaces.*` directly keeps these components honest about being dark-spec'd rather than implying a verified light mode.

**If a geometry assertion fails after a token change**, the spec file is the source of truth, not the component. `theme/componentSpecs.ts` records the measurement and its error bar; change it only with a new measurement.
