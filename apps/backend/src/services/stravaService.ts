import axios from 'axios';
import qs from 'qs';

import { config } from '../config';
import { prisma } from '../prisma';
import { normalizeActivity } from '../utils/normalize';

const STRAVA_API = 'https://www.strava.com/api/v3';

export const getAuthUrl = () => {
  const params = qs.stringify({
    client_id: config.strava.clientId,
    redirect_uri: config.strava.redirectUri,
    response_type: 'code',
    scope: 'activity:read_all,read_all,profile:read_all',
    approval_prompt: 'auto'
  });
  return `https://www.strava.com/oauth/authorize?${params}`;
};

export const exchangeCodeForToken = async (code: string) => {
  const response = await axios.post(
    'https://www.strava.com/oauth/token',
    {
      client_id: config.strava.clientId,
      client_secret: config.strava.clientSecret,
      code,
      grant_type: 'authorization_code'
    },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const data = response.data;
  const expiresAt = new Date(data.expires_at * 1000);

  await prisma.oAuthToken.upsert({
    where: { id: 1 },
    update: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt
    },
    create: {
      provider: 'strava',
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt
    }
  });

  return data;
};

export const refreshAccessToken = async () => {
  const token = await prisma.oAuthToken.findFirst({ where: { provider: 'strava' } });
  if (!token) {
    throw new Error('No Strava token stored');
  }

  if (token.expiresAt.getTime() > Date.now() + 5 * 60 * 1000) {
    return token.accessToken;
  }

  const response = await axios.post(
    'https://www.strava.com/oauth/token',
    {
      client_id: config.strava.clientId,
      client_secret: config.strava.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken
    },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const data = response.data;
  const expiresAt = new Date(data.expires_at * 1000);

  await prisma.oAuthToken.update({
    where: { id: token.id },
    data: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || token.refreshToken,
      expiresAt
    }
  });

  return data.access_token as string;
};

export const fetchActivities = async (perPage = 20) => {
  const accessToken = await refreshAccessToken();
  const response = await axios.get(`${STRAVA_API}/athlete/activities`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { per_page: perPage }
  });

  return response.data.map(normalizeActivity);
};

export const fetchRoutes = async () => {
  const accessToken = await refreshAccessToken();
  const response = await axios.get(`${STRAVA_API}/athlete/routes`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};

export const fetchRouteById = async (id: string) => {
  const accessToken = await refreshAccessToken();
  const response = await axios.get(`${STRAVA_API}/routes/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};
