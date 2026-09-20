import { useCallback, useMemo, useRef, useState } from 'react';
import type { BottomBarItem } from '../types';
import { indexInSource, visibleItems } from '../utils';

export interface ActiveKeyState {
  activeKey: string;
  sourceIndex: number;
  visibleIndex: number;
  setActive: (key: string) => void;
  isControlled: boolean;
}

export function useActiveKey(
  items: readonly BottomBarItem[],
  activeKey: string | undefined,
  defaultActiveKey: string | undefined,
  activeIndex: number | undefined,
  defaultActiveIndex: number | undefined,
  onChange: ((key: string, index: number) => void) | undefined
): ActiveKeyState {
  const shown = useMemo(() => visibleItems(items), [items]);
  const firstKey = shown[0]?.key ?? items[0]?.key ?? '';

  const defaultKey =
    defaultActiveKey ??
    (defaultActiveIndex != null ? items[defaultActiveIndex]?.key : undefined) ??
    firstKey;

  const isKeyControlled = activeKey !== undefined;
  const isIndexControlled = activeIndex !== undefined;
  const isControlled = isKeyControlled || isIndexControlled;

  const [internal, setInternal] = useState(defaultKey);

  const resolvedKey = isKeyControlled
    ? activeKey
    : isIndexControlled
      ? (items[activeIndex]?.key ?? internal)
      : internal;

  const sourceIndex = Math.max(0, indexInSource(items, resolvedKey));
  const visibleIndex = Math.max(
    0,
    shown.findIndex((item) => item.key === resolvedKey)
  );

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setActive = useCallback(
    (key: string) => {
      const index = indexInSource(items, key);
      if (index < 0) {
        return;
      }
      const item = items[index];
      if (!item || item.disabled || item.hidden) {
        return;
      }
      if (!isControlled) {
        setInternal(key);
      }
      onChangeRef.current?.(key, index);
    },
    [items, isControlled]
  );

  return {
    activeKey: resolvedKey,
    sourceIndex,
    visibleIndex,
    setActive,
    isControlled,
  };
}
