import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.legal.terms }
}

export default async function TermsPage() {
  const { t, locale } = await getI18n()
  return (
    <LegalPage
      title={t.legal.terms}
      locale={locale}
      t={t}
      sections={[
        { heading: '第1条（適用）', body: ['本規約は、【要記入：運営者名】（以下「運営者」）が提供する本サイトおよび関連サービスの利用条件を定めるものです。'] },
        { heading: '第2条（会員登録）', body: ['会員登録を希望する方は、本規約に同意のうえ、運営者の定める方法により登録を行うものとします。', '会員は、ユーザーID・パスワードを自己の責任で管理するものとします。'] },
        { heading: '第3条（禁止事項）', body: ['法令または公序良俗に違反する行為、他の利用者・メンバー・第三者の権利を侵害する行為、本サイトの運営を妨げる行為、その他運営者が不適切と判断する行為を禁止します。'] },
        { heading: '第4条（商品の購入）', body: ['商品の購入条件は、各商品ページおよび「特定商取引法に基づく表記」に定めるところによります。'] },
        { heading: '第5条（退会）', body: ['会員は、マイページから所定の手続きにより退会できます。'] },
        { heading: '第6条（免責）', body: ['【要記入：免責範囲】'] },
        { heading: '第7条（規約の変更）', body: ['運営者は、必要と判断した場合、本規約を変更できるものとします。変更後の規約は本サイトに掲載した時点から効力を生じます。'] },
        { heading: '第8条（準拠法・管轄）', body: ['本規約の準拠法は日本法とします。【要記入：合意管轄裁判所】'] },
        { heading: '制定日', body: ['【要記入】'] },
      ]}
    />
  )
}
