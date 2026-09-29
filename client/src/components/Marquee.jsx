import { useLang } from '../i18n.jsx';

export function Marquee() {
  const { t } = useLang();
  const items = t('marquee');
  // The list is rendered twice so the -50% translate loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-jungle-950/10 bg-ember-500 py-4 text-jungle-950" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 font-display text-xl font-medium whitespace-nowrap italic sm:text-2xl">
            {item}
            <svg viewBox="0 0 24 24" className="size-4 text-jungle-900" fill="currentColor">
              <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
