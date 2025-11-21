import { Router } from 'express';

import { RouteRequest } from '@stride-hub/shared';

import { generateCircularRoute, generateRouteWithMapbox } from '../utils/routes';

const router = Router();

router.post('/generate', async (req, res) => {
  const body = req.body as RouteRequest;
  if (!body?.locationLatLng || !body.distanceKm) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const feature = await generateRouteWithMapbox({
      latitude: body.locationLatLng.latitude,
      longitude: body.locationLatLng.longitude,
      distanceKm: body.distanceKm
    });
    res.json({ route: feature });
  } catch (error) {
    const fallback = generateCircularRoute({
      latitude: body.locationLatLng.latitude,
      longitude: body.locationLatLng.longitude,
      distanceKm: body.distanceKm
    });
    res.status(200).json({ route: fallback, warning: (error as Error).message });
  }
});

export default router;
