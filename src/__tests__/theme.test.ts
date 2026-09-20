import { paletteFor } from '../theme';

describe('paletteFor', () => {
  it('uses Material tokens for the material variant', () => {
    expect(paletteFor('light', 'material').active).toBe('#6750A4');
    expect(paletteFor('dark', 'material').fabIcon).toBe('#381E72');
  });

  it('uses iOS-like tokens for other variants', () => {
    expect(paletteFor('light', 'flat').active).toBe('#007AFF');
    expect(paletteFor('dark', 'liquidGlass').active).toBe('#0A84FF');
    expect(paletteFor('dark', 'flat').bar).toBe('#1C1C1E');
  });
});
