import { getTheme, sectionAccent, colors, Section } from './theme';

describe('per-section accent', () => {
  it('defaults to hem when no section is given', () => {
    expect(getTheme(true).primary).toBe(colors.bla);
  });

  it('maps every section to its measured brand accent', () => {
    (Object.keys(sectionAccent) as Section[]).forEach(s => {
      expect(getTheme(true, s).primary).toBe(sectionAccent[s]);
    });
  });

  it('resolves a different accent per section', () => {
    const accents = (Object.keys(sectionAccent) as Section[])
      .map(s => getTheme(true, s).primary);
    expect(new Set(accents).size).toBe(accents.length);
  });

  it('keeps the accent independent of colour scheme', () => {
    expect(getTheme(false, 'mat').primary).toBe(getTheme(true, 'mat').primary);
  });

  it('round-trips the section so nested providers can inherit', () => {
    expect(getTheme(true, 'event').section).toBe('event');
  });
});
