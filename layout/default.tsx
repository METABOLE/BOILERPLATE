import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Cursor from '@/components/ui/cursor';
import PerformanceIndicator from '@/components/ui/performance-indicator';
import SEO from '@/components/ui/SEO';
import { useEnvironment } from '@/hooks/useEnvironment';
import { useFontReady } from '@/hooks/useFontReady';
import { usePerformance } from '@/providers/performance.provider';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ReactNode, useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Layout = ({ children }: { children: ReactNode }) => {
  const { isProd } = useEnvironment();
  const { isLoading } = usePerformance();
  const fontReady = useFontReady();

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [isLoading]);

  return (
    <>
      <Cursor />
      <SEO />

      {isLoading || !fontReady ? (
        <div className="bg-blue fixed inset-0 z-9998" />
      ) : (
        <>
          <Header />
          <main className="min-h-screen w-screen">{children}</main>
          <Footer />
        </>
      )}

      {!isProd && <PerformanceIndicator />}
    </>
  );
};

export default Layout;
