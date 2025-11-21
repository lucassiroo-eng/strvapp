import { StravaActivity } from '@stride-hub/shared';

export const normalizeActivity = (activity: any): StravaActivity => {
  const movingTimeMinutes = activity.moving_time / 60;
  const pace = activity.distance > 0 ? movingTimeMinutes / (activity.distance / 1000) : 0;
  return {
    id: activity.id,
    name: activity.name,
    type: activity.type,
    distance: activity.distance,
    movingTime: activity.moving_time,
    pace,
    startDateLocal: activity.start_date_local,
    mapPolyline: activity.map?.summary_polyline
  };
};
