import { createVariantBar } from './createVariantBar';
import { NotchedFabLayout } from './variants/ShapedBars';

export const NotchedFabBottomBar = createVariantBar(
  'notchedFab',
  NotchedFabLayout
);
export { NotchedFabBottomBar as SmartBottomBar };
