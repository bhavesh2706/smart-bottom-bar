import { useWindowDimensions } from 'react-native';
import type { BottomBarVariant } from '../types';

export function useResolvedVariant(
  variant: BottomBarVariant,
  breakpoint: number | undefined
): BottomBarVariant {
  const { width } = useWindowDimensions();
  if (variant === 'sidebar') {
    return 'sidebar';
  }
  if (breakpoint != null && width >= breakpoint) {
    return 'sidebar';
  }
  return variant;
}
