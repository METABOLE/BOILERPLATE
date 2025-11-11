import { usePerformance } from '@/providers/performance.provider';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

const ScreenLoader = () => {
  const screenLoaderRef = useRef(null);
  const [counter, setCounter] = useState(0);
  const [counterComplete, setCounterComplete] = useState(false);
  const { isLoading } = usePerformance();

  const { contextSafe } = useGSAP();

  const hideAnimation = contextSafe(() => {
    gsap.to(screenLoaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        if (screenLoaderRef.current) {
          gsap.set(screenLoaderRef.current, { display: 'none' });
        }
      },
    });
  });

  const revealAnimation = contextSafe(() => {
    gsap.to(
      { value: 0 },
      {
        value: 100,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: function () {
          setCounter(Math.round(this.targets()[0].value));
        },
        onComplete: () => {
          setCounterComplete(true);
        },
      },
    );
  });

  useGSAP(() => {
    revealAnimation();
  }, []);

  useEffect(() => {
    if (counterComplete && !isLoading) {
      hideAnimation();
    }
  }, [counterComplete, isLoading]);

  return (
    <div
      ref={screenLoaderRef}
      className="fixed inset-0 z-99999 flex items-center justify-center bg-black"
    >
      <div className="text-center">
        <div className="text-8xl font-bold text-white">{counter}</div>
        {counterComplete && isLoading && (
          <div className="mt-4 text-sm text-white opacity-50">Analyzing performance...</div>
        )}
      </div>
    </div>
  );
};

export default ScreenLoader;
