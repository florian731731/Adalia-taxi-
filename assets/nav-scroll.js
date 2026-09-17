(function(){
  var header = document.querySelector('header.topbar');
  if (!header) return;
  function onScroll(){
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
})();
