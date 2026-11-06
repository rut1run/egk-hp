# EGK 自分のサーバーで運営する構成

HP、ID/パスワード認証、会員情報、管理画面、記事・商品・注文内容受付・問い合わせ・大会API、画像を1台の自分のサーバーにまとめます。Cloudflareのアカウント・D1・R2は不要です。コードはGitHubで管理します。Node.js 24 / Next.js / SQLite / サーバー内の画像フォルダーで動作します。

## 設置前に必要なもの

- 管理権限があるLinuxサーバー。既存AWSでも構いませんが、他システムの空き容量・メモリ・ポートを先に確認します。
- 使用するドメインのDNSをそのサーバーのIPへ向けること。
- Docker Engine / Compose、nginx、HTTPS証明書。アプリの3000番は外部公開せず、nginxだけを公開します。

## 初回設置

リポジトリをサーバーへ取得し、リポジトリのルートで次を実行します。非公開GitHubの認証は所有者が設定してください。APIキーをGit URLへ埋め込まないでください。

```sh
cp deploy/selfhost/server.env.example deploy/selfhost/server.env
chmod 600 deploy/selfhost/server.env
```

エディタで `server.env` の `EGK_SITE_URL` に自分のURLを設定し、`EGK_SETUP_TOKEN` にパスワード管理アプリ等で生成した32〜256文字のランダムな初回設定キーを設定します。設定キーはチャットやGitHubに貼らず、初回設定画面で本人だけが入力します。

```sh
docker compose -f deploy/selfhost/compose.yml up -d --build
```

初回起動時にSQLマイグレーションを順に適用します。2回目以降は未適用分だけです。既存Sitesのユーザー・注文・画像は自動移行しません。

`nginx.conf.example` のドメインを置き換えてnginxへ登録し、設定を検証してから反映します。Certbot等でHTTPSを設定してからログイン・会員登録を使ってください。DNSが正しく向いていない状態では証明書取得を進めません。

公開URLの `/admin/setup` でキー・ID・メール・パスワードを本人が登録します。初回のみ管理者が作成され、次回から `/login?next=/admin` でログインできます。初回キーが未設定・32文字未満なら登録は拒否されます。メールの所有確認は実メールサービス接続後です。

## データと更新

データはDockerの名前付きボリューム `egk-data` 内の `/data/egk.sqlite` と `/data/media` に永続保存します。コンテナを更新しても残ります。`docker compose down -v` はデータも削除するため実行しないでください。

更新前にバックアップし、コードを取得して再ビルドします。DBマイグレーション後のアプリだけの巻き戻しは互換性の確認が必要です。

```sh
docker compose -f deploy/selfhost/compose.yml exec egk-hp node scripts/selfhost-backup.mjs
git pull --ff-only
docker compose -f deploy/selfhost/compose.yml up -d --build
```

バックアップは `/data/backups/日時/` に作成されます。SQLiteのバックアップAPIを使い、WALも含めて整合したDBをコピーします。画像は不変のUUID名で保存し、DBバックアップ後にコピーします。障害に備えてバックアップを別媒体にも定期コピーしてください。会員・住所等を含むので公開ディレクトリへ置かないでください。復元はアプリを停止し、DBとmediaを同じバックアップ時点へ戻してから再起動します。停止前のWAL/SHMを復元後のDBへ混ぜないでください。

1台・1アプリで運用する構成です。複数サーバーへ増やす際はDB・画像共有・セッションを再設計します。

## ローカル検証

```sh
npm ci
npm run selfhost:build
npm run selfhost:migrate
npm run selfhost:start
```

データは標準で `.data/` へ保存します。`EGK_DATA_DIR` で保存先を指定できます。初回設定には実行時の `EGK_SETUP_TOKEN` が必要です。

```sh
node --test tests/selfhost-storage.test.mjs
node --test tests/selfhost-runtime.test.mjs
```

runtimeテストは本番ビルド後に実行し、専用の一時DBで管理者登録保護・ログイン・権限境界を確認します。本番DBや実ユーザーは使用しません。

## 外部接続が残る部分

カード決済は決済代行会社を利用します。現在は課金しない注文内容受付で、実決済・在庫確保・返金の自動化は未実装です。メール送信は `RESEND_API_KEY` / `MAIL_FROM`、翻訳は `DEEPL_API_KEY` を設定し実接続の確認が必要です。大会専用ソフトの接続と製造発送会社の自動連携も別途です。

開発中表示・サンプル・noindexは残しています。正式開設前に実データ・販売条件・連絡先を確定します。サーバーへの設置・DNS・HTTPS・実機確認は、この準備だけでは完了していません。
