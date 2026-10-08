import { useCallback, useRef, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import type { BottomBarStyle } from '../types';
import { FabButton } from './FabButton';
import { ItemRow } from './ItemRow';

type Side = 'left' | 'right';

/**
 * Shared left | gap | right item row for center-FAB layouts.
 * `center` renders inside the gap (embedded FAB); `onItemLayout` reports
 * item frames relative to this row, across both pods.
 */
export function FabSplitRow({
  engine,
  compact,
  center,
  gap,
  onItemLayout,
  pill,
}: {
  engine: BarEngine;
  compact?: boolean;
  pill?: string;
  center?: ReactNode;
  gap?: number;
  onItemLayout?: (key: string, x: number, width: number) => void;
}) {
  const gapWidth = gap ?? engine.fabSize + 12;
  // Pod offsets and item frames land in separate onLayout passes, in either
  // order — keep both and re-emit whenever one changes.
  const sideX = useRef<Record<Side, number>>({ left: 0, right: 0 });
  const frames = useRef<
    Record<string, { side: Side; x: number; width: number }>
  >({});

  const emit = useCallback(
    (key: string) => {
      const frame = frames.current[key];
      if (frame && onItemLayout) {
        onItemLayout(key, sideX.current[frame.side] + frame.x, frame.width);
      }
    },
    [onItemLayout]
  );

  const podLayout = useCallback(
    (side: Side, event: LayoutChangeEvent) => {
      sideX.current[side] = event.nativeEvent.layout.x;
      Object.keys(frames.current).forEach((key) => {
        if (frames.current[key]?.side === side) {
          emit(key);
        }
      });
    },
    [emit]
  );

  const itemLayout = useCallback(
    (side: Side, key: string, x: number, width: number) => {
      frames.current[key] = { side, x, width };
      emit(key);
    },
    [emit]
  );

  const leftPod = useCallback(
    (event: LayoutChangeEvent) => podLayout('left', event),
    [podLayout]
  );
  const rightPod = useCallback(
    (event: LayoutChangeEvent) => podLayout('right', event),
    [podLayout]
  );
  const leftItem = useCallback(
    (key: string, x: number, width: number) =>
      itemLayout('left', key, x, width),
    [itemLayout]
  );
  const rightItem = useCallback(
    (key: string, x: number, width: number) =>
      itemLayout('right', key, x, width),
    [itemLayout]
  );
  const tracked = Boolean(onItemLayout);

  return (
    <View style={styles.row}>
      <View style={styles.side} onLayout={tracked ? leftPod : undefined}>
        <ItemRow
          engine={engine}
          items={engine.split.left}
          compact={compact}
          pill={pill}
          onItemLayout={tracked ? leftItem : undefined}
        />
      </View>
      <View style={[styles.center, { width: gapWidth }]}>{center}</View>
      <View style={styles.side} onLayout={tracked ? rightPod : undefined}>
        <ItemRow
          engine={engine}
          items={engine.split.right}
          compact={compact}
          pill={pill}
          onItemLayout={tracked ? rightItem : undefined}
        />
      </View>
    </View>
  );
}

/** Raised center FAB overlay. Parent must be `position`-capable / overflow visible. */
export function FabSlot({
  engine,
  top,
  style = engine.style,
}: {
  engine: BarEngine;
  top: number;
  style?: BottomBarStyle;
}) {
  if (!engine.fab) {
    return null;
  }
  return (
    <View
      style={[styles.fabSlot, { top, width: engine.fabSize }]}
      pointerEvents="box-none"
    >
      <FabButton
        item={engine.fab}
        active={engine.fab.key === engine.active.activeKey}
        size={engine.fabSize}
        colors={engine.colors}
        onPress={() => engine.handlePress(engine.fab!.key)}
        onLongPress={() => engine.handleLongPress(engine.fab!.key)}
        style={style}
        pressFeedback={engine.pressFeedback}
        renderFab={engine.renderFab}
        focusProps={engine.roving.itemProps(engine.fab.key)}
        badgeMax={engine.badgeMax}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabSlot: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 4,
    elevation: 10,
  },
});
