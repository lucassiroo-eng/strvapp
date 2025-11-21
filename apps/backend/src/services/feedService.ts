import axios from 'axios';

import { config } from '../config';

const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/search';
const NEWS_API = 'https://newsapi.org/v2/everything';

export const fetchYouTubeFeed = async (topics: string[]) => {
  if (!config.youtubeApiKey) return [];

  const q = topics.join(' ');
  const response = await axios.get(YOUTUBE_API, {
    params: {
      key: config.youtubeApiKey,
      part: 'snippet',
      q,
      maxResults: 10,
      type: 'video',
      order: 'date'
    }
  });

  return (response.data.items || []).map((item: any) => ({
    id: item.id.videoId,
    source: 'youtube' as const,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.medium?.url,
    snippet: item.snippet.description,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    publishedAt: item.snippet.publishedAt
  }));
};

export const fetchNewsFeed = async (topics: string[]) => {
  if (!config.newsApiKey) return [];

  const q = topics.join(' OR ');
  const response = await axios.get(NEWS_API, {
    params: {
      apiKey: config.newsApiKey,
      q,
      sortBy: 'publishedAt',
      language: 'en',
      pageSize: 10
    }
  });

  return (response.data.articles || []).map((article: any, index: number) => ({
    id: `${article.title}-${index}`,
    source: 'news' as const,
    title: article.title,
    thumbnail: article.urlToImage,
    snippet: article.description || article.content,
    url: article.url,
    publishedAt: article.publishedAt
  }));
};
