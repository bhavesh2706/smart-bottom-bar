import { useEffect, useState, type ReactNode } from 'react';
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
  const [translateY] = useState(() => new Animated.Value(0));

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
      onKeyDown={engine.roving.onKeyDown}
      style={[
        overlay ? styles.overlay : styles.docked,
        {
          // Home indicator / gesture inset — host should pass useSafeAreaInsets().
          paddingBottom: engine.insets.bottom,
          paddingLeft: engine.insets.left,
          paddingRight: engine.insets.right,
          transform: [{ translateY }],
        },
        hidden && !engine.translateOnHide ? styles.invisible : null,
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
  invisible: {
    opacity: 0,
  },
});
