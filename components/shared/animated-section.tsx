import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import Image from 'next/image';
import { ReactNode, useEffect, useRef, useState } from 'react';

gsap.registerPlugin(InertiaPlugin);

interface MouseTrailImage {
  id: number;
  x: number;
  y: number;
  imageIndex: number;
}

interface AnimatedSectionProps {
  children?: ReactNode;
  images?: string[];
  className?: string;
  maxImages?: number;
  distanceThreshold?: number;
  throttleDelay?: number;
}

const AnimatedSection = ({
  children,
  images = [],
  className = '',
  maxImages = 15,
  distanceThreshold = 250,
  throttleDelay = 16,
}: AnimatedSectionProps) => {
  const [trailImages, setTrailImages] = useState<MouseTrailImage[]>([]);
  const imageCounterRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const hasInitialPositionRef = useRef(false);
  const throttleRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedImageId = useRef<number | null>(null);
  const mouseProxyRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInertiaReadyRef = useRef(false);

  const { contextSafe } = useGSAP();

  const createTrailImage = contextSafe((x: number, y: number) => {
    if (images.length === 0) return;

    const newImage: MouseTrailImage = {
      id: imageCounterRef.current++,
      x,
      y,
      imageIndex: Math.floor(Math.random() * images.length),
    };

    setTrailImages((prev) => {
      const updated = [...prev, newImage];
      return updated.length > maxImages ? updated.slice(-maxImages) : updated;
    });
  });

  useGSAP(() => {
    if (!mouseProxyRef.current) {
      mouseProxyRef.current = document.createElement('div');
      mouseProxyRef.current.style.position = 'absolute';
      mouseProxyRef.current.style.pointerEvents = 'none';
      mouseProxyRef.current.style.visibility = 'hidden';
      document.body.appendChild(mouseProxyRef.current);

      gsap.set(mouseProxyRef.current, { x: 7, y: 7 });
      InertiaPlugin.track(mouseProxyRef.current, 'x,y');

      setTimeout(() => {
        isInertiaReadyRef.current = true;
      }, 300);
    }
  }, []);

  useGSAP(
    () => {
      if (trailImages.length > 0) {
        const latestImage = trailImages[trailImages.length - 1];

        if (latestImage.id === lastProcessedImageId.current) {
          return;
        }

        lastProcessedImageId.current = latestImage.id;

        requestAnimationFrame(() => {
          const imageElement = document.querySelector(
            `[data-trail-id="${latestImage.id}"]`,
          ) as HTMLElement;

          if (imageElement && mouseProxyRef.current) {
            const velocityX = InertiaPlugin.getVelocity(mouseProxyRef.current, 'x');
            const velocityY = InertiaPlugin.getVelocity(mouseProxyRef.current, 'y');

            const rotationIntensity = Math.min(Math.abs(velocityX) / 2000, 1);
            const rotationDirection = velocityX > 0 ? 1 : -1;
            const rotationAngle = rotationDirection * rotationIntensity * 8;

            const initialRotation = (Math.random() - 0.5) * 6;

            gsap.set(imageElement, {
              scale: 0,
              opacity: 1,
              rotation: initialRotation,
            });

            gsap.to(imageElement, {
              scale: 1,
              duration: 0.3,
            });

            gsap.to(imageElement, {
              x: velocityX * 0.05,
              y: velocityY * 0.05,
              rotation: initialRotation + rotationAngle,
              duration: 2.2,
              ease: 'power2.out',
            });

            gsap.to(imageElement, {
              scale: 0.8,
              opacity: 0,
              duration: 0.8,
              delay: 0.8,
              ease: 'power2.out',
              onComplete: () => {
                setTrailImages((prev) => prev.filter((img) => img.id !== latestImage.id));
              },
            });
          }
        });
      }
    },
    { dependencies: [trailImages] },
  );

  useEffect(() => {
    return () => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
      if (mouseProxyRef.current && mouseProxyRef.current.parentNode) {
        mouseProxyRef.current.parentNode.removeChild(mouseProxyRef.current);
      }
    };
  }, []);

  const handleMouseMove = contextSafe((e: React.MouseEvent) => {
    if (throttleRef.current || images.length === 0 || !isInertiaReadyRef.current) return;

    throttleRef.current = setTimeout(() => {
      const { clientX, clientY } = e;

      if (!containerRef.current) {
        throttleRef.current = null;
        return;
      }

      const absoluteX = clientX + window.scrollX;
      const absoluteY = clientY + window.scrollY;

      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;

      if (mouseProxyRef.current) {
        gsap.to(mouseProxyRef.current, {
          duration: 0.1,
          x: absoluteX,
          y: absoluteY,
        });
      }

      if (!hasInitialPositionRef.current) {
        lastPositionRef.current = { x: relativeX, y: relativeY };
        hasInitialPositionRef.current = true;
        throttleRef.current = null;
        return;
      }

      const distance = Math.sqrt(
        Math.pow(relativeX - lastPositionRef.current.x, 2) +
          Math.pow(relativeY - lastPositionRef.current.y, 2),
      );

      if (distance > distanceThreshold) {
        createTrailImage(relativeX, relativeY);
        lastPositionRef.current = { x: relativeX, y: relativeY };
      }

      throttleRef.current = null;
    }, throttleDelay);
  });

  return (
    <section
      ref={containerRef}
      className={clsx('relative', className)}
      onMouseMove={(e) => handleMouseMove(e)}
    >
      {trailImages.map((img) => (
        <div
          key={img.id}
          className="pointer-events-none absolute z-0 aspect-square h-24 w-24 overflow-hidden rounded-lg"
          data-trail-id={img.id}
          style={{
            left: img.x - 50,
            top: img.y - 50,
          }}
        >
          <Image
            alt="Animated trail"
            className="h-full w-full object-cover"
            height={100}
            src={images[img.imageIndex]}
            width={100}
          />
        </div>
      ))}
      {children}
    </section>
  );
};

export default AnimatedSection;
