import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.legal.commerce }
}

export default async function CommercePage() {
  const { t, locale } = await getI18n()
  return (
    <LegalPage
      title={t.legal.commerce}
      locale={locale}
      t={t}
      sections={[
        { heading: '販売事業者', body: ['【要記入】'] },
        { heading: '運営責任者', body: ['【要記入】'] },
        { heading: '所在地', body: ['【要記入】（請求があった場合に遅滞なく開示する運用とする場合はその旨を記載）'] },
        { heading: '電話番号', body: ['【要記入】'] },
        { heading: 'メールアドレス', body: ['【要記入】'] },
        { heading: '販売価格', body: ['各商品ページに税込価格で表示します。'] },
        { heading: '商品代金以外の必要料金', body: ['送料：【要記入】', '支払い方法に応じた手数料：【要記入】'] },
        { heading: 'お支払い方法', body: ['クレジットカード、PayPay、コンビニ払い、銀行振込（決済サービス確定後に対応範囲を確定）'] },
        { heading: 'お支払い時期', body: ['【要記入：支払い方法ごとの期限】'] },
        { heading: '商品の引き渡し時期', body: ['在庫商品：【要記入】', '受注生産・予約販売商品：各商品ページに記載の時期'] },
        { heading: '返品・交換・キャンセル', body: ['【要記入：受注生産品の扱い、不良品の対応、連絡期限】'] },
      ]}
    />
  )
}
