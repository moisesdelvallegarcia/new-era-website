import { useLanguage } from '../i18n/useLanguage.js'

function ProjectVideo() {
  const { t } = useLanguage()

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-orange-700">
          {t.video.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
          {t.video.title}
        </h2>
        <p className="mt-4 leading-8 text-zinc-600">{t.video.text}</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 shadow-sm">
        <video
          className="aspect-video w-full object-cover"
          controls
          preload="none"
          poster="/media/videos/vid-splash-play-1920w.png"
        >
          <source src="/media/videos/new-era-construction.mp4" type="video/mp4" />
          {t.video.fallback}
        </video>
      </div>
    </div>
  )
}

export default ProjectVideo
