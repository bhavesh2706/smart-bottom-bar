import { Platform } from 'react-native';
import {
  fallbackInsets,
  formatBadge,
  mergeInsets,
  maybeReverse,
  resolveFabItem,
  splitAroundFab,
  toNativeTabConfig,
  visibleItems,
  glassOpacity,
  supportsBoxShadow,
} from '../utils';
import type { BottomBarItem } from '../types';

const items: BottomBarItem[] = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B', hidden: true },
  { key: 'c', label: 'C', fab: true, badge: 4 },
  { key: 'd', label: 'D', disabled: true },
];

describe('visibleItems', () => {
  it('drops hidden tabs', () => {
    expect(visibleItems(items).map((i) => i.key)).toEqual(['a', 'c', 'd']);
  });
});

describe('resolveFabItem / splitAroundFab', () => {
  it('prefers fabKey, then item.fab, then the middle item', () => {
    const shown = visibleItems(items);
    expect(resolveFabItem(shown, 'd')?.key).toBe('d');
    expect(resolveFabItem(shown)?.key).toBe('c');
    expect(resolveFabItem([{ key: 'x' }, { key: 'y' }])?.key).toBe('y');
  });

  it('splits left/right around the fab', () => {
    const shown = visibleItems(items);
    const split = splitAroundFab(shown, resolveFabItem(shown));
    expect(split.left.map((i) => i.key)).toEqual(['a']);
    expect(split.right.map((i) => i.key)).toEqual(['d']);
    expect(split.fab?.key).toBe('c');
  });
});

describe('toNativeTabConfig', () => {
  it('maps items for a native-tab escape hatch', () => {
    expect(toNativeTabConfig(items)).toEqual([
      {
        key: 'a',
        title: 'A',
        badge: undefined,
        hidden: undefined,
        disabled: undefined,
      },
      {
        key: 'b',
        title: 'B',
        badge: undefined,
        hidden: true,
        disabled: undefined,
      },
      {
        key: 'c',
        title: 'C',
        badge: 4,
        hidden: undefined,
        disabled: undefined,
      },
      {
        key: 'd',
        title: 'D',
        badge: undefined,
        hidden: undefined,
        disabled: true,
      },
    ]);
  });

  it('maps boolean badges to an empty string (dot)', () => {
    expect(toNativeTabConfig([{ key: 'x', badge: true }])[0]?.badge).toBe('');
  });
});

describe('formatBadge / glassOpacity', () => {
  it('caps numeric badges and treats true as a dot', () => {
    expect(formatBadge(true)).toBe('');
    expect(formatBadge(3)).toBe('3');
    expect(formatBadge(120)).toBe('99+');
    expect(formatBadge('new')).toBe('new');
  });

  it('returns a lower opacity for clear glass', () => {
    expect(glassOpacity('clear')).toBeLessThan(glassOpacity('regular'));
  });
});

describe('maybeReverse', () => {
  it('reverses only when rtl is on', () => {
    expect(maybeReverse(['a', 'b'], false)).toEqual(['a', 'b']);
    expect(maybeReverse(['a', 'b'], true)).toEqual(['b', 'a']);
  });
});

describe('fallbackInsets / mergeInsets', () => {
  it('uses the iPhone home-indicator heuristic', () => {
    const inset = fallbackInsets({
      width: 390,
      height: 844,
      platform: 'ios',
      isPad: false,
    });
    expect(inset.bottom).toBe(34);
  });

  it('returns 0 on pre-notch iPhones', () => {
    const inset = fallbackInsets({
      width: 375,
      height: 667,
      platform: 'ios',
      isPad: false,
    });
    expect(inset.bottom).toBe(0);
  });

  it('uses the iPad home indicator', () => {
    expect(
      fallbackInsets({
        width: 1024,
        height: 1366,
        platform: 'ios',
        isPad: true,
      }).bottom
    ).toBe(20);
  });

  it('uses the window/screen delta on Android and caps it', () => {
    expect(
      fallbackInsets({
        width: 360,
        height: 640,
        screenHeight: 700,
        platform: 'android',
      }).bottom
    ).toBe(48);
    expect(
      fallbackInsets({
        width: 360,
        height: 780,
        screenHeight: 800,
        platform: 'android',
      }).bottom
    ).toBe(20);
  });

  it('returns zero on web', () => {
    expect(
      fallbackInsets({ width: 1280, height: 800, platform: 'web' }).bottom
    ).toBe(0);
  });

  it('merges provided insets over fallbacks', () => {
    const fallback = fallbackInsets({
      width: 390,
      height: 844,
      platform: 'ios',
      isPad: false,
    });
    expect(mergeInsets({ bottom: 12 }, fallback, true).bottom).toBe(12);
    expect(mergeInsets(undefined, fallback, true).bottom).toBe(34);
    expect(mergeInsets(undefined, fallback, false).bottom).toBe(0);
    expect(mergeInsets({ bottom: 0 }, fallback, false).bottom).toBe(0);
  });

  it('does not crash with the live Platform', () => {
    expect(typeof Platform.OS).toBe('string');
    const live = fallbackInsets({
      width: 390,
      height: 844,
    });
    expect(live.bottom).toBeGreaterThanOrEqual(0);
  });
});

describe('supportsBoxShadow', () => {
  const g = globalThis as { nativeFabricUIManager?: unknown };
  const constants = Platform.constants as {
    reactNativeVersion?: { major: number; minor: number };
  };
  const original = constants.reactNativeVersion;

  afterEach(() => {
    delete g.nativeFabricUIManager;
    constants.reactNativeVersion = original;
  });

  it('is true on Fabric with RN >= 0.76', () => {
    g.nativeFabricUIManager = {};
    constants.reactNativeVersion = { major: 0, minor: 86 };
    expect(supportsBoxShadow()).toBe(true);
  });

  it('is false on the old architecture', () => {
    constants.reactNativeVersion = { major: 0, minor: 86 };
    expect(supportsBoxShadow()).toBe(false);
  });

  it('is false on Fabric before RN 0.76', () => {
    g.nativeFabricUIManager = {};
    constants.reactNativeVersion = { major: 0, minor: 75 };
    expect(supportsBoxShadow()).toBe(false);
  });
});
