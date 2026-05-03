import { useEffect, useRef } from 'react';

export const useShortcut = (
  keys: string | string[],
  callback: (e: globalThis.KeyboardEvent) => void,
) => {
  const keysArray = Array.isArray(keys) ? keys : [keys];
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent): void => {
      pressedKeysRef.current.add(e.code);

      const triggerKey = keysArray[keysArray.length - 1];
      if (e.code !== triggerKey) return;

      const allPressed = keysArray.every((key) => pressedKeysRef.current.has(key));
      if (allPressed) {
        e.preventDefault();
        callbackRef.current(e);
      }
    };

    const handleKeyUp = (e: globalThis.KeyboardEvent): void => {
      pressedKeysRef.current.delete(e.code);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysArray.join('+')]);
};
