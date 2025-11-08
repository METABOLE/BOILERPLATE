import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export const useIsScreenLoader = () => {
  const pathname = usePathname();

  return useMemo(() => pathname === '/en' || pathname === '/fr' || pathname === '/', [pathname]);
};
