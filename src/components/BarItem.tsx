import { useMemo, useState, type ReactNode } from 'react';
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
  LabelProps,
  PressFeedback,
  RenderItemParams,
  ResolvedPalette,
} from '../types';
import { DEFAULT_ICON_SIZE, MIN_HIT } from '../theme';
import {
  itemA11yLabel,
  pressedStyle,
  renderItemIcon,
  rippleFor,
} from '../utils';
import { Badge } from './Badge';
import type { RovingItemProps } from '../hooks/useRovingFocus';

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
  pressFeedback,
  labelProps,
  badgeMax,
  focusProps,
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
  /**
   * Keep the slot (layout + touch) but hide it — another view draws this item.
   * A ghost leaves the focus order unless it still holds focus: native can't
   * move focus imperatively, so dropping it would lose keyboard focus.
   */
  ghost?: boolean;
  iconSize?: number;
  pressFeedback?: PressFeedback;
  labelProps?: LabelProps;
  badgeMax?: number;
  focusProps?: RovingItemProps;
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
            <View
              style={[styles.pill, { backgroundColor: pill }, style?.pill]}
            />
          ) : null}
          {icon}
          <Badge item={item} colors={colors} style={style} max={badgeMax} />
        </View>
        {showLabel ? (
          <Text
            numberOfLines={labelProps?.numberOfLines ?? 1}
            allowFontScaling={labelProps?.allowFontScaling ?? true}
            maxFontSizeMultiplier={labelProps?.maxFontSizeMultiplier ?? 1.35}
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
      labelProps,
      badgeMax,
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

  const [hasFocus, setHasFocus] = useState(false);
  const unfocusable = ghost && !hasFocus;

  return (
    <Pressable
      {...focusProps}
      onFocus={() => {
        setHasFocus(true);
        focusProps?.onFocus?.();
      }}
      onBlur={() => {
        setHasFocus(false);
        focusProps?.onBlur?.();
      }}
      focusable={unfocusable ? false : undefined}
      tabIndex={unfocusable ? -1 : focusProps?.tabIndex}
      accessible={unfocusable ? false : undefined}
      accessibilityRole="tab"
      accessibilityLabel={itemA11yLabel(item)}
      accessibilityHint={item.accessibilityHint}
      aria-selected={active}
      aria-disabled={Boolean(item.disabled)}
      aria-hidden={ghost || undefined}
      disabled={item.disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID ?? item.testID ?? `smart-bottom-bar-item-${item.key}`}
      onLayout={onLayout}
      android_ripple={rippleFor(pressFeedback)}
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
        pressed && !item.disabled
          ? pressedStyle(pressFeedback, styles.pressed)
          : null,
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
