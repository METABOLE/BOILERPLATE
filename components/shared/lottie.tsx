import useIsMounted from '@/hooks/useIsMounted';
import type { LottieProps } from 'lottie-react';
import dynamic from 'next/dynamic';

const DynamicLottie = dynamic(() => import('lottie-react').then((mod) => mod.Lottie), {
  ssr: false,
});

type Props = LottieProps & {
  /** @deprecated Prefer `src`. Kept for older call sites. */
  animationData?: LottieProps['src'];
};

const Lottie = ({ animationData, src, className, ...props }: Props) => {
  const isMounted = useIsMounted();
  const animationSrc = src ?? animationData;

  if (!isMounted || !animationSrc) {
    return <div className={className} />;
  }

  return <DynamicLottie className={className} src={animationSrc} {...props} />;
};

export default Lottie;
