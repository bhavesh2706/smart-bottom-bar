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

  const sideLayout = (side: Side) =>
    onItemLayout
      ? (event: LayoutChangeEvent) => {
          sideX.current[side] = event.nativeEvent.layout.x;
          Object.keys(frames.current).forEach((key) => {
            if (frames.current[key]?.side === side) {
              emit(key);
            }
          });
        }
      : undefined;

  const itemLayout = (side: Side) =>
    onItemLayout
      ? (key: string, x: number, width: number) => {
          frames.current[key] = { side, x, width };
          emit(key);
        }
      : undefined;

  return (
    <View style={styles.row}>
      <View style={styles.side} onLayout={sideLayout('left')}>
        <ItemRow
          engine={engine}
          items={engine.split.left}
          compact={compact}
          pill={pill}
          onItemLayout={itemLayout('left')}
        />
      </View>
      <View style={[styles.center, { width: gapWidth }]}>{center}</View>
      <View style={styles.side} onLayout={sideLayout('right')}>
        <ItemRow
          engine={engine}
          items={engine.split.right}
          compact={compact}
          pill={pill}
          onItemLayout={itemLayout('right')}
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
