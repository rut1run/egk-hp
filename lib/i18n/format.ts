import type { Locale } from './dictionaries'
import type { Localized, Translatable } from '@/lib/types'

const TZ = 'Asia/Tokyo'

export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: locale === 'ja' ? '2-digit' : 'short',
    day: '2-digit',
  }).format(new Date(iso))
}

export function formatDateTime(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: locale === 'ja' ? '2-digit' : 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatPrice(jpy: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
    style: 'currency',
    currency: 'JPY',
  }).format(jpy)
}

/**
 * English text is shown only when an admin has reviewed the translation.
 * Unreviewed or stale translations fall back to Japanese.
 */
export function usesEnglish(record: Translatable, locale: Locale) {
  return locale === 'en' && record.translation === 'reviewed'
}

export function pick(value: Localized | undefined, record: Translatable, locale: Locale) {
  if (!value) return undefined
  return usesEnglish(record, locale) && value.en ? value.en : value.ja
}

/** UI labels (division names, categories) are always reviewed. */
export function label(value: Localized, locale: Locale) {
  return locale === 'en' && value.en ? value.en : value.ja
}
