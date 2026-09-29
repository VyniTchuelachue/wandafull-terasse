// Tiny JSON-file store for reservations. Good for a single restaurant server;
// swap for a real database (SQLite, Postgres...) if you ever run several instances.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(process.env.DATA_DIR || path.join(__dirname, '../storage'));
const file = path.join(dataDir, 'reservations.json');

// Every write goes through this chain so two requests can never interleave read-modify-write.
let queue = Promise.resolve();

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAll(list) {
  await fs.mkdir(dataDir, { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2));
  try {
    await fs.rename(tmp, file);
  } catch (err) {
    // Windows can refuse to replace a file another process (antivirus, editor) has open.
    if (err.code !== 'EPERM' && err.code !== 'EBUSY') throw err;
    await fs.writeFile(file, JSON.stringify(list, null, 2));
    await fs.rm(tmp, { force: true });
  }
}

function mutate(fn) {
  const run = queue.then(async () => {
    const list = await readAll();
    const result = await fn(list);
    await writeAll(list);
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

// Short, unambiguous reference guests can read over the phone (no 0/O, 1/I).
function newReference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(6);
  return 'WT-' + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

export function listReservations() {
  return queue.then(readAll);
}

export function createReservation(data) {
  return mutate((list) => {
    const reservation = {
      id: newReference(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    list.push(reservation);
    return reservation;
  });
}

export function updateReservationStatus(id, status) {
  return mutate((list) => {
    const reservation = list.find((r) => r.id === id);
    if (!reservation) return null;
    reservation.status = status;
    reservation.updatedAt = new Date().toISOString();
    return reservation;
  });
}
