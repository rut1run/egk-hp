'use client'

import Image from 'next/image'
import Link from '@/components/site/link'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { pick } from '@/lib/i18n/format'
import type { Banner } from '@/lib/types'
import { cn } from '@/lib/utils'

const INTERVAL = 6000

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const { t, locale } = useI18n()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const count = banners.length

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])

  useEffect(() => {
    if (!playing || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL)
    return () => window.clearInterval(id)
  }, [playing, count])

  if (count === 0) return null

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.site.fullName}
      className="relative bg-foreground"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(index - 1)
        if (e.key === 'ArrowRight') go(index + 1)
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/7]">
        {banners.map((b, i) => (
          <Link
            key={b.id}
            href={b.href}
            aria-roledescription="slide"
            aria-label={`${t.common.slide} ${i + 1} / ${count}: ${pick(b.title,{translation:b.translation??'none'},locale)}`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <picture>
              {b.mobileImageUrl && <source media="(max-width: 639px)" srcSet={b.mobileImageUrl}/>}
              <img src={b.imageUrl || '/placeholder.svg'} alt={pick(b.alt,{translation:b.translation??'none'},locale)} fetchPriority={i===0?'high':'auto'} className="absolute inset-0 size-full object-cover"/>
            </picture>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-16 pb-14 md:pb-16">
              <p className="mx-auto max-w-7xl px-4 text-lg md:px-8 font-black text-white text-balance md:text-3xl">
                {pick(b.title,{translation:b.translation??'none'},locale)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pb-4 md:px-8 md:pb-5">
            <ol className="flex flex-1 gap-1.5">
              {banners.map((b, i) => (
                <li key={b.id} className="flex-1 md:max-w-16">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${t.common.slide} ${i + 1}`}
                    aria-current={i === index}
                    className="flex h-6 w-full items-center"
                  >
                    <span className={cn('h-0.5 w-full', i === index ? 'bg-primary' : 'bg-white/40')} />
                  </button>
                </li>
              ))}
            </ol>
            <div className="flex text-white">
              <button type="button" onClick={() => go(index - 1)} className="flex size-9 items-center justify-center hover:bg-white/10">
                <ChevronLeft className="size-5" aria-hidden="true" />
                <span className="sr-only">{t.common.prev}</span>
              </button>
              <button type="button" onClick={() => setPlaying((p) => !p)} className="flex size-9 items-center justify-center hover:bg-white/10">
                {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
                <span className="sr-only">{playing ? t.common.pause : t.common.play}</span>
              </button>
              <button type="button" onClick={() => go(index + 1)} className="flex size-9 items-center justify-center hover:bg-white/10">
                <ChevronRight className="size-5" aria-hidden="true" />
                <span className="sr-only">{t.common.next}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
