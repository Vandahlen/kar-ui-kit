# App Token Adoption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the three Chalmers app modules actually render the corrected Kårappen design — by putting them all on `kar-ui-kit`'s measured tokens and making their accent colour follow the active section instead of being hardcoded blue.

**Architecture:** Two distinct problems. `agila` and `Study-rooms` already consume kit tokens correctly (zero hardcoded hex) and only need the *section accent* threaded through and hardcoded `colors.bla` replaced with `theme.primary`. `Arbetsmarknadsportal` is disconnected — it defines a private `getTheme` with stale values and never imports the kit's theme at all, so it needs a real migration.

**Tech Stack:** React 19.2.3, React Native 0.86.0, TypeScript, Jest 29 with `@react-native/jest-preset`, `react-test-renderer` 19.2.3, `kar-ui-kit` as a `file:` dependency.

## Global Constraints

These apply to **every** task and are not repeated per task.

- **These are FOUR SEPARATE GIT REPOS.** There is no umbrella repo — `C:\Users\jakob\Karappen` is not version-controlled. Each task commits inside its own app directory (`agila-chalmers-app` on `main`, `Study-rooms-chalmers-app` on `master`, `Arbetsmarknadsportal-chalmers-app` on `main`).
- **Every repo already has uncommitted changes that are NOT yours.** At time of writing: Arbetsmarknadsportal 6 files, Study-rooms 1, agila 1. **Never use `git add -A` or `git commit -a`.** Every `git add` in this plan names exact paths. Do not sweep in pre-existing work.
- **`colors.bla` is not always an accent.** Replace it with `theme.primary` **only where it is being used as the UI accent** (selection fills, active tabs, links, spinners, unread dots). Leave `colors.gron` and `colors.rod` alone — those are *semantic* (success / error), not accents, and must not follow the section. Replacing them is a defect.
- **`theme.primary` cannot be used inside `StyleSheet.create`.** It is resolved at render time from a hook. Where a static style currently holds `backgroundColor: colors.bla`, remove that key from the StyleSheet entry and apply it inline as `{ backgroundColor: theme.primary }` at the usage site.
- **Follow the existing render-test convention**, established in `Study-rooms-chalmers-app/screens/StudyRoomsScreen.test.tsx`: wrap `ReactTestRenderer.create` in `ReactTestRenderer.act(...)`, and unmount in an `afterEach` inside `act` to stop VirtualizedList timers outliving the test. React 19 returns `null` from `toJSON()` without `act`.
- **Do not touch `jest.config.js` in Study-rooms.** Its `moduleNameMapper` block redirects `react`, `react-native` and `react-native-svg` to this repo's copies because `kar-ui-kit` is a symlinked `file:` dep that ships its own `node_modules`. Removing it causes "Invalid hook call".
- **Run `npx tsc --noEmit` (where a `typecheck` script exists), `npx eslint .` and `npx jest` before each commit.** All must be clean.
- **`karkalender` is out of scope.** It is a vendored fork of `react-native-calendars` on RN 0.73 / React 18 — incompatible versions, third-party code, not one of your modules.
- **End every commit message with:**
  ```
  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
  ```

## DECISION REQUIRED before Task 1

Each module must declare which Kårappen section it lives under, because that chooses its accent colour:

| Section | Accent |
|---|---|
| `hem` | blå `#00ACFF` |
| `mat` | grön `#27AD72` |
| `event` | orange `#F86600` |
| `extra` | turkos `#7CCDC2` |

**This plan uses `extra` for all three modules**, because the `extra` tab ("Det lilla extra") is where the shipping app collects service modules — it lists things like *Utforska alla arrangörer*, *Träna på Fysiken* and *GoBookGo*, which is the same category of thing as a job portal, a room booker and an evaluation form.

**This is a product decision, not a measurement.** It is inferred from one screenshot, not confirmed. If the host app places any of these modules elsewhere, change the single `section` prop in that module's root — nothing else in the plan depends on which value is chosen. Each root also accepts an override so the host can pass its own.

## Scope and sequencing

**In scope:** token adoption, section threading, retiring the stale private theme.

