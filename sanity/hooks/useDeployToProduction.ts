import { useCallback, useState } from 'react';

const CONFIRM_MESSAGE = 'Cette action va redéployer entièrement le site. Continuer ?';

export function useDeployToProduction() {
  const [isLoading, setIsLoading] = useState(false);

  const deploy = useCallback(async (): Promise<{ ok: boolean; message: string }> => {
    if (!window.confirm(CONFIRM_MESSAGE)) {
      return { ok: false, message: 'Déploiement annulé.' };
    }

    setIsLoading(true);

    try {
      const response = await window.fetch('/api/deploy', { method: 'POST' });
      const payload = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !payload.ok) {
        return { ok: false, message: payload.message ?? 'Échec du déploiement.' };
      }

      return { ok: true, message: payload.message ?? 'Déploiement lancé avec succès.' };
    } catch {
      return { ok: false, message: 'Impossible de contacter le serveur de déploiement.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deploy, isLoading };
}
