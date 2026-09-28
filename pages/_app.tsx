import PageTransition from '@/components/layout/page-transition';
import Layout from '@/layout/default';
import { AppProvider } from '@/providers/root';
import '@/styles/main.scss';
import '@/styles/tailwind.css';
import { AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import type { AppProps } from 'next/app';
import { usePathname } from 'next/navigation';

function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const lenis = useLenis();

  console.info(
    '%c Designed & Coded by METABOLE:',
    'background: #1b17ee; color: white !important; padding: 8px 12px; border-radius: 4px; font-weight: bold;',
  );
  console.info(
    '%c https://metabole.studio/ ',
    'background: #f1f2ff; color: white !important; padding: 8px 12px; border-radius: 4px; font-weight: bold;',
  );

  return (
    <AppProvider>
      <Layout>
        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            if (lenis) {
              lenis.scrollTo(0, { immediate: true });
            } else {
              window.scrollTo(0, 0);
            }
            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
            });
          }}
        >
          <PageTransition key={pathname}>
            <Component {...pageProps} />
          </PageTransition>
        </AnimatePresence>
      </Layout>
    </AppProvider>
  );
}

export default App;
