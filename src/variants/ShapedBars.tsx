import { StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabButton } from '../components/FabButton';
import { ItemRow } from '../components/ItemRow';
import { CurveBump, NotchBite } from '../components/shapes';

export function CurvedLayout({ engine }: { engine: BarEngine }) {
  const bump = engine.fabSize + 20;
  const extra = engine.fabSize * 0.45;

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
            engine.style?.bar,
          ]}
        >
          <CurveBump color={engine.colors.bar} size={bump} />
          <View style={styles.row}>
            <View style={styles.side}>
              <ItemRow engine={engine} items={engine.split.left} />
            </View>
            <View style={{ width: engine.fabSize + 8 }} />
            <View style={styles.side}>
              <ItemRow engine={engine} items={engine.split.right} />
            </View>
          </View>
        </View>
        {engine.fab ? (
          <View
            style={[
              styles.fabSlot,
              { top: extra - engine.fabSize * 0.45, width: engine.fabSize },
            ]}
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
        ) : null}
      </View>
    </BarShell>
  );
}

/**
 * Notched FAB: continuous bar + center spacer + raised FAB.
 * True concave SVG cutouts are out of scope (zero-deps); we approximate with
 * a scene-colored circular bite from the top that keeps a solid bottom edge.
 */
export function NotchedFabLayout({ engine }: { engine: BarEngine }) {
  const gap = engine.fabSize + 10;
  const extra = engine.fabSize * 0.42;
  // Diameter just larger than the FAB; positioned so ~40% of the circle sits
  // in the bar (visible crescent) while the bottom ~half of the bar stays solid.
  const bite = engine.fabSize + 10;

  return (
    <BarShell engine={engine} extraHeight={extra}>
      <View style={{ height: engine.barHeight + extra, overflow: 'visible' }}>
        <View
          style={[
            styles.notchedBar,
            {
              marginTop: extra,
              height: engine.barHeight,
              backgroundColor: engine.colors.bar,
            },
            engine.style?.bar,
          ]}
        >
          <NotchBite sceneColor={engine.sceneColor} size={bite} topRatio={0.5} />
          <View style={[styles.row, { height: engine.barHeight }]}>
            <View style={styles.side}>
              <ItemRow engine={engine} items={engine.split.left} />
            </View>
            <View style={{ width: gap }} />
            <View style={styles.side}>
              <ItemRow engine={engine} items={engine.split.right} />
            </View>
          </View>
        </View>

        {engine.fab ? (
          <View
            style={[
              styles.fabSlot,
              { top: extra - engine.fabSize * 0.4, width: engine.fabSize },
            ]}
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
        ) : null}
      </View>
    </BarShell>
  );
}

const styles = StyleSheet.create({
  bar: {
    overflow: 'visible',
    justifyContent: 'flex-end',
  },
  notchedBar: {
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  row: {
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
    zIndex: 3,
  },
});
