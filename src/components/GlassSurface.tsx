import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { GlassConfig, GlassSurfaceProps, ResolvedPalette } from '../types';
import { glassOpacity, isHexOrNamedColor } from '../utils';

function resolveTint(
  tint: GlassConfig['tint'],
  colors: ResolvedPalette
): string {
  if (!tint || tint === 'auto') {
    return colors.glassTint;
  }
  if (tint === 'light') {
    return 'rgba(255, 255, 255, 0.55)';
  }
  if (tint === 'dark') {
    return 'rgba(30, 30, 32, 0.58)';
  }
  return tint;
}

/**
 * Liquid-glass (zero native blur).
 *
 * Hard rules from device QA:
 * - No top specular strip (reads as a hairline on the pill)
 * - No opaque under-plates (reads as a solid grey blob in light mode)
 * - No Android elevation on translucent fills (system draws a hard grey oval)
 * - Rim is a soft edge only — never a thick stroke
 */
export function GlassSurface({
  colors,
  glass,
  reduceTransparency,
  reduceMotion,
  sweepKey,
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
  reduceMotion: boolean;
  sweepKey: string;
  cornerRadius: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  renderGlassSurface?: (props: GlassSurfaceProps) => ReactNode;
  shadowStyle?: StyleProp<ViewStyle>;
  showShadow?: boolean;
}) {
  const radius = glass.cornerRadius ?? cornerRadius;
  const tint = resolveTint(glass.tint, colors);
  const fillOpacity = reduceTransparency ? 1 : glassOpacity(glass.intensity);
  const sweep = useRef(new Animated.Value(0)).current;
  const isDark = colors.scheme === 'dark';
  const shadowOn = showShadow === true;

  useEffect(() => {
    if (reduceMotion || reduceTransparency) {
      sweep.setValue(0);
      return;
    }
    sweep.setValue(0);
    Animated.timing(sweep, {
      toValue: 1,
      duration: 860,
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, reduceTransparency, sweep, sweepKey]);

  const surfaceProps: GlassSurfaceProps = {
    intensity: glass.intensity,
    tint,
    cornerRadius: radius,
    style: [{ borderRadius: radius, overflow: 'hidden' }, style],
    children,
  };

  // iOS can soft-shadow translucent views. Android elevation cannot —
  // it paints an opaque grey oval under glass (the “big shadow” bug).
  const iosLift: ViewStyle | null =
    shadowOn && Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.4 : 0.1,
          shadowRadius: isDark ? 12 : 8,
          shadowOffset: { width: 0, height: isDark ? 5 : 3 },
        }
      : null;

  if (renderGlassSurface && !reduceTransparency) {
    return (
      <View style={[{ borderRadius: radius }, iosLift]}>
        {renderGlassSurface(surfaceProps)}
      </View>
    );
  }

  const solid = reduceTransparency
    ? colors.bar
    : isHexOrNamedColor(tint)
      ? tint
      : colors.glassTint;

  return (
    <View style={[styles.outer, { borderRadius: radius }, iosLift]}>
      {/*
        Android cannot elevation-shadow translucent glass (grey oval blob).
        Light: no under-shade — user QA flagged any bottom plate as a big issue.
        Dark: tiny contact shade only (invisible as a blob on black).
      */}
      {shadowOn && Platform.OS === 'android' && isDark ? (
        <View
          pointerEvents="none"
          style={[
            styles.androidSoftShade,
            {
              borderRadius: radius,
              backgroundColor: 'rgba(0,0,0,0.4)',
            },
          ]}
        />
      ) : null}

      {/*
        No stroke rim — hairline borders on a capsule read as a hard top/bottom
        “view line” on device (especially dark). Edge definition comes from frost.
      */}
      <View
        style={[
          styles.shell,
          {
            borderRadius: radius,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: radius,
              backgroundColor: solid,
              opacity: fillOpacity,
            },
          ]}
        />
        {!reduceTransparency && !reduceMotion ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.sweep,
              {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(255,255,255,0.22)',
                opacity: sweep.interpolate({
                  inputRange: [0, 0.28, 1],
                  outputRange: [0, 0.18, 0],
                }),
                transform: [
                  {
                    translateX: sweep.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 320],
                    }),
                  },
                ],
              },
            ]}
          />
        ) : null}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
  },
  androidSoftShade: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: -3,
    height: 6,
    opacity: 0.55,
  },
  shell: {
    backgroundColor: 'transparent',
  },
  sweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
  },
  content: {
    zIndex: 2,
  },
});
