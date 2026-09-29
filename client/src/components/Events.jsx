import { MessageCircle, Phone } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { useRestaurant } from '../lib/data.jsx';
import { whatsappLink } from '../lib/format.js';
import { images } from '../lib/images.js';
import { Reveal } from './ui.jsx';

export function Events() {
  const { t } = useLang();
  const { data: restaurant } = useRestaurant();

  return (
    <section className="relative isolate overflow-hidden py-28 text-cream-50 sm:py-36">
      <img src={images.events} alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-jungle-950/95 via-jungle-950/80 to-jungle-950/40" />

      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-ember-400">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            {t('events.eyebrow')}
          </p>
          <h2 className="mt-4 text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">{t('events.title')}</h2>
          <p className="mt-6 text-lg leading-relaxed text-cream-100/80">{t('events.body')}</p>
          {restaurant && (
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href={`tel:${restaurant.phone}`} className="btn btn-primary py-4! text-base">
                <Phone className="size-4" />
                {t('events.call')}
              </a>
              <a
                href={whatsappLink(restaurant.whatsapp, t('events.whatsappMessage'))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost-light py-4! text-base"
              >
                <MessageCircle className="size-4" />
                {t('events.whatsapp')}
              </a>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
