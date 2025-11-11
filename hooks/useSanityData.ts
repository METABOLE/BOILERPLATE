import { createDataAttribute } from '@/services/sanity.service';
import { useMemo } from 'react';
import type { SanityPageProps } from '@/types';

export function useSanityData<T>(props: SanityPageProps<T>) {
  const encodeDataAttribute = useMemo(
    () => createDataAttribute(props.initial.data, props.initial.sourceMap, props.draftMode),
    [props.initial.data, props.initial.sourceMap, props.draftMode],
  );

  return {
    data: props.initial.data,
    encodeDataAttribute,
  };
}
