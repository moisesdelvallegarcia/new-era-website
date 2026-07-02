function ReviewCard({ review }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex gap-1 text-orange-600" aria-label={`${review.rating} star review`}>
        {Array.from({ length: review.rating }).map((_, index) => (
          <span key={index}>★</span>
        ))}
      </div>
      <blockquote className="mt-4 leading-7 text-zinc-700">"{review.text}"</blockquote>
      <p className="mt-5 font-black text-zinc-950">{review.name}</p>
    </article>
  )
}

export default ReviewCard
