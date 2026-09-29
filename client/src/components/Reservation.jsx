import { useMemo, useRef, useState } from 'react';
import { Check, Clock, LoaderCircle, MessageCircle, Phone } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { useRestaurant } from '../lib/data.jsx';
import { api, ApiError } from '../lib/api.js';
import { formatDate, whatsappLink } from '../lib/format.js';
import { addDays, reservationSlots, zonedNow } from '../../../shared/hours.js';
import { Reveal, SectionHeading, sameHoursEveryDay } from './ui.jsx';

const GUEST_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
const AREAS = ['any', 'terrace', 'indoor'];
const OCCASIONS = ['none', 'birthday', 'afterwork', 'business', 'date', 'other'];
const FIELD_ORDER = ['name', 'phone', 'date', 'time', 'guests', 'email', 'notes'];

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink-soft/45 focus:ring-4 ${
    hasError ? 'border-red-600 focus:ring-red-600/15' : 'border-cream-300 focus:border-jungle-500 focus:ring-jungle-500/15'
  }`;

function Field({ label, error, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-bold tracking-wider text-ink-soft uppercase">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && (
        <span role="alert" className="mt-1.5 block text-xs font-semibold text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}

function initialForm(hours) {
  const today = zonedNow().date;
  const date = reservationSlots(hours, today).length > 0 ? today : addDays(today, 1);
  return { name: '', phone: '', email: '', date, time: '', guests: 2, area: 'any', occasion: 'none', notes: '', website: '' };
}

function BookingForm({ restaurant }) {
  const { t, locale } = useLang();
  const [form, setForm] = useState(() => initialForm(restaurant.hours));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const formRef = useRef(null);

  const today = zonedNow().date;
  const slots = useMemo(() => reservationSlots(restaurant.hours, form.date), [restaurant.hours, form.date]);

  const set = (field) => (e) => {
    const value = field === 'guests' ? Number(e.target.value) : e.target.value;
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === 'date' && !reservationSlots(restaurant.hours, value).includes(f.time)) next.time = '';
      return next;
    });
    setErrors((errs) => ({ ...errs, [field]: undefined, ...(field === 'date' ? { time: undefined } : {}) }));
  };

  const errorText = (field) => errors[field] && t(`booking.errors.${errors[field]}`);

  const focusFirstError = (fields) => {
    const first = FIELD_ORDER.find((f) => fields[f]);
    if (first) formRef.current?.elements.namedItem(first)?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const missing = {};
    if (form.name.trim().length < 2) missing.name = 'required';
    if (!form.phone.trim()) missing.phone = 'required';
    if (!form.date) missing.date = 'required';
    if (!form.time) missing.time = 'required';
    if (Object.keys(missing).length > 0) {
      setErrors(missing);
      focusFirstError(missing);
      return;
    }

    setSending(true);
    try {
      const { reservation } = await api('/reservations', { method: 'POST', body: form });
      setConfirmed({ ...form, id: reservation.id });
    } catch (err) {
      if (err instanceof ApiError && err.status === 422 && err.body?.fields) {
        setErrors(err.body.fields);
        focusFirstError(err.body.fields);
      } else if (err instanceof ApiError) {
        setFormError(err.status === 429 ? 'rate_limited' : 'generic');
      } else {
        setFormError('network');
      }
    } finally {
      setSending(false);
    }
  };

  if (confirmed) {
    const vars = {
      name: confirmed.name.split(' ')[0],
      guests: confirmed.guests,
      date: formatDate(confirmed.date, locale),
      time: confirmed.time,
      id: confirmed.id,
    };
    return (
      <div className="animate-fade-in text-center" aria-live="polite">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-leaf-200 text-jungle-700">
          <Check className="size-8" />
        </span>
        <h3 className="mt-6 text-3xl font-medium text-jungle-900">{t('booking.success.title', vars)}</h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">{t('booking.success.body', vars)}</p>
        <p className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full bg-cream-100 px-5 py-2.5 text-sm">
          <span className="font-semibold text-ink-soft">{t('booking.success.reference')}</span>
          <span className="font-mono font-bold tracking-wider text-jungle-900">{confirmed.id}</span>
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappLink(restaurant.whatsapp, t('booking.success.message', { ...vars, name: confirmed.name }))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
          >
            <MessageCircle className="size-4" />
            {t('booking.success.whatsapp')}
          </a>
          <button
            type="button"
            className="btn border border-cream-300 text-jungle-900 hover:bg-cream-100"
            onClick={() => {
              setConfirmed(null);
              setForm(initialForm(restaurant.hours));
            }}
          >
            {t('booking.success.another')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label={t('booking.fields.name')} error={errorText('name')}>
        <input
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={set('name')}
          placeholder={t('booking.placeholders.name')}
          maxLength={80}
          aria-invalid={!!errors.name}
          className={inputClass(errors.name)}
        />
      </Field>
      <Field label={t('booking.fields.phone')} error={errorText('phone')}>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={form.phone}
          onChange={set('phone')}
          placeholder={t('booking.placeholders.phone')}
          maxLength={24}
          aria-invalid={!!errors.phone}
          className={inputClass(errors.phone)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-5 sm:col-span-2 sm:grid-cols-[1.4fr_1fr_1fr]">
        <Field label={t('booking.fields.date')} error={errorText('date')} className="col-span-2 sm:col-span-1">
          <input
            name="date"
            type="date"
            value={form.date}
            min={today}
            max={addDays(today, 180)}
            onChange={set('date')}
            aria-invalid={!!errors.date}
            className={inputClass(errors.date)}
          />
        </Field>
        <Field label={t('booking.fields.time')} error={errorText('time') || (slots.length === 0 ? t('booking.noSlots') : null)}>
          <select
            name="time"
            value={form.time}
            onChange={set('time')}
            disabled={slots.length === 0}
            aria-invalid={!!errors.time}
            className={inputClass(errors.time)}
          >
            <option value="">{t('booking.placeholders.time')}</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('booking.fields.guests')} error={errorText('guests')}>
          <select name="guests" value={form.guests} onChange={set('guests')} className={inputClass(errors.guests)}>
            {GUEST_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="text-xs font-bold tracking-wider text-ink-soft uppercase">{t('booking.fields.area')}</legend>
        <div className="mt-2 grid grid-cols-3 gap-2 rounded-xl bg-cream-100 p-1">
          {AREAS.map((area) => (
            <label
              key={area}
              className={`cursor-pointer rounded-lg px-2 py-2.5 text-center text-sm font-bold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember-500 ${
                form.area === area ? 'bg-white text-jungle-900 shadow-sm' : 'text-ink-soft hover:text-jungle-900'
              }`}
            >
              <input type="radio" name="area" value={area} checked={form.area === area} onChange={set('area')} className="sr-only" />
              {t(`booking.areas.${area}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label={t('booking.fields.occasion')}>
        <select name="occasion" value={form.occasion} onChange={set('occasion')} className={inputClass(false)}>
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {t(`booking.occasions.${o}`)}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t('booking.fields.email')} error={errorText('email')}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set('email')}
          placeholder={t('booking.placeholders.email')}
          maxLength={120}
          aria-invalid={!!errors.email}
          className={inputClass(errors.email)}
        />
      </Field>

      <Field label={t('booking.fields.notes')} error={errorText('notes')} className="sm:col-span-2">
        <textarea
          name="notes"
          rows={3}
          value={form.notes}
          onChange={set('notes')}
          placeholder={t('booking.placeholders.notes')}
          maxLength={500}
          className={`${inputClass(errors.notes)} resize-none`}
        />
      </Field>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
      </div>

      <div className="sm:col-span-2">
        {formError && (
          <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {t(`booking.errors.${formError}`)}
          </p>
        )}
        <button type="submit" disabled={sending} className="btn btn-primary w-full py-4! text-base">
          {sending && <LoaderCircle className="size-4 animate-spin" />}
          {sending ? t('booking.sending') : t('booking.submit')}
        </button>
      </div>
    </form>
  );
}

