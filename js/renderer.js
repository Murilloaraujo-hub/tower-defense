import {pathPosition} from './engine.js';
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function polygon(ctx,x,y,r,sides,rotation=-Math.PI/2){ctx.beginPath();for(let i=0;i<sides;i++){const a=rotation+i*Math.PI*2/sides,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath()}
function rgba(hex,alpha){const value=hex.replace('#','');const normalized=value.length===3?value.split('').map(c=>c+c).join(''):value;const n=parseInt(normalized,16);return`rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${alpha})`}

export function renderGame(ctx,state){
  const {map,path,enemies,towers,projectiles,particles,placement}=state;
  ctx.clearRect(0,0,1280,720);
  drawTerrain(ctx,map);
  drawPath(ctx,path,map);
  for(const b of map.blocked)drawObstacle(ctx,b,map);
  drawGate(ctx,path.pts[0],map,false);
  drawGate(ctx,path.pts[path.pts.length-1],map,true);
  for(const t of towers)drawTower(ctx,t,state.selectedTower===t);
  if(state.allyId&&towers.length)drawAlly(ctx,state.allyId,towers[0]);
  for(const e of enemies)drawEnemy(ctx,e);
  for(const p of projectiles)drawProjectile(ctx,p);
  for(const p of particles)drawParticle(ctx,p);
  for(const d of (state.damageNumbers||[]))drawDamageNumber(ctx,d);
  if(placement)drawPlacement(ctx,placement,state);
}

function drawTerrain(ctx,map,quality='high'){
  const bg=ctx.createLinearGradient(0,0,1280,720);
  bg.addColorStop(0,map.bg);
  bg.addColorStop(.55,'#142943');
  bg.addColorStop(1,'#0c152b');
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,1280,720);
  const glow=ctx.createRadialGradient(260,80,0,260,80,530);
  glow.addColorStop(0,rgba(map.accent,.18));
  glow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=glow;
  ctx.fillRect(0,0,1280,720);
  ctx.save();
  ctx.globalAlpha=.12;
  ctx.strokeStyle=rgba(map.accent,.38);
  ctx.lineWidth=1;
  for(let x=-720;x<1400;x+=52){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+350,720);ctx.stroke()}
  for(let y=20;y<720;y+=55){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1280,y-165);ctx.stroke()}
  ctx.restore();
  if(map.id==='frost')drawFrostTerrain(ctx,map);
  else if(map.id==='volcano')drawVolcanoTerrain(ctx,map);
  else if(map.id==='ruins')drawRuinsTerrain(ctx,map);
  else if(map.id==='forest')drawForestTerrain(ctx,map);
  else drawMeadowTerrain(ctx,map);
  drawAmbientSpecks(ctx,map);
}

