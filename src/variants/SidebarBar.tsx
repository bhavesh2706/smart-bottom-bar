import { StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { FabButton } from '../components/FabButton';
import { ItemRow } from '../components/ItemRow';
import { DEFAULT_SIDEBAR_WIDTH, barShadowStyle } from '../theme';

export function SidebarLayout({ engine }: { engine: BarEngine }) {
  const width = engine.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH;
  // Navigation-rail pattern: the FAB leads the rail instead of sitting mid-list.
  const fab = engine.wantsFab ? engine.fab : undefined;

  return (
    <View
      testID={engine.testID}
      accessibilityRole="tablist"
      pointerEvents={engine.visible ? 'auto' : 'none'}
      style={[
        styles.rail,
        {
          width,
          paddingTop: engine.insets.top + 8,
          paddingBottom: engine.insets.bottom + 8,
          paddingLeft: engine.insets.left,
          backgroundColor: engine.colors.bar,
          borderRightColor: engine.colors.border,
          opacity: engine.visible ? 1 : 0,
        },
        barShadowStyle(engine.shadow, 'soft'),
        engine.style?.container,
        engine.style?.bar,
      ]}
    >
      {fab ? (
        <View style={styles.fab}>
          <FabButton
            item={fab}
            active={fab.key === engine.active.activeKey}
            size={Math.min(engine.fabSize, width - 24)}
            colors={engine.colors}
            onPress={() => engine.handlePress(fab.key)}
            onLongPress={() => engine.handleLongPress(fab.key)}
            style={engine.style}
            pressFeedback={engine.pressFeedback}
            renderFab={engine.renderFab}
          />
        </View>
      ) : null}
      <ItemRow
        engine={{
          ...engine,
          labelPosition: engine.labelPosition === 'hidden' ? 'hidden' : 'below',
        }}
        items={
          fab ? [...engine.split.left, ...engine.split.right] : engine.shown
        }
        vertical
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    height: '100%',
    borderRightWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  fab: {
    marginTop: 4,
    marginBottom: 12,
  },
});
