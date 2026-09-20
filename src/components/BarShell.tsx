import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, StyleSheet, type ViewStyle } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { runBarAnimation } from '../utils';

export function BarShell({
  engine,
  children,
  extraHeight = 0,
  barStyle,
}: {
  engine: BarEngine;
  children: ReactNode;
  extraHeight?: number;
  barStyle?: ViewStyle;
}) {
  const hiddenOffset =
    engine.barHeight + engine.insets.bottom + extraHeight + 24;
  const translateY = useRef(new Animated.Value(0)).current;

  const target =
    !engine.visible && engine.translateOnHide
      ? hiddenOffset
      : engine.offsetByKeyboard
        ? -engine.keyboardOffset
        : 0;

  useEffect(() => {
    runBarAnimation(
      translateY,
      target,
      engine.animation,
      engine.reduceMotion
    ).start();
  }, [engine.animation, engine.reduceMotion, target, translateY]);

  const overlay = engine.placement === 'overlay';
  const hidden = !engine.visible;

  return (
    <Animated.View
      pointerEvents={hidden ? 'none' : 'auto'}
      testID={engine.testID}
      accessibilityRole="tablist"
      style={[
        overlay ? styles.overlay : styles.docked,
        {
          // Home indicator / gesture inset — host should pass useSafeAreaInsets().
          paddingBottom: engine.insets.bottom,
          paddingLeft: engine.insets.left,
          paddingRight: engine.insets.right,
          transform: [{ translateY }],
        },
        engine.style?.container,
        barStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  docked: {
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
});
