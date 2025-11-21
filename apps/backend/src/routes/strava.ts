import { Router } from 'express';

import { fetchActivities, fetchRouteById, fetchRoutes } from '../services/stravaService';

const router = Router();

router.get('/activities', async (req, res) => {
  const perPage = Number(req.query.perPage) || 20;
  try {
    const activities = await fetchActivities(perPage);
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities', details: (error as Error).message });
  }
});

router.get('/routes', async (_req, res) => {
  try {
    const routes = await fetchRoutes();
    res.json({ routes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes', details: (error as Error).message });
  }
});

router.get('/routes/:id', async (req, res) => {
  try {
    const route = await fetchRouteById(req.params.id);
    res.json({ route });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch route', details: (error as Error).message });
  }
});

export default router;
