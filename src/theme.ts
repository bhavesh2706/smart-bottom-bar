import type { ViewStyle } from 'react-native';
import type { BottomBarVariant, ResolvedPalette } from './types';

export const MIN_HIT = 44;
export const IOS_TAB_HEIGHT = 49;
export const DEFAULT_BAR_HEIGHT = 56;
export const MATERIAL_BAR_HEIGHT = 80;
export const SEGMENTED_HEIGHT = 44;
export const DEFAULT_FAB_SIZE = 56;
export const DEFAULT_SIDEBAR_WIDTH = 80;
export const FLOATING_MARGIN = 12;
export const WAVE_BUBBLE = 64;
export const NOTCH_RADIUS = 36;

export const DEFAULT_ANIMATION_DURATION = 220;

export function defaultBarHeight(variant: BottomBarVariant): number {
  switch (variant) {
    case 'material':
      return MATERIAL_BAR_HEIGHT;
    case 'segmented':
      return SEGMENTED_HEIGHT;
    case 'flat':
      return IOS_TAB_HEIGHT;
    case 'floating':
      return 58;
    case 'liquidGlass':
      return 62;
    case 'curved':
    case 'notchedFab':
    case 'wave':
      return DEFAULT_BAR_HEIGHT;
    case 'sidebar':
      return DEFAULT_BAR_HEIGHT;
  }
}

/** Sensible shadow defaults — iOS flat is flush; floating/glass lift off the scene. */
export function defaultShadow(variant: BottomBarVariant): boolean {
  switch (variant) {
    case 'floating':
    case 'liquidGlass':
    case 'material':
    case 'curved':
    case 'notchedFab':
    case 'wave':
      return true;
    case 'flat':
    case 'segmented':
    case 'sidebar':
    default:
      return false;
  }
}

export function barShadowStyle(
  enabled: boolean,
  level: 'soft' | 'raised' = 'soft'
): ViewStyle {
  if (!enabled) {
    return {
      elevation: 0,
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 0 },
    };
  }
  if (level === 'raised') {
    return {
      elevation: 12,
      shadowColor: '#000',
      shadowOpacity: 0.28,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
    };
  }
  return {
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  };
}

const light: ResolvedPalette = {
  scheme: 'light',
  background: '#F2F2F7',
  bar: '#FFFFFF',
  scene: '#F2F2F7',
  active: '#007AFF',
  inactive: '#636366',
  label: '#007AFF',
  inactiveLabel: '#3A3A3C',
  badge: '#FF3B30',
  badgeText: '#FFFFFF',
  indicator: '#007AFF',
  border: 'rgba(60, 60, 67, 0.18)',
  glassTint: 'rgba(255, 255, 255, 0.78)',
  glassHighlight: 'rgba(255, 255, 255, 0.95)',
  fab: '#007AFF',
  fabIcon: '#FFFFFF',
};

const dark: ResolvedPalette = {
  scheme: 'dark',
  background: '#000000',
  bar: '#1C1C1E',
  scene: '#000000',
  active: '#0A84FF',
  inactive: '#8E8E93',
  label: '#0A84FF',
  inactiveLabel: '#AEAEB2',
  badge: '#FF453A',
  badgeText: '#FFFFFF',
  indicator: '#0A84FF',
  border: 'rgba(84, 84, 88, 0.55)',
  glassTint: 'rgba(44, 44, 46, 0.82)',
  glassHighlight: 'rgba(255, 255, 255, 0.38)',
  fab: '#0A84FF',
  fabIcon: '#FFFFFF',
};

/**
 * Liquid-glass palette. `indicator` is the selection lens fill; `bar` is the
 * opaque fallback used when the OS asks to reduce transparency.
 */
const liquidLight: ResolvedPalette = {
  ...light,
  active: '#007AFF',
  label: '#007AFF',
  inactive: '#3C3C43',
  inactiveLabel: '#3C3C43',
  indicator: 'rgba(0, 122, 255, 0.12)',
  border: 'rgba(0, 0, 0, 0.08)',
  glassTint: 'rgba(255, 255, 255, 0.86)',
  glassHighlight: 'rgba(255, 255, 255, 0.95)',
  bar: '#FFFFFF',
};

const liquidDark: ResolvedPalette = {
  ...dark,
  // #409CFF is the accessible dark-mode system blue (~5:1 on the dark lens).
  active: '#409CFF',
  label: '#409CFF',
  inactive: '#D1D1D6',
  inactiveLabel: '#D1D1D6',
  indicator: 'rgba(255, 255, 255, 0.14)',
  border: 'rgba(255, 255, 255, 0.12)',
  glassTint: 'rgba(28, 28, 30, 0.84)',
  glassHighlight: 'rgba(255, 255, 255, 0.35)',
  bar: '#1C1C1E',
};

const materialLight: ResolvedPalette = {
  ...light,
  bar: '#F7F2FA',
  active: '#6750A4',
  label: '#1D1B20',
  inactive: '#49454F',
  inactiveLabel: '#49454F',
  indicator: '#E8DEF8',
  fab: '#6750A4',
};

const materialDark: ResolvedPalette = {
  ...dark,
  bar: '#2B2930',
  active: '#D0BCFF',
  label: '#E6E0E9',
  inactive: '#CAC4D0',
  inactiveLabel: '#CAC4D0',
  indicator: '#4A4458',
  fab: '#D0BCFF',
  fabIcon: '#381E72',
};

export function paletteFor(
  scheme: 'light' | 'dark',
  variant: BottomBarVariant
): ResolvedPalette {
  if (variant === 'material') {
    return scheme === 'dark' ? materialDark : materialLight;
  }
  if (variant === 'liquidGlass') {
    return scheme === 'dark' ? liquidDark : liquidLight;
  }
  return scheme === 'dark' ? dark : light;
}

export const lightPalette = light;
export const darkPalette = dark;
