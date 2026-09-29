import { Flame, Leaf as LeafIcon, Martini, Users } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { useRestaurant } from '../lib/data.jsx';
import { formatPrice } from '../lib/format.js';
import { images } from '../lib/images.js';
import { Reveal, SectionHeading } from './ui.jsx';

const ICONS = [LeafIcon, Flame, Martini, Users];

export function Experience() {
  const { t, locale } = useLang();
  const { data: restaurant } = useRestaurant();
  const features = t('experience.features');
  const price = restaurant?.priceRange;

  return (
    <section id="experience" className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-page grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="grid grid-cols-5 gap-4">
            <img
              src={images.experienceMain}
              alt=""
              loading="lazy"
              className="col-span-3 aspect-[3/4] w-full rounded-[2rem] object-cover"
              width="1100"
              height="900"
            />
            <div className="col-span-2 flex flex-col gap-4 pt-16">
              <img
                src={images.experienceSide}
                alt=""
                loading="lazy"
                className="aspect-[3/4] w-full rounded-[2rem] object-cover"
                width="700"
                height="900"
              />
              {price && (
                <div className="rounded-[1.5rem] bg-jungle-900 p-5 text-cream-50">
                  <p className="text-xs font-semibold text-cream-100/60">{t('experience.price')}</p>
                  <p className="mt-2 font-display text-xl leading-tight font-semibold sm:text-2xl">
                    {formatPrice(price.min, locale)} – {formatPrice(price.max, locale)}
                    <span className="ml-1 text-sm font-normal text-ember-400">FCFA</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading eyebrow={t('experience.eyebrow')} title={t('experience.title')} lead={t('experience.body')} />

          <ul className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {features.map((feature, i) => {
              const Icon = ICONS[i];
              return (
                <Reveal as="li" key={feature.title} delay={i * 90} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-leaf-200 text-jungle-700">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-sans text-base font-bold text-jungle-900">{feature.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{feature.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
