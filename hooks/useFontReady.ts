import { useEffect, useState } from 'react';

export function useFontReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.fonts.load('1rem "Sample"').then(() => {
      setReady(true);
    });
  }, []);

  return ready;
}
