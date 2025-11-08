import { ReactNode } from 'react';
import { PerformanceProvider } from './performance.provider';
import { QueryProvider } from './query.provider';
import { SmoothScrollProvider } from './smooth-scroll.provider';
import { PageTransitionProvider } from './page-transition.provider';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <PerformanceProvider>
        <PageTransitionProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </PageTransitionProvider>
      </PerformanceProvider>
    </QueryProvider>
  );
};
