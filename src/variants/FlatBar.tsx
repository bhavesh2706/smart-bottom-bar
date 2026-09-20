import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { ItemRow } from '../components/ItemRow';
import { runBarAnimation } from '../utils';

export function FlatLayout({ engine }: { engine: BarEngine }) {
  const [width, setWidth] = useState(0);
  const tx = useRef(new Animated.Value(0)).current;
  const count = Math.max(engine.shown.length, 1);
  const tabWidth = width / count;
  const visualIndex = engine.rtl
    ? count - 1 - engine.active.visibleIndex
    : engine.active.visibleIndex;
  const indicatorWidth = Math.min(28, Math.max(16, tabWidth * 0.28));
  const target = tabWidth * visualIndex + (tabWidth - indicatorWidth) / 2;

  useEffect(() => {
    if (width === 0) {
      return;
    }
    runBarAnimation(tx, target, engine.animation, engine.reduceMotion).start();
  }, [engine.animation, engine.reduceMotion, target, tx, width]);

  return (
    <BarShell engine={engine}>
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={[
          styles.bar,
          {
            height: engine.barHeight,
            backgroundColor: engine.colors.bar,
            borderTopColor: engine.colors.border,
          },
          engine.style?.bar,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: indicatorWidth,
              backgroundColor: engine.colors.indicator,
              transform: [{ translateX: tx }],
            },
            engine.style?.indicator,
          ]}
        />
        <View style={styles.row}>
          <ItemRow engine={engine} items={engine.shown} />
        </View>
      </View>
    </BarShell>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    borderRadius: 2,
  },
});