export function Reservation() {
  const { t } = useLang();
  const { data: restaurant } = useRestaurant();
  const everyday = sameHoursEveryDay(restaurant?.hours);

  return (
    <section id="booking" className="grain relative overflow-hidden bg-jungle-900 py-24 sm:py-32">
      <div className="container-page relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading tone="light" eyebrow={t('booking.eyebrow')} title={t('booking.title')} lead={t('booking.lead')} />

          {restaurant && (
            <Reveal delay={120} className="mt-10 space-y-3">
              <p className="text-sm font-semibold text-cream-100/60">{t('booking.orCall')}</p>
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-4 rounded-2xl border border-cream-100/15 p-4 text-cream-50 transition hover:border-ember-400/60 hover:bg-cream-50/5"
              >
                <span className="grid size-12 place-items-center rounded-full bg-ember-500 text-jungle-950">
                  <Phone className="size-5" />
                </span>
                <span className="font-display text-2xl font-medium tracking-tight">{restaurant.phoneDisplay}</span>
              </a>
              {everyday && (
                <p className="flex items-center gap-2 px-1 text-sm text-cream-100/70">
                  <Clock className="size-4 text-ember-400" />
                  {t('hero.everyday')} · {everyday.open} – {everyday.close}
                </p>
              )}
            </Reveal>
          )}
        </div>

        <Reveal delay={150} className="relative rounded-[2rem] bg-cream-50 p-6 shadow-2xl shadow-black/30 sm:p-10 lg:col-span-7">
          {restaurant ? (
            <BookingForm restaurant={restaurant} />
          ) : (
            <div className="h-96 animate-pulse rounded-2xl bg-cream-100" aria-hidden="true" />
          )}
        </Reveal>
      </div>
    </section>
  );
}
