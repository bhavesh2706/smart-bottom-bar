import type { ComponentType } from 'react';
import type { BarEngine } from './hooks/useBarEngine';
import { useBarEngine } from './hooks/useBarEngine';
import type { BottomBarVariant, VariantBarProps } from './types';
import { SidebarLayout } from './variants/SidebarBar';

export function createVariantBar(
  variant: BottomBarVariant,
  Layout: ComponentType<{ engine: BarEngine }>
) {
  function VariantBar(props: VariantBarProps) {
    const engine = useBarEngine({ ...props, variant });
    if (engine.variant === 'sidebar' && variant !== 'sidebar') {
      return <SidebarLayout engine={engine} />;
    }
    return <Layout engine={engine} />;
  }
  VariantBar.displayName = `${variant}BottomBar`;
  return VariantBar;
}
