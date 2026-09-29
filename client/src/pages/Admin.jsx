import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, LoaderCircle, LogOut, MessageCircle, Phone, RefreshCw, X } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { api, ApiError } from '../lib/api.js';
import { formatDate, whatsappLink } from '../lib/format.js';
import { zonedNow } from '../../../shared/hours.js';
import { Logo } from '../components/ui.jsx';

const TOKEN_KEY = 'wt-admin-token';

const text = {
  fr: {
    title: 'Réservations',
    password: 'Mot de passe administrateur',
    login: 'Se connecter',
    wrong: 'Mot de passe incorrect.',
    disabled: "Le tableau de bord est désactivé : définissez ADMIN_TOKEN dans le fichier .env du serveur, puis redémarrez-le.",
    error: 'Impossible de charger les réservations.',
    upcoming: 'À venir',
    all: 'Toutes',
    empty: 'Aucune réservation pour le moment.',
    refresh: 'Actualiser',
    logout: 'Déconnexion',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    reopen: 'Remettre en attente',
    notify: 'Prévenir sur WhatsApp',
    guests: 'pers.',
    status: { pending: 'En attente', confirmed: 'Confirmée', cancelled: 'Annulée' },
    area: { any: '', terrace: 'Terrasse', indoor: 'Intérieur' },
    occasion: { none: '', birthday: 'Anniversaire', afterwork: 'Afterwork', business: 'Affaires', date: 'En amoureux', other: 'Autre occasion' },
    confirmMessage: 'Bonjour {name}, votre réservation chez Wandafull Terasse le {date} à {time} pour {guests} personne(s) est confirmée. À très vite !',
    back: '← Retour au site',
  },
  en: {
    title: 'Reservations',
    password: 'Admin password',
    login: 'Sign in',
    wrong: 'Wrong password.',
    disabled: 'The dashboard is disabled: set ADMIN_TOKEN in the server .env file, then restart it.',
    error: 'Could not load reservations.',
    upcoming: 'Upcoming',
    all: 'All',
    empty: 'No reservations yet.',
    refresh: 'Refresh',
    logout: 'Sign out',
    confirm: 'Confirm',
    cancel: 'Cancel',
    reopen: 'Mark as pending',
    notify: 'Notify on WhatsApp',
    guests: 'guests',
    status: { pending: 'Pending', confirmed: 'Confirmed', cancelled: 'Cancelled' },
    area: { any: '', terrace: 'Terrace', indoor: 'Indoors' },
    occasion: { none: '', birthday: 'Birthday', afterwork: 'After-work', business: 'Business', date: 'Date night', other: 'Other occasion' },
    confirmMessage: 'Hello {name}, your table at Wandafull Terasse on {date} at {time} for {guests} is confirmed. See you soon!',
    back: '← Back to the website',
  },
};

const STATUS_STYLES = {
  pending: 'bg-ember-500/15 text-ember-600',
  confirmed: 'bg-leaf-200 text-jungle-700',
  cancelled: 'bg-red-100 text-red-700',
};

// Guests usually type local Cameroonian numbers (6XX XX XX XX); WhatsApp needs the 237 prefix.
function toWhatsappNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 9 ? `237${digits}` : digits;
}

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function saveToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Without storage the admin simply has to sign in again after a reload.
  }
}

