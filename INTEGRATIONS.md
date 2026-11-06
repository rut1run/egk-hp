# EGK 外部接続

現状の稼働/接続待ちはSTATUS.mdと管理画面 `/admin/integrations` で確認。

## メール

ホストの秘密設定に `RESEND_API_KEY` と、Resendで送信可能な `MAIL_FROM` を設定。ローカル設定はGitに含めない。設定後に、本人確認・パスワード再設定・問い合わせ返信を実送信で検証する。コードは `https://api.resend.com/emails` を使用。APIキーをブラウザやDBの公開コンテンツへ保存しない。

## 自動翻訳

秘密設定 `DEEPL_API_KEY`。Freeは `https://api-free.deepl.com/v2/translate`、Proは `DEEPL_PLAN=pro` で公式Proエンドポイントを使う。管理者が翻訳ボタンを押して公開コンテンツの日本語だけを送信。機械訳を保存/公開するには管理者の確認が必要。未設定時はサービス未接続のエラーになり、入力内容を変更しない。

## 大会ソフト

1. 大会を管理画面で登録し公開。
2. `/admin/integrations` の「大会ソフト連携キー」でキーを作成。作成直後だけ表示。ソフトの秘密設定へ保存。再作成すると旧キーは無効。
3. `POST /api/integrations/tournaments`、`Authorization: Bearer <連携キー>`、Content-Type application/json。
4. 本人限定公開の間はSitesのサービスアクセス認証も必要。外部サービスのアクセスのために公開範囲を勝手に変更しない。

Fortnite送信例（キーは含めない）：

```json
{
  "slug": "tournament-slug",
  "final": false,
  "results": {
    "game": "fortnite",
    "recordedAt": "2026-11-06T12:00:00.000Z",
    "standings": [
      {"rank": 1, "team": "Team name", "points": 100, "eliminations": 10, "matches": 3}
    ]
  }
}
```

VALORANTは results.game を valorant、matchesにid/round（ja必須・en任意）/teamA/teamB/maps（name/scoreA/scoreB）/winner（A/B、任意）を送る。recordedAtは実際の更新日時とし、例の日付を固定しない。

過去24時間より前・未来30秒超・既存より古い/同時刻の更新は新規反映しない。90秒間最新データが届かない場合は接続が古いと表示。フロントは15秒ごとに取得。final=trueは大会の終了/確定結果へ反映。管理者の編集が受信後に行われた場合、その古い受信内容は公開表示へ優先しない。

## 決済・発送

決済サービスと製造発送の委託先は未確定。現在のフォームは「支払いが発生しない注文内容の受付」。購入確定、在庫確保、決済/返金や委託先への発注を実行したとは扱わない。カード情報をサイトで保存しない。サービス決定後、正式通知の署名検証・重複処理対策・在庫の原子的引き当て・失効/返金を接続して本番化する。
