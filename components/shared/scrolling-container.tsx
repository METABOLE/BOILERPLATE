import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { forwardRef, ReactNode, RefObject, useImperativeHandle, useRef } from 'react';

export interface ScrollingContainerRef {
  controlScroll: (action: 'play' | 'pause') => void;
}

const ScrollingContainer = forwardRef<
  ScrollingContainerRef,
  {
    children: ReactNode;
    scrollSpeed?: number;
    className?: string;
    defaultState?: 'play' | 'pause';
    enabled?: boolean;
  }
>(({ children, scrollSpeed = 10, className = '', defaultState = 'play', enabled = true }, ref) => {
  const scrollContainer = useRef(null);
  const infiniteAnimationRef = useRef<gsap.core.Tween[]>([]);

  const { contextSafe } = useGSAP();

  const animateInfinite = (element: RefObject<HTMLDivElement | null>) => {
    if (!element.current) return;

    const tween = gsap.to(element.current.children, {
      x: '-100%',
      duration: scrollSpeed,
      repeat: -1,
      ease: 'none',
      paused: false,
    });

    infiniteAnimationRef.current.push(tween);
  };

  const controlScroll = contextSafe((action: 'play' | 'pause', instant?: boolean) => {
    infiniteAnimationRef.current.map((animation) => {
      if (instant) {
        animation.timeScale(action === 'play' ? 1 : 0);
      } else {
        gsap.to(animation, {
          timeScale: action === 'play' ? 1 : 0,
          duration: 1,
          ease: 'power.inOut',
          overwrite: true,
        });
      }
    });
  });

  useImperativeHandle(ref, () => ({
    controlScroll,
  }));

  const scrubAnimation = contextSafe(() => {
    if (!scrollContainer.current) return;

    gsap.to(scrollContainer.current, {
      x: -400,
      ease: 'none',
      scrollTrigger: {
        trigger: scrollContainer.current,
        start: 'top bottom+=100vh',
        end: 'bottom top-=100vh',
        scrub: true,
      },
    });
  });

  useGSAP(() => {
    ScrollTrigger.refresh();
    animateInfinite(scrollContainer);
    if (defaultState === 'pause') {
      controlScroll('pause', true);
      return;
    }
    scrubAnimation();
  }, [scrollSpeed]);

  return (
    <div className={className}>
      <div
        ref={scrollContainer}
        className="flex w-screen flex-row items-center"
        onMouseLeave={() => enabled && controlScroll('play')}
        onMouseOver={() => enabled && controlScroll('pause')}
      >
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex h-full shrink-0">
              {children}
            </div>
          ))}
      </div>
    </div>
  );
});

export default ScrollingContainer;
