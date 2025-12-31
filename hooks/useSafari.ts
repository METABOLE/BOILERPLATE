import { useEffect, useState } from 'react';

export const useSafari = (): boolean => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const userAgent = navigator.userAgent || '';
    const vendor = navigator.vendor || '';

    // Détection Safari (mais pas Chrome sur iOS qui utilise aussi Safari)
    const safari =
      /^((?!chrome|android).)*safari/i.test(userAgent) ||
      (vendor.includes('Apple') && !userAgent.includes('CriOS') && !userAgent.includes('FxiOS'));

    setIsSafari(safari);
  }, []);

  return isSafari;
};
