import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Cursor from '@/components/ui/cursor';
import PerformanceIndicator from '@/components/ui/performance-indicator';
import SEO from '@/components/ui/SEO';
import { useEnvironment } from '@/hooks/useEnvironment';
import { usePerformance } from '@/providers/performance.provider';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ReactNode } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

const Layout = ({ children }: { children: ReactNode }) => {
  const { isProd } = useEnvironment();
  const { isLoading } = usePerformance();

  // Always render page content (SSR / crawlers). Overlay only covers during perf probe.
  useGSAP(() => {
    if (isLoading) return;
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  return (
    <>
      <Cursor />
      <SEO />

      <Header />
      <main className="min-h-screen w-screen">{children}</main>
      <Footer />

      {isLoading && <div className="bg-blue fixed inset-0 z-9998" aria-hidden />}

      {!isProd && <PerformanceIndicator />}
    </>
  );
};

export default Layout;
