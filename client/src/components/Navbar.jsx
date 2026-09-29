import { useEffect, useState } from 'react';
import { Menu as MenuIcon, Phone, X } from 'lucide-react';
import { useLang } from '../i18n.jsx';
import { useRestaurant } from '../lib/data.jsx';
import { Logo } from './ui.jsx';

const LINKS = ['experience', 'menu', 'gallery', 'reviews', 'visit'];

function LangToggle({ className = '' }) {
  const { lang, toggle, t } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('nav.switchLang')}
      title={t('nav.switchLang')}
      className={`flex items-center rounded-full border border-cream-100/25 p-0.5 text-[0.7rem] font-bold tracking-wider ${className}`}
    >
      {['fr', 'en'].map((code) => (
        <span
          key={code}
          className={`rounded-full px-2.5 py-1 uppercase transition ${lang === code ? 'bg-cream-50 text-jungle-900' : 'text-cream-100/70'}`}
        >
          {code}
        </span>
      ))}
    </button>
  );
}

export function Navbar() {
  const { t } = useLang();
  const { data: restaurant } = useRestaurant();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid ? 'bg-jungle-950/90 shadow-lg shadow-black/10 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav className={`container-page flex items-center justify-between transition-all ${scrolled ? 'h-16' : 'h-20'}`}>
          <a href="#top" className="shrink-0" onClick={() => setOpen(false)} aria-label="Wandafull Terasse">
            <Logo />
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="relative text-sm font-semibold text-cream-100/80 transition hover:text-cream-50 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-ember-400 after:transition-all hover:after:w-full"
                >
                  {t(`nav.${id}`)}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LangToggle className="hidden sm:flex" />
            <a href="#booking" className="btn btn-primary hidden py-2.5! md:inline-flex">
              {t('nav.book')}
            </a>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full text-cream-50 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {open ? <X className="size-6" /> : <MenuIcon className="size-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Kept outside <header>: its backdrop-blur would otherwise become the containing block of this fixed panel. */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[45] overflow-y-auto bg-jungle-950 pt-20 transition-all duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="container-page flex min-h-full flex-col pt-6 pb-10">
          <ul className="space-y-1">
            {LINKS.map((id, i) => (
              <li
                key={id}
                className={`transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
              >
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-cream-100/10 py-4 font-display text-3xl text-cream-50"
                >
                  {t(`nav.${id}`)}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-4">
            <LangToggle />
            <a href="#booking" onClick={() => setOpen(false)} className="btn btn-primary w-full py-4! text-base">
              {t('nav.book')}
            </a>
            {restaurant && (
              <a href={`tel:${restaurant.phone}`} className="btn btn-ghost-light w-full py-4! text-base">
                <Phone className="size-4" />
                {restaurant.phoneDisplay}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
