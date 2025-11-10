import { client } from '@/sanity/lib/client';

export const fetchSample = async () => {
  const query = `
    *[_type == "sample"] {
      _id,
      title,
      slug,
    }
  `;

  const models = await client.fetch(query);

  return models;
};
