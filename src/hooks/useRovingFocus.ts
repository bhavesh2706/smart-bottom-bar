import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, type KeyDownEvent } from 'react-native';
import type { RovingFocus } from '../types';

type Focusable = { focus?: () => void } | null;

export interface RovingItemProps {
  ref?: (node: Focusable) => void;
  tabIndex?: 0 | -1;
  onFocus?: () => void;
  onBlur?: () => void;
}

const NONE: RovingItemProps = {};

/**
 * WAI-ARIA tabs keyboard model: arrows / Home / End move focus between tabs,
 * activation is manual (Enter / Space) or automatic (selection follows focus).
 * Only web gets a single Tab stop — on native, `tabIndex={-1}` would also
 * drop the item from the OS's own arrow-key navigation.
 * Focus tracking is always on so selecting a focused tab keeps focus on it,
 * even when another element takes over the tab (wave's floating bubble).
 */
export function useRovingFocus({
  config,
  order,
  activeKey,
  vertical,
  rtl,
  onSelect,
}: {
  config: boolean | RovingFocus | undefined;
  order: readonly string[];
  activeKey: string | undefined;
  vertical: boolean;
  rtl: boolean;
  onSelect: (key: string) => void;
}) {
  const enabled = Boolean(config) && order.length > 0;
  const options = typeof config === 'object' ? config : undefined;
  const automatic = options?.activation === 'automatic';
  const loop = options?.loop ?? true;

  const [focused, setFocused] = useState<string | undefined>(undefined);
  const nodes = useRef(new Map<string, Focusable>());
  const refs = useRef(new Map<string, (node: Focusable) => void>());

  const stop =
    focused && order.includes(focused)
      ? focused
      : activeKey && order.includes(activeKey)
        ? activeKey
        : order[0];

  useEffect(() => {
    if (activeKey && focused === activeKey) {
      nodes.current.get(activeKey)?.focus?.();
    }
  }, [activeKey, focused]);

  const move = useCallback(
    (key: string) => {
      nodes.current.get(key)?.focus?.();
      setFocused(key);
      if (automatic && key !== activeKey) {
        onSelect(key);
      }
    },
    [activeKey, automatic, onSelect]
  );

  const onKeyDown = useCallback(
    (event: KeyDownEvent) => {
      const current = stop ? order.indexOf(stop) : -1;
      if (current < 0) {
        return;
      }
      const forward = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
      const back = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
      const last = order.length - 1;
      const step = (delta: number) => {
        const next = current + delta;
        if (next < 0) return loop ? last : 0;
        if (next > last) return loop ? 0 : last;
        return next;
      };

      let target: number;
      switch (event.nativeEvent.key) {
        case forward:
          target = step(1);
          break;
        case back:
          target = step(-1);
          break;
        case 'Home':
          target = 0;
          break;
        case 'End':
          target = last;
          break;
        case ' ':
        case 'Spacebar':
          event.preventDefault?.();
          onSelect(order[current]!);
          return;
        default:
          return;
      }
      event.preventDefault?.();
      if (target !== current) {
        move(order[target]!);
      }
    },
    [loop, move, onSelect, order, rtl, stop, vertical]
  );

  const itemProps = useCallback(
    (key: string): RovingItemProps => {
      if (!order.includes(key)) {
        return NONE;
      }
      let ref = refs.current.get(key);
      if (!ref) {
        ref = (node: Focusable) => {
          if (node) nodes.current.set(key, node);
          else nodes.current.delete(key);
        };
        refs.current.set(key, ref);
      }
      return {
        ref,
        tabIndex:
          enabled && Platform.OS === 'web'
            ? key === stop
              ? 0
              : -1
            : undefined,
        onFocus: () => setFocused(key),
        onBlur: () => setFocused((prev) => (prev === key ? undefined : prev)),
      };
    },
    [enabled, order, stop]
  );

  return useMemo(
    () => ({
      enabled,
      onKeyDown: enabled ? onKeyDown : undefined,
      itemProps,
    }),
    [enabled, onKeyDown, itemProps]
  );
}
