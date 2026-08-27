# CLAUDE.md — Claude Code 運用ルール

就労継続支援B型事業所「ユー」の静的サイト。日本語の指示だけで安全に更新できるよう、以下を守ること。

## 絶対に守るルール

1. **正本は `/index.html` だけ。** 内容の異なる複製（`index_x.html`）を作らない・復活させない。
2. **HTML に base64 データURI（`data:image/...;base64,`）を書かない。**
   画像は `assets/img/` に実ファイルで保存し、
   `<img src="assets/img/xxx.webp" width="…" height="…" loading="lazy">` で参照する。
3. **`main` に入った変更は即本番公開される。**
   push する前に必ずローカルで表示確認する。今回の運用は `main` 直 push。
4. **Netlify のデプロイ構成を壊さない。**
   publish ディレクトリはリポジトリ直下、ビルドコマンドなし。
   `netlify.toml` を追加・編集する場合も publish パスは変えない。
5. **お問い合わせフォームを壊さない。**
   `#contactForm` の `data-netlify="true"` / `name="contact"` /
   `<input type="hidden" name="form-name" value="contact">` / 各 `name` 属性 /
   `action="/?contact=success"` は変更しない。

## 変更後に必ず確認すること

- `npx serve .` でローカル表示し、7セクション巡回・スマホ幅（375px）・フォーム画面・Console エラー無しを確認
- `git status` で `desktop.ini` などの不要ファイルが混ざっていないこと
- コミットは1つの目的につき1コミット（メッセージは日本語可）

## 編集ポイント地図（どこを直すか）

すべて現状は `index.html` 内。将来 `assets/` に分離予定。

| 依頼内容 | 編集する場所 |
|---|---|
| ページタイトル・説明・OGP | `<head>` の `<title>` / `<meta name="description">` / `og:*` / `twitter:*` |
| 事業所名・住所・電話・FAX・営業時間・定員・運営法人 | 「施設概要」テーブル（`#page-about`）＋ フッター＋ 本文中の `tel:` リンク。**複数箇所あるので grep で漏れなく**置換 |
| 地図の位置 | `#page-access` の Google マップ `<iframe>` の `src`（`q=` パラメータ）＋ 経路説明の `alt` |
| イベント・出店報告 | `#page-about` 内「出店・イベント情報 / EVENT REPORT」ブロック |
| よくある質問（FAQ） | `#page-guide` 内の `.faq-item`（`toggleFaq` で開閉） |
| 利用料金の説明 | `#page-guide` 内「利用料金」 |
| 作品紹介 | `#page-products` |
| 採用情報・求人リンク | `#page-recruit`（ハローワーク求人 `hellowork-plus.com/...` を含む） |
| お問い合わせフォームの項目 | `#page-contact` の `#contactForm` |
| ナビ項目・フッターのリンク | `<header class="site-header">` の `.main-nav` ＋ フッター「ページ一覧」 |
| 色・フォント・余白などの見た目 | `<style>` ブロック（将来 `assets/css/style.css`） |
| 表示切替・メニュー・FAQ の動作 | `<script>` ブロック（将来 `assets/js/main.js`） |

## セクション構造の前提

`index.html` は `.page` を7個持ち、`goTo('page-xxx')` で表示を切り替える擬似SPA。
`.page{display:none}` を JS で `.active` にして表示するため、**JS無効時はトップ（page-top）のみ表示**される。
この構造を変える場合（実ページ分割など）は必ず事前に相談。

## 未確定事項（勝手に決めない）

- 本番ドメイン → `sitemap.xml` / `og:url` / `og:image` / canonical の値
- 「定員」の人数（現在 `◯◯名` のプレースホルダー）
- `event-video.mp4` を使うか
