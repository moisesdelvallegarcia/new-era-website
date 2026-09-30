import { Link } from 'react-router-dom'
import AreasServed from '../components/AreasServed.jsx'
import BuilderBenefits from '../components/BuilderBenefits.jsx'
import BuildersList from '../components/BuildersList.jsx'
import CTASection from '../components/CTASection.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import Hero from '../components/Hero.jsx'
import HousecallProof from '../components/HousecallProof.jsx'
import ProcessSteps from '../components/ProcessSteps.jsx'
import ProjectVideo from '../components/ProjectVideo.jsx'
import Section from '../components/Section.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { galleryItems } from '../data/gallery.js'
import { services } from '../data/services.js'
import { useLanguage } from '../i18n/useLanguage.js'

function Home() {
  const { t, to } = useLanguage()

  return (
    <>
      <Hero />
      <BuilderBenefits />
      <ProcessSteps />

      <Section eyebrow={t.services.eyebrow} title={t.services.title} description={t.services.description}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((slug) => (
            <ServiceCard key={slug} slug={slug} />
          ))}
        </div>
        <Link
          to={to('/services')}
          className="mt-8 inline-flex rounded border border-zinc-300 px-5 py-3 font-black text-zinc-900 transition hover:border-orange-600 hover:text-orange-700"
        >
          {t.services.viewAll}
        </Link>
      </Section>

      <HousecallProof />
      <AreasServed />
      <BuildersList />

      <Section className="bg-white">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-zinc-950 p-7 text-white shadow-xl shadow-zinc-200/70 lg:p-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
              {t.spanish.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              {t.spanish.title}
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-300">{t.spanish.text}</p>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-7 lg:p-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">
                {t.homeowners.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-zinc-950 sm:text-4xl">
                {t.homeowners.title}
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-600">{t.homeowners.text}</p>
            </div>
            <Link
              to={to('/contact')}
              className="self-start rounded-full bg-zinc-950 px-6 py-4 font-black text-white transition hover:bg-orange-600 focus-visible:bg-orange-600"
            >
              {t.homeowners.cta}
            </Link>
          </div>
        </div>
      </Section>

      <Section
        className="bg-zinc-100"
        eyebrow={t.gallery.eyebrow}
        title={t.gallery.title}
        description={t.gallery.description}
      >
        <GalleryGrid items={galleryItems.slice(0, 3)} />
        <div className="mt-16">
          <ProjectVideo />
        </div>
      </Section>

      <CTASection />
    </>
  )
}

export default Home
