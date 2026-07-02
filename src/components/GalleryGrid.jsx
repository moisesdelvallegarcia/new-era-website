function GalleryGrid({ items }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <figure
          key={item.title}
          className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
        >
          <img src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover" />
          <figcaption className="p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
              {item.category}
            </p>
            <h3 className="mt-1 text-lg font-black text-zinc-950">{item.title}</h3>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export default GalleryGrid
