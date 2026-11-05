import type { MetadataRoute } from 'next'
import { isUsingDevData } from '@/lib/data'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  if (isUsingDevData) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/mypage', '/cart', '/checkout'] },
    sitemap: `${base}/sitemap.xml`,
  }
}
