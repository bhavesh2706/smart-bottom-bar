import { StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabButton } from '../components/FabButton';
import { ItemRow } from '../components/ItemRow';
import { CurveBump, NotchCutout } from '../components/shapes';
import { NOTCH_RADIUS } from '../theme';

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

export function NotchedFabLayout({ engine }: { engine: BarEngine }) {
  const gap = engine.fabSize + 16;
  const extra = engine.fabSize * 0.4;

  return (
    <BarShell engine={engine} extraHeight={extra}>
      <View style={{ height: engine.barHeight + extra }}>
        <View
          style={[
            styles.row,
            {
              marginTop: extra,
              height: engine.barHeight,
              alignItems: 'stretch',
            },
          ]}
        >
          <View
            style={[
              styles.sideFill,
              { backgroundColor: engine.colors.bar },
              engine.style?.bar,
            ]}
          >
            <ItemRow engine={engine} items={engine.split.left} />
          </View>
          <NotchCutout
            barColor={engine.colors.bar}
            sceneColor={engine.sceneColor}
            width={gap}
            height={engine.barHeight}
            radius={NOTCH_RADIUS}
          />
          <View
            style={[
              styles.sideFill,
              { backgroundColor: engine.colors.bar },
              engine.style?.bar,
            ]}
          >
            <ItemRow engine={engine} items={engine.split.right} />
          </View>
        </View>
        {engine.fab ? (
          <View
            style={[
              styles.fabSlot,
              { top: extra - engine.fabSize * 0.35, width: engine.fabSize },
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
  sideFill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fabSlot: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
  },
});
