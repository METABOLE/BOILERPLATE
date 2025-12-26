import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ElementType, ReactNode, useRef } from 'react';

const ScrollingText = ({
  children,
  variant = 'h2',
  className,
  startColor = 'red',
  endColor = 'blue',
}: {
  children: ReactNode;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  startColor?: string;
  endColor?: string;
}) => {
  const textRef = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP();

  const scrollAnimation = contextSafe(() => {
    if (!textRef.current) return;

    const splitWord = new SplitText(textRef.current.children, {
      type: 'words',
    });

    const words = splitWord.words || [];
    if (!words.length) return;

    words.forEach((word) => {
      const element = word as HTMLElement;
      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.style.display = 'inline-block';
      element.style.background = `linear-gradient(to right, ${startColor}, ${startColor} 50%, ${endColor} 50%)`;
      element.style.backgroundClip = 'text';
      element.style.webkitBackgroundClip = 'text';
      element.style.webkitTextFillColor = 'transparent';
      element.style.backgroundPosition = '100% 100%';
      element.style.backgroundSize = '200% 100%';
    });

    gsap.set(words, { backgroundPosition: '100% 100%' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top bottom',
        end: 'bottom center',
        scrub: true,
      },
    });

    words.forEach((word) => {
      tl.to(word, {
        backgroundPosition: '0% 100%',
        ease: 'none',
        duration: 1,
      });
    });
  });

  useGSAP(() => {
    scrollAnimation();
  }, [startColor, endColor]);

  const Tag = variant as ElementType;

  return (
    <Tag ref={textRef} className={className}>
      {children}
    </Tag>
  );
};

export default ScrollingText;
