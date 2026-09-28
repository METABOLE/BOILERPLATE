import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

type ScreenLoaderProps = {
  persistent?: boolean;
};

const ScreenLoader = ({ persistent = false }: ScreenLoaderProps) => {
  const screenLoaderRef = useRef(null);
  const [counter, setCounter] = useState(0);
  const [counterComplete, setCounterComplete] = useState(false);

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
    if (counterComplete && !persistent) {
      hideAnimation();
    }
  }, [counterComplete, persistent]);

  return (
    <div
      ref={screenLoaderRef}
      className="fixed inset-0 z-99999 flex items-center justify-center bg-black"
    >
      <div className="text-center">
        <div className="text-8xl font-bold text-white">{counter}</div>
      </div>
    </div>
  );
};

export default ScreenLoader;
