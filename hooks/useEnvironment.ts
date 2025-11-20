export const useEnvironment = () => {
  const isClient = typeof window !== 'undefined';
  const hostname = isClient ? window.location.hostname : '';

  const isDev = hostname === 'localhost' || hostname === '127.0.0.1';
  const isProd = hostname === 'metabole.studio' || hostname === 'www.metabole.studio';
  const environment = isDev ? 'development' : 'production';

  return {
    isProd,
    isDev,
    environment,
  };
};
