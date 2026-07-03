import { Link } from 'react-router-dom'
import CTASection from '../components/CTASection.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import Hero from '../components/Hero.jsx'
import ProjectVideo from '../components/ProjectVideo.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import Section from '../components/Section.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { businessInfo } from '../data/businessInfo.js'
import { galleryItems } from '../data/gallery.js'
import { reviews } from '../data/reviews.js'
import { services } from '../data/services.js'

function Home() {
  return (
    <>
      <Hero />
      <Section
        eyebrow="Concrete services"
        title="Built for homes, businesses, and busy Iowa weather"
        description="From driveways to commercial slabs, New Era Construction keeps the process clear from estimate through finish."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <Link
          to="/services"
          className="mt-8 inline-flex rounded border border-zinc-300 px-5 py-3 font-black text-zinc-900 transition hover:border-orange-600 hover:text-orange-700"
        >
          View all services
        </Link>
      </Section>

      <Section className="bg-zinc-100" eyebrow="Why choose us" title="Straightforward concrete work with local accountability">
        <div className="grid gap-5 md:grid-cols-5">
          {businessInfo.highlights.map((item) => (
            <div key={item} className="rounded-2xl bg-white p-5 shadow-sm shadow-zinc-200/70">
              <h3 className="font-black text-zinc-950">{item}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Practical communication, clean job planning, and a crew focused on durable results.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 rounded-[2rem] border border-zinc-200 bg-zinc-950 p-7 text-white shadow-xl shadow-zinc-200/70 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:p-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
              Se Habla Español
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Clear estimates in the language you prefer
            </h2>
          </div>
          <p className="text-lg leading-8 text-zinc-300">
            New Era Construction can walk through your concrete project in English or Spanish,
            from scope and pricing to schedule, access, and finish expectations.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Project preview"
        title="A quick look at the type of work we handle"
        description="Real project photos from residential concrete, patios, walkways, and driveway work."
      >
        <GalleryGrid items={galleryItems.slice(0, 3)} />
      </Section>

      <Section className="bg-zinc-100">
        <ProjectVideo />
      </Section>

      <Section className="bg-zinc-100" eyebrow="Reviews" title="Trusted by local homeowners and businesses">
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  )
}

export default Home
