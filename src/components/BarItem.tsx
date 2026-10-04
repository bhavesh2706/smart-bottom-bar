import { useMemo, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import type {
  BottomBarItem,
  BottomBarStyle,
  LabelPosition,
  RenderItemParams,
  ResolvedPalette,
} from '../types';
import { DEFAULT_ICON_SIZE, MIN_HIT } from '../theme';
import { renderItemIcon } from '../utils';
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
  onLayout,
  pill,
  ghost,
  iconSize = DEFAULT_ICON_SIZE,
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
  onLayout?: (event: LayoutChangeEvent) => void;
  /** Material-style active indicator color drawn behind the icon. */
  pill?: string;
  /** Keep the slot (layout + touch) but hide it — another view draws this item. */
  ghost?: boolean;
  iconSize?: number;
}) {
  const labelColor = active
    ? (item.activeColor ?? colors.label)
    : (item.color ?? colors.inactiveLabel);
  const showLabel =
    labelPosition !== 'hidden' && !(compact && !active) && Boolean(item.label);
  const beside = labelPosition === 'beside' || Boolean(vertical);

  const iconColor = active
    ? (item.activeColor ?? colors.active)
    : (item.color ?? colors.inactive);
  const icon = renderItemIcon(item, active, iconColor, iconSize);

  const defaultItem = useMemo(
    () => (
      <View
        style={[
          styles.body,
          beside ? styles.beside : styles.below,
          vertical ? styles.vertical : null,
        ]}
      >
        <View
          style={[styles.iconWrap, pill ? styles.pillWrap : null, style?.icon]}
        >
          {pill && active ? (
            <View style={[styles.pill, { backgroundColor: pill }]} />
          ) : null}
          {icon}
          <Badge item={item} colors={colors} style={style} />
        </View>
        {showLabel ? (
          <Text
            numberOfLines={1}
            allowFontScaling
            maxFontSizeMultiplier={1.35}
            style={[
              styles.label,
              {
                color: labelColor,
                fontWeight: active ? '600' : '500',
              },
              beside ? styles.labelBeside : null,
              style?.label,
              active ? style?.activeLabel : null,
            ]}
          >
            {item.label}
          </Text>
        ) : null}
      </View>
    ),
    [
      active,
      beside,
      colors,
      icon,
      item,
      labelColor,
      pill,
      showLabel,
      style,
      vertical,
    ]
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
      accessibilityElementsHidden={ghost || undefined}
      importantForAccessibility={ghost ? 'no-hide-descendants' : undefined}
      disabled={item.disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID ?? item.testID ?? `smart-bottom-bar-item-${item.key}`}
      onLayout={onLayout}
      style={({ pressed }) => [
        styles.hit,
        vertical
          ? styles.hitVertical
          : noShrink
            ? styles.hitHorizontalFixed
            : styles.hitHorizontal,
        style?.item,
        active ? style?.activeItem : null,
        item.disabled ? styles.disabled : null,
        pressed && !item.disabled ? styles.pressed : null,
        ghost ? styles.ghost : null,
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
    minWidth: 28,
    minHeight: 28,
  },
  pillWrap: {
    minHeight: 32,
    marginBottom: 2,
  },
  pill: {
    position: 'absolute',
    width: 56,
    height: 32,
    borderRadius: 16,
  },
  label: {
    fontSize: Platform.OS === 'ios' ? 10 : 11,
    letterSpacing: Platform.OS === 'ios' ? 0.1 : 0.15,
    marginTop: Platform.OS === 'ios' ? 1 : 2,
    maxWidth: 88,
    textAlign: 'center',
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: 'center' as const,
      },
      default: {},
    }),
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
  ghost: {
    opacity: 0,
  },
});