**Explicitly deferred** to a follow-up after the *Kårappen List Components* plan ships, because the components do not exist yet:

- Replacing `Study-rooms/components/FilterBar.tsx`'s search row with `ChalmersSearchField`.
- Replacing `Study-rooms/components/TabSwitcher.tsx`'s internals with `ChalmersSegmentedControl`.

**Deliberately NOT in scope, and not a gap:**

- `RoomCard` is *not* migrated to `ChalmersMediaCard`. It has no image and no media strip; forcing the fit would be worse than leaving it. It only needs its accent fixed.
- `FilterBar`'s capacity / whiteboard / sort chips are *not* migrated to `ChalmersTagChip`. Those are **interactive selection chips**; `ChalmersTagChip` is a display-only label with a black-30% overlay designed to sit over photography. Different component. No measurement exists for selection chips, so their radius and padding stay as they are.
- `Arbetsmarknadsportal/chalmers-admin` is a React + Tailwind **web** sub-project with its own `#00ACFF` literals. Different platform, different toolchain, separate job.

## File Structure

| File | Change |
|---|---|
| `agila-chalmers-app/App.tsx` | Pass `section` to `ThemeProvider` |
| `agila-.../components/QuestionInput.tsx` | 3 accent sites → `theme.primary` |
| `agila-.../components/NotificationItem.tsx` | Unread dot → inline `theme.primary` |
| `agila-.../screens/WeeklyEvaluationScreen.tsx` | Spinner + submit button → `theme.primary` |
| `agila-.../components/QuestionInput.test.tsx` | Create — accent-follows-section test |
| `Study-rooms/example/ExampleUsage.tsx` | Pass `section` to `ThemeProvider` |
| `Study-rooms/components/TabSwitcher.tsx` | Active tab → `theme.primary` |
| `Study-rooms/components/FilterBar.tsx` | 3 accent sites → `theme.primary` |
| `Study-rooms/components/RoomCard.tsx` | Book link → `theme.primary` (leave `colors.gron`) |
| `Study-rooms/components/TabSwitcher.test.tsx` | Create — accent-follows-section test |
| `Arbetsmarknadsportal/App.tsx` | Delete private theme, adopt kit; typography + radii; StatusBar |
| `Arbetsmarknadsportal/__tests__/tokens.test.ts` | Create — stale-token regression guard |

---

### Task 1: agila — thread Section and follow the accent

**Working directory:** `C:\Users\jakob\Karappen\agila-chalmers-app`

**Files:**
- Modify: `App.tsx:145`
- Modify: `src/weekly-evaluation/components/QuestionInput.tsx:51,81,88`
- Modify: `src/weekly-evaluation/components/NotificationItem.tsx:98`
- Modify: `src/weekly-evaluation/screens/WeeklyEvaluationScreen.tsx:80,197`
- Test: `src/weekly-evaluation/components/QuestionInput.test.tsx`

**Interfaces:**
- Consumes: `ThemeProvider` (now accepts `section?: Section`), `useTheme()` returning `ThemeTokens` with `primary: string`, both from `kar-ui-kit`.
- Produces: nothing new for later tasks. Self-contained.

- [ ] **Step 1: Write the failing test**

Create `src/weekly-evaluation/components/QuestionInput.test.tsx`:

```tsx
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider, colors } from 'kar-ui-kit';
import QuestionInput from './QuestionInput';
import { I18nProvider } from '../i18n/I18nContext';
import { Question } from '../types/evaluation';

const SCALE_QUESTION: Question = {
  id: 'q1',
  order_index: 1,
  question_text: 'How was your week?',
  question_type: 'scale',
  scale_min: 1,
  scale_max: 5,
};

let activeRenderer: ReactTestRenderer.ReactTestRenderer | undefined;

afterEach(() => {
  ReactTestRenderer.act(() => {
    activeRenderer?.unmount();
  });
  activeRenderer = undefined;
});

function render(section: 'hem' | 'mat' | 'event' | 'extra') {
  ReactTestRenderer.act(() => {
    activeRenderer = ReactTestRenderer.create(
      <ThemeProvider section={section}>
        <I18nProvider>
          <QuestionInput
            question={SCALE_QUESTION}
            value={3}
            onChange={() => {}}
          />
        </I18nProvider>
      </ThemeProvider>,
    );
  });
  return activeRenderer!;
}

test('selected scale pill uses the section accent, not hardcoded blue', () => {
  const output = JSON.stringify(render('mat').toJSON());
  expect(output).toContain(colors.gron);
  expect(output).not.toContain(colors.bla);
});

test('the same component is blue under the hem section', () => {
  const output = JSON.stringify(render('hem').toJSON());
  expect(output).toContain(colors.bla);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest QuestionInput`
