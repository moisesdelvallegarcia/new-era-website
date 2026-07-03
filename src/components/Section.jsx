function Section({ children, className = '', eyebrow, title, description }) {
  return (
    <section className={`px-4 py-16 sm:px-6 lg:px-8 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title || description) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow && (
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-orange-700">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-black leading-tight tracking-tight text-zinc-950 sm:text-5xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base leading-7 text-zinc-600 sm:text-lg">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export default Section
