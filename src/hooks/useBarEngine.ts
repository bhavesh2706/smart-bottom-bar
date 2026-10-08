import { useCallback, useMemo } from 'react';
import type { SmartBottomBarProps } from '../types';
import {
  DEFAULT_FAB_SIZE,
  DEFAULT_ICON_SIZE,
  WAVE_BUBBLE,
  defaultBarHeight,
  defaultShadow,
} from '../theme';
import {
  resolveFabItem,
  resolveRtl,
  splitAroundFab,
  visibleItems,
} from '../utils';
import { useActiveKey } from './useActiveKey';
import { useReduceMotion, useReduceTransparency } from './useA11yFlags';
import { useInsets } from './useInsets';
import { useKeyboard } from './useKeyboard';
import { useResolvedPalette } from './useResolvedPalette';
import { useResolvedVariant } from './useResolvedVariant';
import { useRovingFocus } from './useRovingFocus';

export function useBarEngine(props: SmartBottomBarProps) {
  const variant = props.variant ?? 'flat';
  const resolvedVariant = useResolvedVariant(variant, props.breakpoint);
  const colors = useResolvedPalette(
    props.colorScheme,
    resolvedVariant,
    props.colors
  );
  const insets = useInsets(props.insets, props.safeArea !== false);
  const keyboardBehavior = props.keyboardBehavior ?? 'hide';
  const keyboard = useKeyboard(keyboardBehavior !== 'none');
  const reduceTransparency = useReduceTransparency();
  const reduceMotion = useReduceMotion();
  const rtl = resolveRtl(props.rtl);

  const shown = useMemo(() => visibleItems(props.items), [props.items]);
  const active = useActiveKey(
    props.items,
    props.activeKey,
    props.defaultActiveKey,
    props.activeIndex,
    props.defaultActiveIndex,
    props.onChange
  );

  const barHeight = props.height ?? defaultBarHeight(resolvedVariant);
  const fabSize = props.fabSize ?? DEFAULT_FAB_SIZE;
  const wantsFab = Boolean(props.fabKey) || shown.some((item) => item.fab);
  const fab = useMemo(
    () => resolveFabItem(shown, props.fabKey),
    [shown, props.fabKey]
  );
  const split = useMemo(() => splitAroundFab(shown, fab), [shown, fab]);
  const shadow = props.shadow ?? defaultShadow(resolvedVariant);
  const fabExtra = wantsFab && fab ? fabSize * 0.42 : 0;

  const handlePress = useCallback(
    (key: string) => {
      const index = props.items.findIndex((item) => item.key === key);
      if (index < 0) {
        return;
      }
      const item = props.items[index];
      if (!item || item.disabled) {
        return;
      }
      props.hapticFeedback?.(key, 'press');
      props.onPress?.(key, index);
      if (key === active.activeKey) {
        props.hapticFeedback?.(key, 'doubleTap');
        props.onDoubleTap?.(key, index);
        props.onScrollToTop?.(key);
        return;
      }
      active.setActive(key);
    },
    [props, active]
  );

  const handleLongPress = useCallback(
    (key: string) => {
      const index = props.items.findIndex((item) => item.key === key);
      if (index < 0) {
        return;
      }
      const item = props.items[index];
      if (!item || item.disabled) {
        return;
      }
      props.hapticFeedback?.(key, 'longPress');
      props.onLongPress?.(key, index);
    },
    [props]
  );

  const vertical = resolvedVariant === 'sidebar';
  const focusOrder = useMemo(() => {
    const visual =
      vertical && wantsFab && fab
        ? [fab, ...split.left, ...split.right]
        : shown;
    return visual.filter((item) => !item.disabled).map((item) => item.key);
  }, [vertical, wantsFab, fab, split, shown]);
  const roving = useRovingFocus({
    config: props.rovingFocus,
    order: focusOrder,
    activeKey: active.activeKey,
    vertical,
    rtl,
    onSelect: handlePress,
  });

  const hiddenByKeyboard = keyboard.visible && keyboardBehavior === 'hide';
  const offsetByKeyboard = keyboard.visible && keyboardBehavior === 'offset';
  const visible = (props.visible ?? true) && !hiddenByKeyboard;

  return {
    variant: resolvedVariant,
    requestedVariant: variant,
    colors,
    insets,
    keyboard,
    reduceTransparency,
    reduceMotion,
    rtl,
    shown,
    active,
    barHeight,
    fabSize,
    iconSize: props.iconSize ?? DEFAULT_ICON_SIZE,
    pressFeedback: props.pressFeedback,
    labelProps: props.labelProps,
    badgeMax: props.badgeMax ?? 99,
    floatingMargin: props.floatingMargin,
    bubbleSize: props.bubbleSize ?? WAVE_BUBBLE,
    renderFab: props.renderFab,
    fab,
    wantsFab,
    split,
    shadow,
    fabExtra,
    handlePress,
    handleLongPress,
    roving,
    visible,
    translateOnHide: props.translateOnHide !== false,
    offsetByKeyboard,
    keyboardOffset: offsetByKeyboard ? keyboard.height : 0,
    labelPosition: props.labelPosition ?? 'below',
    materialMode: props.materialMode ?? 'fixed',
    placement: props.placement ?? 'docked',
    sceneColor: props.sceneColor ?? colors.scene,
    sidebarWidth: props.sidebarWidth,
    glass: {
      intensity: props.glass?.intensity ?? 'regular',
      tint: props.glass?.tint ?? 'auto',
      cornerRadius: props.glass?.cornerRadius,
      fabPlacement: props.glass?.fabPlacement ?? 'raised',
    },
    style: props.style,
    animation: props.animation,
    renderGlassSurface: props.renderGlassSurface,
    renderItem: props.renderItem,
    testID: props.testID ?? 'smart-bottom-bar',
  };
}

export type BarEngine = ReturnType<typeof useBarEngine>;
