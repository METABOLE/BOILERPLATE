import { ReactNode } from 'react';
import { FontReadyProvider } from './fonts.provider';
import { QueryProvider } from './query.provider';
import { SmoothScrollProvider } from './smooth-scroll.provider';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <FontReadyProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </FontReadyProvider>
    </QueryProvider>
  );
};
