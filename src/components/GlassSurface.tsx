import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
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
    return 'rgba(255, 255, 255, 0.72)';
  }
  if (tint === 'dark') {
    return 'rgba(20, 20, 22, 0.72)';
  }
  return tint;
}

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
}) {
  const radius = glass.cornerRadius ?? cornerRadius;
  const tint = resolveTint(glass.tint, colors);
  const opacity = reduceTransparency ? 1 : glassOpacity(glass.intensity);
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion || reduceTransparency) {
      sweep.setValue(0);
      return;
    }
    sweep.setValue(0);
    Animated.timing(sweep, {
      toValue: 1,
      duration: 700,
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

  if (renderGlassSurface && !reduceTransparency) {
    return <>{renderGlassSurface(surfaceProps)}</>;
  }

  const bg = reduceTransparency
    ? colors.bar
    : isHexOrNamedColor(tint)
      ? tint
      : colors.glassTint;

  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: bg,
          opacity: reduceTransparency ? 1 : opacity,
          borderRadius: radius,
        },
        style,
      ]}
    >
      {!reduceTransparency ? (
        <View
          pointerEvents="none"
          style={[styles.highlight, { backgroundColor: colors.glassHighlight }]}
        />
      ) : null}
      {!reduceTransparency && !reduceMotion ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.sweep,
            {
              opacity: sweep.interpolate({
                inputRange: [0, 0.4, 1],
                outputRange: [0, 0.35, 0],
              }),
              transform: [
                {
                  translateX: sweep.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-80, 280],
                  }),
                },
              ],
            },
          ]}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    opacity: 0.85,
  },
  sweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 56,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
});
