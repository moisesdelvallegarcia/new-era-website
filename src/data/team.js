// People with a digital business card at /card/<slug>. Each card also has a
// contact file at public/vcards/<slug>.vcf (keep both in sync).
// Data from Housecall's employee list (hcp_employees), 30-oct-2026.
export const team = [
  {
    slug: 'bernardo',
    name: 'José Bernardo Hernández',
    firstName: 'Bernardo',
    title: 'Sales Representative',
    phone: '(641) 351-9641',
    phoneE164: '+16413519641',
    spanish: true,
  },
]

export const findTeamMember = (slug) => team.find((person) => person.slug === slug)
