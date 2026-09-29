import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicRouter } from './routes/public.js';
import { adminRouter } from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
// In development (`npm run dev`) PORT belongs to the Vite dev server, so the API uses API_PORT.
const isDev = process.argv.includes('--dev');
const PORT = Number(isDev ? process.env.API_PORT : process.env.PORT) || 3001;

const app = express();

const trustProxy = process.env.TRUST_PROXY;
if (trustProxy) app.set('trust proxy', /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'img-src': ["'self'", 'data:', 'https://images.unsplash.com'],
        'frame-src': ['https://www.google.com'],
        // The host (Render, Railway, Nginx...) is expected to handle HTTPS; forcing the upgrade
        // here would break plain-http testing on a phone over the local network.
        'upgrade-insecure-requests': null,
      },
    },
  }),
);
app.use(compression());
app.use(express.json({ limit: '10kb' }));

app.use('/api', publicRouter);
app.use('/api/admin', adminRouter);
app.use('/api', (req, res) => res.status(404).json({ error: 'not_found' }));

// In production the built React app is served from the same server.
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  app.use(express.static(distDir, { index: false, maxAge: '1y', immutable: true, setHeaders: shortCacheOutsideAssets }));
  app.get('/{*splat}', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Hashed files in /assets never change; everything else (favicon, photos) may be replaced.
function shortCacheOutsideAssets(res, filePath) {
  if (!filePath.includes(`${path.sep}assets${path.sep}`)) res.set('Cache-Control', 'public, max-age=3600');
}

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'bad_json' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'too_large' });
  console.error(err);
  res.status(500).json({ error: 'server_error' });
});

app.listen(PORT, () => {
  console.log(`Wandafull Terasse API on http://localhost:${PORT}`);
  if (!process.env.ADMIN_TOKEN) console.log('ADMIN_TOKEN is not set: the /admin dashboard is disabled.');
});
