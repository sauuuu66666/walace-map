const app = document.querySelector('#admin-app');
if (!app) throw new Error('Missing #admin-app');

const style = document.createElement('style');
style.textContent = `
*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#172033;background:#f4f7fb}button,input,textarea{font:inherit}.page{max-width:1100px;margin:auto;padding:24px}.header{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px}.title{display:flex;align-items:center;gap:12px}.logo{display:grid;place-items:center;width:48px;height:48px;border-radius:14px;background:#152238;color:#ffc400;font-size:28px}h1{margin:0;font-size:24px}.subtitle{margin:3px 0 0;color:#64748b;font-size:13px}.back{padding:9px 12px;border-radius:9px;background:#e8eef5;color:#172033;text-decoration:none;font-weight:700}.grid{display:grid;grid-template-columns:360px 1fr;gap:18px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 6px 24px rgb(15 23 42/6%);padding:18px}.card h2{font-size:17px;margin:0 0 14px}label{display:block;margin:11px 0 5px;font-size:12px;font-weight:700}input,textarea{width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff}textarea{height:84px;resize:vertical}.row{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}button,.file-button{border:0;border-radius:9px;padding:9px 11px;background:#e8eef5;color:#172033;font-weight:700;font-size:13px;cursor:pointer;text-decoration:none;text-align:center}.primary{background:#0b6ea8;color:#fff;flex:1}.danger{color:#b42318}.secondary{background:#eef6ff;color:#075985}.status{margin:12px 0;color:#64748b;font-size:12px;white-space:pre-wrap}.toolbar{display:flex;gap:8px;margin-bottom:12px}.toolbar input{flex:1}.item{padding:14px 0;border-top:1px solid #e2e8f0}.item:first-child{border-top:0}.item-title{font-weight:700}.coords{color:#64748b;font-size:12px;margin-top:3px}.tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}.tag{padding:3px 7px;border-radius:999px;background:#e0f2fe;color:#075985;font-size:11px;font-weight:700}.preset-tags{display:grid;gap:10px;margin-top:8px}.preset-group-title{font-size:11px;font-weight:800;color:#64748b;margin-bottom:5px}.preset-buttons{display:flex;flex-wrap:wrap;gap:6px}.preset-tag{padding:6px 9px;border:1px solid #94a3b8;background:#fff;color:#334155}.preset-tag.active{border-color:#0b6ea8;background:#0b6ea8;color:#fff}.selected-tags{min-height:30px;display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;padding:8px;border:1px dashed #94a3b8}.selected-tag{padding:4px 8px;border-radius:999px;background:#dbeafe;color:#1e40af;font-size:12px;font-weight:700}.tag-help{margin-top:5px;color:#64748b;font-size:11px}.item-actions{display:flex;gap:7px;margin-top:9px}.empty{color:#64748b;padding:18px 0}.notice{padding:10px 12px;border-radius:9px;background:#fff7ed;color:#9a3412;font-size:12px;margin-bottom:12px}.edit-mode{background:#fefce8;border-color:#fde68a}@media(max-width:800px){.grid{grid-template-columns:1fr}.header{align-items:flex-start}.page{padding:14px}}
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
      <label>プリセットタグ</label><div id="preset-tags" class="preset-tags"></div>
      <label for="tags">カスタムタグ</label><input id="tags" placeholder="カンマ区切りで追加">
      <div class="tag-help">キャラクターを選ぶと Character と所属陣営、ボンプを選ぶと Bangboo が自動追加されます。</div>
      <label>選択中のタグ</label><div id="selected-tags" class="selected-tags"></div>
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
const TAG_GROUPS = {
  Subject: ['Character', 'Bangboo'],
  Status: ['Planned','WIP','Completed'],
  Type: ['Project','Event','Official','Alliance'],
  Region: ['Japan','Asia','Europe','North America','South America','Oceania','Africa'],
  Faction: ['Phaethon', 'Cunning Hares', 'Belobog', 'Victoria Housekeeping', 'Obol Squad', 'Special Response Team', 'Sons of Calydon', 'Section 6', 'Stars of Lyra', 'Silver Squad', 'Mockingbird', 'Yunkui Summit', 'Spook Shack', 'Krampus', 'Angels of Delusion', 'Metropolitan Order', 'External Strategy', 'Covenant of Dayat', 'Airspace Patrol', 'Flint Workshop'],
  Bangboo: ['Eous', 'Agent Gulliver', 'Amillion', 'Ariel', 'Avocaboo', 'Baddieboo', 'Bagboo', 'Bangvolver', 'Belion', 'Biggest Fan', 'Bild N. Boolok', 'Birkblick', 'Boollseye', 'Booltergeist', 'Booressure', 'Brawlerboo', 'Butler', 'Cryboo', 'Devilboo', 'Electroboo', 'Excaliboo', 'Exploreboo', 'Knightboo', 'Luckyboo', 'Magnetiboo', 'Mercury', 'Miss Esme', 'Officer Cui', 'Overtimeboo', 'Paperboo', 'Penguinboo', 'Plugboo', 'Red Moccus', 'Resonaboo', 'Robin', 'Rocketboo', 'Safety', 'Sharkboo', 'Snap', 'Sprout', 'Sumoboo', 'Ultra Jake'],
  Character: ['Belle', 'Wise', 'Phoenix', 'Severian', 'The Storyteller', 'Sunbringer', 'Pyrois', 'Anby', 'Billy', 'Nekomata', 'Nicole', 'Starlight Billy', 'Anton', 'Ben', 'Grace', 'Koleda', 'Rina', 'Corin', 'Ellen', 'Lycaon', 'Soldier 11', 'Trigger', 'Seed', 'Orphie & Magus', 'Zhu Yuan', 'Qingyi', 'Jane Doe', 'Seth', 'Lucy', 'Piper', 'Caesar', 'Burnice', 'Lighter', 'Pulchra', 'Soukaku', 'Yanagi', 'Harumasa', 'Miyabi', 'Astra Yao', 'Evelyn', 'Soldier 0 Anby', 'Vivian', 'Hugo', 'Pan Yinhu', 'Yixuan', 'Ju Fufu', 'Ye Shunguang', 'Yuzuha', 'Alice', 'Manato', 'Lucia', 'Yidhari', 'Dialyn', 'Banyue', 'Zhao', 'Promeia', 'Sunna', 'Aria', 'Nangong Yu', 'Cissia', 'Velina', 'Norma', 'Remielle', 'Sigrid', 'Claret', 'Roxy']
};
const CHARACTER_FACTIONS = new Map([['Belle', 'Phaethon'], ['Wise', 'Phaethon'], ['Phoenix', 'Krampus'], ['Severian', 'Metropolitan Order'], ['The Storyteller', ''], ['Sunbringer', ''], ['Pyrois', 'Phaethon'], ['Anby', 'Cunning Hares'], ['Billy', 'Cunning Hares'], ['Nekomata', 'Cunning Hares'], ['Nicole', 'Cunning Hares'], ['Starlight Billy', 'Cunning Hares'], ['Anton', 'Belobog'], ['Ben', 'Belobog'], ['Grace', 'Belobog'], ['Koleda', 'Belobog'], ['Rina', 'Victoria Housekeeping'], ['Corin', 'Victoria Housekeeping'], ['Ellen', 'Victoria Housekeeping'], ['Lycaon', 'Victoria Housekeeping'], ['Soldier 11', 'Obol Squad'], ['Trigger', 'Obol Squad'], ['Seed', 'Obol Squad'], ['Orphie & Magus', 'Obol Squad'], ['Zhu Yuan', 'Special Response Team'], ['Qingyi', 'Special Response Team'], ['Jane Doe', 'Special Response Team'], ['Seth', 'Special Response Team'], ['Lucy', 'Sons of Calydon'], ['Piper', 'Sons of Calydon'], ['Caesar', 'Sons of Calydon'], ['Burnice', 'Sons of Calydon'], ['Lighter', 'Sons of Calydon'], ['Pulchra', 'Sons of Calydon'], ['Soukaku', 'Section 6'], ['Yanagi', 'Section 6'], ['Harumasa', 'Section 6'], ['Miyabi', 'Section 6'], ['Astra Yao', 'Stars of Lyra'], ['Evelyn', 'Stars of Lyra'], ['Soldier 0 Anby', 'Silver Squad'], ['Vivian', 'Mockingbird'], ['Hugo', 'Mockingbird'], ['Pan Yinhu', 'Yunkui Summit'], ['Yixuan', 'Yunkui Summit'], ['Ju Fufu', 'Yunkui Summit'], ['Ye Shunguang', 'Yunkui Summit'], ['Yuzuha', 'Spook Shack'], ['Alice', 'Spook Shack'], ['Manato', 'Spook Shack'], ['Lucia', 'Spook Shack'], ['Yidhari', 'Spook Shack'], ['Dialyn', 'Krampus'], ['Banyue', 'Krampus'], ['Zhao', 'Krampus'], ['Promeia', 'Krampus'], ['Sunna', 'Angels of Delusion'], ['Aria', 'Angels of Delusion'], ['Nangong Yu', 'Angels of Delusion'], ['Cissia', 'Metropolitan Order'], ['Velina', 'External Strategy'], ['Norma', 'External Strategy'], ['Remielle', 'Covenant of Dayat'], ['Sigrid', 'Airspace Patrol'], ['Claret', 'Flint Workshop'], ['Roxy', 'Flint Workshop']]);
const SPECIAL_TAGS = new Map([['Eous', ['Bangboo', 'Phaethon']], ['Amillion', ['Bangboo', 'Cunning Hares']], ['Safety', ['Bangboo', 'Belobog']], ['Butler', ['Bangboo', 'Victoria Housekeeping']], ['Agent Gulliver', ['Bangboo', 'Section 6']], ['Officer Cui', ['Bangboo', 'Special Response Team']], ['Red Moccus', ['Bangboo', 'Sons of Calydon']], ['Belion', ['Bangboo', 'Yunkui Summit']], ['Snap', ['Bangboo', 'Stars of Lyra']], ['Miss Esme', ['Bangboo', 'Spook Shack']], ['Biggest Fan', ['Bangboo', 'Angels of Delusion']], ['Ariel', ['Bangboo']], ['Avocaboo', ['Bangboo']], ['Baddieboo', ['Bangboo']], ['Bagboo', ['Bangboo']], ['Bangvolver', ['Bangboo']], ['Bild N. Boolok', ['Bangboo']], ['Birkblick', ['Bangboo']], ['Boollseye', ['Bangboo']], ['Booltergeist', ['Bangboo']], ['Booressure', ['Bangboo']], ['Brawlerboo', ['Bangboo']], ['Cryboo', ['Bangboo']], ['Devilboo', ['Bangboo']], ['Electroboo', ['Bangboo']], ['Excaliboo', ['Bangboo']], ['Exploreboo', ['Bangboo']], ['Knightboo', ['Bangboo']], ['Luckyboo', ['Bangboo']], ['Magnetiboo', ['Bangboo']], ['Mercury', ['Bangboo']], ['Overtimeboo', ['Bangboo']], ['Paperboo', ['Bangboo']], ['Penguinboo', ['Bangboo']], ['Plugboo', ['Bangboo']], ['Resonaboo', ['Bangboo']], ['Robin', ['Bangboo']], ['Rocketboo', ['Bangboo']], ['Sharkboo', ['Bangboo']], ['Sprout', ['Bangboo']], ['Sumoboo', ['Bangboo']], ['Ultra Jake', ['Bangboo']]]);
const TAG_LABELS_JA={"Character":"キャラクター","Bangboo":"ボンプ","Planned":"予定","WIP":"制作中","Completed":"完成","Project":"プロジェクト","Event":"イベント","Official":"公式","Alliance":"アライアンス","Japan":"日本","Asia":"アジア","Europe":"ヨーロッパ","North America":"北アメリカ","South America":"南アメリカ","Oceania":"オセアニア","Africa":"アフリカ","Phaethon":"パエトーン","Cunning Hares":"邪兎屋","Belobog":"白祇重工","Victoria Housekeeping":"ヴィクトリア家政","Obol Squad":"オボルス小隊","Special Response Team":"特務捜査班","Sons of Calydon":"カリュドーンの子","Section 6":"対ホロウ6課","Stars of Lyra":"スターズ・オブ・リラ","Silver Squad":"防衛軍・シルバー小隊","Mockingbird":"モッキンバード","Yunkui Summit":"雲嶽山","Spook Shack":"怪啖屋","Krampus":"クランプスの黒枝","Angels of Delusion":"妄想エンジェル","Metropolitan Order":"都市秩序部","External Strategy":"外務計策局","Covenant of Dayat":"ダアト結社","Airspace Patrol":"空域巡警局","Flint Workshop":"フリンツ工房","Belle":"リン","Wise":"アキラ","Phoenix":"フィオニー","Severian":"セヴェリアン","The Storyteller":"語り手","Sunbringer":"サンブリンガー","Pyrois":"ピュロイス","Anby":"アンビー","Billy":"ビリー","Nekomata":"猫宮又奈","Nicole":"ニコ","Starlight Billy":"スターライト・ビリー","Anton":"アンドー","Ben":"ベン","Grace":"グレース","Koleda":"クレタ","Rina":"アレクサンドリナ","Corin":"カリン","Ellen":"エレン","Lycaon":"ライカン","Soldier 11":"11号","Trigger":"トリガー","Seed":"シード","Orphie & Magus":"オルペウス＆「鬼火」","Zhu Yuan":"朱鳶","Qingyi":"青衣","Jane Doe":"ジェーン・ドゥ","Seth":"ローウェル","Lucy":"ルーシー","Piper":"パイパー","Caesar":"キング・シーザー","Burnice":"バーニス","Lighter":"ライト","Pulchra":"プルクラ","Soukaku":"蒼角","Yanagi":"月城柳","Harumasa":"浅羽悠真","Miyabi":"星見雅","Astra Yao":"アストラ・ヤオ","Evelyn":"イヴリン","Soldier 0 Anby":"0号・アンビー","Vivian":"ビビアン","Hugo":"ヒューゴ","Pan Yinhu":"潘引壺","Yixuan":"儀玄","Ju Fufu":"橘福福","Ye Shunguang":"葉瞬光","Yuzuha":"浮波柚葉","Manato":"狛野真斗","Lucia":"リュシア","Yidhari":"イドリー","Dialyn":"ダイアリン","Banyue":"盤岳","Zhao":"照","Promeia":"プロメイア","Sunna":"千夏","Aria":"アリア","Nangong Yu":"南宮羽","Cissia":"シーシィア","Velina":"ヴェリーナ","Norma":"ノルムー","Remielle":"レミエール","Sigrid":"シグリッド","Claret":"クラレッタ","Roxy":"ロクシー","Eous":"イアス","Red Moccus":"真紅のモックス","Mercury":"マーキュリー","Robin":"ロビン","Sharkboo":"ガブットボンプ","Butler":"バトラー"};
const tagLabel=tag=>TAG_LABELS_JA[tag]||tag;
const GROUP_LABELS_JA={Subject:'分類',Status:'状態',Type:'種類',Region:'地域',Faction:'陣営',Bangboo:'ボンプ',Character:'キャラクター'};
let selectedPresetTags = new Set();

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
function allEditorTags(){return [...new Set([...selectedPresetTags,...parseTags($('#tags').value)])];}
function renderPresetTags(){$('#preset-tags').innerHTML=Object.entries(TAG_GROUPS).map(([group,tags])=>`<div><div class="preset-group-title">${esc(GROUP_LABELS_JA[group]||group)}</div><div class="preset-buttons">${tags.map(tag=>`<button type="button" class="preset-tag ${selectedPresetTags.has(tag)?'active':''}" data-preset-tag="${esc(tag)}">#${esc(tagLabel(tag))}</button>`).join('')}</div></div>`).join('');const selected=allEditorTags();$('#selected-tags').innerHTML=selected.length?selected.map(tag=>`<button type="button" class="selected-tag" data-remove-tag="${esc(tag)}">#${esc(tagLabel(tag))} ×</button>`).join(''):'<span class="tag-help">タグ未選択</span>';}
function setEditorTags(tags){const presets=new Set(Object.values(TAG_GROUPS).flat());selectedPresetTags=new Set(tags.filter(tag=>presets.has(tag)));$('#tags').value=tags.filter(tag=>!presets.has(tag)).join(', ');renderPresetTags();}
function createItem(parsed,note,tags){return{id:crypto.randomUUID(),...parsed,note:note.trim()||'メモなし',tags:Array.isArray(tags)?[...new Set(tags)]:parseTags(tags)};}
function setStatus(text, error=false) { $('#status').textContent=text; $('#status').style.color=error?'#b42318':'#64748b'; }
function resetEditor(){editingId=null;$('#url').value='';$('#note').value='';selectedPresetTags.clear();$('#tags').value='';$('#editor-title').textContent='地点を追加';$('#save').textContent='追加';$('#cancel').hidden=true;$('#editor-card').classList.remove('edit-mode');renderPresetTags();}
function visibleItems() { const q=$('#search').value.trim().toLowerCase(); return q?items.filter(x=>[x.note,x.url,x.lat,x.lng,...(x.tags||[]),...(x.tags||[]).map(tag=>TAG_LABELS_JA[tag]||tag)].some(v=>String(v).toLowerCase().includes(q))):items; }
function render() {
  const visible=visibleItems();
  $('#list').innerHTML=visible.map(item=>`<div class="item"><div class="item-title">★ ${esc(item.note)}</div><div class="coords">${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}</div>${item.tags?.length?`<div class="tags">${item.tags.map(tag=>`<span class="tag">#${esc(tagLabel(tag))}</span>`).join('')}</div>`:''}<div class="item-actions"><button data-edit="${esc(item.id)}">編集</button><a class="file-button" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Wplace</a><button class="danger" data-delete="${esc(item.id)}">削除</button></div></div>`).join('')||'<div class="empty">地点はまだありません。</div>';
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

$('#preset-tags').onclick=e=>{const tag=e.target.dataset.presetTag;if(!tag)return;if(selectedPresetTags.has(tag)){selectedPresetTags.delete(tag);}else{selectedPresetTags.add(tag);if(CHARACTER_FACTIONS.has(tag)){selectedPresetTags.add('Character');const faction=CHARACTER_FACTIONS.get(tag);if(faction)selectedPresetTags.add(faction);}const special=SPECIAL_TAGS.get(tag);if(special)special.forEach(value=>selectedPresetTags.add(value));}renderPresetTags();};
$('#selected-tags').onclick=e=>{const tag=e.target.dataset.removeTag;if(!tag)return;if(selectedPresetTags.has(tag))selectedPresetTags.delete(tag);else $('#tags').value=parseTags($('#tags').value).filter(v=>v!==tag).join(', ');renderPresetTags();};
$('#tags').addEventListener('input',renderPresetTags);renderPresetTags();
$('#save').onclick=()=>{
  const parsed=parseUrl($('#url').value);if(!parsed)return setStatus('lat と lng を含むWplace共有リンクを入力してください。',true);
  if(editingId){const item=items.find(x=>x.id===editingId);Object.assign(item,parsed,{note:$('#note').value.trim()||'メモなし',tags:allEditorTags()});setStatus('地点を更新しました。');}
  else{items.push(createItem(parsed,$('#note').value,allEditorTags()));setStatus('地点を追加しました。');}
  resetEditor();render();
};
$('#cancel').onclick=resetEditor;
$('#search').oninput=render;
$('#sort').onclick=()=>{items.sort((a,b)=>a.note.localeCompare(b.note,'ja'));render();};
$('#list').onclick=e=>{
  const edit=e.target.dataset.edit,del=e.target.dataset.delete;
  if(edit){const item=items.find(x=>x.id===edit);if(!item)return;editingId=item.id;$('#url').value=item.url;$('#note').value=item.note;setEditorTags(item.tags||[]);$('#editor-title').textContent='地点を編集';$('#save').textContent='更新';$('#cancel').hidden=false;$('#editor-card').classList.add('edit-mode');window.scrollTo({top:0,behavior:'smooth'});}
  if(del&&confirm('この地点を削除しますか？')){items=items.filter(x=>x.id!==del);if(editingId===del)resetEditor();render();}
};
$('#clear').onclick=()=>{if(confirm('すべての地点を削除しますか？')){items=[];resetEditor();render();}};
$('#export').onclick=()=>{const clean=items.map(({id,...item})=>item);const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([JSON.stringify(clean,null,2)],{type:'application/json'}));link.download='locations.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);};
$('#import').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{const text=await file.text();let incoming=[];try{incoming=normalizeJson(JSON.parse(text));}catch{incoming=parseText(text);}if(!incoming.length)throw new Error('有効なWplace地点がありません');const known=new Set(items.map(x=>`${x.lat.toFixed(6)},${x.lng.toFixed(6)}`));let added=0;for(const item of incoming){const key=`${item.lat.toFixed(6)},${item.lng.toFixed(6)}`;if(known.has(key))continue;known.add(key);items.push(item);added++;}render();setStatus(`${added}件を読み込みました。`);}catch(error){setStatus(`読込失敗: ${error.message}`,true);}finally{e.target.value='';}};

(async()=>{try{const response=await fetch(`${import.meta.env.BASE_URL}locations.json`,{cache:'no-store'});if(response.ok){items=normalizeJson(await response.json());render();setStatus(`public/locations.json から ${items.length}件を読み込みました。`);}else render();}catch{render();}})();
