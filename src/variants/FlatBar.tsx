import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabSlot, FabSplitRow } from '../components/FabChrome';
import { ItemRow } from '../components/ItemRow';
import { barShadowStyle } from '../theme';
import { runBarAnimation } from '../utils';

export function FlatLayout({ engine }: { engine: BarEngine }) {
  const [width, setWidth] = useState(0);
  const tx = useRef(new Animated.Value(0)).current;
  const withFab = engine.wantsFab && Boolean(engine.fab);
  const count = Math.max(
    withFab ? engine.split.left.length + engine.split.right.length + 1 : engine.shown.length,
    1
  );
  const tabWidth = width / count;
  const visualIndex = engine.rtl
    ? count - 1 - engine.active.visibleIndex
    : engine.active.visibleIndex;
  const indicatorWidth = Math.min(28, Math.max(16, tabWidth * 0.28));
  const target = tabWidth * visualIndex + (tabWidth - indicatorWidth) / 2;

  useEffect(() => {
    if (width === 0 || withFab) {
      return;
    }
    runBarAnimation(tx, target, engine.animation, engine.reduceMotion).start();
  }, [engine.animation, engine.reduceMotion, target, tx, width, withFab]);

  return (
    <BarShell engine={engine} extraHeight={withFab ? engine.fabExtra : 0}>
      <View style={{ height: engine.barHeight + (withFab ? engine.fabExtra : 0) }}>
        <View
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
          style={[
            styles.bar,
            {
              marginTop: withFab ? engine.fabExtra : 0,
              height: engine.barHeight,
              backgroundColor: engine.colors.bar,
              borderTopColor: engine.colors.border,
            },
            barShadowStyle(engine.shadow, 'soft'),
            engine.style?.bar,
          ]}
        >
          {!withFab ? (
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
          ) : null}
          <View style={styles.row}>
            {withFab ? (
              <FabSplitRow engine={engine} />
            ) : (
              <ItemRow engine={engine} items={engine.shown} />
            )}
          </View>
        </View>
        {withFab ? (
          <FabSlot engine={engine} top={engine.fabExtra - engine.fabSize * 0.4} />
        ) : null}
      </View>
    </BarShell>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'visible',
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
