import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type {
  BottomBarItem,
  BottomBarStyle,
  PressFeedback,
  RenderFabParams,
  ResolvedPalette,
} from '../types';
import { MIN_HIT } from '../theme';
import { pressedStyle, renderItemIcon, rippleFor } from '../utils';

export function FabButton({
  item,
  active,
  size,
  colors,
  onPress,
  onLongPress,
  style,
  raised = true,
  pressFeedback,
  renderFab,
}: {
  item: BottomBarItem;
  active: boolean;
  size: number;
  colors: ResolvedPalette;
  onPress: () => void;
  onLongPress?: () => void;
  style?: BottomBarStyle;
  raised?: boolean;
  pressFeedback?: PressFeedback;
  /** Custom FAB visual; the Pressable (a11y, press, hit size) stays ours. */
  renderFab?: (params: RenderFabParams) => ReactNode;
}) {
  const icon = renderItemIcon(
    item,
    active,
    colors.fabIcon,
    Math.round(size * 0.46)
  );
  const custom = renderFab?.({
    item,
    active,
    size,
    color: colors.fab,
    iconColor: colors.fabIcon,
    icon,
  });
  const hit = Math.max(size, MIN_HIT);

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
      android_ripple={rippleFor(pressFeedback)}
      style={({ pressed }) => [
        styles.fab,
        custom != null
          ? { minWidth: hit, minHeight: hit }
          : [
              {
                width: hit,
                height: hit,
                borderRadius: hit / 2,
                backgroundColor: colors.fab,
              },
              raised ? styles.raised : null,
            ],
        style?.fab,
        item.disabled ? styles.disabled : null,
        pressed && !item.disabled
          ? pressedStyle(pressFeedback, styles.pressed)
          : null,
      ]}
    >
      {custom ?? <View style={styles.icon}>{icon}</View>}
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
