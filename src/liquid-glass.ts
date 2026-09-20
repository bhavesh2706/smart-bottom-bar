import { createVariantBar } from './createVariantBar';
import { LiquidGlassLayout } from './variants/LiquidGlassBar';

export const LiquidGlassBottomBar = createVariantBar(
  'liquidGlass',
  LiquidGlassLayout
);
export { LiquidGlassBottomBar as SmartBottomBar };
