import { Router } from 'express';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { listReservations, updateReservationStatus } from '../lib/store.js';
import { STATUSES } from '../lib/validate.js';

export const adminRouter = Router();

function tokensMatch(given, expected) {
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

// Slows down anyone guessing the admin password.
adminRouter.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { error: 'rate_limited' },
  }),
);

adminRouter.use((req, res, next) => {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return res.status(503).json({ error: 'admin_disabled' });
  }
  const header = req.get('authorization') || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!given || !tokensMatch(given, expected)) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});

adminRouter.get('/reservations', async (req, res) => {
  const list = await listReservations();
  list.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  res.json({ reservations: list });
});

adminRouter.patch('/reservations/:id', async (req, res) => {
  const status = req.body?.status;
  if (!STATUSES.includes(status)) {
    return res.status(422).json({ error: 'validation', fields: { status: 'invalid' } });
  }
  const reservation = await updateReservationStatus(req.params.id, status);
  if (!reservation) return res.status(404).json({ error: 'not_found' });
  res.json({ reservation });
});
