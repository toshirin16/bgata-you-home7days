# 就労継続支援B型事業所「ユー」ホームページ

大阪市東成区の就労継続支援B型事業所「ユー」の公式サイト。
ビルド不要の静的サイトで、`index.html` 1ファイルで全ページ（7セクション）を構成しています。

## 公開とデプロイ

- **本番URL**: https://bgata-you-home7days.netlify.app/ ※独自ドメイン導入時に更新
- **デプロイ**: GitHub の `main` ブランチに push すると Netlify が自動デプロイし、**即本番公開**されます。
- ビルドコマンドはなし（Netlify の publish ディレクトリ = リポジトリ直下）。

> `main` への変更 = 本番反映です。編集時は表示確認をしてから push してください。

## ディレクトリ構成

現状:

```
index.html                     # 正本
ogp.jpg                        # OGP画像（使用中）
sitemap.xml
assets/video/event-video.mp4          # イベントセクションの動画（使用中）
assets/video/event-video-poster.jpg   # 同上（ポスター画像）
event-photo-1.jpg / -2.jpg     # 未使用（出店写真の別カット）
event-video-snippet.html       # 旧・実装用スニペット（組込済みのため不要）
.gitignore / README.md / CLAUDE.md
```

整理後の目標:

```
index.html          # マークアップのみ
404.html
robots.txt
sitemap.xml
netlify.toml        # publish・ヘッダ・リダイレクト
assets/
  css/style.css
  js/main.js
  img/              # 画像は実ファイルで管理（HTMLにbase64を貼らない）
```

## ローカルでの確認方法

`file://` で直接開くとフォーム等が正しく確認できないため、簡易サーバ経由で開きます。

```bash
npx serve .
# 表示された http://localhost:3000 などをブラウザで開く
```

確認項目:

- ナビで7セクション（トップ / 事業紹介 / 利用案内 / 作品紹介 / アクセス / 採用情報 / お問い合わせ）を巡回
- スマホ幅（375px前後）でレイアウト崩れ・横スクロールがないこと
- お問い合わせフォームの表示
- 開発者ツールの Console にエラーが出ていないこと

## 編集の基本方針

- 正本は **`index.html` のみ**。内容違いの複製ファイルは作らない。
- 画像は `assets/img/` に実ファイルで置き、`<img>` に `width` / `height` / `loading="lazy"` を付ける。
  HTML に base64（`data:image/...`）を貼り付けない。
- お問い合わせは Netlify Forms。`<form>` の `data-netlify="true"` /
  `name="contact"` / hidden `form-name` を削除・変更しない。

## 未確定事項

- 本番ドメイン（Netlify サブドメイン継続 or 独自ドメイン）
- 施設概要の「定員」人数（現在プレースホルダー `◯◯名`）
- イベント動画（`event-video.mp4`）を使うか
