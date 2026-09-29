export function formatPrice(amount, locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount);
}

export function dayName(weekday, locale, style = 'long') {
  // 7 January 2024 was a Sunday, so weekday 0..6 maps onto 7..13 January.
  return new Intl.DateTimeFormat(locale, { weekday: style, timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 7 + weekday)));
}

export function formatDate(isoDate, locale) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

export function whatsappLink(number, message) {
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

export function directionsLink({ lat, lng }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
