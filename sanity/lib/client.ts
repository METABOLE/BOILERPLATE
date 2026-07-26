import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, studioUrl } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl: studioUrl,
  },
});

/** Server client for `@sanity/react-loader` `setServerClient`. */
export const createServerClient = (token?: string) =>
  client.withConfig({
    token,
    useCdn: true,
    stega: {
      enabled: false,
      studioUrl,
    },
  });
