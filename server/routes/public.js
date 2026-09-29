import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getMenu, getRestaurant } from '../lib/content.js';
import { createReservation } from '../lib/store.js';
import { validateReservation } from '../lib/validate.js';
import { openStatus } from '../../shared/hours.js';

export const publicRouter = Router();

publicRouter.get('/health', (req, res) => {
  res.json({ ok: true });
});

publicRouter.get('/restaurant', async (req, res) => {
  const restaurant = await getRestaurant();
  res.json({ ...restaurant, status: openStatus(restaurant.hours) });
});

publicRouter.get('/menu', async (req, res) => {
  res.json(await getMenu());
});

// Kept generous: mobile carriers in Cameroon put many customers behind one shared IP.
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'rate_limited' },
});

publicRouter.post('/reservations', bookingLimiter, async (req, res) => {
  // Hidden "website" field: humans never see it, spam bots fill it in.
  if (req.body?.website) {
    return res.status(201).json({ reservation: { id: 'WT-OK' } });
  }

  const restaurant = await getRestaurant();
  const { errors, value } = validateReservation(req.body, restaurant);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ error: 'validation', fields: errors });
  }

  const reservation = await createReservation(value);
  console.log(`[reservation] ${reservation.id} · ${value.date} ${value.time} · ${value.guests} pers. · ${value.name}`);
  res.status(201).json({ reservation });
});
