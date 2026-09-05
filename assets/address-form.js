(function(){
function setupAddressAutocomplete(input){
var list=document.getElementById(input.id+'-list');
if(!list)return;
var timer=null;
input.addEventListener('input',function(){
var q=input.value.trim();
clearTimeout(timer);
if(q.length<3){list.innerHTML='';list.style.display='none';return;}
timer=setTimeout(function(){
fetch('https://api-adresse.data.gouv.fr/search/?q='+encodeURIComponent(q)+'&limit=5')
.then(function(r){return r.json();})
.then(function(data){
list.innerHTML='';
if(!data.features||!data.features.length){list.style.display='none';return;}
data.features.forEach(function(f){
var item=document.createElement('div');
item.className='autocomplete-item';
item.textContent=f.properties.label;
item.addEventListener('mousedown',function(e){
e.preventDefault();
input.value=f.properties.label;
list.innerHTML='';
list.style.display='none';
});
list.appendChild(item);
});
list.style.display='block';
})
.catch(function(){list.style.display='none';});
},250);
});
input.addEventListener('blur',function(){setTimeout(function(){list.style.display='none';},150);});
input.addEventListener('focus',function(){if(list.innerHTML)list.style.display='block';});
}
document.querySelectorAll('.js-address-autocomplete').forEach(setupAddressAutocomplete);

document.querySelectorAll('.quick-routes-wrap[data-depart]').forEach(function(wrap){
var departInput = document.getElementById(wrap.getAttribute('data-depart'));
var arriveeInput = document.getElementById(wrap.getAttribute('data-arrivee'));
var active = arriveeInput;
if(departInput) departInput.addEventListener('focus', function(){ active = departInput; });
if(arriveeInput) arriveeInput.addEventListener('focus', function(){ active = arriveeInput; });
wrap.querySelectorAll('.chip[data-value]').forEach(function(chip){
chip.addEventListener('click', function(){
if(!active) return;
active.value = chip.getAttribute('data-value');
active.dispatchEvent(new Event('input'));
active.focus();
});
});
});

// Pre-remplissage de la destination depuis un lien "?to=..." (boutons "Demander un devis" des pages destinations)
var toParam = null;
try { toParam = new URLSearchParams(location.search).get('to'); } catch(e){}
if (toParam) {
var target = document.getElementById('arrivee-fr') || document.getElementById('arrivee-en');
if (target) {
target.value = toParam;
target.dispatchEvent(new Event('input'));
}
if (window.history && window.history.replaceState) {
window.history.replaceState(null, '', location.pathname + location.hash);
}
}

// Suggestion (non forcée) de changer de langue si elle ne correspond pas à celle du navigateur.
// Volontairement pas de redirection automatique : Google déconseille cette pratique pour le SEO multilingue.
function initLangBanner(){
var isFr = (document.documentElement.lang || 'fr').indexOf('fr') === 0;
var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
var browserIsFr = browserLang.indexOf('fr') === 0;
var dismissed = false;
try { dismissed = localStorage.getItem('lang-banner-dismissed') === '1'; } catch(e){}
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
closeBtn.textContent = '\u00d7';
bar.appendChild(span);
bar.appendChild(link);
bar.appendChild(closeBtn);
document.body.insertBefore(bar, document.body.firstChild);
closeBtn.addEventListener('click', function(){
bar.remove();
try { localStorage.setItem('lang-banner-dismissed', '1'); } catch(e){}
});
}
initLangBanner();
})();
