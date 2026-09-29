import { useRef, useState } from 'react';
import { Phone, RefreshCw, ShoppingBag } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { useMenu, useRestaurant } from '../lib/data.jsx';
import { formatPrice } from '../lib/format.js';
import { images } from '../lib/images.js';
import { Reveal, SectionHeading } from './ui.jsx';

function MenuSkeleton() {
  return (
    <div className="mt-14 grid animate-pulse gap-10 lg:grid-cols-12" aria-hidden="true">
      <div className="aspect-[4/3] rounded-[2rem] bg-cream-200 lg:col-span-5" />
      <div className="space-y-6 lg:col-span-7">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-5 w-2/3 rounded bg-cream-200" />
            <div className="h-3 w-1/2 rounded bg-cream-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MenuSection() {
  const { t, lang, locale } = useLang();
  const { data: restaurant } = useRestaurant();
  const { data: menu, error, loading, reload } = useMenu();
  const [activeId, setActiveId] = useState(null);
  const tabRefs = useRef([]);

  const categories = menu?.categories ?? [];
  const activeIndex = Math.max(0, categories.findIndex((c) => c.id === activeId));
  const current = categories[activeIndex];

  const onTabKey = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (activeIndex + step + categories.length) % categories.length;
    setActiveId(categories[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="menu" className="bg-cream-100 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading align="center" eyebrow={t('menu.eyebrow')} title={t('menu.title')} lead={t('menu.lead')} />

        {loading && <MenuSkeleton />}

        {error && (
          <div className="mx-auto mt-14 max-w-md rounded-3xl bg-cream-50 p-8 text-center">
            <p className="text-ink-soft">{t('menu.error')}</p>
            <button type="button" onClick={reload} className="btn btn-dark mt-5">
              <RefreshCw className="size-4" />
              {t('menu.retry')}
            </button>
          </div>
        )}

        {current && (
          <>
            <Reveal className="-mx-5 mt-12 overflow-x-auto px-5 sm:mx-0 sm:px-0 no-scrollbar">
              <div role="tablist" aria-label={t('menu.eyebrow')} className="mx-auto flex w-max gap-2 rounded-full bg-cream-50 p-1.5 shadow-sm">
                {categories.map((cat, i) => {
                  const selected = cat.id === current.id;
                  return (
                    <button
                      key={cat.id}
                      ref={(el) => (tabRefs.current[i] = el)}
                      type="button"
                      role="tab"
                      id={`tab-${cat.id}`}
                      aria-selected={selected}
                      aria-controls="menu-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActiveId(cat.id)}
                      onKeyDown={onTabKey}
                      className={`rounded-full px-4 py-2.5 text-sm font-bold whitespace-nowrap transition sm:px-5 ${
                        selected ? 'bg-jungle-900 text-cream-50 shadow' : 'text-ink-soft hover:bg-cream-200/70 hover:text-jungle-900'
                      }`}
                    >
                      {cat.name[lang]}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <div
              key={current.id}
              id="menu-panel"
              role="tabpanel"
              aria-labelledby={`tab-${current.id}`}
              className="mt-12 grid animate-fade-in gap-10 lg:grid-cols-12 lg:gap-14"
            >
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-[2rem] lg:sticky lg:top-28">
                  <img
                    src={images.menu[current.id] ?? images.heroMain}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/85 via-jungle-950/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-cream-50">
                    <h3 className="text-3xl font-medium">{current.name[lang]}</h3>
                    {current.description && <p className="mt-2 text-sm leading-relaxed text-cream-100/80">{current.description[lang]}</p>}
                  </div>
                </div>
              </div>

              <ul className="divide-y divide-jungle-900/10 lg:col-span-7">
                {current.items.map((item) => (
                  <li key={item.name.fr} className="py-5 first:pt-0">
                    <div className="flex items-baseline gap-3">
                      <h4 className="font-display text-xl font-medium text-jungle-900">{item.name[lang]}</h4>
                      <span className="leader text-jungle-900" aria-hidden="true" />
                      <span className="font-display text-lg font-semibold whitespace-nowrap text-jungle-900 tabular-nums">
                        {formatPrice(item.price, locale)}
                        <span className="ml-1 text-xs font-sans font-bold text-ink-soft">{menu.currency}</span>
                      </span>
                    </div>
                    {(item.description || item.tags) && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {item.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-ember-500/15 px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-ember-600 uppercase"
                          >
                            {t(`menu.tags.${tag}`)}
                          </span>
                        ))}
                        {item.description && <p className="max-w-md text-sm leading-relaxed text-ink-soft">{item.description[lang]}</p>}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <Reveal className="mt-14 flex flex-col items-center gap-4 rounded-[2rem] bg-cream-50 p-6 text-center sm:flex-row sm:justify-between sm:p-8 sm:text-left">
              <div className="flex items-center gap-4">
                <span className="hidden size-12 shrink-0 place-items-center rounded-full bg-leaf-200 text-jungle-700 sm:grid">
                  <ShoppingBag className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-jungle-900">{t('menu.takeaway')}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{t('menu.note')}</p>
                </div>
              </div>
              {restaurant && (
                <a href={`tel:${restaurant.phone}`} className="btn btn-dark shrink-0">
                  <Phone className="size-4" />
                  {restaurant.phoneDisplay}
                </a>
              )}
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
