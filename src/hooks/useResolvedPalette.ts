import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import type {
  BarColorOverrides,
  BottomBarVariant,
  ColorSchemePreference,
  ResolvedPalette,
} from '../types';
import { paletteFor } from '../theme';

export function useResolvedPalette(
  preference: ColorSchemePreference | undefined,
  variant: BottomBarVariant,
  overrides?: BarColorOverrides
): ResolvedPalette {
  const system = useColorScheme();
  // Content key, so inline `colors={{…}}` objects don't re-theme every render.
  const overrideKey = overrides ? JSON.stringify(overrides) : '';
  return useMemo(() => {
    const scheme: 'light' | 'dark' =
      preference === 'light' || preference === 'dark'
        ? preference
        : system === 'dark'
          ? 'dark'
          : 'light';
    const base = paletteFor(scheme, variant);
    if (!overrides) {
      return base;
    }
    const { light, dark, ...shared } = overrides;
    return {
      ...base,
      ...shared,
      ...(scheme === 'dark' ? dark : light),
      scheme,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preference, system, variant, overrideKey]);
}
