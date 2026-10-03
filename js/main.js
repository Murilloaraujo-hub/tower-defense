import {HEROES} from './heroes.js';
import {MAPS} from './maps.js';
import {ITEMS} from './items.js';
import {ALLIES} from './allies.js';
import {ACHIEVEMENTS} from './achievements.js';
import {loadSave,saveGame,loadSettings,saveSettings,clearSave,xpNeeded} from './save.js';
import {sounds} from './audio.js';

let save=loadSave();
let settings=loadSettings();
const $=s=>document.querySelector(s);
const nf=new Intl.NumberFormat('pt-BR');

function safeSound(name='button'){try{sounds[name]?.()}catch{}}
function openDialog(dialog){if(!dialog)return;try{if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal()}else dialog.setAttribute('open','')}catch{dialog.setAttribute('open','')}}
function closeDialog(dialog){if(!dialog)return;try{if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open')}catch{dialog.removeAttribute('open')}}
function num(value=0){return nf.format(Number(value)||0)}
function duration(total=0){const seconds=Math.max(0,Math.round(total));const hours=Math.floor(seconds/3600);const minutes=Math.floor(seconds%3600/60);return hours?`${hours}h ${String(minutes).padStart(2,'0')}min`:`${minutes}min ${String(seconds%60).padStart(2,'0')}s`}
function dateLabel(value){try{return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(value))}catch{return 'Expedição registrada'}}
function difficultyLabel(key){return({easy:'Fácil',normal:'Normal',hard:'Difícil',extreme:'Extremo'})[key]||'Normal'}

function renderTop(){
  const coins=$('#coinsValue');
  const level=$('#levelValue');
  const accountLevel=$('#accountLevel');
  const xpLabel=$('#xpLabel');
  const xpFill=$('#xpFill');
  const wins=$('#winsStat');
  const bestWave=$('#bestWaveStat');
  const unlocked=$('#unlockedStat');
  const profile=$('#profileNameTop');
  const status=$('#missionStatus');
  const need=xpNeeded(save.level);
  if(coins)coins.textContent=num(save.coins);
  if(level)level.textContent=save.level||1;
  if(accountLevel)accountLevel.textContent=save.level||1;
  if(xpLabel)xpLabel.textContent=`${num(save.xp)} / ${num(need)} XP`;
  if(xpFill)xpFill.style.width=`${Math.min(100,(save.xp||0)/need*100)}%`;
  if(wins)wins.textContent=num(save.stats?.wins);
  if(bestWave)bestWave.textContent=num(save.stats?.bestWave);
  if(unlocked)unlocked.textContent=num(save.unlockedHeroes?.length);
  if(profile)profile.textContent=save.profileName||'Guardião';
  if(status){
    const latest=save.battleHistory?.[0];
    status.textContent=latest?`Última expedição: ${latest.win?'vitória':'defesa interrompida'} na rodada ${latest.wave}.`:'Bastião sincronizado · pronto para defender';
  }
}

function openScreen(type){
  const dialog=$('#screenDialog');
  const title=$('#dialogTitle');
  const eye=$('#dialogEyebrow');
  const content=$('#dialogContent');
  const labels={characters:['PERSONAGENS','Guardiões'],equipment:['EQUIPAMENTOS','Inventário'],allies:['ALIADOS','Companheiros'],maps:['MAPAS','Rotas do Véu'],achievements:['CONQUISTAS','Desafios'],profile:['PERFIL','Conta local'],settings:['CONFIGURAÇÕES','Preferências'],stats:['ESTATÍSTICAS','Central de inteligência']};
  if(!dialog||!title||!eye||!content||!labels[type])return;
  title.textContent=labels[type][0];
  eye.textContent=labels[type][1].toUpperCase();
  content.innerHTML=screenHtml(type);
  bindScreen(type);
  openDialog(dialog);
  safeSound();
}

function screenHtml(type){
  if(type==='characters')return `<div class="content-grid guardian-grid">${HEROES.map(h=>{const unlocked=save.unlockedHeroes.includes(h.id);const equipped=save.equippedHeroes.includes(h.id);return `<article class="content-card guardian-card ${unlocked?'':'locked'}"><div class="card-top"><span class="hero-dot" style="--hero-color:${h.color}"></span><span class="tag">${h.role}</span></div><h3>${h.name}</h3><div class="guardian-numbers"><span><b>${h.damage}</b>Dano</span><span><b>${h.range}</b>Alcance</span><span><b>${h.attackSpeed}s</b>Cadência</span></div><p>${h.ability.name}: ${h.ability.description}</p><small>${unlocked?(equipped?'Escalado para a expedição':'Disponível — equipe-o no seu esquadrão'):'Desbloqueio por progressão de conta'}</small></article>`}).join('')}</div>`;
  if(type==='equipment'){
    const heroOptions=save.unlockedHeroes.map(id=>{const h=HEROES.find(x=>x.id===id);return h?`<option value="${h.id}">${h.name}</option>`:''}).join('');
    return `<div class="content-card equipment-intro"><label>Equipar em<select id="equipmentHeroSelect">${heroOptions}</select></label><p>Limite por guardião: <b>1 arma</b> e até <b>3 acessórios ou artefatos</b>. Os bônus são aplicados automaticamente durante a batalha.</p></div><div class="content-grid">${ITEMS.map(i=>{const owned=save.equipment.includes(i.id);return `<article class="content-card item-card ${owned?'':'locked'}"><span class="tag rarity-${i.rarity}">${i.rarity}</span><h3>${i.name}</h3><p>${i.type} · ${i.effect}</p>${owned?`<button class="secondary-btn equip-item-btn" data-item="${i.id}">Equipar / remover</button>`:'<small>Ainda não obtido em expedições</small>'}</article>`}).join('')}</div>`;
  }
  if(type==='allies')return `<div class="content-grid">${ALLIES.map(a=>{const unlocked=save.level>=a.unlockLevel;const equipped=save.equippedAlly===a.id;return `<article class="content-card ally-card ${unlocked?'':'locked'}"><div class="card-top"><span class="tag">${a.role}</span>${equipped?'<span class="equipped-pill">EM USO</span>':''}</div><h3>${a.name}</h3><p>${a.effect}</p>${unlocked?`<button class="secondary-btn ally-equip-btn" data-ally="${a.id}">${equipped?'Remover aliado':'Equipar aliado'}</button>`:`<small>Desbloqueia no nível ${a.unlockLevel}</small>`}</article>`}).join('')}</div>`;
  if(type==='maps')return `<div class="content-grid map-grid">${MAPS.map(m=>{const unlocked=save.unlockedMaps.includes(m.id);return `<article class="content-card map-card ${unlocked?'':'locked'}" style="--map-bg:${m.bg};--map-accent:${m.accent}"><div class="map-swatch"><i></i><span>✦</span></div><div class="row"><span class="tag">Dificuldade ${m.difficulty}/5</span><span class="difficulty-pips">${'●'.repeat(m.difficulty)}${'○'.repeat(5-m.difficulty)}</span></div><h3>${m.name}</h3><p>${m.description}</p><small>${unlocked?'Disponível para expedição':`Desbloqueia no nível ${m.unlockLevel}`}</small></article>`}).join('')}</div>`;
  if(type==='achievements')return `<div class="content-grid">${ACHIEVEMENTS.map(a=>{const value=a.key==='coins'?save.coins:a.key==='level'?save.level:a.key==='heroesUnlocked'?save.unlockedHeroes.length:(save.stats[a.key]||0);const done=save.achievements.includes(a.id);const percent=Math.min(100,value/a.target*100);return `<article class="content-card achievement-card ${done?'':'locked'}"><div class="row"><span class="tag">${done?'Concluída':'Em progresso'}</span><b>${num(Math.min(value,a.target))}/${num(a.target)}</b></div><h3>${a.name}</h3><p>${a.description}</p><div class="tiny-progress"><i style="width:${percent}%"></i></div></article>`}).join('')}</div>`;
  if(type==='profile')return `<div class="content-card profile-card"><span class="profile-orb">◉</span><label>Nome do perfil<input id="profileNameInput" maxlength="24" value="${escapeHtml(save.profileName)}"></label><p>Seu perfil, conquistas, estatísticas e histórico de expedições ficam salvos somente neste navegador.</p><button class="primary-btn" id="saveProfileBtn">Salvar nome</button></div>`;
  if(type==='settings')return `<div class="content-card settings-card"><div class="setting-row"><span>Volume geral</span><input id="masterSetting" type="range" min="0" max="100" value="${settings.master}"></div><div class="setting-row"><span>Música</span><input id="musicSetting" type="range" min="0" max="100" value="${settings.music}"></div><div class="setting-row"><span>Efeitos</span><input id="sfxSetting" type="range" min="0" max="100" value="${settings.sfx}"></div><div class="setting-row"><span>Partículas</span><input id="particlesSetting" type="checkbox" ${settings.particles?'checked':''}></div><div class="setting-row"><span>Números de dano</span><input id="damageSetting" type="checkbox" ${settings.damageNumbers?'checked':''}></div><div class="setting-row"><span>Qualidade gráfica</span><select id="qualitySetting"><option value="low" ${settings.quality==='low'?'selected':''}>Baixa</option><option value="medium" ${settings.quality==='medium'?'selected':''}>Média</option><option value="high" ${settings.quality==='high'?'selected':''}>Alta</option></select></div><div class="setting-row"><span>Tutorial</span><button class="secondary-btn" id="resetTutorial">Mostrar novamente</button></div><div class="setting-row"><span>Tela cheia</span><button class="secondary-btn" id="fullscreenBtn">Alternar</button></div><div class="setting-row"><span>Apagar progresso</span><button class="danger-btn" id="eraseBtn">Apagar save</button></div></div>`;
  if(type==='stats')return statsHtml();
  return '';
}

function statsHtml(){
  const s=save.stats||{};
  const games=Number(s.gamesPlayed)||0;
  const wins=Number(s.wins)||0;
  const winRate=games?Math.round(wins/games*100):0;
  const avgWave=games?Math.round((Number(s.totalWaves)||0)/games):0;
  const history=(save.battleHistory||[]).slice(0,8);
  const maxWave=Math.max(1,...history.map(h=>Number(h.wave)||0));
  const latest=history[0];
  const metric=(label,value,detail='')=>`<article class="metric-card"><span>${label}</span><b>${value}</b>${detail?`<small>${detail}</small>`:''}</article>`;
  return `<div class="stat-dashboard">
    <section class="stats-hero-card"><div><span class="eyebrow">SINAL DO BASTIÃO</span><h3>${games?`Você comandou ${num(games)} expediç${games===1?'ão':'ões'}.`:'Seu histórico de batalha começa na primeira expedição.'}</h3><p>${latest?`Último relatório: ${latest.win?'vitória':'derrota'} em ${escapeHtml(latest.mapName||'rota desconhecida')}, rodada ${num(latest.wave)}.`:'Jogue uma partida para preencher métricas de desempenho, mapas e guardiões.'}</p></div><div class="win-gauge" style="--gauge:${winRate}%"><b>${winRate}%</b><span>vitórias</span></div></section>
    <section class="metrics-grid">${metric('Expedições',num(games),games?`${num(wins)} vitórias`:'sem registros')}${metric('Maior rodada',num(s.bestWave),'recorde pessoal')}${metric('Dano causado',num(s.damageDealt),'ataques registrados')}${metric('Tempo de defesa',duration(s.timePlayed),'em batalha')}${metric('Média de rodadas',num(avgWave),'por expedição')}${metric('Chefes derrotados',num(s.bossesDefeated),'ameaças de elite')}</section>
    <section class="analytics-board"><div class="analytics-head"><div><span class="eyebrow">DESEMPENHO RECENTE</span><h3>Rodadas por expedição</h3></div><span>${history.length?`${history.length} relatórios mais recentes`:'Aguardando dados'}</span></div>${history.length?`<div class="battle-chart">${[...history].reverse().map((h,index)=>`<div class="chart-column"><b>${num(h.wave)}</b><i style="height:${Math.max(9,Math.round((Number(h.wave)||0)/maxWave*100))}%" class="${h.win?'win':'loss'}"></i><small>${index+1}</small></div>`).join('')}</div>`:`<div class="empty-analytics"><span>⌁</span><p>Os relatórios de expedição aparecerão aqui após o primeiro confronto.</p></div>`}</section>
    <section class="history-panel"><div class="analytics-head"><div><span class="eyebrow">REGISTRO DE EXPEDIÇÕES</span><h3>Relatórios recentes</h3></div><span>${num(s.bestKills)} eliminações no melhor confronto</span></div>${history.length?`<div class="history-list">${history.map(h=>{const hero=HEROES.find(x=>x.id===h.mvp);return `<article class="history-row"><span class="history-result ${h.win?'win':'loss'}">${h.win?'✦':'×'}</span><div><b>${escapeHtml(h.mapName||'Rota desconhecida')}</b><small>${dateLabel(h.date)} · ${difficultyLabel(h.difficulty)} · ${escapeHtml(h.mode||'normal')}</small></div><div class="history-numbers"><span>Rodada <b>${num(h.wave)}</b></span><span>Abates <b>${num(h.kills)}</b></span><span>${hero?`MVP ${hero.name.split(',')[0]}`:`${num(h.damage)} dano`}</span></div></article>`}).join('')}</div>`:`''}</section>
  </div>`;
}

function bindScreen(type){
  if(type==='equipment'){
    const select=$('#equipmentHeroSelect');
    document.querySelectorAll('.equip-item-btn').forEach(btn=>btn.addEventListener('click',()=>{
      if(!select)return;
      const heroId=select.value;
      const item=ITEMS.find(i=>i.id===btn.dataset.item);
      if(!item)return;
      save.equippedEquipment=save.equippedEquipment||{};
      const list=save.equippedEquipment[heroId]||[];
      if(list.includes(item.id))save.equippedEquipment[heroId]=list.filter(x=>x!==item.id);
      else{
        const extras=list.filter(id=>ITEMS.find(x=>x.id===id)?.type!=='Arma');
        if(item.type==='Arma')save.equippedEquipment[heroId]=[...extras,item.id];
        else if(extras.length<3)save.equippedEquipment[heroId]=[...list,item.id];
        else{alert('Esse guardião já possui 3 acessórios ou artefatos.');return}
      }
      saveGame(save);safeSound('upgrade');closeDialog($('#screenDialog'));openScreen('equipment');
    }));
  }
  if(type==='allies')document.querySelectorAll('.ally-equip-btn').forEach(btn=>btn.addEventListener('click',()=>{save.equippedAlly=save.equippedAlly===btn.dataset.ally?null:btn.dataset.ally;saveGame(save);safeSound('upgrade');closeDialog($('#screenDialog'));openScreen('allies')}));
  if(type==='profile')$('#saveProfileBtn')?.addEventListener('click',()=>{save.profileName=$('#profileNameInput')?.value.trim()||'Guardião';saveGame(save);renderTop();safeSound('upgrade')});
  if(type==='settings'){
    const sync=()=>{const master=$('#masterSetting'),music=$('#musicSetting'),sfx=$('#sfxSetting'),particles=$('#particlesSetting'),damage=$('#damageSetting'),quality=$('#qualitySetting');if(master)settings.master=+master.value;if(music)settings.music=+music.value;if(sfx)settings.sfx=+sfx.value;if(particles)settings.particles=particles.checked;if(damage)settings.damageNumbers=damage.checked;if(quality)settings.quality=quality.value;saveSettings(settings)};
    ['masterSetting','musicSetting','sfxSetting','particlesSetting','damageSetting','qualitySetting'].forEach(id=>$('#'+id)?.addEventListener('input',sync));
    $('#resetTutorial')?.addEventListener('click',()=>{save.tutorialDone=false;saveGame(save);safeSound()});
    $('#fullscreenBtn')?.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen?.()}catch{}});
    $('#eraseBtn')?.addEventListener('click',()=>{if(confirm('Apagar todo o progresso local? Esta ação não pode ser desfeita.')){clearSave();location.reload()}});
  }
}

function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function setupPlay(){const select=$('#mapSelect');if(!select)return;select.innerHTML=MAPS.map(m=>`<option value="${m.id}" ${save.unlockedMaps.includes(m.id)?'':'disabled'}>${m.name}${save.unlockedMaps.includes(m.id)?'':` — nível ${m.unlockLevel}`}</option>`).join('');openDialog($('#playDialog'))}
function initMenu(){
  renderTop();
  $('#playBtn')?.addEventListener('click',()=>{setupPlay();safeSound()});
  $('#settingsQuick')?.addEventListener('click',()=>openScreen('settings'));
  document.querySelectorAll('[data-screen]').forEach(button=>button.addEventListener('click',()=>openScreen(button.dataset.screen)));
  $('#closeDialog')?.addEventListener('click',()=>closeDialog($('#screenDialog')));
  $('#closePlay')?.addEventListener('click',()=>closeDialog($('#playDialog')));
  $('#modeSelect')?.addEventListener('change',e=>{const note=$('#challengeNote');if(!note)return;note.textContent=e.target.value==='challenge'?'Desafio atual: apenas 3 guardiões equipados e inimigos 15% mais rápidos.':e.target.value==='endless'?'Modo infinito: as ondas continuam até o bastião cair.':'No modo normal, vença 100 rodadas para completar a expedição.'});
  $('#startGameBtn')?.addEventListener('click',()=>{const map=$('#mapSelect')?.value||'meadow',difficulty=$('#difficultySelect')?.value||'normal',mode=$('#modeSelect')?.value||'normal';location.href=`./game.html?${new URLSearchParams({map,difficulty,mode}).toString()}`});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMenu,{once:true});else initMenu();
