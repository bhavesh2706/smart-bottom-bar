import { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabButton } from '../components/FabButton';
import { FabSlot, FabSplitRow } from '../components/FabChrome';
import { ItemRow } from '../components/ItemRow';
import { barShadowStyle } from '../theme';
import { runBarAnimation } from '../utils';

export function WaveLayout({ engine }: { engine: BarEngine }) {
  const [width, setWidth] = useState(0);
  const [tx] = useState(() => new Animated.Value(0));
  const withFab = engine.wantsFab && Boolean(engine.fab);
  const bubble = engine.bubbleSize;
  const extra = withFab ? engine.fabExtra : bubble * 0.38;
  const count = Math.max(engine.shown.length, 1);
  const tabWidth = width / count;
  const visualIndex = engine.rtl
    ? count - 1 - engine.active.visibleIndex
    : engine.active.visibleIndex;
  const target = tabWidth * visualIndex + (tabWidth - bubble) / 2;

  useEffect(() => {
    if (width === 0 || withFab) {
      return;
    }
    runBarAnimation(tx, target, engine.animation, engine.reduceMotion).start();
  }, [engine.animation, engine.reduceMotion, target, tx, width, withFab]);

  const activeItem =
    engine.shown[engine.active.visibleIndex] ?? engine.shown[0];
  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  if (withFab) {
    // Measured here too: web never reports layout for an onLayout added to a
    // reused View, so dropping the FAB at runtime would leave width at 0.
    return (
      <BarShell engine={engine} extraHeight={extra}>
        <View onLayout={onLayout} style={{ height: engine.barHeight + extra }}>
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
      <View onLayout={onLayout} style={{ height: engine.barHeight + extra }}>
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
                width: bubble,
                height: bubble,
                borderRadius: bubble / 2,
                backgroundColor: engine.colors.bar,
                top: -bubble * 0.42,
                transform: [{ translateX: tx }],
              },
              engine.style?.indicator,
            ]}
          />
          <View style={styles.row}>
            <ItemRow
              engine={{ ...engine, labelPosition: 'hidden' }}
              items={engine.shown}
              ghostKey={activeItem?.key}
            />
          </View>
        </View>
        {activeItem ? (
          <Animated.View
            style={[
              styles.floatIcon,
              {
                top: extra - engine.fabSize * 0.45,
                width: bubble,
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
              pressFeedback={engine.pressFeedback}
              focusProps={engine.roving.itemProps(activeItem.key)}
              badgeMax={engine.badgeMax}
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
