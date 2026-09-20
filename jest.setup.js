// Per-suite fake timers only. Global fake timers break async waits in RNTL.
const { AccessibilityInfo } = require('react-native');

if (typeof AccessibilityInfo.isReduceTransparencyEnabled !== 'function') {
  AccessibilityInfo.isReduceTransparencyEnabled = () => Promise.resolve(false);
}
if (typeof AccessibilityInfo.isReduceMotionEnabled !== 'function') {
  AccessibilityInfo.isReduceMotionEnabled = () => Promise.resolve(false);
}
