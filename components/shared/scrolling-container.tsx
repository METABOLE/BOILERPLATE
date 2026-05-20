import { useTouchDevice } from '@/hooks/useTouchDevice';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { ReactNode, RefObject, useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ScrollingContainer = ({
  children,
  scrollSpeed = 10,
  wheelScrub = false,
  wheelSensitivity = 0.01,
  touchSensitivity = 0.06,
  wheelMaxPageScrollVelocity = 420,
  className = '',
}: {
  children: ReactNode;
  scrollSpeed?: number;
  wheelScrub?: boolean;
  wheelSensitivity?: number;
  touchSensitivity?: number;
  wheelMaxPageScrollVelocity?: number;
  className?: string;
}) => {
  const scrollContainer = useRef<HTMLDivElement | null>(null);
  const infiniteAnimationRef = useRef<gsap.core.Tween[]>([]);
  const pageScrollVelocityPxPerSecRef = useRef(0);

  const lenis = useLenis();
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

  const controlScroll = contextSafe((action: 'play' | 'pause') => {
    infiniteAnimationRef.current.map((animation) => {
      gsap.to(animation, {
        timeScale: action === 'play' ? 1 : 0,
        duration: 1,
        ease: 'power.out',
        overwrite: true,
      });
    });
  });

  const animateScroll = contextSafe(() => {
    if (!scrollContainer.current) return;

    gsap.to(scrollContainer.current, {
      x: -400,
      ease: 'none',
      scrollTrigger: {
        trigger: scrollContainer.current,
        start: () => `top bottom+=100vh`,
        end: () => `bottom top-=100vh`,
        scrub: true,
      },
    });
  });

  useGSAP(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        ScrollTrigger.refresh();
        infiniteAnimationRef.current = [];
        animateInfinite(scrollContainer);
        if (useTouchDevice()) return;
        animateScroll();
      }, 50);
    });
  }, [scrollSpeed]);

  useGSAP(() => {
    if (!wheelScrub) return;

    const scrollIdleMs = 150;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let velocitySample: { scroll: number; time: number } | undefined;

    const recordScrollMotion = (scrollY: number) => {
      const t = performance.now();
      const prev = velocitySample;
      if (prev !== undefined && t > prev.time) {
        const dt = (t - prev.time) / 1000;
        if (dt >= 1e-4) {
          pageScrollVelocityPxPerSecRef.current = Math.abs(scrollY - prev.scroll) / dt;
        }
      }
      velocitySample = { scroll: scrollY, time: t };

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        pageScrollVelocityPxPerSecRef.current = 0;
        velocitySample = undefined;
        idleTimer = null;
      }, scrollIdleMs);
    };

    if (lenis) {
      const handler = () => recordScrollMotion(lenis.scroll);
      lenis.on('scroll', handler);
      return () => {
        lenis.off('scroll', handler);
        if (idleTimer) clearTimeout(idleTimer);
      };
    }

    const onWindowScroll = () =>
      recordScrollMotion(window.scrollY || document.documentElement.scrollTop || 0);

    window.addEventListener('scroll', onWindowScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [lenis, wheelScrub]);

  useGSAP(() => {
    if (!wheelScrub) return;

    const el = scrollContainer.current;
    if (!el) return;

    const applyScrubDelta = (delta: number, sensitivity: number): boolean => {
      const tweens = infiniteAnimationRef.current;
      if (!tweens.length) return false;

      if (pageScrollVelocityPxPerSecRef.current > wheelMaxPageScrollVelocity) {
        return false;
      }

      const cycle = scrollSpeed;
      const step = delta * sensitivity;

      tweens.forEach((tw) => {
        if (!tw) return;
        let t = tw.totalTime() + step;
        if (t < 0) {
          t += Math.ceil(-t / cycle) * cycle;
        }
        tw.totalTime(t);
      });
      return true;
    };

    const onWheel = (e: Event) => {
      if (!(e instanceof globalThis.WheelEvent)) return;
      if (e.ctrlKey) return;

      // Trackpad horizontal uses deltaX; mouse wheel is mostly deltaY — use dominant axis.
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const scrollDelta = absX >= absY ? e.deltaX : e.deltaY;
      if (scrollDelta === 0) return;

      if (!applyScrubDelta(scrollDelta, wheelSensitivity)) return;
      e.preventDefault();
    };

    let lastTouchX: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      lastTouchX = e.touches[0].clientX;
      controlScroll('pause');
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || lastTouchX === null) return;
      const x = e.touches[0].clientX;
      const dx = x - lastTouchX;
      lastTouchX = x;
      if (dx === 0) return;
      // Opposite sign of finger motion so the strip tracks the drag like a physical surface.
      applyScrubDelta(-dx, touchSensitivity);
    };

    const onTouchEndOrCancel = (e: TouchEvent) => {
      if (e.touches.length > 0) return;
      lastTouchX = null;
      controlScroll('play');
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEndOrCancel);
    el.addEventListener('touchcancel', onTouchEndOrCancel);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEndOrCancel);
      el.removeEventListener('touchcancel', onTouchEndOrCancel);
    };
  }, [wheelScrub, wheelSensitivity, touchSensitivity, wheelMaxPageScrollVelocity, scrollSpeed]);

  return (
    <div className={clsx('overflow-hidden', className)}>
      <div
        ref={scrollContainer}
        className="flex w-screen touch-pan-y flex-row items-center justify-center"
        onMouseLeave={() => controlScroll('play')}
        onMouseOver={() => controlScroll('pause')}
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
};

export default ScrollingContainer;
