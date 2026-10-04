import { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export interface ItemFrame {
  x: number;
  width: number;
}

const MAX_LENS_WIDTH = 84;

/**
 * Selection capsule that slides between measured item frames.
 * Width is shared across items so the lens never morphs mid-slide.
 */
export function GlassLens({
  frames,
  activeKey,
  color,
  inset,
  reduceMotion,
  style,
  testID,
}: {
  frames: Record<string, ItemFrame>;
  activeKey: string;
  color: string;
  inset: number;
  reduceMotion: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const shown = useRef(false);

  const widths = Object.values(frames).map((frame) => frame.width);
  const lensWidth =
    widths.length > 0 ? Math.min(Math.min(...widths) - 4, MAX_LENS_WIDTH) : 0;
  const frame = frames[activeKey];
  const target = frame ? frame.x + (frame.width - lensWidth) / 2 : null;

  useEffect(() => {
    if (target == null) {
      shown.current = false;
      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }).start();
      return;
    }
    // First placement (or returning from hidden): appear in place, don't
    // slide in from a stale position.
    if (!shown.current || reduceMotion) {
      translateX.setValue(target);
      shown.current = true;
      if (reduceMotion) {
        opacity.setValue(1);
      } else {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }).start();
      }
      return;
    }
    Animated.spring(translateX, {
      toValue: target,
      damping: 20,
      stiffness: 260,
      mass: 0.9,
      useNativeDriver: true,
    }).start();
  }, [target, reduceMotion, translateX, opacity]);

  if (lensWidth <= 0) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      testID={testID}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.lens,
        {
          top: inset,
          bottom: inset,
          width: lensWidth,
          backgroundColor: color,
          opacity,
          transform: [{ translateX }],
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  lens: {
    position: 'absolute',
    left: 0,
    borderRadius: 999,
  },
});
