import { StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabSlot, FabSplitRow } from '../components/FabChrome';
import { ItemRow } from '../components/ItemRow';
import { CurveBump, NotchBite } from '../components/shapes';
import { barShadowStyle } from '../theme';

export function CurvedLayout({ engine }: { engine: BarEngine }) {
  const bump = engine.fabSize + 20;
  const extra = engine.fabExtra || engine.fabSize * 0.45;
  const withFab = engine.wantsFab && Boolean(engine.fab);

  return (
    <BarShell engine={engine} extraHeight={withFab ? extra : 0}>
      <View style={{ height: engine.barHeight + (withFab ? extra : 0) }}>
        <View
          style={[
            styles.bar,
            {
              marginTop: withFab ? extra : 0,
              height: engine.barHeight,
              backgroundColor: engine.colors.bar,
            },
            barShadowStyle(engine.shadow, 'soft'),
            engine.style?.bar,
          ]}
        >
          {withFab ? <CurveBump color={engine.colors.bar} size={bump} /> : null}
          <View style={styles.row}>
            {withFab ? (
              <FabSplitRow engine={engine} />
            ) : (
              <ItemRow engine={engine} items={engine.shown} />
            )}
          </View>
        </View>
        {withFab ? (
          <FabSlot engine={engine} top={extra - engine.fabSize * 0.45} />
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
  const extra = engine.fabExtra || engine.fabSize * 0.42;
  const bite = engine.fabSize + 10;
  const withFab = engine.wantsFab && Boolean(engine.fab);

  return (
    <BarShell engine={engine} extraHeight={withFab ? extra : 0}>
      <View
        style={{
          height: engine.barHeight + (withFab ? extra : 0),
          overflow: 'visible',
        }}
      >
        <View
          style={[
            {
              marginTop: withFab ? extra : 0,
              borderRadius: 0,
            },
            barShadowStyle(engine.shadow, 'soft'),
          ]}
        >
          <View
            style={[
              styles.notchedBar,
              {
                height: engine.barHeight,
                backgroundColor: engine.colors.bar,
              },
              engine.style?.bar,
            ]}
          >
            {withFab ? (
              <NotchBite
                sceneColor={engine.sceneColor}
                size={bite}
                topRatio={0.5}
              />
            ) : null}
            <View style={[styles.row, { height: engine.barHeight }]}>
              {withFab ? (
                <FabSplitRow engine={engine} />
              ) : (
                <ItemRow engine={engine} items={engine.shown} />
              )}
            </View>
          </View>
        </View>

        {withFab ? (
          <FabSlot engine={engine} top={extra - engine.fabSize * 0.4} />
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