function drawAmbientSpecks(ctx,map){
  ctx.save();
  for(let i=0;i<52;i++){
    const x=(i*229+83)%1280,y=(i*131+19)%720,r=1+(i%4)*.62;
    ctx.fillStyle=i%3===0?rgba(map.accent,.38):'rgba(234,248,255,.17)';
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
function drawMeadowTerrain(ctx,map){
  ctx.save();
  for(let i=0;i<32;i++){
    const x=(i*167+67)%1280,y=(i*283+47)%720,r=10+(i%5)*5;
    ctx.fillStyle=i%2?rgba('#7adf9d',.14):rgba(map.accent,.16);
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=rgba('#b9ffd5',.11);ctx.lineWidth=1;ctx.stroke();
  }
  ctx.restore();
}
function drawForestTerrain(ctx,map){
  ctx.save();
  for(let i=0;i<37;i++){
    const x=(i*151+27)%1280,y=(i*211+79)%720,r=14+(i%4)*5;
    ctx.fillStyle=rgba('#0b2d2a',.35);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=rgba(map.accent,.13);ctx.beginPath();ctx.arc(x-3,y-4,r*.72,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
function drawFrostTerrain(ctx,map){
  ctx.save();
  for(let i=0;i<25;i++){
    const x=(i*191+39)%1280,y=(i*251+31)%720,r=11+(i%4)*5;
    ctx.strokeStyle=rgba('#c8f7ff',.15);ctx.lineWidth=2;polygon(ctx,x,y,r,6,Math.PI/6);ctx.stroke();
  }
  ctx.restore();
}
function drawVolcanoTerrain(ctx,map){
  ctx.save();ctx.strokeStyle='rgba(255,134,83,.22)';ctx.lineWidth=2;
  for(let i=0;i<20;i++){
    const x=(i*197+41)%1280,y=(i*137+79)%720;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+16,y+11);ctx.lineTo(x+28,y+4);ctx.lineTo(x+45,y+19);ctx.stroke();
  }
  ctx.restore();
}
function drawRuinsTerrain(ctx,map){
  ctx.save();
  for(let i=0;i<28;i++){
    const x=(i*223+57)%1280,y=(i*157+39)%720,s=6+(i%5)*3;
    ctx.save();ctx.translate(x,y);ctx.rotate(i*.57);ctx.fillStyle=rgba('#d2b8ff',.1);ctx.fillRect(-s,-s,s*2,s*2);ctx.restore();
  }
  ctx.restore();
}

function drawPath(ctx,path,map){
  const trace=()=>{ctx.beginPath();path.pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y))};
  ctx.save();
  ctx.lineCap='round';ctx.lineJoin='round';
  ctx.shadowColor='rgba(1,6,15,.64)';ctx.shadowBlur=22;ctx.strokeStyle='rgba(3,12,25,.72)';ctx.lineWidth=76;trace();ctx.stroke();
  ctx.shadowBlur=0;ctx.strokeStyle=rgba(map.accent,.24);ctx.lineWidth=64;trace();ctx.stroke();
  const core=ctx.createLinearGradient(0,0,1280,720);core.addColorStop(0,'#c4a76c');core.addColorStop(.5,'#ead49b');core.addColorStop(1,'#ac8a58');ctx.strokeStyle=core;ctx.lineWidth=50;trace();ctx.stroke();
  ctx.strokeStyle='rgba(255,250,219,.34)';ctx.lineWidth=2;trace();ctx.stroke();
  ctx.setLineDash([5,14]);ctx.lineDashOffset=-performance.now()*.015;ctx.strokeStyle='rgba(255,255,255,.33)';ctx.lineWidth=2;trace();ctx.stroke();ctx.setLineDash([]);
  for(let d=110;d<path.total-65;d+=116){
    const p=pathPosition(path,d),q=pathPosition(path,d+5),a=Math.atan2(q.y-p.y,q.x-p.x);
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);ctx.fillStyle='rgba(112,77,45,.25)';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-5,-4);ctx.lineTo(-2,0);ctx.lineTo(-5,4);ctx.closePath();ctx.fill();ctx.restore();
  }
  ctx.restore();
}

function drawObstacle(ctx,b,map){
  const x=b.x*1280,y=b.y*720,r=b.r*720;
  ctx.save();ctx.translate(x,y);ctx.shadowColor=rgba(map.accent,.3);ctx.shadowBlur=18;
  ctx.fillStyle='rgba(7,18,34,.64)';ctx.beginPath();ctx.arc(0,0,r+7,0,Math.PI*2);ctx.fill();
  const stone=ctx.createRadialGradient(-r*.25,-r*.3,2,0,0,r);stone.addColorStop(0,rgba(map.accent,.65));stone.addColorStop(.48,'#233954');stone.addColorStop(1,'#0c172c');ctx.fillStyle=stone;polygon(ctx,0,0,r,7,Math.PI/7);ctx.fill();
  ctx.shadowBlur=0;ctx.strokeStyle=rgba('#e6f8ff',.34);ctx.lineWidth=1.5;ctx.stroke();
  ctx.strokeStyle=rgba(map.accent,.58);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.4,-r*.1);ctx.lineTo(0,-r*.45);ctx.lineTo(r*.32,-r*.1);ctx.stroke();
  ctx.restore();
}

