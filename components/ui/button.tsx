import { useGSAP } from '@gsap/react';
import { clsx } from 'clsx';
import gsap from 'gsap';
import Link from 'next/link';
import { ComponentProps, forwardRef, HTMLAttributes, ReactNode, useRef, useState } from 'react';

interface BaseButtonProps {
  children: ReactNode;
  className?: string;
  color?: 'accent' | 'white';
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
      color = 'accent',
      target,
      className,
      disabled = false,
      isResizable = false,
      ...props
    },
    ref,
  ) => {
    const { contextSafe } = useGSAP();
    const hiddenButtonRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [currentChild, setCurrentChild] = useState(children);

    const label = isResizable ? currentChild : children;

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
      if (!isResizable) return;
      setCurrentChild(children);
      resizeButton();
    }, [children, isResizable]);

    return (
      <>
        <DynamicElement
          ref={ref}
          className={clsx(
            'group relative inline-flex h-10.75 w-fit cursor-pointer items-center overflow-hidden rounded-xs',
            disabled ? 'pointer-events-none cursor-default! opacity-70' : 'cursor-pointer',
            color === 'accent' && 'text-white',
            color === 'white' && 'text-purple-black',
            className,
          )}
          {...props}
          disabled={disabled}
          href={href}
          target={target}
        >
          <span
            aria-hidden={true}
            className={clsx(
              'ease-power4-out absolute inset-0 rounded-xs transition-transform duration-700 will-change-transform',
              'group-hover:scale-[0.96] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
              color === 'accent' && 'bg-accent',
              color === 'white' && 'bg-white',
            )}
          />
          <div
            ref={textRef}
            className="relative z-10 h-full w-fit overflow-hidden whitespace-nowrap"
          >
            <span className="invisible flex h-full items-center px-3">{label}</span>
            <span
              className={clsx(
                'ease-power4-out absolute inset-0 flex items-center px-3 transition-transform duration-700 will-change-transform',
                'group-hover:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
              )}
            >
              {label}
            </span>
            <span
              aria-hidden={true}
              className={clsx(
                'ease-power4-out absolute top-full left-0 flex h-full items-center px-3 transition-transform duration-700 will-change-transform',
                'group-hover:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
              )}
            >
              {label}
            </span>
          </div>
        </DynamicElement>
        {isResizable && (
          <div
            ref={hiddenButtonRef}
            className="pointer-events-none invisible fixed top-0 left-0 -z-10 h-10.75 w-fit items-center justify-center px-3 whitespace-nowrap opacity-0"
          >
            {children}
          </div>
        )}
      </>
    );
  },
);

export default Button;
