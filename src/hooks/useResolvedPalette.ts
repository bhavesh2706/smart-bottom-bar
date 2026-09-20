import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import type {
  BottomBarVariant,
  ColorSchemePreference,
  ResolvedPalette,
} from '../types';
import { paletteFor } from '../theme';

export function useResolvedPalette(
  preference: ColorSchemePreference | undefined,
  variant: BottomBarVariant
): ResolvedPalette {
  const system = useColorScheme();
  return useMemo(() => {
    const scheme: 'light' | 'dark' =
      preference === 'light' || preference === 'dark'
        ? preference
        : system === 'dark'
          ? 'dark'
          : 'light';
    return paletteFor(scheme, variant);
  }, [preference, system, variant]);
}
