// Restaurant info and menu live in server/data/*.json. They are re-read on every request,
// so editing a price or opening hour shows up on the site after a simple page refresh.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '../data');

async function readJson(name) {
  return JSON.parse(await fs.readFile(path.join(contentDir, name), 'utf8'));
}

export const getRestaurant = () => readJson('restaurant.json');
export const getMenu = () => readJson('menu.json');
