import { createVariantBar } from './createVariantBar';
import { CurvedLayout } from './variants/ShapedBars';

export const CurvedBottomBar = createVariantBar('curved', CurvedLayout);
export { CurvedBottomBar as SmartBottomBar };