function drawGate(ctx,p,map,exit){
  const pulse=.75+Math.sin(performance.now()*.003+(exit?2:0))*.14;
  ctx.save();ctx.translate(p.x,p.y);ctx.shadowColor=exit?'#ff7b9b':map.accent;ctx.shadowBlur=26*pulse;
  ctx.strokeStyle=exit?'rgba(255,125,151,.8)':rgba(map.accent,.85);ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,21*pulse,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle=exit?'rgba(255,108,141,.22)':rgba(map.accent,.22);ctx.beginPath();ctx.arc(0,0,15*pulse,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f0fbff';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(exit?'⌂':'✦',0,1);ctx.restore();
}

function drawAlly(ctx,id,tower){
  const a=performance.now()*.0018;
  const x=tower.x+Math.cos(a)*36,y=tower.y+Math.sin(a)*24;
  const colors={drake:'#ffb46b',spirit:'#9deaff',scout:'#8ff0a8',mender:'#ffb6ed',bot:'#ffd873'};
  ctx.save();ctx.shadowColor=colors[id]||'#fff';ctx.shadowBlur=13;ctx.fillStyle=colors[id]||'#fff';ctx.translate(x,y);ctx.rotate(a);polygon(ctx,0,0,8,4,Math.PI/4);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,2,0,Math.PI*2);ctx.fill();ctx.restore();
}

