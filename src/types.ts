import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * Visual variants shipped in v1. One component, one data model.
 */
export type BottomBarVariant =
  | 'flat'
  | 'curved'
  | 'floating'
  | 'wave'
  | 'liquidGlass'
  | 'notchedFab'
  | 'material'
  | 'segmented'
  | 'sidebar';

export type LabelPosition = 'below' | 'beside' | 'hidden';

export type ColorSchemePreference = 'auto' | 'light' | 'dark';

export type RtlMode = 'auto' | boolean;

export type KeyboardBehavior = 'hide' | 'offset' | 'none';

export type MaterialMode = 'fixed' | 'shifting';

export type GlassIntensity = 'clear' | 'regular';

export type HapticEvent = 'press' | 'longPress' | 'doubleTap';

export type BarPlacement = 'docked' | 'overlay';

/**
 * Safe-area insets accepted as data. Pass `useSafeAreaInsets()` from
 * `react-native-safe-area-context` when the host app already has it.
 */
export interface EdgeInsets {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface ResolvedInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface AnimationConfig {
  type?: 'spring' | 'timing';
  duration?: number;
  easing?: (value: number) => number;
  config?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
    overshootClamping?: boolean;
    restDisplacementThreshold?: number;
    restSpeedThreshold?: number;
    useNativeDriver?: boolean;
  };
}

export interface GlassConfig {
  /** Translucency. `clear` is more see-through than `regular`. */
  intensity?: GlassIntensity;
  /** `'auto'` follows the resolved color scheme. */
  tint?: 'auto' | 'light' | 'dark' | string;
  /** Capsule vs full-bleed bar. */
  cornerRadius?: number;
  /**
   * Center FAB position on `liquidGlass`: `'raised'` (default) lifts it above
   * the capsule like every other variant; `'embedded'` keeps it inside.
   */
  fabPlacement?: 'raised' | 'embedded';
}

export interface BottomBarStyle {
  container?: StyleProp<ViewStyle>;
  bar?: StyleProp<ViewStyle>;
  item?: StyleProp<ViewStyle>;
  label?: StyleProp<TextStyle>;
  icon?: StyleProp<ViewStyle>;
  badge?: StyleProp<ViewStyle>;
  badgeText?: StyleProp<TextStyle>;
  indicator?: StyleProp<ViewStyle>;
  fab?: StyleProp<ViewStyle>;
}

export interface RenderItemParams {
  item: BottomBarItem;
  index: number;
  active: boolean;
  defaultItem: ReactNode;
}

export interface GlassSurfaceProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity: GlassIntensity;
  tint: string;
  cornerRadius: number;
}

export interface BottomBarItem {
  key: string;
  icon?: ReactNode;
  activeIcon?: ReactNode;
  label?: string;
  badge?: number | string | boolean;
  disabled?: boolean;
  hidden?: boolean;
  /**
   * Marks this item as the raised center FAB. When any item has `fab` (or
   * `fabKey` is set), every horizontal variant renders 2+2 sides + center FAB.
   */
  fab?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  color?: string;
  activeColor?: string;
  testID?: string;
  renderItem?: (params: RenderItemParams) => ReactNode;
}

export interface ResolvedPalette {
  scheme: 'light' | 'dark';
  background: string;
  bar: string;
  scene: string;
  active: string;
  inactive: string;
  label: string;
  inactiveLabel: string;
  badge: string;
  badgeText: string;
  indicator: string;
  border: string;
  glassTint: string;
  glassHighlight: string;
  fab: string;
  fabIcon: string;
}

export type HapticFeedback = (key: string, event: HapticEvent) => void;

export interface SmartBottomBarProps {
  items: readonly BottomBarItem[];
  variant?: BottomBarVariant;

  /** Controlled active tab key. Preferred over `activeIndex`. */
  activeKey?: string;
  defaultActiveKey?: string;
  /** Controlled index into the original `items` array (including hidden). */
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (key: string, index: number) => void;
  /** Fired on every press, including re-taps of the active tab. */
  onPress?: (key: string, index: number) => void;
  onLongPress?: (key: string, index: number) => void;
  /** Fired when the already-active tab is pressed (scroll-to-top contract). */
  onDoubleTap?: (key: string, index: number) => void;
  onScrollToTop?: (key: string) => void;

  insets?: EdgeInsets;
  /** When false, fallback insets are 0 unless `insets` is passed. Default true. */
  safeArea?: boolean;
  colorScheme?: ColorSchemePreference;
  rtl?: RtlMode;
  hapticFeedback?: HapticFeedback;
  animation?: AnimationConfig;
  glass?: GlassConfig;
  /**
   * Optional native glass surface. Pass `@callstack/liquid-glass` or
   * `expo-glass-effect` from the host app — this package never imports them.
   */
  renderGlassSurface?: (props: GlassSurfaceProps) => ReactNode;
  style?: BottomBarStyle;
  labelPosition?: LabelPosition;
  keyboardBehavior?: KeyboardBehavior;
  /**
   * Hide/show without unmounting. Combine with `translateOnHide` (default true)
   * to slide the bar off-screen on the native driver.
   */
  visible?: boolean;
  translateOnHide?: boolean;
  /**
   * Window width (dp) at which the bar auto-switches to the `sidebar` rail.
   * Unset means no auto-switch. Typical tablet value: `768`.
   */
  breakpoint?: number;
  height?: number;
  fabKey?: string;
  fabSize?: number;
  /**
   * Screen/scene background used to paint SVG-free notches. Match this to the
   * screen behind the bar so the cutout looks punched-through.
   */
  sceneColor?: string;
  materialMode?: MaterialMode;
  placement?: BarPlacement;
  /**
   * Elevation / drop shadow under the bar. Default depends on variant
   * (`true` for floating / liquidGlass / material / curved / notchedFab;
   * `false` for flat / segmented / sidebar). Pass `true` | `false` to force.
   */
  shadow?: boolean;
  sidebarWidth?: number;
  testID?: string;
  renderItem?: (params: RenderItemParams) => ReactNode;
}

export type VariantBarProps = Omit<SmartBottomBarProps, 'variant'>;

export interface NativeTabConfig {
  key: string;
  title?: string;
  badge?: string | number;
  hidden?: boolean;
  disabled?: boolean;
}
