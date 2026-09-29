import { lazy, Suspense, useEffect } from 'react';
import { useLang } from './i18n.jsx';
import { DataProvider } from './lib/data.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Marquee } from './components/Marquee.jsx';
import { Experience } from './components/Experience.jsx';
import { MenuSection } from './components/MenuSection.jsx';
import { Gallery } from './components/Gallery.jsx';
import { Reviews } from './components/Reviews.jsx';
import { Events } from './components/Events.jsx';
import { Reservation } from './components/Reservation.jsx';
import { Visit } from './components/Visit.jsx';
import { Footer } from './components/Footer.jsx';
import { MobileBar } from './components/MobileBar.jsx';

const Admin = lazy(() => import('./pages/Admin.jsx'));

function Home() {
  const { t } = useLang();

  useEffect(() => {
    document.title = t('pageTitle');
  }, [t]);

  return (
    <DataProvider>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-ember-500 px-5 py-3 font-bold text-jungle-950 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {t('skip')}
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Marquee />
        <Experience />
        <MenuSection />
        <Gallery />
        <Reviews />
        <Events />
        <Reservation />
        <Visit />
      </main>
      <Footer />
      <MobileBar />
    </DataProvider>
  );
}

export default function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/admin') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-jungle-900" />}>
        <Admin />
      </Suspense>
    );
  }
  return <Home />;
}
