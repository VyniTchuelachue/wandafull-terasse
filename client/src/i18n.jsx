import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const dictionaries = {
  fr: {
    pageTitle: 'Wandafull Terasse · Restaurant, grillades & cocktails à Bonapriso, Douala',
    skip: 'Aller au contenu',
    nav: {
      experience: "L'expérience",
      menu: 'La carte',
      gallery: 'Galerie',
      reviews: 'Avis',
      visit: 'Infos & accès',
      book: 'Réserver',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      switchLang: 'Switch to English',
    },
    status: {
      open: 'Ouvert',
      openUntil: "Ouvert jusqu'à {time}",
      closed: 'Fermé',
      opensToday: 'Ouvre à {time}',
      opensTomorrow: 'Ouvre demain à {time}',
      opensOn: 'Ouvre {day} à {time}',
    },
    hero: {
      eyebrow: 'Restaurant · Grill · Cocktails',
      titleA: 'Une terrasse',
      titleAccent: 'wandaful',
      titleB: 'au cœur de Bonapriso',
      lead: "Grillades au charbon, pizzas, fruits de mer et cocktails maison, servis sous la verdure. Pour un déjeuner, un afterwork ou une longue soirée entre amis.",
      book: 'Réserver une table',
      menu: 'Voir la carte',
      rating: '{count} avis Google',
      everyday: 'Tous les jours',
      where: 'Rue Njo-Njo, Bonapriso',
      badge: 'Grillé minute · au charbon',
    },
    marquee: ['Grillades au charbon', 'Cocktails maison', 'Pizzas croustillantes', 'Huîtres & crevettes', 'Plateaux à partager', 'À emporter'],
    experience: {
      eyebrow: "L'expérience",
      title: 'Un coin de verdure pour se retrouver',
      body: "Chez Wandafull Terasse, on vient pour un déjeuner sur le pouce, un afterwork entre collègues ou un dîner qui s'éternise. Mur végétal, lumière douce, places confortables et service attentionné : tout est pensé pour que vous vous sentiez bien.",
      features: [
        { title: 'Terrasse verdoyante', text: "Un cadre lumineux, décoré avec soin, à l'ombre des plantes." },
        { title: 'Grillades au charbon', text: 'Porc, poulet, saucisses, brochettes : grillés minute, saveur authentique.' },
        { title: 'Cocktails maison', text: 'Des créations fraîches et fruitées, avec ou sans alcool.' },
        { title: 'Groupes & fêtes', text: "Anniversaires, afterworks, sorties d'équipe : on s'occupe de tout." },
      ],
      price: 'Prix moyen par personne',
    },
    menu: {
      eyebrow: 'La carte',
      title: 'Des saveurs généreuses, à partager',
      lead: 'Une cuisine de grill, simple et gourmande, et une carte de cocktails pour prolonger la soirée.',
      note: 'Prix en FCFA. La carte peut évoluer selon les arrivages.',
      takeaway: "Tout est aussi disponible à emporter : appelez-nous pour commander.",
      tags: { signature: 'Signature', popular: 'Le plus commandé' },
      error: "La carte n'a pas pu être chargée. Réessayez dans un instant.",
      retry: 'Réessayer',
    },
    gallery: {
      eyebrow: 'En images',
      title: "L'ambiance Wandafull",
      captions: ['Au grill, tous les soirs', 'Cocktails maison', 'On partage tout', 'Le bar', 'Crevettes à l’ail', 'Pizza sortie du four'],
    },
    reviews: {
      eyebrow: 'Avis clients',
      title: 'Ce que nos clients retiennent',
      on: 'sur Google',
      count: '{count} avis',
      lead: 'Ce qui revient le plus souvent dans les avis laissés par nos clients :',
      themes: ['Belle terrasse', 'Décoration soignée', 'Grillades savoureuses', 'Cocktails rafraîchissants', 'Service attentionné', 'Idéal pour les groupes', 'Service rapide', 'Prix abordables'],
      cta: 'Lire les avis sur Google',
    },
    events: {
      eyebrow: 'Groupes & événements',
      title: 'Un anniversaire, un afterwork, une sortie d’équipe ?',
      body: 'Buffets grillades, plateaux à partager et espace réservé pour vos groupes. Parlez-nous de votre projet, on vous prépare une formule sur mesure.',
      call: 'Nous appeler',
      whatsapp: 'Écrire sur WhatsApp',
      whatsappMessage: "Bonjour Wandafull Terasse, j'aimerais organiser un événement pour un groupe.",
    },
    booking: {
      eyebrow: 'Réservation',
      title: 'Réservez votre table',
      lead: 'Envoyez-nous votre demande, nous vous confirmons par téléphone ou WhatsApp. Pour plus de 12 personnes, appelez-nous directement.',
      orCall: 'Ou appelez-nous',
      fields: {
        name: 'Nom complet',
        phone: 'Téléphone',
        email: 'E-mail (facultatif)',
        date: 'Date',
        time: 'Heure',
        guests: 'Personnes',
        area: 'Placement',
        occasion: 'Occasion',
        notes: 'Une précision ? (facultatif)',
      },
      placeholders: {
        name: 'Ex. : Marie Ngo',
        phone: 'Ex. : 6 99 00 00 00',
        email: 'vous@exemple.com',
        notes: 'Allergies, chaise bébé, gâteau d’anniversaire…',
        time: 'Choisir',
      },
      areas: { any: 'Pas de préférence', terrace: 'Terrasse', indoor: 'Intérieur' },
      occasions: {
        none: 'Aucune en particulier',
        birthday: 'Anniversaire',
        afterwork: 'Afterwork',
        business: 'Repas d’affaires',
        date: 'En amoureux',
        other: 'Autre',
      },
      noSlots: 'Plus de créneau disponible ce jour-là.',
      submit: 'Envoyer ma demande',
      sending: 'Envoi…',
      errors: {
        invalid: 'Vérifiez ce champ.',
        past: 'Cette date est passée.',
        too_far: 'Réservations possibles jusqu’à 6 mois à l’avance.',
        closed: 'Nous sommes fermés ce jour-là.',
        unavailable: 'Choisissez un horaire disponible.',
        too_long: 'Texte trop long (500 caractères max).',
        required: 'Champ obligatoire.',
        rate_limited: 'Trop de demandes. Réessayez dans quelques minutes ou appelez-nous.',
        network: 'Connexion impossible. Vérifiez votre réseau ou appelez-nous.',
        generic: 'Une erreur est survenue. Réessayez ou appelez-nous.',
      },
      success: {
        title: 'Merci {name} !',
        body: 'Votre demande pour {guests} personne(s) le {date} à {time} est bien enregistrée. Nous vous recontactons très vite pour confirmer.',
        reference: 'Référence',
        whatsapp: 'Envoyer aussi sur WhatsApp',
        another: 'Nouvelle réservation',
        message:
          'Bonjour Wandafull Terasse ! Je viens de faire une demande de réservation ({id}) : {guests} pers., le {date} à {time}, au nom de {name}.',
      },
    },
    visit: {
      eyebrow: 'Nous trouver',
      title: 'Infos & accès',
      address: 'Adresse',
      hours: 'Horaires',
      contact: 'Contact',
      directions: 'Itinéraire',
      openInMaps: 'Voir sur Google Maps',
      today: "Aujourd'hui",
      closed: 'Fermé',
      landmark: 'Quartier Bonapriso, Douala',
      mapTitle: 'Carte : Wandafull Terasse, Rue Njo-Njo, Douala',
    },
    footer: {
      tagline: 'Restaurant-terrasse, grillades & cocktails à Bonapriso, Douala.',
      rights: 'Tous droits réservés.',
      photos: 'Photos d’illustration : Unsplash.',
    },
    mobileBar: { call: 'Appeler', whatsapp: 'WhatsApp', book: 'Réserver' },
  },

  en: {
    pageTitle: 'Wandafull Terasse · Restaurant, grills & cocktails in Bonapriso, Douala',
    skip: 'Skip to content',
    nav: {
      experience: 'Experience',
      menu: 'Menu',
      gallery: 'Gallery',
      reviews: 'Reviews',
      visit: 'Visit us',
      book: 'Book a table',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      switchLang: 'Passer en français',
    },
    status: {
      open: 'Open',
      openUntil: 'Open until {time}',
      closed: 'Closed',
      opensToday: 'Opens at {time}',
      opensTomorrow: 'Opens tomorrow at {time}',
      opensOn: 'Opens {day} at {time}',
    },
    hero: {
      eyebrow: 'Restaurant · Grill · Cocktails',
      titleA: 'A',
      titleAccent: 'wandaful',
      titleB: 'terrace in the heart of Bonapriso',
      lead: 'Charcoal grills, pizzas, seafood and house cocktails, served under the greenery. For lunch, after-work drinks or a long evening with friends.',
      book: 'Book a table',
      menu: 'See the menu',
      rating: '{count} Google reviews',
      everyday: 'Every day',
      where: 'Rue Njo-Njo, Bonapriso',
      badge: 'Grilled to order · over charcoal',
    },
    marquee: ['Charcoal grills', 'House cocktails', 'Crispy pizzas', 'Oysters & prawns', 'Sharing platters', 'Takeaway'],
    experience: {
      eyebrow: 'The experience',
      title: 'A green corner to get together',
      body: 'People come to Wandafull Terasse for a quick lunch, after-work drinks with colleagues or a dinner that lasts all night. A living plant wall, soft lighting, comfortable seats and attentive service: everything is designed to make you feel at home.',
      features: [
        { title: 'Leafy terrace', text: 'A bright, carefully decorated space in the shade of the plants.' },
        { title: 'Charcoal grills', text: 'Pork, chicken, sausages, skewers: grilled to order, full of flavour.' },
        { title: 'House cocktails', text: 'Fresh, fruity creations, with or without alcohol.' },
        { title: 'Groups & parties', text: 'Birthdays, after-works, team outings: we take care of everything.' },
      ],
      price: 'Average price per person',
    },
    menu: {
      eyebrow: 'The menu',
      title: 'Generous flavours, made for sharing',
      lead: 'Simple, hearty grill cooking and a cocktail list to make the evening last.',
      note: 'Prices in FCFA. The menu may change with market availability.',
      takeaway: 'Everything is also available for takeaway: call us to order.',
      tags: { signature: 'Signature', popular: 'Most ordered' },
      error: 'The menu could not be loaded. Please try again in a moment.',
      retry: 'Try again',
    },
    gallery: {
      eyebrow: 'In pictures',
      title: 'The Wandafull vibe',
      captions: ['On the grill every night', 'House cocktails', 'Everything is for sharing', 'The bar', 'Garlic prawns', 'Fresh from the oven'],
    },
    reviews: {
      eyebrow: 'Guest reviews',
      title: 'What our guests remember',
      on: 'on Google',
      count: '{count} reviews',
      lead: 'What comes up most often in the reviews left by our guests:',
      themes: ['Beautiful terrace', 'Stylish decor', 'Tasty grills', 'Refreshing cocktails', 'Attentive staff', 'Great for groups', 'Fast service', 'Affordable prices'],
      cta: 'Read the reviews on Google',
    },
    events: {
      eyebrow: 'Groups & events',
      title: 'A birthday, an after-work, a team outing?',
      body: 'Grill buffets, sharing platters and a reserved area for your group. Tell us about your plans and we will put together a tailored package.',
      call: 'Call us',
      whatsapp: 'Message us on WhatsApp',
      whatsappMessage: "Hello Wandafull Terasse, I'd like to organise an event for a group.",
    },
    booking: {
      eyebrow: 'Reservations',
      title: 'Book your table',
      lead: 'Send us your request and we will confirm by phone or WhatsApp. For more than 12 guests, please call us directly.',
      orCall: 'Or give us a call',
      fields: {
        name: 'Full name',
        phone: 'Phone',
        email: 'Email (optional)',
        date: 'Date',
        time: 'Time',
        guests: 'Guests',
        area: 'Seating',
        occasion: 'Occasion',
        notes: 'Anything we should know? (optional)',
      },
      placeholders: {
        name: 'e.g. Marie Ngo',
        phone: 'e.g. 6 99 00 00 00',
        email: 'you@example.com',
        notes: 'Allergies, high chair, birthday cake…',
        time: 'Select',
      },
      areas: { any: 'No preference', terrace: 'Terrace', indoor: 'Indoors' },
      occasions: {
        none: 'Nothing special',
        birthday: 'Birthday',
        afterwork: 'After-work',
        business: 'Business meal',
        date: 'Date night',
        other: 'Other',
      },
      noSlots: 'No more times available on this day.',
      submit: 'Send my request',
      sending: 'Sending…',
      errors: {
        invalid: 'Please check this field.',
        past: 'This date has already passed.',
        too_far: 'Bookings open up to 6 months ahead.',
        closed: 'We are closed on this day.',
        unavailable: 'Please pick an available time.',
        too_long: 'Too long (500 characters max).',
        required: 'This field is required.',
        rate_limited: 'Too many requests. Try again in a few minutes or call us.',
        network: 'Could not connect. Check your network or call us.',
        generic: 'Something went wrong. Try again or call us.',
      },
      success: {
        title: 'Thank you, {name}!',
        body: 'Your request for {guests} guest(s) on {date} at {time} has been received. We will get back to you shortly to confirm.',
        reference: 'Reference',
        whatsapp: 'Also send it on WhatsApp',
        another: 'New booking',
        message: 'Hello Wandafull Terasse! I just sent a booking request ({id}): {guests} guests on {date} at {time}, name: {name}.',
      },
    },
    visit: {
      eyebrow: 'Find us',
      title: 'Visit us',
      address: 'Address',
      hours: 'Opening hours',
      contact: 'Contact',
      directions: 'Directions',
      openInMaps: 'Open in Google Maps',
      today: 'Today',
      closed: 'Closed',
      landmark: 'Bonapriso district, Douala',
      mapTitle: 'Map: Wandafull Terasse, Rue Njo-Njo, Douala',
    },
    footer: {
      tagline: 'Terrace restaurant, grills & cocktails in Bonapriso, Douala.',
      rights: 'All rights reserved.',
      photos: 'Illustrative photos: Unsplash.',
    },
    mobileBar: { call: 'Call', whatsapp: 'WhatsApp', book: 'Book' },
  },
};

const STORAGE_KEY = 'wt-lang';

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    // Storage can be blocked (private mode); fall back to the browser language.
  }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'fr';
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => node?.[part], dict);
}

function interpolate(text, vars) {
  if (!vars || typeof text !== 'string') return text;
  return text.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Not critical: the language just won't be remembered.
    }
  }, [lang]);

  const t = useCallback((key, vars) => interpolate(lookup(dictionaries[lang], key) ?? key, vars), [lang]);
  const toggle = useCallback(() => setLang((l) => (l === 'fr' ? 'en' : 'fr')), []);
  const value = useMemo(() => ({ lang, t, toggle, locale: lang === 'fr' ? 'fr-FR' : 'en-GB' }), [lang, t, toggle]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