function drawEnemy(ctx,e){
  if(e.dead)return;
  const hurt=Math.max(0,Math.min(1,e.hp/e.maxHp));
  const status=e.statuses||{};
  ctx.save();
  if(e.invisible)ctx.globalAlpha=.58;
  if(status.freeze)ctx.shadowColor='#baf5ff';else if(status.burn)ctx.shadowColor='#ff985f';else ctx.shadowColor=e.color;
  ctx.shadowBlur=e.boss?24:11;
  const scale=e.boss?1.13:1;
  ctx.translate(e.x,e.y);
  ctx.rotate(performance.now()*.00055*(e.boss?1:-.45));
  const sides=e.boss?8:e.type==='swarm'?3:6;
  const enemyGrad=ctx.createRadialGradient(-e.radius*.3,-e.radius*.4,1,0,0,e.radius*1.25);enemyGrad.addColorStop(0,'#fff');enemyGrad.addColorStop(.12,e.color);enemyGrad.addColorStop(1,rgba(e.color,.55));ctx.fillStyle=enemyGrad;polygon(ctx,0,0,e.radius*scale,sides);ctx.fill();
  ctx.shadowBlur=0;ctx.strokeStyle=rgba('#071221',.65);ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='rgba(11,17,35,.7)';ctx.beginPath();ctx.arc(-e.radius*.2,-e.radius*.13,Math.max(2,e.radius*.18),0,Math.PI*2);ctx.fill();
  if(e.boss){ctx.strokeStyle='rgba(255,236,185,.82)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,e.radius*1.25,0,Math.PI*2);ctx.stroke()}
  ctx.restore();
  if(status.slow||status.freeze||status.burn||status.poison){ctx.save();ctx.strokeStyle=status.freeze?'#baf5ff':status.burn?'#ff9a65':status.poison?'#91e98f':'#8bdbff';ctx.globalAlpha=.76;ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(e.x,e.y,e.radius+5,0,Math.PI*2);ctx.stroke();ctx.restore()}
  if(e.boss||hurt<.98){
    const w=Math.max(28,e.radius*2.5),y=e.y-e.radius-14;
    ctx.save();ctx.fillStyle='rgba(5,10,25,.72)';roundRect(ctx,e.x-w/2,y,w,6,3);ctx.fill();ctx.fillStyle=hurt>.5?'#78ebb0':'#ff788e';roundRect(ctx,e.x-w/2,y,w*hurt,6,3);ctx.fill();ctx.restore();
  }
}

function drawTower(ctx,t,selected){
  const now=performance.now();
  const abilityReady=t.level>=4&&now>=t.abilityReady;
  ctx.save();
  if(selected){
    const range=t.range*((t.colossalUntil||0)>now?2:1);
    const aura=ctx.createRadialGradient(t.x,t.y,0,t.x,t.y,range);aura.addColorStop(0,rgba(t.color,.13));aura.addColorStop(.78,rgba(t.color,.045));aura.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=aura;ctx.beginPath();ctx.arc(t.x,t.y,range,0,Math.PI*2);ctx.fill();ctx.strokeStyle=rgba(t.color,.58);ctx.lineWidth=2;ctx.setLineDash([7,7]);ctx.beginPath();ctx.arc(t.x,t.y,range,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
    if(t.currentTarget){ctx.strokeStyle=rgba(t.color,.35);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(t.x,t.y);ctx.lineTo(t.currentTarget.x,t.currentTarget.y);ctx.stroke()}
  }
  ctx.translate(t.x,t.y);
  ctx.shadowColor=t.color;ctx.shadowBlur=abilityReady?22:13;
  ctx.fillStyle='rgba(6,14,31,.92)';ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.strokeStyle=rgba(t.color,.8);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,21,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle=rgba(t.color,.9);ctx.beginPath();ctx.arc(0,0,16,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.23)';ctx.beginPath();ctx.arc(-5,-6,6,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='bold 15px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(towerGlyph(t),0,1);
  if(abilityReady){ctx.strokeStyle='rgba(255,241,172,.92)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,29+Math.sin(now*.006)*2,0,Math.PI*2);ctx.stroke()}
  if(t.songUntil>now||t.overchargeUntil>now||t.colossalUntil>now){ctx.strokeStyle=t.colossalUntil>now?'#83d6c2':'#f4b2ff';ctx.globalAlpha=.76;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,32,0,Math.PI*2);ctx.stroke()}
  ctx.restore();
}
function towerGlyph(t){return({melee:'✦',arrow:'➶',ice:'❄',arcane:'◈',gear:'⚙',blade:'✧',shockwave:'⬟',spark:'♪'})[t.attack]||'✦'}

function drawProjectile(ctx,p){
  ctx.save();ctx.strokeStyle=rgba(p.color,.35);ctx.lineWidth=Math.max(1,p.radius*.75);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p.x-p.vx*.035,p.y-p.vy*.035);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.shadowColor=p.color;ctx.shadowBlur=13;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.82)';ctx.beginPath();ctx.arc(p.x-p.radius*.25,p.y-p.radius*.25,Math.max(1,p.radius*.36),0,Math.PI*2);ctx.fill();ctx.restore();
}
function drawParticle(ctx,p){ctx.save();ctx.globalAlpha=Math.max(0,p.life/p.maxLife);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();ctx.restore()}
function drawDamageNumber(ctx,d){ctx.save();ctx.globalAlpha=Math.max(0,d.life/d.maxLife);ctx.shadowColor='#081124';ctx.shadowBlur=4;ctx.fillStyle=d.color||'#fff';ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.fillText(Math.round(d.value),d.x,d.y);ctx.restore()}
function drawPlacement(ctx,p,state){
  ctx.save();const valid=p.valid;const pulse=1+Math.sin(performance.now()*.008)*.025;ctx.fillStyle=valid?rgba('#73e6a8',.1):rgba('#ff758d',.1);ctx.strokeStyle=valid?'#73e6a8':'#ff758d';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(p.x,p.y,p.hero.range*pulse,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);ctx.shadowColor=valid?p.hero.color:'#ff758d';ctx.shadowBlur=15;ctx.fillStyle=valid?p.hero.color:'#ff758d';ctx.beginPath();ctx.arc(p.x,p.y,19,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(towerGlyph(p.hero),p.x,p.y+1);ctx.font='bold 14px system-ui';ctx.fillText(`◇ ${p.hero.cost}`,p.x,p.y-32);ctx.restore();
}
export function renderPreview(ctx,map,path){renderGame(ctx,{map,path,enemies:[],towers:[],projectiles:[],particles:[],placement:null,selectedTower:null})}
