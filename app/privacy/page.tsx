import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.legal.privacy }
}

export default async function PrivacyPage() {
  const { t, locale } = await getI18n()
  return (
    <LegalPage
      title={t.legal.privacy}
      locale={locale}
      t={t}
      sections={[
        { heading: '1. 取得する情報', body: ['会員登録時のユーザーID、表示名、メールアドレス。商品購入時の氏名、住所、電話番号、メールアドレス、注文内容。お問い合わせ時の氏名、メールアドレス、お問い合わせ内容。アクセス解析のための閲覧情報。', 'クレジットカード情報は本サイトでは保存せず、決済代行事業者が管理します。'] },
        { heading: '2. 利用目的', body: ['本人確認、ログイン、パスワード再設定、注文の処理・配送・連絡、お問い合わせへの回答、サービス改善のため。'] },
        { heading: '3. 第三者提供・委託', body: ['法令に基づく場合を除き、本人の同意なく第三者に提供しません。決済、商品の製造・発送、メール配信等の業務を外部事業者に委託する場合があります。【要記入：委託先の種類】'] },
        { heading: '4. 開示・訂正・削除', body: ['ご本人からの請求に応じ、法令に従い対応します。マイページから登録情報の確認・変更、退会ができます。'] },
        { heading: '5. お問い合わせ窓口', body: ['【要記入：運営者名・連絡先】'] },
        { heading: '制定日', body: ['【要記入】'] },
      ]}
    />
  )
}
