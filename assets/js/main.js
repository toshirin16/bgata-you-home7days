
function goTo(pageId){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
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
  });
  if(!isOpen){
    item.classList.add('open');
    ans.style.maxHeight = ans.scrollHeight + 'px';
  }
}

// set initial active nav
document.querySelector('.main-nav a[data-page="page-top"]').classList.add('active');

// After a successful Netlify Forms submission, the browser is redirected back here
// with ?contact=success — show the inline thank-you message on the contact page.
(function(){
  var params = new URLSearchParams(window.location.search);
  if (params.get('contact') === 'success') {
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
