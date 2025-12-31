import { RefObject, useEffect, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export const useMousePosition = (
  onMouseMove?: (x: number, y: number) => void,
  containerRef?: RefObject<HTMLElement | null>,
) => {
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });
  const callbackRef = useRef(onMouseMove);

  callbackRef.current = onMouseMove;

  useEffect(() => {
    let cachedRect: DOMRect | null = null;

    const updateCachedRect = () => {
      if (containerRef?.current) {
        cachedRect = containerRef.current.getBoundingClientRect();
      }
    };

    const handleMouseMove = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      let position: MousePosition;

      if (containerRef?.current && cachedRect) {
        position = {
          x: mouseEvent.clientX - cachedRect.left,
          y: mouseEvent.clientY - cachedRect.top,
        };
      } else {
        position = {
          x: mouseEvent.clientX,
          y: mouseEvent.clientY,
        };
      }

      mousePositionRef.current = position;

      if (callbackRef.current) {
        callbackRef.current(position.x, position.y);
      }
    };

    updateCachedRect();

    const element = containerRef?.current || window;
    element.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateCachedRect);
    window.addEventListener('scroll', updateCachedRect);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateCachedRect);
      window.removeEventListener('scroll', updateCachedRect);
    };
  }, [containerRef]);

  return mousePositionRef;
};
