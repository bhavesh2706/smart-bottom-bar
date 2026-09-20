import { useBarEngine } from './hooks/useBarEngine';
import type { SmartBottomBarProps } from './types';
import { FlatLayout } from './variants/FlatBar';
import { LiquidGlassLayout } from './variants/LiquidGlassBar';
import { CurvedLayout, NotchedFabLayout } from './variants/ShapedBars';
import {
  FloatingLayout,
  MaterialLayout,
  SegmentedLayout,
} from './variants/SimpleBars';
import { SidebarLayout } from './variants/SidebarBar';
import { WaveLayout } from './variants/WaveBar';

export function SmartBottomBar(props: SmartBottomBarProps) {
  const engine = useBarEngine(props);

  switch (engine.variant) {
    case 'curved':
      return <CurvedLayout engine={engine} />;
    case 'floating':
      return <FloatingLayout engine={engine} />;
    case 'wave':
      return <WaveLayout engine={engine} />;
    case 'liquidGlass':
      return <LiquidGlassLayout engine={engine} />;
    case 'notchedFab':
      return <NotchedFabLayout engine={engine} />;
    case 'material':
      return <MaterialLayout engine={engine} />;
    case 'segmented':
      return <SegmentedLayout engine={engine} />;
    case 'sidebar':
      return <SidebarLayout engine={engine} />;
    case 'flat':
    default:
      return <FlatLayout engine={engine} />;
  }
}
