import type { ReactNode } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { GlassConfig, GlassSurfaceProps, ResolvedPalette } from '../types';
import { glassOpacity, isHexOrNamedColor, supportsBoxShadow } from '../utils';

function resolveTint(
  tint: GlassConfig['tint'],
  colors: ResolvedPalette
): string {
  if (!tint || tint === 'auto') {
    return colors.glassTint;
  }
  if (tint === 'light') {
    return 'rgba(255, 255, 255, 0.86)';
  }
  if (tint === 'dark') {
    return 'rgba(28, 28, 30, 0.84)';
  }
  return tint;
}

/**
 * Soft lift under the capsule.
 *
 * Fabric: `boxShadow` is clipped to outside the shape, so nothing shows
 * through the translucent fill. Paper/Android has no such primitive —
 * `elevation` paints an opaque grey oval under translucent views — so it
 * gets no shadow rather than a broken one.
 */
function liftStyle(isDark: boolean): ViewStyle | null {
  if (supportsBoxShadow()) {
    return {
      boxShadow: isDark
        ? '0px 12px 32px rgba(0, 0, 0, 0.55)'
        : '0px 10px 28px rgba(15, 23, 42, 0.12), 0px 2px 6px rgba(15, 23, 42, 0.06)',
    };
  }
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    };
  }
  return null;
}

const SHADOW_KEYS = [
  'boxShadow',
  'elevation',
  'shadowColor',
  'shadowOffset',
  'shadowOpacity',
  'shadowRadius',
] as const;

/**
 * Shadows on the clipped shell would be cut off, so they move to the outer
 * wrapper (and replace the built-in lift).
 */
function splitShadow(
  style: StyleProp<ViewStyle>
): [ViewStyle | null, ViewStyle] {
  const rest: Record<string, unknown> = { ...StyleSheet.flatten(style) };
  const shadow: Record<string, unknown> = {};
  for (const key of SHADOW_KEYS) {
    if (rest[key] !== undefined) {
      shadow[key] = rest[key];
      delete rest[key];
    }
  }
  return [
    Object.keys(shadow).length ? (shadow as ViewStyle) : null,
    rest as ViewStyle,
  ];
}

/**
 * Zero-dependency liquid-glass capsule: translucent fill + uniform hairline
 * edge + outside-only lift. Hosts can swap in real blur via
 * `renderGlassSurface`.
 */
export function GlassSurface({
  colors,
  glass,
  reduceTransparency,
  cornerRadius,
  style,
  children,
  renderGlassSurface,
  showShadow,
}: {
  colors: ResolvedPalette;
  glass: {
    intensity: 'clear' | 'regular';
    tint: NonNullable<GlassConfig['tint']>;
    cornerRadius?: number;
  };
  reduceTransparency: boolean;
  cornerRadius: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  renderGlassSurface?: (props: GlassSurfaceProps) => ReactNode;
  showShadow?: boolean;
}) {
  const radius = glass.cornerRadius ?? cornerRadius;
  const tint = resolveTint(glass.tint, colors);
  const [customShadow, shellStyle] = splitShadow(style);
  const lift =
    customShadow ?? (showShadow ? liftStyle(colors.scheme === 'dark') : null);

  if (renderGlassSurface && !reduceTransparency) {
    return (
      <View style={[{ borderRadius: radius }, lift]}>
        {renderGlassSurface({
          intensity: glass.intensity,
          tint,
          cornerRadius: radius,
          style: [{ borderRadius: radius, overflow: 'hidden' }, shellStyle],
          children,
        })}
      </View>
    );
  }

  const fill = reduceTransparency
    ? colors.bar
    : isHexOrNamedColor(tint)
      ? tint
      : colors.glassTint;

  return (
    <View style={[{ borderRadius: radius }, lift]}>
      <View
        style={[
          styles.shell,
          { borderRadius: radius, borderColor: colors.border },
          shellStyle,
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: fill,
              opacity: reduceTransparency ? 1 : glassOpacity(glass.intensity),
            },
          ]}
        />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
