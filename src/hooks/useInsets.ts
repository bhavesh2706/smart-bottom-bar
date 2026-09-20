import { useMemo, useSyncExternalStore } from 'react';
import { Dimensions, Platform } from 'react-native';
import type { EdgeInsets, ResolvedInsets } from '../types';
import { fallbackInsets, mergeInsets } from '../utils';

function subscribe(onStoreChange: () => void): () => void {
  const sub = Dimensions.addEventListener('change', onStoreChange);
  return () => sub.remove();
}

function getSnapshot(): string {
  const window = Dimensions.get('window');
  const screen = Dimensions.get('screen');
  return `${window.width}:${window.height}:${screen.height}`;
}

export function useInsets(
  insets: EdgeInsets | undefined,
  safeArea: boolean
): ResolvedInsets {
  const dimKey = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return useMemo(() => {
    const window = Dimensions.get('window');
    const screen = Dimensions.get('screen');
    const fallback = fallbackInsets({
      width: window.width,
      height: window.height,
      screenHeight: screen.height,
      isPad: Platform.OS === 'ios' ? Platform.isPad : false,
      platform: Platform.OS,
    });
    return mergeInsets(insets, fallback, safeArea);
    // dimKey is the subscription trigger; insets/safeArea are explicit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dimKey,
    insets?.top,
    insets?.right,
    insets?.bottom,
    insets?.left,
    safeArea,
  ]);
}
