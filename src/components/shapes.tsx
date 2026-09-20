import { StyleSheet, View } from 'react-native';

/**
 * SVG-free concave corners for a center notch. The `sceneColor` must match
 * the screen behind the bar so the cutout reads as punched-through.
 */
export function NotchCutout({
  barColor,
  sceneColor,
  width,
  height,
  radius,
}: {
  barColor: string;
  sceneColor: string;
  width: number;
  height: number;
  radius: number;
}) {
  return (
    <View style={[styles.gap, { width, height, backgroundColor: sceneColor }]}>
      <View
        style={[
          styles.corner,
          {
            width: radius,
            height: radius,
            left: -radius,
            backgroundColor: sceneColor,
          },
        ]}
      >
        <View
          style={[
            styles.circle,
            {
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              backgroundColor: barColor,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.corner,
          {
            width: radius,
            height: radius,
            right: -radius,
            backgroundColor: sceneColor,
          },
        ]}
      >
        <View
          style={[
            styles.circle,
            {
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              backgroundColor: barColor,
              left: 0,
              bottom: 0,
            },
          ]}
        />
      </View>
    </View>
  );
}

/**
 * Convex bump used by the `curved` variant — a circle of `barColor` sitting
 * on the top edge, no scene-color matching required.
 */
export function CurveBump({ color, size }: { color: string; size: number }) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.bump,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top: -size * 0.42,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  gap: {
    overflow: 'visible',
  },
  corner: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
  },
  bump: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
