const app = document.querySelector('#app');
if (!app) throw new Error('index.html に #app がありません');

const style = document.createElement('style');
style.textContent = `
*{box-sizing:border-box}html,body,#app{width:100%;height:100%;margin:0}body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#172033;background:#f4f7fb;overflow:hidden}
#app{display:grid;grid-template-columns:340px 1fr}.sidebar{height:100vh;overflow:auto;padding:18px;background:#fff;border-right:1px solid #dce3ec;z-index:2}.title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:16px}.title{display:flex;gap:11px;align-items:center}.language-switch{display:flex;gap:3px}.language-button{padding:5px 7px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;color:#475569;font-size:11px}.language-button.active{border-color:#0b6ea8;background:#0b6ea8;color:#fff}.logo{display:grid;place-items:center;width:46px;height:46px;border-radius:14px;background:#152238;color:#ffc400;font-size:28px}h1{margin:0;font-size:21px}.toolbar{display:flex;gap:8px;margin-bottom:12px}input{width:100%;padding:10px;border:1px solid #dce3ec;border-radius:9px;font:inherit}button,.link-button{padding:9px 11px;border:0;border-radius:9px;background:#e8eef5;color:#172033;font-weight:700;font-size:13px;cursor:pointer;text-decoration:none;text-align:center}.filter-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}.filter-actions{display:flex;align-items:center;gap:6px}.tags-toggle{padding:5px 8px;font-size:12px}.filter-label{font-size:12px;font-weight:700;color:#475569}.mode-switch{display:flex;gap:4px}.mode-button{padding:5px 9px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#334155;font-size:12px}.mode-button.active{border-color:#7c3aed;background:#7c3aed;color:#fff}.tag-filter{display:grid;gap:10px;margin-bottom:12px;overflow:hidden;max-height:3000px;opacity:1;transition:max-height .22s ease,opacity .16s ease,margin .22s ease}.tag-filter.tags-collapsed{max-height:0;opacity:0;margin-bottom:0;pointer-events:none}.tag-group{display:grid;gap:6px}.tag-group-title{font-family:"Courier New",monospace;font-size:11px;font-weight:800;color:#475569;text-transform:uppercase}.tag-group-buttons{display:flex;flex-wrap:wrap;gap:6px}.tag-chip{padding:5px 9px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;color:#334155;font-size:12px}.tag-chip.active{border-color:#0b6ea8;background:#0b6ea8;color:#fff}.status{margin:10px 0;color:#64748b;font-size:12px}.error{color:#b42318}.item{padding:11px 2px;border-top:1px solid #dce3ec}.item b,.item small{display:block}.item small{margin-top:3px;color:#64748b}.item-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}.tag{padding:3px 7px;border-radius:999px;background:#e0f2fe;color:#075985;font-size:11px;font-weight:700}.item-actions{display:flex;gap:7px;margin-top:7px}.empty{padding:16px 0;color:#64748b}#map{position:relative;width:100%;height:100vh;min-width:300px;min-height:400px;background:#dbeafe}.star-marker{display:grid;place-items:center;width:34px;height:34px;color:#ffc400;font-size:30px;-webkit-text-stroke:2px #263238;filter:drop-shadow(0 2px 2px #0008);cursor:pointer}.popup-link{display:inline-block;margin-top:8px;padding:7px 10px;border-radius:8px;background:#172033;color:#fff;text-decoration:none;font-weight:700}.maplibregl-map{overflow:hidden;position:relative}.maplibregl-canvas{left:0;position:absolute;top:0}.maplibregl-marker{left:0;position:absolute;top:0}.maplibregl-popup{display:flex;left:0;pointer-events:none;position:absolute;top:0}.maplibregl-popup-content{background:#fff;border-radius:12px;box-shadow:0 1px 3px #0003;padding:12px;pointer-events:auto;position:relative}.maplibregl-popup-close-button{position:absolute;right:0;top:0;border:0;background:transparent}.maplibregl-ctrl-top-right{position:absolute;right:0;top:0;z-index:2}.maplibregl-ctrl{float:right;margin:10px 10px 0 0}.maplibregl-ctrl-group{background:#fff;border-radius:4px;box-shadow:0 0 0 2px #0002;overflow:hidden}.maplibregl-ctrl-group button{display:block;width:29px;height:29px;padding:0;background:#fff}

/* Pixel-style UI */
.logo{
  border-radius:0;
  border:3px solid #172033;
  box-shadow:4px 4px 0 #ffc400;
}
button,.link-button,input,.language-button,.mode-button,.tag-chip,.popup-link{
  border-radius:0!important;
  border:2px solid #172033!important;
  box-shadow:3px 3px 0 #172033;
  font-family:"Courier New",monospace;
  font-weight:700;
  transition:transform .06s,box-shadow .06s;
}
button:hover,.link-button:hover,.language-button:hover,.mode-button:hover,.tag-chip:hover,.popup-link:hover{
  transform:translate(-1px,-1px);
  box-shadow:4px 4px 0 #172033;
}
button:active,.link-button:active,.language-button:active,.mode-button:active,.tag-chip:active,.popup-link:active{
  transform:translate(3px,3px);
  box-shadow:0 0 0 #172033;
}
input:focus{
  outline:3px solid #ffc400;
  outline-offset:2px;
}
.language-button.active,.tag-chip.active{
  border-color:#172033!important;
  background:#0b6ea8;
  color:#fff;
}
.mode-button.active{
  border-color:#172033!important;
  background:#7c3aed;
  color:#fff;
}
.tag{
  border-radius:0;
  border:1px solid #075985;
  box-shadow:2px 2px 0 #075985;
  font-family:"Courier New",monospace;
}
.maplibregl-popup-content{
  border-radius:0;
  border:3px solid #172033;
  box-shadow:5px 5px 0 #172033;
}
.maplibregl-ctrl-group{
  border-radius:0;
  border:2px solid #172033;
  box-shadow:3px 3px 0 #172033;
}
.maplibregl-ctrl-group button{
  border:0!important;
  border-bottom:1px solid #172033!important;
  box-shadow:none;
  transform:none;
}
.sidebar{border-right:3px solid #172033}
.title{min-width:0}.title h1{overflow-wrap:anywhere}.language-switch{flex:0 0 auto}
button:focus-visible,.link-button:focus-visible,input:focus-visible{outline:3px solid #ffc400;outline-offset:3px}

#app{transition:grid-template-columns .2s ease}.sidebar{transition:transform .2s ease,opacity .2s ease;min-width:0}.panel-toggle{position:fixed;left:352px;top:14px;z-index:50;min-width:44px;height:38px;padding:5px 9px;background:#ffc400;color:#172033}#app.panel-collapsed{grid-template-columns:0 1fr}#app.panel-collapsed .sidebar{transform:translateX(-100%);opacity:0;pointer-events:none}#app.panel-collapsed .panel-toggle{left:14px}
@media(max-width:760px){body{overflow:hidden}#app{display:block;position:relative}.sidebar{position:absolute;inset:0 0 auto 0;width:100%;height:46vh;border-right:0;border-bottom:3px solid #172033;z-index:20}#map{height:100vh;width:100%}.panel-toggle{left:auto;right:16px;top:auto;bottom:calc(22px + env(safe-area-inset-bottom));z-index:50}#app.panel-collapsed .sidebar{transform:translateY(-105%);opacity:0;pointer-events:none}#app.panel-collapsed .panel-toggle{left:auto;right:16px;top:auto;bottom:calc(22px + env(safe-area-inset-bottom))}.language-switch{padding-right:0}}
`;
document.head.appendChild(style);

