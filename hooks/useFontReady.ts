import { useEffect, useState } from 'react';

export function useFontReadyHook() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.fonts.load('1rem "Sample"').then(() => {
      document.fonts.load('1rem "Sample2"').then(() => {
        setReady(true);
      });
    });
  }, []);

  return ready;
}
