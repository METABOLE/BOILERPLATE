import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useShortcut } from './useShortcut';

const TRIPLE_CLICK_DELAY = 400;

export const useIsScreenLoader = () => {
  const pathname = usePathname();
  const [isScreenLoader, setIsScreenLoader] = useState(false);
  const isScreenLoaderRef = useRef(isScreenLoader);
  const lastClickTimeRef = useRef(0);
  const clickCountRef = useRef(0);

  isScreenLoaderRef.current = isScreenLoader;

  useShortcut(['Tab', 'KeyS'], () => {
    if (isScreenLoaderRef.current) {
      setIsScreenLoader(false);
    }
  });

  useEffect(() => {
    setIsScreenLoader(pathname === '/');
  }, []);

  useEffect(() => {
    const handleClick = () => {
      if (!isScreenLoaderRef.current) return;
      const now = Date.now();
      if (now - lastClickTimeRef.current < TRIPLE_CLICK_DELAY) {
        clickCountRef.current += 1;
        if (clickCountRef.current >= 3) {
          setIsScreenLoader(false);
          clickCountRef.current = 0;
        }
      } else {
        clickCountRef.current = 1;
      }
      lastClickTimeRef.current = now;
    };

    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, []);

  return isScreenLoader;
};
