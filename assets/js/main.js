
// 各ページのURL(ページは tools/build-pages.js で src/site.html から生成)
var PAGE_URLS = {
  'page-top': '/', 'page-about': '/about.html', 'page-guide': '/guide.html',
  'page-products': '/products.html', 'page-events': '/events.html',
  'page-access': '/access.html', 'page-recruit': '/recruit.html', 'page-contact': '/contact.html'
};

function goTo(pageId){
  var target = document.getElementById(pageId);
  // このHTMLに無いページなら、そのページのURLへ移動する
  if (!target) { if (PAGE_URLS[pageId]) window.location.href = PAGE_URLS[pageId]; return; }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  target.classList.add('active');
  document.querySelectorAll('.main-nav a[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });
  window.scrollTo({top:0, behavior:'instant'});
  document.getElementById('mainNav').classList.remove('open');
  document.getElementById('hamburger').setAttribute('aria-expanded','false');
}

document.getElementById('hamburger').addEventListener('click', () => {
  const nav = document.getElementById('mainNav');
  const open = nav.classList.toggle('open');
  document.getElementById('hamburger').setAttribute('aria-expanded', open);
});

function toggleFaq(btn){
  const item = btn.closest('.faq-item');
  const ans = item.querySelector('.faq-a');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-a').style.maxHeight = null;
    el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
  });
  if(!isOpen){
    item.classList.add('open');
    ans.style.maxHeight = ans.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
  }
}

// 今表示しているページのメニューを強調する
(function(){
  var cur = document.querySelector('.page.active');
  var link = cur && document.querySelector('.main-nav a[data-page="' + cur.id + '"]');
  if (link) link.classList.add('active');
})();

// After a successful Netlify Forms submission, the browser is redirected back here
// with ?contact=success — show the inline thank-you message on the contact page.
(function(){
  var params = new URLSearchParams(window.location.search);
  if (params.get('contact') === 'success') {
    // フォームの送信後は「/?contact=success」に戻ってくるので、お問い合わせページへ移す
    if (!document.getElementById('page-contact')) {
      window.location.replace(PAGE_URLS['page-contact'] + '?contact=success');
      return;
    }
    goTo('page-contact');
    var msg = document.getElementById('submitMsg');
    if (msg) {
      msg.style.display = 'block';
      msg.scrollIntoView({behavior:'smooth', block:'center'});
    }
    // clean the URL so a refresh doesn't re-trigger the message
    var cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
  }
})();

// 以前のURL(#page-xxx 付き、広告やSNSからの直リンク)は、そのページへ移す
(function(){
  var hash = window.location.hash.replace('#', '');
  if (!hash || !PAGE_URLS[hash]) return;
  if (document.getElementById(hash)) goTo(hash);
  else window.location.replace(PAGE_URLS[hash]);
})();
