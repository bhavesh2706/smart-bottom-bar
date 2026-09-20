import { createVariantBar } from './createVariantBar';
import { FloatingLayout } from './variants/SimpleBars';

export const FloatingBottomBar = createVariantBar('floating', FloatingLayout);
export { FloatingBottomBar as SmartBottomBar };
