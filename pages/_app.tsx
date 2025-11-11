import Layout from '@/layout/default';
import { AppProvider } from '@/providers/root';
import '@/styles/main.scss';
import '@/styles/tailwind.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const SanityVisualEditing = dynamic(
  () => import('@/components/sanity/sanity-visual-editing'),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const { draftMode } = pageProps;
  
  return (
    <>
      {pathname.includes('studio') ? (
        <Component {...pageProps} />
      ) : (
        <AppProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      )}
      {draftMode && <SanityVisualEditing />}
    </>
  );
}
