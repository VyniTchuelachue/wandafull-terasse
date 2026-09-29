import { addDays, reservationSlots, zonedNow } from '../../shared/hours.js';

export const AREAS = ['any', 'terrace', 'indoor'];
export const OCCASIONS = ['none', 'birthday', 'afterwork', 'business', 'date', 'other'];
export const STATUSES = ['pending', 'confirmed', 'cancelled'];
export const MAX_GUESTS = 40;
export const BOOKING_WINDOW_DAYS = 180;

const text = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * Returns { errors, value }. Error values are short codes the client translates,
 * so the API stays language-neutral.
 */
export function validateReservation(body, restaurant, now = new Date()) {
  const errors = {};
  const src = body && typeof body === 'object' ? body : {};

  const name = text(src.name);
  if (name.length < 2 || name.length > 80) errors.name = 'invalid';

  const phone = text(src.phone);
  const digits = phone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 8 || digits.length > 15) errors.phone = 'invalid';

  const email = text(src.email);
  if (email && (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) errors.email = 'invalid';

  const date = text(src.date);
  const today = zonedNow(now).date;
  // Round-tripping through addDays rejects impossible dates such as 2026-02-31.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || addDays(date, 0) !== date) errors.date = 'invalid';
  else if (date < today) errors.date = 'past';
  else if (date > addDays(today, BOOKING_WINDOW_DAYS)) errors.date = 'too_far';

  const time = text(src.time);
  if (!errors.date) {
    const slots = reservationSlots(restaurant.hours, date, { now });
    if (slots.length === 0) errors.date = 'closed';
    else if (!slots.includes(time)) errors.time = 'unavailable';
  }

  const guests = Number(src.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) errors.guests = 'invalid';

  const area = AREAS.includes(src.area) ? src.area : 'any';
  const occasion = OCCASIONS.includes(src.occasion) ? src.occasion : 'none';

  const notes = text(src.notes);
  if (notes.length > 500) errors.notes = 'too_long';

  return {
    errors,
    value: { name, phone, email, date, time, guests, area, occasion, notes },
  };
}
