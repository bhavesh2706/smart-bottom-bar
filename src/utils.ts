import { Animated, Easing, I18nManager, Platform } from 'react-native';
import type {
  AnimationConfig,
  BottomBarItem,
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
      useNativeDriver: true,
    });
  }

  const useNativeDriver = animation?.config?.useNativeDriver ?? true;

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

export function glassOpacity(intensity: 'clear' | 'regular'): number {
  return intensity === 'clear' ? 0.42 : 0.72;
}

export function formatBadge(badge: number | string | boolean): string {
  if (typeof badge === 'boolean') {
    return '';
  }
  if (typeof badge === 'number') {
    return badge > 99 ? '99+' : String(badge);
  }
  return badge;
}

export function isHexOrNamedColor(value: string): boolean {
  return (
    value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')
  );
}
