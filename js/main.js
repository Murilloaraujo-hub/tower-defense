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

function safeSound(name='button'){
  try{sounds[name]?.()}catch{}
}

function openDialog(dialog){
  if(!dialog)return;
  try{
    if(typeof dialog.showModal==='function'){
      if(!dialog.open)dialog.showModal();
    }else{
      dialog.setAttribute('open','');
    }
  }catch{
    dialog.setAttribute('open','');
  }
}

function closeDialog(dialog){
  if(!dialog)return;
  try{
    if(typeof dialog.close==='function')dialog.close();
    else dialog.removeAttribute('open');
  }catch{
    dialog.removeAttribute('open');
  }
}

function renderTop(){
  const coins=$('#coinsValue');
  const level=$('#levelValue');
  const accountLevel=$('#accountLevel');
  const xpLabel=$('#xpLabel');
  const xpFill=$('#xpFill');
  const wins=$('#winsStat');
  const bestWave=$('#bestWaveStat');
  const unlocked=$('#unlockedStat');
  const need=xpNeeded(save.level);
  if(coins)coins.textContent=Number(save.coins||0).toLocaleString('pt-BR');
  if(level)level.textContent=save.level||1;
  if(accountLevel)accountLevel.textContent=save.level||1;
  if(xpLabel)xpLabel.textContent=`${save.xp||0} / ${need} XP`;
  if(xpFill)xpFill.style.width=`${Math.min(100,(save.xp||0)/need*100)}%`;
  if(wins)wins.textContent=save.stats?.wins||0;
  if(bestWave)bestWave.textContent=save.stats?.bestWave||0;
  if(unlocked)unlocked.textContent=save.unlockedHeroes?.length||0;
}

function openScreen(type){
  const dialog=$('#screenDialog');
  const title=$('#dialogTitle');
  const eye=$('#dialogEyebrow');
  const content=$('#dialogContent');
  const map={characters:['PERSONAGENS','Guardiões'],equipment:['EQUIPAMENTOS','Inventário'],allies:['ALIADOS','Companheiros'],maps:['MAPAS','Rotas do Véu'],achievements:['CONQUISTAS','Desafios'],profile:['PERFIL','Conta local'],settings:['CONFIGURAÇÕES','Preferências'],stats:['ESTATÍSTICAS','Histórico']};
  if(!dialog||!title||!eye||!content||!map[type])return;
  title.textContent=map[type][0];
  eye.textContent=map[type][1].toUpperCase();
  content.innerHTML=screenHtml(type);
  bindScreen(type);
  openDialog(dialog);
  safeSound();
}

