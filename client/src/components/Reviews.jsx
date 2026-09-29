import { ArrowUpRight, Check } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { useRestaurant } from '../lib/data.jsx';
import { Reveal, SectionHeading, Stars } from './ui.jsx';

export function Reviews() {
  const { t, locale } = useLang();
  const { data: restaurant } = useRestaurant();
  const rating = restaurant?.rating;
  const themes = t('reviews.themes');

  return (
    <section id="reviews" className="py-24 sm:py-32">
      <div className="container-page grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={t('reviews.eyebrow')} title={t('reviews.title')} />
          {rating && (
            <Reveal delay={100} className="mt-10 flex items-center gap-6">
              <span className="font-display text-8xl leading-none font-medium tracking-tighter text-jungle-900">
                {rating.value.toLocaleString(locale, { minimumFractionDigits: 1 })}
              </span>
              <div>
                <Stars value={rating.value} className="size-6" />
                <p className="mt-2 text-sm font-semibold text-ink-soft">
                  {t('reviews.count', { count: rating.count })} · {t('reviews.on')}
                </p>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={150} className="relative rounded-[2rem] bg-jungle-900 p-8 text-cream-50 sm:p-12 lg:col-span-7">
          <svg viewBox="0 0 48 48" className="absolute -top-6 right-10 size-16 text-ember-500" fill="currentColor" aria-hidden="true">
            <path d="M8 36V24C8 15 13 9 21 7l2 4c-5 2-7 6-7 11h7v14H8zm19 0V24c0-9 5-15 13-17l2 4c-5 2-7 6-7 11h7v14H27z" />
          </svg>
          <p className="max-w-md text-cream-100/75">{t('reviews.lead')}</p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {themes.map((theme) => (
              <li
                key={theme}
                className="inline-flex items-center gap-2 rounded-full border border-cream-100/15 bg-cream-50/5 px-4 py-2 text-sm font-semibold"
              >
                <Check className="size-4 text-leaf-400" />
                {theme}
              </li>
            ))}
          </ul>
          {restaurant && (
            <a
              href={restaurant.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-ember-400 underline-offset-4 hover:underline"
            >
              {t('reviews.cta')}
              <ArrowUpRight className="size-4" />
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
