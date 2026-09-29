import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n.jsx';
import { openStatus } from '../../../shared/hours.js';
import { dayName } from '../lib/format.js';

/** Fades its children in the first time they scroll into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Leaf({ className = '' }) {
  return (
    <svg viewBox="0 0 100 140" aria-hidden="true" className={className} fill="none">
      <path d="M50 4C88 30 104 78 50 136C-4 78 12 30 50 4Z" fill="currentColor" />
      <path d="M50 14V130" stroke="var(--leaf-vein, rgba(0,0,0,.25))" strokeWidth="3" strokeLinecap="round" />
      {[40, 62, 84, 104].map((y, i) => (
        <g key={y} stroke="var(--leaf-vein, rgba(0,0,0,.25))" strokeWidth="2.5" strokeLinecap="round">
          <path d={`M50 ${y}L${28 + i * 2} ${y - 16}`} />
          <path d={`M50 ${y}L${72 - i * 2} ${y - 16}`} />
        </g>
      ))}
    </svg>
  );
}

export function Logo({ className = '', tone = 'light' }) {
  const main = tone === 'light' ? 'text-cream-50' : 'text-jungle-900';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Leaf className="h-8 w-6 text-jungle-500 [--leaf-vein:rgba(8,23,15,.55)]" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.35rem] font-semibold italic tracking-tight ${main}`}>Wandafull</span>
        <span className="mt-0.5 text-[0.62rem] font-bold tracking-[0.42em] text-ember-400 uppercase">Terasse</span>
      </span>
    </span>
  );
}

export function SectionHeading({ eyebrow, title, lead, tone = 'dark', align = 'left', className = '' }) {
  const centered = align === 'center';
  const colors =
    tone === 'light'
      ? { eyebrow: 'text-ember-400', title: 'text-cream-50', lead: 'text-cream-100/75' }
      : { eyebrow: 'text-ember-600', title: 'text-jungle-900', lead: 'text-ink-soft' };
  return (
    <Reveal className={`${centered ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      <p className={`eyebrow ${colors.eyebrow} ${centered ? 'justify-center' : ''}`}>
        <span className="h-px w-8 bg-current" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className={`mt-4 text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl ${colors.title}`}>{title}</h2>
      {lead && <p className={`mt-5 text-lg leading-relaxed ${colors.lead}`}>{lead}</p>}
    </Reveal>
  );
}

function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function OpenBadge({ hours, className = '' }) {
  const { t, locale } = useLang();
  const now = useNow();
  if (!hours) return null;

  const status = openStatus(hours, now);
  let label = t('status.closed');
  if (status.open) label = t('status.openUntil', { time: status.closesAt });
  else if (status.inDays === 0) label += ` · ${t('status.opensToday', { time: status.opensAt })}`;
  else if (status.inDays === 1) label += ` · ${t('status.opensTomorrow', { time: status.opensAt })}`;
  else if (status.opensAt) label += ` · ${t('status.opensOn', { day: dayName(status.weekday, locale), time: status.opensAt })}`;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      <span className="relative flex size-2">
        {status.open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf-400 opacity-60" />}
        <span className={`relative inline-flex size-2 rounded-full ${status.open ? 'bg-leaf-400' : 'bg-ember-400'}`} />
      </span>
      {label}
    </span>
  );
}

/** "Every day 11:00 – 23:00" when all days match, otherwise null. */
export function sameHoursEveryDay(hours) {
  if (!hours || hours.length !== 7) return null;
  const [first] = hours;
  const same = hours.every((h) => !h.closed && h.open === first.open && h.close === first.close);
  return same ? { open: first.open, close: first.close } : null;
}

export function Stars({ value, className = 'size-4' }) {
  return (
    <span className="relative inline-flex" role="img" aria-label={`${value} / 5`}>
      <span className="flex text-cream-300">
        {Array.from({ length: 5 }, (_, i) => (
          <StarShape key={i} className={className} />
        ))}
      </span>
      <span className="absolute inset-0 flex overflow-hidden text-ember-500" style={{ width: `${(value / 5) * 100}%` }}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarShape key={i} className={`${className} shrink-0`} />
        ))}
      </span>
    </span>
  );
}

function StarShape({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.2 6.6L12 17.3l-5.8 3.2 1.2-6.6L2.5 9.3l6.6-.8L12 2.5z" />
    </svg>
  );
}
