import { Router } from 'express';

import { config } from '../config';
import { exchangeCodeForToken, getAuthUrl, refreshAccessToken } from '../services/stravaService';

const router = Router();

router.get('/strava/login', (_req, res) => {
  if (!config.strava.clientId || !config.strava.clientSecret) {
    return res.status(400).json({ error: 'Strava OAuth not configured' });
  }
  const url = getAuthUrl();
  return res.redirect(url);
});

router.get('/strava/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    await exchangeCodeForToken(code);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to exchange code', details: (error as Error).message });
  }
});

router.post('/strava/refresh', async (_req, res) => {
  try {
    const accessToken = await refreshAccessToken();
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh token', details: (error as Error).message });
  }
});

export default router;
