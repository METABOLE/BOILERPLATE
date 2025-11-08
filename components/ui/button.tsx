import { useMagnet, useResetMagnet } from '@/hooks/useMagnet';
import { usePerformance } from '@/providers/performance.provider';
import { useGSAP } from '@gsap/react';
import { clsx } from 'clsx';
import gsap from 'gsap';
import Link from 'next/link';
import { ComponentProps, forwardRef, HTMLAttributes, ReactNode, useRef, useState } from 'react';

interface BaseButtonProps {
  children: ReactNode;
  className?: string;
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  isResizable?: boolean;
  onClick?: () => void;
}

type DivButtonProps = BaseButtonProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof BaseButtonProps> & {
    href?: never;
    target?: never;
  };

interface LinkButtonProps extends BaseButtonProps {
  href: string;
  target?: string;
  scroll?: boolean;
}

type ButtonProps = DivButtonProps | LinkButtonProps;

type DynamicElementProps = {
  href?: string;
  target?: string;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  scroll?: boolean;
} & ComponentProps<'div'>;

const DynamicElement = ({ href, disabled, scroll = false, ...props }: DynamicElementProps) => {
  const Component = href && !disabled ? Link : 'button';
  return <Component {...(props as LinkButtonProps)} {...(href && !disabled && { href, scroll })} />;
};

const Button = forwardRef<HTMLDivElement, ButtonProps>(
  (
    {
      children,
      href,
      color = 'primary',
      target,
      className,
      disabled = false,
      isResizable = false,
      ...props
    },
    ref,
  ) => {
    const { contextSafe } = useGSAP();
    const { isLoading } = usePerformance();
    const buttonRef = useRef(null);
    const hiddenButtonRef = useRef<HTMLDivElement>(null);
    const textRef = useRef(null);
    const currentChildRef = useRef(null);
    const absoluteChildRef = useRef(null);
    const [currentChild, setCurrentChild] = useState(children);

    const resizeButton = contextSafe(() => {
      if (!isResizable || currentChild === children) return;

      const widthHiddenButton = hiddenButtonRef.current?.getBoundingClientRect();
      const targetWidth = widthHiddenButton?.width;

      gsap
        .timeline()
        .to(textRef.current, {
          width: targetWidth,
          duration: 0.3,
          ease: 'power2.inOut',
        })
        .to(
          textRef.current,
          {
            y: -50,
            opacity: 0,
            duration: 0.15,
            ease: 'power2.in',
          },
          '<',
        )
        .add(() => {
          setCurrentChild(children);
        })
        .fromTo(
          textRef.current,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.15,
            ease: 'power2.out',
          },
          '<',
        );
    });

    useGSAP(() => {
      if (!isResizable || isLoading) return;
      setCurrentChild(children);
      resizeButton();
    }, [children, isResizable, isLoading]);

    return (
      <>
        <DynamicElement
          ref={ref}
          className={clsx(
            'inline-block w-fit cursor-pointer overflow-hidden rounded-lg uppercase',
            color === 'primary' ? 'bg-red' : 'bg-blue',
            disabled ? 'cursor-default! opacity-70' : 'cursor-pointer',
            className,
          )}
          {...props}
          disabled={disabled}
          href={href}
          target={target}
          onMouseMove={(e) => useMagnet(e, 0.8)}
          onMouseOut={(e) => useResetMagnet(e)}
        >
          <div ref={buttonRef} className="z-20 flex h-full w-full items-center">
            <div
              ref={textRef}
              className="relative flex w-fit items-center justify-center px-6 whitespace-nowrap"
              onMouseMove={(e) => useMagnet(e, 0.4)}
              onMouseOut={(e) => useResetMagnet(e)}
            >
              <span ref={currentChildRef}>{isResizable ? currentChild : children}</span>
              <span ref={absoluteChildRef} aria-hidden={true} className="absolute">
                {isResizable ? currentChild : children}
              </span>
            </div>
          </div>
        </DynamicElement>
        {isResizable && (
          <div
            ref={hiddenButtonRef}
            className="pointer-events-none invisible fixed top-0 left-0 -z-10 h-full w-fit items-center justify-center px-6 whitespace-nowrap uppercase opacity-0"
          >
            {children}
          </div>
        )}
      </>
    );
  },
);

export default Button;
