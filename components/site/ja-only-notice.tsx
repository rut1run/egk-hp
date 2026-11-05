import type { Dictionary, Locale } from '@/lib/i18n/dictionaries'
import { usesEnglish } from '@/lib/i18n/format'
import type { Translatable } from '@/lib/types'
import { Notice } from './primitives'

export function JaOnlyNotice({ record, locale, t }: { record: Translatable; locale: Locale; t: Dictionary }) {
  if (locale !== 'en' || usesEnglish(record, locale)) return null
  return <Notice>{t.common.jaOnly}</Notice>
}
