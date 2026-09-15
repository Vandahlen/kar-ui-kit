/**
 * theme/componentSpecs.ts
 *
 * Measured specs for Karappen components this kit does not implement yet.
 *
 * Provenance: every number was measured from lossless `adb exec-out screencap`
 * captures of com.helo.karappen v2.2.0-csu at density 3.0 (Pixel 9 Pro XL).
 * Radii are circle-arc fits with the stated pixel error; translucent fills were
 * solved by sampling the same element over two different backdrops.
 *
 * This file is DATA, not components - build against it. Sizes are dp, text sp.
 */
export const componentSpecs = {
  /** "Sok" input on the mat / event tabs. */
  searchField: {
    height: 42,
    radius: 5,            // arc-fit 4.7dp, err 0.4px
    background: '#374750', // opaque
    marginLeft: 16,
    paddingLeft: 15,      // to the magnifier glyph
    placeholderSize: 16,
    gapToFilterButton: 10,
  },
  /** "FILTER" / "FILTER (n)" button, shares the search field's row and height. */
  filterButton: {
    height: 42,
    radius: 5,            // arc-fit 4.3dp, err 0.4px
    background: '#374750',
    marginRight: 16,
    paddingLeft: 21,
    labelSize: 12,        // uppercase
    iconStroke: 2,
    iconBars: [18.7, 14.3, 10.0], // centred, 5.33dp apart
  },
  /** EVENTKALENDER / BOKNINGAR switch on the event tab. */
  segmentedControl: {
    height: 44,
    radius: 5,            // arc-fit 4.7dp, err 0.4px
    background: '#374750',
    marginHorizontal: 20,
    activeHeight: 26,
    activeRadius: 5,      // arc-fit 4.7dp, err 0.4px
    activeInset: 5,       // left/right; 9dp top and bottom
    activeFill: 'SECTION_ACCENT', // #F86600 on the event tab - see sectionAccent
    labelSize: 12,        // uppercase, both states
    inactiveLabel: '#9BA3A7',
  },
  /** Category tags over event artwork ("MOTEN & WORKSHOP"). */
  tagChip: {
    height: 23,
    radius: 5,            // arc-fit 5.3dp, err 0.6px
    fill: 'rgba(0, 0, 0, 0.3)', // solved at both edges: pure black, no tint
    paddingLeft: 10,      // 9.3dp to glyph edge
    labelSize: 12,        // uppercase, in the section accent
    widthHugsLabel: true,
  },
  /** Restaurant / event list card with a media strip. */
  mediaCard: {
    width: 416,           // symmetric 16dp margins
    radius: 12,           // arc-fit 12.3dp, err 0.4px - same as radii.card
    marginHorizontal: 16,
    fill: 'rgba(55, 71, 80, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    imageInset: 20,       // from the card's content edge
    imageHeight: 72.3,
    /** Rule beside section labels (DAGENS / GREENS / NORDIC). LOW CONFIDENCE. */
    sectionRule: {
      thickness: 1,
      color: 'rgba(255, 255, 255, 0.14)', // solve err 39 - see note below
      confidence: 'approximate',
    },
  },
} as const;

export type ComponentSpecs = typeof componentSpecs;
