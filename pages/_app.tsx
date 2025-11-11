import Layout from '@/layout/default';
import { AppProvider } from '@/providers/root';
import '@/styles/main.scss';
import '@/styles/tailwind.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const SanityVisualEditing = dynamic(() => import('@/components/sanity/sanity-visual-editing'), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const { draftMode } = pageProps;

  console.info(
    '%c Designed & Coded by METABOLE:',
    'background: #1b17ee; color: white !important; padding: 8px 12px; border-radius: 4px; font-weight: bold;',
  );
  console.info(
    '%c https://metabole.studio/ ',
    'background: #f1f2ff; color: white !important; padding: 8px 12px; border-radius: 4px; font-weight: bold;',
  );

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
