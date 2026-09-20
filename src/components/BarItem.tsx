import { useMemo, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const labelColor = active
    ? (item.activeColor ?? colors.label)
    : (item.color ?? colors.inactiveLabel);
  const showLabel =
    labelPosition !== 'hidden' && !(compact && !active) && Boolean(item.label);
  const beside = labelPosition === 'beside' || Boolean(vertical);

  const icon = active && item.activeIcon != null ? item.activeIcon : item.icon;

  const isDark = colors.scheme === 'dark';
  const haloColor = isDark
    ? 'rgba(100, 210, 255, 0.28)'
    : 'rgba(0, 122, 255, 0.14)';
  const activePillBg = isDark
    ? 'rgba(100, 210, 255, 0.18)'
    : 'rgba(0, 122, 255, 0.1)';

  const defaultItem = useMemo(
    () => (
      <View
        style={[
          styles.body,
          beside ? styles.beside : styles.below,
          vertical ? styles.vertical : null,
          active && !beside && !vertical
            ? [styles.activePill, { backgroundColor: activePillBg }]
            : null,
        ]}
      >
        <View style={[styles.iconWrap, style?.icon]}>
          {active ? (
            <View
              pointerEvents="none"
              style={[styles.activeHalo, { backgroundColor: haloColor }]}
            />
          ) : null}
          <View style={styles.iconFront}>{icon}</View>
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
                fontWeight: active ? '700' : '500',
                // Keep inactive labels fully opaque — dimming kills dark contrast
                opacity: 1,
              },
              beside ? styles.labelBeside : null,
              style?.label,
            ]}
          >
            {item.label}
          </Text>
        ) : null}
        {active && !beside && !vertical ? (
          <View
            pointerEvents="none"
            style={[styles.activeUnderline, { backgroundColor: labelColor }]}
          />
        ) : null}
      </View>
    ),
    [
      active,
      activePillBg,
      beside,
      colors,
      haloColor,
      icon,
      item,
      labelColor,
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
  activePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    minWidth: 52,
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
  activeHalo: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    zIndex: 0,
  },
  iconFront: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeUnderline: {
    marginTop: 2,
    width: 18,
    height: 2.5,
    borderRadius: 2,
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
});
