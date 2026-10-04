import { StyleSheet, Text, View } from 'react-native';
import type { BottomBarItem, BottomBarStyle, ResolvedPalette } from '../types';
import { formatBadge } from '../utils';

export function Badge({
  item,
  colors,
  style,
  max,
}: {
  item: BottomBarItem;
  colors: ResolvedPalette;
  style?: BottomBarStyle;
  max?: number;
}) {
  if (item.badge === undefined || item.badge === false) {
    return null;
  }
  const isDot = item.badge === true;
  const label = formatBadge(item.badge, max);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.badge,
        isDot ? styles.dot : styles.pill,
        { backgroundColor: colors.badge },
        style?.badge,
      ]}
      testID={item.testID ? `${item.testID}-badge` : undefined}
    >
      {!isDot ? (
        <Text
          style={[styles.text, { color: colors.badgeText }, style?.badgeText]}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 8,
    minHeight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pill: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
});
