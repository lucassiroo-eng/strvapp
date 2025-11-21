import axios from 'axios';

import { config } from '../config';

interface LoopInput {
  latitude: number;
  longitude: number;
  distanceKm: number;
}

export const generateCircularRoute = ({ latitude, longitude, distanceKm }: LoopInput) => {
  const radiusKm = distanceKm / (2 * Math.PI);
  const points = 32;
  const coordinates: [number, number][] = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2;
    const dx = radiusKm * Math.cos(angle);
    const dy = radiusKm * Math.sin(angle);
    const deltaLat = (dy / 110.574);
    const deltaLng = dx / (111.32 * Math.cos((latitude * Math.PI) / 180));
    return [longitude + deltaLng, latitude + deltaLat];
  });
  coordinates.push(coordinates[0]);
  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates },
    properties: { distanceKm, source: 'generated' as const }
  };
};

export const generateRouteWithMapbox = async ({ latitude, longitude, distanceKm }: LoopInput) => {
  if (!config.mapboxToken) {
    return generateCircularRoute({ latitude, longitude, distanceKm });
  }

  const bearing = 90;
  const waypointDistanceKm = distanceKm / 2;
  const deltaLng = waypointDistanceKm / (111.32 * Math.cos((latitude * Math.PI) / 180));
  const waypointLng = longitude + deltaLng;
  const waypointLat = latitude;

  const profile = 'cycling';
  const coordinates = `${longitude},${latitude};${waypointLng},${waypointLat};${longitude},${latitude}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}`;
  const response = await axios.get(url, {
    params: {
      access_token: config.mapboxToken,
      geometries: 'geojson'
    }
  });

  const route = response.data.routes?.[0];
  if (!route) {
    return generateCircularRoute({ latitude, longitude, distanceKm });
  }

  return {
    type: 'Feature',
    geometry: route.geometry,
    properties: {
      distanceKm: route.distance / 1000,
      estimatedDurationMin: route.duration / 60,
      source: 'generated' as const
    }
  };
};
