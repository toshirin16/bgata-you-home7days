# CLAUDE.md — Claude Code 運用ルール

就労継続支援B型事業所「ユー」の静的サイト。日本語の指示だけで安全に更新できるよう、以下を守ること。

## 絶対に守るルール

1. **正本は `src/site.html` だけ。** 内容を直すときは必ずここを編集し、
   そのあと `node tools/build-pages.js` を実行して、各ページ（`index.html` / `about.html` など）と `sitemap.xml` を作り直す。
   生成された HTML を直接編集しない（次に生成したとき上書きされる）。正本と生成物は同じコミットに入れる。
   内容の異なる複製（`index_x.html` など）を作らない・復活させない。
2. **HTML に base64 データURI（`data:image/...;base64,`）を書かない。**
   画像は `assets/img/` に実ファイルで保存し、
   `<img src="assets/img/xxx.webp" width="…" height="…" loading="lazy">` で参照する。
3. **`main` に入った変更は即本番公開される。**
   push する前に必ずローカルで表示確認する。今回の運用は `main` 直 push。
4. **Netlify のデプロイ構成を壊さない。**
   publish ディレクトリはリポジトリ直下、ビルドコマンドなし（生成済みの HTML をコミットして公開する）。
   `netlify.toml` を追加・編集する場合も publish パスは変えない。
5. **お問い合わせフォームを壊さない。**
   `#contactForm` の `data-netlify="true"` / `name="contact"` /
   `<input type="hidden" name="form-name" value="contact">` / 各 `name` 属性 /
   `action="/?contact=success"` は変更しない。
   送信後は `/?contact=success` に戻り、`main.js` が `/contact.html?contact=success` に移して完了メッセージを出す。

## 変更後に必ず確認すること

- `node tools/build-pages.js` を実行したか（エラーが出たら生成されていない）
- ローカルでサーバーを立てて表示し、8ページ巡回・スマホ幅（375px）・フォーム画面・Console エラー無しを確認
- `git status` で `desktop.ini` などの不要ファイルが混ざっていないこと
- コミットは1つの目的につき1コミット（メッセージは日本語可）

## 編集ポイント地図（どこを直すか）

内容はすべて `src/site.html` 内。ページごとのタイトル・説明文だけは `tools/build-pages.js` の `PAGES` にある。

| 依頼内容 | 編集する場所 |
|---|---|
| トップページのタイトル・OGP画像など共通の `<head>` | `src/site.html` の `<head>` |
| 各ページのタイトル・説明文（検索結果に出る文） | `tools/build-pages.js` の `PAGES`（トップの説明文だけは `src/site.html` の `<meta name="description">`） |
| 事業所名・住所・電話・FAX・営業時間・定員・運営法人 | 「施設概要」テーブル（`#page-about`）＋ フッター＋ 本文中の `tel:` リンク＋ `<head>` の構造化データ。**複数箇所あるので grep で漏れなく**置換 |
| 地図の位置 | `#page-access` の Google マップ `<iframe>` の `src`（`q=` パラメータ）＋ 経路説明の `alt` |
| イベント・出店報告 | `#page-events` |
| よくある質問（FAQ） | `#page-guide` 内の `.faq-item`（`toggleFaq` で開閉）＋ `<head>` の FAQPage 構造化データ（利用案内ページにだけ出力される） |
| 利用料金の説明 | `#page-guide` 内「利用料金」 |
| 作品紹介 | `#page-products` |
| 採用情報・求人リンク | `#page-recruit`（ハローワーク求人 `hellowork-plus.com/...` を含む） |
| お問い合わせフォームの項目 | `#page-contact` の `#contactForm` |
| ナビ項目・フッターのリンク | `<header class="site-header">` の `.main-nav` ＋ フッター「ページ一覧」 |
| 色・フォント・余白などの見た目 | `assets/css/style.css` |
| メニュー・FAQ・ページ移動の動作 | `assets/js/main.js` |

## ページ構造の前提

- `src/site.html` は `.page` を8個持つ（page-top / about / events / guide / products / access / recruit / contact）。
  リンクは `href="#page-xxx" onclick="goTo('page-xxx'); return false"` の形で書く。
- `tools/build-pages.js` が `.page` を1つずつ切り出して、本物のページ（`/`, `/about.html`, `/guide.html`, `/products.html`, `/events.html`, `/access.html`, `/recruit.html`, `/contact.html`）を作る。
  そのとき上の形のリンクは `href="/about.html"` などの普通のリンクに置き換えられる。
- ページを追加・削除するときは、`src/site.html`・`tools/build-pages.js` の `PAGES`・`assets/js/main.js` の `PAGE_URLS` の3か所をそろえる。
- 以前の URL（`/#page-about` など、広告やSNSに貼ったリンク）は、`main.js` が新しいページへ移すので引き続き使える。
- `src/` と `tools/` は `robots.txt` で検索対象から外している。

## 未確定事項（勝手に決めない）

- 本番ドメイン → `tools/build-pages.js` の `SITE` / `src/site.html` の `og:image` / 構造化データの `url`・`image` / `robots.txt`
- 「定員」の人数（現在 `◯◯名` のプレースホルダー）
- `event-video.mp4` を使うか
