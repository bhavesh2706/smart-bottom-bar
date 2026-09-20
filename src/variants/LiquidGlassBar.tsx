import { StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabButton } from '../components/FabButton';
import { GlassSurface } from '../components/GlassSurface';
import { ItemRow } from '../components/ItemRow';
import { FLOATING_MARGIN } from '../theme';

/**
 * Liquid glass is a floating translucent pill. With a FAB we keep one continuous
 * glass surface and leave a center spacer — split pods clipped side items on
 * narrow phones.
 */
export function LiquidGlassLayout({ engine }: { engine: BarEngine }) {
  const withFab = engine.wantsFab && Boolean(engine.fab);
  const radius = engine.glass.cornerRadius ?? 28;
  const extra = withFab ? engine.fabSize * 0.42 : 0;
  const gap = engine.fabSize + 12;

  return (
    <BarShell engine={engine} extraHeight={extra}>
      <View
        style={[
          styles.wrap,
          {
            marginHorizontal: FLOATING_MARGIN,
            marginBottom: FLOATING_MARGIN,
            height: engine.barHeight + extra,
          },
        ]}
      >
        <View style={withFab ? { marginTop: extra } : null}>
          <GlassSurface
            colors={engine.colors}
            glass={engine.glass}
            reduceTransparency={engine.reduceTransparency}
            reduceMotion={engine.reduceMotion}
            sweepKey={engine.active.activeKey}
            cornerRadius={radius}
            style={[{ height: engine.barHeight }, engine.style?.bar]}
            renderGlassSurface={engine.renderGlassSurface}
          >
            <View style={[styles.row, { height: engine.barHeight }]}>
              {withFab ? (
                <>
                  <View style={styles.side}>
                    <ItemRow engine={engine} items={engine.split.left} />
                  </View>
                  <View style={{ width: gap }} />
                  <View style={styles.side}>
                    <ItemRow engine={engine} items={engine.split.right} />
                  </View>
                </>
              ) : (
                <ItemRow engine={engine} items={engine.shown} />
              )}
            </View>
          </GlassSurface>
        </View>

        {withFab && engine.fab ? (
          <View
            style={[
              styles.fabSlot,
              { top: extra - engine.fabSize * 0.38, width: engine.fabSize },
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
  wrap: {
    overflow: 'visible',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
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
    elevation: 8,
  },
});
