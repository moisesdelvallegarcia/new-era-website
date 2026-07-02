import CTASection from '../components/CTASection.jsx'
import Section from '../components/Section.jsx'
import { businessInfo } from '../data/businessInfo.js'

function About() {
  return (
    <>
      <Section
        eyebrow="About"
        title="A family-owned concrete company serving Central Iowa"
        description="New Era Construction focuses on dependable concrete work, clear communication, and practical solutions for homes and businesses."
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
            <img
              src="/media/photos/IMG_20211118_162530-640w.webp"
              alt="Completed concrete walkway and driveway by New Era Construction"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="grid gap-5">
            <p className="leading-8 text-zinc-700">
              The company brings more than 15 years of concrete experience to driveways, patios,
              floors, sidewalks, footings, repairs, and commercial flatwork across the Greater Des
              Moines Metro Area.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {businessInfo.highlights.map((item) => (
                <div key={item} className="rounded border border-zinc-200 p-4 font-bold text-zinc-900">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
      <CTASection />
    </>
  )
}

export default About