Expected: FAIL — the first test finds `#00ACFF` because the pill is hardcoded to `colors.bla`.

- [ ] **Step 3: Fix the three accent sites in QuestionInput.tsx**

At line 51, replace:

```tsx
                selected && { backgroundColor: colors.bla, borderColor: colors.bla },
```

with:

```tsx
                selected && { backgroundColor: theme.primary, borderColor: theme.primary },
```

At line 81, replace:

```tsx
                selected && { borderColor: colors.bla, backgroundColor: theme.selectedTint },
```

with:

```tsx
                selected && { borderColor: theme.primary, backgroundColor: theme.selectedTint },
```

At line 88, replace:

```tsx
                color={selected ? colors.bla : theme.text}
```

with:

```tsx
                color={selected ? theme.primary : theme.text}
```

`theme` is already in scope (`const theme = useTheme();`). `colors` is still used for `colors.white` in this file, so keep the import.

- [ ] **Step 4: Fix the unread dot in NotificationItem.tsx**

`backgroundColor` sits in a `StyleSheet.create` block, which cannot read the hook. Remove it from the static style — change the `unreadDot` entry to:

```tsx
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
```

Then find the element using `styles.unreadDot` and apply the colour inline:

```tsx
<View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
```

If `theme` is not already in scope in that component, add `const theme = useTheme();` at the top of its body — `useTheme` is already imported in this file.

- [ ] **Step 5: Fix the two accent sites in WeeklyEvaluationScreen.tsx**

At line 80, replace:

```tsx
        <ActivityIndicator color={colors.bla} size="large" />
```

with:

```tsx
        <ActivityIndicator color={theme.primary} size="large" />
```

At line 197, the submit button's `backgroundColor: colors.bla` is inside `StyleSheet.create`. Remove that key from the style entry, then apply it inline where the button is rendered:

```tsx
<Pressable style={[styles.submitButton, { backgroundColor: theme.primary }]}>
```

Leave the two `colors.rod` error-text usages untouched — those are semantic.

- [ ] **Step 6: Set the section on the app root**

In `App.tsx`, change line 145 from:

```tsx
    <ThemeProvider>
```

to:

```tsx
    {/* Section drives the accent colour. See the DECISION REQUIRED note in
        the adoption plan - `extra` is inferred, not measured. The kårapp host
        should pass its own section when it embeds this module. */}
    <ThemeProvider section="extra">
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx jest QuestionInput`
Expected: PASS, 2 tests.

- [ ] **Step 8: Run the whole suite**

Run: `npx jest`
Expected: PASS — all pre-existing suites still green.

- [ ] **Step 9: Lint and commit**

```bash
npx eslint .
git add App.tsx src/weekly-evaluation/components/QuestionInput.tsx src/weekly-evaluation/components/QuestionInput.test.tsx src/weekly-evaluation/components/NotificationItem.tsx src/weekly-evaluation/screens/WeeklyEvaluationScreen.tsx
git commit -m "$(cat <<'EOF'
feat: follow the section accent instead of hardcoded blue

Karappen has no single app-wide primary - each tab owns a brand colour.
Semantic gron/rod usages are deliberately left alone.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Study-rooms — thread Section and follow the accent

**Working directory:** `C:\Users\jakob\Karappen\Study-rooms-chalmers-app`

**Files:**
- Modify: `example/ExampleUsage.tsx:19`
- Modify: `components/TabSwitcher.tsx:30`
- Modify: `components/FilterBar.tsx:73,90,112`
- Modify: `components/RoomCard.tsx:68`
- Test: `components/TabSwitcher.test.tsx`

**Interfaces:**
- Consumes: same kit surface as Task 1. `RoomTab` type from `../hooks/useStudyRooms` (values `'bookable' | 'open'`).
- Produces: nothing new. Self-contained.

- [ ] **Step 1: Write the failing test**

Create `components/TabSwitcher.test.tsx`:

```tsx
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider, colors } from 'kar-ui-kit';
import TabSwitcher from './TabSwitcher';
import { I18nProvider } from '../i18n/I18nContext';