app.innerHTML = `<aside class="sidebar" id="sidebar">
<div class="title-row"><div class="title"><div class="logo">★</div><div><h1 data-i18n="title">Wplace 分布マップ</h1></div></div><div class="language-switch"><button class="language-button active" data-lang="ja">日本語</button><button class="language-button" data-lang="en">English</button></div></div>
<div class="toolbar"><input id="search" data-i18n-placeholder="searchPlaceholder" placeholder="メモ・座標・タグを検索"><button id="fit" data-i18n="fitAll">全体表示</button></div>
<div class="filter-head"><span class="filter-label" data-i18n="tagSearch">タグ検索</span><div class="filter-actions"><div class="mode-switch"><button class="mode-button active" data-mode="AND">AND</button><button class="mode-button" data-mode="OR">OR</button></div><button id="tags-toggle" class="tags-toggle" type="button" aria-controls="tag-filter" aria-expanded="true">▲</button></div></div><div id="tag-filter" class="tag-filter"></div><div id="status" class="status" data-i18n="loading">読み込み中...</div><div id="list"></div>
</aside><button id="panel-toggle" class="panel-toggle" type="button" aria-controls="sidebar" aria-expanded="true">◀</button><main id="map"><div style="padding:24px" id="map-message">地図を準備中...</div></main>`;