function screenHtml(type){
  if(type==='characters')return `<div class="content-grid">${HEROES.map(h=>`<article class="content-card ${save.unlockedHeroes.includes(h.id)?'':'locked'}"><span class="tag">${h.role}</span><h3>${h.name}</h3><p>Dano ${h.damage} · Alcance ${h.range} · Cadência ${h.attackSpeed}s · Perfuração ${h.pierce}</p><small>${save.unlockedHeroes.includes(h.id)?'Disponível para batalha':'Desbloqueio por progressão de conta'}</small></article>`).join('')}</div>`;
  if(type==='equipment'){
    const heroOptions=save.unlockedHeroes.map(id=>{const h=HEROES.find(x=>x.id===id);return h?`<option value="${id}">${h.name}</option>`:''}).join('');
    return `<div class="content-card" style="margin-bottom:12px"><label>Equipar em<select id="equipmentHeroSelect">${heroOptions}</select></label><p>Limite: 1 arma e até 3 acessórios/artefatos por guardião.</p></div><div class="content-grid">${ITEMS.map(i=>{const owned=save.equipment.includes(i.id);return `<article class="content-card ${owned?'':'locked'}"><span class="tag rarity-${i.rarity}">${i.rarity}</span><h3>${i.name}</h3><p>${i.type} · ${i.effect}</p>${owned?`<button class="secondary-btn equip-item-btn" data-item="${i.id}">Equipar / remover</button>`:'<small>Ainda não obtido</small>'}</article>`}).join('')}</div>`;
  }
  if(type==='allies')return `<div class="content-grid">${ALLIES.map(a=>{const unlocked=save.level>=a.unlockLevel;const equipped=save.equippedAlly===a.id;return `<article class="content-card ${unlocked?'':'locked'}"><span class="tag">${a.role}</span><h3>${a.name}</h3><p>${a.effect}</p>${unlocked?`<button class="secondary-btn ally-equip-btn" data-ally="${a.id}">${equipped?'Remover':'Equipar'}</button>`:`<small>Desbloqueia no nível ${a.unlockLevel}</small>`}</article>`}).join('')}</div>`;
  if(type==='maps')return `<div class="content-grid">${MAPS.map(m=>`<article class="content-card ${save.unlockedMaps.includes(m.id)?'':'locked'}"><span class="tag">Dificuldade ${m.difficulty}/5</span><h3>${m.name}</h3><p>${m.description}</p><small>${save.unlockedMaps.includes(m.id)?'Disponível':`Desbloqueia no nível ${m.unlockLevel}`}</small></article>`).join('')}</div>`;
  if(type==='achievements')return `<div class="content-grid">${ACHIEVEMENTS.map(a=>{const value=a.key==='coins'?save.coins:a.key==='level'?save.level:a.key==='heroesUnlocked'?save.unlockedHeroes.length:(save.stats[a.key]||0);const done=save.achievements.includes(a.id);return `<article class="content-card ${done?'':'locked'}"><div class="row"><span class="tag">${done?'Concluída':'Em progresso'}</span><b>${Math.min(value,a.target)}/${a.target}</b></div><h3>${a.name}</h3><p>${a.description}</p></article>`}).join('')}</div>`;
  if(type==='profile')return `<div class="content-card"><label>Nome do perfil<input id="profileNameInput" maxlength="24" value="${escapeHtml(save.profileName)}"></label><p>O perfil e o progresso ficam salvos apenas neste navegador.</p><button class="primary-btn" id="saveProfileBtn">Salvar nome</button></div>`;
  if(type==='settings')return `<div class="content-card"><div class="setting-row"><span>Volume geral</span><input id="masterSetting" type="range" min="0" max="100" value="${settings.master}"></div><div class="setting-row"><span>Música</span><input id="musicSetting" type="range" min="0" max="100" value="${settings.music}"></div><div class="setting-row"><span>Efeitos</span><input id="sfxSetting" type="range" min="0" max="100" value="${settings.sfx}"></div><div class="setting-row"><span>Partículas</span><input id="particlesSetting" type="checkbox" ${settings.particles?'checked':''}></div><div class="setting-row"><span>Números de dano</span><input id="damageSetting" type="checkbox" ${settings.damageNumbers?'checked':''}></div><div class="setting-row"><span>Qualidade gráfica</span><select id="qualitySetting"><option value="low" ${settings.quality==='low'?'selected':''}>Baixa</option><option value="medium" ${settings.quality==='medium'?'selected':''}>Média</option><option value="high" ${settings.quality==='high'?'selected':''}>Alta</option></select></div><div class="setting-row"><span>Tutorial</span><button class="secondary-btn" id="resetTutorial">Mostrar novamente</button></div><div class="setting-row"><span>Tela cheia</span><button class="secondary-btn" id="fullscreenBtn">Alternar</button></div><div class="setting-row"><span>Apagar progresso</span><button class="danger-btn" id="eraseBtn">Apagar save</button></div></div>`;
  if(type==='stats'){
    const s=save.stats;
    return `<div class="content-grid">${[['Inimigos eliminados',s.kills],['Partidas jogadas',s.gamesPlayed],['Vitórias',s.wins],['Derrotas',s.losses],['Maior rodada',s.bestWave],['Dinheiro gasto',s.moneySpent],['Guardiões colocados',s.towersPlaced],['Habilidades usadas',s.abilitiesUsed],['Chefes derrotados',s.bossesDefeated]].map(([n,v])=>`<article class="content-card"><small>${n}</small><h3>${Number(v).toLocaleString('pt-BR')}</h3></article>`).join('')}</div>`;
  }
  return '';
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
      if(list.includes(item.id)){
        save.equippedEquipment[heroId]=list.filter(x=>x!==item.id);
      }else{
        const extras=list.filter(id=>ITEMS.find(x=>x.id===id)?.type!=='Arma');
        if(item.type==='Arma'){
          save.equippedEquipment[heroId]=[...extras,item.id];
        }else if(extras.length<3){
          save.equippedEquipment[heroId]=[...list,item.id];
        }else{
          alert('Esse guardião já possui 3 acessórios/artefatos.');
          return;
        }
      }
      saveGame(save);
      safeSound('upgrade');
      closeDialog($('#screenDialog'));
      openScreen('equipment');
    }));
  }
  if(type==='allies'){
    document.querySelectorAll('.ally-equip-btn').forEach(btn=>btn.addEventListener('click',()=>{
      save.equippedAlly=save.equippedAlly===btn.dataset.ally?null:btn.dataset.ally;
      saveGame(save);
      safeSound('upgrade');
      closeDialog($('#screenDialog'));
      openScreen('allies');
    }));
  }
  if(type==='profile'){
    $('#saveProfileBtn')?.addEventListener('click',()=>{
      save.profileName=$('#profileNameInput')?.value.trim()||'Guardião';
      saveGame(save);
      safeSound('upgrade');
    });
  }
  if(type==='settings'){
    const sync=()=>{
      const master=$('#masterSetting');
      const music=$('#musicSetting');
      const sfx=$('#sfxSetting');
      const particles=$('#particlesSetting');
      const damage=$('#damageSetting');
      const quality=$('#qualitySetting');
      if(master)settings.master=+master.value;
      if(music)settings.music=+music.value;
      if(sfx)settings.sfx=+sfx.value;
      if(particles)settings.particles=particles.checked;
      if(damage)settings.damageNumbers=damage.checked;
      if(quality)settings.quality=quality.value;
      saveSettings(settings);
    };
    ['masterSetting','musicSetting','sfxSetting','particlesSetting','damageSetting','qualitySetting'].forEach(id=>$('#'+id)?.addEventListener('input',sync));
    $('#resetTutorial')?.addEventListener('click',()=>{save.tutorialDone=false;saveGame(save);safeSound();});
    $('#fullscreenBtn')?.addEventListener('click',async()=>{
      try{
        if(document.fullscreenElement)await document.exitFullscreen();
        else await document.documentElement.requestFullscreen?.();
      }catch{}
    });
    $('#eraseBtn')?.addEventListener('click',()=>{
      if(confirm('Apagar todo o progresso local? Esta ação não pode ser desfeita.')){
        clearSave();
        location.reload();
      }
    });
  }
}

