/**
 * theme/theme.ts
 *
 * Centralized design tokens from the Chalmers Studentkår
 * "Grafisk profil" (Kårappen). Every color and type style used
 * across the Kårappen family of apps is pulled from this file -
 * do not hardcode hex values or font sizes elsewhere.
 *
 * Brand colors, spacing, radii and font families are constant
 * across light/dark. Surface colors (background, card, text, etc)
 * are scheme-dependent - use getTheme(isDark) or the useTheme()
 * hook (theme/ThemeContext.tsx) to read them, never these directly.
 */

import { TextStyle } from 'react-native';

export const colors = {
  bla: '#00ACFF', // Primary brand accent, unread indicators, primary buttons
  lila: '#843690',
  rod: '#D8004D',
  mattRod: '#F8686D',
  orange: '#F86600',
  varmGra: '#634C3D',
  gron: '#27AD72',
  turkos: '#7CCDC2',

  // Functional / neutral tokens (not in the source palette table,
  // but required by the button/disabled specs in the profile).
  white: '#FFFFFF',
  black: '#1A1A1A', // dark background used for icon bars / headings in the profile
  disabledBackground: '#E0E0E0',
  disabledText: 'rgba(26, 26, 26, 0.4)',
} as const;

/**
 * PER-SECTION ACCENT - the single most important structural fact about this
 * app, and the usual reason a rebuild "looks wrong".
 *
 * Karappen has no one app-wide primary. Each bottom-tab section owns a brand
 * colour, and the tab bar's active icon+label, favourite hearts, category tag
 * text, and segmented-control fills all take the CURRENT SECTION's accent.
 *
 * Measured from a screenshot of each tab; every accent matched its brand
 * token exactly (channel distance 0):
 *   hem -> bla, mat -> gron, event -> orange, extra -> turkos
 */
export const sectionAccent = {
  hem: '#00ACFF',    // colors.bla
  mat: '#27AD72',    // colors.gron
  event: '#F86600',  // colors.orange
  extra: '#7CCDC2',  // colors.turkos
} as const;

export type Section = keyof typeof sectionAccent;

export const fontFamily = {
  regular: 'OpenSans-Regular',
  medium: 'OpenSans-Medium',
  semiBold: 'OpenSans-SemiBold',
  bold: 'OpenSans-Bold',
} as const;

/**
 * Typography scale, matching the profile spec exactly:
 * Titel 30pt, H1 20pt, H2 16pt, Subheading 11pt,
 * Paragraph1 16pt, Paragraph2 13pt, Caption1 12pt, Caption2 10pt, Label 10pt.
 *
 * Deliberately has no `color` - text color depends on light/dark
 * scheme, and is applied at render time by ChalmersText via
 * useTheme(). `label` keeps its orange color since that's a fixed
 * brand accent, not a surface color.
 */
export const typography: Record<string, TextStyle> = {
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 30,
  },
  heading1: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
  },
  heading2: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
  },
  /**
   * UNVERIFIED letterSpacing. This 0.5 comes from the printed Grafisk profil.
   * I tried to measure it from the shipping app and could NOT get a trustworthy
   * number: deriving the font size from cap height and deriving it from the ink
   * span (against the real Open Sans advance widths and side bearings) disagree
   * by ~13%, which flips the sign of the result. At these sizes the per-glyph
   * ink-detection error is the same magnitude as the spacing being measured.
   * Treat 0.5 as a guess, not a measurement.
   */
  subheading1: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  /**
   * lineHeight MEASURED: 21.7dp top-to-top pitch, from two independent 16sp
   * blocks on different screens (a food-menu description and the extra-tab
   * paragraph) that agreed exactly. 21.7 measured => 22 in source (ratio 1.375).
   * Only the 16sp ramp was measured; the other variants below are unverified.
   */
  paragraph1: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 22,
  },
  paragraph2: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
  },
  caption1: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
  caption2: {
    fontFamily: fontFamily.regular,
    fontSize: 10,
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 10,
    color: colors.orange,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  pill: 999,
  card: 12,   // measured: balance card, arc-fit 12.3dp
  chip: 12,   // measured: balance-card chip, arc-fit 12.0dp (h=32dp, so NOT a pill)
  control: 5, // measured: search field 4.7, filter 4.3, segmented 4.7, tag 5.3dp
  button: 16, // measured: primary button, arc-fit 16.7dp - NOT a pill
  tabBar: 16, // measured: floating tab bar, arc-fit 16.0dp
  sm: 6,
} as const;

/**
 * Dark surfaces measured from the shipping Karappen
 * (com.helo.karappen v2.2.0-csu, versionCode 122): lossless adb screencap
 * sampled per element, cross-checked against the Hermes bundle string table.
 *
 * The app is dark-first and draws over a decorative shape wallpaper shipped as
 * a full-screen PNG asset (assets_graphics_globalbackgroundcsu.png, 786x2954).
 * `background` below is that image's own flat base colour - 65% of its pixels -
 * NOT a colour the app composites. To match the app you must render the image;
 * a flat #19242B gives you the right base with none of the shapes.
 *
 * `card` IS a real composite (translucent over that wallpaper). `elevated` and
 * `subText` are exact bundle literals.
 */
/**
 * White @20%. Solved independently from two different backdrops for BOTH the
 * card stroke and the balance-card chip fill; both returned err=0. The app
 * reuses this single overlay token for translucent-on-anything surfaces.
 */
const OVERLAY_20 = 'rgba(255, 255, 255, 0.2)';

