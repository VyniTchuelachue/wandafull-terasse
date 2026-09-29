import { ArrowRight, Clock, Flame, MapPin } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { useRestaurant } from '../lib/data.jsx';
import { images } from '../lib/images.js';
import { Leaf, OpenBadge, Stars, sameHoursEveryDay } from './ui.jsx';

export function Hero() {
  const { t, locale } = useLang();
  const { data: restaurant } = useRestaurant();
  const everyday = sameHoursEveryDay(restaurant?.hours);
  const rating = restaurant?.rating;

  return (
    <section id="top" className="grain relative overflow-hidden bg-jungle-900 pt-28 pb-20 text-cream-50 sm:pt-32 lg:pt-36 lg:pb-28">
      <Leaf className="pointer-events-none absolute -top-10 -left-16 h-80 w-56 -rotate-[28deg] text-jungle-800 [--leaf-vein:rgba(8,23,15,.35)]" />
      <Leaf className="pointer-events-none absolute -right-10 bottom-0 hidden h-96 w-64 rotate-[24deg] text-jungle-800/70 [--leaf-vein:rgba(8,23,15,.35)] lg:block" />
      <div
        className="pointer-events-none absolute top-1/3 right-1/4 size-[36rem] rounded-full bg-ember-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow text-ember-400">{t('hero.eyebrow')}</p>
            <OpenBadge hours={restaurant?.hours} className="bg-cream-50/10 text-cream-100" />
          </div>

          <h1 className="mt-6 text-[2.9rem] leading-[0.98] font-medium tracking-tight sm:text-7xl lg:text-[5.3rem]">
            {t('hero.titleA')}{' '}
            <span className="relative inline-block font-normal text-ember-400 italic">
              {t('hero.titleAccent')}
              <svg
                viewBox="0 0 300 20"
                className="absolute -bottom-2 left-0 h-3 w-full text-ember-500/70"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M3 14C60 4 140 2 297 10" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
              </svg>
            </span>{' '}
            {t('hero.titleB')}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream-100/80">{t('hero.lead')}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#booking" className="btn btn-primary py-4! text-base">
              {t('hero.book')}
              <ArrowRight className="size-4" />
            </a>
            <a href="#menu" className="btn btn-ghost-light py-4! text-base">
              {t('hero.menu')}
            </a>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-1 gap-5 border-t border-cream-100/15 pt-8 text-sm sm:grid-cols-3">
            {rating && (
              <div>
                <dt className="flex items-center gap-2">
                  <span className="font-display text-2xl font-semibold">{rating.value.toLocaleString(locale)}</span>
                  <Stars value={rating.value} className="size-3.5" />
                </dt>
                <dd className="mt-1 text-cream-100/60">{t('hero.rating', { count: rating.count })}</dd>
              </div>
            )}
            {everyday && (
              <div>
                <dt className="flex items-center gap-2 font-semibold">
                  <Clock className="size-4 text-ember-400" />
                  {everyday.open} – {everyday.close}
                </dt>
                <dd className="mt-1 text-cream-100/60">{t('hero.everyday')}</dd>
              </div>
            )}
            <div>
              <dt className="flex items-center gap-2 font-semibold">
                <MapPin className="size-4 text-ember-400" />
                Douala
              </dt>
              <dd className="mt-1 text-cream-100/60">{t('hero.where')}</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-cream-100/10 shadow-2xl shadow-black/40">
            <img
              src={images.heroMain}
              alt=""
              className="size-full object-cover"
              fetchPriority="high"
              width="1100"
              height="1400"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/50 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-8 -left-4 w-[42%] overflow-hidden rounded-3xl border-4 border-jungle-900 shadow-xl sm:-left-10">
            <img src={images.heroSide} alt="" className="aspect-[4/5] w-full object-cover" width="600" height="750" />
          </div>

          <div className="absolute top-10 -right-2 flex max-w-[11rem] animate-float items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3 text-jungle-900 shadow-xl sm:-right-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ember-500 text-jungle-950">
              <Flame className="size-5" />
            </span>
            <span className="text-xs leading-snug font-bold">{t('hero.badge')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
