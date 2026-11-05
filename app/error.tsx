'use client'

import { useI18n } from '@/components/providers/i18n-provider'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n()
  return (
    <div role="alert" className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-20 md:px-8">
      <h1 className="text-2xl font-black">{t.common.errorTitle}</h1>
      <p className="text-sm text-muted-foreground">{t.common.errorBody}</p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-12 items-center bg-primary px-6 text-sm font-black text-primary-foreground"
      >
        {t.common.retry}
      </button>
    </div>
  )
}
