import { StyleSheet, View } from 'react-native';
import type { BarEngine } from '../hooks/useBarEngine';
import { ItemRow } from '../components/ItemRow';
import { DEFAULT_SIDEBAR_WIDTH } from '../theme';

export function SidebarLayout({ engine }: { engine: BarEngine }) {
  const width = engine.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH;

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
        engine.style?.container,
        engine.style?.bar,
      ]}
    >
      <ItemRow
        engine={{
          ...engine,
          labelPosition: engine.labelPosition === 'hidden' ? 'hidden' : 'below',
        }}
        items={engine.shown}
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
});
