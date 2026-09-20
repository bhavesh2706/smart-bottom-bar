import { StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { FabButton } from './FabButton';
import { ItemRow } from './ItemRow';

/** Shared left | gap | right item row for center-FAB layouts. */
export function FabSplitRow({
  engine,
  compact,
}: {
  engine: BarEngine;
  compact?: boolean;
}) {
  const gap = engine.fabSize + 12;
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        <ItemRow engine={engine} items={engine.split.left} compact={compact} />
      </View>
      <View style={{ width: gap }} />
      <View style={styles.side}>
        <ItemRow engine={engine} items={engine.split.right} compact={compact} />
      </View>
    </View>
  );
}

/** Raised center FAB overlay. Parent must be `position`-capable / overflow visible. */
export function FabSlot({
  engine,
  top,
}: {
  engine: BarEngine;
  top: number;
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
        style={engine.style}
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
  fabSlot: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 4,
    elevation: 10,
  },
});
