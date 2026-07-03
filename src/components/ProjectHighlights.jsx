import housecallPublicData from '../data/housecallPublicData.json'

function formatProjectYear(year) {
  return year ? String(year) : 'Recent'
}

function ProjectHighlights() {
  const projects = (housecallPublicData.projectHighlights || []).slice(0, 6)

  if (!projects.length) return null

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">
            Project highlights
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-zinc-950 sm:text-5xl">
            Recent work, shared safely
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            These highlights are generated from real completed jobs, with customer details and
            exact addresses removed.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.public_project_id}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm shadow-zinc-200/70"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                {project.service_label}
              </p>
              <h3 className="mt-3 text-xl font-black tracking-tight text-zinc-950">
                {project.public_title}
              </h3>
              <div className="mt-5 flex items-center justify-between gap-4 text-sm font-bold text-zinc-600">
                <span>{project.display_location}</span>
                <span>{formatProjectYear(project.project_year)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectHighlights
