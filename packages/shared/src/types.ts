export type ActivityType = 'Run' | 'Ride' | 'Swim' | 'Hike' | 'Walk' | 'Workout' | 'Other';

export interface StravaActivity {
  id: number;
  name: string;
  type: ActivityType;
  distance: number;
  movingTime: number;
  pace: number;
  startDateLocal: string;
  mapPolyline?: string;
}

export interface RouteRequest {
  locationLatLng: { latitude: number; longitude: number };
  distanceKm: number;
  activityType: ActivityType;
}

export interface RouteFeature {
  geometry: {
    coordinates: [number, number][];
    type: 'LineString';
  };
  properties: {
    distanceKm: number;
    estimatedDurationMin?: number;
    source: 'generated' | 'strava';
  };
  type: 'Feature';
}

export interface ContentItem {
  id: string;
  source: 'youtube' | 'news';
  title: string;
  thumbnail?: string;
  snippet: string;
  url: string;
  publishedAt: string;
}
