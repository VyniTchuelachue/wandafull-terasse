// Opening-hours helpers shared by the server (validation) and the client (open/closed badge,
// reservation time slots). All times are evaluated in the restaurant's timezone, not the visitor's.

export const TIMEZONE = 'Africa/Douala';

const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Current date (YYYY-MM-DD), weekday (0 = Sunday) and minutes since midnight in Douala. */
export function zonedNow(date = new Date(), timeZone = TIMEZONE) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    weekday: WEEKDAYS[get('weekday')],
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function fromMinutes(total) {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Weekday (0 = Sunday) of a YYYY-MM-DD string, independent of any timezone. */
export function weekdayOf(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Opening window for a weekday as minutes, or null when closed. A close of "00:00" means midnight. */
export function windowFor(hours, weekday) {
  const day = hours.find((h) => h.day === weekday);
  if (!day || day.closed) return null;
  const open = toMinutes(day.open);
  let close = toMinutes(day.close);
  if (close <= open) close += 24 * 60;
  return { open, close, day };
}

export function openStatus(hours, now = new Date()) {
  const { weekday, minutes } = zonedNow(now);
  const today = windowFor(hours, weekday);
  if (today && minutes >= today.open && minutes < today.close) {
    return { open: true, closesAt: today.day.close };
  }
  if (today && minutes < today.open) {
    return { open: false, opensAt: today.day.open, inDays: 0 };
  }
  for (let i = 1; i <= 7; i++) {
    const next = windowFor(hours, (weekday + i) % 7);
    if (next) return { open: false, opensAt: next.day.open, inDays: i, weekday: (weekday + i) % 7 };
  }
  return { open: false };
}

/**
 * Bookable arrival times for a date. The last table is seated `lastSeating` minutes before closing,
 * and same-day slots must be at least `leadTime` minutes in the future.
 */
export function reservationSlots(hours, isoDate, { step = 30, lastSeating = 60, leadTime = 30, now = new Date() } = {}) {
  const win = windowFor(hours, weekdayOf(isoDate));
  if (!win) return [];
  const current = zonedNow(now);
  const earliest = isoDate === current.date ? current.minutes + leadTime : -1;
  const slots = [];
  for (let t = win.open; t <= win.close - lastSeating; t += step) {
    if (t >= earliest) slots.push(fromMinutes(t));
  }
  return slots;
}
