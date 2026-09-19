(function () {
  'use strict';
  // French address suggestions are optional: international addresses remain editable.
  function setupAddressAutocomplete(input) {
    var list = document.getElementById(input.id + '-list');
    if (!list) return;
    var timer, controller, revision = 0, activeIndex = -1;
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'false');
    list.setAttribute('role', 'listbox');
    function close() {
      list.style.display = 'none';
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      activeIndex = -1;
    }
    function choose(label) {
      revision++;
      clearTimeout(timer);
      if (controller) controller.abort();
      input.value = label;
      list.replaceChildren();
      close();
      input.focus();
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    input.addEventListener('input', function () {
      var query = input.value.trim(), current = ++revision;
      clearTimeout(timer);
      if (controller) controller.abort();
      list.replaceChildren();
      close();
      if (query.length < 3) return;
      timer = setTimeout(function () {
        controller = new AbortController();
        fetch('https://data.geopf.fr/geocodage/search?q=' + encodeURIComponent(query) + '&limit=5&lat=45.485&lon=6.531', { signal: controller.signal })
          .then(function (r) { if (!r.ok) throw new Error('Address lookup unavailable'); return r.json(); })
          .then(function (data) {
            if (current !== revision || document.activeElement !== input) return;
            list.replaceChildren();
            (data.features || []).forEach(function (feature, i) {
              var label = feature.properties && feature.properties.label;
              if (!label) return;
              var option = document.createElement('button');
              option.type = 'button';
              option.className = 'autocomplete-item';
              option.id = list.id + '-option-' + i;
              option.setAttribute('role', 'option');
              option.setAttribute('aria-selected', 'false');
              option.tabIndex = -1;
              option.textContent = label;
              option.addEventListener('mousedown', function (e) { e.preventDefault(); });
              option.addEventListener('click', function () { choose(label); });
              list.appendChild(option);
            });
            if (list.children.length) {
              list.style.display = 'block';
              input.setAttribute('aria-expanded', 'true');
            }
          })
          .catch(function () { if (current === revision) close(); });
      }, 300);
    });
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { revision++; close(); return; }
      if (list.style.display !== 'block' || !list.children.length) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        var count = list.children.length;
        activeIndex = activeIndex < 0 ? (event.key === 'ArrowDown' ? 0 : count - 1) : (activeIndex + (event.key === 'ArrowDown' ? 1 : count - 1)) % count;
        Array.from(list.children).forEach(function (option, i) { option.setAttribute('aria-selected', String(i === activeIndex)); });
        input.setAttribute('aria-activedescendant', list.children[activeIndex].id);
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault(); choose(list.children[activeIndex].textContent);
      }
    });
    input.addEventListener('blur', function () { close(); });
  }
  document.querySelectorAll('.js-address-autocomplete').forEach(setupAddressAutocomplete);

  document.querySelectorAll('.quick-routes-wrap[data-depart]').forEach(function (wrap) {
    var departure = document.getElementById(wrap.dataset.depart);
    var arrival = document.getElementById(wrap.dataset.arrivee);
    var active = arrival;
    if (departure) departure.addEventListener('focus', function () { active = departure; });
    if (arrival) arrival.addEventListener('focus', function () { active = arrival; });
    wrap.querySelectorAll('.chip[data-value]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        if (!active) return;
        active.value = chip.dataset.value;
        active.focus();
        active.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });

  // Pre-remplissage du depart et/ou de la destination depuis un lien "?to=...&from=..."
  // (boutons "Demander un devis" des pages destinations).
  var params = new URLSearchParams(location.search);
  ['to', 'from'].forEach(function (key) {
    var value = params.get(key);
    var prefix = key === 'to' ? 'arrivee-' : 'depart-';
    var target = document.getElementById(prefix + 'fr') || document.getElementById(prefix + 'en');
    if (value && target) target.value = value;
    params.delete(key);
  });
  if (window.history && window.history.replaceState) {
    var query = params.toString();
    window.history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);
  }

  // Suggestion (non forcée) de changer de langue si elle ne correspond pas à celle du navigateur.
  // Volontairement pas de redirection automatique : Google déconseille cette pratique pour le SEO multilingue.
  function initLangBanner() {
    var isFr = (document.documentElement.lang || 'fr').indexOf('fr') === 0;
    var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    var browserIsFr = browserLang.indexOf('fr') === 0;
    var dismissed = false;
    try { dismissed = localStorage.getItem('lang-banner-dismissed') === '1'; } catch (e) {}
    if (dismissed) return;
    var suggestEn = isFr && !browserIsFr;
    var suggestFr = !isFr && browserIsFr;
    if (!suggestEn && !suggestFr) return;
    var switchLink = document.querySelector('.lang-switch');
    var href = switchLink ? switchLink.getAttribute('href') : (suggestEn ? '/en/' : '/');
    var text = suggestEn ? 'It looks like your browser is in English.' : 'On dirait que votre navigateur est en français.';
    var btnLabel = suggestEn ? 'View in English' : 'Voir en français';
    var bar = document.createElement('div');
    bar.className = 'lang-banner';
    var span = document.createElement('span');
    span.textContent = text;
    var link = document.createElement('a');
    link.href = href;
    link.textContent = btnLabel;
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Fermer');
    closeBtn.textContent = '×';
    bar.appendChild(span);
    bar.appendChild(link);
    bar.appendChild(closeBtn);
    document.body.insertBefore(bar, document.body.firstChild);
    closeBtn.addEventListener('click', function () {
      bar.remove();
      try { localStorage.setItem('lang-banner-dismissed', '1'); } catch (e) {}
    });
  }
  initLangBanner();
})();
