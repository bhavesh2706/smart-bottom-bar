import { useEffect, useState } from 'react';
import { Keyboard, type KeyboardEvent } from 'react-native';

export interface KeyboardState {
  visible: boolean;
  height: number;
}

export function useKeyboard(): KeyboardState {
  const [state, setState] = useState<KeyboardState>({
    visible: false,
    height: 0,
  });

  useEffect(() => {
    const show = (e: KeyboardEvent) => {
      setState({ visible: true, height: e.endCoordinates?.height ?? 0 });
    };
    const hide = () => {
      setState({ visible: false, height: 0 });
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
  }, []);

  return state;
}
