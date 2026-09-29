// Illustrative photos from Unsplash (free for commercial use, https://unsplash.com/license).
// To use your own photos: drop them in client/public/images/ and replace a URL
// with its path, e.g. heroMain: '/images/terrasse.jpg'.

const unsplash = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`;

export const images = {
  heroMain: unsplash('1555939594-58d7cb561ad1', 1100, 1400),
  heroSide: unsplash('1514362545857-3bc16c4c7d1b', 600, 750),
  experienceMain: unsplash('1528605248644-14dd04022da1', 1100, 900),
  experienceSide: unsplash('1599487488170-d11ec9c172f0', 700, 900),
  events: unsplash('1572116469696-31de0f17cc34', 1800, 1000),
  menu: {
    grill: unsplash('1561626423-a51b45aef0a1', 900, 700),
    platters: unsplash('1555939594-58d7cb561ad1', 900, 700),
    pizza: unsplash('1574071318508-1cdbab80d002', 900, 700),
    sea: unsplash('1625943553852-781c6dd46faa', 900, 700),
    sides: unsplash('1504674900247-0877df9cc836', 900, 700),
    drinks: unsplash('1497534446932-c925b458314e', 900, 700),
  },
  gallery: [
    unsplash('1600565193348-f74bd3c7ccdf', 900, 1100),
    unsplash('1497534446932-c925b458314e', 900, 900),
    unsplash('1466978913421-dad2ebd01d17', 900, 900),
    unsplash('1572116469696-31de0f17cc34', 900, 1100),
    unsplash('1625943553852-781c6dd46faa', 900, 900),
    unsplash('1574071318508-1cdbab80d002', 900, 900),
  ],
};
