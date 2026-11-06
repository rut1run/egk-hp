# EGK（EggKingdom）公式サイト

**現在の公開方針：自分のサーバー＋独自ドメイン。** Next.js / Node.js 24 / SQLite / ローカル画像保存に対応しました。設置手順は [deploy/selfhost/README.md](deploy/selfhost/README.md)。サーバーへの実設置は未実施です。以下には既存のSites確認版の説明も含みます。

現在のChatGPT Sites確認版のソースです。元のv0 / Next.jsの画面を、Vinext・React・Cloudflare Workers + D1 / R2で動かしています。GitHubへの今回の反映元はSitesコミット `da86d4a0b4fab321e7129c4fccba17a9511460b6` です。

確認用サイト： https://egk-official-team.sia-rut1run.chatgpt.site/

## 実装済み

- ID・パスワードによる会員登録/ログイン、プロフィール・住所・推し登録。
- 管理者による部門・メンバー・記事・バナー・商品/カテゴリ・スポンサー・チーム紹介/SNS・大会の編集。
- DBへの問い合わせ受付、担当・対応状態・内部メモの管理。
- カート、サーバーでの商品・販売期間・価格・数量・在庫確認、支払いを伴わない注文内容の受付、会員履歴・受付詳細・手動の送料/入金/発送管理。
- Fortnite順位表、VALORANT対戦/マップ/スコアの入力と公開、配信埋め込み、認証付きライブ受信API、更新停止の表示。
- コンテンツのJSONバックアップ、内部リンクの本番ビルド不具合修正。

## 接続待ち

実決済・購入確定・在庫の自動確保・返金、メール認証/再設定/返信の実送信、自動翻訳、大会専用ソフト本体の接続、製造発送会社への自動依頼は未完了です。**現在の注文フォームでは課金しません。** 管理・一部の追加画面の英語化も残っています。詳細は `STATUS.md`、接続方法は `INTEGRATIONS.md` を確認してください。

## Cloudflare公開

独立した公開先向けの設定・GitHub Actionsを追加しています。初回接続手順は [HOSTING.md](HOSTING.md) を参照してください。Cloudflare側の初回デプロイは未実施です。

## ローカル起動

Node.js 24 LTSとnpmを推奨します。依存関係は `package-lock.json` に固定しています。

```sh
npm ci
npm run build
```

初回だけ、ローカルD1へ次のSQLを順番に適用します。適用済みのSQLを再実行しないでください。

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_demonic_union_jack.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_even_outlaw_kid.sql
npm run dev
```

通常のローカル開発は `http://localhost:5173`。実際のURLはターミナルの表示を確認してください。`npm start` はビルド済みWorkerをローカルで起動します。これだけで外部公開はされません。

一般会員は `/register`、ログインは `/login`、管理画面は `/admin`。初期管理者の登録には所有者認証とホストの `EGK_BOOTSTRAP_EMAIL` 設定が必要です。本番の既存管理者をローカルへコピーしたり、共通パスワードをソースに入れたりしないでください。

## 検証

```sh
npx tsc --noEmit
node --test tests/auth-validation.test.mjs tests/catalog-validation.test.mjs tests/workflows.test.mjs
python tests/sqlite-integrity.test.py
npm run build
```

フォントは `public/fonts` から自前配信します。ビルド時のGoogle Fontsダウンロードは不要です。

## 構成・引き継ぎ

- `SPEC.md`：確定仕様。実装済みという意味ではありません。
- `STATUS.md`：実装内容、検証結果、未完了機能。
- `DESIGN.md`：白・黄・黒を基調にしたデザイン方針。
- `INTEGRATIONS.md`：メール・翻訳・大会ソフトの接続。
- `HOSTING.md`：Sites向けの公開構成とGitHubとの関係。
- `db/schema.ts` / `drizzle/`：D1のスキーマと追加マイグレーション。
- `worker/` / `vite.config.ts` / `.openai/hosting.json`：Workers・Sitesの実行設定。

`.env*`、`.dev.vars*`、秘密鍵、会員DB、セッション、実際の問い合わせ・注文、生成ビルド、node_modulesは含めません。外部APIキーはホストの秘密設定で管理してください。

これは通常のNext.js/Vercel向け構成とは異なります。D1/R2とSitesの認証境界を使うため、移行先ではそれらの実行環境を用意する必要があります。**GitHubへアップしただけでは稼働中サイトは自動更新されません。**
