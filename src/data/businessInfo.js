export const businessInfo = {
  name: 'New Era Construction',
  legalName: 'Outdoor Modern Concepts LLC',
  founded: 2019,
  siteUrl: 'https://neconstructioniowa.com',
  owner: 'Christian Rubio',
  phone: '(641) 351-9641',
  phoneHref: 'tel:+16413519641',
  email: 'office@neweraiowa.com',
  emailHref: 'mailto:office@neweraiowa.com',
  address: {
    street: '2520 River Meadows Dr',
    city: 'Des Moines',
    state: 'IA',
    zip: '50320',
  },
  logo: '/media/logo/new-era-logo.webp',
  // Figures from the capability statement (last 12 months, Housecall + DeliveryGo + Connecteam).
  // yearYards: DeliveryGo load_size, Jan 1 – Oct 12, 2026.
  stats: {
    jobs: '640+',
    yearYards: '12,700+',
    peakYards: '2,100',
    years: '15+',
    fieldCrew: '20+',
  },
  serviceArea: [
    'Ankeny',
    'Johnston',
    'Waukee',
    'Des Moines',
    'Urbandale',
    'Altoona',
    'Bondurant',
    'Grimes',
    'West Des Moines',
  ],
  // Christian approved publishing every name (questionnaire, 5-oct-2026).
  showBuilderNames: true,
  builders: [
    'Hubbell Homes',
    'Drake Homes',
    'Ground Breaker Homes',
    'Embarq Signature Homes',
    'DS Solid Homes',
    'Showtime Homes',
    'Premier Pools & Spas',
  ],
}

export function formatAddress({ street, city, state, zip }) {
  return `${street}, ${city}, ${state} ${zip}`
}
