import { StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabButton } from '../components/FabButton';
import { GlassSurface } from '../components/GlassSurface';
import { ItemRow } from '../components/ItemRow';
import { NotchCutout } from '../components/shapes';
import { FLOATING_MARGIN, NOTCH_RADIUS } from '../theme';

export function LiquidGlassLayout({ engine }: { engine: BarEngine }) {
  const withFab = engine.wantsFab;
  const radius = engine.glass.cornerRadius ?? 28;
  const extra = withFab && engine.fab ? engine.fabSize * 0.4 : 0;
  const gap = engine.fabSize + 16;

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
        {withFab && engine.fab ? (
          <>
            <View
              style={[
                styles.notchRow,
                { marginTop: extra, height: engine.barHeight },
              ]}
            >
              <GlassSurface
                colors={engine.colors}
                glass={engine.glass}
                reduceTransparency={engine.reduceTransparency}
                reduceMotion={engine.reduceMotion}
                sweepKey={engine.active.activeKey}
                cornerRadius={radius}
                style={[styles.sideGlass, engine.style?.bar]}
                renderGlassSurface={engine.renderGlassSurface}
              >
                <View style={styles.row}>
                  <ItemRow engine={engine} items={engine.split.left} />
                </View>
              </GlassSurface>
              <NotchCutout
                barColor="transparent"
                sceneColor={engine.sceneColor}
                width={gap}
                height={engine.barHeight}
                radius={NOTCH_RADIUS}
              />
              <GlassSurface
                colors={engine.colors}
                glass={engine.glass}
                reduceTransparency={engine.reduceTransparency}
                reduceMotion={engine.reduceMotion}
                sweepKey={engine.active.activeKey}
                cornerRadius={radius}
                style={[styles.sideGlass, engine.style?.bar]}
                renderGlassSurface={engine.renderGlassSurface}
              >
                <View style={styles.row}>
                  <ItemRow engine={engine} items={engine.split.right} />
                </View>
              </GlassSurface>
            </View>
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
          </>
        ) : (
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
              <ItemRow engine={engine} items={engine.shown} />
            </View>
          </GlassSurface>
        )}
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
  },
  notchRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  sideGlass: {
    flex: 1,
  },
  fabSlot: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
  },
});
