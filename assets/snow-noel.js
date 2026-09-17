(function(){
  var wrap = document.getElementById('snowfall');
  if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var count = window.innerWidth < 640 ? 12 : 18;
  for (var i = 0; i < count; i++) {
    var f = document.createElement('span');
    f.textContent = '❄';
    var size = 10 + Math.random() * 14;
    var left = Math.random() * 100;
    var duration = 9 + Math.random() * 8;
    var delay = Math.random() * -18;
    var opacity = 0.5 + Math.random() * 0.4;
    f.style.left = left + 'vw';
    f.style.fontSize = size + 'px';
    f.style.opacity = opacity;
    f.style.animationDuration = duration + 's';
    f.style.animationDelay = delay + 's';
    wrap.appendChild(f);
  }
})();
