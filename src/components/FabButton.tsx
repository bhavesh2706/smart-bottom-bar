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
import {
  itemA11yLabel,
  pressedStyle,
  renderItemIcon,
  rippleFor,
} from '../utils';
import type { RovingItemProps } from '../hooks/useRovingFocus';
import { Badge } from './Badge';

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
  focusProps,
  badgeMax,
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
  focusProps?: RovingItemProps;
  badgeMax?: number;
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
      {...focusProps}
      accessibilityRole="tab"
      accessibilityLabel={itemA11yLabel(item)}
      aria-selected={active}
      aria-disabled={Boolean(item.disabled)}
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
      <Badge
        item={item}
        colors={colors}
        style={style}
        max={badgeMax}
        position={styles.badge}
      />
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
  badge: {
    top: 0,
    right: 0,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
