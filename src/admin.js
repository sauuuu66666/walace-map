const app = document.querySelector('#admin-app');
if (!app) throw new Error('Missing #admin-app');

const style = document.createElement('style');
style.textContent = `
*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#172033;background:#f4f7fb}button,input,textarea{font:inherit}.page{max-width:1100px;margin:auto;padding:24px}.header{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px}.title{display:flex;align-items:center;gap:12px}.logo{display:grid;place-items:center;width:48px;height:48px;border-radius:14px;background:#152238;color:#ffc400;font-size:28px}h1{margin:0;font-size:24px}.subtitle{margin:3px 0 0;color:#64748b;font-size:13px}.back{padding:9px 12px;border-radius:9px;background:#e8eef5;color:#172033;text-decoration:none;font-weight:700}.grid{display:grid;grid-template-columns:360px 1fr;gap:18px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 6px 24px rgb(15 23 42/6%);padding:18px}.card h2{font-size:17px;margin:0 0 14px}label{display:block;margin:11px 0 5px;font-size:12px;font-weight:700}input,textarea{width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff}textarea{height:84px;resize:vertical}.row{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}button,.file-button{border:0;border-radius:9px;padding:9px 11px;background:#e8eef5;color:#172033;font-weight:700;font-size:13px;cursor:pointer;text-decoration:none;text-align:center}.primary{background:#0b6ea8;color:#fff;flex:1}.danger{color:#b42318}.secondary{background:#eef6ff;color:#075985}.status{margin:12px 0;color:#64748b;font-size:12px;white-space:pre-wrap}.toolbar{display:flex;gap:8px;margin-bottom:12px}.toolbar input{flex:1}.item{padding:14px 0;border-top:1px solid #e2e8f0}.item:first-child{border-top:0}.item-title{font-weight:700}.coords{color:#64748b;font-size:12px;margin-top:3px}.tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}.tag{padding:3px 7px;border-radius:999px;background:#e0f2fe;color:#075985;font-size:11px;font-weight:700}.item-actions{display:flex;gap:7px;margin-top:9px}.empty{color:#64748b;padding:18px 0}.notice{padding:10px 12px;border-radius:9px;background:#fff7ed;color:#9a3412;font-size:12px;margin-bottom:12px}.edit-mode{background:#fefce8;border-color:#fde68a}@media(max-width:800px){.grid{grid-template-columns:1fr}.header{align-items:flex-start}.page{padding:14px}}
`;
document.head.appendChild(style);

app.innerHTML = `
<div class="page">
  <header class="header">
    <div class="title"><div class="logo">★</div><div><h1>Wplace 地点管理</h1><p class="subtitle">公開用 locations.json を作成</p></div></div>
    <a class="back" href="/">閲覧ページへ</a>
  </header>
  <div class="notice">この管理画面はローカル利用向けです。公開環境へ配置するとURLを知る人が開けるため、Vercelへは admin.html と admin.js を含めない運用を推奨します。</div>
  <div class="grid">
    <section class="card" id="editor-card">
      <h2 id="editor-title">地点を追加</h2>
      <label for="url">Wplace共有リンク</label>
      <input id="url" placeholder="https://wplace.live/?lat=...&lng=...">
      <label for="note">メモ</label>
      <textarea id="note" placeholder="地点の説明"></textarea>
      <label for="tags">タグ</label>
      <input id="tags" placeholder="日本, イベント, 制作中">
      <div class="row"><button class="primary" id="save">追加</button><button id="cancel" hidden>編集をキャンセル</button></div>
      <div class="status" id="status">public/locations.json または既存JSONを読み込んで編集できます。</div>
      <div class="row">
        <label class="file-button secondary" for="import">JSON/TXT読込</label>
        <input id="import" type="file" accept=".json,.txt,.md,application/json,text/plain,text/markdown" hidden>
        <button class="secondary" id="export">locations.json 出力</button>
        <button class="danger" id="clear">全削除</button>
      </div>
    </section>
    <section class="card">
      <h2>登録地点</h2>
      <div class="toolbar"><input id="search" placeholder="メモ・タグ・座標を検索"><button id="sort">名前順</button></div>
      <div id="list"></div>
    </section>
  </div>
</div>`;

const $ = s => document.querySelector(s);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let items = [];
let editingId = null;

