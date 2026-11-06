# EGK 公開構成

現在の確認版はChatGPT Sitesで稼働しています。

https://egk-official-team.sia-rut1run.chatgpt.site/

Vinext / React / Cloudflare Workersで実行し、D1（DB）とR2（BUCKET）を使用します。`.openai/hosting.json` は既存Sitesの識別子とバインディング名を保持しています。これはAPIキーではありません。

所有者向けChatGPT認証の外側に、アプリ内の会員ID/パスワード認証を持ちます。初回管理者はホストに設定した所有者本人が登録します。一般会員が管理者権限を取得できる仕様ではありません。

2026-11-06、ユーザーの依頼で現在の修正版一式を `rut1run/egk-hp` へ同期しました。今回の同期は手動です。以後のGitHub更新によるSitesの自動デプロイや、Sites更新のGitHubへの自動同期は設定していません。

公開範囲は今回変更しません。本番の会員・コンテンツ・画像・問い合わせ・注文はホストに保存され、このGitHubにはコピーしていません。新しいホストでは空のDBへマイグレーションを適用し、必要なデータを適切な手順で移行してください。

契約や接続が必要なサービス、検証済みの範囲は `STATUS.md` / `INTEGRATIONS.md` を確認してください。決済・メール等の未接続を、動作済みと扱わないでください。

## Cloudflareで一般公開する構成（追加）

GitHubでコードを管理し、Cloudflare Workers / D1 / R2へ公開します。GitHub Pagesではサーバー機能やショップを実行しません。既存Sites確認版の公開範囲・DB・アカウントは変更していません。

**現在：公開用ビルド・設定・GitHub Actionsを用意済み。Cloudflareのアカウント接続と初回公開は未実施です。**

### 初回設定

1. Cloudflareへログインし、Workersの `workers.dev` サブドメインを設定する。
2. D1データベース `egk-hp` を新規作成し、UUIDを控える。既存SitesのDBとは別にする。
3. R2バケット `egk-hp-media` を作成する。公開バケットにする必要はない。R2有効化で支払い設定・契約が求められた場合は所有者が内容と料金を確認して判断する。
4. GitHubリポジトリの Settings → Environments で `production` を作り、次を登録する。値やキーをチャット・ソースコードへ貼らない。

| 種類 | 名前 | 値 |
| --- | --- | --- |
| Variable | `CLOUDFLARE_ACCOUNT_ID` | CloudflareのアカウントID |
| Variable | `CLOUDFLARE_D1_DATABASE_ID` | 手順2のUUID |
| Variable | `CLOUDFLARE_R2_BUCKET` | `egk-hp-media` |
| Secret | `CLOUDFLARE_API_TOKEN` | 対象アカウントに限定したデプロイ用APIトークン |
| Secret | `EGK_SETUP_TOKEN` | パスワード管理アプリ等で生成した32〜256文字のランダムな初回設定キー |

APIトークンには対象アカウントの Workers Scripts Edit、D1 Edit、Workers R2 Storage Edit が必要。Workersの一覧参照などCLIが要求する権限も確認する。全アカウント・全権限のキーやGlobal API Keyを使わない。

5. Actions → **Deploy EGK to Cloudflare** → Run workflow。DBの未適用マイグレーションだけを適用し、ビルド済みWorker・画像等の静的ファイルを公開する。初回設定キーの登録に失敗した場合、設定APIは閉じたままなので、問題を修正して再実行する。
6. 成功したログに表示されたURLを開き、`/admin/setup` で初回設定キー・本人が決めたID・メール・パスワードを登録する。設定は一度限りで、以降は `/login?next=/admin` を使う。
7. 公開先で表示・会員登録・ログイン・管理編集・画像アップロード・問い合わせ・注文内容受付を確認する。実決済・実メール送信を確認したことにはならない。

初回確認後、GitHubリポジトリの Variables に `CLOUDFLARE_AUTO_DEPLOY=true` を追加するとmainへのpushで自動反映する。未設定では手動実行のみ。APIキー・設定キーをActionsログへ出力しない。

### ローカルから公開する場合

Node.js 24、`npm ci` の後、WranglerでCloudflareにログインする。上表のVariableを同名の環境変数に設定し、`EGK_SETUP_TOKEN` を安全な方法で環境に読み込んで `npm run cloudflare:deploy` を実行する。設定キーをコマンド履歴へ直書きしない。

ビルドだけなら `npm run cloudflare:build`。設定は無視対象の `.cloudflare.generated.json` に生成され、DB UUIDとバケット名のみを書き込む。キーは書かれない。通常の `npm run build` は既存Sites向けのまま。

Cloudflare公開では `EGK_HOSTING_MODE=cloudflare` によりSites認証ヘッダーを信用せず、初回設定キーを必須とする。設定キーが未登録・短すぎる場合は管理者を作成できない。初回設定後はDBの一意マーカーで再作成を防ぐ。

### 未接続の機能

- メール：Cloudflare WorkerのSecretsへ `RESEND_API_KEY` と `MAIL_FROM` を設定し、送信元ドメインの認証後に実送信を確認する。
- 翻訳：`DEEPL_API_KEY`（必要なら `DEEPL_PLAN`）を設定する。
- 決済：決済サービス選定・加盟店登録・サーバー実装・決済通知と在庫連動・テスト決済が別途必要。現在の受付フォームは課金しない。
- 大会連携：管理画面で連携キーを発行して専用ソフトから接続し、実データで確認する。

新規公開先のDBは空から開始する。既存Sitesの会員・住所・注文・問い合わせ・画像は自動移行しない。サンプルデータ・開発中表示・noindexは残っているため、正式開設前に実データと公開用文言へ切り替える。