let activeRenderer: ReactTestRenderer.ReactTestRenderer | undefined;

afterEach(() => {
  ReactTestRenderer.act(() => {
    activeRenderer?.unmount();
  });
  activeRenderer = undefined;
});

function render(section: 'hem' | 'mat' | 'event' | 'extra') {
  ReactTestRenderer.act(() => {
    activeRenderer = ReactTestRenderer.create(
      <ThemeProvider section={section}>
        <I18nProvider>
          <TabSwitcher tab="bookable" onChange={() => {}} />
        </I18nProvider>
      </ThemeProvider>,
    );
  });
  return activeRenderer!;
}

test('active tab uses the section accent, not hardcoded blue', () => {
  const output = JSON.stringify(render('extra').toJSON());
  expect(output).toContain(colors.turkos);
  expect(output).not.toContain(colors.bla);
});

test('the same component is blue under the hem section', () => {
  const output = JSON.stringify(render('hem').toJSON());
  expect(output).toContain(colors.bla);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest TabSwitcher`
Expected: FAIL — the first test finds `#00ACFF`.

- [ ] **Step 3: Fix TabSwitcher.tsx**

At line 30, replace:

```tsx
        style={[styles.tab, selected && { backgroundColor: colors.bla }]}
```

with:

```tsx
        style={[styles.tab, selected && { backgroundColor: theme.primary }]}
```

`theme` is already in scope. `colors.white` is still used below, so keep the `colors` import.

- [ ] **Step 4: Fix the three accent sites in FilterBar.tsx**

Lines 73, 90 and 112 each contain the identical fragment:

```tsx
                selected && { backgroundColor: colors.bla, borderColor: colors.bla },
```

(line 90 uses `whiteboardOnly` rather than `selected` as the condition). In all three, replace `colors.bla` with `theme.primary` on both keys. `theme` is already in scope; `colors.white` is still used, so keep the import.

Do **not** change the chips' `radii.pill` or padding — no measurement exists for interactive selection chips.

- [ ] **Step 5: Fix the book link in RoomCard.tsx**

At line 68, replace:

```tsx
          <ChalmersText variant="paragraph2" color={colors.bla}>
```

with:

```tsx
          <ChalmersText variant="paragraph2" color={theme.primary}>
```

**Leave line 52 (`color={colors.gron}`) exactly as it is** — that is the "free until" success colour, semantic, not an accent.

- [ ] **Step 6: Set the section on the app root**

In `example/ExampleUsage.tsx`, change line 19 from:

```tsx
    <ThemeProvider>
```

to:

```tsx
    {/* Section drives the accent colour. See the DECISION REQUIRED note in
        the adoption plan - `extra` is inferred, not measured. */}
    <ThemeProvider section="extra">
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx jest TabSwitcher`
Expected: PASS, 2 tests.

- [ ] **Step 8: Run the whole suite and typecheck**

Run: `npx tsc --noEmit && npx jest`
Expected: PASS — `StudyRoomsScreen.test.tsx`, `roomFilters.test.ts`, `I18nContext.test.tsx` and the repository test all still green.

- [ ] **Step 9: Lint and commit**

```bash
npx eslint .
git add example/ExampleUsage.tsx components/TabSwitcher.tsx components/TabSwitcher.test.tsx components/FilterBar.tsx components/RoomCard.tsx
git commit -m "$(cat <<'EOF'
feat: follow the section accent instead of hardcoded blue

RoomCard's gron "free until" colour is semantic and left unchanged.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Arbetsmarknadsportal — adopt the kit theme

This is the task that actually fixes the mismatched design. The app currently defines its own `getTheme` with values that were corrected in the kit weeks of measurement ago and never propagated, because this app never imported the kit's theme.

**Working directory:** `C:\Users\jakob\Karappen\Arbetsmarknadsportal-chalmers-app`

**Files:**
- Modify: `App.tsx` — delete lines 68–85 (`BRAND_COLORS` + `getTheme`), rewire lines 147, 240, 256, 322, 329, and the root render
- Create: `__tests__/tokens.test.ts` (regression guard; extended again in Task 4)
- Test: `__tests__/App.test.tsx` (existing — must stay green)

**Interfaces:**
- Consumes: `ThemeProvider`, `useTheme`, `colors` from `kar-ui-kit`.
- Produces: the app root is wrapped in `ThemeProvider section="extra"`; every screen reads `useTheme()`. Task 4 depends on this.

- [ ] **Step 1: Write the failing test**

Create `__tests__/tokens.test.ts`:

```ts
import fs from 'fs';
import path from 'path';

const APP = fs.readFileSync(path.join(__dirname, '..', 'App.tsx'), 'utf8');

// Values from the printed profile doc that are NOT in the shipping app.
// Measured replacements live in kar-ui-kit's `surfaces`.
const STALE = ['#121212', '#634C3D', '#A0A0A0', '#333333', '#2C2C2C'];

test('App.tsx defines no private theme', () => {
  expect(APP).not.toContain('const getTheme');
  expect(APP).not.toContain('BRAND_COLORS');
});

test('App.tsx contains no stale surface colours', () => {
  const found = STALE.filter(hex => APP.includes(hex));
  expect(found).toEqual([]);
});

test('App.tsx takes its theme from the kit', () => {
  expect(APP).toMatch(/import\s*\{[^}]*useTheme[^}]*\}\s*from\s*'kar-ui-kit'/);
  expect(APP).toContain('<ThemeProvider');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tokens`
Expected: FAIL on all three — `getTheme` exists, `#121212` and friends are present, no `useTheme` import.

- [ ] **Step 3: Extend the kit import**

At line 20, replace:

```tsx
import { SearchIcon, FlagUK, FlagSE } from 'kar-ui-kit';
```

with:

```tsx
import {
  SearchIcon,
  FlagUK,
  FlagSE,
  ThemeProvider,
  useTheme,
  colors,
} from 'kar-ui-kit';
```

- [ ] **Step 4: Delete the private theme**

Delete the whole `BRAND_COLORS` const and the whole `getTheme` arrow function (the block running from the `// Fixed BRAND_COLORS order` comment through the closing `});` of `getTheme`, lines 68–85). Delete the explanatory comment above `BRAND_COLORS` with it — it cites the profile doc as the source of truth, which is exactly the claim that turned out to be wrong.

- [ ] **Step 5: Rewire both screens to the kit theme**

At line 147 and again at line 256, replace:

```tsx
  const theme = getTheme(useColorScheme() === 'dark');
```

with:

```tsx
  const theme = useTheme();
```

At line 240, `theme.orange` no longer exists — the kit's `ThemeTokens` has no `orange` key. Replace:

```tsx
                    <Text key={idx} style={[styles.label, { color: theme.orange }]}>{prog.toUpperCase()}</Text>
```

with:

```tsx
                    <Text key={idx} style={[styles.label, { color: colors.orange }]}>{prog.toUpperCase()}</Text>
```

At line 215, `BRAND_COLORS.red` is gone. Replace `{ color: BRAND_COLORS.red }` with `{ color: colors.rod }`.

- [ ] **Step 6: Make the status bar dark-only**

Kårappen is dark-only — forcing the device to light mode produces a pixel-identical screen. The `isDark` branch is dead. At line 322 delete:

```tsx
  const isDark = useColorScheme() === 'dark';
```

and at line 329 replace:

```tsx
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
```

with:

```tsx
        <StatusBar barStyle="light-content" />
```

Then remove `useColorScheme` from the `react-native` import list at line 10 — it now has no remaining uses. Verify with `grep -n useColorScheme App.tsx`, which must print nothing.

- [ ] **Step 7: Wrap the root in ThemeProvider**

Find the root return (inside the component that renders `<SafeAreaProvider>`, around line 328) and wrap its tree so `ThemeProvider` sits **outside** everything that calls `useTheme()`:

```tsx
    <ThemeProvider section="extra">
      <SafeAreaProvider>
        {/* ...existing children unchanged... */}
      </SafeAreaProvider>
    </ThemeProvider>
```

Keep the existing `I18nContext.Provider` wrapper where it is. `ThemeProvider` must enclose the navigation tree, or `useTheme()` in the two screens silently returns the light default.

- [ ] **Step 8: Run tests to verify they pass**

Run: `npx jest`
Expected: PASS — the 3 new token tests, plus the existing `App.test.tsx` and `MockListingsRepository.test.ts`.

- [ ] **Step 9: Lint and commit**

```bash
npx eslint .
git add App.tsx __tests__/tokens.test.ts
git commit -m "$(cat <<'EOF'
fix: adopt kar-ui-kit theme, delete private stale copy

App.tsx carried its own getTheme with #121212 background and a #634C3D
brown card. Neither appears anywhere in the shipping app; the measured
dark surfaces live in the kit. Adds a regression guard.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Arbetsmarknadsportal — source typography and radii from the kit

The local `FONT` map and typography styles duplicate the kit's `typography` export at identical sizes, with two now-measured divergences: `paragraph1.lineHeight` is 24 (measured: 22) and `primaryButton.borderRadius` is 999 (measured: 16 — the app's primary button is not a pill).

**Working directory:** `C:\Users\jakob\Karappen\Arbetsmarknadsportal-chalmers-app`

**Files:**
- Modify: `App.tsx` — the `FONT` const (lines 61–66) and the `styles` block (lines 342–382)
- Test: `__tests__/tokens.test.ts` (extend the file created in Task 3)

**Interfaces:**
- Consumes: `ThemeProvider` wiring from Task 3; `typography`, `radii` from `kar-ui-kit`.
- Produces: nothing new. Final task for this app.

- [ ] **Step 1: Write the failing test**

Append to `__tests__/tokens.test.ts`:

```ts
test('App.tsx does not redefine the type ramp', () => {
  expect(APP).not.toContain("const FONT = {");
  expect(APP).not.toContain("'OpenSans-Regular'");
});

test('App.tsx uses kit typography and radii', () => {
  expect(APP).toMatch(/import\s*\{[^}]*typography[^}]*\}\s*from\s*'kar-ui-kit'/);
  expect(APP).toContain('...typography.');
});