const $ = s => document.querySelector(s);
const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let savedLanguage='en',savedPanelState=false;try{savedLanguage=localStorage.getItem('wplace-language')||'en';savedPanelState=localStorage.getItem('wplace-panel-collapsed')==='true';}catch{}
let items=[], activeTags=new Set(), tagMode='AND', language=savedLanguage, panelCollapsed=savedPanelState, tagsCollapsed=false, map=null, maplibregl=null, markers=[];
const translations={
 ja:{title:'Wplace 分布マップ',searchPlaceholder:'メモ・座標・タグを検索',fitAll:'全体表示',tagSearch:'タグ検索',loading:'読み込み中...',all:'すべて',noResults:'該当地点はありません。',noNote:'メモなし',showOnMap:'地図で表示',openWplace:'Wplaceで開く',publicPoints:'公開地点',shown:'表示',mapError:'地図エラー',mapStartError:'地図起動失敗',dataError:'locations.json 読込失敗',hidePanel:'地図',showPanel:'メニュー',faction:'陣営',character:'キャラクター',other:'その他',hideTags:'タグを閉じる',showTags:'タグを開く'},
 en:{title:'Wplace Location Map',searchPlaceholder:'Search notes, coordinates, or tags',fitAll:'Fit all',tagSearch:'Tag filter',loading:'Loading...',all:'All',noResults:'No matching locations.',noNote:'No note',showOnMap:'Show on map',openWplace:'Open in Wplace',publicPoints:'Public locations',shown:'Shown',mapError:'Map error',mapStartError:'Failed to start map',dataError:'Failed to load locations.json',hidePanel:'Map',showPanel:'Menu',faction:'Faction',character:'Character',other:'Other',hideTags:'Hide tags',showTags:'Show tags'}
};
const tr=key=>translations[language][key]||key;
const setStatus=(t,e=false)=>{$('#status').textContent=t;$('#status').classList.toggle('error',e)};
function applyLanguage(){document.documentElement.lang=language;document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=tr(el.dataset.i18n));document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>el.placeholder=tr(el.dataset.i18nPlaceholder));document.querySelectorAll('[data-lang]').forEach(button=>button.classList.toggle('active',button.dataset.lang===language));updatePanelToggle();updateTagsToggle();render();}

