import { useLang } from '../i18n.jsx';
import { useRestaurant } from '../lib/data.jsx';
import { Logo, sameHoursEveryDay } from './ui.jsx';

const LINKS = ['experience', 'menu', 'gallery', 'reviews', 'visit'];

export function Footer() {
  const { t } = useLang();
  const { data: restaurant } = useRestaurant();
  const everyday = sameHoursEveryDay(restaurant?.hours);
  const social = Object.entries(restaurant?.social ?? {}).filter(([, url]) => url);

  return (
    <footer className="bg-jungle-950 pt-16 pb-28 text-cream-100/70 md:pb-12">
      <div className="container-page">
        <div className="grid gap-10 border-b border-cream-100/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">{t('footer.tagline')}</p>
            {social.length > 0 && (
              <ul className="mt-5 flex gap-4 text-sm font-semibold">
                {social.map(([name, url]) => (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-ember-400">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer">
            <ul className="space-y-2.5 text-sm">
              {LINKS.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="hover:text-cream-50">
                    {t(`nav.${id}`)}
                  </a>
                </li>
              ))}
              <li>
                <a href="#booking" className="font-bold text-ember-400 hover:text-ember-300">
                  {t('nav.book')}
                </a>
              </li>
            </ul>
          </nav>

          {restaurant && (
            <address className="space-y-2.5 text-sm not-italic">
              <p>
                {restaurant.address.street}, {restaurant.address.district}
                <br />
                {restaurant.address.city}, {restaurant.address.country}
              </p>
              <p>
                <a href={`tel:${restaurant.phone}`} className="hover:text-cream-50">
                  {restaurant.phoneDisplay}
                </a>
              </p>
              {everyday && (
                <p>
                  {t('hero.everyday')} · {everyday.open} – {everyday.close}
                </p>
              )}
            </address>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-8 text-xs sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} Wandafull Terasse. {t('footer.rights')}
          </p>
          <p>{t('footer.photos')}</p>
        </div>
      </div>
    </footer>
  );
}
