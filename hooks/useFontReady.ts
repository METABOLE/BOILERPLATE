import { useEffect, useState } from 'react';

export function useFontReadyHook() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.fonts.load('1rem "Syne"').then(() => {
      setReady(true);
    });
  }, []);

  return ready;
}
