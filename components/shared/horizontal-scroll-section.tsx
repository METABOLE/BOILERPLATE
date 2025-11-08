import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ReactNode, useRef } from 'react';

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
}
const HorizontalScroll = ({ header, children, className = 'h-screen' }: HorizontalScrollProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP();

  useGSAP(() => {
    const pinAnimation = contextSafe(() => {
      if (!sectionRef.current || !containerRef.current) return;

      const scrollWidth = containerRef.current.scrollWidth - window.innerWidth;

      gsap.to(containerRef.current, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
        },
      });
    });

    pinAnimation();
  }, []);

  return (
    <section ref={sectionRef} className={className}>
      {header}
      <div ref={containerRef}>{children}</div>
    </section>
  );
};

export default HorizontalScroll;
