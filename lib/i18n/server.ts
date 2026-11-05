import 'server-only'
import { cookies } from 'next/headers'
import { dictionaries, LOCALE_COOKIE, type Locale } from './dictionaries'

export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  return store.get(LOCALE_COOKIE)?.value === 'en' ? 'en' : 'ja'
}

export async function getI18n() {
  const locale = await getLocale()
  return { locale, t: dictionaries[locale] }
}
