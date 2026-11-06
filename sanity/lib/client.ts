import { createClient as createSanityClient } from '@sanity/client';
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

/** Server client for `@sanity/react-loader` `setServerClient` (aligned on `@sanity/client` v8). */
export const createServerClient = (token?: string) =>
  createSanityClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: true,
  });
