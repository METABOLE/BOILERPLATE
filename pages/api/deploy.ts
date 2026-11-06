import type { NextApiRequest, NextApiResponse } from 'next';

type DeployResponse = {
  ok: boolean;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<DeployResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Méthode non autorisée.' });
  }

  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!deployHookUrl) {
    return res.status(500).json({
      ok: false,
      message: 'VERCEL_DEPLOY_HOOK_URL manquant.',
    });
  }

  try {
    const response = await fetch(deployHookUrl, { method: 'POST' });

    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        message: 'Le hook de déploiement Vercel a échoué.',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Déploiement lancé avec succès.',
    });
  } catch {
    return res.status(500).json({
      ok: false,
      message: 'Impossible de contacter le hook de déploiement.',
    });
  }
}
