import { ReactNode } from 'react';
import { FontReadyProvider } from './fonts.provider';
import { PerformanceProvider } from './performance.provider';
import { QueryProvider } from './query.provider';
import { SmoothScrollProvider } from './smooth-scroll.provider';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <PerformanceProvider>
        <FontReadyProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </FontReadyProvider>
      </PerformanceProvider>
    </QueryProvider>
  );
};
