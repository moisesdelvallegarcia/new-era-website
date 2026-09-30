import { useLanguage } from '../i18n/useLanguage.js'

function GalleryGrid({ items }) {
  const { t } = useLanguage()

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const { title, category } = t.gallery.items[item.key]

        return (
          <figure
            key={item.key}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-200/70"
          >
            <img
              src={item.image}
              alt={title}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <figcaption className="p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                {category}
              </p>
              <h3 className="mt-1 text-lg font-black tracking-tight text-zinc-950">{title}</h3>
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}

export default GalleryGrid
