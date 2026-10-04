import { useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { BarShell } from '../components/BarShell';
import { FabButton } from '../components/FabButton';
import { FabSplitRow } from '../components/FabChrome';
import { GlassLens, type ItemFrame } from '../components/GlassLens';
import { GlassSurface } from '../components/GlassSurface';
import { ItemRow } from '../components/ItemRow';
import type { BottomBarStyle } from '../types';

/** Lens inset from the capsule edge — keeps lens and capsule radii concentric. */
const LENS_INSET = 6;
const SIDE_MARGIN = 16;

/**
 * Liquid glass — floating frosted capsule with a sliding selection lens.
 * Center FAB is embedded in the capsule (no raised overlap, no extra height).
 * BarShell pads the home indicator; the float gap keeps the capsule clear of
 * the system gesture bar on iOS and Android.
 */
export function LiquidGlassLayout({ engine }: { engine: BarEngine }) {
  const withFab = engine.wantsFab && Boolean(engine.fab);
  const height = engine.barHeight;
  const radius = engine.glass.cornerRadius ?? height / 2;
  const fabSize = Math.min(engine.fabSize, height - LENS_INSET * 2 - 2);
  const floatGap = Platform.OS === 'ios' ? 12 : 10;

  const [frames, setFrames] = useState<Record<string, ItemFrame>>({});
  const onItemLayout = useCallback((key: string, x: number, width: number) => {
    setFrames((prev) => {
      const old = prev[key];
      if (
        old &&
        Math.abs(old.x - x) < 0.5 &&
        Math.abs(old.width - width) < 0.5
      ) {
        return prev;
      }
      return { ...prev, [key]: { x, width } };
    });
  }, []);

  // Only frames for items currently rendered as tabs (not the FAB, not removed).
  const tabFrames = useMemo(() => {
    const keys = withFab
      ? [...engine.split.left, ...engine.split.right].map((item) => item.key)
      : engine.shown.map((item) => item.key);
    const next: Record<string, ItemFrame> = {};
    keys.forEach((key) => {
      const frame = frames[key];
      if (frame) {
        next[key] = frame;
      }
    });
    return next;
  }, [frames, withFab, engine.split, engine.shown]);

  const fabStyle = useMemo<BottomBarStyle>(
    () => ({
      ...engine.style,
      fab: [
        styles.fabGlow,
        { shadowColor: engine.colors.fab },
        engine.style?.fab,
      ],
    }),
    [engine.style, engine.colors.fab]
  );

  const fab = engine.fab;

  return (
    <BarShell engine={engine}>
      <View style={{ marginHorizontal: SIDE_MARGIN, marginBottom: floatGap }}>
        <GlassSurface
          colors={engine.colors}
          glass={engine.glass}
          reduceTransparency={engine.reduceTransparency}
          cornerRadius={radius}
          showShadow={engine.shadow}
          style={[{ minHeight: height }, engine.style?.bar]}
          renderGlassSurface={engine.renderGlassSurface}
        >
          <View style={styles.pad}>
            <View style={[styles.track, { minHeight: height }]}>
              <GlassLens
                frames={tabFrames}
                activeKey={engine.active.activeKey}
                color={engine.colors.indicator}
                inset={LENS_INSET}
                reduceMotion={engine.reduceMotion}
                style={engine.style?.indicator}
                testID={`${engine.testID}-lens`}
              />
              {withFab && fab ? (
                <FabSplitRow
                  engine={engine}
                  gap={fabSize + 16}
                  onItemLayout={onItemLayout}
                  center={
                    <FabButton
                      item={fab}
                      active={fab.key === engine.active.activeKey}
                      size={fabSize}
                      colors={engine.colors}
                      raised={false}
                      onPress={() => engine.handlePress(fab.key)}
                      onLongPress={() => engine.handleLongPress(fab.key)}
                      style={fabStyle}
                    />
                  }
                />
              ) : (
                <ItemRow
                  engine={engine}
                  items={engine.shown}
                  onItemLayout={onItemLayout}
                />
              )}
            </View>
          </View>
        </GlassSurface>
      </View>
    </BarShell>
  );
}

const styles = StyleSheet.create({
  pad: {
    paddingHorizontal: LENS_INSET - 2,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fabGlow: {
    elevation: 4,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
