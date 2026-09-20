import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomBarItem, BottomBarStyle, ResolvedPalette } from '../types';
import { MIN_HIT } from '../theme';

export function FabButton({
  item,
  active,
  size,
  colors,
  onPress,
  onLongPress,
  style,
  raised = true,
}: {
  item: BottomBarItem;
  active: boolean;
  size: number;
  colors: ResolvedPalette;
  onPress: () => void;
  onLongPress?: () => void;
  style?: BottomBarStyle;
  raised?: boolean;
}) {
  const icon = active && item.activeIcon != null ? item.activeIcon : item.icon;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={item.accessibilityLabel ?? item.label ?? item.key}
      accessibilityState={{
        selected: active,
        disabled: Boolean(item.disabled),
      }}
      disabled={item.disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={item.testID ?? `smart-bottom-bar-item-${item.key}`}
      style={({ pressed }) => [
        styles.fab,
        {
          width: Math.max(size, MIN_HIT),
          height: Math.max(size, MIN_HIT),
          borderRadius: Math.max(size, MIN_HIT) / 2,
          backgroundColor: colors.fab,
        },
        raised ? styles.raised : null,
        style?.fab,
        item.disabled ? styles.disabled : null,
        pressed && !item.disabled ? styles.pressed : null,
      ]}
    >
      <View style={styles.icon}>{icon}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  raised: {
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
