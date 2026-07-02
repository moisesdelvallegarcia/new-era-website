import CTASection from '../components/CTASection.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import Section from '../components/Section.jsx'
import { reviews } from '../data/reviews.js'

function Reviews() {
  return (
    <>
      <Section
        eyebrow="Reviews"
        title="Customer feedback"
        description="Starter review cards for the UAT version. Replace with verified customer reviews before production."
      >
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

export default Reviews
