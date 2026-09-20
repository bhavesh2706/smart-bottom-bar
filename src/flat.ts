import { createVariantBar } from './createVariantBar';
import { FlatLayout } from './variants/FlatBar';

export const FlatBottomBar = createVariantBar('flat', FlatLayout);
export { FlatBottomBar as SmartBottomBar };