export const surfaces = {
  background: '#19242B',   // flat base of the wallpaper PNG - see note above
  /**
   * Card and tab bar are the SAME surface colour (#222D34, an exact bundle
   * literal): the card at 80% opacity, the tab bar opaque. Solved by sampling
   * each over two different backdrops - the 80% card renders as #1F2B33 on
   * the home screen. Use `card` over `background`, not a flat #1F2B33, or it
   * will not track the wallpaper behind it.
   */
  elevated: '#222D34',     // exact bundle literal - tab bar, opaque
  card: 'rgba(34, 45, 52, 0.8)',          // = elevated @ 80%
  subText: '#CBD4D8',      // exact bundle literal - muted text, inactive icons
  primaryTint: 'rgba(0, 172, 255, 0.24)', // from bundle literal #00ACFF3D
  overlay: OVERLAY_20,     // chip fill, and any translucent-over-content surface
  border: OVERLAY_20,      // card stroke - same value, kept separate to diverge later
  /**
   * Second surface family, used by list screens (mat / event). #374750 is an
   * exact bundle literal; the app uses it OPAQUE for inputs and at 50% for
   * media list cards - and `rgba(55, 71, 80, 0.5)` is itself a literal in the
   * bundle, so both forms are confirmed from two directions.
   */
  chrome: '#374750',                    // search field, filter button, segmented control
  listCard: 'rgba(55, 71, 80, 0.5)',    // = chrome @50%; solved err=0
  tagOverlay: 'rgba(0, 0, 0, 0.3)',     // tag chips over photography; solved from 2 edges
  mutedLabel: '#9BA3A7',                // inactive segmented-control label
} as const;

/** Hairline card stroke: 1.0dp measured (3px @ density 3.0). */
export const borderWidth = { hairline: 1 } as const;

/**
 * DECORATIVE LAYER - the angular shapes behind everything.
 *
 * Measured finding: every colour in the wallpaper PNG resolves to a BRAND
 * TOKEN composited over `surfaces.background`, at one of two opacities.
 * Solved against the palette, most with err=0 of 255:
 *   gron @15% / @40%, bla @15% / @40%, turkos @13% / @36%,
 *   lila @40%, orange @15%
 *
 * IMPORTANT correction: this is where `colors.lila` (#843690) lives. It does
 * NOT appear as a string literal in the JS bundle, so a bundle-only search
 * wrongly concludes the app never uses it. It is used - as a 40% decorative
 * shape, and at full opacity in the list-tab header band below.
 *
 * The list tabs (mat / event / extra) additionally render a vivid,
 * FULL-OPACITY brand-coloured shape band across the top ~60dp, distinct per
 * tab (they are not one shared graphic - pixel-diffing two tabs shows 46%
 * difference). The hem tab has no such band; its top is just the wallpaper.
 * Only one wallpaper PNG ships, so the vivid band is drawn, not a raster asset.
 */
export const decorative = {
  base: '#19242B',
  /** Shape opacities over `base`. Measured 13-15% and 36-40%. */
  shapeOpacity: { low: 0.15, high: 0.4 },
  /** Top band on list tabs: brand colours at full opacity, ~60dp tall. */
  headerBandHeight: 60,
  headerBandOpacity: 1,
} as const;

/** Balance card fill: horizontal gradient, left to right. Vertical axis is constant. */
export const gradients = {
  balanceCard: ['#00ACFF', '#00689B'] as const,
} as const;

/**
 * Surface tokens that flip between light and dark.
 *
 * NOTE: the shipping Karappen is DARK-ONLY. Forcing the device to light mode
 * (`adb shell cmd uimode night no`) produced a pixel-identical screen - the
 * only differences were inside Android's own status bar. The app ignores the
 * system colour scheme entirely.
 *
 * The dark values below are measured from that app. The light values are NOT:
 * they come from the printed Grafisk profil and are unverified, since there is
 * no light mode to verify them against. They are kept for the other apps in
 * this family - do not treat them as Karappen-accurate.
 */
export interface ThemeTokens {
  background: string;
  card: string;
  text: string;
  subText: string;
  border: string;
  inputBg: string;
  disabledBackground: string;
  disabledText: string;
  selectedTint: string;
  badgeBg: string;
  pressed: string;
  /** Accent for the current section - see `sectionAccent`. */
  primary: string;
  /** Section these tokens were resolved for; lets nested providers inherit. */
  section: Section;
}

export function getTheme(isDark: boolean, section: Section = 'hem'): ThemeTokens {
  return {
    background: isDark ? surfaces.background : colors.white,
    card: isDark ? surfaces.card : colors.white,
    text: isDark ? colors.white : colors.black,
    subText: isDark ? surfaces.subText : colors.varmGra,
    border: isDark ? surfaces.border : colors.disabledBackground,
    inputBg: isDark ? surfaces.elevated : '#F3F4F6',
    disabledBackground: isDark ? '#3A3A3A' : colors.disabledBackground,
    disabledText: isDark ? 'rgba(255, 255, 255, 0.4)' : colors.disabledText,
    selectedTint: isDark ? surfaces.primaryTint : '#EAF7FF',
    badgeBg: isDark ? 'rgba(39, 173, 114, 0.2)' : '#EAF9F1',
    pressed: isDark ? surfaces.elevated : '#F5F9FC',
    primary: sectionAccent[section],
    section,
  };
}

export const theme = { colors, fontFamily, typography, spacing, radii, surfaces, gradients, borderWidth, sectionAccent, decorative };

export type Theme = typeof theme;
export default theme;