function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':'&quot;'}[c]));}

function setupPlay(){
  const select=$('#mapSelect');
  if(!select)return;
  select.innerHTML=MAPS.map(m=>`<option value="${m.id}" ${save.unlockedMaps.includes(m.id)?'':'disabled'}>${m.name}${save.unlockedMaps.includes(m.id)?'':` — nível ${m.unlockLevel}`}</option>`).join('');
  openDialog($('#playDialog'));
}

function initMenu(){
  renderTop();

  $('#playBtn')?.addEventListener('click',()=>{
    setupPlay();
    safeSound();
  });

  $('#settingsQuick')?.addEventListener('click',()=>openScreen('settings'));

  document.querySelectorAll('[data-screen]').forEach(button=>{
    button.addEventListener('click',()=>openScreen(button.dataset.screen));
  });

  $('#closeDialog')?.addEventListener('click',()=>closeDialog($('#screenDialog')));
  $('#closePlay')?.addEventListener('click',()=>closeDialog($('#playDialog')));

  $('#modeSelect')?.addEventListener('change',e=>{
    const note=$('#challengeNote');
    if(!note)return;
    note.textContent=e.target.value==='challenge'?'Desafio atual: apenas 3 guardiões equipados e inimigos 15% mais rápidos.':e.target.value==='endless'?'Modo infinito: as ondas continuam até o bastião cair.':'No modo normal, vença 100 rodadas para completar a expedição.';
  });

  $('#startGameBtn')?.addEventListener('click',()=>{
    const map=$('#mapSelect')?.value||'meadow';
    const difficulty=$('#difficultySelect')?.value||'normal';
    const mode=$('#modeSelect')?.value||'normal';
    const q=new URLSearchParams({map,difficulty,mode});
    location.href=`./game.html?${q.toString()}`;
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMenu,{once:true});
else initMenu();
