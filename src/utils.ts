import type { ReactNode } from 'react';
import { Animated, Easing, I18nManager, Platform } from 'react-native';
import type { ViewStyle } from 'react-native';
import type {
  AnimationConfig,
  BottomBarItem,
  PressFeedback,
  EdgeInsets,
  NativeTabConfig,
  ResolvedInsets,
  RtlMode,
} from './types';
import { DEFAULT_ANIMATION_DURATION } from './theme';

export function visibleItems(items: readonly BottomBarItem[]): BottomBarItem[] {
  return items.filter((item) => !item.hidden);
}

export function indexInSource(
  items: readonly BottomBarItem[],
  key: string
): number {
  return items.findIndex((item) => item.key === key);
}

export function resolveFabItem(
  items: readonly BottomBarItem[],
  fabKey?: string
): BottomBarItem | undefined {
  if (items.length === 0) {
    return undefined;
  }
  if (fabKey) {
    return items.find((item) => item.key === fabKey);
  }
  const flagged = items.find((item) => item.fab);
  if (flagged) {
    return flagged;
  }
  return items[Math.floor(items.length / 2)];
}

export function renderItemIcon(
  item: BottomBarItem,
  focused: boolean,
  color: string,
  size: number
): ReactNode {
  const icon = focused && item.activeIcon != null ? item.activeIcon : item.icon;
  return typeof icon === 'function' ? icon({ color, focused, size }) : icon;
}

export function splitAroundFab(
  items: readonly BottomBarItem[],
  fab?: BottomBarItem
): { left: BottomBarItem[]; right: BottomBarItem[]; fab?: BottomBarItem } {
  if (!fab) {
    return { left: [...items], right: [] };
  }
  const index = items.findIndex((item) => item.key === fab.key);
  if (index < 0) {
    return { left: [...items], right: [], fab };
  }
  return {
    left: items.slice(0, index),
    right: items.slice(index + 1),
    fab,
  };
}

export function resolveRtl(mode: RtlMode | undefined): boolean {
  if (mode === true || mode === false) {
    return mode;
  }
  return I18nManager.isRTL;
}

export function maybeReverse<T>(list: readonly T[], rtl: boolean): T[] {
  if (!rtl) {
    return [...list];
  }
  return [...list].reverse();
}

export function toNativeTabConfig(
  items: readonly BottomBarItem[]
): NativeTabConfig[] {
  return items.map((item) => {
    let badge: string | number | undefined;
    if (typeof item.badge === 'number' || typeof item.badge === 'string') {
      badge = item.badge;
    } else if (item.badge === true) {
      badge = '';
    }
    return {
      key: item.key,
      title: item.label,
      badge,
      hidden: item.hidden,
      disabled: item.disabled,
    };
  });
}

const IOS_HOME_INDICATOR = 34;
const IOS_IPAD_HOME_INDICATOR = 20;
const IPHONE_X_HEIGHT = 812;

export function fallbackInsets(opts: {
  width: number;
  height: number;
  screenHeight?: number;
  isPad?: boolean;
  platform?: typeof Platform.OS;
}): ResolvedInsets {
  const platform = opts.platform ?? Platform.OS;
  const zero: ResolvedInsets = { top: 0, right: 0, bottom: 0, left: 0 };

  if (platform === 'web') {
    return zero;
  }

  if (platform === 'ios') {
    const isPad =
      opts.isPad ?? (Platform.OS === 'ios' ? Platform.isPad : false);
    if (isPad) {
      return { ...zero, bottom: IOS_IPAD_HOME_INDICATOR };
    }
    if (opts.height >= IPHONE_X_HEIGHT) {
      return { ...zero, bottom: IOS_HOME_INDICATOR };
    }
    return zero;
  }

  if (platform === 'android') {
    const screenHeight = opts.screenHeight ?? opts.height;
    const nav = Math.max(0, screenHeight - opts.height);
    // Cap so we never double-pad when the host already applied insets.
    return { ...zero, bottom: Math.min(nav, 48) };
  }

  return zero;
}