function parseUrl(value) {
  try {
    const url = new URL(value.trim());
    if (url.hostname !== 'wplace.live' || !url.searchParams.has('lat') || !url.searchParams.has('lng')) return null;
    const lat = Number(url.searchParams.get('lat'));
    const lng = Number(url.searchParams.get('lng'));
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    return { url: url.href, lat, lng };
  } catch { return null; }
}
function parseTags(value) { return [...new Set(String(value).split(/[,、\n]/).map(x => x.trim().replace(/^#/, '')).filter(Boolean))]; }
function createItem(parsed, note, tags) { return { id: crypto.randomUUID(), ...parsed, note: note.trim() || 'メモなし', tags: parseTags(tags) }; }
function setStatus(text, error=false) { $('#status').textContent=text; $('#status').style.color=error?'#b42318':'#64748b'; }
function resetEditor() { editingId=null; $('#url').value=''; $('#note').value=''; $('#tags').value=''; $('#editor-title').textContent='地点を追加'; $('#save').textContent='追加'; $('#cancel').hidden=true; $('#editor-card').classList.remove('edit-mode'); }
function visibleItems() { const q=$('#search').value.trim().toLowerCase(); return q?items.filter(x=>[x.note,x.url,x.lat,x.lng,...(x.tags||[])].some(v=>String(v).toLowerCase().includes(q))):items; }
function render() {
  const visible=visibleItems();
  $('#list').innerHTML=visible.map(item=>`<div class="item"><div class="item-title">★ ${esc(item.note)}</div><div class="coords">${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}</div>${item.tags?.length?`<div class="tags">${item.tags.map(tag=>`<span class="tag">#${esc(tag)}</span>`).join('')}</div>`:''}<div class="item-actions"><button data-edit="${esc(item.id)}">編集</button><a class="file-button" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Wplace</a><button class="danger" data-delete="${esc(item.id)}">削除</button></div></div>`).join('')||'<div class="empty">地点はまだありません。</div>';
  setStatus(`登録 ${items.length}件 / 表示 ${visible.length}件`);
}
function normalizeJson(data) {
  const source=Array.isArray(data)?data:Array.isArray(data?.items)?data.items:[];
  return source.map((item,index)=>{
    if(typeof item==='string'){const match=item.match(/https?:\/\/wplace\.live\/[^\s<>"]*/i);if(!match)return null;const parsed=parseUrl(match[0]);return parsed?createItem(parsed,item.replace(match[0],'').replace(/^[-*•・\s]+/,'').trim(),[]):null;}
    if(!item||typeof item!=='object')return null;
    const parsed=parseUrl(item.url||item.link||item.href||'');
    const lat=parsed?.lat??Number(item.lat),lng=parsed?.lng??Number(item.lng),url=parsed?.url||(item.url||item.link||item.href||'');
    if(!Number.isFinite(lat)||!Number.isFinite(lng))return null;
    return {id:item.id||`item-${Date.now()}-${index}`,url,lat,lng,note:item.note||item.memo||item.title||item.name||'メモなし',tags:Array.isArray(item.tags)?parseTags(item.tags.join(',')):parseTags(item.tags||'')};
  }).filter(Boolean);
}
function parseText(text) {
  const result=[];let pending='';
  for(const raw of String(text).replace(/\r/g,'').split('\n')){
    const line=raw.trim();if(!line)continue;const clean=line.replace(/^[-*+•・‣◦]\s*/,'').replace(/^\d+[.)]\s*/,'');
    const match=clean.match(/https?:\/\/wplace\.live\/[^\s<>"]*/i);
    if(!match){pending=clean;continue;}const parsed=parseUrl(match[0].replace(/[),.;。]+$/,''));if(!parsed)continue;
    const before=clean.slice(0,match.index).replace(/\s*[-:：|]\s*$/,'').trim();const after=clean.slice(match.index+match[0].length).replace(/^\s*[-:：|]\s*/,'').trim();result.push(createItem(parsed,before||after||pending,[]));pending='';
  }return result;
}

$('#save').onclick=()=>{
  const parsed=parseUrl($('#url').value);if(!parsed)return setStatus('lat と lng を含むWplace共有リンクを入力してください。',true);
  if(editingId){const item=items.find(x=>x.id===editingId);Object.assign(item,parsed,{note:$('#note').value.trim()||'メモなし',tags:parseTags($('#tags').value)});setStatus('地点を更新しました。');}
  else{items.push(createItem(parsed,$('#note').value,$('#tags').value));setStatus('地点を追加しました。');}
  resetEditor();render();
};
$('#cancel').onclick=resetEditor;
$('#search').oninput=render;
$('#sort').onclick=()=>{items.sort((a,b)=>a.note.localeCompare(b.note,'ja'));render();};
$('#list').onclick=e=>{
  const edit=e.target.dataset.edit,del=e.target.dataset.delete;
  if(edit){const item=items.find(x=>x.id===edit);if(!item)return;editingId=item.id;$('#url').value=item.url;$('#note').value=item.note;$('#tags').value=(item.tags||[]).join(', ');$('#editor-title').textContent='地点を編集';$('#save').textContent='更新';$('#cancel').hidden=false;$('#editor-card').classList.add('edit-mode');window.scrollTo({top:0,behavior:'smooth'});}
  if(del&&confirm('この地点を削除しますか？')){items=items.filter(x=>x.id!==del);if(editingId===del)resetEditor();render();}
};
$('#clear').onclick=()=>{if(confirm('すべての地点を削除しますか？')){items=[];resetEditor();render();}};
$('#export').onclick=()=>{const clean=items.map(({id,...item})=>item);const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([JSON.stringify(clean,null,2)],{type:'application/json'}));link.download='locations.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);};
$('#import').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{const text=await file.text();let incoming=[];try{incoming=normalizeJson(JSON.parse(text));}catch{incoming=parseText(text);}if(!incoming.length)throw new Error('有効なWplace地点がありません');const known=new Set(items.map(x=>`${x.lat.toFixed(6)},${x.lng.toFixed(6)}`));let added=0;for(const item of incoming){const key=`${item.lat.toFixed(6)},${item.lng.toFixed(6)}`;if(known.has(key))continue;known.add(key);items.push(item);added++;}render();setStatus(`${added}件を読み込みました。`);}catch(error){setStatus(`読込失敗: ${error.message}`,true);}finally{e.target.value='';}};

(async()=>{try{const response=await fetch(`${import.meta.env.BASE_URL}locations.json`,{cache:'no-store'});if(response.ok){items=normalizeJson(await response.json());render();setStatus(`public/locations.json から ${items.length}件を読み込みました。`);}else render();}catch{render();}})();
