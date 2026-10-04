import { useEffect, useState } from 'react';
import { Keyboard, type KeyboardEvent } from 'react-native';

export interface KeyboardState {
  visible: boolean;
  height: number;
}

const HIDDEN: KeyboardState = { visible: false, height: 0 };

/** `enabled: false` skips the listeners (and their re-renders) entirely. */
export function useKeyboard(enabled = true): KeyboardState {
  const [state, setState] = useState<KeyboardState>(HIDDEN);

  useEffect(() => {
    if (!enabled) {
      setState(HIDDEN);
      return;
    }
    // iOS fires both Will and Did events — keep the same object when nothing changed.
    const show = (e: KeyboardEvent) => {
      const height = e.endCoordinates?.height ?? 0;
      setState((prev) =>
        prev.visible && prev.height === height
          ? prev
          : { visible: true, height }
      );
    };
    const hide = () => {
      setState(HIDDEN);
    };

    const showEvent = Keyboard.addListener('keyboardDidShow', show);
    const hideEvent = Keyboard.addListener('keyboardDidHide', hide);
    const showWill = Keyboard.addListener('keyboardWillShow', show);
    const hideWill = Keyboard.addListener('keyboardWillHide', hide);

    return () => {
      showEvent.remove();
      hideEvent.remove();
      showWill.remove();
      hideWill.remove();
    };
  }, [enabled]);

  return state;
}
