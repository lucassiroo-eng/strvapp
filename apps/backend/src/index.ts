import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config';
import authRoutes from './routes/auth';
import feedRoutes from './routes/feed';
import routesRoutes from './routes/routes';
import stravaRoutes from './routes/strava';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  })
);
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/strava', stravaRoutes);
app.use('/routes', routesRoutes);
app.use('/feed', feedRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected error' });
});

app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});
