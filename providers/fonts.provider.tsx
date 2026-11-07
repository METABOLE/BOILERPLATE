import { useFontReadyHook } from '@/hooks/useFontReady';
import { createContext, ReactNode, useContext } from 'react';

const FontReadyContext = createContext(false);

/**
 * Never gate rendering on font load — that empties SSR HTML and hides the
 * site from Googlebot / AI crawlers.
 * Consumers can still wait on `useFontReady()` before starting animations.
 */
export const FontReadyProvider = ({ children }: { children: ReactNode }) => {
  const isFontReady = useFontReadyHook();

  return <FontReadyContext.Provider value={isFontReady}>{children}</FontReadyContext.Provider>;
};

export const useFontReady = () => useContext(FontReadyContext);
