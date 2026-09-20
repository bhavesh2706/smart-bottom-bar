import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabButton } from '../components/FabButton';
import { FabSlot, FabSplitRow } from '../components/FabChrome';
import { ItemRow } from '../components/ItemRow';
import { WAVE_BUBBLE, barShadowStyle } from '../theme';
import { runBarAnimation } from '../utils';

export function WaveLayout({ engine }: { engine: BarEngine }) {
  const [width, setWidth] = useState(0);
  const tx = useRef(new Animated.Value(0)).current;
  const withFab = engine.wantsFab && Boolean(engine.fab);
  const extra = withFab ? engine.fabExtra : WAVE_BUBBLE * 0.38;
  const count = Math.max(engine.shown.length, 1);
  const tabWidth = width / count;
  const visualIndex = engine.rtl
    ? count - 1 - engine.active.visibleIndex
    : engine.active.visibleIndex;
  const target = tabWidth * visualIndex + (tabWidth - WAVE_BUBBLE) / 2;

  useEffect(() => {
    if (width === 0 || withFab) {
      return;
    }
    runBarAnimation(tx, target, engine.animation, engine.reduceMotion).start();
  }, [engine.animation, engine.reduceMotion, target, tx, width, withFab]);

  const activeItem =
    engine.shown[engine.active.visibleIndex] ?? engine.shown[0];

  if (withFab) {
    return (
      <BarShell engine={engine} extraHeight={extra}>
        <View style={{ height: engine.barHeight + extra }}>
          <View
            style={[
              styles.bar,
              {
                marginTop: extra,
                height: engine.barHeight,
                backgroundColor: engine.colors.bar,
              },
              barShadowStyle(engine.shadow, 'soft'),
              engine.style?.bar,
            ]}
          >
            <FabSplitRow engine={engine} />
          </View>
          <FabSlot engine={engine} top={extra - engine.fabSize * 0.4} />
        </View>
      </BarShell>
    );
  }

  return (
    <BarShell engine={engine} extraHeight={extra}>
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={{ height: engine.barHeight + extra }}
      >
        <View
          style={[
            styles.bar,
            {
              marginTop: extra,
              height: engine.barHeight,
              backgroundColor: engine.colors.bar,
            },
            barShadowStyle(engine.shadow, 'soft'),
            engine.style?.bar,
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.bubble,
              {
                width: WAVE_BUBBLE,
                height: WAVE_BUBBLE,
                borderRadius: WAVE_BUBBLE / 2,
                backgroundColor: engine.colors.bar,
                top: -WAVE_BUBBLE * 0.42,
                transform: [{ translateX: tx }],
              },
              engine.style?.indicator,
            ]}
          />
          <View style={styles.row}>
            <ItemRow
              engine={{ ...engine, labelPosition: 'hidden' }}
              items={engine.shown}
            />
          </View>
        </View>
        {activeItem ? (
          <Animated.View
            style={[
              styles.floatIcon,
              {
                top: extra - engine.fabSize * 0.45,
                width: WAVE_BUBBLE,
                transform: [{ translateX: tx }],
              },
            ]}
          >
            <FabButton
              item={activeItem}
              active
              size={engine.fabSize}
              colors={engine.colors}
              onPress={() => engine.handlePress(activeItem.key)}
              onLongPress={() => engine.handleLongPress(activeItem.key)}
              style={engine.style}
            />
          </Animated.View>
        ) : null}
      </View>
    </BarShell>
  );
}

const styles = StyleSheet.create({
  bar: {
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 4,
  },
  bubble: {
    position: 'absolute',
    left: 0,
  },
  floatIcon: {
    position: 'absolute',
    left: 0,
    alignItems: 'center',
  },
});
