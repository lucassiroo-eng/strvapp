import { Router } from 'express';

import { fetchNewsFeed, fetchYouTubeFeed } from '../services/feedService';

const router = Router();

router.get('/', async (req, res) => {
  const topics = (req.query.topics as string)?.split(',').filter(Boolean) || [];
  const mergedTopics = topics.length ? topics : undefined;
  try {
    const [youtube, news] = await Promise.all([
      fetchYouTubeFeed(mergedTopics || []),
      fetchNewsFeed(mergedTopics || [])
    ]);
    const combined = [...youtube, ...news].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    res.json({ feed: combined });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load feed', details: (error as Error).message });
  }
});

export default router;
