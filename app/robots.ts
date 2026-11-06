import type { MetadataRoute } from 'next'
import { isUsingDevData } from '@/lib/data'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://egk-official-team.sia-rut1run.chatgpt.site'

export default function robots(): MetadataRoute.Robots {
  if (isUsingDevData) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/mypage', '/cart', '/checkout'] },
    sitemap: `${base}/sitemap.xml`,
  }
}
