import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';

const globalScrollState = {
  isLocked: false,
  listeners: new Set<() => void>(),
};

const notifyListeners = () => {
  globalScrollState.listeners.forEach((listener) => listener());
};

const updateScrollState = (isLocked: boolean) => {
  globalScrollState.isLocked = isLocked;
  notifyListeners();
};

export const useScroll = () => {
  const [isLocked, setIsLocked] = useState(globalScrollState.isLocked);
  const lenis = useLenis();
  const pendingActionRef = useRef<boolean | null>(null);

  useEffect(() => {
    const listener = () => setIsLocked(globalScrollState.isLocked);
    globalScrollState.listeners.add(listener);
    return () => {
      globalScrollState.listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (lenis && pendingActionRef.current !== null) {
      const shouldLock = pendingActionRef.current;
      pendingActionRef.current = null;

      if (shouldLock) {
        lenis.scrollTo(0, { immediate: true });
        lenis.stop();
        updateScrollState(true);
      } else {
        lenis.start();
        updateScrollState(false);
      }
    }
  }, [lenis]);

  const lockScroll = (shouldLock: boolean) => {
    if (!lenis) {
      pendingActionRef.current = shouldLock;
      return;
    }

    if (shouldLock) {
      lenis.scrollTo(0, { immediate: true });
      lenis.stop();
      updateScrollState(true);
    } else {
      lenis.start();
      updateScrollState(false);
    }
  };

  return { isLocked, lockScroll };
};
