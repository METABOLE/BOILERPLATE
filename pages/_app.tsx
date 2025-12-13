import SanityVisualEditing from '@/components/sanity/sanity-visual-editing';
import Layout from '@/layout/default';
import { AppProvider } from '@/providers/root';
import { fetchSamples } from '@/services/sample.service';
import '@/styles/main.scss';
import '@/styles/tailwind.css';
import { Sample } from '@/types';
import type { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';

interface CustomAppProps extends AppProps {
  globalProps: {
    samples: Sample[];
    draftMode: boolean;
  };
}

function AppContent({
  Component,
  pageProps,
  globalProps,
}: {
  Component: CustomAppProps['Component'];
  pageProps: CustomAppProps['pageProps'];
  globalProps: CustomAppProps['globalProps'];
}) {
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
      <Layout>
        <Component {...pageProps} {...globalProps} />
      </Layout>
    </>
  );
}

function App({ Component, pageProps, globalProps }: CustomAppProps) {
  const { pathname } = useRouter();
  const { draftMode } = globalProps;

  return (
    <>
      {pathname.includes('/studio') ? (
        <Component {...pageProps} />
      ) : (
        <AppProvider>
          <AppContent Component={Component} globalProps={globalProps} pageProps={pageProps} />
        </AppProvider>
      )}
      {draftMode && <SanityVisualEditing />}
    </>
  );
}

App.getInitialProps = async (context: AppContext) => {
  if (!context.ctx.req) {
    return {
      globalProps: {
        samples: {
          initial: { data: [] },
          draftMode: false,
        },
        draftMode: false,
      },
    };
  }

  const draftMode = !!(
    context.ctx.req.headers.cookie?.includes('__prerender_bypass') ||
    context.ctx.req.headers.cookie?.includes('__next_preview_data')
  );

  const samples = await fetchSamples({ draftMode });

  return {
    globalProps: {
      samples,
      draftMode: samples.draftMode || draftMode,
    },
  };
};

export default App;
