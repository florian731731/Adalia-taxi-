document.addEventListener('DOMContentLoaded', function () {
  var picker = document.getElementById('zone-picker');
  if (!picker) return;
  var tabs = picker.querySelectorAll('.zone-tab');
  var panels = picker.querySelectorAll('.zone-panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var zone = tab.getAttribute('data-zone');
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-zone-panel') === zone);
      });
    });
  });
});