export function mergeInsets(
  insets: EdgeInsets | undefined,
  fallback: ResolvedInsets,
  safeArea: boolean
): ResolvedInsets {
  const base = safeArea ? fallback : { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    top: insets?.top ?? base.top,
    right: insets?.right ?? base.right,
    bottom: insets?.bottom ?? base.bottom,
    left: insets?.left ?? base.left,
  };
}

/** react-native-web has no native animated module (Expo web would warn). */
export const NATIVE_DRIVER = Platform.OS !== 'web';

export function runBarAnimation(
  value: Animated.Value,
  toValue: number,
  animation: AnimationConfig | undefined,
  reduceMotion: boolean
): Animated.CompositeAnimation {
  if (reduceMotion) {
    return Animated.timing(value, {
      toValue,
      duration: 0,
      useNativeDriver: NATIVE_DRIVER,
    });
  }

  const useNativeDriver = animation?.config?.useNativeDriver ?? NATIVE_DRIVER;

  if (animation?.type === 'timing') {
    return Animated.timing(value, {
      toValue,
      duration: animation.duration ?? DEFAULT_ANIMATION_DURATION,
      easing: animation.easing ?? Easing.out(Easing.cubic),
      useNativeDriver,
    });
  }

  return Animated.spring(value, {
    toValue,
    damping: animation?.config?.damping ?? 18,
    stiffness: animation?.config?.stiffness ?? 180,
    mass: animation?.config?.mass ?? 0.85,
    overshootClamping: animation?.config?.overshootClamping,
    restDisplacementThreshold: animation?.config?.restDisplacementThreshold,
    restSpeedThreshold: animation?.config?.restSpeedThreshold,
    useNativeDriver,
  });
}

/** Multiplier on the glass tint's own alpha — tints already carry translucency. */
export function glassOpacity(intensity: 'clear' | 'regular'): number {
  return intensity === 'clear' ? 0.62 : 1;
}

/**
 * `boxShadow` (drawn outside the shape only) needs Fabric and RN >= 0.76;
 * older versions warn on the unknown style key.
 */
export function supportsBoxShadow(): boolean {
  // react-native-web has no Platform.constants
  const version = (
    Platform.constants as
      { reactNativeVersion?: { major: number; minor: number } } | undefined
  )?.reactNativeVersion;
  const recent = !version || version.major > 0 || version.minor >= 76;
  return (
    recent &&
    (globalThis as { nativeFabricUIManager?: unknown }).nativeFabricUIManager !=
      null
  );
}

/** "Home, 3 notifications" — the badge is part of the tab's spoken label. */
export function itemA11yLabel(item: BottomBarItem): string {
  if (item.accessibilityLabel != null) return item.accessibilityLabel;
  if (!item.label) return item.key;
  if (item.badge === undefined || item.badge === false) return item.label;
  const count = item.badge === true ? 'new' : String(item.badge);
  return `${item.label}, ${count} notifications`;
}

export function formatBadge(
  badge: number | string | boolean,
  max = 99
): string {
  if (typeof badge === 'boolean') {
    return '';
  }
  if (typeof badge === 'number') {
    return badge > max ? `${max}+` : String(badge);
  }
  return badge;
}

/** Pressed style for `feedback`; `fallback` is the component's default. */
export function pressedStyle(
  feedback: PressFeedback | undefined,
  fallback: ViewStyle
): ViewStyle | null {
  if (feedback === 'none') {
    return null;
  }
  if (!feedback) {
    return fallback;
  }
  return {
    ...(feedback.opacity != null && { opacity: feedback.opacity }),
    ...(feedback.scale != null && { transform: [{ scale: feedback.scale }] }),
  };
}

/** Foreground so Android doesn't swap out the view's background color. */
export function rippleFor(
  feedback: PressFeedback | undefined
): { color: string; borderless: boolean; foreground: boolean } | undefined {
  return feedback && feedback !== 'none' && feedback.rippleColor
    ? { color: feedback.rippleColor, borderless: true, foreground: true }
    : undefined;
}

export function isHexOrNamedColor(value: string): boolean {
  return (
    value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')
  );
}
