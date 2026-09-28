import { PERFORMANCE_LEVEL } from '@/hooks/usePerformance';
import { usePerformance } from '@/providers/performance.provider';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { useRef } from 'react';

interface StaticImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const StaticImage = ({ src, alt, width = 1920, height = 1080 }: StaticImageProps) => {
  const wrapperImageRef = useRef(null);
  const imageRef = useRef(null);
  const { contextSafe } = useGSAP();
  const { performanceLevel } = usePerformance();

  const parallaxAnimation = contextSafe(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: wrapperImageRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
      .fromTo(
        imageRef.current,
        {
          yPercent: -100,
        },
        {
          yPercent: 100,
          duration: 0.1,
          ease: 'none',
        },
        '<',
      );
  });

  useGSAP(() => {
    if (performanceLevel === PERFORMANCE_LEVEL.LOW) return;
    parallaxAnimation();
  }, []);

  return (
    <div ref={wrapperImageRef} className="h-screen w-full overflow-hidden">
      <Image
        ref={imageRef}
        alt={alt}
        className="top-0 h-screen w-full object-cover"
        height={height}
        src={src}
        width={width}
      />
    </div>
  );
};

export default StaticImage;
