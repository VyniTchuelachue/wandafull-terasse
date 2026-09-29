import { CalendarDays, MessageCircle, Phone } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { useRestaurant } from '../lib/data.jsx';
import { whatsappLink } from '../lib/format.js';

/** Thumb-friendly call / WhatsApp / book bar, shown on phones only. */
export function MobileBar() {
  const { t } = useLang();
  const { data: restaurant } = useRestaurant();
  if (!restaurant) return null;

  const item = 'flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.7rem] font-bold';

  return (
    <nav
      aria-label={t('nav.book')}
      className="fixed inset-x-3 bottom-3 z-40 flex overflow-hidden rounded-2xl bg-jungle-950/95 text-cream-50 shadow-2xl shadow-black/40 backdrop-blur md:hidden"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a href={`tel:${restaurant.phone}`} className={item}>
        <Phone className="size-5 text-ember-400" />
        {t('mobileBar.call')}
      </a>
      <a href={whatsappLink(restaurant.whatsapp)} target="_blank" rel="noopener noreferrer" className={item}>
        <MessageCircle className="size-5 text-leaf-400" />
        {t('mobileBar.whatsapp')}
      </a>
      <a href="#booking" className={`${item} bg-ember-500 text-jungle-950`}>
        <CalendarDays className="size-5" />
        {t('mobileBar.book')}
      </a>
    </nav>
  );
}
