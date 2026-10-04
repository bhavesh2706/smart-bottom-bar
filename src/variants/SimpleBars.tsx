import { StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabSlot, FabSplitRow } from '../components/FabChrome';
import { ItemRow } from '../components/ItemRow';
import { FLOATING_MARGIN, barShadowStyle } from '../theme';

export function FloatingLayout({ engine }: { engine: BarEngine }) {
  const radius = 28;
  const withFab = engine.wantsFab && Boolean(engine.fab);

  return (
    <BarShell engine={engine} extraHeight={withFab ? engine.fabExtra : 0}>
      <View
        style={[
          styles.wrap,
          {
            marginBottom: engine.floatingMargin ?? FLOATING_MARGIN,
            marginHorizontal: engine.floatingMargin ?? FLOATING_MARGIN,
            height: engine.barHeight + (withFab ? engine.fabExtra : 0),
          },
        ]}
      >
        <View
          style={[
            styles.bar,
            {
              marginTop: withFab ? engine.fabExtra : 0,
              height: engine.barHeight,
              backgroundColor: engine.colors.bar,
              borderRadius: radius,
            },
            barShadowStyle(engine.shadow, 'raised'),
            engine.style?.bar,
          ]}
        >
          {withFab ? (
            <FabSplitRow engine={engine} />
          ) : (
            <ItemRow engine={engine} items={engine.shown} />
          )}
        </View>
        {withFab ? (
          <FabSlot
            engine={engine}
            top={engine.fabExtra - engine.fabSize * 0.4}
          />
        ) : null}
      </View>
    </BarShell>
  );
}

export function SegmentedLayout({ engine }: { engine: BarEngine }) {
  const withFab = engine.wantsFab && Boolean(engine.fab);

  if (withFab) {
    return (
      <BarShell engine={engine} extraHeight={engine.fabExtra}>
        <View
          style={{
            paddingHorizontal: 12,
            paddingTop: 6,
            height: engine.barHeight + engine.fabExtra + 6,
          }}
        >
          <View
            style={[
              styles.segmented,
              {
                marginTop: engine.fabExtra,
                height: engine.barHeight,
                backgroundColor: engine.colors.bar,
                borderRadius: engine.barHeight / 2,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: engine.colors.border,
              },
              barShadowStyle(engine.shadow, 'soft'),
              engine.style?.bar,
            ]}
          >
            <FabSplitRow engine={engine} compact />
          </View>
          <FabSlot
            engine={engine}
            top={engine.fabExtra - engine.fabSize * 0.35}
          />
        </View>
      </BarShell>
    );
  }

  return (
    <BarShell engine={engine}>
      <View style={{ paddingHorizontal: 12, paddingTop: 6 }}>
        <View
          style={[
            styles.segmented,
            {
              height: engine.barHeight,
              backgroundColor: engine.colors.background,
              borderRadius: engine.barHeight / 2,
            },
            barShadowStyle(engine.shadow, 'soft'),
            engine.style?.bar,
          ]}
        >
          {engine.shown.map((item) => {
            const active = item.key === engine.active.activeKey;
            return (
              <View
                key={item.key}
                style={[
                  styles.segment,
                  active
                    ? {
                        backgroundColor: engine.colors.bar,
                        borderRadius: engine.barHeight / 2 - 3,
                      }
                    : null,
                ]}
              >
                <ItemRow
                  engine={{
                    ...engine,
                    shown: [item],
                    labelPosition:
                      engine.labelPosition === 'hidden' ? 'hidden' : 'beside',
                  }}
                  items={[item]}
                />
              </View>
            );
          })}
        </View>
      </View>
    </BarShell>
  );
}

export function MaterialLayout({ engine }: { engine: BarEngine }) {
  const shifting = engine.materialMode === 'shifting';
  const withFab = engine.wantsFab && Boolean(engine.fab);

  return (
    <BarShell engine={engine} extraHeight={withFab ? engine.fabExtra : 0}>
      <View
        style={{ height: engine.barHeight + (withFab ? engine.fabExtra : 0) }}
      >
        <View
          style={[
            styles.material,
            {
              marginTop: withFab ? engine.fabExtra : 0,
              height: engine.barHeight,
              backgroundColor: engine.colors.bar,
            },
            barShadowStyle(engine.shadow, 'soft'),
            engine.style?.bar,
          ]}
        >
          {withFab ? (
            <FabSplitRow
              engine={engine}
              compact={shifting}
              pill={engine.colors.indicator}
            />
          ) : (
            <ItemRow
              engine={engine}
              items={engine.shown}
              compact={shifting}
              pill={engine.colors.indicator}
            />
          )}
        </View>
        {withFab ? (
          <FabSlot
            engine={engine}
            top={engine.fabExtra - engine.fabSize * 0.4}
          />
        ) : null}
      </View>
    </BarShell>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'visible',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
  segmented: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    overflow: 'visible',
  },
  segment: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  material: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
});
