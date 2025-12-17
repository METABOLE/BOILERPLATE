import { useTouchDevice } from '@/hooks/useTouchDevice';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

enum CURSOR_STATE {
  DEFAULT = 'DEFAULT',
  POINTER = 'POINTER',
}

const Cursor = () => {
  const { contextSafe } = useGSAP();
  const pathname = usePathname();
  const pointerRefs = {
    primary: useRef<HTMLDivElement>(null),
    secondary: useRef<HTMLDivElement>(null),
  };
  const observerRef = useRef<MutationObserver | null>(null);

  const [cursorState, setCursorState] = useState(CURSOR_STATE.DEFAULT);
  const [isActive, setIsActive] = useState(false);
  const isTouch = useTouchDevice();

  const cursorStateHandlers = {
    changeToButton: useCallback(() => setCursorState(CURSOR_STATE.POINTER), []),
    changeToDefault: useCallback(() => setCursorState(CURSOR_STATE.DEFAULT), []),
  };

  const cursorHandlers = {
    moveCursor: contextSafe((e: MouseEvent) => {
      if (!pointerRefs.primary.current || !pointerRefs.secondary.current) return;
      pointerRefs.primary.current.style.opacity = '1';
      pointerRefs.secondary.current.style.opacity = '1';
      gsap.to([pointerRefs.primary.current, pointerRefs.secondary.current], {
        duration: (i: number) => 0.3 * (i + 1),
        x: e.clientX,
        y: e.clientY,
        ease: 'power2.out',
      });
    }),
    handleMouseDown: useCallback(() => {
      setIsActive(true);
    }, []),
    handleMouseUp: useCallback(() => {
      setIsActive(false);
    }, []),
  };

  const manageCursorEvents = useCallback(
    (event: 'addEventListener' | 'removeEventListener') => {
      const elements = {
        button: document.querySelectorAll('.cursor-pointer'),
      };

      Object.entries({
        button: cursorStateHandlers.changeToButton,
      }).forEach(([key, handler]) => {
        elements[key as keyof typeof elements].forEach((el) => {
          el[event]('mouseover', handler);
          el[event]('mouseleave', cursorStateHandlers.changeToDefault);
        });
      });
    },
    [cursorStateHandlers],
  );

  useEffect(() => {
    if (isTouch) return;

    observerRef.current = new MutationObserver(() => {
      manageCursorEvents('removeEventListener');
      manageCursorEvents('addEventListener');
    });

    const { moveCursor, handleMouseDown, handleMouseUp } = cursorHandlers;

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    manageCursorEvents('addEventListener');
    observerRef.current.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      manageCursorEvents('removeEventListener');
      observerRef.current?.disconnect();
    };
  }, [cursorHandlers, manageCursorEvents, isTouch]);

  useEffect(() => {
    setTimeout(() => {
      setCursorState(CURSOR_STATE.DEFAULT);
    }, 500);
  }, [pathname]);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={pointerRefs.primary}
        className={clsx(
          'pointer-events-none fixed top-0 left-0 z-9999 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-difference',
        )}
      >
        <div
          className={clsx(
            'h-2 w-2 rounded-full bg-white transition-all',
            isActive && 'scale-75',
            cursorState === CURSOR_STATE.POINTER && 'scale-150',
          )}
        />
      </div>
      <div
        ref={pointerRefs.secondary}
        className={clsx(
          'pointer-events-none fixed top-0 left-0 z-9999 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-difference',
        )}
      >
        <div
          className={clsx(
            'h-10 w-10 rounded-full border border-white transition-all',
            cursorState === CURSOR_STATE.DEFAULT && 'scale-100',
            cursorState === CURSOR_STATE.POINTER && 'scale-0',
          )}
        />
      </div>
    </>
  );
};

export default Cursor;
