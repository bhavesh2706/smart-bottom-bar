import { StyleSheet, View } from 'react-native';

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

/**
 * Scene-colored circular bite for `notchedFab`. Drawn inside an
 * `overflow: 'hidden'` bar so only the overlapping crescent remains.
 */
export function NotchBite({
  sceneColor,
  size,
  topRatio = 0.5,
}: {
  sceneColor: string;
  size: number;
  topRatio?: number;
}) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.bite,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: sceneColor,
          top: -(size * topRatio),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bump: {
    position: 'absolute',
    alignSelf: 'center',
  },
  bite: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
