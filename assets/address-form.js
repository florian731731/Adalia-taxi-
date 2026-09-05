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
})();
