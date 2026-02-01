import { ReactNode } from 'react';
import { PerformanceProvider } from './performance.provider';
import { QueryProvider } from './query.provider';
import { SmoothScrollProvider } from './smooth-scroll.provider';
import ScreenLoader from '@/components/layout/screen-loader';
import { useIsScreenLoader } from '@/hooks/useIsScreenLoader';
import { FontReadyProvider } from './fonts.provider';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const isScreenLoader = useIsScreenLoader();

  return (
    <QueryProvider>
      <PerformanceProvider>
        <FontReadyProvider>
          {isScreenLoader && <ScreenLoader />}
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </FontReadyProvider>
      </PerformanceProvider>
    </QueryProvider>
  );
};
