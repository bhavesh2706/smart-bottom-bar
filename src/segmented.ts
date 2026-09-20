import { createVariantBar } from './createVariantBar';
import { SegmentedLayout } from './variants/SimpleBars';

export const SegmentedBottomBar = createVariantBar(
  'segmented',
  SegmentedLayout
);
export { SegmentedBottomBar as SmartBottomBar };