export default function Admin() {
  const { lang, locale, toggle } = useLang();
  const s = text[lang];
  const [token, setToken] = useState(readToken);
  const [password, setPassword] = useState('');
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('upcoming');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async (tok) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api('/admin/reservations', { token: tok });
      setReservations(data.reservations);
      setToken(tok);
      saveToken(tok);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('wrong');
        setToken('');
        saveToken('');
      } else if (err instanceof ApiError && err.status === 503) {
        setError('disabled');
      } else {
        setError('error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Admin · Wandafull Terasse';
    if (token) load(token);
    // Only on first mount: later loads are triggered by the user.
  }, []);

  const setStatus = async (id, status) => {
    setBusyId(id);
    try {
      const { reservation } = await api(`/admin/reservations/${id}`, { method: 'PATCH', body: { status }, token });
      setReservations((list) => list.map((r) => (r.id === id ? reservation : r)));
    } catch {
      setError('error');
    } finally {
      setBusyId(null);
    }
  };

  const today = zonedNow().date;
  const groups = useMemo(() => {
    const list = (reservations ?? []).filter((r) => filter === 'all' || r.date >= today);
    const byDate = new Map();
    for (const r of list) {
      if (!byDate.has(r.date)) byDate.set(r.date, []);
      byDate.get(r.date).push(r);
    }
    return [...byDate.entries()];
  }, [reservations, filter, today]);

  const langButton = (
    <button type="button" onClick={toggle} className="text-xs font-bold tracking-wider text-cream-100/70 uppercase hover:text-cream-50">
      {lang === 'fr' ? 'EN' : 'FR'}
    </button>
  );

  if (!reservations) {
    return (
      <main className="grid min-h-screen place-items-center bg-jungle-900 px-5">
        <form
          className="w-full max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (password) load(password);
          }}
        >
          <div className="flex items-center justify-between">
            <Logo />
            {langButton}
          </div>
          <div className="mt-8 rounded-3xl bg-cream-50 p-7">
            <h1 className="text-2xl font-medium text-jungle-900">{s.title}</h1>
            <label className="mt-5 block">
              <span className="text-xs font-bold tracking-wider text-ink-soft uppercase">{s.password}</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-cream-300 bg-white px-4 py-3 outline-none focus:border-jungle-500 focus:ring-4 focus:ring-jungle-500/15"
                autoFocus
              />
            </label>
            {error && <p className="mt-3 text-sm font-semibold text-red-700">{s[error]}</p>}
            <button type="submit" disabled={loading} className="btn btn-dark mt-5 w-full">
              {loading && <LoaderCircle className="size-4 animate-spin" />}
              {s.login}
            </button>
          </div>
          <a href="/" className="mt-6 block text-center text-sm text-cream-100/60 hover:text-cream-50">
            {s.back}
          </a>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="bg-jungle-900">
        <div className="container-page flex h-16 items-center justify-between">
          <a href="/">
            <Logo />
          </a>
          <div className="flex items-center gap-4">
            {langButton}
            <button
              type="button"
              onClick={() => {
                saveToken('');
                setToken('');
                setReservations(null);
                setPassword('');
              }}
              className="flex items-center gap-2 text-sm font-semibold text-cream-100/80 hover:text-cream-50"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{s.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container-page py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-medium text-jungle-900">{s.title}</h1>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-cream-50 p-1 shadow-sm">
              {['upcoming', 'all'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${filter === f ? 'bg-jungle-900 text-cream-50' : 'text-ink-soft'}`}
                >
                  {s[f]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => load(token)}
              aria-label={s.refresh}
              title={s.refresh}
              className="grid size-10 place-items-center rounded-full bg-cream-50 text-jungle-900 shadow-sm"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{s[error]}</p>}

        {groups.length === 0 && <p className="mt-16 text-center text-ink-soft">{s.empty}</p>}

        <div className="mt-8 space-y-10">
          {groups.map(([date, list]) => (
            <section key={date}>
              <h2 className="font-sans text-sm font-bold tracking-wider text-ink-soft uppercase first-letter:uppercase">
                {formatDate(date, locale)}
              </h2>
              <ul className="mt-3 space-y-3">
                {list.map((r) => (
                  <li key={r.id} className={`rounded-2xl bg-cream-50 p-5 shadow-sm ${r.status === 'cancelled' ? 'opacity-60' : ''}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <span className="font-display text-2xl font-semibold text-jungle-900 tabular-nums">{r.time}</span>
                        <div>
                          <p className="font-bold text-jungle-900">
                            {r.name} · {r.guests} {s.guests}
                          </p>
                          <p className="mt-0.5 text-sm text-ink-soft">
                            {[s.area[r.area], s.occasion[r.occasion], r.id].filter(Boolean).join(' · ')}
                          </p>
                          {r.notes && <p className="mt-2 max-w-lg text-sm text-ink">“{r.notes}”</p>}
                          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 font-semibold text-jungle-700 hover:underline">
                              <Phone className="size-3.5" />
                              {r.phone}
                            </a>
                            {r.email && (
                              <a href={`mailto:${r.email}`} className="text-jungle-700 hover:underline">
                                {r.email}
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[r.status]}`}>{s.status[r.status]}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-jungle-900/10 pt-4">
                      {r.status !== 'confirmed' && (
                        <button
                          type="button"
                          disabled={busyId === r.id}
                          onClick={() => setStatus(r.id, 'confirmed')}
                          className="btn btn-dark px-4! py-2! text-xs"
                        >
                          <Check className="size-3.5" />
                          {s.confirm}
                        </button>
                      )}
                      {r.status === 'confirmed' && (
                        <a
                          href={whatsappLink(
                            toWhatsappNumber(r.phone),
                            s.confirmMessage
                              .replace('{name}', r.name.split(' ')[0])
                              .replace('{date}', formatDate(r.date, locale))
                              .replace('{time}', r.time)
                              .replace('{guests}', r.guests),
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-dark px-4! py-2! text-xs"
                        >
                          <MessageCircle className="size-3.5" />
                          {s.notify}
                        </a>
                      )}
                      {r.status !== 'cancelled' && (
                        <button
                          type="button"
                          disabled={busyId === r.id}
                          onClick={() => setStatus(r.id, 'cancelled')}
                          className="btn border border-cream-300 px-4! py-2! text-xs text-red-700 hover:bg-red-50"
                        >
                          <X className="size-3.5" />
                          {s.cancel}
                        </button>
                      )}
                      {r.status !== 'pending' && (
                        <button
                          type="button"
                          disabled={busyId === r.id}
                          onClick={() => setStatus(r.id, 'pending')}
                          className="btn px-4! py-2! text-xs text-ink-soft hover:bg-cream-100"
                        >
                          {s.reopen}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
