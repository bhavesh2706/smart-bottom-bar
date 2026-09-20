import { StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { ItemRow } from '../components/ItemRow';
import { FLOATING_MARGIN } from '../theme';

export function FloatingLayout({ engine }: { engine: BarEngine }) {
  const radius = 28;
  return (
    <BarShell engine={engine}>
      <View
        style={[
          styles.wrap,
          { marginBottom: FLOATING_MARGIN, marginHorizontal: FLOATING_MARGIN },
        ]}
      >
        <View
          style={[
            styles.bar,
            {
              height: engine.barHeight,
              backgroundColor: engine.colors.bar,
              borderRadius: radius,
            },
            engine.style?.bar,
          ]}
        >
          <ItemRow engine={engine} items={engine.shown} />
        </View>
      </View>
    </BarShell>
  );
}

export function SegmentedLayout({ engine }: { engine: BarEngine }) {
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
  return (
    <BarShell engine={engine}>
      <View
        style={[
          styles.material,
          {
            height: engine.barHeight,
            backgroundColor: engine.colors.bar,
          },
          engine.style?.bar,
        ]}
      >
        <ItemRow engine={engine} items={engine.shown} compact={shifting} />
      </View>
    </BarShell>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  segmented: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  segment: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  material: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -1 },
  },
});
