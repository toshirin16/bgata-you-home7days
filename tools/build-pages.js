// ページ生成スクリプト
// 使い方: リポジトリ直下で `node tools/build-pages.js`
// 正本 src/site.html(全ページ入り)から、ページごとのHTML(index.html, about.html …)と sitemap.xml を作る。
// 生成されたHTMLは直接編集しないこと(次に生成したとき上書きされる)。
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://bgata-you-home7days.netlify.app';
const SRC = path.join(ROOT, 'src', 'site.html');
const NAME = '大阪市東成区の就労継続支援B型事業所 ユー';

const PAGES = [
  { id: 'page-top', file: 'index.html', url: '/', priority: '1.0',
    title: '大阪市東成区・緑橋の就労継続支援B型事業所｜合同会社ユー',
    desc: null /* src/site.html の説明文をそのまま使う */ },
  { id: 'page-about', file: 'about.html', url: '/about.html', priority: '0.8',
    title: `事業紹介・一日の流れ｜${NAME}`,
    desc: '大阪市東成区・緑橋の就労継続支援B型事業所「ユー」の事業紹介です。事業所の雰囲気や一日の流れ、施設概要(所在地・受付時間・運営法人)をご案内します。' },
  { id: 'page-guide', file: 'guide.html', url: '/guide.html', priority: '0.8',
    title: `利用案内・料金・よくある質問｜${NAME}`,
    desc: '就労継続支援B型事業所「ユー」(大阪市東成区・緑橋)のご利用案内。見学・体験から利用開始までの流れ、利用料金、よくある質問(障害者手帳・送迎・工賃など)をまとめています。' },
  { id: 'page-products', file: 'products.html', url: '/products.html', priority: '0.7',
    title: `作品紹介(ビーズアクセサリー・編み物など)｜${NAME}`,
    desc: '大阪市東成区の就労継続支援B型事業所「ユー」で、利用者さんが手作りした作品をご紹介します。ビーズアクセサリー、編み物、くるみボタン、折り紙など。' },
  { id: 'page-events', file: 'events.html', url: '/events.html', priority: '0.6',
    title: `出店・イベント情報｜${NAME}`,
    desc: '就労継続支援B型事業所「ユー」(大阪市東成区・緑橋)のマルシェ出店やイベントの様子をご紹介します。' },
  { id: 'page-access', file: 'access.html', url: '/access.html', priority: '0.8',
    title: `アクセス(緑橋駅5号出口から徒歩5分)｜${NAME}`,
    desc: '就労継続支援B型事業所「ユー」へのアクセス。大阪メトロ中央線・今里筋線「緑橋駅」5号出口から徒歩5分、大阪市東成区東中本三丁目1番30号。城東区・生野区・中央区などからも通いやすい場所です。' },
  { id: 'page-recruit', file: 'recruit.html', url: '/recruit.html', priority: '0.6',
    title: `採用情報・スタッフ募集｜${NAME}`,
    desc: '大阪市東成区・緑橋の就労継続支援B型事業所「ユー」では、一緒に働くスタッフを募集しています。仕事内容や応募方法をご案内します。' },
  { id: 'page-contact', file: 'contact.html', url: '/contact.html', priority: '0.8',
    title: `見学・体験のお問い合わせ｜${NAME}`,
    desc: '就労継続支援B型事業所「ユー」(大阪市東成区・緑橋)への見学・体験・ご利用のお問い合わせはこちら。お電話(06-6224-3252)またはフォームからお気軽にどうぞ。' },
];
const URL_OF = Object.fromEntries(PAGES.map(p => [p.id, p.url]));

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function must(cond, msg) { if (!cond) throw new Error(msg); }

const src = fs.readFileSync(SRC, 'utf8');
const mainOpen = '<main id="main-content" tabindex="-1">';
const iMainOpen = src.indexOf(mainOpen), iMainClose = src.indexOf('</main>');
must(iMainOpen > 0 && iMainClose > iMainOpen, '<main> が見つかりません');
const before = src.slice(0, iMainOpen + mainOpen.length);
const inner = src.slice(iMainOpen + mainOpen.length, iMainClose);
const after = src.slice(iMainClose);

// ページごとに切り出す
const re = /<div class="page(?: active)?" id="(page-[a-z]+)">/g;
const starts = [];
let m;
while ((m = re.exec(inner))) starts.push({ id: m[1], at: m.index });
must(starts.length === PAGES.length, `ページ数が合いません(src: ${starts.length}, 設定: ${PAGES.length})`);
const chunks = {};
starts.forEach((s, i) => {
  let c = inner.slice(s.at, i + 1 < starts.length ? starts[i + 1].at : inner.length);
  // 次のページの見出しコメント(末尾にあるものだけ)を落とす
  c = c.replace(/(?:\s*<!--(?:(?!-->)[^])*-->)+\s*$/, '\n');
  c = c.replace(/^<div class="page(?: active)?"/, '<div class="page active"');
  chunks[s.id] = c;
});
PAGES.forEach(p => must(chunks[p.id], `${p.id} が src/site.html にありません`));

// goTo() のリンクを本物のURLに置き換える
function realLinks(html) {
  return html.replace(/<a\b[^>]*>/g, tag => {
    const h = tag.match(/href="#(page-[a-z]+)"/);
    if (!h || !URL_OF[h[1]]) return tag;
    return tag
      .replace(h[0], `href="${URL_OF[h[1]]}"`)
      .split(` onclick="goTo('${h[1]}'); return false"`).join('');
  });
}

function setMeta(head, p) {
  const url = SITE + p.url;
  const desc = p.desc || (head.match(/<meta name="description" content="([^"]*)">/) || [])[1];
  must(desc, 'description が見つかりません');
  const rep = (rx, val, label) => { must(rx.test(head), label + ' が見つかりません'); head = head.replace(rx, val); };
  rep(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`, 'title');
  rep(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`, 'description');
  rep(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(p.title)}">`, 'og:title');
  if (p.desc) rep(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(p.desc)}">`, 'og:description');
  rep(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`, 'og:url');
  rep(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`, 'canonical');
  // よくある質問の構造化データは、質問が載っている利用案内ページだけに入れる
  if (p.id !== 'page-guide') head = head.replace(/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "FAQPage"[^]*?<\/script>\s*/, '');
  return head;
}

const BANNER = '<!-- このファイルは自動生成です。編集は src/site.html で行い、node tools/build-pages.js を実行してください。 -->\n';

for (const p of PAGES) {
  let head = setMeta(before, p)
    .replace(/<noscript>[^]*?<\/noscript>\s*/, '') // 各ページがJSなしでも表示されるので不要
    .replace(/<!DOCTYPE html>\n?/i, '<!DOCTYPE html>\n' + BANNER);
  const out = realLinks(head) + '\n\n' + realLinks(chunks[p.id]) + '\n' + realLinks(after);
  fs.writeFileSync(path.join(ROOT, p.file), out);
  console.log('生成:', p.file);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  PAGES.map(p => `  <url>\n    <loc>${SITE}${p.url}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>\n`).join('') +
  '</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log('生成: sitemap.xml');
