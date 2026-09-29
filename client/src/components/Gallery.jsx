import { useLang } from '../i18n.jsx';
import { images } from '../lib/images.js';
import { Reveal, SectionHeading } from './ui.jsx';

// Bento layout: first photo is tall, third is wide, the rest fill the gaps.
const SPANS = ['row-span-2', '', 'col-span-2', '', '', ''];

export function Gallery() {
  const { t } = useLang();
  const captions = t('gallery.captions');

  return (
    <section id="gallery" className="grain relative bg-jungle-950 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading tone="light" eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} />

        <div className="mt-14 grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[14rem] sm:gap-4 lg:grid-cols-4">
          {images.gallery.map((src, i) => (
            <Reveal
              as="figure"
              key={src}
              delay={(i % 4) * 80}
              className={`group relative overflow-hidden rounded-[1.5rem] ${SPANS[i]}`}
            >
              <img
                src={src}
                alt={captions[i]}
                loading="lazy"
                className="size-full object-cover transition duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-jungle-950/80 to-transparent p-4 pt-10 text-sm font-semibold text-cream-50 transition duration-300 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                {captions[i]}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
