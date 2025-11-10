import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  isFrench?: boolean;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

const SEO = ({
  title = 'BOILERPLATE - This is a boilerplate',
  isFrench = false,
  description = 'This is a boilerplate',
  image = '/og-image.png',
  url = 'https://boilerplate.com',
  type = 'website',
  noindex = false,
}: SEOProps) => {
  const { asPath } = useRouter();

  return (
    <Head>
      <title>{title}</title>
      <meta content="en" name="language" />
      <meta content="en" httpEquiv="content-language" />
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content={description} name="description" />
      <meta content="telephone=no" name="format-detection" />
      <meta content="default" name="referrer" />

      {/* Indexation contrôlée */}
      <meta content={noindex ? 'noindex, nofollow' : 'index, follow'} name="robots" />

      {/* Canonical link */}
      <link key="canonical" href={'https://sample.com' + asPath} rel="canonical" />

      {/* OpenGraph Tags */}
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={`${url}${image}`} property="og:image" />
      <meta content={url} property="og:url" />
      <meta content={type} property="og:type" />
      <meta content="Sample" property="og:site_name" />
      <meta content={isFrench ? 'fr_FR' : 'en_US'} property="og:locale" />

      {/* Twitter Card */}
      <meta content="summary_large_image" name="twitter:card" />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta content={`${url}${image}`} name="twitter:image" />

      {/* Google verification - Uncomment when ready */}
      <meta content="key-sample-google-verification" name="google-site-verification" />

      {/* Keywords - Optimisé pour "sample" et "sample studio" */}
      <meta content="sample, Sample, SAMPLE," name="keywords" />

      {/* Favicon */}
      <link href="/favicon.svg" rel="icon" />
    </Head>
  );
};

export default SEO;
