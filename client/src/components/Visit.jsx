import { ArrowUpRight, Clock, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { useRestaurant } from '../lib/data.jsx';
import { dayName, directionsLink, whatsappLink } from '../lib/format.js';
import { zonedNow } from '../../../shared/hours.js';
import { OpenBadge, Reveal, SectionHeading } from './ui.jsx';

// Week starts on Monday, as it does in Cameroon.
const WEEK = [1, 2, 3, 4, 5, 6, 0];

// Searching by name makes Google pin the actual listing; `ll` keeps the map centred if the name is ambiguous.
function mapEmbedUrl({ name, address, geo }, lang) {
  const q = encodeURIComponent(`${name}, ${address.street}, ${address.city}`);
  return `https://www.google.com/maps?q=${q}&ll=${geo.lat},${geo.lng}&z=17&hl=${lang}&output=embed`;
}

export function Visit() {
  const { t, lang, locale } = useLang();
  const { data: restaurant } = useRestaurant();
  if (!restaurant) return <section id="visit" className="min-h-[40rem]" />;

  const { address, geo } = restaurant;
  const todayIdx = zonedNow().weekday;

  return (
    <section id="visit" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={t('visit.eyebrow')} title={t('visit.title')} />

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="space-y-6 lg:col-span-5">
            <div className="rounded-[2rem] bg-cream-100 p-7 sm:p-8">
              <h3 className="flex items-center gap-2 font-sans text-xs font-bold tracking-wider text-ink-soft uppercase">
                <MapPin className="size-4 text-ember-600" />
                {t('visit.address')}
              </h3>
              <p className="mt-3 font-display text-2xl leading-snug font-medium text-jungle-900">
                {address.street}, {address.district}
                <br />
                {address.city}, {address.country}
              </p>
              <p className="mt-1 text-sm text-ink-soft">Plus Code · {address.plusCode}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={directionsLink(geo)} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                  <Navigation className="size-4" />
                  {t('visit.directions')}
                </a>
                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn border border-cream-300 text-jungle-900 hover:bg-cream-200/60"
                >
                  {t('visit.openInMaps')}
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] bg-cream-100 p-7 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-sans text-xs font-bold tracking-wider text-ink-soft uppercase">
                  <Clock className="size-4 text-ember-600" />
                  {t('visit.hours')}
                </h3>
                <OpenBadge hours={restaurant.hours} className="bg-jungle-900 text-cream-50" />
              </div>
              <ul className="mt-4 divide-y divide-jungle-900/10">
                {WEEK.map((day) => {
                  const h = restaurant.hours.find((x) => x.day === day);
                  const isToday = day === todayIdx;
                  return (
                    <li
                      key={day}
                      className={`flex justify-between py-2.5 text-sm ${isToday ? 'font-bold text-jungle-900' : 'text-ink-soft'}`}
                    >
                      <span className="capitalize">
                        {dayName(day, locale)}
                        {isToday && (
                          <span className="ml-2 rounded-full bg-ember-500/15 px-2 py-0.5 text-[0.65rem] tracking-wider text-ember-600 uppercase">
                            {t('visit.today')}
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums">{h && !h.closed ? `${h.open} – ${h.close}` : t('visit.closed')}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${restaurant.phone}`}
                className="flex flex-col gap-3 rounded-[1.5rem] bg-jungle-900 p-5 text-cream-50 transition hover:bg-jungle-700"
              >
                <Phone className="size-5 text-ember-400" />
                <span className="text-sm font-bold">{restaurant.phoneDisplay}</span>
              </a>
              <a
                href={whatsappLink(restaurant.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-3 rounded-[1.5rem] bg-jungle-900 p-5 text-cream-50 transition hover:bg-jungle-700"
              >
                <MessageCircle className="size-5 text-leaf-400" />
                <span className="text-sm font-bold">WhatsApp</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={120} className="overflow-hidden rounded-[2rem] bg-cream-200 lg:col-span-7">
            <iframe
              title={t('visit.mapTitle')}
              src={mapEmbedUrl(restaurant, lang)}
              className="h-[26rem] w-full border-0 lg:h-full lg:min-h-[36rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
