'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useI18n } from '@/components/providers/i18n-provider'
import { LOCALE_COOKIE, type Locale } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils'

export function LangSwitch({ className }: { className?: string }) {
  const { locale, t } = useI18n()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function change(next: Locale) {
    if (next === locale) return
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    startTransition(() => router.refresh())
  }

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      aria-busy={pending}
      className={cn('flex items-center font-display text-xs font-semibold tracking-widest', className)}
    >
      {(['ja', 'en'] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="px-1 text-muted-foreground">
              /
            </span>
          )}
          <button
            type="button"
            lang={l}
            onClick={() => change(l)}
            aria-pressed={locale === l}
            className={cn(
              'min-h-8 px-1 transition-colors',
              locale === l
                ? 'text-foreground underline decoration-primary decoration-2 underline-offset-4'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {l === 'ja' ? 'JP' : 'EN'}
            <span className="sr-only">{l === 'ja' ? '日本語' : 'English'}</span>
          </button>
        </span>
      ))}
    </div>
  )
}
