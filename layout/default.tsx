import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Cursor from '@/components/ui/cursor';
import SEO from '@/components/ui/SEO';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ReactNode, useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

const Layout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  return (
    <>
      <Cursor />
      <SEO />
      <Header />
      <main className="min-h-screen w-screen">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
