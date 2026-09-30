export const businessInfo = {
  name: 'New Era Construction',
  owner: 'Christian Rubio',
  phone: '(515) 328-4712',
  phoneHref: 'tel:+15153284712',
  address: {
    street: '2520 River Meadows Dr',
    city: 'Des Moines',
    state: 'IA',
    zip: '50320',
  },
  logo: '/media/logo/new-era-logo.webp',
  // Figures from the capability statement (last 12 months, Housecall + DeliveryGo + Connecteam).
  stats: {
    jobs: '640+',
    delivered: '$5M+',
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
  // Keep false until Christian approves publishing builder names (questionnaire, "Página web").
  showBuilderNames: false,
  builders: [
    'Hubbell Homes',
    'Drake Homes',
    'Ground Homes',
    'Embarq Signature Homes',
    'Solid Homes',
    'Showtime Homes',
    'Premier Spas',
  ],
}

export function formatAddress({ street, city, state, zip }) {
  return `${street}, ${city}, ${state} ${zip}`
}