test('the primary button is not a pill', () => {
  expect(APP).not.toContain('borderRadius: 999');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tokens`
Expected: FAIL — `FONT` is defined, no `typography` import, `borderRadius: 999` present.

- [ ] **Step 3: Extend the kit import**

Add `typography` and `radii` to the `kar-ui-kit` import list created in Task 3.

- [ ] **Step 4: Delete the local FONT map**

Delete the `FONT` const (lines 61–66) and the comment block above it that cites the profile doc.

- [ ] **Step 5: Compose the type styles from the kit**

In the `styles` block, replace each duplicated type entry so the type ramp comes from the kit while local layout margins are preserved. Replace these nine entries:

```tsx
  title: { fontFamily: FONT.bold, fontSize: 30 },
  heading1: { fontFamily: FONT.bold, fontSize: 20 },
  heading2: { fontFamily: FONT.semiBold, fontSize: 16, marginBottom: 4 },
  subheading1: { fontFamily: FONT.medium, fontSize: 11, marginBottom: 8, textTransform: 'uppercase' },
  caption1: { fontFamily: FONT.regular, fontSize: 12, marginTop: 4 },
  caption2: { fontFamily: FONT.regular, fontSize: 10 },
  label: { fontFamily: FONT.regular, fontSize: 10, marginRight: 8, marginTop: 4, color: BRAND_COLORS.orange },
  paragraph1: { fontFamily: FONT.regular, fontSize: 16, lineHeight: 24, marginTop: 8 },
  paragraph2: { fontFamily: FONT.regular, fontSize: 13, lineHeight: 20 },
```

with:

```tsx
  title: { ...typography.title },
  heading1: { ...typography.heading1 },
  heading2: { ...typography.heading2, marginBottom: 4 },
  subheading1: { ...typography.subheading1, marginBottom: 8 },
  caption1: { ...typography.caption1, marginTop: 4 },
  caption2: { ...typography.caption2 },
  label: { ...typography.label, marginRight: 8, marginTop: 4 },
  paragraph1: { ...typography.paragraph1, marginTop: 8 },
  paragraph2: { ...typography.paragraph2, lineHeight: 20 },
```

Notes on what changed and why:
- `paragraph1` loses its local `lineHeight: 24`; the kit supplies the **measured** 22.
- `subheading1` loses its local `textTransform: 'uppercase'` because `typography.subheading1` already sets it.
- `label` loses its local orange; `typography.label` already carries `colors.orange`.
- `paragraph2` keeps `lineHeight: 20` — the kit's `paragraph2` has no measured lineHeight, and dropping it would change layout on an unmeasured basis.

- [ ] **Step 6: Fix the remaining hardcoded style values**

In the same `styles` block:

```tsx
  primaryButton: { borderRadius: 999, ... }
```
becomes
```tsx
  primaryButton: { borderRadius: radii.button, ... }
```

```tsx
  primaryButtonText: { fontFamily: FONT.semiBold, fontSize: 16, color: '#FFFFFF' },
```
becomes
```tsx
  primaryButtonText: { ...typography.heading2, color: colors.white },
```

```tsx
  tabText: { fontFamily: FONT.semiBold, fontSize: 13 },
```
becomes
```tsx
  tabText: { ...typography.heading2, fontSize: 13 },
```

```tsx
  searchInput: { flex: 1, paddingVertical: 12, fontFamily: FONT.regular, fontSize: 13 },
```
becomes
```tsx
  searchInput: { ...typography.paragraph2, flex: 1, paddingVertical: 12 },
```

Leave `card: { borderRadius: 12 }` alone — 12 already matches the measured `radii.card`; swapping it to the token is optional tidying and not required here.

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx jest`
Expected: PASS — 6 token tests plus the existing suites.

- [ ] **Step 8: Lint and commit**

```bash
npx eslint .
git add App.tsx __tests__/tokens.test.ts
git commit -m "$(cat <<'EOF'
refactor: source typography and radii from kar-ui-kit

Drops the duplicated FONT map. Picks up the measured lineHeight 22
(was 24) and the measured 16dp button radius (was a 999 pill).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Notes for the implementer

**Why `agila` and `Study-rooms` need so little.** Both already route everything through kit tokens and carry zero hardcoded hex. They picked up every correction — dark surfaces, the 16dp button radius, the corrected `FilterIcon`, `lineHeight: 22` — the moment the kit's `theme.ts` changed. The only thing they were missing is that the accent was pinned to blue. That discipline is why their tasks are five-line diffs and Arbetsmarknadsportal's is a migration.

**Why the regression guard exists.** The stale theme in `Arbetsmarknadsportal` was a *copy* of values from a printed design document. The copy silently diverged from the real app and nobody noticed, because nothing failed. `__tests__/tokens.test.ts` makes the divergence loud: reintroduce a private `getTheme` or paste `#121212` back in, and CI fails.

**A caution about "absent from the app".** During measurement, `lila #843690` was reported as absent because it never appears as a string literal in the app's JS bundle. It turned out to be present — as a 40% decorative shape and at full opacity in a header band. A bundle-literal search can prove presence, never absence. If you find yourself deleting a brand token because "the app doesn't use it", don't.

**Verifying visually.** These changes are hard to confirm from tests alone. With a device attached, `adb exec-out screencap -p > shot.png` gives a lossless capture you can compare against the real app side by side. Tests catch token regressions; only your eyes catch layout.
