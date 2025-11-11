import { Sample } from '@/types';
import { groq } from 'next-sanity';
import { fetchSanityData } from './sanity.service';


export const fetchSamples = async (context: { draftMode?: boolean } = {}) => {
  const query = groq`
    *[_type == "sample"] {
      _id,
      name,
      slug,
      image
    }
  `;

  return await fetchSanityData<Sample[]>(query, {}, context);
};
