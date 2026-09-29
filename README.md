# Wandafull Terasse · Website

Website for **Wandafull Terasse**, a terrace restaurant on Rue Njo-Njo, Bonapriso, Douala.

- **Frontend:** React 19, Vite, Tailwind CSS v4. Bilingual French/English (French by default, English for visitors whose browser is set to English, with a toggle).
- **Backend:** Node.js with Express 5. It serves the restaurant info, the menu and online reservations, plus a small admin dashboard for managing them.

## Quick start

Requires Node.js 22.9 or newer.

```bash
npm install
cp .env.example .env      # then set ADMIN_TOKEN
npm run dev
```

- Website: http://localhost:5173
- API: http://localhost:3001/api/restaurant
- Reservations dashboard: http://localhost:5173/admin (the password is `ADMIN_TOKEN` from `.env`)

## Production

```bash
npm run build   # builds the React app into dist/
npm start       # one Node server for both the website and the API (port from PORT, default 3001)
```

### Deploying (Render, Railway, a VPS, etc.)

| Setting | Value |
| --- | --- |
| Build command | `npm install --include=dev && npm run build` |
| Start command | `npm start` |
| Environment variables | `ADMIN_TOKEN` (long random string), `TRUST_PROXY=1`; add `DATA_DIR` if you use a persistent disk |

Reservations are saved to `reservations.json` in `DATA_DIR` (default: `server/storage/`). On hosts with a temporary filesystem, such as Render's free tier, attach a persistent disk and point `DATA_DIR` at it. Otherwise reservations are lost on every redeploy.

## Editing the content (no coding needed)

| What | File |
| --- | --- |
| Address, phone, WhatsApp, opening hours, rating, social links | `server/data/restaurant.json` |
| Menu: categories, dishes, prices, descriptions (FR + EN) | `server/data/menu.json` |
| Photos | `client/src/lib/images.js` |
| Website text (FR + EN) | `client/src/i18n.jsx` |

Changes to the two JSON files show up after a page refresh; no rebuild is needed.

Menu items look like this. `tags` is optional and can be `"signature"` or `"popular"`:

```json
{
  "name": { "fr": "Porc braisé", "en": "Braised grilled pork" },
  "description": { "fr": "…", "en": "…" },
  "price": 6500,
  "tags": ["signature"]
}
```

To use your own photos, put them in `client/public/images/` and replace the matching URL in `client/src/lib/images.js` with its path, e.g. `'/images/terrasse.jpg'`.

## How reservations work

1. A guest fills in the form. The server checks the date and time against the opening hours, in Douala time.
2. The booking is saved as **pending** and the guest gets a reference such as `WT-7KQ2MX`. They can also forward the booking to the restaurant on WhatsApp in one tap.
3. In `/admin`, staff can **confirm** or **cancel** each booking and send the guest a pre-written WhatsApp confirmation.

Anti-spam: a hidden field catches bots, and each IP address has a request limit.

## API

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/restaurant` | Restaurant info and live open/closed status |
| GET | `/api/menu` | Menu |
| POST | `/api/reservations` | Create a reservation |
| GET | `/api/admin/reservations` | List reservations (`Authorization: Bearer <ADMIN_TOKEN>`) |
| PATCH | `/api/admin/reservations/:id` | `{ "status": "pending" \| "confirmed" \| "cancelled" }` |

## Project structure

```
client/            React app (Vite root)
  src/components/  Page sections (Hero, Menu, Reservation…)
  src/pages/       Admin dashboard
  src/lib/         API client, formatting, images
  src/i18n.jsx     French and English text
server/            Express API
  data/            restaurant.json, menu.json  ← edit these
  storage/         reservations.json (created automatically, git-ignored)
shared/hours.js    Opening-hours logic used by both client and server
```
