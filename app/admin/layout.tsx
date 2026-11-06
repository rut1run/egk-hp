import Link from '@/components/site/link'
import { currentAccount } from '@/lib/auth/server'
export const dynamic='force-dynamic'
export const metadata={title:'管理画面',robots:{index:false,follow:false}}
export default async function AdminLayout({children}:{children:React.ReactNode}) {
 const account=await currentAccount()
 return <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">{account?.role==='admin'&&<div className="mb-8 flex flex-wrap items-center justify-between gap-5 border-b-2 border-foreground pb-5"><nav aria-label="管理メニュー" className="flex flex-wrap gap-6 text-sm font-bold"><Link href="/admin">管理ホーム</Link><Link href="/admin/members">メンバー</Link><Link href="/admin/divisions">部門</Link><Link href="/admin/news">お知らせ</Link><Link href="/admin/banners">バナー</Link><Link href="/admin/team">チーム紹介・SNS</Link><Link href="/admin/products">商品</Link><Link href="/admin/categories">商品カテゴリ</Link><Link href="/admin/sponsors">スポンサー</Link><Link href="/admin/orders">注文</Link><Link href="/admin/support">問い合わせ</Link><Link href="/admin/tournaments">大会</Link><Link href="/admin/integrations">連携・バックアップ</Link><Link href="/admin/accounts">会員・管理者</Link><Link href="/" target="_blank">公開ページ ↗</Link></nav><span className="text-xs text-muted-foreground">{account.display_name}</span></div>}{children}</div>
}
