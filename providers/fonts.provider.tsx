import { useFontReadyHook } from '@/hooks/useFontReady';
import { createContext, ReactNode, useContext } from 'react';

const FontReadyContext = createContext<ReturnType<typeof useFontReadyHook> | null>(null);

export const FontReadyProvider = ({ children }: { children: ReactNode }) => {
  const isFontReady = useFontReadyHook();
  if (!isFontReady) return null;
  return <FontReadyContext.Provider value={isFontReady}>{children}</FontReadyContext.Provider>;
};

export const useFontReady = () => {
  const ctx = useContext(FontReadyContext);
  if (!ctx) throw new Error('useFontReady must be used within a FontReadyProvider');
  return ctx;
};
