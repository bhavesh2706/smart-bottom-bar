import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReduceTransparency(): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    let mounted = true;
    const read = AccessibilityInfo.isReduceTransparencyEnabled;
    if (typeof read === 'function') {
      read()
        .then((next) => {
          if (mounted && next) {
            setValue(true);
          }
        })
        .catch(() => {
          /* native module missing in tests / web */
        });
    }

    const sub = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      (next: boolean) => {
        setValue(Boolean(next));
      }
    );

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return value;
}

export function useReduceMotion(): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    let mounted = true;
    const read = AccessibilityInfo.isReduceMotionEnabled;
    if (typeof read === 'function') {
      read()
        .then((next) => {
          if (mounted && next) {
            setValue(true);
          }
        })
        .catch(() => {
          /* native module missing in tests / web */
        });
    }

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (next: boolean) => {
        setValue(Boolean(next));
      }
    );

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return value;
}