function updatePanelToggle(){document.querySelector('#app').classList.toggle('panel-collapsed',panelCollapsed);const button=$('#panel-toggle');const label=panelCollapsed?tr('showPanel'):tr('hidePanel');button.textContent=panelCollapsed?`▶ ${label}`:`◀ ${label}`;button.setAttribute('aria-expanded',String(!panelCollapsed));button.title=label;}
function togglePanel(){panelCollapsed=!panelCollapsed;try{localStorage.setItem('wplace-panel-collapsed',String(panelCollapsed));}catch{}updatePanelToggle();requestAnimationFrame(()=>map?.resize());setTimeout(()=>map?.resize(),230);}
function updateTagsToggle(){const area=$('#tag-filter'),button=$('#tags-toggle');area.classList.toggle('tags-collapsed',tagsCollapsed);button.textContent=tagsCollapsed?'▼':'▲';button.title=tagsCollapsed?tr('showTags'):tr('hideTags');button.setAttribute('aria-label',button.title);button.setAttribute('aria-expanded',String(!tagsCollapsed));}
function toggleTags(){tagsCollapsed=!tagsCollapsed;updateTagsToggle();}
function normalize(data){
 const src=Array.isArray(data)?data:Array.isArray(data?.items)?data.items:[];
 return src.map((x,i)=>{
  if(!x||typeof x!=='object')return null;
  let url=String(x.url||x.link||'').trim();
  let lat=Number(x.lat),lng=Number(x.lng);
  if(url){
   try{
    const parsed=new URL(url);
    if(parsed.protocol!=='https:'||parsed.hostname!=='wplace.live')return null;
    if((!Number.isFinite(lat)||!Number.isFinite(lng))&&parsed.searchParams.has('lat')&&parsed.searchParams.has('lng')){
     lat=Number(parsed.searchParams.get('lat'));
     lng=Number(parsed.searchParams.get('lng'));
    }
    url=parsed.href;
   }catch{return null;}
  }
  if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return null;
  const raw=Array.isArray(x.tags)?x.tags:typeof x.tags==='string'?x.tags.split(/[,、]/):[];
  return{id:String(x.id||`p-${i}`),url,lat,lng,note:String(x.note||x.memo||x.title||tr('noNote')),tags:[...new Set(raw.map(t=>String(t).trim()).filter(Boolean))]};
 }).filter(Boolean);
}
const FACTION_TAGS=new Set(['Phaethon','Cunning Hares','Belobog','Victoria Housekeeping','Obol Squad','Special Response Team','Sons of Calydon','Section 6','Stars of Lyra','Silver Squad','Mockingbird','Yunkui Summit','Spook Shack','Krampus','Angels of Delusion','Metropolitan Order','External Strategy','Covenant of Dayat','Airspace Patrol','Flint Workshop']);
const CHARACTER_TAGS=new Set(['Pyrois','Anby','Billy','Nekomata','Nicole','Starlight Billy','Anton','Ben','Grace','Koleda','Rina','Corin','Ellen','Lycaon','Soldier 11','Trigger','Seed','Orphie & Magus','Zhu Yuan','Qingyi','Jane Doe','Seth','Lucy','Piper','Caesar','Burnice','Lighter','Pulchra','Soukaku','Yanagi','Harumasa','Miyabi','Astra Yao','Evelyn','Soldier 0 Anby','Vivian','Hugo','Pan Yinhu','Yixuan','Ju Fufu','Ye Shunguang','Yuzuha','Alice','Manato','Lucia','Yidhari','Dialyn','Banyue','Zhao','Promeia','Sunna','Aria','Nangong Yu','Cissia','Velina','Norma','Remielle','Sigrid','Claret','Roxy']);
function allTags(){return [...new Set(items.flatMap(x=>x.tags))];}
function groupedTags(){const groups={faction:[],character:[],other:[]};for(const tag of allTags()){if(FACTION_TAGS.has(tag))groups.faction.push(tag);else if(CHARACTER_TAGS.has(tag))groups.character.push(tag);else groups.other.push(tag);}Object.values(groups).forEach(tags=>tags.sort((a,b)=>a.localeCompare(b,'en')));return groups;}
function visible(){const q=$('#search').value.trim().toLowerCase();return items.filter(x=>{const matchesText=!q||[x.note,x.lat,x.lng,...x.tags].some(v=>String(v).toLowerCase().includes(q));const matchesTags=activeTags.size===0||(tagMode==='AND'?[...activeTags].every(tag=>x.tags.includes(tag)):[...activeTags].some(tag=>x.tags.includes(tag)));return matchesText&&matchesTags;});}
function renderTags(){document.querySelectorAll('[data-mode]').forEach(button=>button.classList.toggle('active',button.dataset.mode===tagMode));const groups=groupedTags();const allButton=`<button class="tag-chip ${activeTags.size===0?'active':''}" data-clear-tags="1">${tr('all')}</button>`;const groupHtml=['faction','character','other'].filter(key=>groups[key].length).map(key=>`<section class="tag-group"><div class="tag-group-title">${tr(key)}</div><div class="tag-group-buttons">${groups[key].map(tag=>`<button class="tag-chip ${activeTags.has(tag)?'active':''}" data-tag="${esc(tag)}">#${esc(tag)}</button>`).join('')}</div></section>`).join('');$('#tag-filter').innerHTML=`<div class="tag-group"><div class="tag-group-buttons">${allButton}</div></div>${groupHtml}`;updateTagsToggle();}
function clearMarkers(){markers.forEach(m=>m.remove());markers=[];}
function render(){
 const data=visible();clearMarkers();
 if(map&&maplibregl)data.forEach(x=>{const el=document.createElement('div');el.className='star-marker';el.textContent='★';const tagHtml=x.tags.length?`<div class="item-tags">${x.tags.map(t=>`<span class="tag">#${esc(t)}</span>`).join('')}</div>`:'';const link=x.url?`<br><a class="popup-link" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${tr('openWplace')}</a>`:'';const popup=new maplibregl.Popup({offset:22}).setHTML(`<b>${esc(x.note)}</b><br>${x.lat.toFixed(5)}, ${x.lng.toFixed(5)}${tagHtml}${link}`);markers.push(new maplibregl.Marker({element:el,anchor:'center'}).setLngLat([x.lng,x.lat]).setPopup(popup).addTo(map));});
 $('#list').innerHTML=data.map(x=>`<div class="item"><b>★ ${esc(x.note)}</b><small>${x.lat.toFixed(5)}, ${x.lng.toFixed(5)}</small>${x.tags.length?`<div class="item-tags">${x.tags.map(t=>`<span class="tag">#${esc(t)}</span>`).join('')}</div>`:''}<div class="item-actions"><button data-id="${esc(x.id)}">${tr('showOnMap')}</button>${x.url?`<a class="link-button" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">Wplace</a>`:''}</div></div>`).join('')||`<div class="empty">${tr('noResults')}</div>`;
 renderTags();const separator=tagMode==='AND'?' + ':' / ';const selected=activeTags.size?` / ${tagMode}: ${[...activeTags].map(tag=>`#${tag}`).join(separator)}`:'';setStatus(`${tr('publicPoints')} ${items.length} / ${tr('shown')} ${data.length}${selected}`);
}
function fit(){const data=visible();if(!map||!data.length)return;if(data.length===1){map.flyTo({center:[data[0].lng,data[0].lat],zoom:9});return}const b=new maplibregl.LngLatBounds();data.forEach(x=>b.extend([x.lng,x.lat]));map.fitBounds(b,{padding:70,maxZoom:10});}

$('#panel-toggle').onclick=togglePanel;
$('#tags-toggle').onclick=toggleTags;
document.querySelector('.language-switch').onclick=e=>{const lang=e.target.dataset.lang;if(!lang||lang===language)return;language=lang;try{localStorage.setItem('wplace-language',language);}catch{}applyLanguage();};
$('#search').oninput=()=>{render();if(map&&visible().length)fit();};
$('#fit').onclick=fit;
document.querySelector('.mode-switch').onclick=e=>{const mode=e.target.dataset.mode;if(!mode||mode===tagMode)return;tagMode=mode;render();if(map&&visible().length)fit();};
$('#tag-filter').onclick=e=>{if(e.target.dataset.clearTags!==undefined){activeTags.clear();}else{const tag=e.target.dataset.tag;if(!tag)return;activeTags.has(tag)?activeTags.delete(tag):activeTags.add(tag);}render();if(map&&visible().length)fit();};
$('#list').onclick=e=>{const id=e.target.dataset.id;if(!id||!map)return;const x=items.find(v=>v.id===id);if(x)map.flyTo({center:[x.lng,x.lat],zoom:10});};

async function loadData(){try{const r=await fetch(`${import.meta.env.BASE_URL}locations.json`,{cache:'no-store'});if(!r.ok)throw new Error(`HTTP ${r.status}`);items=normalize(await r.json());render();if(map)fit();}catch(e){setStatus(`${tr('dataError')}: ${e.message}`,true)}}
async function initMap(){try{const mod=await import('maplibre-gl');maplibregl=mod.default||mod;$('#map-message').remove();map=new maplibregl.Map({container:'map',style:{version:8,sources:{osm:{type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256,maxzoom:19,attribution:'© OpenStreetMap contributors'}},layers:[{id:'osm',type:'raster',source:'osm'}]},center:[135.5,34.2],zoom:3,dragRotate:false,pitchWithRotate:false,bearing:0,pitch:0});map.touchZoomRotate.disableRotation();map.keyboard.disableRotation();map.addControl(new maplibregl.NavigationControl({showCompass:false,showZoom:true,visualizePitch:false}),'top-right');map.on('load',()=>{map.resize();render();if(items.length)fit()});map.on('error',e=>setStatus(`${tr('mapError')}: ${e.error?.message||'Unknown'}`,true));}catch(e){setStatus(`${tr('mapStartError')}: ${e.message}`,true)}}
applyLanguage();
Promise.all([loadData(),initMap()]);
