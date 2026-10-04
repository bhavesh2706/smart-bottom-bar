import { useCallback, useMemo } from 'react';
import type { SmartBottomBarProps } from '../types';
import { DEFAULT_FAB_SIZE, defaultBarHeight, defaultShadow } from '../theme';
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

export function useBarEngine(props: SmartBottomBarProps) {
  const variant = props.variant ?? 'flat';
  const resolvedVariant = useResolvedVariant(variant, props.breakpoint);
  const colors = useResolvedPalette(props.colorScheme, resolvedVariant);
  const insets = useInsets(props.insets, props.safeArea !== false);
  const keyboard = useKeyboard();
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

  const hiddenByKeyboard =
    keyboard.visible && (props.keyboardBehavior ?? 'hide') === 'hide';
  const offsetByKeyboard =
    keyboard.visible && props.keyboardBehavior === 'offset';
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
    fab,
    wantsFab,
    split,
    shadow,
    fabExtra,
    handlePress,
    handleLongPress,
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
