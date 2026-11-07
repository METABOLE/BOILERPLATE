import { META } from '@/constants';
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
  title = META.title,
  isFrench = true,
  description = META.description,
  image = META.image,
  url = META.url,
  type = 'website',
  noindex = false,
}: SEOProps) => {
  const { asPath } = useRouter();
  const lang = isFrench ? 'fr' : 'en';
  const path = asPath.split('?')[0]?.split('#')[0] ?? asPath;
  const canonicalUrl = `${META.url}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = `${url}${image}`;

  return (
    <Head>
      <title key="title">{title}</title>
      <meta key="language" content={lang} name="language" />
      <meta key="content-language" content={lang} httpEquiv="content-language" />
      <meta key="charset" charSet="utf-8" />
      <meta key="viewport" content="width=device-width, initial-scale=1" name="viewport" />
      <meta key="description" content={description} name="description" />
      <meta key="format-detection" content="telephone=no" name="format-detection" />
      <meta key="referrer" content="default" name="referrer" />

      <meta key="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} name="robots" />

      <link key="canonical" href={canonicalUrl} rel="canonical" />

      <meta key="og:title" content={title} property="og:title" />
      <meta key="og:description" content={description} property="og:description" />
      <meta key="og:image" content={ogImage} property="og:image" />
      <meta key="og:url" content={canonicalUrl} property="og:url" />
      <meta key="og:type" content={type} property="og:type" />
      <meta key="og:site_name" content="BOILERPLATE" property="og:site_name" />
      <meta key="og:locale" content={isFrench ? 'fr_FR' : 'en_US'} property="og:locale" />

      <meta key="twitter:card" content="summary_large_image" name="twitter:card" />
      <meta key="twitter:title" content={title} name="twitter:title" />
      <meta key="twitter:description" content={description} name="twitter:description" />
      <meta key="twitter:image" content={ogImage} name="twitter:image" />

      {/* Uncomment and set a real token when the domain is ready:
      <meta content="…" name="google-site-verification" /> */}

      <link key="icon" href="/favicon.ico" rel="icon" />
    </Head>
  );
};

export default SEO;
