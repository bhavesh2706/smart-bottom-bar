import { useMemo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type {
  BottomBarItem,
  BottomBarStyle,
  LabelPosition,
  RenderItemParams,
  ResolvedPalette,
} from '../types';
import { MIN_HIT } from '../theme';
import { Badge } from './Badge';

function hasBadge(
  badge: BottomBarItem['badge']
): badge is number | string | true {
  return badge !== undefined && badge !== false;
}

export function BarItem({
  item,
  index,
  active,
  colors,
  labelPosition,
  compact,
  vertical,
  noShrink,
  onPress,
  onLongPress,
  style,
  renderItem,
  testID,
}: {
  item: BottomBarItem;
  index: number;
  active: boolean;
  colors: ResolvedPalette;
  labelPosition: LabelPosition;
  compact?: boolean;
  vertical?: boolean;
  /** Keep full hit width (side pods with few items). */
  noShrink?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  style?: BottomBarStyle;
  renderItem?: (params: RenderItemParams) => ReactNode;
  testID?: string;
}) {
  const labelColor = active ? colors.label : colors.inactiveLabel;
  const showLabel =
    labelPosition !== 'hidden' && !(compact && !active) && Boolean(item.label);
  const beside = labelPosition === 'beside' || Boolean(vertical);

  const icon = active && item.activeIcon != null ? item.activeIcon : item.icon;

  const defaultItem = useMemo(
    () => (
      <View
        style={[
          styles.body,
          beside ? styles.beside : styles.below,
          vertical ? styles.vertical : null,
        ]}
      >
        <View style={[styles.iconWrap, style?.icon]}>
          {icon}
          <Badge item={item} colors={colors} style={style} />
        </View>
        {showLabel ? (
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              { color: labelColor },
              beside ? styles.labelBeside : null,
              style?.label,
            ]}
          >
            {item.label}
          </Text>
        ) : null}
      </View>
    ),
    [beside, colors, icon, item, labelColor, showLabel, style, vertical]
  );

  const content =
    item.renderItem?.({ item, index, active, defaultItem }) ??
    renderItem?.({ item, index, active, defaultItem }) ??
    defaultItem;

  const a11yLabel =
    item.accessibilityLabel ??
    (item.label
      ? hasBadge(item.badge)
        ? `${item.label}, ${item.badge === true ? 'new' : String(item.badge)} notifications`
        : item.label
      : item.key);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={a11yLabel}
      accessibilityHint={item.accessibilityHint}
      accessibilityState={{
        selected: active,
        disabled: Boolean(item.disabled),
      }}
      disabled={item.disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID ?? item.testID ?? `smart-bottom-bar-item-${item.key}`}
      style={({ pressed }) => [
        styles.hit,
        vertical
          ? styles.hitVertical
          : noShrink
            ? styles.hitHorizontalFixed
            : styles.hitHorizontal,
        style?.item,
        item.disabled ? styles.disabled : null,
        pressed && !item.disabled ? styles.pressed : null,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    minWidth: MIN_HIT,
    minHeight: MIN_HIT,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  hitHorizontal: {
    flexBasis: 0,
    flexShrink: 1,
  },
  hitHorizontalFixed: {
    flexBasis: 0,
    flexShrink: 0,
    flexGrow: 1,
  },
  hitVertical: {
    flexGrow: 0,
    width: '100%',
    paddingVertical: 10,
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  below: {
    flexDirection: 'column',
  },
  beside: {
    flexDirection: 'row',
  },
  vertical: {
    minHeight: MIN_HIT,
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    minHeight: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    maxWidth: 88,
    textAlign: 'center',
  },
  labelBeside: {
    marginTop: 0,
    marginLeft: 8,
    fontSize: 13,
    maxWidth: 140,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
});
