/**
 * theme/backgroundShapes.ts
 *
 * The decorative shape layer, extracted from the shipping Karappen's own
 * background asset (assets_graphics_globalbackgroundcsu.png, 786x2954).
 *
 * Method: the asset was colour-segmented, its regions connected-component
 * labelled and convex-hulled, then each region solved back to a brand token
 * plus an opacity over `decorative.base`. Most regions matched a token with
 * an error of 0-2 of 255.
 *
 * Opacity is the MEASURED per-shape value, NOT snapped. An earlier version
 * snapped every shape to two nominal tiers (15% / 40%); comparing the running
 * app against the real one showed that pushed turkos 0.35 -> 0.40 (dist 18)
 * and orange 0.27 -> 0.15. `decorative.shapeOpacity` still records the two
 * nominal tiers the design clusters around, but these are what was measured.
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
  /** Measured opacity over `decorative.base`; observed range 0.13-0.42. */
  opacity: number;
  /** SVG polygon points, in viewport percentages. */
  points: string;
}

export const BACKGROUND_SHAPES: BackgroundShape[] = [
  { token: 'gron', opacity: 0.40, points: '73.3,10.3 99.6,12.2 99.6,27.6 87.8,31.1 64.5,27.3' },
  { token: 'bla', opacity: 0.39, points: '3.8,44.8 45.4,38.3 54.2,42.6 22.5,53.6' },
  { token: 'turkos', opacity: 0.35, points: '0.0,59.8 23.3,59.8 23.3,72.8 5.3,72.6 0.0,69.2' },
  { token: 'gron', opacity: 0.15, points: '21.0,79.2 41.2,77.7 59.5,82.8 53.8,89.4 37.4,89.3' },
  { token: 'gron', opacity: 0.15, points: '68.7,46.3 83.6,44.4 99.6,47.4 99.6,54.8 76.3,52.8' },
  { token: 'lila', opacity: 0.42, points: '49.2,57.6 74.8,53.7 98.1,55.6 85.9,60.3' },
  { token: 'bla', opacity: 0.14, points: '35.1,21.6 57.3,21.6 57.6,29.9 48.1,29.8' },
  { token: 'turkos', opacity: 0.13, points: '0.0,5.0 32.1,6.0 21.4,11.1 0.0,7.9' },
  { token: 'orange', opacity: 0.15, points: '56.5,63.8 77.9,64.9 92.4,69.5 89.7,75.9 65.6,69.6' },
  { token: 'lila', opacity: 0.13, points: '0.4,28.0 17.2,23.8 17.6,31.5 5.3,31.4' },
  { token: 'orange', opacity: 0.27, points: '74.8,67.1 88.9,70.4 87.8,72.0 79.8,71.0' },
];
