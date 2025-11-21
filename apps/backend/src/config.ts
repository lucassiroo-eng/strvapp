import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  strava: {
    clientId: process.env.STRAVA_CLIENT_ID || '',
    clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
    redirectUri: process.env.STRAVA_REDIRECT_URI || 'http://localhost:4000/auth/strava/callback'
  },
  youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
  newsApiKey: process.env.NEWS_API_KEY || '',
  mapboxToken: process.env.MAPBOX_TOKEN,
  feedTopics: (process.env.DEFAULT_FEED_TOPICS || 'running,cycling,fitness').split(',').map((t) => t.trim())
};
