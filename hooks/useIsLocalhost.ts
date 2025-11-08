import { useState, useEffect } from 'react';

const useIsLocalhost = () => {
  const [isLocalhost, setIsLocalhost] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { hostname } = window.location;
      const isLocal = hostname === 'localhost';

      setIsLocalhost(isLocal);
    }
  }, []);

  return isLocalhost;
};

export default useIsLocalhost;
