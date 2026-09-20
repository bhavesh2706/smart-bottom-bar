import { Platform, StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabSlot, FabSplitRow } from '../components/FabChrome';
import { GlassSurface } from '../components/GlassSurface';
import { ItemRow } from '../components/ItemRow';
import { FLOATING_MARGIN, barShadowStyle } from '../theme';

/**
 * Liquid glass — floating frosted pill.
 * Safe-area: BarShell pads the home-indicator; we keep a small float gap so the
 * pill never sits under the system gesture bar (iOS + Android).
 * FAB: one continuous glass surface + center spacer (no split pods).
 */
export function LiquidGlassLayout({ engine }: { engine: BarEngine }) {
  const withFab = engine.wantsFab && Boolean(engine.fab);
  const radius = engine.glass.cornerRadius ?? 30;
  const extra = withFab ? engine.fabExtra : 0;
  // Float clearance above the shell's safe-area padding (never collapse to 0).
  const floatGap = Math.max(FLOATING_MARGIN, Platform.OS === 'ios' ? 12 : 10);

  return (
    <BarShell engine={engine} extraHeight={extra}>
      <View
        style={[
          styles.wrap,
          {
            marginHorizontal: FLOATING_MARGIN,
            marginBottom: floatGap,
            minHeight: engine.barHeight + extra,
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
            shadowStyle={barShadowStyle(engine.shadow, 'raised')}
            showShadow={engine.shadow}
            style={[{ minHeight: engine.barHeight }, engine.style?.bar]}
            renderGlassSurface={engine.renderGlassSurface}
          >
            <View
              style={[
                styles.row,
                {
                  minHeight: engine.barHeight,
                  paddingVertical: Platform.OS === 'ios' ? 2 : 0,
                },
              ]}
            >
              {withFab ? (
                <FabSplitRow engine={engine} />
              ) : (
                <ItemRow engine={engine} items={engine.shown} />
              )}
            </View>
          </GlassSurface>
        </View>

        {withFab ? (
          <FabSlot engine={engine} top={extra - engine.fabSize * 0.38} />
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
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
});
